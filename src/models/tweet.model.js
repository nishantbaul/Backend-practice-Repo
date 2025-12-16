import mongoose, { Schema, Types } from "mongoose";
const tweetSchema = new Schema({
    content: {
        type: Schema,
        required: true
    },
    owner: {
        Types: Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

export const Tweet = mongoose.model("Tweer", tweetSchema)