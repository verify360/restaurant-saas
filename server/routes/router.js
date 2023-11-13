const express = require("express");
const mongoose = require('mongoose');
const multer = require("multer");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

require("../database/connection");

const User = require("../models/userModel");
const Restaurant = require("../models/restaurantModel");
const Booking = require("../models/bookingModel");
const Review = require("../models/reviewModel");
const Owner = require("../models/restaurantOwnerModel");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for each file
  },
});

// router.post("/register", (req, res) => {
//   const { username, password, email, fullName, phoneNumber } = req.body;
//   if (!username || !password || !email || !fullName || !phoneNumber) {
//     return res.status(422).json({ error: "All Fields are Mandatory." });
//   }

//   Owner.findOne({ email: email }).then((userExist) => {
//     if (userExist) {
//       return res.status(422).json({ error: "Email already registered." });
//     }

//     const owner = new Owner({ username, password, email, fullName, phoneNumber });

//     owner.save().then(() => {
//       res.status(201).json({ message: "User Registered Successfully." });
//     }).catch((err) => res.status(500).json({error: "Failed to Register."}))

//   }).catch(err => {console.log(err);});

// });

router.post("/owner-registration", async (req, res) => {
  const { username, password, email, fullName, phoneNumber } = req.body;

  if (!username || !password || !email || !fullName || !phoneNumber) {
    return res.status(422).json({ error: "All Fields are Mandatory." });
  }

  try {
    const emailExist = await Owner.findOne({ email: email });
    const userExist = await Owner.findOne({ username: username });

    if (userExist) {
      return res
        .status(421)
        .json({ error: "User Exist. Enter a different Username." });
    } else if (emailExist) {
      return res.status(423).json({ error: "Email already Registered" });
    }
    const owner = new Owner({
      username,
      password,
      email,
      fullName,
      phoneNumber,
    });

    await owner.save();
    res.status(201).json({ message: "User Registered Successfully." });
  } catch (err) {
    // console.log(err);
  }
});

router.post("/owner-login", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!(username || email) || !password) {
      return res.status(400).json({ error: "Fill all data." });
    }

    let restaurantOwner;
    if (username) {
      restaurantOwner = await Owner.findOne({ username: username });
    } else if (email) {
      restaurantOwner = await Owner.findOne({ email: email });
    }

    if (restaurantOwner) {
      const isMatch = await bcrypt.compare(password, restaurantOwner.password);

      const token = await restaurantOwner.generateAuthToken();
      // console.log(token);

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 36000000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ error: "Invalid Credentials." });
      } else {
        res.status(201).json({ message: "Login Success." });
      }
    } else {
      res.status(400).json({ error: "Invalid Credentials." });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/update-owner-details", authMiddleware, async (req, res) => {
  const userId = req.user._id;
  const { username, password, email, fullName, phoneNumber } = req.body;

  if (!username || !password || !email || !fullName || !phoneNumber) {
    return res.status(422).json({ error: "All Fields are Mandatory." });
  }

  try {
    const existingUser = await Owner.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ error: "User not found." });
    }

    // Update user's details if provided, otherwise keep the existing values
    existingUser.username = username || existingUser.username;
    existingUser.password = password || existingUser.password;
    existingUser.email = email || existingUser.email;
    existingUser.fullName = fullName || existingUser.fullName;
    existingUser.phoneNumber = phoneNumber || existingUser.phoneNumber;

    await existingUser.save();
    res.status(200).json({ message: "User details updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/owner-home", authMiddleware, (req, res) => {
  res.send(req.user);
});

router.get("/owner-logout", (req, res) => {
  res.clearCookie("jwtoken");
  res.status(200).send("Logged Out Successfully.");
});

router.get("/add-restaurant", authMiddleware, (req, res) => {
  res.send(req.user);
  if (req.user) {
    res.status(200);
  }
});

router.post(
  "/add-restaurant",
  authMiddleware,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "menu", maxCount: 5 },
  ]),
  async (req, res) => {
    const owner = req.user;
    const {
      name,
      city,
      area,
      location,
      averageCostForTwo,
      cuisine,
      startTime,
      endTime,
      contactNumber,
      website,
      extraDiscount,
      types,
      offers,
      amenities,
    } = req.body;

    if (!name || !city || !area || !location || !contactNumber) {
      res.status(402).json({ error: "Marked Fields Are Mandatory" });
      return;
    } else if (!owner) {
      res.status(403).json({ error: "Unauthorized Access." });
      return;
    }

    try {
      const ownerDetails = {
        _id: owner._id,
        username: owner.username,
        email: owner.email,
        fullName: owner.fullName,
        phoneNumber: owner.phoneNumber,
      };

      let images = [];
      if (req.files["images"]) {
        images = req.files["images"].map((file) => ({
          data: file.buffer,
          contentType: file.mimetype,
        }));
      }

      let menu = [];
      if (req.files["menu"]) {
        menu = req.files["menu"].map((file) => ({
          data: file.buffer,
          contentType: file.mimetype,
        }));
      }
      const restaurant = new Restaurant({
        name,
        city,
        area,
        location,
        averageCostForTwo,
        cuisine,
        startTime,
        endTime,
        contactNumber,
        website,
        extraDiscount,
        types,
        offers,
        amenities,
        images: images,
        menu: menu,
        owner: ownerDetails,
      });

      await restaurant.save();

      // Adding the restaurant to the owner's document
      owner.restaurants.push({
        _id: restaurant._id,
        name: restaurant.name,
        city: restaurant.city,
        location: restaurant.location,
      });

      await owner.save();

      res.status(200).json({ message: "Restaurant Added Successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/restaurant/:restaurantId", authMiddleware, async (req, res) => {
  const owner = req.user;

  if (owner) {
    const { restaurantId } = req.params;

    try {
      const restaurant = await Restaurant.findById(restaurantId);

      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }

      res.status(200).json({ restaurant });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(403).json({ error: "Unauthorized Access." });
  }
});

router.delete("/delete-restaurant/:restaurantId", authMiddleware, async (req, res) => {
  const owner = req.user;
  const restaurantId = req.params.restaurantId;

  try {
    if (!owner) {
      res.status(403).json({ error: "Unauthorized Access." });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      res.status(400).json({ error: "Invalid Restaurant ID." });
      return;
    }

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      res.status(404).json({ error: "Restaurant not found." });
      return;
    }

    if (!restaurant.owner._id.equals(owner._id)) {
      res.status(403).json({ error: "Unauthorized Access." });
      return;
    }

    await restaurant.deleteOne();

    owner.restaurants = owner.restaurants.filter(
      (rest) => !rest.equals(restaurant._id)
    );
    await owner.save();

    res.status(200).json({ message: "Restaurant Deleted Successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get('/restaurants-slider', async (req, res) => {
  try {
    const restaurants = await Restaurant.find().limit(8).select(
      '_id name city area location averageCostForTwo cuisine startTime endTime contactNumber website extraDiscount types offers amenities images menu'
    );

    res.json({restaurants});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:city/:area/:name/:_id', async (req, res) => {
  const { city, area, name, _id } = req.params;
  try {
    const restaurant = await Restaurant.findById(_id).select('-owner -reviews');

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.status(200).json({ restaurant });
  } catch (error) {
    console.error('Error fetching restaurant details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
