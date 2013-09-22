// ========================================================
// Services
// ========================================================
var services = angular.module('cooking.services', ['ngResource']);

services.factory('Recipe', ['$resource', 
  function($resource) {
    var url = '/recipes/:url/:key';
    var params = {key: '@key', url: '@url'};
    
    var methods = {};

    methods.query = {
      method:'GET', 
      params:{url:'search', key:'', text:''}, 
      isArray:true
    };
    
    methods.all = {
      method:'GET', 
      params:{url:'all', key:''}, 
      isArray:true
    };

    methods.favorites = {
      method:'GET', 
      params:{url:'favorites', key:''}, 
      isArray:true
    };

    methods.shoppingList = {
      method:'GET', 
      params:{url:'shopping', key:''}, 
      isArray:true
    };

    methods.createNew = {
      method:'POST', 
      params:{url:'new'}, 
      isArray:false
    };

    return $resource(url, params, methods);
  }
]);


services.factory('SingleRecipe', ['Recipe', '$route', '$q',
  function(Recipe, $route, $q) {
    return function(decode) {

      var delay = $q.defer();
      var query = {
        url: $route.current.params.url,
        key: $route.current.params.key
      };

      if(decode) {
        query.decode = true;
      }

      var ok = function(recipe) {
        var serverUrl = "/recipes/" + recipe.url + "/" + recipe.key;
        recipe.baseUrl = serverUrl;
        recipe.editUrl = serverUrl + "/edit";
        recipe.starUrl = serverUrl + "/star";
        recipe.unstarUrl = serverUrl + "/unstar";
        delay.resolve(recipe);
      };

      var error = function() {
        delay.reject('Unable to fetch recipe ' + query.key);
      };

      Recipe.get(query, ok, error);
      return delay.promise;
    }
  }
]);


services.factory('SearchRecipes', ['Recipe', '$route', '$q',
  function(Recipe, $route, $q) {
    return function(text) {
      
      var delay = $q.defer();

      if(!text) {
        if(globalSearch.text) {
          delay.resolve(globalSearch.data);
          return delay.promise;
        }
        else {
          delay.resolve([]);
          return delay.promise;
        }
      } 

      var query = {text: text};
      var ok = function(recipes) { delay.resolve(recipes); };
      var error = function() { delay.reject('Unable to fetch recipes'); }; 
      Recipe.query(query, ok, error);
      return delay.promise;

    }
  }
]);


services.factory('ListRecipes', ['Recipe', '$route', '$q',
  function(Recipe, $route, $q) {
    return function(listType) {

      var delay = $q.defer();
      var ok = function(recipes) { delay.resolve(recipes); };
      var error = function() { delay.reject('Unable to fetch recipes'); };
      Recipe[listType](ok, error);
      return delay.promise;

    }
  }
]);


// ========================================================
// App Definition
// ========================================================

var cookingApp = angular.module('cookingApp', ['cooking.services']);

var routesConfig = function($routeProvider) {
  $routeProvider.
  when('/', {
    controller: 'RecipeSearchController',
    resolve: {
      recipes: function(SearchRecipes) { return SearchRecipes(); }
    },
    templateUrl: 'partials/home.html'   
  }).
  when('/recipes', {
    controller: 'RecipeListController',
    resolve: {
      recipes: function(ListRecipes) { return ListRecipes('all'); }
    },
    templateUrl: 'partials/recipeList.html'   
  }).
  when('/recipes/search', {
    controller: 'RecipeSearchController',
    resolve: {
      recipes: function(SearchRecipes) { return SearchRecipes(); }
    },
    templateUrl: 'partials/home.html'
  }).
  when('/recipes/favorites', {
    controller: 'RecipeListController',
    resolve: {
      recipes: function(ListRecipes) { return ListRecipes('favorites'); }
    },
    templateUrl: 'partials/recipeFavs.html'   
  }).
  when('/recipes/shopping', {
    controller: 'RecipeListController',
    resolve: {
      recipes: function(ListRecipes) { return ListRecipes('shoppingList'); }
    },
    templateUrl: 'partials/recipeShopping.html'   
  }).
  when('/recipes/:url/:key/edit', {
    controller: 'RecipeEditController',
    resolve: {
      recipe: function(SingleRecipe) { return SingleRecipe(true); }
    },
    templateUrl: 'partials/recipeEdit.html' 
  }).
  when('/recipes/:url/:key', {
    controller: 'RecipeDetailController',
    resolve: {
      recipe: function(SingleRecipe) { return SingleRecipe(false); }
    },
    templateUrl: 'partials/recipeDetail.html' 
  }).
  when('/credits', {
    templateUrl: 'partials/credits.html' 
  }).
  otherwise({
    templateUrl: 'partials/notFound.html' 
  });
}

cookingApp.config(routesConfig);

// This global var is used to preserve the last search.
// I should be using $rootScope for this but I had a few
// timing issues setting the $rootScope in a controller  
// and then reading its values on the Service at a later
// time. For now use good old global vars.
var globalSearch = {text: null, data: null};


// ========================================================
// Controllers
// ========================================================

cookingApp.controller('RecipeListController', ['$scope', '$location', 'Recipe', 'recipes', 
  function($scope, $location, Recipe, recipes) {

    $scope.recipes = recipes;

    $scope.new = function() {

      Recipe.createNew(
        function(recipe) {
          var editUrl = "/recipes/" + recipe.url + "/" + recipe.key + "/edit";
          $location.url(editUrl);
        },
        function(e) {
          $scope.errorMsg = e.data.message;
        }
      );

    }

  }
]);


cookingApp.controller('RecipeDetailController', ['$scope', '$http', '$location', 'recipe',
  function($scope, $http, $location, recipe) {

    $scope.recipe = recipe;

    // I should eventually convert these actions (start/unstar/shop/noshop)
    // into actions in the Recipe service. 
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


cookingApp.controller('RecipeEditController', ['$scope', '$location', 'Recipe', 'recipe', 
  function($scope, $location, Recipe, recipe) {

    $scope.recipe = recipe;

    $scope.submit = function() {

      var recipe = new Recipe($scope.recipe);
      recipe.$save(
        function(r) {
          var viewUrl = "/recipes/" + r.url + "/"+ r.key;
          $location.url(viewUrl);
        },
        function(e) {
          $scope.errorMsg = e.data.message;
        }
      );

    }

  }
]);


cookingApp.controller('RecipeSearchController', ['$scope', '$routeParams', 'Recipe', 'recipes',
  function($scope, $routeParams, Recipe, recipes) {

    $scope.recipes = recipes;
    $scope.searchText = globalSearch.text;
    $scope.message = "";
    $scope.errorMsg = null;
    
    $scope.search = function() {

      Recipe.query(
        {text: $scope.searchText}, 
        function(recipes) {

          $scope.message = "";
          $scope.recipes = recipes;
          $scope.errorMsg = null;
          globalSearch.text = $scope.searchText;
          globalSearch.data = recipes;

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

        }, 
        function(e) {

          globalSearch.text = null;
          globalSearch.data = null;

          $scope.errorMsg = e.message + "/" + e.details;
          console.log($scope.errorMsg);

        }
      );

    }

  }
]);


