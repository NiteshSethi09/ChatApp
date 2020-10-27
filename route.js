module.exports = function (app) {
  app.use("/chat", require("./routes/user"));
  app.use("/chat", require("./routes/chatroom"));
};
