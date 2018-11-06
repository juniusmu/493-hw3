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
   		let uniqueElementId = parseInt(event.currentTarget.id.split("-")[1]);
   		let artistName = getArtistNameFromHtmlElementId(event.currentTarget.id);
		alert("yayaya");
		let singleArtistName = getOneArtistNameFromArtistName(artistName);
		alert(singleArtistName);
   		let artistInformation = getArtistInformation(singleArtistName,uniqueElementId);
   		// alert(artistInformation);
   		// let cleanArtistInformation = getCleanArtistInformation(artistInformation);
   		// alert(cleanArtistInformation);
   };
   function getCleanArtistInformation(artistInformation){
   	alert(artistInformation);
   	while(artistInformation.indexOf("<")  != -1 ||
   		artistInformation.indexOf(">") != -1){
   		let leftIndex = artistInformation.indexOf("<");
   		let rightIndex = artistInformation.indexOf(">");
   		artistInformation = artistInformation.replace(artistInformation.substring(leftIndex, rightIndex + 1), "");
   	}
   	return artistInformation;
   }
   function getOneArtistNameFromArtistName(artistName){
   	let chunksOfArtistName = artistName.split(" ", 3);
   	if(chunksOfArtistName[0].includes(",")){
   		return chunksOfArtistName[0].replace(",","");
   	}
   	if(chunksOfArtistName.length > 1){
   		if(chunksOfArtistName[1].includes("and") ||
   			chunksOfArtistName[1].includes("&")){
   				return chunksOfArtistName[0];
   		}
   		if(chunksOfArtistName[1].includes(",")){
   			return chunksOfArtistName[0] + " " +chunksOfArtistName[1].replace(",","");
   		}
   		if(chunksOfArtistName.length > 2){
   			if(chunksOfArtistName[2].includes("and") ||
	   			chunksOfArtistName[2].includes("&")){
	   				return chunksOfArtistName[0] + chunksOfArtistName[1];
	   		}
	   		if(chunksOfArtistName[2].includes(",")){
	   			return chunksOfArtistName[0] + " " + chunksOfArtistName[1] +" "+chunksOfArtistName[2].replace(",","");
	   		}
   		}

   	}
   	let name = chunksOfArtistName[0];
   	for(i = 1; i < chunksOfArtistName.length; ++ i){
   		name = name + " " + chunksOfArtistName[i];
   	}
   	return name;
   }
   function getArtistNameFromHtmlElementId(htmlElementId){
   	let uniqueArtistId = parseInt(htmlElementId.split("-")[1]);
	//get name of artist from uniqueId
	let artistElement = $scope.results.find(function(element){
		return element["uniqueId"] == uniqueArtistId;
	})
	let artistName = artistElement["originalName"];
	return artistName;
   }
   function getArtistInformation(artistName,elementId){
   	let artistNameWithoutSpaces = artistName.replace(" ", "+");
   	let url = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch='+artistNameWithoutSpaces+'&format=json&callback=JSON_CALLBACK'
   	$http.jsonp(url).then(function(response) {
   		console.log("response data");
	    console.log(response.data);
	    console.log("BEFORE:");
	    console.log(response.data["query"]["search"][0]["snippet"]);
	    let information = response.data["query"]["search"][0]["snippet"];
	    let cleanArtistInformation = "Sorry, there is no information for this artist!";
	    if(information.length != 0){
	    	cleanArtistInformation = getCleanArtistInformation(information);
	    }
	    console.log("AFTER:");
	    console.log(cleanArtistInformation);
	    $scope["originalArtistInformation"] = cleanArtistInformation;
	    if(cleanArtistInformation.length > 100){
	    	$scope[elementId]["artistInformation"] = cleanArtistInformation.substring(0,100) + "...";
	    }
	    console.log($scope["artistInformation"]);
	}, function (response) {
	      console.log(response)
	 	});
   }

   	function getUniqueIdFromArtistName(artistName){
   		let artistElement = $scope.results.find(function(element){
		return element[""] == uniqueArtistId;
	})
   	}
  	function getArtistDescription(artistName){
  		console.log("Searching for " + artistName);
  		artistName
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
