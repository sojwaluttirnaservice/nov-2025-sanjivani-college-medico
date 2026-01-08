const getRouter = require("../../utils/getRouter");
const prescriptionsRouter = require("./v1Routes/prescriptionsRouter");
const usersRouter = require("./v1Routes/usersRouter");

const v1Router = getRouter();

v1Router.use("/users", usersRouter);

v1Router.use("/prescriptions", prescriptionsRouter);

module.exports = v1Router;
