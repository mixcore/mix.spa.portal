modules.component("modalHelper", {
  templateUrl: "/mix-app/views/app-portal/components/modal-helper/modal-helper.html",
  bindings: {
    url: "=?",
    title: "=?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "localStorageService",
    "$routeParams",
    "$location",
    "$sce",
    function (
      $rootScope,
      $scope,
      localStorageService,
      $routeParams,
      $location,
      $sce
    ) {
      var ctrl = this;
      ctrl.$onInit = function () {
        ctrl.trustedUrl = $sce.trustAsResourceUrl(ctrl.url);
        ctrl.title = ctrl.title || "Developer Document";
      };
    },
  ],
});
