const express = require("express");
const router = express.Router({mergeParams: true});  // mergeParams user for review listings
// const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema} = require("../schema.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");  // use for parse form data
// const { storage } = require("../cloudConfig.js");
const {storage} = require("../cloudConfig.js");
// const upload = multer({dest: 'uploads/'});  // It's take file from the form and uploads uploads folder
const upload = multer({ storage });  // It's take file from the form and uploads uploads folder


// Router Route
// Listings index and 
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListings))

// It's for cloudinary 
// .post (upload.single('listing[image]'), (req, res) => {
//     // res.send(req.body);
//     res.send(req.file);
// });

// Listing Index Route
// router.get("/", wrapAsync(listingController.index));

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);


// Show Route, Update Route and Delete Route
router.route("/:id")
.get(wrapAsync(listingController.showListings))
.put(isLoggedIn, isOwner, upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))

// Show Route
// router.get("/:id", wrapAsync(listingController.showListings));


// Create Route with handle the error message by using wrap async
// router.post("/", validateListing, wrapAsync(listingController.createListings));


// Edit Route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// Update Route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// Delete Route
// router.delete("/:id",isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


module.exports = router;
