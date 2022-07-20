"use strict";
appShared.factory("AppSettingsService", [
  "$rootScope",
  "ApiService",
  "CommonService",
  "localStorageService",
  "AppSettings",
  function (
    $rootScope,
    apiService,
    commonService,
    localStorageService,
    appSettings
  ) {
    var factory = {};
    var _appSettings = {
      lang: "",
      data: null,
    };
    var _fillAppSettings = async function (culture) {
      this.appSettings = localStorageService.get("appSettings");
      if (
        this.appSettings &&
        this.appSettings.data &&
        this.appSettings.lang === culture
      ) {
        //_appSettings = appSettings;
        //this.appSettings = appSettings;

        return this.appSettings;
      } else {
        this.appSettings = await _getappSettings(culture);
        return this.appSettings;
      }
    };
    var _getappSettings = async function (culture) {
      var appSettings = localStorageService.get("appSettings");
      if (appSettings && (!culture || appSettings.lang === culture)) {
        appSettings = appSettings;
        return appSettings;
      } else {
        appSettings = { lang: culture, data: null };
        var url = "/admin";
        if (culture) {
          url += "/" + culture;
        }
        url += "/global-settings";
        var req = {
          method: "GET",
          url: url,
        };
        var getData = await apiService.sendRequest(req);
        if (getData.success) {
          appSettings = getData.data;
          localStorageService.set("appSettings", appSettings);
        }
        return appSettings;
      }
    };
    var _reset = async function (lang) {
      localStorageService.remove("appSettings");
      await _getappSettings(lang);
    };
    var _get = function (keyword, isWrap, defaultText) {
      if ($rootScope.waitForInit()) {
        if (!this.appSettings && $rootScope.globalSettings) {
          $rootScope.isBusy = true;
          this.fillAppSettings($rootScope.globalSettings.lang).then(function (
            response
          ) {
            $rootScope.isBusy = false;
            return (
              response[keyword] ||
              defaultText ||
              getLinkCreateLanguage(keyword, isWrap)
            );
          });
        } else {
          return (
            this.appSettings[keyword] ||
            defaultText ||
            getLinkCreateLanguage(keyword, isWrap)
          );
        }
      }
    };

    var _getAsync = async function (keyword, defaultText) {
      if (!this.appSettings && $rootScope.globalSettings) {
        $rootScope.isBusy = true;
        this.appSettings = await _fillAppSettings(lang);
        return (
          this.appSettings[keyword] ||
          defaultText ||
          getLinkCreateLanguage(keyword, isWrap)
        );
      } else {
        return (
          this.appSettings[keyword] ||
          defaultText ||
          getLinkCreateLanguage(keyword, isWrap)
        );
      }
    };

    var getLinkCreateLanguage = function (keyword, isWrap) {
      //return '<span data-key="/admin/language/details?k=' + keyword + '">[' + keyword + ']</span>';
      return isWrap ? "[" + keyword + "]" : keyword;
    };

    factory.getAsync = _getAsync;
    factory.get = _get;
    factory.reset = _reset;
    factory.appSettings = _appSettings;
    factory.fillAppSettings = _fillAppSettings;
    return factory;
  },
]);
