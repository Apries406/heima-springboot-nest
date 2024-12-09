import { LoginUserDto } from "../dto/login-user.dto";

export class LoginUserVo {
  user: LoginUserDto
  accessToken: string
  refreshToken: string

  constructor(user: LoginUserDto, accessToken: string, refreshToken: string){
    this.user = user
    this.accessToken = accessToken
    this.refreshToken = refreshToken
  }
}