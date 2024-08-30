'use server'

import { revalidatePath } from "next/cache"
import User from "../database/models/user.model"
import { connectToDatabase } from "../database/mongoose"
import { handleError } from "../utils"

// 创建新用户
export async function createUser(user: CreateUserParams) {
    try {
        await connectToDatabase()
        const newUser = await User.create(user)

        return JSON.parse(JSON.stringify(newUser))
    } catch (error) {
        handleError(error)
    }
}

// 读取用户信息
export async function getUserById(userId: string) {
    try {
        await connectToDatabase()
        const user = await User.findOne({clerkId: userId})

        if(!user) { 
            console.log(`User not found for clerkId: ${userId}`)
            throw new Error("User not found")
        }

        return JSON.parse(JSON.stringify(user))
    } catch (error) {
        handleError(error)
    }
}

// 更新用户信息
export async function updateUser(clerkId: string, user: UpdateUserParams) {
    try {
        await connectToDatabase()

        const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true })

        if(!updatedUser) { throw new Error("User update failed")}

        return JSON.parse(JSON.stringify(updatedUser))
    } catch (error) {
        handleError(error)
    }
}

// 删除用户
export async function deleteUser(clerkId: string) {
    try {
        await connectToDatabase()

        const userToDelete = await User.findOne({clerkId})

        if(!userToDelete) {
            throw new Error("User not found")
        }

        // delete user
        const deleteUser = await User.findByIdAndDelete(userToDelete._id)
        revalidatePath('/')

        return deleteUser ? JSON.parse(JSON.stringify(deleteUser)) : null
    } catch (error) {
        handleError(error)
    }
}

/**
 * 更新用户credits
 * @param userId 
 * @param creditFee 要更新的额度
 * @returns 更新后的用户对象的字符串表示
 * @throws {Error} 如果更新失败
 */
export async function updateCredits(userId: string, creditFee: number) {
    try {
        await connectToDatabase()

        // 查找并更新指定用户的信用额度
        const updatedUserCredits = await User.findOneAndUpdate(
            {_id: userId},
            // 将 creditFee 的值添加到用户的 creditBalance 字段中
            { $inc: {creditBalance: creditFee}},
            {new: true}
        )
        if(!updatedUserCredits) 
            throw new Error("User credits update failed")
            return JSON.parse(JSON.stringify(updatedUserCredits))
        
        } catch (error) {
            handleError(error)
        }
}
