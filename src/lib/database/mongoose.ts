// 连接到数据库

import mongoose, { Mongoose } from 'mongoose'

const MONGODB_URL = process.env.MONGODB_URL

interface MongooseConnection {
  conn: Mongoose | null
  promise: Promise<Mongoose> | null
}

// 在全局范围内缓存 Mongoose 连接实例和连接的 promise 对象
// 在后续操作中可以复用这些连接，避免重复连接数据库的开销
let cached: MongooseConnection = (global as any).mongoose

if(!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

export const connectToDatabase = async () => {
   if(cached.conn) {
    return cached.conn
   }

   if(!MONGODB_URL) {
    throw new Error('请在 .env 文件中设置 MONGODB_URL 环境变量')
   }

   cached.promise = cached.promise || mongoose.connect(MONGODB_URL, {
    dbName: 'project0db',
    bufferCommands: false,
   })

   cached.conn = await cached.promise
   return cached.conn
}