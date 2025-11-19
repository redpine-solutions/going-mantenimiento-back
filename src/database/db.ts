import { getMongoDb, getMongoDbUri, getMongoPass, getMongoUser } from '@envs/vairables';

import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({
  path: __dirname + '/.env',
});

var db = getMongoDb();
var db_user = getMongoUser();
var db_password = getMongoPass();
var uri = getMongoDbUri();

const MONGO_URI = `mongodb+srv://${db_user}:${db_password}@${uri}/${db}`;

console.log(MONGO_URI);

const dbConnect = async () => mongoose.connect(MONGO_URI);

export default dbConnect;
