
var inputCrypto = document.getElementById("inputEl");
var searchBtn = document.getElementById("submitButton");

var cryptoName = document.getElementById("Crypto");
var cryptoTicker = document.getElementById("ticker");
var cryptoIcon = document.getElementById("logo");
var cryptoRank = document.getElementById("rank");
var cryptoPrice = document.getElementById("price");
var cryptoSupply = document.getElementById("supply");
var cryptoMktCg = document.getElementById("marketChange");


var watchlist = document.getElementById("watchlist");
var addtoWatchlistBtn = document.getElementById("addToWatchlistButton");

//addtoWatchlistBtn.addEventListener('click', addToWatchlist);

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
    console.log("error: ")
  });

}

// this will assing api data to index.html
function displayData(data){

    console.log(data);
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

    // getting crypto icon from another api
   fetch(proxyUrl + nomicsApiUrl + nomicsApiKey + "&ids=" + data.data.symbol)
   .then(response => response.json())
   .then((secondApi)=>{
    cryptoIcon.setAttribute("src", secondApi[0].logo_url);
     return;
    });

    addtoWatchlistBtn.addEventListener('click', function() {
      var savedItems = JSON.parse(localStorage.getItem("saved")) || [];
      //save relevant info to object
        var basicInfo = {
          Name: data.data.name,
          Ticker : data.data.symbol,
          USD$ : parseFloat(data.data.priceUsd).toFixed(2),
          Id : data.data.id,
          change : parseFloat(data.data.changePercent24Hr).toFixed(2) + " %",
        }

        savedItems.push(basicInfo);
        //watchlist.innerHTML="";
        localStorage.setItem("saved", JSON.stringify(savedItems));
        displayWatchlist(savedItems);
    });
  }

    //localStorage function
   /* function addToWatchlist() {
      var savedItems = JSON.parse(localStorage.getItem("saved")) || [];
        savedItems.push(inputCrypto.value);
        watchlist.innerHTML="";
        //var key = data.data.symbol;
        //var cryptoid = data.data.id;
        localStorage.setItem("saved", JSON.stringify(savedItems));
        //localStorage.setItem(key, cryptoid);
        displayWatchlist(savedItems);
    };*/

  function displayWatchlist(savedItems) {
      savedItems = JSON.parse(localStorage.getItem("saved"));

      for (let index = 0; index < savedItems.length; index++) {
        var item = document.createElement("table");
        var newRow = item.insertRow(0);

        //create the required cells
        cell1 = newRow.insertCell(0);
        cell2 = newRow.insertCell(1);
        cell3 = newRow.insertCell(2);
        cell4 = newRow.insertCell(3);

        //performance indicator 
        if (savedItems[index].change < 0) {
          cell4.style.color = "red";
        } else {
          cell4.style.color = "green";
        }

        //add text from data to cells
        cell1.textContent = savedItems[index].Name;
        cell2.textContent = savedItems[index].Ticker;
        cell3.textContent = "US $" + savedItems[index].USD$;
        cell4.textContent = savedItems[index].change;

        var removeBtn = document.createElement('button');
        removeBtn.textContent = "X";
        watchlist.appendChild(item);
        //watchlist.appendChild(removeBtn);

        item.addEventListener("click", function() { //working
          console.log("You are trying to load " + savedItems[index]);
          cryptoAPI(savedItems[index].Id);
      });
  
        removeBtn.addEventListener('click', function() { //working
          savedItems = JSON.parse(localStorage.getItem("saved"));
          console.log('removing ' +savedItems[index]);
          savedItems.splice(index, 1);
          localStorage.setItem("saved", JSON.stringify(savedItems));

          //need to fix removing assets from page, produces error for some reason
          watchlist.removeChild(item);
          watchlist.removeChild(removeBtn)
        });
      }
}