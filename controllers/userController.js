import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// @desc Register a user
// @route POST /api/users/register
// @access public
const registerUser = expressAsyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandotory");
    }

    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("Hashed Password:", hashedPassword);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });
    console.log("User created:", user);
    if (user) {
        res.status(201).json({ id: user.id, email: user.email });
    } else {
        res.status(400);
        throw new Error("User data is not valid");
    }
    // res.send({ message: "Registered user" });
});

// @desc Login a user
// @route POST /api/users/login
// @access public
const loginUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const user = await User.findOne({ email });
    // compare entered password with hashed password
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "15m"}
        );
        res.status(200).json({ accessToken });
    }else{
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

// @desc Get current user info
// @route GET /api/users/current
// @access private
const currentUser = expressAsyncHandler(async (req, res) => {
    res.send(req.user);
});

export { registerUser, loginUser, currentUser };