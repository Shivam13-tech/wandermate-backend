import { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const stripe = require("stripe")(`${process.env.STRIPE_KEY}`);

interface Item {
  id: number;
  quantity: number;
}

const storeItems: any = new Map([
  //productid, price and name of product
  [1, { priceInCents: 10000, name: "learn react" }],
  [2, { priceInCents: 20000, name: "learn css" }],
]);

export const createCheckout = async (req: Request, res: Response) => {
  try {
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
      success_url: `${process.env.CLIENT_URL}/tour`,
      cancel_url: `${process.env.CLIENT_URL}`,
    });
    res.json({ url: session.url });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "Something went wrong! Try again later",
      message: error,
    });
  }
};
