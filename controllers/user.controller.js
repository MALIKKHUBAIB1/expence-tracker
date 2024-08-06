import { User } from "../models/user.models.js";
import uploadonCloudinary from "../utils/cloudinary.js";

async function generateAccessTokenAndRefreshToken(userId) {
  try {
    console.log(userId);
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("user not found with the existing id ");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("user not found with the existing id ", error.message);
  }
}
async function registerUser(req, res) {
  try {
    const { fullName, username, email, password } = req.body;

    //validate the none of the feilds are empty
    // console.log(fullName, username, email, password);
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
      .json({ message: "User registerd successfully", user });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error || "failed to register user",
    });
  }
}

const loginUser = async (req, res) => {
  // get the user data from the frontend
  // validate it
  // match the password with the saved password
  // genrate token and refresh token
  //send the token and refresh token into the cookie
  const { password, username, email } = req.body;
  console.log(password, username, email);

  if (!(username || email)) {
    // Correct: This now handles if both are missing correctly.
    return res.status(401).json({
      error: "Invalid username or email",
      message: "email or username must be provided ",
    });
  }

  if (!password) {
    return res.status(401).json({
      error: "Invalid password",
      message: "password must be provided",
    });
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    return res.status(401).json({
      error: "user doest not exist",
      message: "user doest not exist with username or email",
    });
  }
  const isPasswordMatched = await user.isPasswordCorrect(password);
  if (!isPasswordMatched) {
    res.status(401).json({
      error: "password not match",
      message: "password is invalid ",
    });
  }
  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  console.log(accessToken, "aceessTokenI");
  console.log(refreshToken, "refreshToken");

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({ loggedInUser, refreshToken, accessToken });
};
export { registerUser, loginUser };
