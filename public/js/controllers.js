// http://docs.angularjs.org/tutorial/step_07
var cookingModule = angular.module('cookingModule', []);

var routesConfig = function($routeProvider) {
  $routeProvider.
  when('/recipe', {
    controller: RecipeController,
    templateUrl: 'partials/recipeList.html'   
  }).
  when('/recipe/save/:key', {
    controller: RecipeDetailController,
    templateUrl: 'partials/recipeDetail.html',   
  }).
  when('/recipe/:url/:key/edit', {
    controller: RecipeEditController,
    templateUrl: 'partials/recipeEdit.html' 
  }).
  when('/recipe/:url/:key', {
    controller: RecipeDetailController,
    templateUrl: 'partials/recipeDetail.html' 
  }).
  otherwise({
    redirectTo: '/recipe'
  });
}

cookingModule.config(routesConfig);


function RecipeController($scope, $http) {

  var serverUrl = "/recipe/all"
  $http.get(serverUrl).success(function(recipes) {
    $scope.recipes = recipes;
  });

}


function RecipeDetailController($scope, $routeParams, $http, $location) {

  var serverUrl = "/recipe/" + $routeParams.url + "/"+ $routeParams.key;
  $http.get(serverUrl).success(function(recipe) {
    var clientUrl = "/recipe/" + recipe.url + "/" + recipe.key;
    recipe.editUrl = clientUrl + "/edit";
    recipe.starUrl = clientUrl + "/star";
    recipe.unstarUrl = clientUrl + "/unstar";
    $scope.recipe = recipe;
  });

  $scope.star = function(){
    var starUrl = serverUrl + "/star" ;
    $http.post(starUrl).success(function(data) {
      $scope.recipe.isStarred = data.starred;
    });
  }

  $scope.unstar = function(){
    var unstarUrl = serverUrl + "/unstar" ;
    $http.post(unstarUrl).success(function(data) {
      $scope.recipe.isStarred = data.starred;
    });
  }

  $scope.shop = function(){
    var shopUrl = serverUrl + "/shop" ;
    $http.post(shopUrl).success(function(data) {
      $scope.recipe.isShoppingList = data.shop;
    });
  }

  $scope.noshop = function(){
    var noShopUrl = serverUrl + "/noshop" ;
    $http.post(noShopUrl).success(function(data) {
      $scope.recipe.isShoppingList = data.shop;
    });
  }

  $scope.edit = function() {
    $location.url($scope.recipe.editUrl);
  }

}


function RecipeEditController($scope, $routeParams, $http, $location) {

  $scope.submit = function() {
    var saveUrl = "/recipe/save/" + $routeParams.key;
    console.log("Saving: " + saveUrl);
    $http.post(saveUrl, $scope.recipe)
    .success(function(x) {
      console.log("done saving");
      var viewUrl = "/recipe/" + x.url + "/"+ x.key;
      $location.url(viewUrl);
    })
    .error(function(e) {
      console.log("error saving");
      console.log(e);
    }); 
  }

  var serverUrl = "/recipe/" + $routeParams.url + "/"+ $routeParams.key + "/edit";
  $http.get(serverUrl).success(function(recipe) {
    recipe.saveUrl = "/recipe/save/" + recipe.key;
    $scope.recipe = recipe;
  });

}

