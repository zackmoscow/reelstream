var movieTitle = "rambo"
var movieSource;
var movieSourceUrl;
var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=" + movieTitle + "&country=us",
    "method": "GET",
    "headers": {
        "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
        "x-rapidapi-key": "6036e8ca99msh30f244ef86faf3ep1e56f1jsn9c9368cad67e"
    }
}
$.ajax(settings).done(function(response) {
    console.log(response);
    var locations = response.results[0].locations;
    locations.forEach(function(item) {
        movieSource = item.name;
        movieSourceUrl = item.url;
        console.log(movieSource);
        console.log(movieSourceUrl);
    })


});