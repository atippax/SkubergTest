import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity("transaction")
export class TransactionEntity {
  @PrimaryColumn()
  transactionId: string;

  @Column()
  userId: string;

  @Column()
  type: "DEPOSIT" | "WITHDRAW" | "TRANSFER";

  @Column("float")
  price: number;

  @Column({ type: "datetime" })
  createdAt: Date;

  @Column({ default: null })
  tradingId: string;
}
