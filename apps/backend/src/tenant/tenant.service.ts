import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class TenantService {
  private prisma = new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL },
    },
  });

  async getTenantByHost(hostname: string) {
    const domain = await this.prisma.domain.findUnique({
      where: { hostname },
      include: { tenant: { include: { branding: true } } },
    });
    if (domain?.tenant) return domain.tenant;

    if (hostname.includes(":")) {
      const hostWithoutPort = hostname.split(":")[0];
      const fallback = await this.prisma.domain.findUnique({
        where: { hostname: hostWithoutPort },
        include: { tenant: { include: { branding: true } } },
    });
      return fallback?.tenant ?? null;
    }

    return null;
  }

  async createTenant(data: any) {
    if (!data.domain) {
      throw new BadRequestException("Domain is required");
    }
    const existingDomain = await this.prisma.domain.findUnique({
      where: { hostname: data.domain },
    });
    if (existingDomain) {
      throw new BadRequestException("Domain already exists");
    }
    return this.prisma.tenant.create({
      data: {
        name: data.name,
        branding: {
          create: {
            logoUrl: data.branding?.logoUrl,
            primaryColor: data.branding?.primaryColor,
            supportEmail: data.branding?.supportEmail,
            appName: data.branding?.appName,
          },
        },
        domains: { create: { hostname: data.domain, verifiedAt: new Date() } },
      },
    });
  }

  async addDomain(tenantId: string, hostname: string) {
    return this.prisma.domain.create({ data: { tenantId, hostname } });
  }

  async verifyDomain(hostname: string) {
    return this.prisma.domain.update({
      where: { hostname },
      data: { verifiedAt: new Date() },
    });
  }

  async isDomainAllowed(hostname: string) {
    const domain = await this.prisma.domain.findUnique({ where: { hostname } });
    return !!domain;
  }

  async updateTenantLogo(tenantId: string, logoUrl: string) {
    return this.prisma.branding.upsert({
      where: { tenantId },
      update: { logoUrl },
      create: { tenantId, logoUrl },
    });
  }

  async listTenants() {
    return this.prisma.tenant.findMany({
      include: {
        domains: true,
        branding: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}