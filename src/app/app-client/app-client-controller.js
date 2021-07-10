(function (angular) {
  "use strict";
  app.controller("AppClientController", [
    "$rootScope",
    "$scope",
    "$location",
    "AppSettingsService",
    "ApiService",
    "AuthService",
    "localStorageService",
    "RestMixDatabaseDataClientService",
    function (
      $rootScope,
      $scope,
      $location,
      appSettingsService,
      apiService,
      authService,
      localStorageService,
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
        totalItems: 0,
        total: 0,
      };
      $rootScope.appSettingsService = appSettingsService;
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
          // appSettingsService.fillAppSettings().then(function (response) {
          $scope.cartData = localStorageService.get("shoppingCart");
          if (!$scope.cartData) {
            $scope.cartData = {
              items: [],
              totalItems: 0,
              total: 0,
            };
          }
          apiService.getAllSettings(lang).then(function (response) {
            if ($rootScope.appSettings) {
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
    },
  ]);
})(window.angular);
