const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');

require("../database/connection");

const User = require("../models/userModel");
const Restaurant = require("../models/restaurantModel");
const Booking = require("../models/bookingModel");
const Review = require("../models/reviewModel");
const Owner = require("../models/restaurantOwnerModel");

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
      
      const emailExist = await Owner.findOne({ email: email })
      const userExist = await Owner.findOne({ username: username })
  
      if (userExist) {
          return res.status(421).json({ error: "User Exist. Enter a different Username."});
      }else if(emailExist){
          return res.status(423).json({ error: "Email already Registered" });
      }  
      const owner = new Owner({username,password,email,fullName,phoneNumber,});
          
      await owner.save();
      res.status(201).json({ message: "User Registered Successfully." });
          
    } catch (err) {
      // console.log(err);
    }
  });

router.post("/owner-login",async(req, res) =>{
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

        res.cookie("jwtoken", token,{
          expires: new Date(Date.now() + 36000000),
          httpOnly: true
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
})  


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

router.get("/owner-home",authMiddleware,(req,res) => {
  res.send(req.user);
})

router.get("/owner-logout", (req,res) => {
  res.clearCookie('jwtoken');
  res.status(200).send("Logged Out Successfully.");
});

router.get("/add-restaurant",authMiddleware,(req,res) => {
  res.send(req.user);
})

router.post("/add-restaurant",authMiddleware, async (req, res) => {
  const owner = req.user;
  // console.log(req.user);
  const {name,city,area,location,averageCostForTwo,cuisine,openingHours,
    contactNumber,website,extraDiscount,types,offers,images,menu,
    amenities} = req.body;
    
  if (!name || !city || !area || !location || !cuisine || !contactNumber){
      res.status(402).json({error: "Marked Fields Are Mandatory"});
      return;
    }else if(!owner){
      res.status(403).json({error: "Unauthorized Access."});
      return;
    }
    try {
      const ownerDetails = {
        _id: owner._id,
        username: owner.username,
        email: owner.email,
        fullName: owner.fullName,
        phoneNumber: owner.phoneNumber
      };

      const restaurant = new Restaurant({
          name,city,area,location,averageCostForTwo,cuisine,openingHours,
          contactNumber,website,extraDiscount,types,offers,images,menu,amenities,
          owner : ownerDetails, 
      });

      await restaurant.save();
      res.status(200).json({message: "Restaurant Added Successfully."})

    } catch (error) {
      res.status(401).json({error: error});
    }
         
});

  

module.exports = router;
