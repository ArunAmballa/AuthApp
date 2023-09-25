const express=require("express")
const router=express.Router();

const {login,signup}=require("../controllers/Auth");
const {auth,isStudent,isAdmin}=require("../middlewares/auth");

router.post("/login",login)
router.post("/signup",signup);


//Protected Routes
router.get("/test",auth,(req,res)=>{
    return res.status(200).json({
        success:true,
        message:"Welcome to testing route"
    })
})
router.get("/student",auth,isStudent,(req,res)=>{
    return res.status(200).json({
        success:true,
        message:"welcome to protected route of Student"
    })
});

router.get("/admin",auth,isAdmin,(req,res)=>{
    return res.status(200).json({
        success:true,
        message:"welocme to protected route of Admin"
    })
})
module.exports=router;