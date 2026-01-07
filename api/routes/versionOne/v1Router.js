const getRouter = require("../../utils/getRouter");

const v1Router = getRouter();

v1Router.use("/users", users);

module.exports = v1Router;
