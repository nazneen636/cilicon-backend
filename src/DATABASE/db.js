const chalk = require("chalk");
const mongoose = require("mongoose");
require("dotenv").config();
exports.connectDatabase = async () => {
  try {
    const dbInfo = await mongoose.connect(`${process.env.MONGOBD_URL}cilicon`);
    console.log(
      chalk.bgGreen(`Database Connection successful ${dbInfo.connection.host}`)
    );
  } catch (error) {
    console.log(chalk.bgRed("database connection failed", error));
  }
};
