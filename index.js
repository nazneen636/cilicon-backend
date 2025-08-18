const { connectDatabase } = require("./src/DATABASE/db");
const chalk = require("chalk");
const { app } = require("./src/app");
require("dotenv").config();
connectDatabase()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(
        chalk.bgBlueBright(
          `server running on http://localhost:${process.env.PORT}`
        )
      );
    });
  })
  .catch((error) => {
    console.log("database connection failed", error);
  });
