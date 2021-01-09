modules.component("actions", {
  templateUrl: "/mix-app/views/app-portal/components/actions/actions.html",
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
        ctrl.isAdmin = $rootScope.isAdmin;
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
