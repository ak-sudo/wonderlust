const express = require("express");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const route = express.Router({mergeParams: true});
const cookieParser = require("cookie-parser");
const { isLoggedIn, isOwner, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

route.use(cookieParser());

const validaeteReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    }
    else{
      next();
    }
  }


// Reviews post route
route.post('/', validaeteReview,isLoggedIn, wrapAsync(reviewController.postReview));

// Reviews delete route
// /listings/<%= listingData._id %>/reviews/<%= review._id %>?_method=delete

route.delete('/:reviewId',isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = route; 