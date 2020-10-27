const { Schema, model, SchemaTypes } = require("mongoose");
const Joi = require("joi");

const chatroomSchema = new Schema(
  {
    name: {
      type: String,
      required: "Name is required",
    },
    creator: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

function validateChatroom(chatroom) {
  const { error } = Joi.object({
    name: Joi.string().required(),
  }).validate(chatroom);

  if (error) return res.json(error.details[0].message);
}

exports.Chatroom = model("Chatroom", chatroomSchema);
exports.validateChatroom = validateChatroom;
