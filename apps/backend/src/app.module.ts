import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from "./auth/auth.module";
import { TenantModule } from "./tenant/tenant.module";

@Module({
  imports: [AuthModule, TenantModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
