const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user);  // it print undefined if user not logged in. If the user logged in then it print the user.
    // console.log(req); // It's print everything user logged in or not. Which page he want to go. It's print user all action.
    // console.log(req.path, "..", req.originalUrl); // /new .. /listings/new

    req.session.redirectUrl = req.originalUrl;

    if(!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to create a new listing.");
        return res.redirect("/login");
    }
    next();
} ;

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        // It's locally stored the path which user want to go.
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};



// This check the listing owner and the current logged in user are same or not.
module.exports.isOwner = async (req, res, next) => { 
    let {id} = req.params;

    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to edit/delete!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => { 
        let {error} = listingSchema.validate(req.body);
        if(error) { 
            // throw new ExpressError(400, error);
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errMsg);
        } else {
            next();
        }
};


module.exports.validateReview = (req, res, next) => { 
    let {error} = reviewSchema.validate(req.body);
    if(error) { 
        // throw new ExpressError(400, error);
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


// This check the listing owner and the current logged in user are same or not.
module.exports.isReviewOwner = async (req, res, next) => { 
    let {id, reviewId} = req.params;

    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}