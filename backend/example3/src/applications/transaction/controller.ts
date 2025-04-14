import Elysia, { t } from "elysia";
import { authMiddleware } from "../../middlewares/auth";
import { TransactionSystemService } from "./service";

export default function transactionSystemController({
  transactionService,
}: {
  transactionService: TransactionSystemService;
}) {
  const controller = "transaction";
  return (app: Elysia) => {
    app.guard((app) => {
      const guard = app.resolve(authMiddleware);
      guard.post(
        `/${controller}/create`,
        async ({ userId, body: { price, tradingId, type } }) => {
          const result = await transactionService.createTransaction({
            ownerId: userId,
            transaction: {
              price,
              tradingId,
              type: type as any,
            },
          });
          console.log(result);
          return result;
        },
        {
          body: t.Object({
            price: t.Number(),
            type: t.String(),
            tradingId: t.String({ default: null }),
          }),
        }
      );
      guard.get(`/${controller}/get-all`, async () => {
        const result = await transactionService.findAll();
        return result;
      });
      return guard;
    });

    return app;
  };
}
export type TransactionSystemController = ReturnType<
  typeof transactionSystemController
>;
