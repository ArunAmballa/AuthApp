const User=require("../model/user");
const bcrypt=require("bcrypt")

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
