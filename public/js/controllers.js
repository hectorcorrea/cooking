function RecipeController($scope, $http) {
  $scope.xxx = "list";

  var url = "/recipe2/listdata"
  $http.get(url).success(function(recipes) {
    $scope.recipes = recipes;
  });

}

function RecipeDetailController($scope, $routeParams) {
  $scope.xxx = "detail";
  $scope.recipeId = $routeParams.recipeId;
}

