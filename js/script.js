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

var message = document.getElementById("message");


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
      message.textContent= "";
  } else {
      message.textContent = "Please enter a valid cryptocurrency with no capital letters e.g. bitcoin";
      message.style.color = "red";
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

      currencyOptions = [
        thirdApi.data[3], thirdApi.data[19], thirdApi.data[22], thirdApi.data[41], thirdApi.data[45], thirdApi.data[51], thirdApi.data[61], thirdApi.data[70],
        thirdApi.data[91], thirdApi.data[94], thirdApi.data[99], thirdApi.data[103], thirdApi.data[108],
        thirdApi.data[124], thirdApi.data[127], thirdApi.data[139], thirdApi.data[144], thirdApi.data[149],
        thirdApi.data[151], thirdApi.data[156], thirdApi.data[159], thirdApi.data[161], thirdApi.data[168],
    ]

    var select = document.createElement("select"); 

      for (let index = 0; index < currencyOptions.length; index++) {
        var currency = currencyOptions[index];
        var option = document.createElement("option");
        select.appendChild(option);

        currencySymbol = currency.symbol;
        currencyRate = currency.rateUsd;
        currencyToConvert = currency.id;
      }

      var compare = parseFloat(base/currencyRate).toFixed(2);

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
          USD$ : cryptoPrice.textContent.replace("Price: USD$", ""),
          change : cryptoMktCg.textContent.replace("Market Change in 24hr: ", ""),
        }

        savedItems.push(basicInfo);
        localStorage.setItem("saved", JSON.stringify(savedItems));
        displayWatchlist(savedItems);
  }

  function displayWatchlist(data) {
      savedthirdApi.data = JSON.parse(localStorage.getItem("saved"));

      for (let index = 0; index < savedthirdApi.data.length; index++) {
        var item = document.createElement("table"); //create table
        item.setAttribute("data-watchlistIndex", index);
        var newRow = item.insertRow(0);

        //create the required cells
        cell1 = newRow.insertCell(0);
        cell2 = newRow.insertCell(1);
        cell3 = newRow.insertCell(2);
        cell4 = newRow.insertCell(3);
        cell5 = newRow.insertCell(4);

        //performance indicator 
        if (savedthirdApi.data[index].change < 0) {
          cell4.style.color = "red";
        } else {
          cell4.style.color = "green";
        }

        //add text from thirdApi.data data to cells
        cell1.textContent = savedthirdApi.data[index].Name;
        cell2.textContent = savedthirdApi.data[index].Ticker;
        cell3.textContent = "US $" + savedthirdApi.data[index].USD$;
        cell4.textContent = savedthirdApi.data[index].change;

        watchlist.appendChild(item);
        
        //create and append view coin button
        var viewCoinBtn = document.createElement('button');
        viewCoinBtn.textContent = "View";
        item.appendChild(viewCoinBtn);

        viewCoinBtn.addEventListener('click', function() { //working
          cryptoAPI(savedthirdApi.data[index].Name.toLowerCase());
        });

        //create and append remove coin button
        var removeCoinBtn = document.createElement('button');
        removeCoinBtn.setAttribute("data-removeButtonIndex", index);
        removeCoinBtn.textContent = "X";
        item.appendChild(removeCoinBtn);

          removeCoinBtn.addEventListener('click', function(event) {
            savedItems = JSON.parse(localStorage.getItem("saved"));
            var index = event.target.getAttribute("data-removeButtonIndex");

            //force clear hack as event.currentarget was leaving one or two records in local storage sometimes
            if (index = 0 ) {
              savedItems.length = 0;
            }

            savedItems.splice(index, 1);
            localStorage.setItem("saved", JSON.stringify(savedItems));

            //remove item from watchlist
            event.currentTarget.parentNode.remove();

        }, false);
      
      }
      
    }

    