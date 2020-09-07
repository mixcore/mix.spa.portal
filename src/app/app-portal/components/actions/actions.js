modules.component("actions", {
  templateUrl: "/app/app-portal/components/actions/actions.html",
  controller: [
    "$rootScope",
    "$scope",
    "$location",
    function ($rootScope, $scope, $location) {
      var ctrl = this;
      ctrl.translate = $rootScope.translate;
      ctrl.back = function () {
        ctrl.backUrl = ctrl.backUrl || "/admin";
        $location.url(ctrl.backUrl);
      };
      ctrl.$onInit = function () {
        console.log(ctrl.clearCache);
      };
    },
  ],
  bindings: {
    previewUrl: "=",
    backUrl: "=",
    contentUrl: "=",
    clearCache: "&",
  },
});
