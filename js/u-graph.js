var inputCrypto = document.getElementById("inputCrypto");
var startDate = document.getElementById("inputStartDate");
var endDate = document.getElementById("inputEndDate");
var secSearchBtn = document.getElementById("searchBtn");


// CORS Proxy
const proxyUrl = "https://neon-cors-proxy.herokuapp.com/"

// Nomics API variables
const nomicsApiUrl = "https://api.nomics.com/v1/currencies";
const nomicsApiKey = "?key=cebaa59e568aca5912a3e5870ec3327e210d485d";

// CoinCap Api variables
const coinCapApiUrl = `https://api.coincap.io/v2/assets/`;
const coinCapApiKey = new Headers();
coinCapApiKey.set("Authorization", "Bearer f3d5db36-3146-45e5-97fa-618fd419efc2")


// event listener

secSearchBtn.addEventListener('click', cryptoGraph)
// api caller
async function cryptoGraph(){
 await fetch(proxyUrl + coinCapApiUrl + inputCrypto.value.trim().toLowerCase() , {headers: coinCapApiKey})
 .then(response => response.json())
 .then((data)=>{
     displayGraph(data);
     return
 })
 .catch((error) => {
    console.log("error")
  });

}

async function displayGraph(data){
    fetch(proxyUrl + nomicsApiUrl + "/sparkline" + nomicsApiKey + "&ids=" + data.data.symbol + 
    "&start=" + startDate.value.trim() + "T00:00:00Z" +
     "&end=" + endDate.value.trim() + "T00:00:00Z")
   .then(response => response.json())
   .then((secondApi)=>{
       console.log(secondApi[0].prices);
    createChart(secondApi);
    
    console.log(secondApi);
     return
    })
}
function createChart(secondApi) {    
    var chart = anychart.column(secondApi[0].prices);    
    chart.container('container');
    chart.draw();

};