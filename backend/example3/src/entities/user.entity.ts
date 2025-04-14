import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  userId: string;

  @Column({ type: "varchar" })
  username: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar" })
  password: string;

  @Column({ type: "varchar" })
  lastname: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  info: string;

  @Column()
  walletName: string;

  @Column({ default: 0 })
  balance: number;
}
