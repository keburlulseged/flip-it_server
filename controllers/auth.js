import User from "../modles/user";

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
