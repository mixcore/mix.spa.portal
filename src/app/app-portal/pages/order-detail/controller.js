"use strict";
app.controller("OrderDetailController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$location",
  "$routeParams",
  "RestOrderDetailService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $location,
    $routeParams,
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
    $scope.progress = 0;
    $scope.viewMode = "list";
    $scope.current = null;

    $scope.canDrag =
      $scope.request.orderBy !== "Priority" || $scope.request.direction !== "0";

    $scope.init = async function () {
      $scope.startConnection("mixEcommerceHub", null, (err) => {
        console.log(err);
      });
      $scope.onConnected = () => {
        $scope.joinRoom("Admin");
      };
      await $scope.getThemes();
    };
    $scope.receiveMessage = function (resp) {
      let msg = JSON.parse(resp);
      switch (msg.action) {
        case "Downloading":
          var index = $scope.data.items.findIndex(
            (m) => m.id == $scope.current.id
          );
          var progress = Math.round(msg.message);
          if (index >= 0) {
            $scope.progress = progress;
            if (progress == 100) {
              $scope.installStatus = "Installing";
            }
            $scope.$apply();
          }
          break;

        default:
          console.log(msg);
          break;
      }
    };
  },
]);
