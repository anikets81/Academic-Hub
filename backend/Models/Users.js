import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    enrollment: {
      type: Number,
      required: true,
      unique: true,
      max: 50,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
