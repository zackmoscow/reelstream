$(document).ready(function(){
    $('.parallax').parallax();


    $(function() {

            var movies = [];
            var apiKey = "cff6c897";
            var title = 'rambo';
            var movieTitle;
            var moviePoster;
            var movieYear;
            var movieRating;
            var movieDirector;

            var queryURL = "http://www.omdbapi.com/?apikey=" + apiKey + "&t=" + title;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response)
            movieTitle = response.Title;
            moviePoster = response.Poster;
            movieYear = response.Year;
            movieRating = response.Ratings[0];
            movieDirector = response.Director;
            console.log(movieTitle);
    });

    })

});