import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { md5 } from 'src/utils/md5';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserVo } from './vo/login-user.vo';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger();
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  @Inject()
  private readonly jwtService: JwtService;
  constructor() {}
  decodeToken(key: string, token: string) {
    return this.jwtService.decode(token)[key]
  }

  async findUserFromToken(token: string) {
    const userId = this.decodeToken('id', token)
    const user = await this.userRepository.findOne({
      where: {
        id: userId
      }
    })
    return user
  }

  async findUserByUsername(username: string): Promise<User | undefined | null> {
    const user = await this.userRepository.findOne({
      where: {
        username,
      }
    })

    return user;
  }
  async register(registerUser: RegisterUserDto) {
    const { username, password, nickname, email } = registerUser;
    if(await this.findUserByUsername(username)) {
      return {
        code: 400,
        success: false,
        message: '用户名已存在'
      }
    }

    const user = new User();
    user.username = username;
    user.password = md5(password);
    user.nickname = nickname
    user.email = email
    user.avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
    user.created_time = new Date()
    user.updated_time = new Date()

    
    try {
      await this.userRepository.save(user);
      return {
        code: 200,
        success: true,
        message: '注册成功'
      }
    } catch (err) {
      this.logger.error(err);
      throw new HttpException('注册失败', 500);
    }
  }

  async login(loginUser: LoginUserDto) {
    const { username, password } = loginUser;
    const user = await this.findUserByUsername(username);
    if (!user) {
      throw new HttpException('用户不存在', 404);
    }

    if (user.password !== md5(password)) {
      throw new HttpException('密码错误', 401);
    }
    const accessToken = this.jwtService.sign({
        id: user.id,
        username: user.username,
      }, {
        expiresIn: '1h'
      })
    
    const refreshToken = this.jwtService.sign({
        id: user.id,
      }, {
        expiresIn: '30d'
      })

    const vo = new LoginUserVo(
      user,
      accessToken,
      refreshToken
    )

    return {
      code: 200,
      success: true,
      message: '登录成功',
      data: vo
    }
  }

  async getUserInfo(token: string) {
    const decoded = this.jwtService.decode(token)
    console.log(decoded)
    const userId = decoded['id']
    const user = await this.userRepository.findOne({
      where: {
        id: userId
      }
    })

    return user
  }

  async updateUserInfo(updateUser: UpdateUserDto, token: string) {
    const id = this.decodeToken('id', token)
    const user = await this.userRepository.findOne({
      where: {
        id
      }
    })
    if (!user) {
      throw new HttpException('用户不存在', 404);
    }
    const { nickname, avatar } = updateUser
    user.nickname = nickname
    user.avatar = avatar
    user.updated_time = new Date()
    try {
      await this.userRepository.save(user)
      return {
        code: 200,
        success: true,
        message: '更新成功'
      }
    } catch (err) {
      this.logger.error(err);
      throw new HttpException('更新失败', 500);
    }
  }

  async updateUserAvatar(updatedUrl: string, token: string) {
    const user = await this.findUserFromToken( token)

    if (!user) {
      throw new HttpException('用户不存在', 404);
    }
    
    user.avatar = updatedUrl
    user.updated_time = new Date()
    try {
      await this.userRepository.save(user)
      return {
        code: 200,
        success: true,
        message: '更新成功'
      }
    } catch (err) {
      this.logger.error(err);
      throw new HttpException('更新失败', 500);
    }
  }

  async updateUserPassword(updatePwdDto: UpdatePasswordDto, token: string) {
    const user = await this.findUserFromToken( token)
    if(!user) {
      throw new HttpException('用户不存在', 404);
    }
    const { oldPassword, newPassword, confirmPassword } = updatePwdDto
    
    if(user.password !== md5(oldPassword)) {
      throw new HttpException('旧密码错误', 401);
    }

    if(newPassword !== confirmPassword) {
      throw new HttpException('两次密码不一致', 401);
    }
    
    if(newPassword === oldPassword) {
      throw new HttpException('新密码不能与旧密码相同', 401);
    }

    user.password = md5(newPassword)
    user.updated_time = new Date()
    try {
      await this.userRepository.save(user)
      return {
        code: 200,
        success: true,
        message: '更新成功'
      }
    } catch (err) {
      this.logger.error(err);
      throw new HttpException('更新失败', 500);
    }
  }
}

