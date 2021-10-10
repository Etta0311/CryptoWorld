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
var cryptoDescription = document.getElementById("aboutCrypto");

//var savedItems = [];

// CORS Proxy
const proxyUrl = "https://neon-cors-proxy.herokuapp.com/"

// Nomics API variables
const nomicsApiUrl = "https://api.nomics.com/v1/currencies";
const nomicsApiKey = "?key=cebaa59e568aca5912a3e5870ec3327e210d485d";

// CoinCap Api variables
const coinCapApiUrl = "https://api.coincap.io/v2/";
const coinCapApiKey = new Headers();
coinCapApiKey.set("Authorization", "Bearer f3d5db36-3146-45e5-97fa-618fd419efc2")


//____________INDEX PAGE CONTENT: SEARCH BAR AND CRYPTO INFO
if($("body").data("title") === "indexPage") {

  /*var savedItems = JSON.parse(localStorage.getItem("saved"));

  //if nothing in search box and localStorage > 0
  if(savedItems.length >= 0 && inputCrypto.textContent == "") {
  for (let index = 0; index < savedItems.length; index++) {
    var viewedCrypto = savedItems[index].Name;
    console.log(viewedCrypto);
    cryptoAPI(viewedCrypto.toLowerCase());
  }
}
  } else if (inputCrypto.value != null) {
    searchBtn.addEventListener('click', getCoin);
  }*/

searchBtn.addEventListener('click', getCoin);

addtoWatchlistBtn.style.display = "none";
function getCoin(event) { //search coin after button click
  event.preventDefault();
  var coin = inputCrypto.value;

  if (coin) { //call first api
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
    cryptoSupply.textContent = "Supply: " + parseFloat(data.data.supply).toFixed(2);

    addtoWatchlistBtn.style.display = "block";

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
  //  fetch(proxyUrl + nomicsApiUrl + nomicsApiKey + "&ids=" + data.data.symbol)
  //  .then(response => response.json())
  //  .then((secondApi)=>{
  //   cryptoIcon.setAttribute("src", secondApi[0].logo_url);
  //    return;
  //   })

    fetch(proxyUrl + nomicsApiUrl + nomicsApiKey + "&ids=" + data.data.symbol + "&attributes=logo_url,description" )
    .then(response => response.json())
    .then((secondApi)=>{
     cryptoIcon.setAttribute("src", secondApi[0].logo_url)
     cryptoDescription.textContent = secondApi[0].description;
      return;
    })
    .catch((error) => {
      console.log("error: " + error)
    });


    // call third api
    fetch(proxyUrl + coinCapApiUrl + "rates" , {headers: coinCapApiKey})
    .then(response => response.json())
    .then((thirdApi)=>{
      var base = parseFloat(data.data.priceUsd).toFixed(2);

      //rates data is created dynamically from coincap api so id isn't static as I first thought, have to specify id to find the index
      for (let index = 0; index < thirdApi.data.length; index++) {
        if(thirdApi.data[index].id === "australian-dollar") {
          ausDollar = thirdApi.data[index].rateUsd;
          var compare = parseFloat(base/ausDollar).toFixed(2);
          cryptoPrice.textContent = "AUD: $" + compare;
        }
      }
     return;
    })
    .catch((error) => {
      console.log("error: " + error)
    });
}

  function addToWatchlist() {
    //watchlist.textContent = 'Watchlist';
    var savedItems = JSON.parse(localStorage.getItem("saved")) || [];

      //save relevant info to object
        var basicInfo = {
          Name: cryptoName.textContent,
          Ticker : cryptoTicker.textContent.replace("Ticker: ", ""),
          USD$ : cryptoPrice.textContent.replace("Price: USD$", ""),
          change : cryptoMktCg.textContent.replace("Market Change in 24hr: ", ""),
          Index : savedItems.length,
        }

        //prevent duplicates
        if (savedItems.some(e => e.Name === basicInfo.Name)) {
          addtoWatchlistBtn.textContent = "Already Added";
          addtoWatchlistBtn.classList.add("disabled");
          var message = document.createElement('p');
          cryptoMktCg.appendChild(message);
          //Reload to index.html if clicked again
          message.textContent = "Already added";
          message.style.color = "red";
          setTimeout(function() {
            self.location = "index.html"; 
        }, 1500);

        } else {
          savedItems.push(basicInfo);
          localStorage.setItem("saved", JSON.stringify(savedItems));
          var message = document.createElement('p');
          cryptoMktCg.appendChild(message);
          message.textContent = "Added to Watchlist";
          message.style.color = "green";
        }
}
addtoWatchlistBtn.addEventListener('click', addToWatchlist);
}

//  ________________watchlist page_____________________________________-

  if($("body").data("title") === "watchlistPage") {

  function displayWatchlist() {
    var subheading = document.createElement("h6");
    watchlist.appendChild(subheading);

    var savedItems = JSON.parse(localStorage.getItem("saved")) || [];

      for (let index = 0; index < savedItems.length; index++) {
        subheading.textContent = savedItems.length + " added to watchlist";

        var item = document.createElement("table"); //create table
        item.setAttribute("data-watchlistIndex", index);
        var newRow = item.insertRow(0);

        //create the required cells
        cell1 = newRow.insertCell(0);
        cell2 = newRow.insertCell(1);
        cell3 = newRow.insertCell(2);
        cell4 = newRow.insertCell(3);

        //add text from thirdApi.data data to cells
        cell1.textContent = savedItems[index].Name;
        cell2.textContent = savedItems[index].Ticker;
        cell3.textContent = savedItems[index].USD$;
        cell4.textContent = savedItems[index].change;

        watchlist.appendChild(item);
        
        //create and append view coin button
        var viewCoinBtn = document.createElement('button');
        viewCoinBtn.textContent = "View";
        viewCoinBtn.setAttribute("data-clicked", index);
        item.appendChild(viewCoinBtn);

        viewCoinBtn.addEventListener('click', function() {
          //if (event.currentTarget) {
            //window.location.href = "index.html";
        //}
        });

        //create and append remove coin button
        var removeCoinBtn = document.createElement('button');
        removeCoinBtn.textContent = "X";
        item.appendChild(removeCoinBtn);

          removeCoinBtn.addEventListener('click', function(event) {
            savedItems = JSON.parse(localStorage.getItem("saved"));

            subheading.textContent = savedItems.length;

            //force clear hack as event.currentarget was leaving one or two records in local storage sometimes
            if (index = 0 ) {
              savedItems.length = 0;
            }

            //remove item from local Storage
            savedItems.splice(index, 1);
            subheading.textContent = savedItems.length + " added to watchlist";
            localStorage.setItem("saved", JSON.stringify(savedItems));

            //remove item from watchlist
            event.currentTarget.parentNode.remove();

        }, false);
      }
    }

    displayWatchlist();
  }