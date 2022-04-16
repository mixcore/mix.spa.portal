modules.component("actions", {
  templateUrl: "/mix-app/views/app-portal/components/actions/actions.html",
  bindings: {
    primaryUrl: "=",
    primaryTitle: "=",
    primaryIcon: "=",
    previewUrl: "=",
    backUrl: "=",
    contentUrl: "=",
    onClearCache: "&?",
    onSubmit: "&?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "$location",
    function ($rootScope, $scope, $location) {
      var ctrl = this;
      ctrl.visible = $rootScope.visible;
      ctrl.back = function () {
        // ctrl.backUrl = ctrl.backUrl || "/admin";
        // $location.url(ctrl.backUrl);
        if (ctrl.backUrl) {
          $location.url(ctrl.backUrl);
        } else {
          window.history.back();
        }
      };
      ctrl.$onInit = function () {
        ctrl.isAdmin = $rootScope.isAdmin;
      };
      ctrl.submit = function ($event) {
        if (ctrl.onSubmit) {
          $event.preventDefault();
          ctrl.onSubmit();
          return;
        }
      };
      ctrl.clearCache = function () {
        ctrl.onClearCache();
      };
    },
  ],
});
