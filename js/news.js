
var addHere = document.getElementById("newTetas");

fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN&api_key=392a6d28d1f929c7a2e3db3d676655f975b2750caac92c06341c1239ade1fbc3')
.then(response => response.json())
.then((loco)=>{
        console.log(loco.Data[0].imageurl);
        for( var i=0; i < 10; i++){
                var maindiv = document.createElement('div');
                var div = document.createElement('p');
                var p = document.createElement('h3');
                var image = document.createElement('img');
                addHere.appendChild(maindiv)
                maindiv.classList.add("col","s3")
                div.textContent = loco.Data[i].body
                p.textContent = loco.Data[i].title
                image.setAttribute("src", loco.Data[i].imageurl)
                maindiv.appendChild(p)
                maindiv.appendChild(div)
                maindiv.appendChild(image)
            }
            return
        })