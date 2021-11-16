(function (angular) {
  app.component("headerNav", {
    templateUrl:
      "/mix-app/views/app-portal/components/header-nav/headerNav.html",
    controller: [
      "$rootScope",
      "CommonService",
      "ApiService",
      "AuthService",
      function ($rootScope, commonService, apiService, authService) {
        var ctrl = this;
        ctrl.appSettings = $rootScope.globalSettings;
        ctrl.isInRole = $rootScope.isInRole;
        this.$onInit = function () {
          ctrl.isAdmin = $rootScope.isAdmin;
          ctrl.mixConfigurations = $rootScope.mixConfigurations;
          ctrl.mixConfigurations.cultures = $rootScope.globalSettings.cultures;
          authService.fillAuthData().then(() => {
            if (authService.authentication && authService.authentication.info) {
              ctrl.avatar = authService.authentication.info.avatar;
            }
          });
        };
        ctrl.translate = $rootScope.translate;
        ctrl.getConfiguration = function (keyword, isWrap, defaultText) {
          return $rootScope.getConfiguration(keyword, isWrap, defaultText);
        };
        ctrl.changeLang = function (lang, langIcon) {
          ctrl.mixConfigurations.lang = lang;
          ctrl.mixConfigurations.langIcon = langIcon;
          apiService.getAllSettings(lang).then(function () {
            window.top.location = location.href;
          });
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
