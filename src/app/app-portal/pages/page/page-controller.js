﻿"use strict";
app.controller("PageController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$location",
  "$routeParams",
  "PageRestService",
  "PagePostRestService",
  "PagePageRestService",
  "UrlAliasService",
  "RestMixDatabaseDataPortalService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $location,
    $routeParams,
    service,
    pagePostRestService,
    pagePageRestService,
    urlAliasService,
    dataService
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
    $scope.viewmodelType = "page";
    $scope.request.query = "level=0";
    $scope.pageType = "";
    $scope.pageTypes = $rootScope.appSettings.pageTypes;
    $scope.selectedCategories = [];
    $scope.selectedTags = [];
    $scope.pageData = {
      posts: [],
      products: [],
      data: [],
    };
    $scope.postRequest = angular.copy(ngAppSettings.request);
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
    $scope.getSingleSuccessCallback = function () {
      $scope.loadAdditionalData();
      if ($routeParams.template) {
        $scope.viewmodel.view = $rootScope.findObjectByKey(
          $scope.viewmodel.templates,
          "fileName",
          $routeParams.template
        );
      }
    };
    $scope.getListSuccessCallback = function () {
      $scope.canDrag =
        $scope.request.orderBy !== "Priority" ||
        $scope.request.direction !== "0";
    };
    $scope.loadAdditionalData = async function () {
      const obj = {
        parentType: "Page",
        parentId: $scope.viewmodel.id,
        databaseName: "mixdb_page",
      };
      const getData = await dataService.getAdditionalData(obj);
      if (getData.success) {
        $scope.additionalData = getData.data;
        $scope.$apply();
      }
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
    $scope.goUp = async function (items, index) {
      items[index].priority -= 1;
      items[index - 1].priority += 1;
    };

    $scope.goDown = async function (items, index) {
      items[index].priority += 1;
      items[index - 1].priority -= 1;
    };

    $scope.updatePagePage = async function (items) {
      $rootScope.isBusy = true;
      var resp = await pagePageRestService.updateInfos(items);
      if (resp && resp.success) {
        $scope.activedPage = resp.data;
        $rootScope.showMessage("success", "success");
        $scope.getList();
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors);
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.saveSuccessCallback = async function () {
      if ($scope.additionalData) {
        $scope.additionalData.parentId = $scope.viewmodel.id;
        $scope.additionalData.parentType = "Page";
        await dataService.save($scope.additionalData);
      }
      $rootScope.isBusy = false;
      $scope.$apply();
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
      var getAlias = await urlAliasService.getSingle();
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
    $scope.updateSysCategories = function (data) {
      // Loop selected categories
      angular.forEach($scope.selectedCategories, function (e) {
        // add if not exist in sysCategories
        var current = $rootScope.findObjectByKey(
          $scope.viewmodel.sysCategories,
          "id",
          e.id
        );
        if (!current) {
          $scope.viewmodel.sysCategories.push({
            id: e.id,
            parentId: $scope.viewmodel.id,
            mixDatabaseName: "sys_category",
          });
        }
      });
    };
    $scope.updateSysTags = function (data) {
      // Loop selected categories
      angular.forEach($scope.selectedTags, function (e) {
        // add if not exist in sysCategories
        var current = $rootScope.findObjectByKey(
          $scope.viewmodel.sysTags,
          "id",
          e.id
        );
        if (!current) {
          $scope.viewmodel.sysCategories.push({
            id: e.id,
            parentId: $scope.viewmodel.id,
            mixDatabaseName: "sys_tag",
          });
        }
      });
    };
    $scope.removeAliasCallback = async function (index) {
      $scope.viewmodel.urlAliases.splice(index, 1);
      $scope.$apply();
    };
  },
]);
