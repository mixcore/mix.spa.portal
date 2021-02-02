"use strict";
app.controller("MixAttributeSetDataController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$routeParams",
  "$location",
  "RestAttributeSetDataPortalService",
  "RestAttributeFieldPortalService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $routeParams,
    $location,
    service,
    fieldService
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
    $scope.settings = $rootScope.globalSettings;
    $scope.request.orderBy = "Priority";
    $scope.request.direction = "Asc";
    $scope.filterType = "contain";
    $scope.defaultId = "default";
    $scope.importFile = {
      file: null,
      fullPath: "",
      folder: "import",
      title: "",
      description: "",
    };
    $scope.init = async function () {
      $scope.attributeSetId = $routeParams.attributeSetId;
      $scope.attributeSetName = $routeParams.attributeSetName;
      $scope.attributeSetTitle = $routeParams.attributeSetTitle;
      $scope.parentId = $routeParams.parentId;
      $scope.parentType = $routeParams.parentType;
      $scope.request.attributeSetName = $routeParams.attributeSetName;
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

      if ($scope.attributeSetName || $scope.attributeSetId) {
        var getFields = await fieldService.initData(
          $scope.attributeSetName || $scope.attributeSetId
        );
        if (getFields.isSucceed) {
          $scope.fields = getFields.data;
          $scope.$apply();
        }
      }
    };

    $scope.selectData = function () {
      if ($scope.selectedList.data.length) {
        $scope.viewModel = $scope.selectedList.data[0];
      }
    };
    $scope.saveSuccessCallback = function () {
      if ($location.path() == "/portal/attribute-set-data/create") {
        let backUrl =
          $scope.backUrl ||
          `/portal/attribute-set-data/details?dataId=${$scope.viewModel.id}`;
        $rootScope.goToSiteUrl(backUrl);
      } else {
        let backUrl =
          $scope.backUrl ||
          `/portal/attribute-set-data/list?attributeSetId=${$scope.viewModel.attributeSetId}&attributeSetName=${$scope.viewModel.attributeSetName}&attributeSetTitle=${$scope.viewModel.attributeSetName}`;
        $rootScope.goToSiteUrl(backUrl);
      }
    };

    $scope.preview = function (item) {
      item.editUrl = "/portal/post/details/" + item.id;
      $rootScope.preview("post", item, item.title, "modal-lg");
    };
    $scope.edit = function (data) {
      $rootScope.goToSiteUrl(
        "/portal/attribute-set-data/details?dataId=" + data.id+"&abc"
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
          $scope.attributeSetName,
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
        if (e.attributeFieldName == "email") {
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
        $scope.importFile.title = $scope.attributeSetName;
        $scope.importFile.description = $scope.attributeSetName + "'s data";
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
      if ($routeParams.attributeSetId) {
        $scope.request.attributeSetId = $routeParams.attributeSetId;
      }
      $scope.request.attributeSetName = $routeParams.attributeSetName;
      $scope.request.filterType = $routeParams.filterType || "contain";
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
      if ($routeParams.attributeSetId) {
        $scope.request.attributeSetId = $routeParams.attributeSetId;
      }
      $scope.request.attributeSetName = $routeParams.attributeSetName;
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
  },
]);
