import User from "../models/user";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  // Data validation
  if (!name) return res.status(400).send("Name is required");
  if (!password || password.length < 6)
    return res
      .status(400)
      .send("Password is required and should be at least 6 characters");
  let userExist = await User.findOne({ email }).exec();
  if (userExist) return res.status(400).send(`Email is taken`);

  // Save to DB
  const user = new User(req.body);
  try {
    await user.save();
    console.log(`User created: ${user}`);
    return res.json({ ok: true });
  } catch (err) {
    return res.status(400).send("ERROR: Try again");
  }
};

export const login = async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;
  try {
    // find user
    let user = await User.findOne({ email }).exec();
    // console.log("USER EXISTS", user);
    if (!user) res.status(400).send("User with that email not found");

    // compare password
    user.comparePassword(password, (err, match) => {
      console.log("COMPARE PASSWORD IN LOGIN ERR", err);
      if (!match || err) return res.status(400).send("Wrong password");
      // "GENERATE A TOKEN AND SEND AS RESPONSE TO CLIENT"
      let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    });
  } catch (err) {
    console.log("LOGIN ERROR", err);
    res.status(400).send("Login failed");
  }
};
