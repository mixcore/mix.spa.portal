app.component("initFbConfigurations", {
  templateUrl:
    "/mix-app/views/app-init/pages/step3/components/fb-configurations/view.html",
  controller: [
    "$rootScope",
    function ($rootScope) {
      var ctrl = this;
      ctrl.data = [];
      ctrl.$onInit = function () {
        ctrl.data = $rootScope.filterArray(
          ctrl.configurations,
          ["category"],
          ["Social_Facebook"]
        );
      };
    },
  ],
  bindings: {
    configurations: "=",
  },
});
