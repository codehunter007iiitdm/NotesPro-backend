const express=require('express')
const router=express.Router();  //instead of app.get we r using router.get
const User=require('../models/User')
const {body,validationResult}=require('express-validator')  //express validator docs
const bcrypt=require('bcrypt')
var jwt=require('jsonwebtoken')
const fetchuser=require('../middleware/fetchuser') //Thus is middle ware 


router.post('/createuser',[ // express validator validations array
    body('name','Enter a valid name').isLength({min:3}),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be atleat 5 characters').isLength({min:5})
],async (req,res)=>{
    let success=false;
    //if errors request errors(check express-validator documentation)
    const result = validationResult(req);
    if(!result.isEmpty()){
        return res.status(400).json({success,errors:result.array()})
    }
    try{  //Using the try block just to ensure, if any unkown error occurs
    //check whether the user with this email exists already (This a way to maintain unique emails instead of using indexes)
    let user=await User.findOne({email:req.body.email})
    if(user){
        return res.status(400).json({success,error:"The email is already taken"})
    }
    const salt=10;
    const securePassword= await bcrypt.hash(req.body.password,salt); //Hasing the user password using bcrypt

    //Creating a user 
    user=await User.create({
        name:req.body.name,
        password:securePassword,
        email:req.body.email,
    })

    var token = jwt.sign({ id:user.id}, 'shhhhh'); //using jwt to  generate a token
    success=true
    res.json({success,token})
}
catch(error){
    res.status(500).send("Internal Server Error")
}
    //.then(user=>res.json(user))
    //.catch(err=>{console.log(err)
    //res.json({error:'please enter a unique credential'})})
})

// Login end point
router.post('/login',[ // express validator validations array
    body('email','Enter a valid email').isEmail(),
    body('password','password cannot be blank').exists()
],async (req,res)=>{
    let success=false;
    //if errors request errors(check express-validator documentation)
    const result = validationResult(req);
    if(!result.isEmpty()){
        return res.status(400).json({errors:result.array()})
    }
    const {email,password}=req.body; //destructuring the details from req.body **
    try{
        let user=await User.findOne({email});
        if(!user){
            return res.status(400).json({success,error:"sorry the user does not exist"})
        }
        const passwordCompare=await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).json({error:"sorry the user does not exist"})
        }
        var token = jwt.sign({ id:user.id}, 'shhhhh'); //using jwt to  generate a token
        success=true
        res.json({success,token})

    }
    catch(error){
        console.log(error)
    }

})




// To get loggedin user details using: POST "/api/auth/getuser". Login required
router.post('/getuser',fetchuser,async (req,res)=>{

    try{
       let userId=req.user;
        const user=await User.findById(userId).select("-password")
        res.send(user)

    }
    catch(error){
        console.log(error)
        res.status(500).send("Something went wrong")
    }

})

module.exports=router

