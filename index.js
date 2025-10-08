const { connectDatabase } = require("./src/DATABASE/db");
const chalk = require("chalk");
const { server } = require("./src/app");
require("dotenv").config();
connectDatabase()
  .then(() => {
    server.listen(process.env.PORT || 5000, () => {
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
