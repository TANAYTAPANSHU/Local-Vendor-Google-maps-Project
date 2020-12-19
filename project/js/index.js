   let map;
   var infoWindow;
   let markers = [];

   function initMap() {
       let LA = {
           lat: 34.084362,
           lng: -118.4132

       }
       map = new google.maps.Map(document.getElementById("map"), {
           center: LA,

           zoom: 12,
       });
       infoWindow = new google.maps.InfoWindow();
       getStores();
   }


   const getStores = () => {

       const zipCode = document.getElementById('zip-code').value;
       if (!zipCode) {
           return;
       }

       const API_URL = 'http://localhost:3000/api/stores';
       const fullUrl = `${API_URL}?zip_code=${zipCode}`;

       fetch(fullUrl)
           .then((res) => {
               if (res.status == 200) {
                   return res.json();
               } else {
                   throw new error(res.status);
               }
           }).then((data) => {
               if (data.length > 0) {
                   clearLocation();
                   searchLocationsNear(data);
                   setStoresList(data);
                   setOnClickListener()
               } else {
                   noStoreFound();
               }
           })


       const searchLocationsNear = (stores) => {
           let bounds = new google.maps.LatLngBounds();
           stores.forEach((store, index) => {
               var LatLng = new google.maps.LatLng(
                   store.location.coordinates[1],
                   store.location.coordinates[0])
               let name = store.storeName;
               let address = store.addressLines[0];
               let openStatustext = store.openStatustext;
               let phone = store.phoneNumber;
               bounds.extend(LatLng);
               createMarker(LatLng, name, address, openStatustext, phone, index + 1);

           });
           map.fitBounds(bounds);
       }


       const createMarker = (latlng, name, address, openStatustext, phone, label) => {

           let html = `
       <div class="store-info-window">
       <div class="store-info-name">
        ${name}
      </div>
      <div class="store-info-open-status">
       
    </div>
    <div class="store-info-address">
    <div class="location">
    <i class="fas fa-location-arrow"></i>
    </div>
            <span>
          ${address}
            </span>
            </div>
     <div class="store-info-phone">
     <div class="phone">
     <i class="fas fa-phone-alt"></i>
     </div>
       <span>
              ${phone}
       </span>
    </div>

    </div>
       `;



           var marker = new google.maps.Marker({
               position: latlng,
               map: map,
               animation: google.maps.Animation.DROP,
           })
           marker.addListener("click", () => {
               infoWindow.setContent(html);
               infoWindow.open(map, marker);
           });

           markers.push(marker);


       }
       console.log(markers);


       /*
       const zipCode = document.getElementById('.zip-code').value;
       if (!zipCode) {
           return;
       }
       const API_URL = 'http://localhost:3000/api/stores';
       const fullUrl = `${API_URL}?zip_code=${zipCode}`;
       fetch(fullUrl)
           .then((res) => {
               if (res.status == 200) {
                   return res.json();
               } else {
                   throw new Error(res.status);
               }
           }).then((data) => {
               searchLocationsNear(data);
               setStoresList(data);
               setOnClickListener();
           })
  */
   }

   const setOnClickListener = () => {
       let storeElements = document.querySelectorAll('.store-container');
       console.log(storeElements);
       storeElements.forEach((elem, index) => {
           elem.addEventListener('click', () => {
               google.maps.event.trigger(markers[index], 'click');



           })



       })

   }


   const setStoresList = (stores) => {
       let storesHtml = '';
       stores.map((store, index) => {
           storesHtml += `
        <div class="store-container">
            <div class="store-container-background">
                <div class="store-info-container">
                    <div class="store-address">
                      <span><b> ${store.storeName}</b> </span>
                        <span>${store.addressLines[0]}</span>
                        <span>${store.addressLines[1]}</span>
                    </div>
                    <div class="store-phone-number">${store["phoneNumber"]}</div>
                </div>
                <div class="store-number-container">
                    <div class="store-number">
                        ${index+1}
                    </div>
                </div>
            </div>
        </div>
        `
       })
       document.querySelector('.stores-list').innerHTML = storesHtml;
   }



   /*  const searchLocationsNear = (stores) => {
         let bounds = new google.maps.LatLngBounds();
         stores.forEach((store, index) => {
             var latlng = new google.maps.LatLng(

                 store.location.coordinates[1],
                 store.location.coordinates[0]
             );

             let name = store.storeName;
             let address = store.addressLines[0];
             let phone = store.phoneNumber;
             let openStatusText = store.openStatusText;

             createMarker(store.location.coordinates[1],
                 store.location.coordinates[0], name, address, openStatusText, phone, index + 1);
             bounds.extend(latlng);


         });
         map.fitBounds(bounds);
     }
       */




   /* const createMarker = (lattitude, longitude, name, address, openStatusText) => {
       let html = `
       <div class="store-info-window">
       <div class="store-info-name">
        ${name}
      </div>
      <div class="store-info-open-status">
       ${openStatusText}
    </div>
    <div class="store-info-address">
    <div class="location">
    <i class="fas fa-location-arrow"></i>
    </div>
            <span>
          ${address}
            </span>
            </div>
     <div class="store-info-phone">
     <div class="phone">
     <i class="fas fa-phone-alt"></i>
     </div>
       <span>
              ${phone}
       </span>
    </div>

    </div>
       `;
       var marker = new google.maps.Marker({
           position: { lat: lattitude, lng: longitude },
           map: map,

           animation: google.maps.Animation.DROP,
           title: "Hello World!",
       });


       marker.addListener("click", () => {
           infoWindow.setContent(html);
           infoWindow.open(map, marker);
       });

       markers.push(marker);


   }


*/

   const noStoreFound = () => {
       const html = `
    <div class= "no-stores-found">
    No stores found
    
    </div>
    `

       document.querySelector('.stores-list').innerHTML = html;

   }

   const onEnter = (e) => {

       if (e.key == "Enter") {
           getStores();
       }

   }

   const clearLocation = () => {
       infoWindow.close();
       for (var i = 0; i < markers.length; i++) {
           markers[i].setMap(null);
       }
       markers.length = 0;
   }