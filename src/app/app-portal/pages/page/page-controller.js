"use strict";
app.controller("PageController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$location",
  "$routeParams",
  "PageRestService",
  "PagePostRestService",
  "UrlAliasService",
  "RestMixDatabasePortalService",
  "RestMixDatabaseDataPortalService",
  "RestMixDatabaseColumnPortalService",
  "MixDbService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $location,
    $routeParams,
    service,
    pagePostRestService,
    urlAliasService,
    databaseService,
    dataService,
    columnService,
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
    $scope.request.culture = $rootScope.globalSettings.defaultCulture;
    var pageModuleService = $rootScope.getRestService("mix-page-module");
    $scope.viewmodelType = "page";
    $scope.request.query = "level=0";
    $scope.pageType = {};
    $scope.pageTypes = $rootScope.globalSettings.pageTypes;
    $scope.selectedCategories = [];
    $scope.selectedTags = [];
    $scope.selectedModules = [];
    $scope.pageData = {
      posts: [],
      products: [],
      data: [],
    };
    $scope.request.columns = [
      "id",
      "title",
      "createdDateTime",
      "type",
      "image",
    ];
    $scope.additionalData = null;
    $scope.temp = null;
    $scope.postRequest = angular.copy(ngAppSettings.request);
    $scope.additionalDatabaseRequest = angular.copy(ngAppSettings.request);
    ($scope.additionalDatabaseRequest.searchColumns = "Type"),
      ($scope.additionalDatabaseRequest.searchMethod = "Equal"),
      ($scope.additionalDatabaseRequest.keyword = "AdditionalData");
    $scope.canDrag =
      $scope.request.orderBy !== "Priority" || $scope.request.direction !== "0";
    $scope.loadPosts = async function () {
      $rootScope.isBusy = true;
      var id = $routeParams.id;
      $scope.postRequest.query += "&page_id=" + id;
      var response = await pagePostRestService.getList($scope.postRequest);

      if (response.success) {
        $scope.pageData.posts = response.data;
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.$watch("additionalDatabase", function (newValue, oldValue) {
      console.log(newValue, oldValue);
    });
    $scope.init = async function () {
      await $scope.loadAdditionalDatabases();
      await $scope.getSingle();
    };
    $scope.initList = function () {
      $scope.additionalDatabases.splice(0, 0, {
        systemName: "",
        displayName: "All",
        id: 0,
      });
      $scope.getList();
    };
    $scope.getSingleSuccessCallback = function () {
      mixDbService.initDbName($scope.viewmodel.mixDatabaseName);
      $scope.additionalDatabase = $rootScope.findObjectByKey(
        $scope.additionalDatabases,
        "systemName",
        $scope.viewmodel.mixDatabaseName
      );
      if ($scope.additionalDatabase) {
        $scope.loadAdditionalData();
      }
      if ($routeParams.template) {
        $scope.viewmodel.view = $rootScope.findObjectByKey(
          $scope.viewmodel.templates,
          "fileName",
          $routeParams.template
        );
      }
      $scope.$apply();
    };
    $scope.getListSuccessCallback = function () {
      $scope.canDrag =
        $scope.request.orderBy !== "Priority" ||
        $scope.request.direction !== "0";
    };
    $scope.loadAdditionalData = async function () {
      $scope.loadingData = true;
      const getData = await mixDbService.getSingleByParent(
        "Page",
        $scope.viewmodel.id
      );
      if (getData.success) {
        $scope.additionalData = getData.data;
        $scope.loadingData = false;
      } else {
        $scope.additionalData = {
          parentType: "Page",
        };
        $scope.loadingData = false;
      }
      $scope.$apply();
    };
    $scope.showChilds = function (id) {
      $("#childs-" + id).toggleClass("collapse");
    };
    $scope.updateInfos = async function (index) {
      $scope.data.items.splice(index, 1);
      $rootScope.isBusy = true;
      var startIndex = $scope.data.items[0].priority - 1;
      for (var i = 0; i < $scope.data.items.length; i++) {
        $scope.data.items[i].priority = startIndex + i + 1;
      }
      var resp = await service.updateInfos($scope.data.items);
      if (resp && resp.success) {
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
    $scope.selPageType = function () {
      $scope.request.query = "level=0&pageType=" + $scope.pageType;
      $scope.getList();
    };
    $scope.selectModule = (associations) => {
      if (associations) {
        $scope.selectedModules = associations;
      }
    };
    $scope.goUp = async function (items, index) {
      items[index].priority -= 1;
      items[index - 1].priority += 1;
    };

    $scope.goDown = async function (items, index) {
      items[index].priority += 1;
      items[index - 1].priority -= 1;
    };

    $scope.saveSuccessCallback = async function () {
      var result = await $scope.savePageModules();
      result = result && (await $scope.saveAdditionalData());
      if (result) {
        $rootScope.showMessage("Saved", "success");
      }
      $rootScope.isBusy = false;
      $scope.$apply();
    };
    $scope.loadAdditionalDatabases = async function () {
      let getTypes = await databaseService.getList(
        $scope.additionalDatabaseRequest
      );
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
    $scope.onSelectType = async function () {
      if (
        $scope.viewmodel &&
        $scope.additionalDatabase &&
        $scope.additionalDatabase.systemName
      ) {
        $scope.viewmodel.mixDatabaseName = $scope.additionalDatabase.systemName;
        mixDbService.initDbName($scope.viewmodel.mixDatabaseName);
        await $scope.loadAdditionalData();
      } else {
        $scope.viewmodel.mixDatabaseName = null;
        $scope.additionalData = null;
      }
      $scope.request.mixDatabaseName = $scope.additionalDatabase.systemName;
      $scope.createUrl = `/admin/page/create?type=${$scope.request.mixDatabaseName}`;
      if ($routeParams.template) {
        $scope.createUrl += `&template=${$routeParams.template}`;
      }
      if (
        $scope.additionalDatabase &&
        (!$scope.viewmodel || !$scope.viewmodel.id)
      ) {
        await $scope.getDefault($scope.request.mixDatabaseName);
      }
      if ($scope.pageName == "pageList") {
        await $scope.filter();
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
    $scope.saveAdditionalData = async () => {
      if ($scope.additionalDatabase.systemName && $scope.additionalData) {
        $scope.additionalData.isClone = $scope.viewmodel.isClone;
        $scope.additionalData.cultures = $scope.viewmodel.cultures;
        $scope.additionalData.intParentId = $scope.viewmodel.id;
        $scope.additionalData.parentType = "Page";
        let result = await dataService.save($scope.additionalData);
        if (!result.success) {
          $rootScope.showErrors(result.errors);
        }
        return result.success;
      }
    };
    $scope.savePageModules = async () => {
      angular.forEach($scope.selectedModules, (e) => {
        e.parentId = $scope.viewmodel.id;
      });
      var result = await pageModuleService.saveMany($scope.selectedModules);
      if (!result.success) {
        $rootScope.showErrors(result.errors);
      }
      return result.success;
    };
    $scope.saveColumns = async function () {
      let result = await columnService.saveMany($scope.additionalData.columns);
      if (result.success) {
        $rootScope.showMessage("success", "success");
      }
    };

    $scope.validate = async function () {
      return true;
      // Add default alias if create new page
      //   if (!$scope.viewmodel.id && !$scope.viewmodel.urlAliases.length) {
      //     // Ex: en-us/page-seo-name
      //     // await $scope.addAlias($scope.viewmodel.specificulture + '/' + $scope.viewmodel.seoName);
      //     return true;
      //   } else {
      //     return true;
      //   }
    };
    $scope.addAlias = async function (alias) {
      var getAlias = await urlAliasService.getDefault();
      if (getAlias.success) {
        if (alias) {
          getAlias.data.alias = alias;
        }
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
  },
]);
