"use strict";
app.controller("MixDatabaseDataController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$routeParams",
  "$location",
  "RestMixDatabaseDataPortalService",
  "RestMixDatabaseColumnPortalService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $routeParams,
    $location,
    service,
    columnService
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
    $scope.queries = {};
    $scope.data = {};
    $scope.exportAll = true;
    $scope.localizeSettings = $rootScope.globalSettings;
    // $scope.request.orderBy = "Priority";
    // $scope.request.direction = "Asc";
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
      $scope.request.mixDatabaseName = $routeParams.mixDatabaseName;
      $scope.request.filterType = $routeParams.filterType || "contain";
      $scope.request.compareType = $routeParams.compareType || "or";

      $scope.mixDatabaseId = $routeParams.mixDatabaseId;
      $scope.mixDatabaseName = $routeParams.mixDatabaseName;
      $scope.mixDatabaseTitle = $routeParams.mixDatabaseTitle;
      $scope.parentId = $routeParams.parentId;
      $scope.parentType = $routeParams.parentType;
      $scope.request.mixDatabaseName = $routeParams.mixDatabaseName;
      $scope.request.isGroup = $routeParams.isGroup || false;
      if ($routeParams.backUrl) {
        $scope.backUrl = decodeURIComponent($routeParams.backUrl);
      }
      if ($routeParams.dataId != $scope.defaultId) {
        $scope.dataId = $routeParams.dataId;
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
      if ($scope.mixDatabaseName || $scope.mixDatabaseId) {
        var getFields = await columnService.initData(
          $scope.mixDatabaseName || $scope.mixDatabaseId
        );
        if (getFields.isSucceed) {
          $scope.columns = getFields.data;
          $scope.mixDatabaseTitle =
            $scope.mixDatabaseTitle || $scope.columns[0].mixDatabaseName;
          $scope.$apply();
        }
      }
    };
    $scope.saveSuccess = function (data) {
      if ($scope.backUrl) {
        $location.url($scope.backUrl);
      } else {
        window.location.href = window.location.href;
      }
    };
    $scope.selectData = function () {
      if ($scope.selectedList.data.length) {
        $scope.viewmodel = $scope.selectedList.data[0];
      }
    };
    // $scope.saveSuccessCallback = function () {
    //   if ($location.path() == "/portal/mix-database-data/create") {
    //     let backUrl =
    //       $scope.backUrl ||
    //       `/portal/mix-database-data/details?dataId=${$scope.viewmodel.id}`;
    //     $rootScope.goToSiteUrl(backUrl);
    //   } else {
    //     if ($scope.parentId && $scope.parentType == 'Set') {
    //       $rootScope.goToSiteUrl(`/portal/mix-database-data/details?dataId=${$scope.parentId}`);
    //     } else {
    //       let backUrl =
    //         $scope.backUrl ||
    //         `/portal/mix-database-data/list?mixDatabaseId=${$scope.viewmodel.mixDatabaseId}&mixDatabaseName=${$scope.viewmodel.mixDatabaseName}&mixDatabaseTitle=${$scope.viewmodel.mixDatabaseName}`;
    //       $rootScope.goToSiteUrl(backUrl);
    //     }
    //   }
    // };

    $scope.preview = function (item) {
      item.editUrl = "/portal/post/details/" + item.id;
      $rootScope.preview("post", item, item.title, "modal-lg");
    };
    $scope.edit = function (data) {
      $rootScope.goToPath(
        `/portal/mix-database-data/details?dataId=${data.id}&mixDatabaseTitle=${$scope.mixDatabaseTitle}`
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

    $scope.removeConfirmed = async function (dataId) {
      $rootScope.isBusy = true;
      var result = await service.delete([dataId]);
      if (result.isSucceed) {
        if ($scope.removeCallback) {
          $rootScope.executeFunctionByName(
            "removeCallback",
            $scope.removeCallbackArgs,
            $scope
          );
        }
        $scope.getList();
      } else {
        $rootScope.showMessage("failed");
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.import = async function () {
      if ($scope.validateDataFile()) {
        $rootScope.isBusy = true;
        var form = document.getElementById("form-portal");
        var result = await service.import(
          $scope.mixDatabaseName,
          form["import-data-inp"].files[0]
        );
        if (result.isSucceed) {
          $rootScope.showMessage("success", "success");
          $rootScope.isBusy = false;
          $scope.getList(0);
        } else {
          $rootScope.showMessage("failed");
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
      if (result.isSucceed) {
        $rootScope.showMessage("success", "success");
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        $rootScope.showMessage("failed");
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.saveOthers = async function () {
      var response = await service.saveList($scope.others);
      if (response.isSucceed) {
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
      var query = {};

      Object.keys($scope.queries).forEach((e) => {
        if ($scope.queries[e]) {
          query[e] = $scope.queries[e];
        }
      });
      $scope.request.query = JSON.stringify(query);
      $rootScope.isBusy = true;
      var resp = await service.getList($scope.request);
      if (resp && resp.isSucceed) {
        $scope.data = resp.data;
        $.each($scope.data.items, function (i, data) {
          $.each($scope.activeddata, function (i, e) {
            if (e.dataId === data.id) {
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
      Object.keys($scope.queries).forEach((e) => {
        if ($scope.queries[e]) {
          query[e] = $scope.queries[e];
        }
      });
      $scope.request.query = JSON.stringify(query);
      var request = angular.copy($scope.request);
      $scope.exportAll = $scope.exportAll;
      if (exportAll) {
        request.pageSize = 10000;
        request.pageIndex = 0;
      }
      $rootScope.isBusy = true;
      var resp = await service.export(request);
      if (resp && resp.isSucceed) {
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
