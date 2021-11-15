﻿"use strict";
app.controller("MixNavigationController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$routeParams",
  "MediaService",
  "ApiService",
  "CommonService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $routeParams,
    service,
    apiService,
    commonService
  ) {
    BaseCtrl.call(
      this,
      $scope,
      $rootScope,
      $routeParams,
      ngAppSettings,
      service
    );

    $scope.viewmodel = {
      title: "",
      description: "",
      status: "Published",
      mediaFile: {
        file: null,
        fullPath: "",
        folderName: "Media",
        fileFolder: "",
        fileName: "",
        extension: "",
        content: "",
        fileStream: "",
      },
    };
    $scope.relatedMedias = [];
    $scope.uploadMedia = async function () {
      $rootScope.isBusy = true;
      var resp = await service.uploadMedia($scope.mediaFile);
      if (resp && resp.success) {
        $scope.activedMedia = resp.data;
        $scope.getList();
        $scope.$apply();
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors);
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.selectFile = function (file, errFiles) {
      if (file !== undefined && file !== null) {
        $scope.mediaFile.folder = "Media";
        $scope.mediaFile.file = file;
        $scope.getBase64(file);
      }
    };
    $scope.getBase64 = function (file) {
      if (file !== null && $scope.postedFile) {
        $rootScope.isBusy = true;
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          var index = reader.result.indexOf(",") + 1;
          var base64 = reader.result.substring(index);
          $scope.activedMedia.mediaFile.fileName = $rootScope.generateKeyword(
            file.name.substring(0, file.name.lastIndexOf(".")),
            "-"
          );
          $scope.activedMedia.mediaFile.extension = file.name.substring(
            file.name.lastIndexOf(".")
          );
          $scope.activedMedia.mediaFile.fileStream = reader.result;
          $rootScope.isBusy = false;
          $scope.$apply();
        };
        reader.onerror = function (error) {
          $rootScope.showErrors([error]);
          $rootScope.isBusy = false;
        };
      } else {
        return null;
      }
    };
    $scope.togglePreview = function (item) {
      item.isPreview = item.isPreview === undefined ? true : !item.isPreview;
    };
    $scope.clone = async function (id) {
      $rootScope.isBusy = true;
      var resp = await service.cloneMedia(id);
      if (resp && resp.success) {
        $scope.activedMedia = resp.data;
        $rootScope.showMessage("Update successfully!", "success");
        $rootScope.isBusy = false;
        $scope.$apply();
        //$location.path('/portal/media/details/' + resp.data.id);
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors);
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.saveSuccessCallback = function () {
      $scope.getList();
    };
    $scope.removeCallback = function () {
      $scope.getList();
    };
  },
]);
