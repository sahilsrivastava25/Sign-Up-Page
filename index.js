import express from "express";
import bodyParser from "body-parser";
import request from "request";
import https from "https";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from "dotenv";
dotenv.config();
const apiKey = process.env.apiKey;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.get("/", function(req,res){
  res.sendFile(join(__dirname, "/frontend/index.html"));
  console.log(req.body.fname);
})

app.post("/", function(req,res){
  const first = req.body.fName;
  const last = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: first,
          LNAME: last
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  // in weather app, we want data from API, but here, we want to post data to the API.
  // so https.get() is not used.

  const url = "https://us17.api.mailchimp.com/3.0/lists/4b284a54b4"

  const options = {
    method: "POST",
    auth: apiKey
  }

  const request = https.request(url, options, function(response){

    if(response.statusCode === 200){
      res.sendFile(join(__dirname, "./frontend/success.html"));
    }

    else{
      res.sendFile(join(__dirname, "./frontend/failure.html"));
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })



  request.write(jsonData);
  request.end();

  console.log(first, last, email);
})


app.post("./frontend/failure.html", function(req, res){
  res.redirect("/");
})




app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running at port 3000.")
})
