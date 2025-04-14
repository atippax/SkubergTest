// import { AppDataSource } from "../../data-source";
// import { generateUUID } from "../../utils/uuid";
// import { WalletBySymbol } from "../symbolList/entity";
// import { Transaction } from "../transaction/entity";
// import { Escrow } from "./entity";

// export async function createEscrow({ sellerId, symbol, amount }: {
//     sellerId: string;
//     symbol: string;
//     amount: number;
// }) {
//     const repo = AppDataSource.getRepository(Escrow);
//     const escrow = repo.create({
//         id: generateUUID(),
//         sellerId,
//         symbol,
//         amount,
//         status: "WAITING",
//         createdAt: new Date(),
//     });
//     return await repo.save(escrow);
// }
// export async function moveToHotWallet(escrowId: string) {
//     const escrowRepo = AppDataSource.getRepository(Escrow);
//     const walletRepo = AppDataSource.getRepository(WalletBySymbol);
//     const txnRepo = AppDataSource.getRepository(Transaction);

//     const escrow = await escrowRepo.findOneBy({ id: escrowId });
//     if (!escrow) throw new Error("Escrow not found");

//     escrow.status = "MOVED_TO_HOT";
//     await escrowRepo.save(escrow);

//     let wallet = await walletRepo.findOneBy({ userId: "hot-wallet", symbol: escrow.symbol });
//     if (!wallet) {
//         wallet = walletRepo.create({
//             walletId: generateUUID(),
//             userId: "hot-wallet",
//             symbol: escrow.symbol,
//             balance: 0,
//             locked: 0,
//         });
//     }
//     wallet.balance += escrow.amount;
//     await walletRepo.save(wallet);

//     const txn = txnRepo.create({
//         id: generateUUID(),
//         userId: "hot-wallet",
//         symbol: escrow.symbol,
//         amount: escrow.amount,
//         type: "TRANSFER_TO_HOT",
//         status: "CONFIRMED",
//         createdAt: new Date(),
//     });
//     await txnRepo.save(txn);
//     return { wallet, txn };
// }

// export async function withdrawFunds({ userId, symbol, amount }: {
//     userId: string;
//     symbol: string;
//     amount: number;
// }) {
//     const walletRepo = AppDataSource.getRepository(WalletBySymbol);
//     const txnRepo = AppDataSource.getRepository(Transaction);

//     const wallet = await walletRepo.findOneBy({ userId, symbol });
//     if (!wallet || wallet.balance < amount) throw new Error("Insufficient balance");

//     wallet.balance -= amount;
//     await walletRepo.save(wallet);

//     const txn = txnRepo.create({
//         id: generateUUID(),
//         userId,
//         symbol,
//         amount,
//         type: "WITHDRAW",
//         status: "CONFIRMED",
//         createdAt: new Date(),
//     });
//     await txnRepo.save(txn);
//     return txn;
// }
