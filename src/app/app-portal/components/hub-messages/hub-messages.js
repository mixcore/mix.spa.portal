modules.component("hubMessages", {
  templateUrl:
    "/mix-app/views/app-portal/components/hub-messages/hub-messages.html",
  controller: "HubMessagesController",
  bindings: {},
});
app.controller("HubMessagesController", [
  "$scope",
  "$rootScope",
  function ($scope, $rootScope) {
    BaseHub.call(this, $scope);
    $scope.newMsgCount = 0;
    $scope.messages = [];
    $scope.init = function () {
      $scope.startConnection("portalHub", () => {});
    };
    $scope.readMessages = function () {
      $scope.newMsgCount = 0;
      $("#modal-hub-messages").modal("show");
    };
    $scope.receiveMessage = function (resp) {
      let msg = JSON.parse(resp);
      msg.style = $scope.getMessageType(msg.type);
      $scope.messages.push(msg);
      $scope.newMsgCount += 1;
      $scope.$apply();
      $rootScope.showMessage(msg.title, msg.style);
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
