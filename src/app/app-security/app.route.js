app.config(function ($routeProvider, $locationProvider, $sceProvider) {
  $locationProvider.html5Mode(true);

  $routeProvider.when("/security/login", {
    controller: "LoginController",
    templateUrl: "/mix-app/views/app-security/pages/login/view.html",
  });

  $routeProvider.when("/security/register", {
    controller: "RegisterController",
    templateUrl: "/mix-app/views/app-security/pages/register/view.html",
  });
  $routeProvider.when("/security/forgot-password", {
    controller: "ForgotPasswordController",
    templateUrl: "/mix-app/views/app-security/pages/forgot-password/view.html",
  });
  $routeProvider.when("/security/reset-password", {
    controller: "ResetPasswordController",
    templateUrl: "/mix-app/views/app-security/pages/reset-password/view.html",
  });

  $routeProvider.otherwise({ redirectTo: "/security/login" });
});
