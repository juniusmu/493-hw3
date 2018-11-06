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
  		getArtistDescription($scope.artistName);
  	}
   };

   $scope.getArtistInfor = function(event){
   		console.log(event.currentTarget.id);
   };

  	function getArtistDescription(artistName){
  		console.log("Searching for " + artistName);
  		let testUrl = "https://itunes.apple.com/search?term="+artistName+"&country=US";
  		let numberOfResults = 0;
  		$http.get(testUrl)
  		.then(function(response){
  			console.log("Success");
  			// KEEP THIS CONSOLE.LOG for grading
  			console.log(response);
  			$scope.artistSearchResponse = response;
  			let results = response['data']['results'];
  			console.log(results);
  			numberOfResults = results.length;
  			if(numberOfResults == 0){
  				alert("No results found for: " + artistName);
  			}else{ //adds the pair of artists to an array
  				//reset when searching for a new artist
  				$scope.resultPairIndexes = [];
  				for(i = 0; i < results.length; ++i){
  					if(i % 2 == 1){
  						$scope.resultPairIndexes.push(i);
  					}
  					result = {};
  					result["originalName"] = results[i]["artistName"];
  					result["originalCollectionName"] = results[i]["collectionName"];
  					result["artistId"] = results[i]["artistId"];
  					result["uniqueId"] = i; 
  					result["imageUrl"] = results[i]["artworkUrl100"];
  					result["collectionPrice"] = results[i]["collectionPrice"];
  					result["type"] = results[i]["kind"];
  					result["previewUrl"] = results[i]["previewUrl"];

  					if(results[i]["artistName"].length > 25){
  						result["name"] = results[i]["artistName"].substring(0,25) + "...";
  					}else{result["name"] = results[i]["artistName"];}
  					if(results[i]["collectionName"].length > 25){
  						result["collectionName"] = results[i]["collectionName"].substring(0,25) + "...";
  					}else{result["collectionName"] = results[i]["collectionName"];}
  					$scope.results.push(result);
  				}
  			}
  		}, function(response){
  			alert("Something went wrong :(");
  			console.log(response);
  		});
  	}
}]);
