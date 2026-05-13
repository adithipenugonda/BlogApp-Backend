import express from 'express';
import bcrypt from 'bcryptjs';
import { authenticate } from '../services/authService.js'
import { verifyToken } from '../middleware/verifyToken.js'
import { UserTypeModel } from '../models/userModel.js';
import { ArticleModel } from '../models/articleModel.js';

export const commonRouter = express.Router()

// Get single article by ID (any logged-in user)
commonRouter.get('/articles/:articleId', verifyToken("USER","AUTHOR","ADMIN"), async (req, res) => {
    let articleId = req.params.articleId
    let article = await ArticleModel.findOne({ _id: articleId, isArticleActive: true })
        .populate("author", "firstName lastName email profileImageUrl")
        .populate("comments.user", "firstName lastName profileImageUrl")
    if (!article) {
        return res.status(404).json({ message: "Article not found" })
    }
    res.status(200).json({ message: "article", payload: article })
})


//login
commonRouter.post('/login',async(req,res)=>{
    //get user cred object
    let userCred=req.body
    //call authenticate service
    let {token,user} = await authenticate(userCred)
    //save httponlt cookie
    res.cookie("token",token,{
        httpOnly:true,
        sameSite:"none",
        secure:true
    })
    //send res
    res.status(200).json({message:"login success",payload:user})
})

//check auth
commonRouter.get('/check-auth', verifyToken("USER", "AUTHOR", "ADMIN"), async(req, res) => {
    try {
        let user = await UserTypeModel.findById(req.user._id || req.user.userId).select("-password");
        if (!user || user.isActive === false) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        res.status(200).json({ message: "Authenticated", payload: user });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});


//logout
commonRouter.use('/logout',(req,res)=>{
    res.clearCookie('token',{
        httpOnly:true,
        secure:true,
        sameSite:"none"
    })
    res.status(200).json({message:"logout success"})
})


//change the password
commonRouter.put('/change-password', verifyToken, async(req, res)=>{
    //get details from req
    let { userId, oldPassword, newPassword } = req.body;

    //check for the correct password
    const user = await UserTypeModel.findById(userId);
    let match = await bcrypt.compare(oldPassword, user.password);
    if(!match) {
        return res.status(403).json({ message: "Invalid password" });
    }

    //check if the passwords are same
    if(oldPassword === newPassword) {
        res.status(403).json({ message: "User cannot enter same password again" });
    }

    //replace the current password with the new password
    user.password = await bcrypt.hash(newPassword, 10);
    user.save();

    //temporary statement just for checking purpose
    let temp = await bcrypt.compare(newPassword, user.password);

    //send response
    res.status(200).json({ message: "Password changed successfully", payload: temp });
})


// commonRouter.get('/check-auth', verifyToken("USER","AUTHOR","ADMIN"), (req,res)=>{
//     res.status(200).json({
//         message:"user is authenticated",
//         payload:req.user
//     })
// })