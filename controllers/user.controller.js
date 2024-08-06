import { User } from "../models/user.models.js";
import uploadonCloudinary from "../utils/cloudinary.js";
async function registerUser(req, res) {
  try {
    const { fullName, username, email, password } = req.body;

    //validate the none of the feilds are empty
    console.log(fullName, username, email, password);
    const isUserValidate = [username, email, password, fullName].some(
      (user) => user?.trim() === ""
    );
    if (isUserValidate) {
      return res.status(401).json({
        error: "invalid feild all feild are required",
        message: "failed to register the user",
      });
    }
    if (!email.includes("@")) {
      return res.status(401).json({
        error: "email feild are required ",
        message: "failed to register the user",
      });
    }
    if (password.length < 6) {
      return res.status(401).json({
        error: "password must be at least 6 characters",
        message: "failed to register the user",
      });
    }
    if (password.length > 16) {
      return res.status(401).json({
        error: "password is less than the 16 characters",
        message: "failed to register the user",
      });
    }
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
      return res.status(401).json({
        error: "Missing avatar",
        message: "Avatar local file is missing",
      });
    }

    let avatarUrl = "";
    try {
      const avatar = await uploadonCloudinary(avatarLocalPath);
      avatarUrl = avatar?.url;
    } catch (error) {
      return res.status(500).json({
        error: "Failed to upload avatar",
        message: "Failed to register the user",
      });
    }

    
    const existUser = await User.findOne({ $or: [{ email, username }] });
    if (existUser) {
      return res.status(402).json({
        error: "User is already registered",
        message: "plase loggin",
      });
    }
    // create new user

    const createdUser = await User.create({
      fullName,
      email,
      password,
      username,
      avatar: avatarUrl,
    });
    const user = await User.findById(createdUser?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      res.status(403).json({
        message: "seomthing went wrong when creating user ",
        error: "User is not created properly",
      });
    }

    return res
      .status(200)
      .json({ message: "User registerd successfully", user: newUser });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error || "failed to register user",
    });
  }
}
export { registerUser };
