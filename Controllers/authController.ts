import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import User from "../Models/authModel";
import Guide from "../Models/guideModel";

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

declare module "express-serve-static-core" {
  interface Request {
    userID?: string;
  }
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

const verifyToken = (token: string, secret: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
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

export const protectGuideRoute = async (
  req: Request,
  res: Response,
  next: any
) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        status: "Failed",
        Message: "Please provide valid email and password",
      });
    }
    const decoded: any = await verifyToken(
      token,
      process.env.JWT_SECRET as string
    );
    const currentUser = await Guide.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "Failed",
        Message: "The user no longer exist",
      });
    }

    req.userID = currentUser._id;
    next();
  } catch (error) {
    console.log(error);
    // Handle any error that occurred during verification
    return res.status(401).json({
      status: "Failed",
      message: "Invalid token",
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        status: "Failed",
        message: "Please provide userid",
      });
    }
    const user = await User.find({ _id: id });
    if (!user) {
      return res.status(400).json({
        status: "Failed",
        message: "Please provide valid user info",
      });
    }
    res.status(201).json({
      status: "successful",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Failed",
      message: error,
    });
  }
};
