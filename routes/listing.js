const express = require("express");
const router = express.Router();
const Listing = require("../models/listings.js");
const ExpressError = require("../utils/ExpressError.js"); // for getting the error details
const wrapAsync = require("../utils/wrapAsync"); // For error handling using middlewares
const { listingSchema } = require("../schema.js"); // for checking schemaValidation
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const multer = require("multer");
const { cloudinary, storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../controllers/listing.js");

//router.route is a way to compact your code wether you attach all the same path fns in a single fn
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

// Old routing code
// Index Route
// router.get("/", wrapAsync(listingController.index));

// // New Route
// router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show route
// router.get("/:id", wrapAsync(listingController.showListing));

// // Create route
// router.post(
//   "/",
//   isLoggedIn,
//   validateListing,
//   wrapAsync(listingController.createListing)
// );

// Edit route
// router.get(
//   "/:id/edit",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.editListing)
// );

//Update route
// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing,
//   wrapAsync(listingController.updateListing)
// );

// Destroy route
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.destroyListing)
// );

module.exports = router;
