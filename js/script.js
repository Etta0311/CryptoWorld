
var inputCrypto = document.getElementById("inputEl");
var searchBtn = document.getElementById("submitButton");

var cryptoName = document.getElementById("Crypto");
var cryptoTicker = document.getElementById("ticker");
var cryptoIcon = document.getElementById("logo");
var cryptoRank = document.getElementById("rank");
var cryptoPrice = document.getElementById("price");
var cryptoSupply = document.getElementById("supply");
var cryptoMktCg = document.getElementById("marketChange");
var cryptoConvert = document.getElementById("converter");
var currencySelected = document.getElementsByClassName("currencySelected");
var currencySelector = document.getElementById("currencySelector");


var watchlist = document.getElementById("watchlist");
var addtoWatchlistBtn = document.getElementById("addToWatchlistButton");

addtoWatchlistBtn.addEventListener('click', addToWatchlist);

// CORS Proxy
const proxyUrl = "https://neon-cors-proxy.herokuapp.com/"

// Nomics API variables
const nomicsApiUrl = "https://api.nomics.com/v1/currencies/ticker?key=";
const nomicsApiKey = "cebaa59e568aca5912a3e5870ec3327e210d485d";

// CoinCap Api variables
const coinCapApiUrl = `https://api.coincap.io/v2/`;
const coinCapApiKey = new Headers();
coinCapApiKey.set("Authorization", "Bearer f3d5db36-3146-45e5-97fa-618fd419efc2")

// event listener

searchBtn.addEventListener('click', getCoin);

function getCoin(event) { //search city after button click
  event.preventDefault();
  var coin = inputCrypto.value;

  if (coin) { //call first api and send to local storage
      cryptoAPI(coin);
  } else {
      alert("Please enter a valid cryptoCurrency");
      return;
  }
}

// api caller

async function cryptoAPI(coin){

 await fetch(proxyUrl + coinCapApiUrl + "assets/" + coin , {headers: coinCapApiKey})
 .then(response => response.json())
 .then((data)=>{
     displayData(data);
     return
 })
 .catch((error) => {
    console.log("error: " + error)
  });

}

// this will assign api data to index.html
function displayData(data){
    //console.log(data);
    cryptoName.textContent = data.data.name;
    cryptoTicker.textContent = "Ticker: " + data.data.symbol;
    cryptoRank.textContent = "Rank: " + data.data.rank;
    cryptoPrice.textContent = "Price: USD$" + parseFloat(data.data.priceUsd).toFixed(2);
    cryptoSupply.textContent = "Supply: " + parseFloat(data.data.supply).toFixed(2);

    //performance indicator 
    var marketChg = document.createElement('span');
    if (data.data.changePercent24Hr < 0) {
      marketChg.style.color = "red";
    } else {
      marketChg.style.color = "green";
    }

    marketChg.textContent = parseFloat(data.data.changePercent24Hr).toFixed(2) + " %";

    cryptoMktCg.textContent = "Market Change in 24hr: ";
    cryptoMktCg.append(marketChg);

    // call second api getting crypto icon from another api
   fetch(proxyUrl + nomicsApiUrl + nomicsApiKey + "&ids=" + data.data.symbol)
   .then(response => response.json())
   .then((secondApi)=>{
     //console.log(secondApi);
    cryptoIcon.setAttribute("src", secondApi[0].logo_url);
     return;
    })
    .catch((error) => {
      console.log("error: " + error)
    });

    // call third api
    fetch(proxyUrl + coinCapApiUrl + "rates" , {headers: coinCapApiKey})
    .then(response => response.json())
    .then((thirdApi)=>{

      console.log(thirdApi);


      var base = cryptoPrice.textContent.replace("Price: USD$", "");
      console.log("This is the current US price: " + base);

      //testing
      currencySymbol = thirdApi.data[0].symbol;
      currencyRate = thirdApi.data[0].rateUsd;
      currencyToConvert = thirdApi.data[0].id;

      for (let i = 0; i < currencySelector.length; i++) {

      var currencyToConvert = thirdApi.data[i].id;
      console.log("This is the currency to convert " +currencyToConvert);
  

      //currencySymbol = thirdApi.data[i].symbol;
      //currencyRate = thirdApi.data[i].rateUsd;
      }

      var compare = parseFloat(base/currencyRate).toFixed(2);

      console.log("The price of 1 " + inputCrypto.value + " in " + currencyToConvert + " is $" + compare);

      cryptoConvert.textContent = currencySymbol;
     return;
    })
    .catch((error) => {
      console.log("error: " + error)
    });
  }


  
  function addToWatchlist() {
    var savedItems = JSON.parse(localStorage.getItem("saved")) || [];
    //savedItems = [];
    watchlist.textContent = 'Watchlist';
      //save relevant info to object
        var basicInfo = {
          Name: cryptoName.textContent,
          Ticker : cryptoTicker.textContent.replace("Ticker: ", ""),
          Logo : cryptoIcon.innerHTML,
          USD$ : cryptoPrice.textContent.replace("Price: USD$", ""),
          change : cryptoMktCg.textContent.replace("Market Change in 24hr: ", ""),
        }

        savedItems.push(basicInfo);
        localStorage.setItem("saved", JSON.stringify(savedItems));
        displayWatchlist(savedItems);
  }

  function displayWatchlist(savedArray) {
      savedArray = JSON.parse(localStorage.getItem("saved"));

      for (let index = 0; index < savedArray.length; index++) {
        var item = document.createElement("table"); //create table
        var newRow = item.insertRow(0);

        //create the required cells
        cell1 = newRow.insertCell(0);
        cell2 = newRow.insertCell(1);
        cell3 = newRow.insertCell(2);
        cell4 = newRow.insertCell(3);
        cell5 = newRow.insertCell(4);

        //performance indicator 
        if (savedArray[index].change < 0) {
          cell5.style.color = "red";
          cell5.textContent = savedArray[index].change;
        } else {
          cell5.style.color = "green";
          cell5.textContent = savedArray[index].change;
        }

        //add text from array data to cells
        cell1.textContent = savedArray[index].Name;
        cell2.textContent = savedArray[index].Ticker;
        cell3.innerHTML = savedArray[index].Logo;
        cell4.textContent = "US $" + savedArray[index].USD$;
        //cell5.textContent = savedArray[index].change;

        watchlist.appendChild(item);
        console.log("watchlist");
        console.log(watchlist);


        //add and append view coin button
        var viewCoinBtn = document.createElement('button');
        viewCoinBtn.textContent = "View";
        viewCoinBtn.classList.add("view");
        item.appendChild(viewCoinBtn);

        viewCoinBtn.addEventListener('click', function() { //working
          var convert = savedArray[index].Name.toLowerCase();
          console.log("Loading " + convert);
          cryptoAPI(convert);
        });

        //add and append remove coin button
        var removeCoinBtn = document.createElement('button');
        removeCoinBtn.textContent = "X";
        removeCoinBtn.classList.add("delete");
        item.append(removeCoinBtn);

        removeCoinBtn.addEventListener('click', function() { //working
          savedItems = JSON.parse(localStorage.getItem("saved"));
          console.log('removing ' + savedItems[index].Name);
          savedItems.splice(index, 1);
          localStorage.setItem("saved", JSON.stringify(savedItems));

          //Not working properly yet
          console.log(watchlist);
          console.log(item);
          watchlist.removeChild(item);
        });

      }
    }

   /* function getCurrencyConverter() {
      fetch(proxyUrl + coinCapApiUrl + "rates/" + inputCrypto.value , {headers: coinCapApiKey})
      .then(response => response.json())
      .then((data)=>{
        console.log(data);
      currencyConverter(data);
       return
      })
      .catch((error) => {
      console.log("error: ")
      });
}*/

//bare bones currency converter beginning
function currencyConverter(thirdApi) {
  //var base = cryptoPrice.textContent.replace("Price: USD$", "");
  //var base = 57000;
  //var currencyToConvert = thirdApi.data[24].id;
  
  //var currencySymbol = document.createElement('p');
  //var currencyRate = document.createElement('p');
  
  //currencySymbol = thirdApi.data[24].symbol;
  //currencyRate = thirdApi.data[24].rateUsd;

  //var compare = parseFloat(base/currencyRate).toFixed(2);

  //console.log(currencyToConvert);
  //console.log(currencySymbol);
  //console.log(currencyRate);
  //console.log(currencySymbol + ": " + compare);

  //cryptoConvert.textContent = currencySymbol;
}