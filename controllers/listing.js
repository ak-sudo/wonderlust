const Listing = require('../models/listing'); 

module.exports.index = async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
  };

module.exports.newListing = (req, res) => {
    res.render("listings/new.ejs")
};

module.exports.showListing = async (req, res) => {
    const id = req.params.id;
    const listingData = await Listing.findById(id).populate({path: "review", populate : {path : "author"}}).populate("owner");
    if (!listingData) {
      req.flash("error", "The Listing you are looking for does not exist");
      res.redirect("/listings");
    }
    res.render("listings/view.ejs", { listingData });
  }

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success", "New listing have been created successfully!");
    res.redirect("/listings");
  };

module.exports.editListing = async (req, res) => {
    const id = req.params.id;
    const listingData = await Listing.findById(id);
    if (!listingData) {
        req.flash("error", "The Listing you are looking for does not exist");
        res.redirect("/listings");
      }
    res.render("listings/edit.ejs", { listingData });
  }

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;

    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url,filename};
  
      await listing.save();
  
    }
    
    req.flash("success", "The Listing has been updated successfully!");
    res.redirect(`/listings/${id}`);
  };

module.exports.destroyListing = async (req, res) => {
    const id = req.params.id;
    dltData = await Listing.findByIdAndDelete(id);
    if (dltData){
        req.flash("success", "The Listing has been deleted successfully!");
        res.redirect("/listings");
    }
    res.redirect("/listings");
  }


