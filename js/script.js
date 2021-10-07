
var inputCrypto = document.getElementById("inputEl");
var searchBtn = document.getElementById("submitButton");
var cryptoName = document.getElementById("Crypto");
var cryptoIcon = document.getElementById("logo");
var cryptoRank = document.getElementById("rank");
var cryptoPrice = document.getElementById("price");
var cryptoSupply = document.getElementById("supply");
var cryptoMktCg = document.getElementById("marketChange");


// CORS Proxy
const proxyUrl = "https://neon-cors-proxy.herokuapp.com/"

// Nomics API variables
const nomicsApiUrl = "https://api.nomics.com/v1/currencies/ticker?key=";
const nomicsApiKey = "cebaa59e568aca5912a3e5870ec3327e210d485d";

// CoinCap Api variables
const coinCapApiUrl = `https://api.coincap.io/v2/assets/`;
const coinCapApiKey = new Headers();
coinCapApiKey.set("Authorization", "Bearer f3d5db36-3146-45e5-97fa-618fd419efc2")

// event listener
searchBtn.addEventListener('click', cryptoAPI)
// api caller
async function cryptoAPI(){
 await fetch(proxyUrl + coinCapApiUrl + inputCrypto.value , {headers: coinCapApiKey})
 .then(response => response.json())
 .then((data)=>{
     displayData(data);
     return
 })
 .catch((error) => {
    console.log("error")
  });

}

// this will passing api data to index.html
function displayData(data){
    console.log(data.data.name)
    cryptoName.textContent = data.data.name;
    cryptoRank.textContent = "Rank: " + data.data.rank;
    cryptoPrice.textContent = "Price: USD$" + parseFloat(data.data.priceUsd).toFixed(2);
    cryptoSupply.textContent = "Supply: " + parseFloat(data.data.supply).toFixed(2);
    cryptoMktCg.textContent = "Market Change in 24hr: " + parseFloat(data.data.changePercent24Hr).toFixed(2) + "%";

    // getting crypto icon from another api
   fetch(proxyUrl + nomicsApiUrl + nomicsApiKey + "&ids=" + data.data.symbol)
   .then(response => response.json())
   .then((secondApi)=>{
    cryptoIcon.setAttribute("src", secondApi[0].logo_url)
     return
    })



}
