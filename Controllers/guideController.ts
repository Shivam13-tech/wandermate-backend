import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Guide from "../Models/guideModel";
import jwt from "jsonwebtoken";
import { generateRandomString } from "../Utils/generateCreds";

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

interface UserData {
  _id: string;
  userName: string;
  password: string | undefined;
}

interface CreateJWTTokenFunction {
  (userData: UserData, statusCode: number, res: Response): void;
}

const createJWTToken: CreateJWTTokenFunction = (userData, statusCode, res) => {
  const Token = signToken(userData._id);
  // userData.password = undefined;
  res.status(statusCode).json({
    status: "Success",
    Token,
    Result: userData,
  });
};

export const createGuide = async (req: Request, res: Response) => {
  try {
    let newUsername = generateRandomString(8);
    const password = generateRandomString(8);
    let existingGuide = await Guide.findOne({ userName: newUsername });
    while (existingGuide) {
      newUsername = generateRandomString(8);
      existingGuide = await Guide.findOne({ userName: newUsername });
    }

    const newGuide = await Guide.create({
      userName: newUsername,
      password,
    });
    createJWTToken(newGuide, 201, res);
    // return res.status(200).json({
    //   status: "Success",
    //   Result: newGuide,
    // });
  } catch (error) {
    return res.status(400).json({
      status: "Something went wrong! Try again later",
      message: error,
    });
  }
};

export const loginGuide = async (req: Request, res: Response) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res.status(400).json({
        status: "Login Failed",
        message: "Please provide required email and password",
      });
    }
    const user = await Guide.findOne({ userName });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        status: "Login Failed",
        message: "Please provide valid email and password",
      });
    }
    res.status(201).json({
      status: true,
      message: "Login success",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Login Failed",
      message: error,
    });
  }
};
