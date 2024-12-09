export interface IUser {
  id: number; // 主键ID
  username: string; // 用户名
  password: string; // 密码
  nickname: string; // 昵称
  email: string; // 邮箱
  avatar: string; // 头像地址
  create_time: string; // 创建时间
  update_time: string; // 更新时间
}