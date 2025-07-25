import mongoose from "mongoose";

export async function dbConnection() {
    try {
        
        if(mongoose.connections[0].readyState){
            console.log("Already connected")
            return
        }

        await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_USERNAME}`)
        const connection = mongoose.connection
        
        connection.on("connected",()=>{
            console.log("DB is connected");
        })

        connection.on("error",(error)=>{
          console.log("DB connection is failed make sure db is up and running")  
          console.log(error)
        })

    } catch (error) {
        console.log("Something went wrong in db connection")
        console.error(error)
        process.exit(1)
    }
}