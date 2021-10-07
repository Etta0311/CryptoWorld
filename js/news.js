
var addHere = document.getElementById("newsbox");

fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN&api_key=392a6d28d1f929c7a2e3db3d676655f975b2750caac92c06341c1239ade1fbc3')
.then(response => response.json())
.then((loco)=>{
        console.log(loco.Data[0].imageurl);
        for( var i=0; i < 10; i++){
                var newsbox = document.createElement('div');
                newsbox.classList.add('container');
                var heading = document.createElement('h5');
                heading.classList.add('header');
                var image = document.createElement('img');
                image.classList.add('left');
                var newsbody = document.createElement('p');
                newsbody.classList.add('card-content');
                var url = document.createElement('a');
                url.classList.add('card-action');        
                // var link = url.link("");
                addHere.appendChild(newsbox)
                heading.textContent = loco.Data[i].title
                image.setAttribute("src", loco.Data[i].imageurl)
                newsbody.textContent = loco.Data[i].body
                // url.textContent = "Read More";


                $(".card-action").attr("href",loco.Data[i].url)
                  
                newsbox.appendChild(heading)
                newsbox.appendChild(newsbody)
                heading.appendChild(image)
                newsbody.appendChild(url)

            }
            return
        })

    

  
