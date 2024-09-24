// 图像转换 model

import { model, models, Schema, Document } from "mongoose"

export interface IImage extends Document {
    title: string
    transformationType: string
    publicId: string
    secureURL: string
    width?: number
    height?: number
    config?: Record<string, unknown>
    transformationUrl?: string
    aspectRatio?: string
    color?: string
    prompt?: string
    author: {
        _id: string,
        firstName: string,
        lastName: string
    }
    createdAt: Date
    updatedAt: Date
}   

// mongoose 模型
const ImageSchema = new Schema({
    title: {
        type: String, 
        required: true
    },
    transformationType: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    },
    secureURL: {
        type: String,
        required: true
    },
    width: {
        type: Number,
    },
    height: {
        type: Number,
    },
    config: {
        type: Object,
    },
    transformationUrl: {
        type: String
    },
    aspectRatio: {
        type: String
    },
    color: {
        type: String
    },
    prompt: {
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true
    }
})

const Image = models?.Image || model('Image', ImageSchema)
export default Image