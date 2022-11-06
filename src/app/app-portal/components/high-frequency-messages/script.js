modules.component("highFrequencyMessages", {
  templateUrl:
    "/mix-app/views/app-portal/components/high-frequency-messages/view.html",
  controller: "HighFrequencyMessagesController",
  bindings: {},
});
app.controller("HighFrequencyMessagesController", [
  "$scope",
  "$rootScope",
  "AuthService",
  function ($scope, $rootScope, authService) {
    BaseHub.call(this, $scope);
    authService.fillAuthData();
    $scope.newMsgCount = 0;
    $scope.messages = [];
    $scope.mouses = [];
    $scope.init = function () {
      //   $scope.connectHightFrequencyHub();
    };
    $scope.connectHightFrequencyHub = () => {
      $scope.startConnection(
        "highFrequencyHub",
        authService.authentication.accessToken,
        (err) => {
          if (
            authService.authentication.refreshToken &&
            err.message.indexOf("401") >= 0
          ) {
            authService.refreshToken().then(async () => {
              $scope.startConnection(
                "highFrequencyHub",
                authService.authentication.accessToken
              );
            });
          }
        }
      );
    };
    $scope.onConnected = () => {
      $scope.joinRoom("mouseMove_portal");
      $scope.streamMouseMove();
    };
    $scope.onLeave = () => {
      clearInterval($scope.intervalHandle);
      $scope.subject.complete();
    };
    $scope.streamMouseMove = () => {
      document.onmousemove = $scope.handleMouseMove;
      $scope.subject = new signalR.Subject();
      // Send a maximum of 10 messages per second
      // (mouse movements trigger a lot of messages)
      var messageFrequency = 60,
        // Determine how often to send messages in
        // time to abide by the messageFrequency
        updateRate = 1000 / messageFrequency;
      // Start the client side server update interval
      $scope.hubRequest.title = "MouseMove";
      $scope.connection.invoke("UploadStream", $scope.subject, $scope.room);
      $scope.intervalHandle = setInterval($scope.updateMouse, updateRate);
    };
    $scope.receiveMessage = function (data) {
      var msg = JSON.parse(data);
      switch (msg.title) {
        case "MouseMove":
          let mouse = $scope.mouses.find(
            (m) => m.from.username == msg.from.username
          );
          if (!mouse) {
            $scope.mouses.push(msg);
          } else {
            mouse.data.x = msg.data.x;
            mouse.data.y = msg.data.y;
          }
          $scope.$apply();
          break;
        default:
          break;
      }
    };
    $scope.updateMouse = () => {
      if ($scope.room && $scope.mousePos && $scope.moved) {
        let msg = angular.copy($scope.hubRequest);
        msg.data = $scope.mousePos;
        $scope.subject.next(JSON.stringify(msg));
        $scope.moved = false;
      } else {
        // Use pos.x and pos.y
      }
      // if (iteration === 10) {
      //     clearInterval(intervalHandle);
      //     subject.complete();
      // }
    };
    $scope.handleMouseMove = (event) => {
      var dot, eventDoc, doc, body, pageX, pageY;

      event = event || window.event; // IE-ism

      // If pageX/Y aren't available and clientX/Y are,
      // calculate pageX/Y - logic taken from jQuery.
      // (This is to support old IE)
      if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX =
          event.clientX +
          ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
          ((doc && doc.clientLeft) || (body && body.clientLeft) || 0);
        event.pageY =
          event.clientY +
          ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
          ((doc && doc.clientTop) || (body && body.clientTop) || 0);
      }
      let x = (event.pageX / screen.width) * 100;
      let y = (event.pageY / screen.height) * 100;
      if (
        !$scope.mousePos ||
        ($scope.mousePos.x != x && $scope.mousePos.y != y)
      ) {
        $scope.moved = true;
        $scope.mousePos = {
          x: x,
          y: y,
        };
      }
    };

    $scope.newMessage = function (msg) {
      msg.style = $scope.getMessageType(msg.type);
      $scope.messages.push(msg);
      if (
        !msg.from ||
        msg.from.connectionId != $scope.hubRequest.from.connectionId
      ) {
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
