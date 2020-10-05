const { Schema, model, SchemaTypes } = require("mongoose");

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

module.exports = model("Chatroom", chatroomSchema);
