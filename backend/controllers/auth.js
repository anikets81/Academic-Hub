import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/Users.js";

export const login = async (req, res) => {
  try {
    const { enrollment, password } = req.body;
    const user = await User.findOne({ enrollment: enrollment });
    if (!user) return res.status(400).json({ msg: "User Not Found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
