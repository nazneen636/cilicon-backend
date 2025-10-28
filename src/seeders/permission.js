const chalk = require("chalk");
const mongoose = require("mongoose");
const permissionModel = require("../models/permission.modal");
const { customError } = require("../helpers/customError");
require("dotenv").config();
const connectDatabase = async () => {
  try {
    const dbInfo = await mongoose.connect(`${process.env.MONGOBD_URL}cilicon`);
    console.log(
      chalk.bgGreen(`Database Connection successful ${dbInfo.connection.host}`)
    );
    await seedPermission();
  } catch (error) {
    console.log(chalk.bgRed("database connection failed", error));
  }
};
const seedPermission = async () => {
  try {
    const roles = [
      {
        name: "brand",
      },
      {
        name: "cart",
      },
      {
        name: "category",
      },
      {
        name: "coupon",
      },
      {
        name: "deliveryCharge",
      },
      {
        name: "discount",
      },
      {
        name: "invoice",
      },
      {
        name: "order",
      },
      {
        name: "permission",
      },
      {
        name: "product",
      },
      {
        name: "user",
      },
      {
        name: "subcategory",
      },
      {
        name: "variant",
      },
      {
        name: "role",
      },
    ];

    // clear the role database
    await permissionModel.deleteMany();
    // const roleInstance = await roleModel.insertMany(roles);
    const roleInstance = await Promise.all(
      roles.map((p) => permissionModel.create(p))
    );

    if (!roleInstance) {
      throw new customError(401, "permission not insert into db");
    }
    console.log("permission insertion done");
  } catch (error) {
    throw new customError(401, error);
  }
};
connectDatabase();
