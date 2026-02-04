const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/zyc.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema}= require("../schema.js");
const Listing = require('../models/listing.js');
const{isLoggedIn, isOwner, validateListing}= require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer= require('multer');
const { storage} = require("../cloudConfig.js");
const upload = multer({ storage});

router
.route("/")
  .get( wrapAsync(listingController.index)) //index.ejs route
// Route to display all listings  
  .post(                 //create route
  isLoggedIn,
  
  upload.single("listing[image]"),
  validateListing,
   wrapAsync(listingController.createListing ));

//new route
router.get("/new",
  isLoggedIn,(listingController.renderNewForm)
  );

// show route
router.route("/:id")
.get(wrapAsync( listingController.showListing))
.put(                       //update route
  isLoggedIn,
  isOwner,
   upload.single("listing[image]"),
  validateListing,
  wrapAsync( listingController.updateListing))
.delete(                     //delete route
  isLoggedIn,
  isOwner,
   wrapAsync(listingController.destroyListing));

//edit route
router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync( listingController.renderEditForm));



module.exports=router;