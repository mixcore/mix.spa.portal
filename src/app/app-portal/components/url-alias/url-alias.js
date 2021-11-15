modules.component("urlAlias", {
  templateUrl: "/mix-app/views/app-portal/components/url-alias/url-alias.html",
  controller: [
    "$rootScope",
    "$scope",
    "UrlAliasService",
    function ($rootScope, $scope, service) {
      var ctrl = this;
      ctrl.$onInit = function () {
        ctrl.updateUrl();
      };
      ctrl.updateUrl = function () {
        ctrl.url =
          $rootScope.appSettings.domain +
          "/" +
          $rootScope.mixConfigurations.lang +
          "/" +
          ctrl.urlAlias.alias;
      };
      ctrl.remove = function () {
        if (ctrl.urlAlias.id > 0) {
          $rootScope.showConfirm(
            ctrl,
            "removeConfirmed",
            [ctrl.urlAlias.id],
            null,
            "Remove",
            "Deleted data will not able to recover, are you sure you want to delete this item?"
          );
        } else {
          if (ctrl.removeCallback) {
            ctrl.removeCallback({ index: ctrl.index });
          }
        }
      };

      ctrl.removeConfirmed = async function (id) {
        $rootScope.isBusy = true;
        var result = await service.delete(id);
        if (result.success) {
          if (ctrl.removeCallback) {
            ctrl.removeCallback({ index: ctrl.index });
          }
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          $rootScope.showMessage("failed");
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };
    },
  ],
  bindings: {
    urlAlias: "=",
    index: "=",
    callback: "&",
    removeCallback: "&",
  },
});
