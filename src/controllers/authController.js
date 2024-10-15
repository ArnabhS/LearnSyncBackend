const User = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
  };
  

const registerUser = async (req,res)=>{
    
    try {
        const { name, email, password } = req.body;
        console.log(name,email)
        const userExists = await User.findOne({ email });
        
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
          }
        
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
          });
          if (user) {
            return res.status(201).json({
               _id: user._id,
               name: user.name,
               email: user.email,
               token: generateToken(user._id),
             });
           } else {
             res.status(400);
             throw new Error('Invalid user data');
           }
    } catch (error) {
        console.log(error.message);
        res.status(500).json("Internal Server Error");
    }
}

const loginUser = async (req , res)=>{

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
      
        if (user && (await bcrypt.compare(password, user.password))) {
        
        user.loginCount += 1; 
        await user.save();
        const token = generateToken(user._id);
        return res
        .cookie("jwt", token, {httpOnly: true,})
        .json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        });
      } else {
        res.status(401);
        throw new Error('Invalid email or password');
      }
    } catch (error) {
        console.log(error.message);
        res.status(500).json("Internal Server Error");
    }
}


const getUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json(user);
      // console.log(user)
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const logoutUser =(async (req, res) => {
      res.clearCookie('jwt', '', {
        httpOnly: true
      });
      res.json({ message: 'User logged out' });
    });

module.exports = { registerUser, loginUser , logoutUser , getUser }