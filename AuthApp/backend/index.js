const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { register, login } = require('./controller/usercontroller');
require('dotenv').config();

// //8GAW9gfWl6Zki3bb
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;

 const connect = ()=>{
     return  mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      })
 }

// // controller logic 

app.post("/api/register",register)
app.post("/api/login",login)

app.listen(PORT, async()=>{
    try {

        await connect();
        console.log("listing on port")
        
    } catch (error) {
        console.log(error)
    }
})





    
  