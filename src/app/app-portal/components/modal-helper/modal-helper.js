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

        if (portalUrl.startsWith("/admin")) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-administration-screens"
          );
        }
        if (
          portalUrl.startsWith("/admin/mix-database-data/list?mixDatabaseId=2")
        ) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-navigation"
          );
        }
        if (portalUrl.startsWith("/admin/post")) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-writing-posts"
          );
        }
        if (portalUrl.startsWith("/admin/page")) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-page"
          );
        }
        if (portalUrl.startsWith("/admin/module")) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-module"
          );
        }
        if (portalUrl.startsWith("/admin/mix-database")) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-database"
          );
        }
        if (
          portalUrl.startsWith("/admin/mix-database-data/list?mixDatabaseId=7")
        ) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-category"
          );
        }
        if (
          portalUrl.startsWith("/admin/mix-database-data/list?mixDatabaseId=8")
        ) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-tag"
          );
        }
        if (portalUrl.startsWith("/admin/media")) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-media"
          );
        }
        if (portalUrl.startsWith("/admin/file")) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-file"
          );
        }
        if (portalUrl.startsWith("/admin/user")) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-user"
          );
        }
        if (portalUrl.startsWith("/admin/theme")) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-theme"
          );
        }
        if (portalUrl.startsWith("/admin/app-settings")) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-app-settings"
          );
        }
        if (portalUrl.startsWith("/admin/configuration")) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-configuration"
          );
        }
        if (portalUrl.startsWith("/admin/my-profile")) {
          ctrl.trustedUrl = $sce.trustAsResourceUrl(
            defaultUrl + "/basic-usage-users-profile"
          );
        }

        // switch (portalUrl) {
        //   case '/admin':
        //   default:
        //     ctrl.trustedUrl = $sce.trustAsResourceUrl(defaultUrl);
        //     break;
        // }
      };
    },
  ],
});
