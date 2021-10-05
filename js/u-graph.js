var inputCrypto = document.getElementById("inputCrypto");
var startDate = document.getElementById("inputStartDate");
var endDate = document.getElementById("inputEndDate");
var secSearchBtn = document.getElementById("searchBtn");
var addHere = document.getElementById("newTetas");


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

// fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN&api_key=392a6d28d1f929c7a2e3db3d676655f975b2750caac92c06341c1239ade1fbc3')
// .then(response => response.json())
// .then((loco)=>{
    //     console.log(loco.Data[0].imageurl);
    //     for( var i=0; i < 10; i++){
        //         var maindiv = document.createElement('div');
        //         var div = document.createElement('p');
        //         var p = document.createElement('h3');
        //         var image = document.createElement('img');
        //         addHere.appendChild(maindiv)
        //         maindiv.classList.add("col","s3")
        //         div.textContent = loco.Data[i].body
        //         p.textContent = loco.Data[i].title
        //         image.setAttribute("src", loco.Data[i].imageurl)
        //         maindiv.appendChild(p)
        //         maindiv.appendChild(div)
        //         maindiv.appendChild(image)
        //     }
        //     return
        // })

        
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
       
       console.log(secondApi);
       resetState();
       createChart(secondApi);
     return
    })
}
function createChart(secondApi) { 
    
    var div = document.createElement('canvas');
    div.id = 'myChart';
    addHere.appendChild(div); 
    var chama = []
    for(var i=0; i < secondApi[0].timestamps.length; i++) {

        var nossa = secondApi[0].timestamps[i].substr(0, 10);
        console.log(nossa);
        chama.push(nossa);        
    }
    console.log(chama)
    // canvas
    
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chama,
            datasets: [{
                label: 'Crypto Data',
                data: secondApi[0].prices,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    
};
function resetState(){
    while (addHere.firstChild){
        addHere.removeChild(addHere.firstChild)
    }
}
// colors
// backgroundColor: [
//     'rgba(255, 99, 132, 0.2)',
//     'rgba(54, 162, 235, 0.2)',
//     'rgba(255, 206, 86, 0.2)',
//     'rgba(75, 192, 192, 0.2)',
//     'rgba(153, 102, 255, 0.2)',
//     'rgba(255, 159, 64, 0.2)'
// ],
// borderColor: [
//     'rgba(255, 99, 132, 1)',
//     'rgba(54, 162, 235, 1)',
//     'rgba(255, 206, 86, 1)',
//     'rgba(75, 192, 192, 1)',
//     'rgba(153, 102, 255, 1)',
//     'rgba(255, 159, 64, 1)'
// ]
