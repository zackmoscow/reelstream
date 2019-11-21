$(function () {
    $('.parallax').parallax();
    var movies = [];
    var searchValue;
    var movieApiKey = "cff6c897";
    var youTubeApiKey = "AIzaSyC5ImoUwTkX38aX8eAlbEW2_FP6fbLAVH0";
    var title;
    var movieTitle;
    var movieID;
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

    searchBtn.click(function (e) {
        //document.querySelector('#youTubeContainer').scrollIntoView();
        searchValue = $("#search").val().trim();
        title = searchValue;
        //console.log(searchValue);
        e.preventDefault();
        $('#landing').hide();
        omdbAjaxRequest();
        $('#results').show();
    });
    $('#search').on("keydown", function (e) {
        if (e.keyCode === 13) {
            searchValue = $("#search").val().trim();
            title = searchValue;
            //console.log(searchValue);
            e.preventDefault();
            $('#landing').hide();
            omdbAjaxRequest();
            $('#results').show();
        }
    });
    $(document).on("click", '.carousel-item', function (event) {
        // event.preventDefault();
        searchValue = event.target.getAttribute('data-name');
        title = searchValue;
        console.log(searchValue);
        $('#landing').hide();
        omdbAjaxRequest();
        $('#results').show();
    })
    // hide the results box
    $('#results').hide;
    // youtube ajax request. returns an array of 25 results. we're searching by title and year
    function youTubeAjaxRequest() {
        $.ajax({
            url: `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${movieTitle}${movieYear}trailer&key=${youTubeApiKey}`,
            method: "GET"
        }).then(function (response) {
            videoID = response.items[0].id.videoId;
            var iframe = $(`<div class="video-container"><iframe width="560" height="315" src="https://www.youtube.com/embed/${videoID}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`);
            $('#youTubeContainer').empty();
            $("#youTubeContainer").append(iframe);
        })
    }
    // utelly ajax request
    function utellyAjaxRequest() {
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
        $.ajax(settings).done(function (response) {
            var locations = response.results[0].locations;
            $('#utellyResult').empty();
            console.log(response);
            locations.forEach(function (item) {
                movieSource = item.name;
                movieSourceUrl = item.url;
                var span = $(`<span><a href="${movieSourceUrl}">${movieSource}</a></span>`);
                $('#utellyResult').text("Where To Watch:  ")
                $('#utellyResult').append(span);
            })
        })
    };
    // // tmbd request returns an array of reccomendations
    function tmdbRequest() {
        $.ajax({
            url: `https://api.themoviedb.org/3/movie/${movieID}/similar?api_key=34c4275ec69762284d8e87bcc5f7e573&language=en-US&page=1`,
            method: "GET"
        }).then(function (response) {
            $('.carousel').empty();
            console.log(response);
            for (var i = 0; i < 19; i++) {
                var tmdbPoster = response.results[i].poster_path;
                var recMovieName = response.results[i].title;
                var recMovieImg = $(`<a href="#moviePoster" class="carousel-item"> <img data-name="${recMovieName}" src="https://image.tmdb.org/t/p/w500${tmdbPoster}"></a>`);
                $('#recommendations').append(recMovieImg);
            }
            $('.carousel').carousel();
        });
    };
    // array of reccomendations
    var reccomendations;
    // omdb ajax request by title. the .then function runs the youtube request also.
    function omdbAjaxRequest() {
        var queryURL = "https://www.omdbapi.com/?apikey=" + movieApiKey + "&t=" + title.replace('&', '%26');
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            movieTitle = response.Title;
            moviePoster = response.Poster;
            movieYear = response.Year;
            movieRating = response.Ratings[0];
            movieDirector = response.Director;
            moviePlot = response.Plot;
            movieID = response.imdbID;
            $('#moviePoster').attr('src', moviePoster);
            $('#movieTitle').text(movieTitle);
            $('#movieYear').text("Released: " + movieYear);
            $('#movieDirector').text("Directed By: " + movieDirector);
            $('#moviePlot').text("Plot: " + moviePlot);
            youTubeAjaxRequest();
            utellyAjaxRequest();
            tmdbRequest();
        });
    }
});