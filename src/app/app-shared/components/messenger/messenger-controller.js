"use strict";
appShared.controller("MessengerController", [
  "$scope",
  "$rootScope",
  "AuthService",
  function ($scope, $rootScope, authService) {
    $scope.user = {
      loggedIn: false,
      info: {},
    };
    $scope.isHide = true;
    $scope.hideContact = true;
    $scope.members = [];
    $scope.messages = [];
    $scope.message = { connection: {}, content: "" };
    $scope.request = {
      uid: "",
      objectType: null,
      action: "",
      data: {},
      room: "",
      isMyself: false,
    };
    $scope.loadMsgButton = function () {};
    $scope.init = function () {
      BaseHub.call(this, $scope);
      authService.fillAuthData().then(() => {
        $scope.user.loggedIn = true;
        $scope.user.info = {
          id: authService.authentication.info.id,
          avatar: authService.authentication.info.userData.avatar,
          name: authService.authentication.info.userName,
        };
      });
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
      $("button").on("click", function () {
        var text = $("#message").val();
        var hnow = new Date().getHours();
        var mnow = new Date().getMinutes();
        mnow = mnow < 10 ? "0" + mnow : mnow;
        var d = hnow + ":" + mnow;

        if (text.length > 0) {
          $("#message").css("border", "1px solid #f4f5f9");
          $("#conversation").append(
            "<li class='message-right'><div class='message-avatar'><div class='avatar ion-ios-person'></div><div class='name'>You</div></div><div class='message-text'>" +
              text +
              "</div><div class='message-hour'>" +
              d +
              " <span class='ion-android-done-all'></span></div></li>"
          );
          $("#message").val("");
          $(".widget-conversation").scrollTop(
            $("ul li").last().position().top + $("ul li").last().height()
          );
        } else {
          $("#message").css("border", "1px solid #eb9f9f");
          $("#message").animate({ opacity: "0.1" }, "slow");
          $("#message").animate({ opacity: "1" }, "slow");
          $("#message").animate({ opacity: "0.1" }, "slow");
          $("#message").animate({ opacity: "1" }, "slow");
        }
      });
    };
    $scope.toggle = function () {
      $scope.isHide = !$scope.isHide;
    };
    $scope.toggleContact = function () {
      $scope.hideContact = !$scope.hideContact;
    };
    $scope.sendMessage = function () {
      if ($scope.user.loggedIn) {
        $scope.request.data = $scope.message;
        $scope.sendMessage();
        $scope.message.content = "";
      }
    };
    $scope.receiveMessage = function (msg) {
      //$scope.responses.splice(0, 0, msg);
      switch (msg.title) {
        case "MemberList":
          $scope.members = msg.data;
          $scope.$apply();
          break;
        case "NewMember":
          $scope.newMember(msg.data);
          $(".widget-conversation").scrollTop = $(
            ".widget-conversation"
          )[0].scrollHeight;
          break;

        case "NewMessage":
          $scope.newMessage(msg);
          break;
        case "ConnectSuccess":
          $scope.user.loggedIn = true;
          $scope.initList(msg.data);
          $scope.$apply();
          break;

        case "MemberOffline":
          $scope.removeMember(msg.data);
          break;
      }
    };
    $scope.newMember = function (member) {
      var index = $scope.members.findIndex((x) => x.id === member.id);
      if (index < 0) {
        $scope.members.splice(0, 0, member);
      }
      $scope.$apply();
    };

    $scope.initList = function (data) {
      data.forEach((member) => {
        var index = $scope.members.findIndex((x) => x.id === member.id);
        if (index < 0) {
          $scope.members.splice(0, 0, member);
        }
      });

      $scope.$apply();
    };

    $scope.removeMember = function (memberId) {
      var index = $scope.members.findIndex((x) => x.id === memberId);
      if (index >= 0) {
        $scope.members.splice(index, 1);
      }
      $scope.$apply();
    };

    $scope.newMessage = function (msg) {
      $scope.messages.push(msg);
      $scope.$apply();
      var objDiv = document.getElementsByClassName("widget-conversation")[0];
      objDiv.scrollTop = objDiv.scrollHeight + 20;
    };
  },
]);
