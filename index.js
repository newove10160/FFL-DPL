const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const commentRoute = require("./routes/comments");
const conversationRoute = require('./routes/conversations');
const notificationRoute = require('./routes/notifications');
const messageRoute = require('./routes/messages');
const multer = require("multer");
const path = require("path");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");


dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());


const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,"public/images");
  },
  filename:(req,file,cb)=>{
    cb(null, req.body.name);
  }
});

const upload = multer({storage:storage});
app.post("/api/upload", upload.single("file"),(req,res)=>{
  try {
    return res.status(200).json("file uploaded");
  } catch (error) {
    console.log(err);
  }
})

//Routing
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts",postRoute);
app.use("/api/comments", commentRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/messages", messageRoute);

app.get("/", (req, res) => {
  res.send("FFL's Backend is working !");
})

//Swagger Ui
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(process.env.PORT || 8800, () => {
  console.log("Backend server is running!");
});