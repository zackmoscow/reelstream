var movieTitle = 'rocky';
var youTubeApiKey = "AIzaSyBcMUj0c7zvG1jkdogJmJgb94HkcMk_U-U";
$.ajax({
    url: `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${movieTitle}trailer&key=${youTubeApiKey}`,
    method: "GET"
}).then(function(response) {
    console.log(response)
})