const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Abhiisagood$footballer';


//ROUTE 1: Create a User using POST: "/api/auth/createuser". No login required

router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
  ], async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Check whether the user with this email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "Sorry a user with this email already exists" })
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new user
    user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user:{
            id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({authtoken})
      
      
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })
  
//ROUTE 2: Authenticate a User using POST: "/api/auth/login". No login required

router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
  //body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {

  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email, password} = req.body; //using destructuring
  try { //pick out user which does not exists
    let user = await User.findOne({email}); //pull out user from the database
    if(!user){  //if user does not exists
      return res.status(400).json({error: "Please try to login with correct credentials"});
    }

      const passwordCompare = await bcrypt.compare(password, user.password); //password used for login compared with the user password
      if(!passwordCompare){ //if password doesn't match
        return res.status(400).json({error: "Please try to login with correct credentials"});
      }
      //if password is correct
      const data = {  //user data 
        user:{
            id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({authtoken})  //to send authentication token

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }

})

//ROUTE 3: Get logged in User details using POST: "/api/auth/getuser". Login required

router.post('/getuser',fetchuser, async (req, res) => {
try {
  userId = req.user.id;
  const user = await User.findById(userId).select("-password");    //whenever the user is found .select is used to select or get all the fields except password
  res.send(user);
} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal Server Error");
}
})
module.exports = router