const sequelize = require("../config/sequelize");
const { Sequelize } = require("sequelize");
const config = require("../config/config"); // Ensure this contains DB details
const cleanDuplicateUniqueIndexes = require("./cleanDuplicateUniqueIndexes");

const createDatabaseIfNotExists = async () => {
    try {
        // Create a new Sequelize instance without specifying a database
        const tempSequelize = new Sequelize({
            host: config.db.host,
            username: config.db.user,
            password: config.db.password,
            port: config.db.port,
            dialect: "mysql", // Change this if using PostgreSQL or other DB
        });

        // Check if database exists
        const [results] = await tempSequelize.query(`SHOW DATABASES LIKE '${config.db.database}'`);

        if (results.length === 0) {
            console.log(`⚠️  Database '${config.db.database}' does not exist. Creating...`);
            await tempSequelize.query(`CREATE DATABASE ${config.db.database}`);
            console.log(`✅ Database '${config.db.database}' created successfully.`);
        } else {
            console.log(`✅ Database '${config.db.database}' already exists.`);
        }

        await tempSequelize.close(); // Close the temporary connection
    } catch (error) {
        console.error("❌ Error while checking/creating database:", error);
        process.exit(1);
    }
};

const getSync = async () => {
    try {
        await createDatabaseIfNotExists(); // Ensure DB exists before syncing

        await cleanDuplicateUniqueIndexes()

        let { models } = await sequelize.sync({ alter: true });

        await cleanDuplicateUniqueIndexes()

        console.log(`✅ Total tables created: ${Object.keys(models)?.length}`);

        console.log(
            '\x1b[47m\x1b[30m%s\x1b[0m',
            `Database ${config.db.database} on host ${config.db.host} has been migrated successfully in "${config.server.env}" mode. You can now start the server.`
        );

        console.log(
            '\x1b[47m\x1b[30m%s\x1b[0m',
            'Use command: npm start (to start the server)'
        );

        process.exit();
    } catch (err) {
        console.error("❌ Error during database sync:", err);
        process.exit(1);
    }
};





module.exports = getSync;
