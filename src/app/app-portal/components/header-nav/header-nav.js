(function (angular) {
  app.component("headerNav", {
    templateUrl:
      "/mix-app/views/app-portal/components/header-nav/headerNav.html",
    controller: [
      "$rootScope",
      "$scope",
      "ngAppSettings",
      "localStorageService",
      "CommonService",
      "ApiService",
      "AuthService",
      "CultureService",
      function (
        $rootScope,
        $scope,
        ngAppSettings,
        localStorageService,
        commonService,
        apiService,
        authService,
        cultureService
      ) {
        var ctrl = this;
        ctrl.appSettings = $rootScope.globalSettings;
        ctrl.isInRole = $rootScope.isInRole;
        this.$onInit = function () {
          ctrl.isAdmin = $rootScope.isAdmin;
          ctrl.mixConfigurations = $rootScope.mixConfigurations;
          cultureService.getList(ngAppSettings.request).then((resp) => {
            ctrl.cultures = resp.data.items;
            ctrl.selectedCulture = ctrl.cultures.find(
              (m) =>
                m.specificulture == $rootScope.globalSettings.defaultCulture
            );
            $scope.$apply();
          });
          authService.fillAuthData().then(() => {
            if (
              authService.authentication &&
              authService.authentication.info.userData
            ) {
              ctrl.avatar =
                authService.authentication.info.userData.data.avatar;
            }
          });
        };
        ctrl.translate = $rootScope.translate;
        ctrl.getConfiguration = function (keyword, isWrap, defaultText) {
          return $rootScope.getConfiguration(keyword, isWrap, defaultText);
        };
        ctrl.changeLang = function (culture) {
          $rootScope.globalSettings.defaultCulture = culture.specificulture;
          localStorageService.set("globalSettings", $rootScope.globalSettings);
          window.top.location = location.href;
        };
        ctrl.logOut = function () {
          $rootScope.logOut();
        };
        ctrl.addPermission = function () {
          $("#dlg-permission").modal("show");
        };
        ctrl.addBookmark = function () {
          $("#dlg-bookmark").modal("show");
        };
        ctrl.toggleSidebar = function () {
          $(".main-sidebar").toggle();
          $(".sub-sidebar").toggle();
          // $('.navbar-brand').toggle();
        };
        ctrl.showHelper = function (url) {
          $rootScope.helperUrl = url;
          $("#dev-helper-modal").modal("show");
        };
        ctrl.generateSitemap = async function () {
          $rootScope.isBusy = true;
          var resp = await commonService.genrateSitemap();
          if (resp) {
            window.top.location.href =
              "/portal/file/details?folder=" +
              resp.fileFolder +
              "&filename=" +
              resp.fileName +
              resp.extension;
          } else {
            $rootScope.isBusy = false;
            $rootScope.showErrors(["Server error"]);
          }
        };
      },
    ],
    bindings: {
      breadCrumbs: "=",
      settings: "=",
    },
  });
})(window.angular);
