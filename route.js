const e = require("express");
const { Router, response } = require("express");
const router = Router();
const User = require("./model/User");

router.get("/all", async (req, res) => {
  const data = await User.find();
  res.json(data);
  console.log(data);
});

router.post("/create", async (req, res) => {
  const { name, email, password, password2 } = req.body;
  // working ok.
  // if (password !== password2) {
  //   return res.json({ msg: "Password should be in both strings." });
  // }

  if (User.find({ email })) {
    return res.json({ msg: "Account already exists with this id." });
  }

  if (!name || !email || !password) {
    return res.json({ msg: "Please provide all necessary information." });
  }

  console.log("body " + req.body);
  await User.create({ name, password, email })
    .then(() => res.json({ msg: "User saved successfully." }))
    .catch((err) => console.log("panga" + err));
});

module.exports = router;
