modules.component("haiyenLoader", {
  templateUrl: "/mix-app/views/app-client/components/customs/loader/view.html",
  controller: [
    "$scope",
    "$location",
    function ($scope, $location) {
      var ctrl = this;
      ctrl.imageDataArray = [];
      ctrl.canvasCount = 10;
      ctrl.duration = 500;
      ctrl.bgDuration = 2500;
      ctrl.canvas = null;
      ctrl.isLoaded = false;
      ctrl.init = function () {
        setTimeout(() => {
          $scope.$apply((ctrl.isLoaded = true));
        }, 500);
      };
    },
  ],

  bindings: {},
});
