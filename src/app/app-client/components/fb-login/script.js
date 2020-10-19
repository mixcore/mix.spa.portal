modules.component("fbLogin", {
  templateUrl: "/app/app-client/components/fb-login/view.html",
  controller: [
    "$rootScope",
    "$scope",
    "$location",
    function ($rootScope, $scope, $location) {
      var ctrl = this;
      ctrl.loginStatus = null;
      ctrl.$onInit = function () {
        ctrl.checkLoginState();
      };
      ctrl.translate = $rootScope.translate;
      ctrl.login = function () {
        FB.login(
          function (response) {
            ctrl.statusChangeCallback(response);
          },
          { scope: "public_profile,email" }
        );
      };
      ctrl.logout = function () {
        FB.getLoginStatus(function (response) {
          if (response.status === "connected") {
            FB.logout(function (response) {
              ctrl.loggedIn = false;
              ctrl.profile = null;
              $scope.$apply();
            });
          }
        });
      };
      ctrl.getProfile = function () {
        FB.api("/me", "GET", { fields: "id,name,email" }, function (response) {
          ctrl.profile = response;
          ctrl.loggedIn = true;
          $scope.$apply();
        });t
      };
      ctrl.checkLoginState = function () {
        FB.getLoginStatus(function (response) {
          ctrl.statusChangeCallback(response);
          ctrl.loginStatus = response;
        });
      };
      ctrl.statusChangeCallback = function (response) {
        // Called with the results from FB.getLoginStatus().
        if (response.status === "connected") {
          // Logged into your webpage and Facebook.
          ctrl.getProfile();
        }
      };
    },
  ],
  bindings: {
    fbPageId: "=",
    themeColor: "=",
    inGreeting: "=",
    outGreeting: "=",
  },
});
