"use strict";
app.controller("Step3Controller", [
  "$scope",
  "$rootScope",
  "ApiService",
  "StoreService",
  "Step3Services",
  function ($scope, $rootScope, apiService, storeService, service) {
    var rand = Math.random();
    $scope.data = {
      isCreateDefault: true,
      theme: null,
    };
    $scope.request = {
      pageSize: "20",
      pageIndex: 0,
      status: "Published",
      orderBy: "CreatedDateTime",
      direction: "Desc",
      fromDate: null,
      toDate: null,
      postType: "theme",
    };
    $scope.themeType = "materialkit";
    $scope.init = async function () {
      await apiService.getGlobalSettings();
      $scope.form = document.getElementById("frm-theme");
      var getThemes = await storeService.getThemes($scope.request);
      if (getThemes.success) {
        $scope.themes = getThemes.data;
        $scope.$apply();
      }
      $(".preventUncheck").on("change", function (e) {
        if ($(".preventUncheck:checked").length == 0 && !this.checked)
          this.checked = true;
      });
      $(".option").click(function () {
        $(".option").removeClass("active");
        $(this).addClass("active");
      });
    };
    $scope.submit = async function () {
      let theme = $scope.form["theme"].files[0];
      if ($scope.mode === "Upload your theme" && !theme) {
        $rootScope.showErrors(["Please select theme file"]);
        return;
      }
      $rootScope.isBusy = true;
      var frm = new FormData();
      var url = "/rest/mix-tenancy/setup/extract-theme";
      $scope.data.isCreateDefault = $scope.themeType === "materialkit";
      $rootScope.isBusy = true;
      // Looping over all files and add it to FormData object
      frm.append("theme", theme);
      // Adding one more key to FormData object
      frm.append("model", angular.toJson($scope.data));
      var response = await service.ajaxSubmitForm(frm, url);
      $rootScope.isBusy = false;
      if (response.success) {
        $rootScope.goToPath("/init/step4");
        $scope.$apply();
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.install = function (resp) {
      if (resp.success) {
        $rootScope.goToPath("/init/step4");
      } else {
        $rootScope.showErrors(["Cannot install theme"]);
      }
    };
    $scope.selectPane = function (pane) {
      $scope.canContinue = pane.header !== "Mixcore Store";
      $scope.mode = pane.header;
    };
  },
]);
