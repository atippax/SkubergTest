import { BinanceSystemService } from "../binance";
import { TransactionSystemService } from "../transaction/service";
import { UserSystemService } from "../user/service";
import { TradingEntity } from "../../entities/trade.entity";
import { TradingSystemRepository } from "./repository";
export interface Trading {
  side: string;
  price: number;
  amount: number;
  symbol: string;
}
function tradingSystemService({
  binanceService,
  tradingRepo,
  transactionService,
  userService,
}: {
  binanceService: BinanceSystemService;
  tradingRepo: TradingSystemRepository;
  userService: UserSystemService;
  transactionService: TransactionSystemService;
}) {
  return {
    getAllSymbol: async () => {
      const symbols = await binanceService.getAllSymbol();
      return symbols;
    },
    getDetailSymbol: async (symbol: string) => {
      const symbolDetail = await binanceService.getDetailSymbol(symbol);
      return symbolDetail;
    },

    createTrading: async ({
      ownerId,
      trading,
    }: {
      ownerId: string;
      trading: Trading;
    }) => {
      const createTrading = await tradingRepo.createTrading({
        ownerId: ownerId,
        trading: {
          ...trading,
        },
      });
      return createTrading;
    },
    findByCondition: async ({
      condition,
    }: {
      condition: Partial<TradingEntity>;
    }) => {
      const result = await tradingRepo.findByCondition(condition);
      return result;
    },
    findAll: async () => {
      const result = await tradingRepo.findAll();
      return result;
    },
    updateTrading: async ({
      tradingId,
      updateData,
      idMaker,
    }: {
      tradingId: string;
      idMaker: string;
      updateData: Partial<TradingEntity>;
    }) => {
      const existItem = await tradingRepo.findByCondition({
        tradingId: tradingId,
      });
      if (!existItem) {
        throw Error("not have item");
      }
      if (existItem.ownerId == updateData.clientId) {
        throw Error("bad request");
      }
      const client = await userService.findByFields({
        criteria: { userId: existItem.clientId },
      });
      if (!client) {
        throw Error("bad request");
      }
      if (client.balance < existItem.price && idMaker == existItem.clientId) {
        throw Error("Cannot Make Transaction");
      }

      if (updateData.status == "COMFIRM") {
        const result = await userService.updateUser(idMaker, {
          balance: client?.balance - existItem.price,
        });
        const ownerUser = await userService.findByFields({
          criteria: { userId: existItem.ownerId },
        });
        const oResult = await userService.updateUser(ownerUser!.userId, {
          balance: ownerUser!.balance + existItem.price,
        });
        console.log(result, oResult);
      } else if (updateData.status == "SUCCESS") {
        if (existItem.ownerId != idMaker) {
          throw Error("not have permission");
        }
        await transactionService.createTransaction({
          ownerId: client.userId,
          transaction: {
            price: -existItem.price,
            tradingId: existItem.tradingId,
            type: "TRANSFER",
          },
        });
        await transactionService.createTransaction({
          ownerId: existItem.ownerId,
          transaction: {
            price: +existItem.price,
            tradingId: existItem.tradingId,
            type: "TRANSFER",
          },
        });
      } else if (updateData.status == "CANCELED") {
        if (existItem.status == "SUCCESS") {
          throw Error("bad request");
        }
        await userService.updateUser(client.userId, {
          balance: client.balance + existItem.price,
        });
      }
      return await tradingRepo.updateTrading({
        tradingId,
        updateData: { ...existItem, ...updateData },
      });
    },

    deleteTrading: async ({
      tradingId,
      userId,
    }: {
      userId: string;
      tradingId: string;
    }) => {
      const existItem = await tradingRepo.findByCondition({
        tradingId: tradingId,
      });
      if (existItem?.ownerId != userId) {
        throw Error("not have permission");
      }
      return await tradingRepo.deleteTrading(tradingId);
    },

    findManyByCondition: async (condition: Partial<TradingEntity>) => {
      return await tradingRepo.findManyByCondition(condition);
    },

    countByCondition: async (condition: Partial<TradingEntity>) => {
      return await tradingRepo.countByCondition(condition);
    },
  };
}
export type TradingSystemService = ReturnType<typeof tradingSystemService>;
export default tradingSystemService;
