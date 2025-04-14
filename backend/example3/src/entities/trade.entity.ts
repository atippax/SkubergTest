import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("trading")
export class TradingEntity {
  @PrimaryColumn()
  tradingId: string;

  @Column()
  status: "PENDING" | "FILLED" | "CANCELED" | "SUCCESS" | "COMFIRM";

  @Column()
  symbol: string;

  @Column()
  side: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  createdAt: Date;

  @Column()
  ownerId: string;

  @Column({ nullable: true })
  clientId: string;
}
