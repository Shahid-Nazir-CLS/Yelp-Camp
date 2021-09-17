const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgrounds = require("../controllers/campgrounds")


// INDEX ROUTE -- SHOW ALL CAMPGROUNDS
router.get("/", catchAsync(campgrounds.index))

// NEW ROUTE -- SHOW FORM TO CREATE NEW CAMPGROUNDS
router.get("/new", isLoggedIn, campgrounds.renderForm)

// CREATE ROUTE -- ADD NEW CAMPGROUND
router.post("/", isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// SHOW ROUTE -- show info about a campground
router.get("/:id", catchAsync(campgrounds.showCampground));

// Edit Route
router.get("/:id/edit", isLoggedIn,isAuthor ,catchAsync(campgrounds.renderEditForm));

// Update Route
router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampground));

// Destroy Route
router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;