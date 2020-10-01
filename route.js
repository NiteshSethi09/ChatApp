const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const User = require("./model/User");

router.get("/all", async (req, res) => {
  const data = await User.find();
  res.json(data);
  console.log(data);
});

router.post("/signup", async (req, res) => {
  let { name, email, password, password2 } = req.body;
  const regexPattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  // const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  console.log(name, email, password, password2);

  if (!name || !email || !password || !password2) {
    return res
      .status(400)
      .json({ msg: "Please provide all necessary information." });
  }
  if (await User.findOne({ email })) {
    return res
      .status(400)
      .json({ msg: "Account already exists with this id." });
  }
  if (password !== password2) {
    return res.status(403).json({ msg: "Password should be both same." });
  }
  if (password.length < 6) {
    return res
      .status(403)
      .json({ msg: "Password must be 6 or more characters." });
  }
  if (!email.match(regexPattern)) {
    return res.status(403).json({ msg: "Email is't in right format." });
  }

  console.log(req.body);

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  await User.create({ name, password, email })
    .then(() => res.json({ msg: "User saved successfully." }))
    .catch((err) => console.log("panga" + err));
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ msg: "Please provide all necessary information." });
  }

  const user = await User.findOne({ email });
  if (user) {
    console.log(user);
    console.log(await bcrypt.compare(password, user.password));
    if (await bcrypt.compare(password, user.password)) {
      return res.json({ msg: "User logged in successfully." });
    } else {
      return res.json({ msg: "Wrong information entered." });
    }
  } else {
    return res.json({ msg: "User with this email doesn't exists." });
  }
});

module.exports = router;
