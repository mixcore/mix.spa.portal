modules.component("logStream", {
  templateUrl: "/mix-app/views/app-portal/components/log-stream/view.html",
  controller: "LogStreamController",
  bindings: {},
});
app.controller("LogStreamController", [
  "$scope",
  "$rootScope",
  "AuthService",
  function ($scope, $rootScope, authService) {
    BaseHub.call(this, $scope);
    authService.fillAuthData();
    $scope.keyword = "";
    $scope.newMsgCount = 0;
    $scope.messages = [];
    $scope.onConnected = () => {
      $scope.joinRoom("portal");
    };
    $scope.init = function () {
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
    $scope.readMessages = function () {
      $scope.newMsgCount = 0;
      $("#modal-log-stream").modal("show");
      $scope.scrollToBot();
    };
    $scope.receiveMessage = function (msg) {
      switch (msg.action) {
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
      $scope.scrollToBot();
    };
    $scope.scrollToBot = () => {
      let container = $("#modal-log-stream").find(".modal-body")[0];
      setTimeout(() => {
        let h = $("#modal-log-stream").find(".table").height();
        $(container).animate(
          {
            scrollTop: h, // Scroll to top of body
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
          $scope.newMsgCount += 1;
          return "danger";
        case "Warning":
          return "warning";
        case "Info":
          return "info";
        default:
          return "default";
      }
    };
  },
]);
