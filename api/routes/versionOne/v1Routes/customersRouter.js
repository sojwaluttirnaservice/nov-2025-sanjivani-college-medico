const customersController = require("../../../controllers/v1/customersController");
const { isCustomer } = require("../../../middlewares/auth");
const getRouter = require("../../../utils/getRouter");

const customersRouter = getRouter()


customersRouter.post('/', isCustomer, customersController.upsertCustomer)

customersRouter.get('/profile/:id ', customersController.getProfile)


module.exports = customersRouter