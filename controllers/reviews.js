const Listing = require('../models/listing');
const Review = require('../models/review');

module.exports.postReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);

  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.review.push(newReview);

  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${listing.id}`); 

}

module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
  }