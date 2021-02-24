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
          } else {
            ctrl.loadHelperUrl();
            ctrl.title = "Developer Document";
          }
          $rootScope.helperUrl = null;
          $scope.$apply();
        });
      };
      ctrl.loadHelperUrl = function () {
        var portalUrl = $location.url();
        // var portalabsUrl = $location.absUrl();
        var defaultUrl = "//docs.mixcore.org";
        ctrl.trustedUrl = $sce.trustAsResourceUrl(defaultUrl);

        if (portalUrl.startsWith("/portal")) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-administration-screens"
          );
        }
        if (
          portalUrl.startsWith("/portal/mix-database-data/list?mixDatabaseId=2")
        ) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-navigation"
          );
        }
        if (portalUrl.startsWith("/portal/post")) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-writing-posts"
          );
        }
        if (portalUrl.startsWith("/portal/page")) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-page"
          );
        }
        if (portalUrl.startsWith("/portal/module")) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-module"
          );
        }
        if (portalUrl.startsWith("/portal/mix-database")) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-database"
          );
        }
        if (
          portalUrl.startsWith("/portal/mix-database-data/list?mixDatabaseId=7")
        ) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-category"
          );
        }
        if (
          portalUrl.startsWith("/portal/mix-database-data/list?mixDatabaseId=8")
        ) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-tag"
          );
        }
        if (portalUrl.startsWith("/portal/media")) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-media"
          );
        }
        if (portalUrl.startsWith("/portal/file")) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-file"
          );
        }
        if (portalUrl.startsWith("/portal/user")) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-user"
          );
        }
        if (portalUrl.startsWith("/portal/theme")) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-theme"
          );
        }
        if (portalUrl.startsWith("/portal/app-settings")) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-app-settings"
          );
        }
        if (portalUrl.startsWith("/portal/configuration")) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-configuration"
          );
        }
        if (portalUrl.startsWith("/portal/my-profile")) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-users-profile"
          );
        }

        // switch (portalUrl) {
        //   case '/portal':
        //   default:
        //     ctrl.trustedUrl = $sce.trustAsResourceUrl(defaultUrl);
        //     break;
        // }
      };
    },
  ],
});
