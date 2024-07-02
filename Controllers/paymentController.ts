import { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import User from "../Models/authModel";

dotenv.config({ path: ".env" });

const stripe = require("stripe")(`${process.env.STRIPE_KEY}`);

interface Item {
  id: number;
  quantity: number;
}

const storeItems: any = new Map([
  [
    "667c408a3e322832859f07cc",
    { priceInCents: 150000, name: "Mystical Himalayan Trek" },
  ],
  [
    "667c40ef3e322832859f07d3",
    { priceInCents: 80000, name: "Desert Safari Experience" },
  ],
  [
    "667c414b3e322832859f07da",
    { priceInCents: 120000, name: "Coastal Adventure Retreat" },
  ],
  [
    "667c41903e322832859f07e1",
    { priceInCents: 100000, name: "Cultural Heritage Trail" },
  ],
  [
    "667c41ec3e322832859f07e8",
    { priceInCents: 180000, name: "Alpine Lakes Expedition" },
  ],
  [
    "667c422c3e322832859f07ef",
    { priceInCents: 140000, name: "Wildlife Safari Adventure" },
  ],
  [
    "667c42763e322832859f07f6",
    { priceInCents: 250000, name: "Northern Lights Expedition" },
  ],
  [
    "667c42d73e322832859f07fb",
    { priceInCents: 160000, name: "Tropical Island Getaway" },
  ],
  [
    "667c432a3e322832859f0800",
    { priceInCents: 190000, name: "Volcano Exploration Journey" },
  ],
  [
    "667c3fd53e322832859f07c6",
    { priceInCents: 90000, name: "Sacred Temples Pilgrimage" },
  ],
]);

export const createCheckout = async (req: Request, res: Response) => {
  try {
    const { userId, tourId } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map((item: any) => {
        const storeItem = storeItems.get(item.id);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `https://wandermate-frontend-iq91uni22-shivam13techs-projects.vercel.app/booking`,
      cancel_url: `https://wandermate-frontend-iq91uni22-shivam13techs-projects.vercel.app`,
    });
    // Update user document to push the newly bought tourId
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { boughtTours: tourId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found or unable to update bought tours.",
      });
    }
    res.status(200).json({
      status: "success",
      message: `Tour ID ${tourId} successfully added to user ${userId}'s bought tours.`,
      user: updatedUser,
      url: session.url,
    });
  } catch (error) {
    console.error("Error updating user's bought tours:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to update user's bought tours. Please try again later.",
    });
  }
  // res.json({ url: session.url });
  // } catch (error) {
  //   console.log(error);
  //   return res.status(500).json({
  //     status: "Something went wrong! Try again later",
  //     message: error,
  //   });
  // }
};
