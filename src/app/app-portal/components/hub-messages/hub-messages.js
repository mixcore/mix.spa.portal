modules.component("hubMessages", {
  templateUrl:
    "/mix-app/views/app-portal/components/hub-messages/hub-messages.html",
  controller: "HubMessagesController",
  bindings: {},
});
app.controller("HubMessagesController", [
  "$scope",
  "$rootScope",
  "AuthService",
  function ($scope, $rootScope, authService) {
    BaseHub.call(this, $scope);
    authService.fillAuthData();
    $scope.newMsgCount = 0;
    $scope.messages = [];
    $scope.onConnected = () => {
      $scope.joinRoom("portal");
    };
    $scope.init = function () {
      $scope.startConnection(
        "portalHub",
        authService.authentication.accessToken,
        (err) => {
          if (
            authService.authentication.refreshToken &&
            err.message.indexOf("401") >= 0
          ) {
            authService.refreshToken().then(async () => {
              $scope.startConnection(
                "portalHub",
                authService.authentication.accessToken
              );
            });
          }
        }
      );
    };
    $scope.readMessages = function () {
      $scope.newMsgCount = 0;
      $("#modal-hub-messages").modal("show");
    };
    $scope.receiveMessage = function (msg) {
      switch (msg.action) {
        case "MyConnection":
          $scope.request.from = msg.data;
          $scope.$apply();
          break;
        case "MemberList":
          $scope.members = msg.data;
          $scope.$apply();
          break;
        case "NewMember":
          $scope.newMember(msg.data);
          break;
        case "MemberOffline":
          $scope.removeMember(msg.data);
        case "NewMessage":
          $scope.newMessage(msg);
          break;
      }
    };
    $scope.newMessage = function (msg) {
      msg.style = $scope.getMessageType(msg.type);
      $scope.messages.push(msg);
      if (msg.from.connectionId != $scope.request.from.connectionId) {
        $scope.newMsgCount += 1;
        $rootScope.showMessage(msg.title, msg.style);
      }
      $scope.$apply();
    };
    $scope.removeMember = function (member) {
      var index = $scope.members.findIndex(
        (x) => x.username === member.username
      );
      if (index >= 0) {
        $scope.members.splice(index, 1);
      }
      $scope.$apply();
    };

    $scope.newMember = function (member) {
      var index = $scope.members.findIndex(
        (x) => x.username === member.username
      );
      if (index < 0) {
        $scope.members.splice(0, 0, member);
      }
      $scope.$apply();
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
  },
]);
