var services = angular.module('cooking.services', ['ngResource']);

services.factory('Recipe', ['$resource', 
  function($resource) {
    return $resource('/recipes/:url/:key.json', {key: '@key', url: '@url'});
  }
]);


services.factory('SingleRecipe', ['Recipe', '$route', '$q',
  function(Recipe, $route, $q) {
    return function() {

      var delay = $q.defer();
      var query = {
        url: $route.current.params.url,
        key: $route.current.params.key
      };
      Recipe.get(query, function(recipe) {

        var serverUrl = "/recipes/" + recipe.url + "/" + recipe.key;
        recipe.baseUrl = serverUrl;
        recipe.editUrl = serverUrl + "/edit";
        recipe.starUrl = serverUrl + "/star";
        recipe.unstarUrl = serverUrl + "/unstar";
        delay.resolve(recipe);

      }, function() {

        delay.reject('Unable to fetch recipe ' + query.key);

      });
      return delay.promise;
    }
}]);


var cookingApp = angular.module('cookingApp', ['cooking.services']);

var routesConfig = function($routeProvider) {
  $routeProvider.
  when('/recipes', {
    controller: 'RecipeController',
    templateUrl: 'partials/recipeList.html'   
  }).
  when('/', {
    controller: 'RecipeSearchController',
    templateUrl: 'partials/home.html'   
  }).
  when('/recipes/favorites', {
    controller: 'FavsController',
    templateUrl: 'partials/recipeFavs.html'   
  }).
  when('/recipes/shopping', {
    controller: 'ShoppingController',
    templateUrl: 'partials/recipeShopping.html'   
  }).
  when('/recipes/search', {
    controller: 'RecipeSearchController',
    templateUrl: 'partials/recipeSearch.html'
  }).
  when('/recipes/new', {
    controller: 'RecipeEditController',
    templateUrl: 'partials/recipeEdit.html'   
  }).
  when('/recipes/:url/:key/edit', {
    controller: 'RecipeEditController',
    templateUrl: 'partials/recipeEdit.html' 
  }).
  when('/recipes/:url/:key', {
    controller: 'RecipeDetailController',
    resolve: {
      recipe: function(SingleRecipe) { return SingleRecipe(); }
    },
    templateUrl: 'partials/recipeDetail.html' 
  }).
  when('/credits', {
    controller: 'EmptyController',
    templateUrl: 'partials/credits.html' 
  }).
  otherwise({
    controller: 'EmptyController',
    templateUrl: 'partials/notFound.html' 
  });
}

cookingApp.config(routesConfig);


cookingApp.controller('RecipeController', ['$scope', '$http', '$location', 
  function($scope, $http, $location) {

    $http.get("/recipes/all").
    success(function(recipes) {
      $scope.recipes = recipes;
      $scope.errorMsg = null;
    }).
    error(function(e) {
      $scope.errorMsg = e.message + "/" + e.details;
      console.log($scope.errorMsg);
    });

    $scope.new = function() {
      $http.post("/recipes/new").
      success(function(recipe) {
        var editUrl = "/recipes/" + recipe.url + "/" + recipe.key + "/edit";
        $location.url(editUrl);
      }).
      error(function(e) {
        $scope.errorMsg = e.message + "/" + e.details;
        console.log($scope.errorMsg);
      });
    }

  }
]);


// Merge this code with RecipeController, 
// perhaps by moving common functionality to 
// Angular services
cookingApp.controller('FavsController', ['$scope', '$http', '$location', 
  function($scope, $http, $location) {

    $http.get("/recipes/favorites").
    success(function(recipes) {
      $scope.recipes = recipes;
      $scope.errorMsg = null;
    }).
    error(function(e) {
      $scope.errorMsg = e.message + "/" + e.details;
      console.log($scope.errorMsg);
    });

    $scope.new = function() {
      $http.post("/recipes/new").
      success(function(recipe) {
        var editUrl = "/recipes/" + recipe.url + "/" + recipe.key + "/edit";
        $location.url(editUrl);
      }).
      error(function(e) {
        $scope.errorMsg = e.message + "/" + e.details;
        console.log($scope.errorMsg);
      });
    }

  }
]);


cookingApp.controller('ShoppingController', ['$scope', '$http', '$location', 
  function($scope, $http, $location) {

    $http.get("/recipes/shopping").
    success(function(recipes) {
      $scope.recipes = recipes;
      $scope.errorMsg = null;
    }).
    error(function(e) {
      $scope.errorMsg = e.message + "/" + e.details;
      console.log($scope.errorMsg);
    });

    $scope.new = function() {
      $http.post("/recipes/new").
      success(function(recipe) {
        var editUrl = "/recipes/" + recipe.url + "/" + recipe.key + "/edit";
        $location.url(editUrl);
      }).
      error(function(e) {
        $scope.errorMsg = e.message + "/" + e.details;
        console.log($scope.errorMsg);
      });
    }

  }
]);


cookingApp.controller('RecipeDetailController', ['$scope', '$http', '$location', 'recipe',
  function($scope, $http, $location, recipe) {

    $scope.recipe = recipe;

    $scope.star = function(){
      var starUrl = $scope.recipe.baseUrl + "/star" ;
      $http.post(starUrl).success(function(data) {
        $scope.recipe.isStarred = data.starred;
      });
    }

    $scope.unstar = function(){
      var unstarUrl = $scope.recipe.baseUrl + "/unstar" ;
      $http.post(unstarUrl).success(function(data) {
        $scope.recipe.isStarred = data.starred;
      });
    }

    $scope.shop = function(){
      var shopUrl = $scope.recipe.baseUrl + "/shop" ;
      $http.post(shopUrl).success(function(data) {
        $scope.recipe.isShoppingList = data.shop;
      });
    }

    $scope.noshop = function(){
      var noShopUrl = $scope.recipe.baseUrl + "/noshop" ;
      $http.post(noShopUrl).success(function(data) {
        $scope.recipe.isShoppingList = data.shop;
      });
    }

    $scope.edit = function() {
      $location.url($scope.recipe.editUrl);
    }

  }
]);


cookingApp.controller('RecipeEditController', ['$scope', '$routeParams', '$http', '$location', 
  function($scope, $routeParams, $http, $location) {

    $scope.submit = function() {
      var saveUrl = "/recipes/save/" + $routeParams.key;
      $http.post(saveUrl, $scope.recipe).
      success(function(x) {
        var viewUrl = "/recipes/" + x.url + "/"+ x.key;
        $location.url(viewUrl);
      }).
      error(function(e) {
        $scope.errorMsg = e.message;
      }); 
    }

    var serverUrl = "/recipes/" + $routeParams.url + "/"+ $routeParams.key + "/edit";
    $http.get(serverUrl).success(function(recipe) {
      recipe.saveUrl = "/recipes/save/" + recipe.key;
      $scope.recipe = recipe;
      $scope.errorMsg = null;
    });

  }
]);


cookingApp.controller('RecipeSearchController', ['$scope', '$routeParams', '$http', '$location', 
  function($scope, $routeParams, $http, $location) {

    $scope.recipes = [];
    $scope.message = "";
    
    $scope.search = function() {
      var serverUrl = "/recipes/search?text=" + $scope.searchText;
      $http.get(serverUrl).
      success(function(recipes) {
        $scope.message = "";
        $scope.recipes = recipes;
        $scope.errorMsg = null;
        if(recipes.length == 0) {
          $scope.message = "No recipes were found"
        }
        else {
          // Give the focus to another element so that
          // the keyboard presented by phones and tables
          // disappears.
          // This should probably go as an Angular Directive
          // rather than manipulating the DOM here but
          // we'll leave that for another day.
          var btn = document.getElementById("btnSearch");
          if(btn) btn.focus();
        }
      }).
      error(function(e) {
        $scope.errorMsg = e.message + "/" + e.details;
        console.log($scope.errorMsg);
      });
    }

  }
]);


cookingApp.controller('EmptyController', ['$scope',
  function ($scope) {
  }
]);

