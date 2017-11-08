'use strict'

angular.module('movieApp', ['ngRoute'])

	.config(function($routeProvider) {
	    $routeProvider
	        .when('/home', {
	            templateUrl: 'assets/views/home.html',
	            controller: 'homeCtrl'
	        });
	})
	
	.controller('homeCtrl', function($scope, actorSrv, saveSrv) {
		
	    	$('#searchButton').on('click', function (e) {

	    		$scope.movies = '';
	    		
	    		var actor = $('#actorText').val();
	    		var saved = saveSrv.getObject(actor);
	    		
	    		console.log(saved);
	    		
	    		if(Object.keys(saved).length == 0){
	    			actorSrv.getMovies(actor).then(function(data){
		    			var movies = [];
		    			
		    			for (var i = 0; i < data.data[0].filmography.actor.length; i++) {
		    			    movies.push(data.data[0].filmography.actor[i].title);
		    			}

	    				saveSrv.setObject(actor, movies);
	    				
		    			$scope.movies = movies;
		    			
		    		});
	    		} else {
	    			var movies = [];
	    			
	    			for (var i = 0; i < saved.length; i++) {
	    			    movies.push(saved[i][1]);
	    			}
    				
	    			$scope.movies = movies;
	    		}
	    	});
    })
   
    .service('actorSrv', function($http, $q) {
    		this.getMovies = function(actor) {
	    		var q = $q.defer();
	    		var url = 'http://theimdbapi.org/api/find/person?name=' + encodeURIComponent(actor) + '&format=json';

	    		$http.get(url)
	    			.then(function(data){
	    				q.resolve(data);
	    				console.log(data.data[0]);
	    			}, function error(err) {
	    				q.reject(err);
	    			});
	    			
	    			return q.promise;
	    		};
    })
    
    .service('saveSrv', function($window, $http){
		  this.setObject = function(key, value){
			  $window.localStorage[key] = JSON.stringify(value);
			  //Save in CouchDB
//			  $http.put('../../' + key, value));
		  };
		  
		  this.getObject = function(key){
			  return JSON.parse($window.localStorage[key] || '{}');
			  
		  };
	});