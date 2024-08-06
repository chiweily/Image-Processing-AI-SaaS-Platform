// clerkId, email, userName, photo, firstName, lastName, planId, creditBalance

import { model, models, Schema } from "mongoose"

// interface
export interface User {
    _id: string,
    clerkId: string,
    email: string,
    userName: string,
    photo: string,
    firstName: string,
    lastName: string,
    planId: string,
    creditBalance: number,
    createdAt: Date,
    updatedAt: Date
}

const UserSchema = new Schema({
    clerkId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    firstName: {
        type: String
    }
})

const User = models?.User || model('User', UserSchema)
export default User