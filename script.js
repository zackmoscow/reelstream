$(function() {
    $('.parallax').parallax();
    var movies = [];
    var searchValue;
    var movieApiKey = "cff6c897";
    var youTubeApiKey = "AIzaSyBcMUj0c7zvG1jkdogJmJgb94HkcMk_U-U";
    var title;
    var movieTitle;
    var moviePoster;
    var movieYear;
    var movieRating;
    var movieDirector;
    var videoID;
    // the name and url of streaming services from the utelly ajax request
    var movieSource;
    var movieSourceUrl;
    var searchBtn = $('#searchBtn');

    $('#results').hide();
  
    searchBtn.click(function(e){
        searchValue = $("#search").val().trim();
        title = searchValue;
        console.log(searchValue);
        e.preventDefault();
        $('#landing').hide();
        omdbAjaxRequest();
        $('#results').show();
    });

    // hide the results box
    $('#results').hide;
    console.log('im working')
// youtube ajax request. returns an array of 25 results. we're searching by title and year
    function youTubeAjaxRequest(){
        $.ajax({
            url: `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${movieTitle}${movieYear}trailer&key=${youTubeApiKey}`,
            method: "GET"
        }).then(function(response) {
            videoID = response.items[0].id.videoId;
            var iframe = $(`<div class="video-responsive"><iframe width="560" height="315" src="https://www.youtube.com/embed/${videoID}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`);
            $('#youTubeContainer').empty();
            $("#youTubeContainer").append(iframe);
        })
    }
// utelly ajax request
    function utellyAjaxRequest(){
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
                var tr = $('<tr>');
                var td = $(`<td><a href="${movieSourceUrl}">${movieSource}</a></td>`);
                tr.append(td);
                $('tbody').empty();
                $('tbody').append(tr);
            })
        })
    };
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
            moviePlot = response.Plot;
            $('#moviePoster').attr('src', moviePoster);
            $('#movieTitle').text(movieTitle);
            $('#movieYear').text(movieYear);
            $('#movieDirector').text(movieDirector);
            $('#moviePlot').text(moviePlot);
            youTubeAjaxRequest();
            utellyAjaxRequest();
        });
    }
});