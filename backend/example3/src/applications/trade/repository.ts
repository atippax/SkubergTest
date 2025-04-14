import { DataSource } from "typeorm";
import { TradingEntity } from "../../entities/trade.entity";
import { generateUUID } from "../../utils/uuid";
export interface Trading {
  side: string;
  price: number;
  amount: number;
  symbol: string;
}
function tradingSystemRepository(dataSource: DataSource) {
  const repository = dataSource.getRepository(TradingEntity);
  return {
    createTrading: async ({
      ownerId,
      trading,
    }: {
      ownerId: string;
      trading: Trading;
    }) => {
      const result = await repository.save({
        createdAt: new Date(),
        ownerId: ownerId,
        price: trading.price,
        quantity: trading.amount,
        status: "PENDING",
        symbol: trading.symbol,
        tradingId: generateUUID(),
        side: trading.side,
      });
      return result;
    },
    findByCondition: async (condition: Partial<TradingEntity>) => {
      const result = await repository.findOne({
        where: condition,
      });
      return result;
    },
    findAll: async () => {
      const result = await repository.find();
      return result;
    },
    updateTrading: async ({
      tradingId,
      updateData,
    }: {
      tradingId: string;
      updateData: Partial<TradingEntity>;
    }) => {
      await repository.update({ tradingId }, updateData);
      return await repository.findOne({ where: { tradingId } });
    },

    deleteTrading: async (tradingId: string) => {
      return await repository.delete({ tradingId });
    },

    findManyByCondition: async (condition: Partial<TradingEntity>) => {
      return await repository.find({ where: condition });
    },

    countByCondition: async (condition: Partial<TradingEntity>) => {
      return await repository.count({ where: condition });
    },
  };
}
export type TradingSystemRepository = ReturnType<
  typeof tradingSystemRepository
>;
export default tradingSystemRepository;
