import { DataSource } from "typeorm";
import { generateUUID } from "../../utils/uuid";
import { TransactionEntity } from "../../entities";
export interface Transaction {
  type: "DEPOSIT" | "WITHDRAW" | "TRANSFER";
  price: number;
  tradingId: string;
}
function transactionSystemRepository(dataSource: DataSource) {
  const repository = dataSource.getRepository(TransactionEntity);
  return {
    createTransaction: async ({
      ownerId,
      transaction,
    }: {
      ownerId: string;
      transaction: Transaction;
    }) => {
      const result = await repository.save({
        createdAt: new Date(),
        transactionId: generateUUID(),
        price: transaction.price,
        tradingId: transaction.tradingId,
        type: transaction.type,
        userId: ownerId,
      });
      return result;
    },
    findByCondition: async (condition: Partial<TransactionEntity>) => {
      const result = await repository.findOne({
        where: condition,
      });
      return result;
    },
    findAll: async () => {
      const result = await repository.find();
      return result;
    },
    updateTransaction: async ({
      transactionId,
      updateData,
    }: {
      transactionId: string;
      updateData: Partial<TransactionEntity>;
    }) => {
      await repository.update({ transactionId }, updateData);
      return await repository.findOne({ where: { transactionId } });
    },

    deleteTransaction: async (transactionId: string) => {
      return await repository.delete({ transactionId });
    },

    findManyByCondition: async (condition: Partial<TransactionEntity>) => {
      return await repository.find({ where: condition });
    },

    countByCondition: async (condition: Partial<TransactionEntity>) => {
      return await repository.count({ where: condition });
    },
  };
}
export type TransactionSystemRepository = ReturnType<
  typeof transactionSystemRepository
>;
export default transactionSystemRepository;
