import { TransactionEntity } from "../../entities";
import { UserSystemService } from "../user/service";
import { TransactionSystemRepository } from "./repository";
export interface transaction {
  type: "DEPOSIT" | "WITHDRAW" | "TRANSFER";
  price: number;
  tradingId: string;
}
function transactionSystemService({
  transactionRepo,
  userService,
}: {
  transactionRepo: TransactionSystemRepository;
  userService: UserSystemService;
}) {
  return {
    createTransaction: async ({
      ownerId,
      transaction,
    }: {
      ownerId: string;
      transaction: transaction;
    }) => {
      const createtransaction = await transactionRepo.createTransaction({
        ownerId: ownerId,
        transaction: {
          ...transaction,
        },
      });
      if (
        createtransaction.type == "WITHDRAW" ||
        createtransaction.type == "DEPOSIT"
      ) {
        const user = await userService.getUserById(ownerId);
        await userService.updateUser(user.userId, {
          balance:
            user.balance +
            (createtransaction.type == "WITHDRAW"
              ? -transaction.price
              : +transaction.price),
        });
      }
      return createtransaction;
    },
    findByCondition: async ({
      condition,
    }: {
      condition: Partial<TransactionEntity>;
    }) => {
      const result = await transactionRepo.findByCondition(condition);
      return result;
    },
    findAll: async () => {
      const result = await transactionRepo.findAll();
      return result;
    },
    updatetransaction: async ({
      transactionId,
      updateData,
    }: {
      transactionId: string;
      updateData: Partial<TransactionEntity>;
    }) => {
      const existItem = await transactionRepo.findByCondition({
        transactionId: transactionId,
      });
      if (!existItem) {
        throw Error("not have item");
      }
      return await transactionRepo.updateTransaction({
        transactionId,
        updateData: { ...existItem, ...updateData },
      });
    },

    findManyByCondition: async (condition: Partial<TransactionEntity>) => {
      return await transactionRepo.findManyByCondition(condition);
    },

    countByCondition: async (condition: Partial<TransactionEntity>) => {
      return await transactionRepo.countByCondition(condition);
    },
  };
}
export type TransactionSystemService = ReturnType<
  typeof transactionSystemService
>;
export default transactionSystemService;
