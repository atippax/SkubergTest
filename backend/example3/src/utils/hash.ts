import bcrypt from "bcrypt";
export async function hashing(password: string) {
  const hash = await bcrypt.hash(password, 10);
  return hash;
}
export async function isMatch({
  hashing,
  password,
}: {
  password: string;
  hashing: string;
}) {
  const isMatch = await bcrypt.compare(password, hashing);
  return isMatch;
}
