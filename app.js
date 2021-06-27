const express = require("express");
const https = require("https");
const bodyParser=require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

var weatherData=[[]];

app.get("/", function(req, res) {
res.render("home");
});
app.get("/contact", function(req, res) {
res.render("contact");
});
// app.get("/weather_post",function(req,res){
//
// })

app.post("/",function(req,res){
  var city = req.body.cityName;

  var url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city +"&appid=4a66ad152e1327b506965e4799216a12&units=metric"
  https.get(url, function(respone) {
    console.log(respone.statusCode);
      var chunks = []
 respone.on('data', function (chunk) {
   chunks.push(chunk)
 })
 respone.on('end', function () {
     var data = Buffer.concat(chunks)
       weatherData = JSON.parse(data);

      function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}
console.log(timeConverter(weatherData.list[0].dt));
      res.render("weather_post",{weatherData:weatherData});
    })
  })
});

app.get("/post/:postName",function(req,res){
  // const requestTitle = _.lowerCase(req.params.postName);


    if(req.params.postName < 7 )
    {
      console.log("done");
      res.render("post",{
        hender: req.params.postName,
        weatherData:weatherData
      });
    }

});


app.listen(process.env.PORT || 3000, function() {
  console.log("server is started at port 3000");
});
