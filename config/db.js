
// const mongoose = require('mongoose');
// const config = require('config');
// const { MongoClient, ServerApiVersion } = require("mongodb");
// const db = config.get('mongoURI');
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });


// const connectDB = async () => {
//   try {
//     await client.connect(uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log('Pinged your deployment. You successfully connected to MongoDB!');
//   } catch (err) {
//     console.error(err.message);
//     process.exit(1);
//   }
// };

const mongoose = require('mongoose');
const config = require('config');
const uri = config.get('ATLAS_URI');

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;


