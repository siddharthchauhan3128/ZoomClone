import User from "../models/user.model.js";
import bcrypt,{hash} from "bcrypt";
import crypto from "crypto";
import Meeting from "../models/meeting.model.js";

const registerUser = async(req, res) => {
    const { name, email, username, password } = req.body;
    
    if(!name || !email || !username || !password){
        return res.status(400).json({
            success: false,
            message: "Please fill all the fields"
        });
    }

    try {
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // 1. Create the user instance first
        const user = new User({
            name,
            email,
            username,
            password: hashedPassword
        });

        // 2. Now you can safely generate the token and save
        const token = crypto.randomBytes(20).toString('hex');
        user.token = token;

        await user.save(); // This saves the user WITH the token

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user // This will now include the token and the _id
        });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const LoginUser = async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"Please fill all the fields"
        })
    }
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message: "User does not exist"
            })
        }
        const isPassword = await bcrypt.compare(password,user.password);
        if(isPassword){
            let token = crypto.randomBytes(20).toString('hex');
            user.token = token;
            await user.save();

            res.status(200).json({
                success:true,
                message:"User loggin successfully",
                user : user,
            })

        }
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error"});
    }

}


const getUserHistory = async(req,res)=>{
    const {token} = req.query
    try{
        const user = await User.findOne({token : token});

        if (!user) {
            return res.status(401).json({ message: "Invalid token or user not found" });
        }

        const meeting = await Meeting.find({user_id : user._id});
        res.json(meeting);
    }catch(e){
        console.log(e);
        res.status(500).json({ message: "Server error fetching history" });
    }
}

const addToHistory = async(req,res)=>{
     const { token, meeting } = req.body;
    console.log(req.body);

    try {
        const user = await User.findOne({ token: token });
        
        if (!user) {
            return res.status(401).json({ message: "Invalid token or user not found" });
        }
        
        // Creates the new document matching your meeting.model.js schema perfectly
        const newMeeting = new Meeting({ 
            user_id: user._id, 
            meetingCode: meeting 
        });

        await newMeeting.save();
        res.json({ message: "Meeting added to history" });
        
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Meeting not added to history", error: e.message });
    }
}


export {registerUser,LoginUser, getUserHistory, addToHistory};
