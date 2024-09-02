'use server'

import { connectToDatabase } from "../database/mongoose"
import { handleError } from "../utils"
import Image from "../database/models/image.model"
import { revalidatePath } from "next/cache"
import User from "../database/models/user.model"
import { redirect } from "next/navigation"
import { v2 as cloudinary } from 'cloudinary'

// 获取图像作者的信息
const populateUser = (query: any) => 
    query.populate({
        path: 'author',
        select: '_id firstName lastName',
        model: User
    })


// 添加图片
export async function addImage({ image, userId, path }: AddImageParams) {
    try {
        await connectToDatabase()

        // 图片的创作者
        const author = await User.findById(userId)
        if(!author) throw new Error("User not found")
        // 新图片
        const newImage = await Image.create({
            ...image,
            author: author._id,
        })

        revalidatePath(path)
        return JSON.parse(JSON.stringify(newImage))
    } catch (error) {
        handleError(error)
    }
}


// 更新
export async function updateImage({ image, userId, path }: UpdateImageParams) {
    try {
        await connectToDatabase()

        // 要更新的图片
        const imageToUpdate = await Image.findByIdAndUpdate(image._id)
        if(!imageToUpdate || imageToUpdate.author.toHexString() !== userId) {
            throw new Error("Unauthorized or image not found")
        }
            
        // 更新图片
        const updatedImage = await Image.findByIdAndUpdate(imageToUpdate._id, image, { new: true })

        revalidatePath(path)
        return JSON.parse(JSON.stringify(updatedImage))
    } catch (error) {
        handleError(error)
    }
}


// 删除图像
export async function deleteImage(imageId: string) {
    try {
        await connectToDatabase()

        /* const imageToDelete = await Image.findOne({id: imageId})
        if(!imageToDelete) {
            throw new Error("Image not found")
        } */

        // 删除图像
        await Image.findByIdAndDelete(imageId)
        // revalidatePath('/')
        // return deleteImage ? JSON.parse(JSON.stringify(deleteImage)) : null
    } catch (error) {
        handleError(error)
    } finally {
        redirect('/')
    }
}


// 获取图片
export async function getImageById(imageId: string) {
    try {
        await connectToDatabase()

        // 除了图片外，还需要获取图片作者的信息
        const image = await populateUser(Image.findById(imageId))
        
        if(!image) {
            throw new Error("Image not found")
        }

        return JSON.parse(JSON.stringify(image))

    } catch (error) {
        handleError(error)
    }
}


// 获取当前所有图片
export async function getAllImages({ limit = 9, page = 1, searchQuery = ''}: {
    limit?: number;
    page?: number;
    searchQuery?: string;
}) {
    try {
        await connectToDatabase()

        cloudinary.config({
            cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true
        })

        // 初始化设置
        let expression = 'folder=imaginify'

        // search 的内容pin到cloudinary
        if(searchQuery) {
            expression += `AND ${searchQuery}`
        }

        // 执行搜索操作，resources属性包含了搜索到的资源
        const { resources } = await cloudinary.search.expression(expression).execute()

        // 获取search到的结果的id
        const resourceIds = resources.map((resource: any) => resource.public_id)

        let query = {}
        if(searchQuery) {
            query = {
                publicId: {
                    $in: resourceIds
                }
            }
        }

        
        const skipAmount = (Number(page) - 1) * limit

        // 从数据库中获取图像数据，并对其进行排序、分页、数量限制
        const images = await populateUser(Image.find(query).sort({ createdAt: -1 }).skip(skipAmount).limit(limit))
        
        const totalImages = await Image.find(query).countDocuments()
        const savedImages = await Image.find().countDocuments()

        return {
            data: JSON.parse(JSON.stringify(images)),
            totalPage: Math.ceil(totalImages / limit),
            savedImages
        }

    } catch (error) {
        handleError(error)
    }
}