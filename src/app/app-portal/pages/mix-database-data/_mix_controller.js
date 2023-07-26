"use strict";
app.controller("MixDatabaseDataController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$routeParams",
  "$location",
  "MixDbService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $routeParams,
    $location,
    mixDbService
  ) {
    BaseRestCtrl.call(
      this,
      $scope,
      $rootScope,
      $location,
      $routeParams,
      ngAppSettings,
      mixDbService
    );
    $scope.queries = {};
    $scope.data = null;
    $scope.exportAll = true;
    $scope.mixConfigurations = $rootScope.globalSettings;
    $scope.filterType = "contain";
    $scope.defaultId = "default";
    $scope.importFile = {
      file: null,
      fullPath: "",
      folder: "import",
      title: "",
      description: "",
    };
    $scope.initRouteParams = () => {
      $scope.requestKey = `request${$rootScope.generateKeyword(
        $location.$$path,
        "_"
      )}_${$routeParams.mixDatabaseId}`;
      $scope.request = $rootScope.getRequest($scope.requestKey);
      if ($routeParams.mixDatabaseId) {
        $scope.request.mixDatabaseId = $routeParams.mixDatabaseId;
      }
      if ($routeParams.queryFields) {
        if (Array.isArray($routeParams.queryFields)) {
          angular.forEach($routeParams.queryFields, (e) => {
            let val = e.split(":");
            $scope.queries[val[0]] = val[1];
          });
        } else {
          let val = $routeParams.queryFields.split(":");
          $scope.queries[val[0]] = val[1];
        }
        $scope.request.mixDatabaseId = $routeParams.mixDatabaseId;
      }
      $scope.request.mixDatabaseName = $routeParams.mixDatabaseName;
      $scope.request.filterType = $routeParams.filterType || "contain";
      $scope.request.compareType = $routeParams.compareType || "or";

      $scope.mixDatabaseId = $routeParams.mixDatabaseId;
      $scope.mixDatabaseName = $routeParams.mixDatabaseName;
      $scope.mixDatabaseTitle = $routeParams.mixDatabaseTitle;
      $scope.guidParentId = $routeParams.guidParentId;
      $scope.parentType = $routeParams.parentType;
      $scope.request.mixDatabaseName = $routeParams.mixDatabaseName;
      $scope.request.isGroup = $routeParams.isGroup || false;
      $scope.dataUrl = `/admin/mix-database-data/list?mixDatabaseId=${$scope.mixDatabaseId}&mixDatabaseName=${$scope.mixDatabaseName}&mixDatabaseTitle=${$scope.mixDatabaseTitle}`;
      if ($routeParams.backUrl) {
        $scope.backUrl = decodeURIComponent($routeParams.backUrl);
      }
      if ($routeParams.dataContentId != $scope.defaultId) {
        $scope.dataContentId = $routeParams.dataContentId;
      }

      if ($scope.parentId && $scope.parentType) {
        $scope.refDataModel = {
          parentId: $scope.parentId,
          parentType: $scope.parentType,
        };
      }
    };
    $scope.init = async function () {
      $scope.initRouteParams();
      mixDbService.initDbName($scope.request.mixDatabaseName);
    };
    $scope.saveSuccess = function (data) {
      if ($scope.backUrl) {
        $location.url($scope.backUrl);
      } else {
        $location.url(
          `/admin/mix-database-data/details?dataContentId=${data}&mixDatabaseTitle=${
            $scope.mixDatabaseTitle
          }&backUrl=${encodeURIComponent($scope.dataUrl)}`
        );
      }
    };
    $scope.selectData = function () {
      if ($scope.selectedList.data.length) {
        $scope.viewmodel = $scope.selectedList.data[0];
      }
    };

    $scope.preview = function (item) {
      item.editUrl = "/admin/post/details/" + item.id;
      $rootScope.preview("post", item, item.title, "modal-lg");
    };
    $scope.edit = function (data) {
      $rootScope.goToPath(
        `/admin/mix-database-data/details?dataContentId=${data.id}&mixDatabaseName=${$scope.mixDatabaseName}&mixDatabaseTitle=${$scope.mixDatabaseTitle}`
      );
    };
    $scope.remove = function (data) {
      $rootScope.showConfirm(
        $scope,
        "removeConfirmed",
        [data.id],
        null,
        "Remove",
        "Deleted data will not able to recover, are you sure you want to delete this item?"
      );
    };

    $scope.removeConfirmed = async function (dataContentId) {
      $rootScope.isBusy = true;
      var result = await mixDbService.delete([dataContentId]);
      if (result.success) {
        if ($scope.removeCallback) {
          $rootScope.executeFunctionByName(
            "removeCallback",
            $scope.removeCallbackArgs,
            $scope
          );
        }
        $scope.getList();
      } else {
        $rootScope.showErrors(result.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.import = async function () {
      if ($scope.validateDataFile()) {
        $rootScope.isBusy = true;
        var form = document.getElementById("form-portal");
        var result = await mixDbService.import(
          form["import-data-inp"].files[0]
        );
        if (result.success) {
          $rootScope.showMessage("success", "success");
          $rootScope.isBusy = false;
          $scope.getList(0);
        } else {
          $rootScope.showErrors(result.errors);
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      }
    };
    $scope.validateDataFile = function () {
      if (!$scope.importFile.file) {
        $rootScope.showMessage("Please choose data file", "danger");
        return false;
      } else {
        return true;
      }
    };
    $scope.sendMail = function (data) {
      var email = "";
      angular.forEach(data.values, function (e) {
        if (e.mixDatabaseColumnName == "email") {
          email = e.stringValue;
        }
      });
      $rootScope.showConfirm(
        $scope,
        "sendMailConfirmed",
        [data],
        null,
        "Send mail",
        "Are you sure to send mail to " + email
      );
    };
    $scope.sendMailConfirmed = async function (data) {
      $rootScope.isBusy = true;
      $rootScope.isBusy = true;
      var result = await service.sendMail([data.id]);
      if (result.success) {
        $rootScope.showMessage("success", "success");
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        $rootScope.showErrors(result.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.saveOthers = async function () {
      var response = await service.saveList($scope.others);
      if (response.success) {
        $scope.getList();
        $scope.$apply();
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.selectImportFile = function (files) {
      if (files !== undefined && files !== null && files.length > 0) {
        const file = files[0];
        $scope.importFile.folder = "imports";
        $scope.importFile.title = $scope.mixDatabaseName;
        $scope.importFile.description = $scope.mixDatabaseName + "'s data";
        $scope.importFile.file = file;

        // if (ctrl.auto=='true') {
        //     ctrl.uploadFile(file);
        // }
        // else {
        //     ctrl.getBase64(file);
        // }
      }
    };
    $scope.getList = async function (pageIndex) {
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
      $scope.request.queries = [];

      Object.keys($scope.queries).forEach((e) => {
        if ($scope.queries[e]) {
          $scope.request.queries.push({
            fieldName: e,
            value: $scope.queries[e],
          });
        }
      });
      $rootScope.isBusy = true;
      var resp = await mixDbService.filter($scope.request);
      if (resp && resp.success) {
        $scope.data = resp.data;
        $.each($scope.data.items, function (i, data) {
          $.each($scope.activeddata, function (i, e) {
            if (e.dataContentId === data.id) {
              data.isHidden = true;
            }
          });
        });
        if ($scope.getListSuccessCallback) {
          $scope.getListSuccessCallback();
        }
        $("html, body").animate(
          {
            scrollTop: "0px",
          },
          500
        );
        if (!resp.data || !resp.data.items.length) {
          $scope.queries = {};
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors);
        }
        if ($scope.getListFailCallback) {
          $scope.getListFailCallback();
        }
        $scope.queries = {};
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.export = async function (pageIndex, exportAll) {
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
      var query = {};
      if ($routeParams.mixDatabaseId) {
        $scope.request.mixDatabaseId = $routeParams.mixDatabaseId;
      }
      $scope.request.mixDatabaseName = $routeParams.mixDatabaseName;
      $scope.request.filterType = $routeParams.filterType || "contain";
      $scope.request.queries = [];

      Object.keys($scope.queries).forEach((e) => {
        if ($scope.queries[e]) {
          $scope.request.queries.push({
            fieldName: e,
            value: $scope.queries[e],
          });
        }
      });
      var request = angular.copy($scope.request);
      $scope.exportAll = $scope.exportAll;
      if (exportAll) {
        request.pageSize = 10000;
        request.pageIndex = 0;
      }
      $rootScope.isBusy = true;
      var resp = await mixDbService.export(request);
      if (resp && resp.success) {
        if (resp.data) {
          window.top.location = resp.data.webPath;
        } else {
          $rootScope.showMessage("Nothing to export");
        }
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

    $scope.migrate = async function () {
      if ($routeParams.mixDatabaseId) {
        $rootScope.isBusy = true;
        var result = await service.migrate($routeParams.mixDatabaseId);
        $scope.handleResult(result);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
  },
]);
