const jwt=require('jsonwebtoken');
require("dotenv").config();

exports.auth=(req,res,next)=>{

    try{

        //Extract JWT Token
        const token=req.body.token;

        if (!token){
            return res.status(101).json({
                success:false,
                message:"Token Missing"
            })
        }

        //Verify Token

        try{
            const decode=jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode;

        }catch(err){
            return res.status(401).json({
                success:false,
                message:"Token is Invalid"
            })
        }

        next();

    }catch(err){
        return res.status(401).json({
            success:false,
            message:"something Went wrong while Verifying Token"
        })
    }
}

exports.isStudent=(req,res,next)=>{
    try{

        if (req.user.role!=="Student"){
            return res.status(401).json({
                success:false,
                message:"This is Protected route for Student"
            })
        }
        next();

    }catch(err){
        return res.status(500).json({
            success:false,
            message:" User role is not matching"
        })
    }
}

exports.isAdmin=(req,res,next)=>{
    try{

        if (req.user.role!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"This is Protected route for Admin"
            })
        }
        next();

    }catch(err){
        return res.status(500).json({
            success:false,
            message:" User role is not matching"
        })
    }
}