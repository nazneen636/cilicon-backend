const {
  uploadCloudinaryFile,
  deleteCloudinary,
} = require("../helpers/cloudinary");
const { customError } = require("../helpers/customError");
const categoryModel = require("../models/category.model");
const apiResponse = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { validateCategory } = require("../validation/category.validation");

exports.createCategory = asyncHandler(async (req, res) => {
  const value = await validateCategory(req);
  // console.log(value.image.path);

  const imageAsset = await uploadCloudinaryFile(value.image.path);
  const category = await categoryModel.create({
    name: value.name,
    image: imageAsset,
  });
  console.log(category);

  if (!category) {
    throw new customError(500, "category create failed");
  }
  apiResponse.sendSuccess(res, "category created successfully", 200, category);
});

exports.getAllCategory = asyncHandler(async (req, res) => {
  const allCategory = await categoryModel.aggregate([
    {
      $lookup: {
        from: "subcategories",
        localField: "subCategory",
        foreignField: "_id",
        as: "subCategory",
      },
    },
    {
      $project: {
        name: 1,
        image: 1,
        isActive: 1,
        slug: 1,
        createdAt: 1,
        subCategory: 1,
      },
    },
  ]);

  if (!allCategory) {
    throw new customError(401, "category not found");
  }
  apiResponse.sendSuccess(
    res,
    "all category get successfully",
    200,
    allCategory
  );
});

// single====
exports.singleCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(400, `${this.slug} not found`);
  }
  const singleCat = await categoryModel
    .findOne({ slug })
    .select("-_id -updatedAt -createdAt -isActive -__v");
  console.log(singleCat);

  if (!singleCat) {
    throw new customError(400, `category not found`);
  }
  apiResponse.sendSuccess(res, "category found successfully", 200, singleCat);
});

// update=====
exports.updateCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(400, `${this.slug} not found`);
  }
  const updateCat = await categoryModel.findOne({ slug });
  if (!updateCat) {
    throw new customError(400, `category not found`);
  }
  console.log(updateCat.name);

  if (req.body.name) {
    updateCat.name = req.body.name;
  }
  if (req?.files?.image?.length) {
    // delete previously file
    const response = await deleteCloudinary(updateCat.image.publicId);
    console.log(response);

    // upload file
    const updateAsset = await uploadCloudinaryFile(req?.files?.image[0].path);
    updateCat.image = updateAsset;
  }

  await updateCat.save();
  console.log(updateCat.image);
  apiResponse.sendSuccess(res, "category updated successfully", 200, updateCat);
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(400, `${this.slug} not found`);
  }

  const deleteCategory = await categoryModel.findOneAndDelete({ slug });
  if (!deleteCategory) {
    throw new customError(400, `category not deleted`);
  }
  await deleteCloudinary(deleteCategory.image.publicId);

  // await deleteCategory.save();
  apiResponse.sendSuccess(
    res,
    "category deleted successfully",
    200,
    deleteCategory
  );
});

exports.activeCategory = asyncHandler(async (req, res) => {
  const { active } = req.query;
  if (!active) {
    throw new customError(400, `category not found`);
  }

  const activeCategory = await categoryModel.find({ isActive: active });
  if (!activeCategory) {
    throw new customError(400, `category not found`);
  }
  apiResponse.sendSuccess(
    res,
    " active category get successfully",
    200,
    activeCategory
  );
});
