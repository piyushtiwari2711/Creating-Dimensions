const express = require('express');
const router = express.Router();
//user
router.get('/',(req,res)=>{
    res.send('hi from user router')
})
module.exports = router;