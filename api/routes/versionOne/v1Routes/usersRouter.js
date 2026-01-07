const getRouter = require("../../../utils/getRouter");

const usersRouter = getRouter();

usersRouter.post("/"), usersRouter.post("/login");

module.exports = usersRouter;
