﻿"use strict";
app.controller("PostController", [
  "$scope",
  "$rootScope",
  "$location",
  "$filter",
  "ngAppSettings",
  "$routeParams",
  "PostRestService",
  "UrlAliasService",
  "RestMixDatabaseDataPortalService",
  "RestMixDatabaseColumnPortalService",
  "RestRelatedAttributeDataPortalService",
  "RestMixDatabasePortalService",
  "MixDbService",
  function (
    $scope,
    $rootScope,
    $location,
    $filter,
    ngAppSettings,
    $routeParams,
    service,
    urlAliasService,
    dataService,
    columnService,
    navService,
    databaseService,
    mixDbService
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
    if (!$scope.referrerUrl) {
      $scope.referrerUrl = "/admin/post/list";
    }
    $scope.request.searchColumns = "title";
    $scope.request.culture = $rootScope.globalSettings.defaultCulture;
    $scope.request.queries = [];
    $scope.request.metadataQueries = [];
    $scope.defaultQuery = {
      fieldName: "",
      compareOperator: "Equal",
      value: "",
    };
    $scope.viewmodelType = "post";
    $scope.additionalData = {};
    $scope.createUrl = "/admin/post/create?";
    $scope.postTypeRequest = angular.copy(ngAppSettings.request);
    ($scope.postTypeRequest.searchColumns = "Type"),
      ($scope.postTypeRequest.searchMethod = "Equal"),
      ($scope.postTypeRequest.keyword = "AdditionalData");

    $scope.initList = async function () {
      if ($routeParams.template) {
        $scope.createUrl = `${$scope.createUrl}&template=${$routeParams.template}`;
      }
      if ($routeParams.category) {
        $scope.request.category = $routeParams.category;
      }
      if ($routeParams.type) {
        $scope.createUrl = `${$scope.createUrl}&type=${$routeParams.type}`;
        $scope.request.additionalDatabase = $routeParams.type;
        $scope.request.mixDatabaseName = $routeParams.type;
      }
      if ($routeParams.layout) {
        $scope.createUrl = `${$scope.createUrl}&layout=${$routeParams.layout}`;
      }
      if ($routeParams.page_ids) {
        $scope.createUrl = `${$scope.createUrl}&page_ids=${$routeParams.page_ids}`;
      }
      $scope.pageName = "postList";
      await $scope.loadAdditionalDatabases();
      $scope.filter();
    };

    $scope.parseQueryField = function (fieldName, value, operator = "Equal") {
      return {
        fieldName: fieldName,
        value: value,
        compareOperator: operator,
      };
    };
    $scope.syncProducts = async function () {
      $rootScope.isBusy = true;
      let names = $scope.data.items.map((m) => {
        return m.title;
      });
      await service.syncProducts(names);
      $rootScope.isBusy = false;
    };
    $scope.filter = async function (pageIndex) {
      $rootScope.isBusy = true;
      if (pageIndex !== undefined) {
        $scope.request.pageIndex = pageIndex;
      }
      if ($scope.request.fromDate !== null) {
        var d = new Date($scope.request.fromDate);
        $scope.request.fromDate = d.toISOString();
      }
      if ($scope.request.toDate !== null) {
        var dt = new Date($scope.request.toDate);
        $scope.request.toDate = dt.toISOString();
      }
      var resp = await service.filter($scope.request);
      if (resp && resp.success) {
        $scope.data = resp.data;
        $.each($scope.data.items, function (i, data) {
          if (data.image) {
            data.image = `${data.image.substring(
              0,
              data.image.lastIndexOf(".")
            )}-XS.${data.image.substring(data.image.lastIndexOf(".") + 1)}`;
          }
          $.each($scope.viewmodels, function (i, e) {
            if (e.dataContentId === data.id) {
              data.isHidden = true;
            }
          });
        });
        if ($scope.getListSuccessCallback) {
          $scope.getListSuccessCallback();
        }
        if ($scope.isScrollTop) {
          $("html, body").animate({ scrollTop: "0px" }, 500);
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors || ["Failed"]);
        }
        if ($scope.getListFailCallback) {
          $scope.getListFailCallback();
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.loadMetadataDatabase = async function () {
      var getMixDatabase = await databaseService.getByName(["Metadata"]);
      let typeCol = getMixDatabase.data.columns.find(
        (c) => c.systemName == "type"
      );
      $scope.lstMetadata = typeCol.columnConfigurations.allowedValues;
      $scope.$apply();
    };
    $scope.loadAdditionalDatabases = async function () {
      let getTypes = await databaseService.getList($scope.postTypeRequest);
      if (getTypes.success) {
        $scope.additionalDatabases = getTypes.data.items;
        $scope.additionalDatabases.splice(0, 0, {
          systemName: null,
          displayName: "All",
          id: 0,
        });
        if ($scope.request.mixDatabaseName) {
          $scope.additionalDatabase = $rootScope.findObjectByKey(
            $scope.additionalDatabases,
            "mixDatabaseName",
            $scope.request.mixDatabaseName
          );
        }
        $scope.request.mixDatabaseName = $routeParams.type || "";
        $scope.$apply();
      }
    };
    $scope.getDefault = async function (type = null) {
      $rootScope.isBusy = true;
      type = type || $routeParams.type;
      var resp = await service.getDefault({
        type: type || "",
        template: $routeParams.template || "",
      });
      if (resp.success) {
        $scope.viewmodel = resp.data;
        mixDbService.initDbName($scope.viewmodel.mixDatabaseName);
        if ($scope.getSingleSuccessCallback) {
          $scope.getSingleSuccessCallback();
        }

        // $scope.viewmodel.createdDateTime = Date.now();
        $scope.viewmodel.createdBy = $rootScope.authentication.username;

        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors);
        }
        if ($scope.getSingleFailCallback) {
          $scope.getSingleFailCallback();
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.preview = function (item) {
      item.editUrl = "/admin/post/details/" + item.id;
      $rootScope.preview("post", item, item.title, "modal-lg");
    };
    $scope.onSelectType = function () {
      if ($scope.viewmodel) {
        $scope.viewmodel.mixDatabaseName = $scope.additionalDatabase.systemName;
        mixDbService.initDbName($scope.viewmodel.mixDatabaseName);
        $scope.loadAdditionalData();
      }
      $scope.request.additionalDatabase =
        $scope.additionalDatabase.mixDatabaseName;
      $scope.createUrl = `/admin/post/create?type=${$scope.request.additionalDatabase}`;
      if ($routeParams.template) {
        $scope.createUrl += `&template=${$routeParams.template}`;
      }
      if (
        $scope.additionalDatabase.mixDatabaseName &&
        (!$scope.viewmodel || !$scope.viewmodel.id)
      ) {
        $scope.getDefault($scope.request.additionalDatabase);
      }
      if ($scope.pageName == "postList") {
        $scope.filter();
      }
    };
    $scope.getListRelated = async function (pageIndex) {
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
      var resp = await service.filter($scope.request);
      if (resp && resp.success) {
        $scope.relatedData = angular.copy(resp.data);
        $scope.relatedData.items = [];
        angular.forEach(resp.data.items, (element) => {
          let isActive =
            null !=
            $scope.viewmodel.postNavs.find(
              (p) => p.destinationId == element.id
            );
          if (!isActive) {
            var obj = {
              description: element.title,
              destinationId: element.id,
              image: element.image,
              isActived: isActive,
              sourceId: $scope.viewmodel.id,
              specificulture: $scope.viewmodel.specificulture,
              status: "Published",
            };
            result.push(obj);
          }
        });
        resp.data.items = result;
        $rootScope.isBusy = false;
        $scope.$apply();
        return resp.data;
      } else {
        $rootScope.showErrors(getData.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.saveFailCallback = function () {
      angular.forEach($scope.viewmodel.mixDatabaseNavs, function (nav) {
        if (nav.isActived) {
          $rootScope.decryptMixDatabase(
            nav.mixDatabase.attributes,
            nav.mixDatabase.postData.items
          );
        }
      });
    };
    $scope.saveSuccessCallback = async function () {
      if ($scope.additionalData && $scope.viewmodel.mixDatabaseName) {
        var creating = !$scope.additionalData.parentId;
        $scope.additionalData.parentType = "Post";
        $scope.additionalData.parentId = $scope.viewmodel.id;
        mixDbService.initDbName($scope.viewmodel.mixDatabaseName);
        var saveResult = await mixDbService.save($scope.additionalData);
        if (saveResult.success) {
          $rootScope.showMessage("Additional Data Saved", "success");
          $scope.additionalData = saveResult.data;
          if (creating) {
            $location.url(`/admin/post/details/${$scope.viewmodel.id}`);
          }
        } else {
          $rootScope.showErrors(result.errors);
        }
        // $scope.additionalData.isClone = $scope.viewmodel.isClone;
        // $scope.additionalData.cultures = $scope.viewmodel.cultures;
        // $scope.additionalData.intParentId = $scope.viewmodel.id;
        // $scope.additionalData.parentType = "Post";
        // let result = await dataService.save($scope.additionalData);
        // if (!result.success) {
        //   $rootScope.showErrors(result.errors);
        // } else {
        //   $scope.additionalData = result.data;
        //   //   $scope.saveColumns();
        // }
      }
      $rootScope.showMessage("success", "success");
      $rootScope.isBusy = false;
      $scope.$apply();
    };

    $scope.saveColumns = async function () {
      let result = await columnService.saveMany($scope.additionalData.columns);
      if (result.success) {
        $rootScope.showMessage("success", "success");
      }
    };
    $scope.getSingleSuccessCallback = async function () {
      if (!$scope.viewmodel.id) {
        $scope.viewmodel.mixDatabaseName = $routeParams.type;
      }
      mixDbService.initDbName($scope.viewmodel.mixDatabaseName);
      await $scope.loadMetadataDatabase();
      //   $scope.defaultThumbnailImgWidth =
      //     ngAppSettings.mixConfigurations.DefaultThumbnailImgWidth;
      //   $scope.defaultThumbnailImgHeight =
      //     ngAppSettings.mixConfigurations.DefaultThumbnailImgHeight;

      //   $scope.defaultFeatureImgWidth =
      //     ngAppSettings.mixConfigurations.DefaultFeatureImgWidth;
      //   $scope.defaultFeatureImgHeight =
      //     ngAppSettings.mixConfigurations.DefaultFeatureImgHeight;
      $scope.request.additionalDatabase = $scope.viewmodel.mixDatabaseName;
      var moduleIds = $routeParams.moduleIds;
      var pageIds = $routeParams.page_ids;
      $scope.additionalDatabase = $rootScope.findObjectByKey(
        $scope.additionalDatabases,
        "systemName",
        $scope.request.additionalDatabase
      );
      $scope.loadAdditionalData();
      if (moduleIds) {
        for (var moduleContentId of moduleIds.split(",")) {
          var moduleNav = $rootScope.findObjectByKey(
            $scope.viewmodel.modules,
            "moduleContentId",
            moduleContentId
          );
          if (moduleNav) {
            moduleNav.isActived = true;
          }
        }
      }
      if (pageIds) {
        for (var pageId of pageIds.split(",")) {
          var pageNav = $rootScope.findObjectByKey(
            $scope.viewmodel.pages,
            "pageId",
            pageId
          );
          if (pageNav) {
            pageNav.isActived = true;
          }
        }
      }
    };
    $scope.loadAdditionalData = async function () {
      if ($scope.viewmodel.mixDatabaseName) {
        $scope.loadingData = true;
        mixDbService.initDbName($scope.viewmodel.mixDatabaseName);
        if ($scope.viewmodel.id) {
          const getData = await mixDbService.getSingleByParent(
            "Post",
            $scope.viewmodel.id
          );
          if (getData.success) {
            $scope.additionalData = getData.data;
            $scope.loadingData = false;
          }
          $scope.$apply();
        } else {
          $scope.additionalData = {
            parentType: "Post",
          };
          $scope.loadingData = false;
        }
      }
    };
    $scope.generateSeo = function () {
      if ($scope.viewmodel) {
        if (
          $scope.viewmodel.seoName === null ||
          $scope.viewmodel.seoName === ""
        ) {
          $scope.viewmodel.seoName = $rootScope.generateKeyword(
            $scope.viewmodel.title,
            "-"
          );
          if ($scope.viewmodel.seoName.length > 50) {
            $scope.viewmodel.seoName =
              $scope.viewmodel.seoName.substring(0, 80) + "...";
          }
        }
        if (
          $scope.viewmodel.seoTitle === null ||
          $scope.viewmodel.seoTitle === ""
        ) {
          $scope.viewmodel.seoTitle = $scope.viewmodel.title;
        }
        if (
          $scope.viewmodel.seoDescription === null ||
          $scope.viewmodel.seoDescription === ""
        ) {
          $scope.viewmodel.seoDescription = $scope.viewmodel.excerpt;
        }
        if (
          $scope.viewmodel.seoKeywords === null ||
          $scope.viewmodel.seoKeywords === ""
        ) {
          $scope.viewmodel.seoKeywords = $scope.viewmodel.title;
        }
      }
    };
    $scope.addAlias = async function () {
      var getAlias = await urlAliasService.getDefault();
      if (getAlias.success) {
        $scope.viewmodel.urlAliases.push(getAlias.data);
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        $rootScope.showErrors(getAlias.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.removeAliasCallback = async function (index) {
      $scope.viewmodel.urlAliases.splice(index, 1);
      $scope.$apply();
    };

    $scope.validate = function () {
      angular.forEach($scope.viewmodel.mixDatabaseNavs, function (nav) {
        if (nav.isActived) {
          $rootScope.encryptMixDatabase(
            nav.mixDatabase.attributes,
            nav.mixDatabase.postData.items
          );
        }
      });
      return true;
    };
  },
]);
