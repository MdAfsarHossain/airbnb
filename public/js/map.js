

// let mapToken = "<%= process.env.MAP_TOKEN %>";
// let mapToken = mapToken;
// console.log(mapToken);

mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    // center: [91.8260479, 22.3364709], // starting position [lng, lat] [Longitude, Latitude]
    style: "mapbox://styles/mapbox/satellite-streets-v12",
    center: listing.geometry.coordinates, // starting position [lng, lat] [Longitude, Latitude]
    zoom: 9 // starting zoom
});


// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({color: 'red'})
.setLngLat(listing.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h4>${listing.title}</h4><p>Exact Location Will be provided after booking.</p>`
    )
)
.addTo(map);


