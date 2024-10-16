const User = require('../models/userModel.js');
const questions = require("../utils/questions.js")
const { analyzeDisorders } = require('../utils/aiService.js')
const submitAnswers = async(req,res)=>{
  console.log(req.user,"req");
  
    const  userId = req.user._id;

    const { answers } = req.body; 

    const user = await User.findById(userId);
  
    const currentQuestionsAnswered = user.questionsAnswered;
    console.log(currentQuestionsAnswered , "CQA");
    
    const questionSlice = questions.slice(currentQuestionsAnswered, currentQuestionsAnswered + answers.length);
      console.log(questionSlice ,"QS");
      
    const questionAnswerPairs = answers.map((answer, index) => ({
      question: questionSlice[index].question,
      options: questionSlice[index].options,
      answer: answer, 
    }));
    user.questionsAnswered += answers.length;
    const disorders = await analyzeDisorders(questionAnswerPairs);
    user.detectedDisorders.push(...disorders);
    await user.save();
    res.json({ user, disorders });

}

module.exports = { submitAnswers }