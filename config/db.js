const mongoose =require("mongoose")

require("dotenv").config()

const connectToDb=mongoose.connect(process.env.DBURL)

module.exports={
    connectToDb
}