if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
// console.log(process.env.SECRET);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
const methodOverride = require('method-override')
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

// Router
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// For signup
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Use for post requests
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

app.engine("ejs", ejsMate);



main().then(() => {
    console.log("Connected to DB!");
}).catch((err) => {
    console.log(err);
});

async function main() {
    // await mongoose.connect(MONGO_URL);
    await mongoose.connect(dbUrl);
}


// Connect mongo
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret:  process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware used for flash messages
// This middleware use for stored all data in the web browser which data can be access anywhere from the application.
app.use((req, res, next) => { 
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/", (req, res) => {
//     res.send("Hi, I am root!");
// });


// Demo user login
// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "afsar@gmail.com",
//         username: "afsar1",
//     });

//     let registeredUser = await User.register(fakeUser, "afsar");
//     res.send(registeredUser);
// });




// Test Route
// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("Sample was saved!");
//     res.send("Successful testing!");
// });


// For Listing route
app.use("/listings", listingRouter);

// For Reviews route
app.use("/listings/:id/reviews", reviewRouter);

// For user Router
app.use("/", userRouter);



// Middleware
// app.use((err, req, res, next) => {
//     res.send("Something went wrong!");
// })

// For express error
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not FOUND!"));
});

// Middleware for express error
app.use((err, req, res, next) => {
    let {statusCode=500, message="Something Went Wrong!"} = err;
    // res.status(statusCode).send(message);

    // For error.ejs file
    res.status(statusCode).render("error.ejs", {message});
});

app.listen(port, () => {
    console.log(`Server is listening on ${port}.`);
});
