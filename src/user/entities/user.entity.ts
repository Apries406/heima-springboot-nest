import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: "users"
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: "用户名"
  })
  username: string;

  @Column({
    length: 50,
    comment: "密码"
  })
  password: string;

  @Column({
    length: 50,
    comment: "昵称"
  })
  nickname: string;

  @Column({
    length: 50,
    comment: "邮箱"
  })
  email: string;

  @Column({
    comment: "头像"
  })
  avatar: string;
  
  @Column({
    comment: "创建时间"
  })
  created_time: Date;

  @Column({
    comment: "更新时间"
  })
  updated_time: Date;
}