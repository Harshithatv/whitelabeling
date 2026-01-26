import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard";
import { ClientController } from "./client.controller";

@Module({
  providers: [AuthService, AuthGuard],
  controllers: [AuthController, ClientController],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}