sharedComponents.directive("pills", function () {
  return {
    restrict: "E",
    transclude: true,
    scope: {
      selectCallback: "&",
    },
    controller: function ($scope, $element) {
      var panes = ($scope.panes = []);

      $scope.select = function (pane) {
        angular.forEach(panes, function (pane) {
          pane.selected = false;
        });
        pane.selected = true;
        this.selectCallback({ pane: pane });
      };

      this.addPane = function (pane) {
        if (panes.length === 0) $scope.select(pane);
        panes.push(pane);
      };
    },
    templateUrl: "/mix-app/views/app-shared/components/pills/pills.html",
    replace: true,
  };
});
