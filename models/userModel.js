import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Please add the username"],
        },
        email: {
            type: String,
            required: [true, "Please add the email address"],
            unique: [true, "Email address already registered"]
        },
        password: {
            type: String,
            required: [true, "Please add the password"],
        },
    },
    {
        timestamps: true
    }
);

export default mongoose.model("User", userSchema);