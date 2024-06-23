import express from "express";
import authRouter from "./Routes/authRoutes";
import guideRouter from "./Routes/guideRoutes";
import paymentRouter from "./Routes/paymentRoute";
import tourRouter from "./Routes/tourRoutes";
import cors from "cors";

const app = express();
app.use(express.json());
app.use("/public", express.static("public"));
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/guide", guideRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/tour", tourRouter);

export default app;
