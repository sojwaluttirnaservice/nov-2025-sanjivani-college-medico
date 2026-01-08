const usersController = require("../../../controllers/v1/usersController");
const getRouter = require("../../../utils/getRouter");

const usersRouter = getRouter();

usersRouter.post("/", usersController.createUser);

usersRouter.post("/login", usersController.login);

module.exports = usersRouter;
