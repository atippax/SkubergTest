import jwt from "jsonwebtoken";

const SECRET = "your-secret-key";

export const signToken = (payload: object) => {
  return jwt.sign(payload, SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (e) {
    return null;
  }
};
