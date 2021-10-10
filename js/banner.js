var banner = document.getElementById("stockbanner");
var bannerinfo = document.getElementById("stockbannerinfo");

fetch('https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD&api_key=392a6d28d1f929c7a2e3db3d676655f975b2750caac92c06341c1239ade1fbc3')
.then(response => response.json())
.then((loco)=>{
        
        for( var i=0; i < 10; i++){
                
                var cryptoIcon = document.createElement('img');
                cryptoIcon.classList.add('cryptoIcon');
                
                var Cryptoname = document.createElement('p');
                Cryptoname.classList.add('Cryptoname');

                var Price = document.createElement('p');
                Price.classList.add('Price');

                var ChangePct = document.createElement('p');
                ChangePct.classList.add('ChangePct');

                banner.appendChild(bannerinfo)
                cryptoIcon.setAttribute("src", "https://www.cryptocompare.com/" + loco.Data[i].CoinInfo.ImageUrl)
                Cryptoname.textContent = loco.Data[i].CoinInfo.FullName
                Price.textContent = "• Price (USD): (" + loco.Data[i].DISPLAY.USD.PRICE + ")" 
                ChangePct.textContent = "• Change in Past 24 Hours: (" + loco.Data[i].DISPLAY.USD.CHANGEPCT24HOUR + "%)" 
                bannerinfo.appendChild(Cryptoname)
                bannerinfo.appendChild(Price)
                bannerinfo.appendChild(ChangePct)
                bannerinfo.appendChild(cryptoIcon)
            }
            return
        })
