const express = require("express");
const router  = express.Router({mergeParams: true});  // mergeParams user for review listings
// const Listing = require("../models/listing.js");
// const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {reviewSchema} = require("../schema.js");
const {isLoggedIn, validateReview, isReviewOwner} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// Post Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


// Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewOwner, wrapAsync(reviewController.destroyReview)
);


module.exports = router;
