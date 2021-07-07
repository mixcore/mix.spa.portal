"use strict";
app.controller("Step3Controller", [
  "$scope",
  "$rootScope",
  "ApiService",
  "CommonService",
  "AuthService",
  "StoreService",
  "Step3Services",
  function (
    $scope,
    $rootScope,
    apiService,
    commonService,
    authService,
    storeService,
    service
  ) {
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
      $scope.form = document.getElementById("frm-theme");
      var getThemes = await storeService.getThemes($scope.request);
      if (getThemes.isSucceed) {
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
      var url = "/init/init-cms/step-3";
      $scope.data.isCreateDefault = $scope.themeType === "materialkit";
      $rootScope.isBusy = true;
      // Looping over all files and add it to FormData object
      frm.append("theme", theme);
      // Adding one more key to FormData object
      frm.append("model", angular.toJson($scope.data));
      var response = await service.ajaxSubmitForm(frm, url);
      if (response.isSucceed) {
        $scope.viewmodel = response.data;
        commonService.initAllSettings().then(function () {
          $rootScope.isBusy = false;
          setTimeout(() => {
            $rootScope.goToSiteUrl("/portal");
          }, 500);
          $scope.$apply();
        });
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.install = function (resp) {
      if (resp.isSucceed) {
        $scope.activeTheme(resp.data);
      } else {
        $rootScope.showErrors(["Cannot install theme"]);
      }
    };
    $scope.selectPane = function (pane) {
      $scope.canContinue = pane.header !== "Mixcore Store";
      $scope.mode = pane.header;
    };
    $scope.activeTheme = async function (data) {
      $rootScope.isBusy = true;
      var url = "/init/init-cms/step-3/active";
      $rootScope.isBusy = true;
      // Looping over all files and add it to FormData object
      var response = await service.activeTheme(data);
      if (response.isSucceed) {
        $scope.viewmodel = response.data;
        commonService.initAllSettings().then(function () {
          $rootScope.isBusy = false;
          setTimeout(() => {
            $rootScope.goToSiteUrl("/portal");
          }, 500);
          $scope.$apply();
        });
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
  },
]);
