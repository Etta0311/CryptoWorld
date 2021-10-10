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
var cardDisplay = document.getElementById("infoBox");
var descBox = document.getElementById("infoBox2");

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

cardDisplay.style.display = "none";
descBox.style.display = "none";

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
    //message.style.backgroundColor = "white";
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

    cardDisplay.style.display = "block";
    descBox.style.display = "block";

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

    //Center watchlist text
    watchlist.style.textAlign = "center";
    watchlist.style.fontSize = "20px";

    var savedItems = JSON.parse(localStorage.getItem("saved")) || [];

    var table = document.createElement("table"); //create table
    //add table styles
    table.classList.add("table","is-hoverable","is-fullwidth","is-narrow","is-size-6-mobile","has-text-left");

    table.classList.add();

    var thead = document.createElement("thead");
    thead.classList.add("thead");
    var tbody = document.createElement("tbody")
    watchlist.appendChild(table);
    table.appendChild(thead);
    table.appendChild(tbody);

    //create top row 
    var theader = document.createElement('tr');
    //table header content
    var thead1 = document.createElement("th");
    var thead2 = document.createElement("th");
    var thead3 = document.createElement("th");
    var thead4 = document.createElement("th");
    var thead5 = document.createElement("th");
    var thead6 = document.createElement("th");

    //assign text to header
    thead1.textContent = "Name";
    thead2.textContent = "Ticker";
    thead3.textContent = "Unit AUD$";
    thead4.textContent = "% Change";
    //last 2 cells for buttons

    //append header cells to header
    theader.appendChild(thead1);
    theader.appendChild(thead2);
    theader.appendChild(thead3);
    theader.appendChild(thead4);
    theader.appendChild(thead5);
    theader.appendChild(thead6);

    thead.appendChild(theader);

      for (let index = 0; index < savedItems.length; index++) {
        subheading.textContent = savedItems.length + " added to watchlist";

        var newRow = tbody.insertRow(0);
        newRow.classList.add("tr");

        //create the required cells
        cell1 = newRow.insertCell(0);
        cell2 = newRow.insertCell(1);
        cell3 = newRow.insertCell(2);
        cell4 = newRow.insertCell(3);
        cell5 = newRow.insertCell(4);
        cell6 = newRow.insertCell(5);

        //add text from thirdApi.data data to cells
        cell1.textContent = savedItems[index].Name;
        cell2.textContent = savedItems[index].Ticker;
        cell3.textContent = savedItems[index].USD$.replace("AUD: ", "");
        cell4.textContent = savedItems[index].change;
        
        //create and append view coin button
        var viewCoinBtn = document.createElement('button');
        viewCoinBtn.textContent = "View";
        //view button styles
        viewCoinBtn.classList.add("button","is-success", "is-fullwidth");

        cell6.appendChild(viewCoinBtn);

        viewCoinBtn.addEventListener('click', function() {
            //window.location.href = "index.html";
        });

        //create and append remove coin button
        var removeCoinBtn = document.createElement('button');
        removeCoinBtn.textContent = "X";
        //button styling
        removeCoinBtn.classList.add("button","is-danger", "is-fullwidth");

        cell5.appendChild(removeCoinBtn);

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

            //remove record from watchlist
            event.currentTarget.parentNode.parentNode.remove();

        }, false);
      }
    }

    displayWatchlist();
  }