app.component("postAdvanced", {
  templateUrl:
    "/mix-app/views/app-portal/pages/post/components/post-advanced/view.html",
  bindings: {
    model: "=",
    additionalData: "=",
  },
  controller: [
    "$rootScope",
    "$scope",
    "$routeParams",
    function ($rootScope, $scope, $routeParams) {
      var ctrl = this;
      ctrl.translate = $rootScope.translate;
      ctrl.$onInit = function () {
        ctrl.isAdmin = $rootScope.isAdmin;
        if ($routeParams.template) {
          ctrl.defaultTemplate = $routeParams.template;
        }
        if ($routeParams.layout) {
          ctrl.defaultLayout = $routeParams.layout;
        }
      };
    },
  ],
});
