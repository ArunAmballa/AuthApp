const User=require("../model/user");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken");
const { options } = require("../routes/user");
require("dotenv").config()
//signup Controller

exports.signup=async(req,res)=>{
   
    try
    {
        const {name,email,password,role}=req.body;
        //check if already exists 
        const existingUser=await User.findOne({email});
        
        if (existingUser){
            return res.status(500).json({
                success:false,
                message:"User Already Exists",
            });
        }
        //secure Password
        let hashedPassword
        try{
            hashedPassword=await bcrypt.hash(password,10);
        }
        catch(err){
            return res.status(500).json({
                success:false,
                message:"Error in hashing Password",
            });
        }
        

        //create entry for user
        const username=await User.create({
            name,email,password:hashedPassword,role
        })

        res.status(200).json({
            success:true,
            message:"Signup Successfully",
        });

    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            message:"Cannot Create User",
        })
    }
}

exports.login=async(req,res)=>{

    try{
            const {email,password}=req.body;

            if (!email || !password){
                return res.status(500).json({
                    success:false,
                    message:"Please fill all details",
                })

            }
            
            //Check if user is registered or not
            const user=await User.findOne({email})

            if (!user){
                return res.status(401).json({
                    success:false,
                    message:"user not found"
                })
            }

            const payload={
                email:user.email,
                id:user._id,
                role:user.role
            };
            if (await bcrypt.compare(password,user.password)){
                    //After Login
                    //Create JWT Token

                    let token=jwt.sign(payload,process.env.JWT_SECRET,{
                        expiresIn:"2h",
                    });
                    
                    user.token=token;
                    user.password=undefined;

                    //Create Cookie
                    const options={
                        expires: new Date(Date.now()+3*24*60*60*1000),
                        httpOnly:true,

                    }
                    res.cookie("token",token,options).status(200).json({
                        success:true,
                        token,
                        user,
                        message:"user Logged In Successfully"
                    });



            }
            else{
                return res.status(403).json({
                    success:false,
                    message:"Password Incorrect"
                })
            }

    }
    catch(err){

        return res.status(500).json({
            success:false,
            message:"Login Failed",
        })

    }
}
