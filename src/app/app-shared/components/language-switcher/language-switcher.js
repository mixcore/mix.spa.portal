(function (angular) {
  appShared.component("languageSwitcher", {
    templateUrl:
      "/mix-app/views/app-shared/components/language-switcher/language-switcher.html",
    controller: [
      "$rootScope",
      "$scope",
      "$location",
      "ApiService",
      "CommonService",
      "TranslatorService",
      "GlobalSettingsService",
      function (
        $rootScope,
        $scope,
        $location,
        apiService,
        commonService,
        translatorService,
        globalSettingsService
      ) {
        var ctrl = this;
        ctrl.localizeSettings = {};
        this.$onInit = function () {
          ctrl.localizeSettings = $rootScope.localizeSettings;
          if ($rootScope.globalSettings) {
            ctrl.localizeSettings.cultures = $rootScope.globalSettings.cultures;
          }
        };

        ctrl.changeLang = async function (lang, langIcon) {
          ctrl.localizeSettings.lang = lang;
          ctrl.localizeSettings.langIcon = langIcon;
          // await commonService.removeSettings();
          // await commonService.removeTranslator();
          // commonService.fillSettings(lang).then(function () {
          //     translatorService.reset(lang).then(function () {
          commonService.fillAllSettings(lang).then(function (response) {
            translatorService.translateUrl(lang).then(function (url) {
              window.top.location = url;
            });
          });
          //     });
          // });
        };
        ctrl.logOut = function () {
          $rootScope.logOut();
        };
      },
    ],
    bindings: {
      //settings: '=',
      ulStyle: "=",
      liStyle: "=",
      aStyle: "=",
      activeClass: "=",
    },
  });
})(window.angular);
