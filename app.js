import express from "express";
import bodyParser from "body-parser";
import request from "request";
import https from "https";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.get("/", function(req,res){
  res.sendFile(join(__dirname, "signup.html"));
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
    auth: "sahilsri:11818dc03a18f7cd76216ee3015b7f75-us17"
  }

  const request = https.request(url, options, function(response){

    if(response.statusCode === 200){
      res.sendFile(join(__dirname, "success.html"));
    }

    else{
      res.sendFile(join(__dirname, "failure.html"));
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })



  request.write(jsonData);
  request.end();

  console.log(first, last, email);
})


app.post("/failure.html", function(req, res){
  res.redirect("/");
})




app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running at port 3000.")
})




// API Key: 60e9aeb38253ebede525820cb05530b1-us17
// List ID: 4b284a54b4