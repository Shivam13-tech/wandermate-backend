import { Request, Response } from "express";
import Tour from "../Models/tourModel";

export const getGuideTour = async function (req: Request, res: Response) {
  try {
    const guideTours = await Tour.find({});
    res.status(200).json({
      status: "Success",
      Result: guideTours,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Something went wrong",
    });
  }
};
