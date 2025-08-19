const mongoose = require('mongoose')

module.exports.dbConnect = async () => {
    
    try{
        await mongoose.connect(process.env.DB_URL)
        console.log('Database connected successfully.................')

    }catch(error){
        console.log('Database connection failed : ', error.message)
         process.exit(1);
    }
}