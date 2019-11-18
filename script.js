$(function(){

    var movies = [];
    var apiKey = "cff6c897";
    var title = 'rambo';

    var queryURL ="http://www.omdbapi.com/?apikey=" + apiKey + "&t=" + title;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response)
    });

})
