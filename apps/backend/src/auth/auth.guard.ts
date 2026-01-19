import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const auth = req.headers.authorization || "";
    const token = auth.replace("Bearer ", "");
    if (!token) throw new UnauthorizedException();

    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET!);
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}