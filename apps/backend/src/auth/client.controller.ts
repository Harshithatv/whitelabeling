import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";

@Controller("client")
export class ClientController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(@Body() body: { email: string; password: string }) {
    return this.authService.loginClient(body.email, body.password);
  }

  @UseGuards(AuthGuard)
  @Get("me")
  async me(@Req() req: any) {
    if (req.user?.role !== "CLIENT") {
      throw new UnauthorizedException("Invalid token");
    }
    return this.authService.getClientProfile(req.user.sub);
  }
}
