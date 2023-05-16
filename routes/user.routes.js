const express=require("express")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
require("dotenv").config()
const { UserModel } = require("../models/user.model")

const userRoutes=express.Router()

userRoutes.post('/register',async(ask,give)=>{
    try {
        let payload=ask.body
        let userSearch=await UserModel.find({email:payload.email})
        if(userSearch.length){
            give.send({msg:"Already Registered, Please Login"})
        }else{
            let hash=await bcrypt.hash(payload.password,2)
            payload.password=hash
            let user=new UserModel(payload)
            await user.save()
            give.send({msg:"User Registered, Please Login"})
        }
    } catch (error) {
        give.send({Error:""})
    }
})


userRoutes.post('/login',async(ask,give)=>{
    try {
        let payload=ask.body
        let userSearch=await UserModel.find({email:payload.email})
        if(userSearch.length){
            userSearch=userSearch[0]
            let res=await bcrypt.compare(payload.password,userSearch.password)
            if(res){
                let token= await jwt.sign({id:userSearch._id},process.env.secret)
                give.send({msg:"Login Successfull",token,name:userSearch.name})
            }else{
                give.send({msg:"Wrong Credentials"})
            }
        }else{
            give.send({msg:"Please Register First!"})
        }
    } catch (error) {
        console.log(error)
        give.send({Error:""})
    }
})

userRoutes.get('/contacts',async(ask,give)=>{
    let contacts=await UserModel.distinct("name")
    give.send(contacts)
})

module.exports={
    userRoutes
}
