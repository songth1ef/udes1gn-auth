import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { RoutesModule } from './routes/routes.module';
import { DatabaseModule } from './database.module';
import { OperationsModule } from './operations/operations.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    RolesModule,
    RoutesModule,
    OperationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
