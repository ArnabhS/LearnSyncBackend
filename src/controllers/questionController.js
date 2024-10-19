const User = require("../models/userModel.js");
const questions = require("../utils/questions.js");

const getQuestions = async( req, res)=>{
    try {
        const user = await User.findById(req.user._id)
        console.log(user);
        
        if(!user){
            return res.status(404).json("User not found");
        }
      
        let firstLoginQuestions = null;
        if(user.loginCount == 1){

            firstLoginQuestions = questions.slice(0, 5);
        }
        console.log(firstLoginQuestions);
        
        return res.status(200).json({
            firstLoginQuestions
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json("Intenal Server Error")
    }
}

module.exports = { getQuestions }