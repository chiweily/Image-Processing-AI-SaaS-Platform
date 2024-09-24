// 连接到数据库

import mongoose, { Mongoose } from 'mongoose'

const MONGODB_URL = process.env.MONGODB_URL!

interface MongooseConnection {
  conn: Mongoose | null
  promise: Promise<Mongoose> | null
}

// 全局变量类型
declare global {
  var mongoose: MongooseConnection | undefined
}

// 使用缓存机制来避免重复连接数据库 
// 在全局范围内缓存 Mongoose 连接实例和连接的 promise 对象
let cached: MongooseConnection = global.mongoose || { conn: null, promise: null }

if(!global.mongoose) {
  global.mongoose = cached
}

export const connectToDatabase = async (): Promise<Mongoose>=> {
   if(cached.conn) {
    return cached.conn
   }

   if(!MONGODB_URL) {
    throw new Error('请在 .env 文件中设置 MONGODB_URL 环境变量')
   }

   try {
    if(!cached.promise) {
      const opts = {
        dbName: 'image-processing-db',
        bufferCommands: false,
        connectTimeoutMS: 30000,
      }

      cached.promise = mongoose.connect(MONGODB_URL, opts)
    }
    cached.conn = await cached.promise
    return cached.conn
   } catch (error) {
    console.error('MongoDB 连接错误:', error);
    throw error
   }
}