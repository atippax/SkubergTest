import { Context } from "elysia";
import { verifyToken } from "../utils/auth";

export const authMiddleware = async (c: Context) => {
  const authHeader = c.request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    c.set.status = 401;
    return { success: false, message: "Unauthorized: Missing token" };
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    c.set.status = 403;
    return { success: false, message: "Forbidden: Invalid token" };
  }

  return { userId: (decoded as any).userId };
};
