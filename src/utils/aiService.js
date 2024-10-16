const { CohereClientV2 } = require('cohere-ai');
const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});

const analyzeDisorders = async (questionAnswerPairs) => {

  const prompt = "Analyze the following question and answer pairs to detect if the user has ADHD, Autism, Dyslexia, or other disorders.";
  const inputs = questionAnswerPairs.map(
    pair => `Question: ${pair.question} | Options: ${pair.options.join(' | ')} | Answer: ${pair.answer}`
  ).join('\n');  

  
  const response = await cohere.chat({
    model: 'command-r-plus',
    messages: [
      {
        role: 'user',
        content: `${prompt}\n${inputs}`,  
      },
    ],
  });

  const aiContent = response.message?.content;
  if (!aiContent || !Array.isArray(aiContent)) {
    throw new Error('Unexpected AI response format');
  }
  const disorders = aiContent.map(item => item?.text || 'Unknown Disorder'); 

  return disorders;  
  
};

module.exports = { analyzeDisorders };
