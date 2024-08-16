// 图像转换 model

import { model, models, Schema } from "mongoose"

export interface IImage extends Document {
    title: string
    tansformationType: string
    publicId: string
    secureUrl: string
    width?: number
    height?: number
    config?: object
    transformationUrl?: string
    aspectRatio?: string
    color?: string
    prompt?: string
    author: {
        _id: string,
        firstName: string,
        lastName: string
    }
    createAt: Date
    updateAt: Date
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
    secureUrl: {
        type: URL,
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
        type: URL
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
    createAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    updateAt: {
        type: Date,
        default: Date.now,
        required: true
    }
})

const Image = models?.Image || model('Image', ImageSchema)
export default Image