modules.component("hubMessages", {
  templateUrl:
    "/mix-app/views/app-portal/components/hub-messages/hub-messages.html",
  controller: "HubMessagesController",
  bindings: {},
});
app.controller("HubMessagesController", [
  "$scope",
  function ($scope) {
    BaseHub.call(this, $scope);
    $scope.init = function () {
      $scope.startConnection("portalhub");
    };
  },
]);
