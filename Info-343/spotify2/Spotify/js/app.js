// Katrina Ezis
// Info-343
// Spotify Challenge 
// November 9th, 2015
// This is the JavaScript file for my spotify
// challenge assignment. 

"use strict";

// Declare global variables, initiate
// our spotify base url and our myApp
var data;
var artists;
var baseUrl = 'https://api.spotify.com/v1/search?type=track&query=';
var myApp = angular.module('myApp', []);

// Hides all of the things that need
// to be hidden
$(document).ready(function(){
	$('#newArtists').hide();
	$('#searchResults').hide();
});

// Create our controller, we will be doing most of our functions
// within this controller. We will do this so that we can set 
// our $scope equal to various variables to make them accesible
// in HTML
var myCtrl = myApp.controller('myCtrl', function($scope, $http) {
  
  // Creates a new object, then gets songs based
  // upon what the user searched for. 
  $scope.audioObject = {};
  $scope.getSongs = function() {
  	$('#howTo').hide();
  	$('#newArtists').hide();
  	$('#searchResults').show();
    $http.get(baseUrl + $scope.track).success(function(response){
      data = $scope.tracks = response.tracks.items; 
    });
  }

  // We take in the song preview to be played
  // and the artist who performs that song
  // and then check to make sure both are valid.
  // If they are then we set our scope variables to
  // be used in our HTML.
  $scope.play = function(song, artist) {
  	$scope.thisName = artist.name;
    if($scope.currentSong == song) {
      $scope.audioObject.pause();
      $scope.currentSong = false;
      return;
    } else {
      if($scope.audioObject.pause != undefined) $scope.audioObject.pause()
      $scope.audioObject = new Audio(song);
      $scope.audioObject.play();  
      $scope.currentSong = song;
    }
  }

  // Takes in an artist and then finds
  // obscure, but related artists. This is
  // done by utilizing the Spotify API's related
  // artists object. Once we have these artists
  // they are sorted based on popularity (with 
  // the least popular coming first.) 
  $scope.newArtist = function(artist) {
  	$('#searchResults').hide();
  	$('#newArtists').show();
  	var artist = artist[0];
  	var artistName = artist.name;
  	var artistId = artist.id;
  
	$http.get('https://api.spotify.com/v1/artists/' + artistId + '/related-artists').success(function(response){
		var artists = response.artists;
		artists.sort(function(a, b) {
			return a.popularity - b.popularity || a.id.localeCompare(b.id);
		});
		artists = artists.slice(0,4);
		$.each(artists, function(i, val) {
			var newArtistId = val.id;
			$http.get('https://api.spotify.com/v1/artists/' + newArtistId + '/top-tracks?country=US').success(function(data){
				val.songs = data.tracks[9];
			});
		});
		$scope.artists = artists;
	});
  }

  // Animates the search bar to get wider, slowly.
  $scope.searchHover = function() {
  	$("#search").animate({width: '60%'}, "slow");
  }

  // Animates the search bar to return to it's normal
  // width, quickly.
  $scope.searchOut = function() {
  	$("#search").animate({width: '40%'}, "fast");
  }
});

// Add tool tips to anything with a title property
$('body').tooltip({
    selector: '[title]'
});