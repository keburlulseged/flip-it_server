import User from "../models/user";

const stripe = require("stripe")(process.env.STRIPE_SECRET);

export const createConnectAccount = async (req, res) => {
  const user = await User.findById(req.user._id).exec();
  console.log("USER ++> ", user);

  if (!user.stripe_account_id) {
    const account = await stripe.accounts.create({
      type: "express",
    });
    console.log(`ACCOUNT ===>`, account);
    user.stripe_account_id = account.id;
    user.save();
  }

};
