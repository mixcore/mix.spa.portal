"use strict";
app.controller("TemplateController", [
  "$scope",
  "$rootScope",
  "$routeParams",
  "$location",
  "ngAppSettings",
  "AuthService",
  "TemplateService",
  function (
    $scope,
    $rootScope,
    $routeParams,
    $location,
    ngAppSettings,
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
    $scope.folderTypes = [
      "Masters",
      "Layouts",
      "Pages",
      "Modules",
      "Forms",
      "Edms",
      "Products",
      "Posts",
      "Widgets",
    ];
    $scope.isInitHub = false;
    $scope.room = null;
    $scope.members = [];
    $scope.activedPane = null;
    $scope.canRename = true;
    $scope.user = null;
    $scope.selectPane = function (pane) {
      $scope.activedPane = pane;
    };
    $scope.init = async function () {
      authService.fillAuthData().then(function () {
        $scope.user = {
          username: authService.authentication.info.username,
          avatar: authService.authentication.info.userData.avatar,
        };
        $scope.startConnection("editFileHub", () => {
          let id = $routeParams.id || $rootScope.generateUUID();
          $scope.room = `Template-${id}`;
          $scope.joinRoom();
        });
      });
    };
    $scope.loadFolder = function (d) {
      $location.url(
        "/portal/template/list/" +
          $routeParams.themeId +
          "?folderType=" +
          encodeURIComponent(d)
      );
    };
    $scope.loadParams = async function () {
      $rootScope.isBusy = true;
      $scope.folderType = $routeParams.folderType; // ? $routeParams.folderType : 'Masters';
      $scope.themeId = $routeParams.themeId;
    };
    $scope.getSingle = async function () {
      $rootScope.isBusy = true;
      var id = $routeParams.id;
      $scope.folderType = $routeParams.folderType; // ? $routeParams.folderType : 'Masters';
      var themeId = $routeParams.themeId;
      $scope.listUrl =
        "/portal/template/list/" +
        themeId +
        "?folderType=" +
        encodeURIComponent($scope.folderType);
      if (id) {
        var resp = await service.getSingle([id], {
          folderType: $scope.folderType,
          themeId: themeId,
        });
        if (resp && resp.isSucceed) {
          $scope.viewmodel = resp.data;
          $scope.canRename =
            $scope.viewmodel.id === 0 ||
            $scope.viewmodel.fileName.indexOf("Copy") === 0;
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          if (resp) {
            $rootScope.showErrors(resp.errors);
          }
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      } else {
        var resp = await service.getDefault();
        if (resp && resp.isSucceed) {
          resp.data.themeId = themeId;
          resp.data.folderType = $scope.folderType;
          $scope.viewmodel = resp.data;
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          if (resp) {
            $rootScope.showErrors(resp.errors);
          }
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      }
    };
    $scope.copy = async function (id) {
      $rootScope.isBusy = true;
      $scope.folderType = $routeParams.folderType; // ? $routeParams.folderType : 'Masters';
      var themeId = $routeParams.themeId;
      $scope.listUrl =
        "/portal/template/list/" +
        themeId +
        "?folderType=" +
        encodeURIComponent($scope.folderType);
      var resp = await service.copy(id);
      if (resp && resp.isSucceed) {
        $location.url(
          `/portal/template/details/${themeId}/${$scope.folderType}/${resp.data.id}`
        );
        $scope.$apply();
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors);
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.getList = async function (pageIndex, themeId) {
      $scope.request.themeId = themeId || $routeParams.themeId;
      $scope.request.folderType = $routeParams.folderType;
      $scope.request.status = null;
      $scope.folderType = $routeParams.folderType;
      if ($scope.folderType) {
        if (pageIndex !== undefined) {
          $scope.request.pageIndex = pageIndex;
        }
        if ($scope.request.fromDate !== null) {
          var df = new Date($scope.request.fromDate);
          $scope.request.fromDate = df.toISOString();
        }
        if ($scope.request.toDate !== null) {
          var dt = new Date($scope.request.toDate);
          $scope.request.toDate = dt.toISOString();
        }
        var resp = await service.getList($scope.request, [$scope.themeId]);
        if (resp && resp.isSucceed) {
          $scope.data = resp.data;
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          if (resp) {
            $rootScope.showErrors(resp.errors);
          }
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      } else {
        $rootScope.isBusy = false;
      }
    };
    $scope.updateTemplateContent = function (content) {
      $scope.viewmodel.content = content;
    };
    $scope.updateStyleContent = function (content) {
      $scope.viewmodel.scripts = content;
    };
    $scope.updateScriptContent = function (content) {
      $scope.viewmodel.styles = content;
    };
    $scope.joinRoom = function () {
      $scope.connection.invoke("JoinRoom", $scope.room, $scope.user);
    };
    $scope.receiveMessage = function (msg) {
      switch (msg.type) {
        case "MemberList":
          $scope.members = msg.data;
          $scope.initMembersData();
          $scope.canEdit = $scope.members.length == 1;
          if (!$scope.canEdit) {
            $scope.errors = [
              "Cannot modify if there is another user opening this template",
            ];
          } else {
            $scope.errors = [];
          }
          $scope.$apply();
          break;

        default:
          break;
      }
      console.log(msg);
    };
    $scope.initMembersData = function () {
      angular.forEach($scope.members, function (e) {
        if (!e.Avatar) {
          e.Avatar = "/mix-app/assets/img/user.png";
        }
      });
    };
  },
]);
