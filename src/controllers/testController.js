const User = require('../models/userModel.js');
const questions = require("../utils/questions.js");
const { analyzeDisorders } = require('../utils/aiService.js');

const submitAnswers = async (req, res) => {
  // console.log(req.user, "req");

  const userId = req.user._id;
  const { answers } = req.body; 

  const user = await User.findById(userId);
  const currentQuestionsAnswered = user.questionsAnswered;
  // console.log(currentQuestionsAnswered, "CQA");
  
  const questionSlice = questions.slice(currentQuestionsAnswered, currentQuestionsAnswered + answers.length);
  // console.log(questionSlice, "QS");
  
  const questionAnswerPairs = answers.map((answer, index) => ({
    question: questionSlice[index].question,
    options: questionSlice[index].options,
    answer: answer,
  }));

  user.questionsAnswered += answers.length;
  
  const { adhdScore, autismScore, dyslexiaScore } = await analyzeDisorders(questionAnswerPairs);

  if (adhdScore > 5 && !user.detectedDisorders.includes('ADHD')) {
    user.detectedDisorders.push('ADHD');
  }
  if (autismScore > 5 && !user.detectedDisorders.includes('Autism')) {
    user.detectedDisorders.push('Autism');
  }
  if (dyslexiaScore > 5 && !user.detectedDisorders.includes('Dyslexia')) {
    user.detectedDisorders.push('Dyslexia');
  }

  await user.save(); 
  res.json({ user, detectedDisorders: user.detectedDisorders });
}

module.exports = { submitAnswers };
