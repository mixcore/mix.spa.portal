"use strict";
appShared.controller("MediaController", [
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
    // multipart form
    $scope.formFile = null;
    $scope.relatedMedias = [];

    $scope.init = function () {
      $("#modal-files").on("shown.bs.modal", function () {
        $scope.getList();
      });
    };
    $scope.getListSuccessCallback = function () {
      angular.forEach($scope.data.items, function (e) {
        e.isImage = $scope.isImage(e.fullPath);
      });
    };
    $scope.isImage = function (url) {
      return url
        .toLowerCase()
        .match(/([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|svg|webp|jfif)/g);
    };
    $scope.save = async function () {
      var data = $scope.viewmodel;
      $rootScope.isBusy = true;
      if ($scope.validate) {
        $scope.isValid = await $rootScope.executeFunctionByName(
          "validate",
          $scope.validateArgs,
          $scope
        );
      }
      if ($scope.isValid) {
        var resp = await service.save(
          data,
          $scope.formFile,
          $scope.onUploadFileProgress
        );
        if (resp && resp.isSucceed) {
          $scope.viewmodel = resp.data;
          $rootScope.showMessage("success", "success");

          if ($scope.saveSuccessCallback) {
            $rootScope.executeFunctionByName(
              "saveSuccessCallback",
              $scope.saveSuccessCallbackArgs,
              $scope
            );
          } else {
            $rootScope.goToPath("/portal/media/list");
          }
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          if ($scope.saveFailCallback) {
            $rootScope.executeFunctionByName(
              "saveFailCallback",
              $scope.saveSuccessCallbackArgs,
              $scope
            );
          }
          if (resp) {
            $rootScope.showErrors(resp.errors);
          }
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      } else {
        $rootScope.showErrors(["invalid model"]);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.uploadMedia = async function () {
      $rootScope.isBusy = true;
      var resp = await service.uploadMedia($scope.mediaFile);
      if (resp && resp.isSucceed) {
        //$scope.activedMedia = resp.data;
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
      if (resp && resp.isSucceed) {
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

    $scope.removeCallback = function () {
      $scope.getList();
    };
    $scope.onUploadFileProgress = function (progress) {
      $scope.progress = progress;
    };
  },
]);
