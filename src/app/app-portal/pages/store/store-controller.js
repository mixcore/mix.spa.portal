"use strict";
app.controller("StoreController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "CryptoService",
  "ThemeService",
  "StoreService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    cryptoService,
    themeService,
    service
  ) {
    $scope.categories = [];
    BaseHub.call(this, $scope);
    $scope.current = null;
    $scope.viewMode = "list";
    $scope.init = async function () {
      $scope.startConnection("portalhub", () => {
        $scope.joinRoom("Theme");
      });

      $scope.themeRequest = angular.copy(ngAppSettings.request);
      $scope.themeRequest.orderBy = "createdDatetime";
      $scope.themeRequest.postType = "theme";
      $scope.cateRequest = angular.copy(ngAppSettings.request);
      $scope.cateRequest.mixDatabaseName = "sys_category";
      $scope.cateRequest.pageSize = null;

      $scope.cates = ngAppSettings.enums.configuration_cates;
      $scope.localizeSettings = $rootScope.globalSettings;
      let getCategories = await service.getCategories($scope.cateRequest);
      $scope.categories = getCategories.data.items;
      await $scope.getThemes($scope.themeRequest);
      $scope.$apply();
    };
    $scope.receiveMessage = function (msg) {
      switch (msg.action) {
        case "Downloading":
          var index = $scope.data.items.findIndex((m) => m.id == $scope.id);
          var progress = Math.round(msg.message);
          if (index >= 0) {
            $scope.data.items[index].progress = progress;
            if (progress == 100) {
              $scope.data.items[index].additionalData.installStatus =
                "installing";
            }
            $scope.$apply();
          }
          break;

        default:
          console.log(msg);
          break;
      }
    };
    $scope.getThemes = async function () {
      $rootScope.isBusy = true;

      if ($scope.themeRequest.fromDate !== null) {
        var d = new Date($scope.themeRequest.fromDate);
        $scope.themeRequest.fromDate = d.toISOString();
      }
      if ($scope.themeRequest.toDate !== null) {
        var dt = new Date($scope.themeRequest.toDate);
        $scope.themeRequest.toDate = dt.toISOString();
      }
      var resp = await service.getThemes($scope.themeRequest);
      if (resp && resp.isSucceed) {
        $scope.data = resp.data;
        $.each($scope.data, function (i, data) {
          $.each($scope.viewmodels, function (i, e) {
            if (e.dataId === data.id) {
              data.isHidden = true;
            }
          });
        });
        if ($scope.getListSuccessCallback) {
          $scope.getListSuccessCallback();
        }
        if ($scope.isScrollTop) {
          $("html, body").animate({ scrollTop: "0px" }, 500);
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors || ["Failed"]);
        }
        if ($scope.getListFailCallback) {
          $scope.getListFailCallback();
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.preview = function (theme) {
      $scope.current = theme;
      // TODO: verify user - theme to enable install
      $scope.current.canInstall = true;
      $scope.viewMode = "detail";
    };
    $scope.back = function () {
      $scope.viewMode = "list";
    };
    $scope.processPaymentData = async function (paymentData) {
      var encrypted = cryptoService.encryptAES(paymentData);
      $scope.current.canInstall = true;
      $scope.$apply();
      return encrypted;
    };
    $scope.installTheme = async function (theme, id) {
      $rootScope.isBusy = false;
      theme.installStatus = "downloading";
      $scope.id = id;
      var result = await themeService.install(theme);
      if (result.isSucceed) {
        $rootScope.isBusy = false;
        theme.installStatus = "finished";
        $rootScope.showMessage("success");
      } else {
        $rootScope.isBusy = false;
        theme.installStatus = "failed";
        $rootScope.showErrors(result.errors);
      }
      $scope.$apply();
    };
  },
]);
