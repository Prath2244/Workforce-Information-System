import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  role: string;
}

const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
};

export default generateToken;