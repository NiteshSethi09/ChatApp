const { Router } = require("express");
const router = Router();
const { Chatroom, validateChatroom } = require("../model/chatroom");

router.post("/create", async (req, res) => {
  let { name } = req.body;
  validateChatroom(req.body);

  if (await Chatroom.findOne({ name }))
    return res
      .status(400)
      .json({ msg: "Chatroom already exists with this name." });

  await User.create({ name })
    .then(() => res.json({ msg: "Chatroom saved successfully." }))
    .catch((err) => console.log("Some error occured: ", err));
});

module.exports = router;
