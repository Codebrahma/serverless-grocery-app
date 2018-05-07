import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
let isConnected;

const dbConnection = () => {
  console.log('isConnected at start ', isConnected);
  if (isConnected) {
    console.log('=> From Existing DB connection');
    return Promise.resolve();
  }

  console.log('=> Using new DB connection');
  return mongoose.connect("mongodb://prasanna1211:hellomid125@cluster0-shard-00-00-m5ypw.mongodb.net:27017,cluster0-shard-00-01-m5ypw.mongodb.net:27017,cluster0-shard-00-02-m5ypw.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin")
    .then(db => { 
      console.log('Connected : ' + db.connections[0].readyState);
      isConnected = db.connections[0].readyState;
    });
};

export default dbConnection;