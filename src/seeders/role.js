const chalk = require("chalk");
const mongoose = require("mongoose");
const roleModel = require("../models/role.model");
const { customError } = require("../helpers/customError");
require("dotenv").config();
const connectDatabase = async () => {
  try {
    const dbInfo = await mongoose.connect(`${process.env.MONGOBD_URL}cilicon`);
    console.log(
      chalk.bgGreen(`Database Connection successful ${dbInfo.connection.host}`)
    );
    await seedRole();
  } catch (error) {
    console.log(chalk.bgRed("database connection failed", error));
  }
};
const seedRole = async () => {
  try {
    const roles = [
      {
        name: "admin",
      },
      {
        name: "manager",
      },
      {
        name: "salesman",
      },
      {
        name: "owner",
      },
      {
        name: "user",
      },
    ];

    // clear the role database
    await roleModel.deleteMany();
    // const roleInstance = await roleModel.insertMany(roles);
    const roleInstance = await Promise.all(
      roles.map((role) => roleModel.create(role))
    );

    if (!roleInstance) {
      throw new customError(401, "role not insert into db");
    }
    console.log("role insertion done");
  } catch (error) {
    throw new customError(401, error);
  }
};
connectDatabase();
