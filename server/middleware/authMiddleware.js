const jwt = require('jsonwebtoken');
const Owner = require("../models/restaurantOwnerModel");

const authMiddleware = async (req,res,next) =>{
    try {
        const token = req.cookies.jwtoken;
        // console.log("token:",token);
        const tokenVerify = jwt.verify(token,process.env.SECRET_KEY);

        const user = await Owner.findOne({_id:tokenVerify._id,"tokens.token":token});
        if(!user){
            throw new Error("User not Found.");
        }
        req.token = token;
        req.user = user;
        req.userID = user._id;
        
        next();

    } catch (error) {
        res.status(401).send("Unauthorized: No Token Found.");
        console.log(error);
    }
};

module.exports = authMiddleware;