modules.component("actions", {
  templateUrl: "/app/app-portal/components/actions/actions.html",
  controller: [
    "$rootScope",
    "$scope",
    "$location",
    function ($rootScope, $scope, $location) {
      var ctrl = this;
      ctrl.visible = $rootScope.visible;
      ctrl.back = function () {
        ctrl.backUrl = ctrl.backUrl || "/admin";
        $location.url(ctrl.backUrl);
      };
      ctrl.$onInit = function () {
        console.log(ctrl.clearCache);
      };
      ctrl.clearCache = function () {
        ctrl.onClearCache();
      };
    },
  ],
  bindings: {
    previewUrl: "=",
    backUrl: "=",
    contentUrl: "=",
    onClearCache: "&?",
  },
});
