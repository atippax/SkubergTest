import Elysia, { t } from "elysia";
import { Trading, TradingSystemService } from "./service";
import { authMiddleware } from "../../middlewares/auth";

export default function tradingSystemController({
  tradingService,
}: {
  tradingService: TradingSystemService;
}) {
  const controller = "trade";
  return (app: Elysia) => {
    app.get(`/${controller}/get-symbols`, () => tradingService.getAllSymbol());
    app.get(`/${controller}/get-symbol/:symbol`, ({ params: { symbol } }) =>
      tradingService.getDetailSymbol(symbol)
    );
    app.guard((app) => {
      const guard = app.resolve(authMiddleware);
      guard.post(
        `/${controller}/create-trading`,
        async ({ userId, body: { amount, price, side, symbol }, set }) => {
          const result = await tradingService.createTrading({
            ownerId: userId,
            trading: {
              amount,
              price,
              symbol,
              side,
            },
          });
          console.log(result);
          return result;
        },
        {
          body: t.Object({
            side: t.String(),
            price: t.Number(),
            amount: t.Number(),
            symbol: t.String(),
          }),
        }
      );
      guard.get(
        `/${controller}/get-trading/:tradingId`,
        async ({ params: { tradingId } }) => {
          const result = await tradingService.findByCondition({
            condition: { tradingId: tradingId },
          });
          return { ...result };
        }
      );
      guard.get(
        `/${controller}/get-by-user/:userId`,
        async ({ params: { userId } }) => {
          const result = await tradingService.findManyByCondition({
            ownerId: userId,
          });
          return { ...result };
        }
      );
      guard.get(
        `/${controller}/get-by-symbol/:symbol`,
        async ({ params: { symbol } }) => {
          const result = await tradingService.findManyByCondition({
            symbol: symbol,
          });
          return { ...result };
        }
      );
      guard.post(
        `/${controller}/order-trading/:tradingId`,
        async ({ userId, params: { tradingId } }) => {
          const result = await tradingService.updateTrading({
            tradingId,
            updateData: {
              clientId: userId,
              status: "COMFIRM",
            },
            idMaker: userId,
          });
          return { ...result };
        }
      );
      guard.post(
        `/${controller}/comfirm-trading/:tradingId`,
        async ({ userId, params: { tradingId } }) => {
          const result = await tradingService.updateTrading({
            tradingId,
            updateData: {
              status: "SUCCESS",
            },
            idMaker: userId,
          });
          return { ...result };
        }
      );
      guard.post(
        `/${controller}/cancle-trading/:tradingId`,
        async ({ userId, params: { tradingId } }) => {
          const result = await tradingService.updateTrading({
            tradingId,
            updateData: {
              status: "CANCELED",
            },
            idMaker: userId,
          });
          return { ...result };
        }
      );
      guard.delete(
        `/${controller}/close-trading/:tradingId`,
        async ({ userId, params: { tradingId } }) => {
          const result = await tradingService.deleteTrading({
            userId,
            tradingId,
          });
          return { ...result };
        }
      );

      return guard;
    });

    return app;
  };
}
export type TradingSystemController = ReturnType<
  typeof tradingSystemController
>;
