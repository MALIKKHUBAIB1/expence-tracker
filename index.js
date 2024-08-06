import app from "./app.js";

import { connectToMongoDb } from "./utils/index.js";

connectToMongoDb()
  .then(() => {
    console.log("connection is succesfully established");
    app.listen(process.env.PORT || 3001, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("connection failed ", err);
  });
