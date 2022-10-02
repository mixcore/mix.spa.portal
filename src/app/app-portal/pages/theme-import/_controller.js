"use strict";
app.controller("ThemeImportController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$routeParams",
  "$location",
  "ApiService",
  "TenancyService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $routeParams,
    $location,
    apiService,
    tenancyService
  ) {
    $scope.importData = null;
    $scope.init = function () {};
    $scope.getSingleSuccessCallback = function () {
      $scope.assets = null;
      $scope.theme = null;
    };
    $scope.submit = async function () {
      $scope.form = document.getElementById("form-portal");
      let theme = $scope.form["theme"].files[0];
      if (theme) {
        await $scope.extract(theme);
        document.getElementById("form-portal")["theme"].value = "";
      } else {
        $scope.import();
      }
    };
    $scope.extract = async function (theme) {
      $rootScope.isBusy = true;
      var frm = new FormData();
      var url = "/rest/mix-tenancy/setup/extract-theme";
      $rootScope.isBusy = true;
      // Looping over all files and add it to FormData object
      frm.append("theme", theme);
      // Adding one more key to FormData object
      frm.append("model", angular.toJson($scope.data));
      var response = await apiService.ajaxSubmitForm(frm, url);
      $rootScope.isBusy = false;
      if (response.success) {
        var getData = await $scope.loadTheme();
        if (getData.success) {
          $scope.importThemeDto = getData.data;
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };

    $scope.loadTheme = async function () {
      var req = {
        method: "GET",
        url: "/rest/mix-tenancy/setup/load-theme",
      };
      return await apiService.sendRequest(req);
    };

    $scope.import = async function () {
      $scope.importThemeDto.themeId = $routeParams.id;
      $rootScope.isBusy = true;
      var response = await tenancyService.import($scope.importThemeDto);

      if (response.success) {
        $rootScope.isBusy = false;
        window.open("/", "_blank");
        $scope.$apply();
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
  },
]);
