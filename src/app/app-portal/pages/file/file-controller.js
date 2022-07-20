﻿"use strict";
app.controller("FileController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$routeParams",
  "$timeout",
  "$location",
  "AuthService",
  "FileServices",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $routeParams,
    $timeout,
    $location,
    authService,
    fileServices
  ) {
    $scope.request = {
      pageSize: "10",
      pageIndex: 0,
      status: "Published",
      orderBy: "CreatedDateTime",
      direction: "Desc",
      fromDate: null,
      toDate: null,
      keyword: "",
      key: "",
    };

    $scope.activedFile = null;
    $scope.relatedFiles = [];
    $rootScope.isBusy = false;
    $scope.data = {
      pageIndex: 0,
      pageSize: 1,
      totalItems: 0,
    };
    $scope.errors = [];

    $scope.range = function (max) {
      var input = [];
      for (var i = 1; i <= max; i += 1) input.push(i);
      return input;
    };
    $scope.loadPage = async function (folder) {
      if (folder) {
        $scope.request.folder += $scope.request.folder !== "" ? "/" : "";
        $scope.request.folder += folder;
      }
      $location.url(
        "/admin/file/list?folder=" + encodeURIComponent($scope.request.folder)
      );
    };
    $scope.loadFile = async function () {
      $rootScope.isBusy = true;
      $scope.listUrl = "/admin/file/list?folder/" + $routeParams.folder;
      $rootScope.isBusy = true;
      var response = await fileServices.getFile(
        $routeParams.folder,
        $routeParams.filename
      );
      if (response.success) {
        $scope.activedFile = response.data;
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.loadFiles = async function (folder) {
      if (folder) {
        $scope.request.folder +=
          $scope.request.folder !== "" ? "wwwroot/" : "wwwroot";
        $scope.request.folder += folder;
      } else {
        $scope.request.folder = $routeParams.folder
          ? $routeParams.folder
          : "wwwroot";
      }
      if ($routeParams.folder) {
        $scope.backUrl =
          "/admin/file/list?folder=" +
          $routeParams.folder.substring(
            0,
            $routeParams.folder.lastIndexOf("/")
          );
      }
      $rootScope.isBusy = true;
      var resp = await fileServices.getFiles($scope.request);
      if (resp && resp.success) {
        $scope.data = resp.data;
        $.each($scope.data.items, function (i, file) {
          $.each($scope.activedFiles, function (i, e) {
            if (e.fileId === file.id) {
              file.isHidden = true;
            }
          });
        });
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors);
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };

    $scope.removeFile = async function (id) {
      if (confirm("Are you sure!")) {
        $rootScope.isBusy = true;
        var resp = await fileServices.removeFile(id);
        if (resp && resp.success) {
          $scope.loadFiles();
        } else {
          if (resp) {
            $rootScope.showErrors(resp.errors);
          }
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      }
    };

    $scope.saveFile = async function (file) {
      $rootScope.isBusy = true;
      var resp = await fileServices.saveFile(file);
      if (resp && resp.success) {
        $scope.activedFile = resp.data;
        $rootScope.showMessage("Update successfully!", "success");
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors);
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.updateTemplateContent = function (content) {
      $scope.activedFile.content = content;
    };
  },
]);
