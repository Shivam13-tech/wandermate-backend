import { Request, Response } from "express";
import Tour from "../Models/tourModel";
import multer from "multer";
import path from "path";
import fs from "fs";

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    return callback(new Error("Please upload a valid image"));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadimage = upload.array("images", 3);

export const createTour = async function (req: Request, res: Response) {
  try {
    const guideid = req.userID?.toString();
    const { name, price, description } = req.body;
    const files = req.files as Express.Multer.File[]; // Type assertion to ensure req.files is an array of files
    const images = files.map((file) => file.filename);

    const newTour = await Tour.create({
      name,
      price,
      description,
      images,
      guide: guideid,
    });

    res.status(200).json({
      status: "Success",
      message: "Product added successfully",
      data: newTour,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Something went wrong",
      error,
    });
  }
};

export const getGuideTour = async function (req: Request, res: Response) {
  try {
    const guideid = req.userID?.toString();
    const guideTours = await Tour.find({ guide: guideid });
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

export const deleteTour = async function (req: Request, res: Response) {
  try {
    const id = req.params.id;
    const deletedTour = await Tour.findByIdAndDelete(id);
    if (!deletedTour) {
      return res.status(404).json({
        status: "Failed",
        message: "Tour not found",
      });
    } else {
      return res.status(204).json({
        status: "Success",
        message: "Tour deleted",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Something went wrong",
      error,
    });
  }
};
