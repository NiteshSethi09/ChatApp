const { Schema, model } = require("mongoose");
const Joi = require("joi");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: "Name is required",
    },
    email: {
      type: String,
      required: "Email is required!",
    },
    password: {
      type: String,
      required: "Password is required!",
    },
    groupOwner: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

function validateUserSignup(user) {
  const { error } = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }).validate(user);

  if (error) return res.json(error.details[0].message);
}

function validateUserLogin(user) {
  const { error } = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).validate(user);

  if (error) return res.json(error.details[0].message);
}

exports.User = model("User", UserSchema);
exports.userSignup = validateUserSignup;
exports.userLogin = validateUserLogin;
