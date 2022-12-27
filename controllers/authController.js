const jwt = require('jsonwebtoken');
const mongooseError = require('mongoose-error');
const User = require('../model/User');
const sendVerificationEmail = require('../Utils/sendVerificationEmail');
const sendResetPassswordEmail = require('../Utils/passwordResetEmail');
//const transporter = require('../Utils/emailConfig')

const register = async(req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email ||!password ) {
        return res.status(422).json({message: 'name , email and password are required'});
    }
    const emailAlreadyExists = await User.findOne({ email }).exec();
    if (emailAlreadyExists) {
        return res.status(401).json({message: 'Email is already in use.'})
    }
    const user = await User.create(req.body);
    const origin = 'http://localhost:5000/api'
    const verificationToken =  user.createToken();
  
    await sendVerificationEmail( {name: user.name, email: user.email, verificationToken: verificationToken,  origin} );


    return res.status(201).json({message: 'verification link has been sent to your email.', token: verificationToken});

}

const verifyEmail = async(req, res) => {
 const verificationToken = req.query.token;
 if (!verificationToken) {
    return res.status(422).json({message: "missing token"});
 }
 let payload = null;
 try {
    payload = jwt.verify(
        verificationToken,
        process.env.JWT_SECRET
    );
 } catch (error) {
    return res.status(500).json({message: "Invalid token"});
 }
 const user = await User.findOne({_id: payload.userId});
 try {
   
    if (!user) {
        return res.status(404).json({ 
           message: "User does not  exists" 
        });
     }
     
    user.isVerified= true;
    await user.save();
    // await user.updateOne({isVerified: true});
     return res.status(200).json({
           message: "Account Verified"
     });
 } catch (error) {
    return res.status(500).json({message: "something went wrong"});
 }
}

const login = async (req, res) => {
   const { email, password } = req.body;
   if (!email || !password) {
      return res.status(400).json({error: "email and password are required"});
   }
   const user = await User.findOne({ email }).exec();
   if (!user) {
       return res.status(404).json({error: "Sorry, we could not find your account."});
   }
   if(!user.isVerified){
      return res.status(403).json({ 
            message: "Verify your Account." 
      });
   }
   const isPasswordCorrect = await user.comparePassword(password); 
   if (!isPasswordCorrect) {
      return res.status(400).json({error: "Invalid credentials."});
   }
   const verificationToken = user.createToken();
   res.status(200).json({message: "login success", token: verificationToken});

 }

 const forgotPassword = async(req, res) => {
   const { email } = req.body;
   
      const user = await User.findOne({email});
   
      if (!user) {
         res.status(404).send('error: no user found');
      }
      const origin = 'http://localhost:5000/api'
      const verificationToken =  user.createToken();
      await sendResetPassswordEmail({name: user.name, email: user.email, token: verificationToken, origin});

      return res.status(200).send('Password reset link has been sent to your email');
 
  
 } 

 const resetPassword = async(req, res) => {
   const  verificationToken = req.query.token;
   const {password} = req.body;
   let payload = null;
 try {
    payload = jwt.verify(
        verificationToken,
        process.env.JWT_SECRET
    );
 } catch (error) {
    return res.status(500).json({message: "Invalid token"});
 }
 const user = await User.findOne({_id: payload.userId});
 try {
   
    if (!user) {
        return res.status(404).json({ 
           message: "User does not  exists" 
        });
     }
     
    user.password= password;
    await user.save();
    // await user.updateOne({isVerified: true});
     return res.status(200).json({
           message: "Password reset was succesful."
     });
 } catch (error) {
    return res.status(500).json({message: error});
 }

 }

module.exports = { register, verifyEmail, login, forgotPassword, resetPassword };
