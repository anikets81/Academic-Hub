import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer"; // middleware use for handling file uploads.
import helmet from "helmet"; //it is a middleware. helps improve the security of app by setting various http headers that enhance protection against common web vulnerabilities and attaccks.
import morgan from "morgan"; //it is a middleware used to log information about incoming http requests to our express app. it is used for debugging.
import path from "path";
import { fileURLToPath } from "url"; //fileURLToPath is a builtinFunction that is used to convert a file URL to a file Path.
// while working with nodejs, we often use the path module to manipulate and handle paths.
//but URL and file path are not interchangeable The fileURLToPath function helps you convert a
//file URL (like file:///path/to/file) to a platform-specific file path (/path/to/file on Unix-like systems or C:\path\to\file on Windows).

// all the middleware configuration and package configuration

const __filename = fileURLToPath(import.meta.url); //import.meta.url give the url of the path of the file index.js, we are converting that url to path.

const __dirname = path.dirname(__filename); //path is a builtin nodejs module that provide utilitles for working  with file and directory path.
// path.dirname() function is used to extract the directory path from a given file path.

dotenv.config(); //dotenv library that loads environment variables from a .env file into process's environment.
const app = express();
app.use(express.json());
app.use(helmet()); //applying helmet middleware to expressjs application. Integrating Helmet's security-related features and functionalities into your app's request-response cycle.
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); //we are passing a object to the function specifying the policy we want to access our resources.
app.use(morgan("common")); //each incomming http request to our server will be logged in concise format.
app.use(bodyParser.json({ limit: "30mb", extended: true })); //body parser middleware is extract and parse body of incoming requests. JSON data is comming sent in request body when  making API requests.
//limit 30mb means , it will reject requests with a json payload larget than 30mb.
//extended true means , the parsed data can include objects aand array in addition to primitime types like strings, it accepts nexted objects or other commplex data types.

app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); //urlencoded middleware mostly used in form, when form is submitted it parse the data of form like username andd password, and make it available in req.body object.
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); //it is use to serve static file such as images, stylesheets, js files to the client browser.
// "/assets" this specifies that the middleware should be applied to any route that starts with the path /assets, like /assets/img.png or /assets/style.css etc.
//express.static(path.join(__dirname, "public/assets")) this specifies the directoru from which the static files should be served.
//path.join is use to join the current directory name with the relative path "public/assets" means that the file will be served from the public/assets directory within our projects's file structure.

// set up the FILE STORAGE.
const storage = multer.diskStorage({
  //storage variable is created which specifies how uploaded files should be stored on the server's disk.
  destination: function (req, file, cb) {
    //destination function species the directory where uploaded files will be saved.
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    //filename function specifes how the uploaded files should be named when saved.
    cb(null, file.originalname);
  },
});
const upload = multer({ storage }); //created the multer instance with previously defined storage settings, this instance will be used to handle file upload.

app.use("/auth", authRoutes);

// Mongoose Setup and Port.
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDb connected");
    // add data one time
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => {
    "unable to connect to mongodb: ", error;
  });

app.listen(PORT, () => {
  console.log(`listning to port: ${PORT}`);
});
