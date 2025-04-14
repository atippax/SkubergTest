import configElysia from "./config";
import { AppDataSource } from "./data-source";
const ds = await AppDataSource.initialize();
const instanceServer = configElysia(ds);
const app = instanceServer.initRoutes().startServer(3000);
const fistSymbol = await app
  .handle(new Request("http://localhost/trade/get-symbols"))
  .then(async (response) => (await response.json())[0].symbol);
console.log(`🚀 First symbol: ${fistSymbol}`);
const data = await instanceServer.getServices.binanceService.getDetailSymbol(
  fistSymbol
);
console.log(`🚀 First symbol data: ${JSON.stringify(data)}`);
// console.log(await instanceServer.getServices.binanceService.getDetailSymbol('BTCUSDT'))
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
