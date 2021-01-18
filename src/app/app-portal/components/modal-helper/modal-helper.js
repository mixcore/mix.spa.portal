modules.component("modalHelper", {
  templateUrl:
    "/mix-app/views/app-portal/components/modal-helper/modal-helper.html",
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
        $("#dev-helper-modal").on("shown.bs.modal", function () {
          if ($rootScope.helperUrl) {
            ctrl.trustedUrl = $sce.trustAsResourceUrl($rootScope.helperUrl);
            ctrl.title = "Developer Document";
          }
          else {
            ctrl.loadHelperUrl();
            ctrl.title = "Developer Document";
          }
          $rootScope.helperUrl = null;
          $scope.$apply();
        });
      };
      ctrl.loadHelperUrl = function () {
        var portalUrl = $location.url();
        var defaultUrl = 'https://docs.mixcore.org/docs/introduction';
        switch (portalUrl) {
          case '/portal':
          default:
            ctrl.trustedUrl = $sce.trustAsResourceUrl(defaultUrl);
            break;
        }
      };
    },
  ],
});
