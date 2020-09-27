const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      // required: "Name is required",
    },
    email: {
      type: String,
      // required: "Email is required!",
    },
    password: {
      type: String,
      // required: "Password is required!",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", UserSchema);
