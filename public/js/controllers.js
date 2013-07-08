function RecipeController($scope, $http) {

  var serverUrl = "/recipe/all"
  $http.get(serverUrl).success(function(recipes) {
    $scope.recipes = recipes;
  });

}


function RecipeDetailController($scope, $routeParams, $http) {

  var serverUrl = "/recipe/" + $routeParams.url + "/"+ $routeParams.key;
  $http.get(serverUrl).success(function(recipe) {
    var clientUrl = "#/recipe/" + recipe.url + "/" + recipe.key;
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

}

