import { Request, Response } from "express";
import Guide from "../Models/guideModel";
import { generateRandomString } from "../Utils/generateCreds";

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

    return res.status(200).json({
      status: "Success",
      Result: newGuide,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Something went wrong! Try again later",
      message: error,
    });
  }
};
