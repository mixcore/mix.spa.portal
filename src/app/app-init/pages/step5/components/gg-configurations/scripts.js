app.component("initGgConfigurations", {
  templateUrl:
    "/mix-app/views/app-init/pages/step3/components/gg-configurations/view.html",
  controller: [
    "$rootScope",
    function ($rootScope) {
      var ctrl = this;
      ctrl.data = [];
      ctrl.$onInit = function () {
        ctrl.data = $rootScope.filterArray(
          ctrl.configurations,
          ["category"],
          ["Social_Google"]
        );
      };
    },
  ],
  bindings: {
    configurations: "=",
  },
});
