var app = angular.module('493Search', []);

app.controller('searchResult',[ '$scope', '$http', function($scope, $http) {
  // your code goes here
  $scope.artistName = "";
  $scope.results = [];
  $scope.resultPairIndexes = [];
  // Might not need result index
  $scope.resultIndex = 0;
  $scope.searchForArtist = function(event){
  	let keyCode = event.keyCode;
  	let enterKeyCode = 13;
  	if(keyCode == enterKeyCode){
  		getArtistInformation($scope.artistName);
  	}
  	
  	// TODO: add the values of the new results array into the html

  	function getArtistInformation(artistName){
  		console.log("Searching for " + artistName);
  		let testUrl = "https://itunes.apple.com/search?term="+artistName+"&country=US";
  		let numberOfResults = 0;
  		$http.get(testUrl)
  		.then(function(response){
  			console.log("Success");
  			// KEEP THIS CONSOLE.LOG for grading
  			console.log(response);
  			let results = response['data']['results'];
  			console.log(results);
  			numberOfResults = results.length;
  			if(numberOfResults == 0){
  				alert("No results found for: " + artistName);
  			}else{ //adds the pair of artists to an array
  				console.log("Here are the indexes");
  				//reset when searching for a new artist
  				$scope.resultPairIndexes = [];
  				for(i = 0; i < results.length; ++i){
  					if(i % 2 == 1){
  						$scope.resultPairIndexes.push(i);
  						console.log(i);
  					}
  					result = {};
  					result["name"] = results[i]["artistName"];
  					result["imageUrl"] = results[i]["artworkUrl100"];
  					result["collectionName"] = results[i]["collectionName"];
  					result["collectionPrice"] = results[i]["collectionPrice"];
  					result["type"] = results[i]["kind"];
  					result["previewUrl"] = results[i]["previewUrl"];


  					$scope.results.push(result);
  				}
  				console.log("new results array:");
  				console.log($scope.results);
  				console.log("That is all of the indexes");
  				console.log("resultPairIndexes:");
  				console.log($scope.resultPairIndexes)

  			}
  		}, function(response){
  			alert("Something went wrong :(");
  			console.log(response);
  		});
  	}
  };
}]);
