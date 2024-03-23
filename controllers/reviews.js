const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {reviewSchema} = require("../schema.js");


// Create a new review
module.exports.createReview = async (req, res) => {
    // console.log(req.params.id);

    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    // It's store the user id who reviewed the listings
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash('success', "New Reviewed has been created successfully!");

    res.redirect(`/listings/${listing._id}`);
};


// Delete review
module.exports.destroyReview = async (req, res) => {
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Review has been deleted successfully!");

    res.redirect(`/listings/${id}`);
};
