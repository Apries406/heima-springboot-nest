import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import {JwtService} from '@nestjs/jwt'

interface JwtUserData {
  id: number;
  username: string;
  password: string;
}

declare module 'express' {
  interface Request {
    user: JwtUserData
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;
  
  @Inject()
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getClass(),
      context.getHandler(),
    ])

    // 如果不需要登录，直接放行
    if (!requireLogin) 
      return true

    const token = request.headers.authorization

    if(!token)
      throw new UnauthorizedException('登陆后才可访问')

    try {
      const data = this.jwtService.verify<JwtUserData>(token)

      request.user = {
        id: data.id,
        username: data.username,
      }

      return true
    } catch(err){
      throw new UnauthorizedException('验证信息过期，请重新登陆')
    }
  }
}
