import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    userId: String,
    tokens: [{
        token: String,
        isActive: Boolean,
        lastUsed: String
    }],
    permissions: [String]
}, { timestamps: true })