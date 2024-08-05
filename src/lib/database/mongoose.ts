// 连接到数据库

import mongoose, { Mongoose } from 'mongoose'

const MONGOD_URL = process.env.MONGODB_URL

interface MongooseConnect {
  conn: Mongoose | null
  promise: Promise<Mongoose> | null

}