function recipeController($scope, $http) {
  $scope.xxx = "XXX";

  var url = "/recipe2/listdata"
  $http.get(url).success(function(recipes) {
    $scope.recipes = recipes;
  });

  // $scope.recipes = [];
  // var _scope = $scope;
  // $.get(url, function(recipes) {
  //   debugger;
  //   _scope.recipes = recipes;
  // });

}

