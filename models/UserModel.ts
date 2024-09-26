import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,  // Ensure email is unique
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin:{
        type: Boolean,
        required: true,
        default: false
    }
});

// Check if the model already exists, and if not, define it
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
