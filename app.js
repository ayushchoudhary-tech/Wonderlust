
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const ExpressError = require("./utils/ExpressErrors.js");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/users.js");

const dbURL = process.env.ATLASDB_URL;
const sessionSecret = process.env.SECRET;
const port = process.env.PORT || 8080;

// Validate environment variables
if (!dbURL) {
    throw new Error("ATLASDB_URL is missing from .env");
}

if (!sessionSecret) {
    throw new Error("SECRET is missing from .env");
}

// View engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// MongoDB session store
const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: sessionSecret
    },
    touchAfter: 24 * 3600
});

store.on("error", (err) => {
    console.error("MongoDB session store error:", err.message);
});

// Session configuration
const sessionOptions = {
    store,
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }
};

app.use(session(sessionOptions));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Share flash messages and current user with EJS
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});
//root
app.get("/", (req, res) => {
    res.redirect("/listings");
});

// Routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// 404 handler (Express 5)
app.all("*splat", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// Error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";

    res.status(statusCode).render("error.ejs", {
        statusCode,
        message,
        err
    });
});

// Connect to MongoDB, then start the server
async function startServer() {
    try {
        await mongoose.connect(dbURL);
        console.log("Connected to MongoDB");

        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err.message);
        process.exit(1);
    }
}

startServer();
