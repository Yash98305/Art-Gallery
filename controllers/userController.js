const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("../middlewares/catchAsyncError.js");
const User = require("../models/uerModel.js");

const sendToken = require("../jwtToken/jwtToken.js");
const sendEmail = require("../utils/nodemailer.js");
const fs = require("fs") ;
const assert = require("assert");



exports.userLoginController = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  sendToken(user, 200, res);
});

exports.userRegisterController = catchAsyncErrors(async (req, res, next) => { 
  const {name,phone, email, password } = req.body;
  if (!name|| !phone || !email || !password) {
    return next(new ErrorHandler("Please Enter Required Field", 400));
  }
  const usere = await User.findOne({ email }).select("+password");
  if (usere) {
    return next(new ErrorHandler("Email Exist", 401));
  }
    const user = new User({
      ...req.body
    });
    await user.save(); 
    sendToken(user, 201, res);
});

exports.getUserDetailsController = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user,
  });
});


exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }
  if (req.body.newPassword !== req.body.conformPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }
  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  
  const { photo } = req.files;
 
  if(photo && photo.size > 1000000){
    return res
      .status(400)
      .send({ error: "photo is Required and should be less then 1mb" });
}

const user = await User.findByIdAndUpdate(
  req.params.id,
  { ...req.fields},
  { new: true,
    runValidators: true,
    useFindAndModify: false, }
);

if (photo) {
  console.log(photo)
  user.photo.data = fs.readFileSync(photo.path);
  user.photo.contentType = photo.type;
}

await user.save();
  res.status(200).json({
    success: true,
    user
  });
});



exports.getAllUsersPhotoController = catchAsyncErrors(async (req, res,next) => {
  const users = await User.findById(req.params.pid).select("photo");
  // if(!users.photo.data){
  //   return res.status(200).json({
  //     success:false
  //   })
  // }
    if (users.photo.data) {
      res.set("Content-type", users.photo.contentType);
      return res.status(200).send(users.photo.data);
    }
  
})


// exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
//   const user = await User.findById(req.params.id);
//   if (!user) {
//     return next(
//       new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
//     );
//   }
//   res.status(200).json({
//     success: true,
//     user,
//   });
// });

// exports.logout = catchAsyncErrors(async (req, res, next) => {
//   res.cookie("token", null, {
//     expires: new Date(Date.now()),
//     httpOnly: true,
//   });
//   res.status(200).json({
//     success: true,
//     message: "Logged Out",
//   });
// });

exports.postOTPController = catchAsyncErrors(async (req, res, next) => {
  const { email, otp, newPassword, conformPassword } = req.body;
  if (newPassword !== conformPassword) {
    return next(new ErrorHandler("Password Mismatch", 400));
  }
  const user = await User.findOne({ email });
  if (user.otp !== otp) {
    return next(new ErrorHandler("Invalid OTP, check your email again", 400));
  }
  user.password = newPassword;
  await user.save();
  sendToken(user, 200, res);
});

exports.forgotPasswordController = catchAsyncErrors(async (req, res, next) => {
  const useremail = req.body.email;
  const user = await User.findOne({ email: useremail });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  function generateOTP() {
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }
  const OTP = await generateOTP();
  user.otp = OTP;
  await user.save();
  await sendEmail(useremail, OTP, "OTP");
  res.status(200).json({
    success: true,
    message: `check your registered email (${useremail}) for OTP`,
  });
  const helper = async () => {
    user.otp = "";
    await user.save();
  };
  setTimeout(function () {
    helper();
  }, 300000);
});




exports.uploadFileController = catchAsyncErrors(async(req,res,next)=>{
  if(!req.file){
    return res.status(404).json("file not found")
  }
  const imageUrl = `http://localhost:8000/api/v1/user/file/${req.file.filename}`
  return res.status(200).json(imageUrl)
})