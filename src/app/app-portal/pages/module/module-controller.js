"use strict";
app.controller("ModuleController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$location",
  "$routeParams",
  "ModuleRestService",
  "SharedModuleDataService",
  "RestRelatedAttributeSetPortalService",
  "RestAttributeSetDataPortalService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $location,
    $routeParams,
    moduleServices,
    moduleDataService,
    RestRelatedAttributeSetPortalService,
    dataService
  ) {
    BaseRestCtrl.call(
      this,
      $scope,
      $rootScope,
      $location,
      $routeParams,
      ngAppSettings,
      moduleServices,
      "product"
    );
    $scope.contentUrl = "";
    $scope.getSingleSuccessCallback = function () {
      $scope.loadAddictionalData();

      if ($scope.viewModel.id > 0) {
        // module => list post or list product
        if ($scope.viewModel.type == 2 || $scope.viewModel.type == 6) {
          $scope.contentUrl =
            "/portal/module-post/list/" + $scope.viewModel.id;
        } else {
          $scope.contentUrl = "/portal/module/data/" + $scope.viewModel.id;
        }
      }
      if ($scope.viewModel.sysCategories) {
        angular.forEach($scope.viewModel.sysCategories, function (e) {
          e.attributeData.obj.isActived = true;
        });
      }

      if ($scope.viewModel.sysTags) {
        angular.forEach($scope.viewModel.sysTags, function (e) {
          e.attributeData.obj.isActived = true;
        });
      }

      if ($routeParams.template) {
        $scope.viewModel.view = $rootScope.findObjectByKey(
          $scope.viewModel.templates,
          "fileName",
          $routeParams.template
        );
      }
    };
    $scope.getListByType = async function (pageIndex) {
      $scope.request.query = "?type=" + $scope.type;
      await $scope.getList(pageIndex);
    };
    $scope.defaultAttr = {
      name: "",
      options: [],
      priority: 0,
      dataType: 7,
      isGroupBy: false,
      isSelect: false,
      isDisplay: true,
      width: 3,
    };
    $scope.type = "-1";

    $scope.settings = $rootScope.globalSettings;
    $scope.viewModel = null;
    $scope.editDataUrl = "";

    $scope.loadModuleDatas = async function () {
      $rootScope.isBusy = true;
      var id = $routeParams.id;
      $scope.dataColumns = [];
      var response = await moduleServices.getSingle([id]);
      if (response.isSucceed) {
        $scope.viewModel = response.data;
        $scope.editDataUrl =
          "/portal/module-data/details/" + $scope.viewModel.id;
        $scope.loadMoreModuleDatas();
        angular.forEach($scope.viewModel.columns, function (e, i) {
          if (e.isDisplay) {
            $scope.dataColumns.push({
              title: e.title,
              name: e.name,
              filter: true,
              type: 0, // string - ngAppSettings.dataTypes[0]
            });
          }
        });
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };

    $scope.loadMoreModuleDatas = async function (pageIndex) {
      $scope.request.query = "&module_id=" + $scope.viewModel.id;
      if (pageIndex !== undefined) {
        $scope.request.pageIndex = pageIndex;
      }
      if ($scope.request.fromDate !== null) {
        var d = new Date($scope.request.fromDate);
        $scope.request.fromDate = d.toISOString();
      }
      if ($scope.request.toDate !== null) {
        var d = new Date($scope.request.toDate);
        $scope.request.toDate = d.toISOString();
      }
      $rootScope.isBusy = true;
      var resp = await moduleDataService.getModuleDatas($scope.request);
      if (resp && resp.isSucceed) {
        $scope.viewModel.data = resp.data;
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
    $scope.exportModuleData = async function (pageIndex) {
      $scope.request.query = "&module_id=" + $scope.viewModel.id;
      if (pageIndex !== undefined) {
        $scope.request.pageIndex = pageIndex;
      }
      if ($scope.request.fromDate !== null) {
        var d = new Date($scope.request.fromDate);
        $scope.request.fromDate = d.toISOString();
      }
      if ($scope.request.toDate !== null) {
        var d = new Date($scope.request.toDate);
        $scope.request.toDate = d.toISOString();
      }
      $rootScope.isBusy = true;
      var resp = await moduleDataService.exportModuleData($scope.request);
      if (resp && resp.isSucceed) {
        window.top.location = resp.data;
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

    $scope.removeData = function (id) {
      if ($scope.viewModel) {
        $rootScope.showConfirm(
          $scope,
          "removeDataConfirmed",
          [id],
          null,
          "Remove Data",
          "Deleted data will not able to recover, are you sure you want to delete this item?"
        );
      }
    };

    $scope.removeDataConfirmed = async function (id) {
      $rootScope.isBusy = true;
      var result = await moduleDataService.removeModuleData(id);
      if (result.isSucceed) {
        $scope.loadModuleDatas();
      } else {
        $rootScope.showMessage("failed");
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.updateModuleDataField = async function (item, propertyName) {
      var result = await moduleDataService.saveFields(
        item.id,
        propertyName,
        item[propertyName]
      );
      if (result.isSucceed) {
        $scope.loadModuleDatas();
      } else {
        $rootScope.showMessage("failed");
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.updateDataInfos = async function (items) {
      $rootScope.isBusy = true;
      var resp = await moduleDataService.updateInfos(items);
      if (resp && resp.isSucceed) {
        $scope.activedPage = resp.data;
        $rootScope.showMessage("success", "success");
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
    $scope.saveSuccessCallback = async function () {
      if ($scope.addictionalData) {
        $scope.addictionalData.parentId = $scope.viewModel.id;
        $scope.addictionalData.parentType = "Module";
        var saveData = await dataService.saveAddictionalData(
          $scope.addictionalData
        );
        if (saveData.isSucceed) {
          if ($location.path() == "/portal/module/create") {
            $scope.goToDetail($scope.viewModel.id, "module");
            $rootScope.isBusy = false;
            $scope.$apply();
          } else {
            $scope.addictionalData = saveData.data;
            $rootScope.isBusy = false;
            $scope.$apply();
          }
        }
      }
    };
    $scope.loadPosts = async function () {
      $rootScope.isBusy = true;
      var id = $routeParams.id;
      $scope.postRequest.query += "&page_id=" + id;
      var response = await pagePostRestService.getList($scope.postRequest);
      if (response.isSucceed) {
        $scope.pageData.posts = response.data;
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.selectedCol = null;
    $scope.dragoverCallback = function (index, item, external, type) {
      //console.log('drop ', index, item, external, type);
    };
    $scope.insertColCallback = function (index, item, external, type) {};
    $scope.removeAttribute = function (attr, index) {
      $rootScope.showConfirm(
        $scope,
        "removeAttributeConfirmed",
        [attr, index],
        null,
        "Remove Field",
        "Deleted data will not able to recover, are you sure you want to delete this item?"
      );
    };
    $scope.removeAttributeConfirmed = function (attr, index) {
      RestRelatedAttributeSetPortalService.delete([]);
      $scope.viewModel.attributeData.data.values.splice(index, 1);
    };
    $scope.loadAddictionalData = async function () {
      const obj = {
        parentType: "Module",
        parentId: $scope.viewModel.id,
        databaseName: "sys_additional_field_module",
      };
      const getData = await dataService.getAddictionalData(obj);
      if (getData.isSucceed) {
        $scope.addictionalData = getData.data;
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
  },
]);
