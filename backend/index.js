const express = require('express');
const dotenv = require('dotenv');
const rootRouter = require('./routes/index');
const app = express();
app.use(express.json());
dotenv.config();
app.get('/',(req,res)=>{
  res.send("Hello from Backend");
})

app.use('/api/v1/',rootRouter);

const port = process.env.PORT || 3000;
app.listen(port,()=>{
 console.log(`The server is running on port ${port} https://localhost:${port}`);
})





