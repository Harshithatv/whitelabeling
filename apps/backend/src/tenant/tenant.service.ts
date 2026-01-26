import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

@Injectable()
export class TenantService {
  private prisma = new PrismaClient();

  async getTenantByHost(hostname: string) {
    const rawHost = hostname.split(":")[0];
    const domain = await this.prisma.domain.findUnique({
      where: { hostname: rawHost },
      include: { tenant: { include: { branding: true } } },
    });
    if (domain?.tenant) return domain.tenant;

    const baseDomain = process.env.CLIENT_BASE_DOMAIN;
    if (baseDomain && rawHost.endsWith(baseDomain)) {
      const slug = rawHost.replace(`.${baseDomain}`, "");
      if (slug && slug !== rawHost) {
        const client = await this.prisma.tenant.findUnique({
          where: { slug },
          include: { branding: true },
        });
        return client ?? null;
      }
    }

    return null;
  }

  async createTenant(data: any) {
    const slug = this.toSlug(data.slug || data.name);
    if (!slug) {
      throw new BadRequestException("Client name or slug is required");
    }
    const existingSlug = await this.prisma.tenant.findUnique({ where: { slug } });
    if (existingSlug) {
      throw new BadRequestException("Client slug already exists");
    }
    if (data.domain) {
      const existingDomain = await this.prisma.domain.findUnique({
        where: { hostname: data.domain },
      });
      if (existingDomain) {
        throw new BadRequestException("Domain already exists");
      }
    }

    if (!data.client?.email || !data.client?.password) {
      throw new BadRequestException("Client email and password are required");
    }
    const existingClient = await this.prisma.clientUser.findUnique({
      where: { email: data.client.email },
    });
    if (existingClient) {
      throw new BadRequestException("Client email already exists");
    }

    const clientPassword = await bcrypt.hash(data.client.password, 10);

    return this.prisma.tenant.create({
      data: {
        name: data.name,
        slug,
        clientUser: {
          create: {
            email: data.client.email,
            password: clientPassword,
          },
        },
        branding: {
          create: {
            logoUrl: data.branding?.logoUrl,
            primaryColor: data.branding?.primaryColor,
            supportEmail: data.branding?.supportEmail,
            appName: data.branding?.appName,
          },
        },
        domains: data.domain
          ? { create: { hostname: data.domain, verifiedAt: new Date() } }
          : undefined,
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
        clientUser: {
          select: {
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  private toSlug(value?: string) {
    if (!value) return "";
    return value
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
}