import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key_example";


export function createJwtToken(id: string, email: string, role: string) {
  return jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: "7d" });
}


export function verifyJwtToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
