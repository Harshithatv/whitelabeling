import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthService {
  private prisma = new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL },
    },
  });

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException("Invalid credentials");

    const token = jwt.sign(
      { sub: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return { token };
  }
}