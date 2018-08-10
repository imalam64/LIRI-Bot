require("dotenv").config();
var keys = require("./keys.js");
var twitter = require('twitter');
var spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");

var requested = process.argv[2];
var input = process.argv;
var search = "";

var spotify = new spotify(keys.spotify);
var client = new twitter(keys.twitter);

if (requested === 'my-tweets'){
    tweets();
    }
else if(requested === 'spotify-this-song'){
    spotifier();
    }
else if(requested === 'movie-this'){
    movie();
    }
else if (requested === 'do-what-it-says'){
doSay();
}

//Twitter Function
function tweets(){
var userName = {screen_name: 'iqqy101'};
client.get('statuses/user_timeline', userName, function(error, tweets, response) {
    if (!error) {
        for (var x = 0; x < tweets.length; x++) {
            console.log("-------------------------------------------------------");
            console.log(tweets[x].text);
            console.log("-------------------------------------------------------");
        }
    }
});
}

// Spotify function
function spotifier(){
for (var i = 3; i < input.length; i++) {
    if (i > 3 && i < input.length) {
        search = search + "+" + input[i];
    } 
    else {
        search += input[i];
    }  
}
if (process.argv[3]===undefined) {
    search = search + "The Sign";
}

spotify.search({ type: 'track', query: search }, function(err, data) {
    if (err) {
    return console.log('Error occurred: ' + err);
    }
    console.log("-------------------------------------------------------");
    console.log("Artist: " + data.tracks.items[0].artists[0].name);
    console.log("-------------------------------------------------------");
    console.log("Song: " + data.tracks.items[0].name);
    console.log("------------------------------------------------------");
    console.log("Preview : " + data.tracks.items[0].preview_url);
    console.log("------------------------------------------------------");
    console.log("Album: " + data.tracks.items[0].album.name);
    console.log("------------------------------------------------------");
});
fs.appendFile("log.txt", search, function(err){
    if (err) {
        return console.log(err);
    }
    console.log("log.txt was updated!");
});
}

// OMDB function
function movie(){
for (var i = 3; i < input.length; i++) {
    if (i > 3 && i < input.length) {
        search = search + "+" + input[i];
    }
    else {
        search += input[i];
    }
}
if (process.argv[3]===undefined) {
    search = search + "Mr. Nobody";
}

var queryUrl = "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy";
console.log(queryUrl);

request(queryUrl, function(error,response, body){
    if (!error && response.statusCode === 200){
        console.log("-------------------------------------------------------");
        console.log("Title: " + JSON.parse(body).Title);
        console.log("-------------------------------------------------------");
        console.log("Release Year: " + JSON.parse(body).Year);
        console.log("-------------------------------------------------------");
        console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
        console.log("-------------------------------------------------------");
        console.log("Rotten Tomatoes Rating " + JSON.parse(body).Ratings[1].Value);
        console.log("-------------------------------------------------------");
        console.log("Produced In: " + JSON.parse(body).Country);
        console.log("-------------------------------------------------------");
        console.log("Language: " + JSON.parse(body).Language);
        console.log("-------------------------------------------------------");
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("-------------------------------------------------------");
        console.log("Starring: " + JSON.parse(body).Actors);
        console.log("-------------------------------------------------------");
    }
});
fs.appendFile("log.txt", search, function(err){
    if (err) {
        return console.log(err);
    }
    console.log("log.txt was updated!");
});
}

//Do What It Says
function doSay() {
fs.readFile("random.txt", "utf8", function(error, data){
    if (error){
        return console.log(error);
    }
var dataArr = data.split(",");
    spotify.search({ type: 'track', query: dataArr[1] }, function(err, data) {
        if (err) {
        return console.log('Error occurred: ' + err);
        }
        console.log("-------------------------------------------------------");
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("-------------------------------------------------------");
        console.log("Song: " + data.tracks.items[0].name);
        console.log("-------------------------------------------------------");
        console.log("Preview: " + data.tracks.items[0].preview_url);
        console.log("-------------------------------------------------------");
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("-------------------------------------------------------");
    });
});
}