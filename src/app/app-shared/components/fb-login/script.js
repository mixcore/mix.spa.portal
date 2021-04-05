sharedComponents.component("fbLogin", {
  templateUrl: "/mix-app/views/app-shared/components/fb-login/view.html",
  bindings: {
    fbPageId: "=",
    themeColor: "=",
    inGreeting: "=",
    outGreeting: "=",
    loginCallback: "&?",
    logoutCallback: "&?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "$location",
    function ($rootScope, $scope, $location) {
      var ctrl = this;
      ctrl.loginStatus = null;
      ctrl.showLogin = false;
      ctrl.init = function () {
        // ctrl.checkLoginState();
        ctrl.showLogin =
          $rootScope.globalSettings.externalLoginProviders.Facebook != "";
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
              if (ctrl.logoutCallback) {
                ctrl.logoutCallback();
              }
              $scope.$apply();
            });
          }
        });
      };
      ctrl.getProfile = function (authResponse) {
        FB.api("/me", "GET", { fields: "id,name,email" }, function (response) {
          ctrl.profile = response;
          ctrl.loggedIn = true;
          if (ctrl.loginCallback) {
            let loginData = {
              userID: authResponse.userID,
              email: response.email,
              accessToken: authResponse.accessToken,
            };
            ctrl.loginCallback({ resp: loginData });
          }
          $scope.$apply();
        });
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
          ctrl.getProfile(response.authResponse);
        }
      };
    },
  ],
});
