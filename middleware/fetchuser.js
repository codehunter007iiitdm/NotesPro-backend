//this is a middle ware which hepls to retrieve user id from header and add it to req object

const jwt=require('jsonwebtoken')

const fetchuser=(req,res,next)=>{ //it takes three arguements
    //getting the user from the jwt token and add id to req object
    const token=req.header('auth-token')

    if(!token){
        res.status(401).send({error:"please authenticate using a valid token"})
    }
    const data=jwt.verify(token,'shhhhh')
    req.user=data.id 
    next()

}

module.exports=fetchuser;