import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

interface Iguide extends Document {
  userName: string;
  password: string;
}

const guideSchema: Schema<Iguide> = new mongoose.Schema({
  userName: {
    type: String,
  },
  password: {
    type: String,
  },
});

guideSchema.pre<Iguide>("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Guide = mongoose.model("Guide", guideSchema);

export default Guide;
