const express = require("express")
const dotenv = require("dotenv")
const  {OpenAI}  = require("openai");
const Configuration = require("openai")

dotenv.config();

const router = express.Router();

//chatgpt completion

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAI(configuration)

router.post("/chat", async (req , res) =>{
  const { prompt , chatId, model, session} = req.body
  console.log(req.body);
try {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{role: "assistant", content: prompt}],
    temperature: 0.9,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  })
  const response = completion.choices[0].message.content
   res.send(response);
   
  }catch(err){
    res.status(500).send(err.message)
  }
})

module.exports = router ;