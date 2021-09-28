//Use moment.js to get today's date and display in currentDay element
var currentDay = moment().format("dddd, Do MMMM, YYYY");
$("#currentDay").text("Today is " + currentDay);

//page element vriables
var checkCoinButton = document.getElementById("checkCoin");

//change colour for time of day (e.g sunrise/sunset orange, midday blue, night dark grey);
var currentHour = moment().hour();
console.log(currentHour);

//page element vriables
var checkWeatherButton = document.getElementById("checkWeather");
//var clearHistoryButton = document.getElementById("clearHistory");
//clearHistoryButton.style.display = "none"; // hide clear button on page load

//var displayWeatherEl = document.querySelector("#displayWeather");
var cryptoInput = document.querySelector("#cryptoInput");

//var apiKey = "3b8940c3-822d-435a-b25b-6977ddfbb10f";

function getCoinName(event) { //search coin after button click
    event.preventDefault();
    var coin = cryptoInput.value.trim();

    if (coin) { //call first api and send to local storage
        //displayWeatherEl.textContent = "";
        getApi(coin);
        //storeCity();
        //var cityName = document.createElement("h1");
        //cityName.textContent = city.toUpperCase();
        //clearHistoryButton.style.display = "block";

        //displayWeatherEl.appendChild(cityName);
    } else {
        alert("Please enter a valid cryptocurrency");
    }
}

//fetch api
function getApi(coin) {
    var requestURL = 'https://api.coincap.io/v2/assets/' + coin;

    fetch(requestURL)
    .then(function (response) {
        if(response.ok) { // if response found
      console.log(response.status);
      return response.json();
        } else {
            throw new console.error(("Fetch denied"));
        }
    })

    .then(function (data) {
        console.log(data);
        displayCoinData(data);
    });
}

function displayCoinData(data) {

    var cryptoInfoBox = document.createElement("div");
    var coinInfoArray = [
        //data to get here

    ];

    for (let index = 0; index < coinInfoArray.length; index++) {
        var sectionInfo = document.createElement("p");
        sectionInfo.textContent = coinInfoArray[index];
        cryptoInfoBox.appendChild(sectionInfo); //append current weather data to display element

    }
}

checkCoinButton.addEventListener("click", getCoinName);
