"use trick";
sharedComponents.directive("paneV", function () {
  return {
    require: "^tabs-v",
    restrict: "E",
    transclude: true,
    scope: { header: "@", id: "@", icon: "@", class: "@" },
    link: function (scope, element, attrs, tabsController) {
      tabsController.addPane(scope);
    },
    template:
      '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
      "</div>",
    replace: true,
  };
});
