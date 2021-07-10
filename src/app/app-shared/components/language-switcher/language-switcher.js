(function (angular) {
  appShared.component("languageSwitcher", {
    templateUrl:
      "/mix-app/views/app-shared/components/language-switcher/language-switcher.html",
    controller: [
      "$rootScope",
      "ApiService",
      "TranslatorService",
      function ($rootScope, apiService, translatorService) {
        var ctrl = this;
        ctrl.mixConfigurations = {};
        this.$onInit = function () {
          ctrl.mixConfigurations = $rootScope.mixConfigurations;
          if ($rootScope.appSettings) {
            ctrl.mixConfigurations.cultures = $rootScope.appSettings.cultures;
          }
        };

        ctrl.changeLang = async function (lang, langIcon) {
          ctrl.mixConfigurations.lang = lang;
          ctrl.mixConfigurations.langIcon = langIcon;
          // await commonService.removeSettings();
          // await commonService.removeTranslator();
          // commonService.fillSettings(lang).then(function () {
          //     translatorService.reset(lang).then(function () {
          apiService.getAllSettings(lang).then(function (response) {
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
