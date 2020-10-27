const { Router } = require("express");
const router = Router();
const { User, userSignup, userLogin } = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../verifyToken");

router.get("/all", auth, async (req, res) => {
  const user = await User.findOne({ _id: req.user }).select("-password");
  res.send(user);
});

router.post("/signup", async (req, res) => {
  let { name, email, password } = req.body;
  console.log(name, email, password);

  userSignup(req.body);

  if (await User.findOne({ email }))
    return res
      .status(400)
      .json({ msg: "Account already exists with this email id." });

  const salt = await bcrypt.genSalt(process.env.SALTROUND);
  password = await bcrypt.hash(password, salt);
  await User.create({ name, password, email })
    .then(() => res.json({ msg: "User saved successfully." }))
    .catch((err) => console.log("Some error occured: ", err));
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  userLogin(req.body);

  const user = await User.findOne({ email });
  if (user) {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_PrivateKey);
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
