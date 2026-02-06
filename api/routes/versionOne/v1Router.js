const getRouter = require("../../utils/getRouter");
const customersRouter = require("./v1Routes/customersRouter");
const pharmaciesRouter = require("./v1Routes/pharmaciesRouter");
const prescriptionsRouter = require("./v1Routes/prescriptionsRouter");
const usersRouter = require("./v1Routes/usersRouter");

const v1Router = getRouter();

v1Router.use("/users", usersRouter);

v1Router.use("/prescriptions", prescriptionsRouter);

v1Router.use("/customers", customersRouter);

v1Router.use("/pharmacies", pharmaciesRouter);

v1Router.use("/inventory", require("./v1Routes/inventoryRouter"));
v1Router.use("/orders", require("./v1Routes/ordersRouter"));
v1Router.use("/deliveries", require("./v1Routes/deliveryRouter"));

module.exports = v1Router;
