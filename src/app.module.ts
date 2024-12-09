import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './guard/login/login.guard';

@Module({
  imports: [UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Cxhzs067311.',
      database: 'heima',
      synchronize: true,
      entities: [User],
      logging: true,
      connectorPackage: 'mysql2'
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory() {
        return {
          secret: 'chenxinhaozuishuai',
          signOptions: { expiresIn: '1h' },
        }
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: LoginGuard
  }],
})
export class AppModule {}
