import bcrypt from "bcryptjs";
import User from "../models/User";
import generateToken from "../utils/jwt";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: "admin" | "employee"
) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user.id, user.role)
  };
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user.id, user.role)
  };
};