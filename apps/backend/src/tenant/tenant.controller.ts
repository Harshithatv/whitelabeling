import { Body, Controller, Get, Post, Query, Req, UseGuards, UploadedFile, UseInterceptors } from "@nestjs/common";
import { TenantService } from "./tenant.service";
import { AuthGuard } from "../auth/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

@Controller()
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @UseGuards(AuthGuard)
  @Post("admin/tenants")
  async createTenant(@Body() body: any) {
    return this.tenantService.createTenant(body);
  }

  @UseGuards(AuthGuard)
  @Get("admin/tenants")
  async listTenants() {
    return this.tenantService.listTenants();
  }

  @UseGuards(AuthGuard)
  @Post("admin/domains")
  async addDomain(@Body() body: { tenantId: string; hostname: string }) {
    return this.tenantService.addDomain(body.tenantId, body.hostname);
  }

  @UseGuards(AuthGuard)
  @Post("admin/domains/verify")
  async verifyDomain(@Body() body: { hostname: string }) {
    return this.tenantService.verifyDomain(body.hostname);
  }

  @UseGuards(AuthGuard)
  @Post("admin/tenants/logo")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadDir = join(process.cwd(), "uploads", "logos");
          if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true });
          }
          cb(null, uploadDir);
        },
        filename: (_req, file, cb) => {
          const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
          cb(null, `${Date.now()}-${safeName}`);
        },
      }),
    })
  )
  async uploadTenantLogo(@Query("tenantId") tenantId: string, @UploadedFile() file?: Express.Multer.File) {
    if (!file) return { ok: false };
    const publicUrl = `/uploads/logos/${file.filename}`;
    return this.tenantService.updateTenantLogo(tenantId, publicUrl);
  }

  @Get("public/tenant")
  async getTenantByHost(@Req() req: any, @Query("host") host?: string) {
    const hostname = host || req.headers.host;
    return this.tenantService.getTenantByHost(hostname);
  }

  // Caddy On-Demand TLS validation
  @Get("domains/validate")
  async validateDomain(@Query("domain") domain: string, @Query("token") token?: string) {
    if (token !== process.env.DOMAIN_VALIDATION_TOKEN) {
      return { allowed: false };
    }
    const allowed = await this.tenantService.isDomainAllowed(domain);
    return { allowed };
  }
}