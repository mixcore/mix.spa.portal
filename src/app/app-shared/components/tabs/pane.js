﻿"use trick";
sharedComponents.directive("pane", function () {
  return {
    require: "^tabs",
    restrict: "E",
    transclude: true,
    scope: { header: "@", id: "@", icon: "@" },
    link: function (scope, element, attrs, tabsController) {
      tabsController.addPane(scope);
    },
    template:
      '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
      "</div>",
    replace: true,
  };
});
