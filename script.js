$(function () {
    $('.parallax').parallax();
    var movies = [];
    var searchValue;
    var movieApiKey = "cff6c897";
    var youTubeApiKey = "AIzaSyAFrDyxVyur8w0zK495oV0seBu7lR-JW_k";
    var tmdbApiKey = "34c4275ec69762284d8e87bcc5f7e573";
    var utellyApiKey = "6036e8ca99msh30f244ef86faf3ep1e56f1jsn9c9368cad67e";
    var title;
    // all of these are being set by the OMDB request
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
    // hide the currently empty results section
    $('#results').hide();
    // changes page location so that it scrolls where we want it to
    function scrollTo(hash){
        location.hash = "#" + hash;
    }

    // on the click, run the omdb request (and all the other requests)
    searchBtn.click(function (e) {
        // dynamically find value of search box
        searchValue = $("#search").val().trim();
        // set title to searchValue so that it can by accessed by the OMDB request
        title = searchValue;
        e.preventDefault();
        // hide the landing paragraph 
        $('#landing').hide();
        // run the OMDB (and all the other ajax requests inside of it)
        omdbAjaxRequest();
        // show the results div
        $('#results').show();
    });

    // on the click, run the omdb request (and all the other requests)
    $('#search').on("keydown", function (e) {
        if (e.keyCode === 13) {
            // dynamically find value of search box
            searchValue = $("#search").val().trim();
            // set title to searchValue so that it can by accessed by the OMDB request
            title = searchValue;
            e.preventDefault();
            // hide the landing paragraph 
            $('#landing').hide();
            // run the OMDB (and all the other ajax requests inside of it)
            omdbAjaxRequest();
            // show the results div
            $('#results').show();
        }
    });
    // when the carousel item is clicked, run the omdb request (and all the other requests)
    $(document).on("click", '.carousel-item', function (event) {
        searchValue = event.target.getAttribute('data-name');
        title = searchValue;
        $('#landing').hide();
        omdbAjaxRequest();
        $('#results').show();
    })
    // hide the results box
    $('#results').hide;
    // youtube ajax request. returns an array of 25 results. we're searching by the title and year, which 
    // are both set by the OMDB request
    function youTubeAjaxRequest() {
        $.ajax({
            url: `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${movieTitle}${movieYear}trailer&key=${youTubeApiKey}`,
            method: "GET"
        }).then(function (response) {
            // append the youtube video to the UI
            videoID = response.items[0].id.videoId;
            var iframe = $(`<div class="video-container"><iframe width="560" height="315" src="https://www.youtube.com/embed/${videoID}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`);
            $('#youTubeContainer').empty();
            $("#youTubeContainer").append(iframe);
        })
    }
    // utelly ajax request. we search by title, which is returned from the OMDB request
    function utellyAjaxRequest() {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=" + movieTitle + "&country=us",
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
                "x-rapidapi-key": utellyApiKey
            }
        }
        $.ajax(settings).done(function (response) {
            var locations = response.results[0].locations;
            $('#utellyResult').empty();
            // append the utelly results to the UI
            locations.forEach(function (item) {
                movieSource = item.name;
                movieSourceUrl = item.url;
                var span = $(`<span><a href="${movieSourceUrl}">${movieSource}</a></span>`);
                $('#utellyResult').text("Where To Watch:  ")
                $('#utellyResult').append(span);
            })
        })
    };
    // tmbd request returns an array of reccomendations. we search by movieID, which is returned from the OMDB request.
    function tmdbRequest(){
        $.ajax({
            url: `https://api.themoviedb.org/3/movie/${movieID}/similar?api_key=${tmdbApiKey}&language=en-US&page=1`,
            method: "GET"
        }).then(function (response) {
            $('.carousel').empty();
            // append the recs to the carousel
            for (var i = 0; i < 19; i++) {
                var tmdbPoster = response.results[i].poster_path;
                var recMovieName = response.results[i].title;
                var recMovieImg = $(`<a href="#moviePoster" class="carousel-item"> <img data-name="${recMovieName}" src="https://image.tmdb.org/t/p/w500${tmdbPoster}"></a>`);
                $('#recommendations').append(recMovieImg);
            }
            // initialize the carousel
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
            // append the movie results to the UI
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
            // you have to change the location before you go back to the moviePoster, otherwise it won't bounce back on click;
            scrollTo('omdbContainer');
            // we call the other ajax requests inside the OMDB request, since the OMDB request needs to run before them in order for them to receive their search parameters. 
            youTubeAjaxRequest();
            utellyAjaxRequest();
            tmdbRequest();
            // scroll to the moviePoster by setting the url location to /#moviePoster
            scrollTo('moviePoster');
        });
    }
});
