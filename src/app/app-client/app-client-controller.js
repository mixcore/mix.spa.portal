(function (angular) {
  "use strict";
  app.controller("AppClientController", [
    "$rootScope",
    "$scope",
    "$location",
    "$anchorScroll",
    "GlobalSettingsService",
    "CommonService",
    "AuthService",
    "localStorageService",
    "TranslatorService",
    "SharedModuleDataService",
    "RestMixDatabaseDataClientService",
    function (
      $rootScope,
      $scope,
      $location,
      $anchorScroll,
      globalSettingsService,
      commonService,
      authService,
      localStorageService,
      translatorService,
      moduleDataService,
      mixDatabaseDataService
    ) {
      $scope.lang = "";
      $scope.isInit = false;
      $scope.isLoaded = false;
      $rootScope.user = null;
      $scope.mediaFile = {
        file: null,
        fullPath: "",
        folder: "module-data",
        title: "",
        description: "",
      };
      $scope.cartData = {
        items: [],
        totalItem: 0,
        total: 0,
      };
      $rootScope.globalSettingsService = globalSettingsService;
      $scope.changeLang = $rootScope.changeLang;
      $scope.init = function (lang) {
        angular.element(document).ready(function () {
          setTimeout(() => {
            if ($location.hash()) {
              $scope.gotoElement($location.hash());
            }
          }, 100);
        });

        mixDatabaseDataService.init(
          mixDatabaseDataService.modelName,
          false,
          lang
        );
        if (!$rootScope.isBusy) {
          $rootScope.isBusy = true;
          // globalSettingsService.fillGlobalSettings().then(function (response) {
          $scope.cartData = localStorageService.get("shoppingCart");
          if (!$scope.cartData) {
            $scope.cartData = {
              items: [],
              totalItem: 0,
              total: 0,
            };
            localStorageService.set("shoppingCart", $scope.cartData);
          }
          commonService.fillAllSettings(lang).then(function (response) {
            if ($rootScope.globalSettings) {
              authService.fillAuthData().then(function (response) {
                $rootScope.authentication = authService.authentication;
                $scope.isInit = true;
                $rootScope.isInit = true;
                $rootScope.isBusy = false;
                $scope.$apply();
              });

              // });
            } else {
              $scope.isInit = true;
              $rootScope.isInit = true;
              $rootScope.isBusy = false;
            }
          });

          // });
        }

        // $(document).on('click', 'a', function(e){
        //     var href = $(this).attr('href');
        //     var target = $(this).attr('target');
        //     if(!$(this).hasClass('each-portfolio') && href && href.indexOf('#') !== 0 && target!='_blank'){
        //         e.preventDefault();
        //         $scope.$apply($scope.isBusy = true);
        //         setTimeout(() => {
        //             // window.location.href = href;
        //             window.open(href, target || '_top');
        //         }, (200));
        //     }
        // });
      };

      $scope.translate = $rootScope.translate;
      $scope.gotoElement = function (eID) {
        // call $anchorScroll()
        if (!document.getElementById(eID)) {
          window.location = `/#${eID}`;
        }
        $scope.scrollTo(eID);
      };

      $scope.scrollTo = function (eID) {
        // This scrolling function
        // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript

        var startY = currentYPosition();
        var stopY = elmYPosition(eID);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
          scrollTo(0, stopY);
          return;
        }
        var speed = Math.round(distance / 100);
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
          for (var i = startY; i < stopY; i += step) {
            setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
            leapY += step;
            if (leapY > stopY) leapY = stopY;
            timer++;
          }
          return;
        }
        for (var i = startY; i > stopY; i -= step) {
          setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
          leapY -= step;
          if (leapY < stopY) leapY = stopY;
          timer++;
        }

        function currentYPosition() {
          // Firefox, Chrome, Opera, Safari
          if (self.pageYOffset) return self.pageYOffset;
          // Internet Explorer 6 - standards mode
          if (document.documentElement && document.documentElement.scrollTop)
            return document.documentElement.scrollTop;
          // Internet Explorer 6, 7 and 8
          if (document.body.scrollTop) return document.body.scrollTop;
          return 0;
        }

        function elmYPosition(eID) {
          var elm = document.getElementById(eID);
          var y = elm.offsetTop;
          var node = elm;
          while (node.offsetParent && node.offsetParent != document.body) {
            node = node.offsetParent;
            y += node.offsetTop;
          }
          return y;
        }
      };
      $scope.previewData = function (moduleId, id) {
        var obj = {
          moduleId: moduleId,
          id: id,
        };
        $rootScope.preview("module-data", obj, null, "modal-lg");
      };

      $scope.initModuleForm = async function (
        name,
        successCallback,
        failCallback
      ) {
        var resp = null;
        $scope.successCallback = successCallback;
        $scope.failCallback = failCallback;
        setTimeout(async () => {
          $scope.name = name;
          if ($scope.id) {
            resp = await moduleDataService.getModuleData(
              $scope.id,
              $scope.dataId,
              "portal"
            );
          } else {
            resp = await moduleDataService.initModuleForm($scope.name);
          }

          if (resp && resp.isSucceed) {
            $scope.activedModuleData = resp.data;
            $rootScope.isBusy = false;
            $scope.$apply();
          } else {
            if (resp) {
              if ($scope.errorCallback) {
                $rootScope.executeFunctionByName(
                  $scope.errorCallback,
                  [resp],
                  window
                );
              } else {
                $rootScope.showErrors(resp.errors);
              }
            }
            $rootScope.isBusy = false;
            $scope.$apply();
          }
        }, 500);
      };

      $scope.initMixDatabaseForm = async function (formName) {
        return await mixDatabaseDataService.initData(formName).data;
      };

      $scope.saveModuleData = async function () {
        var resp = await moduleDataService.saveModuleData(
          $scope.activedModuleData
        );
        if (resp && resp.isSucceed) {
          $scope.activedModuleData = resp.data;
          if ($scope.successCallback) {
            $rootScope.executeFunctionByName(
              $scope.successCallback,
              [resp],
              window
            );
          } else {
            var msg =
              $rootScope.localizeSettings.data["employee_success_msg"] ||
              "Thank you for submitting! Your lovely photo is well received 😊";
            $rootScope.showConfirm($scope, "", [], null, "", msg);
          }

          $rootScope.isBusy = false;
          $scope.initModuleForm($scope.name);
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          if (resp) {
            if ($scope.failCallback) {
              $rootScope.executeFunctionByName(
                $scope.failCallback,
                [resp],
                window
              );
            } else {
              $rootScope.showErrors(resp.errors);
            }
          }
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };
      $scope.shareFB = function (url) {
        FB.ui(
          {
            method: "share",
            href: url,
          },
          function (response) {}
        );
      };
      $scope.shareTwitter = function (url, content) {
        var text = encodeURIComponent(content);
        var shareUrl =
          "https://twitter.com/intent/tweet?url=" + url + "&text=" + text;
        var win = window.open(shareUrl, "ShareOnTwitter", getWindowOptions());
        win.opener = null; // 2
      };
      $scope.saveShoppingCart = function () {
        localStorageService.set("shoppingCart", $scope.cartData);
      };

      var getWindowOptions = function () {
        var width = 500;
        var height = 350;
        var left = window.innerWidth / 2 - width / 2;
        var top = window.innerHeight / 2 - height / 2;

        return [
          "resizable,scrollbars,status",
          "height=" + height,
          "width=" + width,
          "left=" + left,
          "top=" + top,
        ].join();
      };
      window.load = function () {
        $scope.$apply(($scope.isLoaded = true));
      };
    },
  ]);
})(window.angular);
