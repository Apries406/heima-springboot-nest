import { IsEmpty, IsNotEmpty } from "class-validator";

export class RegisterUserDto {
  @IsNotEmpty({
    message: "用户名不能为空"
  })
  username: string;


  @IsNotEmpty({
    message: "密码不能为空"
  })
  password: string;


  @IsNotEmpty({
    message: "昵称不能为空"
  })
  nickname: string;

  
  @IsNotEmpty({
    message: "邮箱不能为空"
  })
  email: string;
}