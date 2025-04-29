const express = require("express");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { listingSchema } = require("../schema.js");
const route = express.Router();
const {isLoggedIn, isOwner} = require("../middleware.js");
const ListingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({storage});

const validaeteListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

route.route('/')
.get(
  wrapAsync(ListingController.index)
)
.post(
  isLoggedIn,
  upload.single('listing[image]'),
  validaeteListing,
  wrapAsync(ListingController.createListing)
);

// new listing page
route.get("/new",isLoggedIn, ListingController.newListing);


route.route('/:id')
.get(
  wrapAsync(ListingController.showListing)
)
.put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validaeteListing,
  wrapAsync(ListingController.updateListing)
)
.delete(
  isLoggedIn, isOwner,
  wrapAsync(ListingController.destroyListing)
);


// edit listing page
route.get(
  "/:id/edit", isLoggedIn, isOwner,
  wrapAsync(ListingController.editListing)
);

module.exports = route;
