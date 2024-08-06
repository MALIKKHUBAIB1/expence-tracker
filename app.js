import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/user.router.js";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" })); //limited data is allowed in the json format
app.use(express.urlencoded({ extended: true }, { limit: "16kb" }));
app.use(cookieParser());

app.use("/api/v1/user", router);

export default app;
// import express from "express";
// import userRouter from "./routes/user.router.js"; // Correct relative path
// import cookieParser from "cookie-parser";
// import cors from "cors";

// const app = express();

// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
//   })
// );
// app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(cookieParser());

// app.use("/user", userRouter);

// export default app;
