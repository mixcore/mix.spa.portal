"use strict";
app.controller("AuditLogController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$location",
  "$routeParams",
  "AuthService",
  "AuditLogRestService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $location,
    $routeParams,
    authService,
    service
  ) {
    BaseRestCtrl.call(
      this,
      $scope,
      $rootScope,
      $location,
      $routeParams,
      ngAppSettings,
      service
    );
    BaseHub.call(this, $scope);
    $scope.host = `${$rootScope.globalSettings.domain}/${$scope.host}`;
    authService.fillAuthData();
    $scope.request.status = null;
    $scope.messages = [];
    $scope.canDrag =
      $scope.request.orderBy !== "Priority" || $scope.request.direction !== "0";

    $scope.connect = () => {
      $scope.startConnection(
        "log-stream-hub",
        authService.authentication.accessToken,
        (err) => {
          if (
            authService.authentication.refreshToken &&
            err.message.indexOf("401") >= 0
          ) {
            authService.refreshToken().then(async () => {
              $scope.startConnection(
                "log-stream-hub",
                authService.authentication.accessToken
              );
            });
          }
        }
      );
    };
    $scope.receiveMessage = function (msg) {
      switch (msg.action) {
        case "MyConnection":
          $scope.hubRequest.from = msg.data;
          $scope.$apply();
          break;
        case "NewMessage":
          $scope.newMessage(msg);

          break;
      }
    };
    $scope.newMessage = function (msg) {
      msg.style = $scope.getMessageType(msg.type);
      if (msg.data) {
        msg.data = JSON.parse(msg.data);
      }
      $scope.messages.push(msg);
      $scope.$apply();

      setTimeout(() => {
        $("body,html").animate(
          {
            scrollTop: $("#log-stream-container").height(), // Scroll to top of body
          },
          500
        );
      }, 200);
    };
    $scope.getMessageType = function (type) {
      switch (type) {
        case "Success":
          return "success";
        case "Error":
          return "danger";
        case "Warning":
          return "warning";
        case "Info":
          return "info";
        default:
          return "default";
      }
    };
    $scope.view = function (item) {
      item.objClass = item.success ? "text-success" : "text-danger";
      $rootScope.preview("object", item, null, "modal-lg");
    };
  },
]);
