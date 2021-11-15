"use strict";
app.controller("ImportFileController", [
  "$scope",
  "$rootScope",
  "ImportFileServices",
  "TranslatorService",
  "AppSettingsService",
  function (
    $scope,
    $rootScope,
    service,
    translatorService,
    AppSettingsService
  ) {
    $scope.saveImportFile = async function () {
      $rootScope.isBusy = true;
      var form = document.getElementById("frm-import");
      var frm = new FormData();
      frm.append("assets", form["assets"].files[0]);
      var response = await service.saveImportFile(frm);
      if (response.success) {
        $scope.viewmodel = response.data;
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
  },
]);
