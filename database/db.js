const mongoose = require('mongoose');
const connectDB = async()=>{
    try {
        await mongoose.connect("mongodb://localhost:27017/E-Commerce",{family:4})
        console.log("mongodb connected.....")
    } catch (error) {
        console.log("error" + error.message)
    }
}
module.exports = connectDB