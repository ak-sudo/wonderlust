const Listing = require('./models/listing');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be logged in first!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listingDetail = await Listing.findById(id);
    if (!listingDetail.owner._id.equals(res.locals.currentUser._id)) {
      req.flash("error", "You are not authorized to perform this action");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.currentUser._id)) {
      req.flash("error", "You are not authorized to perform this action");
      return res.redirect(`/listings/${id}`);
    }
    next();
}