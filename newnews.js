

                              // Call news API

// $.getJSON ("https://min-api.cryptocompare.com/data/v2/news/?lang=EN&api_key=392a6d28d1f929c7a2e3db3d676655f975b2750caac92c06341c1239ade1fbc3", 
// function (data){
// console.log(data);
// var news = data;

// $('.news').attr('src', news);
// });


// function getNewsApi() {
//     var requestUrl = 'https://min-api.cryptocompare.com/data/v2/news/?lang=EN&api_key392a6d28d1f929c7a2e3db3d676655f975b2750caac92c06341c1239ade1fbc3';
//     console.log(requestUrl)

//     fetch(requestUrl)
//       .then(function (response) {
//         return response.json();
//       })
//       .then(function (data) {
//         console.log(data);
//       for (var i = 0; i < data.length; i++) {
//         let data = ...
//         let newsbox = response.weather.temp
//         $(
//             `  
//             <div class="container" >
//                 <h2 class="col s12">Crypto news</h2>
//                 <div class="newsbox">${cityname}</div>
//             </div>`
//         )
//         $("#newsbox").append(newsbox);

//       }
//     });
// }

    // })}


// fetchButton.addEventListener('click', getApi);


// https://min-api.cryptocompare.com/data/v2/news/?lang=EN&api_key={392a6d28d1f929c7a2e3db3d676655f975b2750caac92c06341c1239ade1fbc3}
// var news = document.getElementById("news");
// news.onclick = ()=>{
//   window.addEventListener('DOMContentLoaded', (event) => {
//     console.log('DOM fully loaded and parsed');
// });
// var news = "https://min-api.cryptocompare.com/data/v2/news/?lang=EN"
// var newsapikey = "392a6d28d1f929c7a2e3db3d676655f975b2750caac92c06341c1239ade1fbc3"

// fetch(news)
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     console.log('Github Repo Issues \n----------');
//     for (var i = 0; i < data.length; i++) {
//       console.log(data[i].url);
//       console.log(data[i].user.login);
//     }
//   });

// var repoList = document.querySelector('ul');
// var fetchButton = document.getElementById('fetch-button');

// function getApi() {
//   // replace `octocat` with anyone else's GitHub username
//   var requestUrl = 'https://api.github.com/users/octocat/repos';

//   fetch(requestUrl)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       for (var i = 0; i < data.length; i++) {
//         var listItem = document.createElement('li');
//         listItem.textContent = data[i].html_url;
//         repoList.appendChild(listItem);
//       }
//     });
// }

// fetchButton.addEventListener('click', getApi)
// }