sharedComponents.component("mixStore", {
  templateUrl: "/mix-app/views/app-shared/components/store/view.html",
  bindings: {
    installCallback: "&?",
  },
  controller: [
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
      var ctrl = this;
      ctrl.categories = [];
      BaseHub.call(this, ctrl);
      ctrl.current = null;
      ctrl.viewMode = "list";
      ctrl.init = async function () {
        ctrl.startConnection("portalhub", () => {
          ctrl.joinRoom("Theme");
        });
        ctrl.themeRequest = angular.copy(ngAppSettings.request);
        ctrl.themeRequest.orderBy = "createdDatetime";
        ctrl.themeRequest.postType = "theme";
        ctrl.themeRequest.query.mixcore_versions = "1.0.5";
        ctrl.cateRequest = angular.copy(ngAppSettings.request);
        ctrl.cateRequest.mixDatabaseName = "sys_category";
        ctrl.cateRequest.pageSize = null;

        ctrl.localizeSettings = $rootScope.globalSettings;
        let getCategories = await service.getCategories(ctrl.cateRequest);
        ctrl.categories = getCategories.data.items;
        await ctrl.getThemes(ctrl.themeRequest);
        $scope.$apply();
      };
      ctrl.receiveMessage = function (resp) {
        let msg = JSON.parse(resp);
        switch (msg.action) {
          case "Downloading":
            var index = ctrl.data.items.findIndex(
              (m) => m.id == ctrl.current.id
            );
            var progress = Math.round(msg.message);
            if (index >= 0) {
              ctrl.data.items[index].progress = progress;
              if (progress == 100) {
                ctrl.data.items[index].additionalData.installStatus =
                  "Installing";
              }
              $scope.$apply();
            }
            break;

          default:
            console.log(msg);
            break;
        }
      };
      ctrl.getThemes = async function () {
        $rootScope.isBusy = true;
        if (ctrl.themeRequest.fromDate !== null) {
          var d = new Date(ctrl.themeRequest.fromDate);
          ctrl.themeRequest.fromDate = d.toISOString();
        }
        if (ctrl.themeRequest.toDate !== null) {
          var dt = new Date(ctrl.themeRequest.toDate);
          ctrl.themeRequest.toDate = dt.toISOString();
        }
        var resp = await service.getThemes(ctrl.themeRequest);
        if (resp && resp.isSucceed) {
          ctrl.data = resp.data;
          $.each(ctrl.data, function (i, data) {
            $.each(ctrl.viewmodels, function (i, e) {
              if (e.dataId === data.id) {
                data.isHidden = true;
              }
            });
          });
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          if (resp) {
            $rootScope.showErrors(resp.errors || ["Failed"]);
          }
          if (ctrl.getListFailCallback) {
            ctrl.getListFailCallback();
          }
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };
      ctrl.preview = function (theme) {
        ctrl.current = theme;
        // TODO: verify user - theme to enable install
        ctrl.current.canInstall = true;
        ctrl.viewMode = "detail";
      };
      ctrl.back = function () {
        ctrl.viewMode = "list";
      };
      ctrl.processPaymentData = async function (paymentData) {
        var encrypted = cryptoService.encryptAES(paymentData);
        ctrl.current.canInstall = true;
        $scope.$apply();
        return encrypted;
      };
      ctrl.installTheme = async function (theme, id) {
        $rootScope.isBusy = false;
        theme.installStatus = "downloading";
        ctrl.id = id;
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

        if (ctrl.installCallback) {
          ctrl.installCallback({ data: result });
        }
        $scope.$apply();
      };
    },
  ],
});
