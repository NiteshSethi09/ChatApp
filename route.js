const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const SECRET = "blahblahblahblah"; // Temporary secret
const auth = require("./verifyToken");
const User = require("./model/User");
const Chatroom = require("./model/chatroom");

router.get("/all", auth, async (req, res) => {
  const user = await User.findOne({ _id: req.user });
  res.send(user);
});

router.post("/create", async (req, res) => {
  let { name } = req.body;

  const schema = Joi.object({
    name: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.json(error.details[0].message);

  if (await Chatroom.findOne({ name }))
    return res
      .status(400)
      .json({ msg: "Chatroom already exists with this name." });

  await User.create({ name })
    .then(() => res.json({ msg: "Chatroom saved successfully." }))
    .catch((err) => console.log("Some error occured: ", err));
});

router.post("/signup", async (req, res) => {
  let { name, email, password } = req.body;
  console.log(name, email, password);

  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.json(error.details[0].message);

  if (await User.findOne({ email }))
    return res
      .status(400)
      .json({ msg: "Account already exists with this email id." });

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  await User.create({ name, password, email })
    .then(() => res.json({ msg: "User saved successfully." }))
    .catch((err) => console.log("Some error occured: ", err));
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.json(error.details[0].message);

  const user = await User.findOne({ email });
  if (user) {
    const token = jwt.sign({ _id: user._id }, SECRET);
    if (await bcrypt.compare(password, user.password)) {
      res.cookie("access_token", token).send(token);
    } else {
      return res.status(400).json({ msg: "Wrong information entered." });
    }
  } else {
    return res
      .status(400)
      .json({ msg: "User with this email doesn't exists." });
  }
});

module.exports = router;
