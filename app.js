const bodyParser = require("body-parser")
const express = require("express")
const https = require("https")

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html")
})

app.post("/", function (req, res) {
    const cityName = req.body.city;
    const apiKey = "25a612a1d705d77b4a9e244b036b5870";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=metric";

    https.get(url, (response) => {
        response.on('data', function (data) {
            const weatherData = JSON.parse(data)
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.write("<h1>The temperature in " + cityName + " is " + temp + " degrees celsius.</h1>");
            res.write("<h3>The weather is currently " + description + "</h3>");
            res.write("<img src=" + imageUrl + ">")
            res.send()
        })
    }).on('error', (e) => {
        console.error(e);
    });
})

app.listen(3000, function () {
    console.log("Server started on port 3000!")
})