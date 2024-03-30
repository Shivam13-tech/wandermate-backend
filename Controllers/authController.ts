import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/authModel";

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

interface UserData {
  _id: string;
  name: string;
  email: string;
  gender: string;
  password: string | undefined;
}

interface CreateJWTTokenFunction {
  (userData: UserData, statusCode: number, res: Response): void;
}

const createJWTToken: CreateJWTTokenFunction = (userData, statusCode, res) => {
  const Token = signToken(userData._id);
  userData.password = undefined;
  res.status(statusCode).json({
    status: "Success",
    Token,
    Result: userData,
  });
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, gender, password, confirmPassword } = req.body;
    if (!name || !email || !gender || !password || !confirmPassword) {
      return res.status(400).json({
        status: "Signup Failed",
        message: "All fields are required.",
      });
    }

    const newUser = await User.create({
      name,
      email,
      gender,
      password,
      confirmPassword,
    });
    createJWTToken(newUser, 201, res);
    // res.status(201).json({
    //   status: "Signup successful",
    //   user: newUser,
    // });
  } catch (error) {
    return res.status(400).json({
      status: "Signup Failed",
      message: error,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "Login Failed",
        message: "Please provide required email and password",
      });
    }
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        status: "Login Failed",
        message: "Please provide valid email and password",
      });
    }
    createJWTToken(user, 200, res);
    // res.status(201).json({
    //   status: "Login successful",
    //   user,
    // });
  } catch (error) {
    return res.status(400).json({
      status: "Login Failed",
      message: error,
    });
  }
};
