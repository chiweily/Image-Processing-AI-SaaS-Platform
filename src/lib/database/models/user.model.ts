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
    planId: number,
    creditBalance: number,
}

// schema
const UserSchema = new Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    photo: {
        type: String,
        required: true,
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    planId: {
        type: Number,
        default: 1
    },
    creditBalance: {
        type: Number,
        default: 10
    } 
})

const User = models?.User || model('User', UserSchema)
export default User