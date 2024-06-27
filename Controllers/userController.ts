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

export const getTourById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        status: "Failed",
        message: "Please provide tourid",
      });
    }
    const Tourinfo = await Tour.find({ _id: id });
    if (!Tourinfo) {
      return res.status(400).json({
        status: "Failed",
        message: "Please provide valid tour id",
      });
    }
    res.status(201).json({
      status: "successful",
      Tourinfo,
      link: "https://wandermate-chat-frontend.onrender.com/",
    });
  } catch (error) {
    return res.status(400).json({
      status: "Failed",
      message: error,
    });
  }
};
