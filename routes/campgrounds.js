const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgrounds = require("../controllers/campgrounds")
const multer  = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage });


// INDEX ROUTE -- SHOW ALL CAMPGROUNDS
router.route("/")
    .get( catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));


router.get("/new", isLoggedIn, campgrounds.renderForm)

router.route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.editCampground));

router.get("/:id/edit", isLoggedIn, isAuthor ,catchAsync(campgrounds.renderEditForm));

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;