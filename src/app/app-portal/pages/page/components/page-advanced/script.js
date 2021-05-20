app.component("pageAdvanced", {
  templateUrl:
    "/mix-app/views/app-portal/pages/page/components/page-advanced/view.html",
  bindings: {
    model: "=",
    additionalData: "=",
  },
  controller: [
    "$rootScope",
    "$scope",
    function ($rootScope, $scope) {
      var ctrl = this;

      ctrl.translate = $rootScope.translate;
      ctrl.$onInit = function () {
        ctrl.isAdmin = $rootScope.isAdmin;
      };
    },
  ],
});
