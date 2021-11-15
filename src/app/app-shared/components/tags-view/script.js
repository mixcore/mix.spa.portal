﻿sharedComponents.component("tagsView", {
  templateUrl: "/mix-app/views/app-shared/components/tags-view/view.html",
  controller: [
    "$rootScope",
    "$scope",
    function ($rootScope, $scope) {
      var ctrl = this;
      ctrl.$onInit = function () {
        if (ctrl.tags) {
          ctrl.data = angular.fromJson(ctrl.tags);
        } else {
          ctrl.data = [];
        }
        angular.forEach(ctrl.data, function (e, i) {
          e.url =
            $rootScope.appSettings.domain +
            "/" +
            $rootScope.mixConfigurations.lang +
            "/tag/" +
            e.text;
        });
        $scope.$apply();
      };
    },
  ],
  bindings: {
    tags: "=",
  },
});
