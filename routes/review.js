const express = require("express");
const router = express.Router({ mergeParams: true }); // used to merge parent params with child
const Listing = require("../models/listings.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js"); // for getting the error details
const wrapAsync = require("../utils/wrapAsync"); // For error handling using middlewares
const { reviewSchema } = require("../schema.js"); // for checking schemaValidation
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//Reviews
// post route for reviews
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// Delete route for reviews

router.delete(
  "/:reviewId",
  isAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
