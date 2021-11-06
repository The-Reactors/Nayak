const mongoose = require('mongoose')


mongoose.connect(process.env.MONGO_URI_NAYAK, (err) => {
  
    if (err) throw err;
    console.log("Connected to MongoDB");
});