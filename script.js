
$(function() {
    $('.parallax').parallax();
    var movies = [];
    var movieApiKey = "cff6c897";
    var youTubeApiKey = "AIzaSyBcMUj0c7zvG1jkdogJmJgb94HkcMk_U-U";
    var title = 'The Dark Knight';
    var movieTitle;
    var moviePoster;
    var movieYear;
    var movieRating;
    var movieDirector;
    var videoID;
// youtube ajax request. returns an array of 25 results. we're searching by title and year
    function youTubeAjaxRequest(){
        $.ajax({
            url: `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${movieTitle}${movieYear}trailer&key=${youTubeApiKey}`,
            method: "GET"
        }).then(function(response) {
            videoID = response.items[0].id.videoId;
            var iframe = $(`<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoID}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`)
            console.log(videoID);
        })
    }
// omdb ajax request by title. the .then function runs the youtube request also.
    function omdbAjaxRequest(){
        var queryURL = "http://www.omdbapi.com/?apikey=" + movieApiKey + "&t=" + title;
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
            youTubeAjaxRequest();
        });
    }
    
    omdbAjaxRequest();

    })

});