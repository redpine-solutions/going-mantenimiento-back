import {
  getMongoCluster,
  getMongoDb,
  getMongoDbUri,
  getMongoPass,
  getMongoUser,
} from '@envs/vairables';

import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({
  path: __dirname + '/.env',
});

var db = getMongoDb();
var dbUser = getMongoUser();
var dbPassword = getMongoPass();
var dbCluster = getMongoCluster();

const MONGO_URI = `mongodb+srv://${dbUser}:${dbPassword}@${dbCluster}.mongodb.net/${db}`;

console.log(MONGO_URI);

const dbConnect = async () => mongoose.connect(MONGO_URI);

export default dbConnect;
