"use strict";
app.controller("Step3Controller", [
  "$scope",
  "$rootScope",
  "CommonService",
  "AuthService",
  "Step3Services",
  function ($scope, $rootScope, commonService, authService, service) {
    var rand = Math.random();
    $scope.data = {
      isCreateDefault: true,
      theme: null,
    };
    $scope.themeType = "cleanblog";
    $scope.init = async function () {
      $scope.form = document.getElementById("frm-theme");
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
      $rootScope.isBusy = true;
      var frm = new FormData();
      var url = "/init/init-cms/step-3";
      $scope.data.isCreateDefault = $scope.themeType === "cleanblog";
      $rootScope.isBusy = true;
      // Looping over all files and add it to FormData object
      frm.append("theme", $scope.form["theme"].files[0]);
      // Adding one more key to FormData object
      frm.append("model", angular.toJson($scope.data));
      var response = await service.ajaxSubmitForm(frm, url);
      if (response.isSucceed) {
        $scope.viewModel = response.data;
        authService.initSettings().then(function () {
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
