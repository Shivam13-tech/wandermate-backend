import mongoose, { Document, Schema } from "mongoose";
import Guide from "../Models/guideModel";

interface Itour extends Document {
  name: string;
  description: string;
  price: string;
  images: [string];
  guide: mongoose.Types.ObjectId;
}

const tourSchema: Schema<Itour> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide tour/trek name"],
  },
  description: {
    type: String,
    required: [true, "Please provide tour/trek description"],
  },
  price: {
    type: String,
    required: [true, "Please provide tour/trek price"],
  },
  images: {
    type: [String],
    required: [true, "Please provide atleast one image of the tour/trek"],
  },
  guide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guide",
  },
});

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
