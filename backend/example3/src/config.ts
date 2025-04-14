import { Elysia } from "elysia";
import * as trading from "./applications/trade";
import * as transaction from "./applications/transaction";
import * as binance from "./applications/binance";
import * as user from "./applications/user";

import swagger from "@elysiajs/swagger";
import { DataSource } from "typeorm";

export default function configElysia(ds: DataSource) {
  const app = new Elysia();

  //repositories zone
  const tradingRepo = trading.tradingSystemRepository(ds);
  const userRepo = user.userSystemRepository(ds);
  const transactionRepo = transaction.transactionSystemRepository(ds);
  // service zone
  const binanceService = binance.binanceSystemService();
  const userService = user.userSystemService({ userRepo });
  const transactionService = transaction.transactionSystemService({
    transactionRepo,
    userService,
  });
  const tradingService = trading.tradingSystemService({
    binanceService,
    tradingRepo,
    transactionService,
    userService,
  });

  // controller zone
  const tradingSystem = trading.tradingSystemController({ tradingService });
  const transactionSystem = transaction.transactionSystemController({
    transactionService,
  });
  const userSystem = user.transactionController({ userService });
  return {
    getServices: {
      tradingService,
      binanceService,
      userService,
    },
    getControllers: {
      tradingSystem,
      userSystem,
    },
    initRoutes() {
      app
        .use(swagger())
        .get("/", () => "Hello Elysia!")
        .use(tradingSystem)
        .use(userSystem)
        .use(transactionSystem);
      return this;
    },
    startServer(port: number) {
      app.listen(port);
      return app;
    },
  };
}
