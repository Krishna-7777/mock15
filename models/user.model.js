const mongoose=require("mongoose")

const schema=mongoose.Schema({
    name:String,
    password:String,
    email:String
})

const UserModel=mongoose.model("users",schema)

module.exports={
    UserModel
}