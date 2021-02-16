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
  function (
    $scope,
    $rootScope,
    $location,
    $filter,
    ngAppSettings,
    $routeParams,
    service,
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
    $scope.additionalData = null;
    $scope.createUrl = "/portal/post/create";
    $scope.selectedCategories = [];
    $scope.selectedTags = [];
    $scope.postTypes = [
      {
        title: "All",
        attribute_set_name: "",
      },
    ];

    $scope.postTypeRequest = angular.copy(ngAppSettings.request);
    $scope.postTypeRequest.mixDatabaseName = "post_type";
    $scope.postTypeRequest.orderBy = "Priority";
    $scope.postTypeRequest.direction = "Asc";

    $scope.initList = async function () {
      if ($routeParams.template) {
        $scope.createUrl = `${$scope.createUrl}?template=${$routeParams.template}`;
      }
      $scope.pageName = "postList";
      $scope.loadPostTypes();
      $scope.getList();
    };
    $scope.loadPostTypes = async function () {
      let getTypes = await dataService.getList($scope.postTypeRequest);
      if (getTypes.isSucceed) {
        $scope.postTypes = $scope.postTypes.concat(
          getTypes.data.items.map((m) => m.obj)
        );
        $scope.postType = $rootScope.findObjectByKey(
          $scope.postTypes,
          "attribute_set_name",
          $scope.request.type
        );
        $scope.request.type = $routeParams.type || "";
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
      if (resp.isSucceed) {
        $scope.viewModel = resp.data;
        if ($scope.getSingleSuccessCallback) {
          $scope.getSingleSuccessCallback();
        }
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
      item.editUrl = "/portal/post/details/" + item.id;
      $rootScope.preview("post", item, item.title, "modal-lg");
    };
    $scope.onSelectType = function () {
      $scope.viewModel.type = $scope.postType.attribute_set_name;
      $scope.createUrl = `/portal/post/create?type=${$scope.request.type}`;
      if ($routeParams.template) {
        $scope.createUrl += `&template=${$routeParams.template}`;
      }
      if (!$scope.viewModel || !$scope.viewModel.id) {
        $scope.getDefault($scope.request.type);
      }
      if ($scope.pageName == "postList") {
        $scope.getList();
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
      var resp = await service.getList($scope.request);
      if (resp && resp.isSucceed) {
        $scope.viewModel.postNavs = $rootScope.filterArray(
          $scope.viewModel.postNavs,
          ["isActived"],
          [true]
        );
        angular.forEach(resp.data.items, (element) => {
          var obj = {
            description: element.title,
            destinationId: element.id,
            image: element.image,
            isActived: false,
            sourceId: $scope.viewModel.id,
            specificulture: $scope.viewModel.specificulture,
            status: "Published",
          };
          $scope.viewModel.postNavs.push(obj);
        });
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        $rootScope.showErrors(getData.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.saveFailCallback = function () {
      angular.forEach($scope.viewModel.mixDatabaseNavs, function (nav) {
        if (nav.isActived) {
          $rootScope.decryptMixDatabase(
            nav.mixDatabase.attributes,
            nav.mixDatabase.postData.items
          );
        }
      });
    };
    $scope.saveSuccessCallback = async function () {
      if ($scope.additionalData) {
        $scope.additionalData.parentId = $scope.viewModel.id;
        $scope.additionalData.parentType = "Post";
        var saveData = await dataService.save($scope.additionalData);
        if (saveData.isSucceed) {
          if ($location.path() == "/portal/post/create") {
            $scope.goToDetail($scope.viewModel.id, "post");
          } else {
            $scope.additionalData = saveData.data;
          }
        }
      }
      $rootScope.isBusy = false;
      $scope.$apply();
    };
    $scope.getSingleSuccessCallback = async function () {
      $scope.imgW = ngAppSettings.settings.post_image_width;
      $scope.imgH = ngAppSettings.settings.post_image_height;
      $scope.request.type = $scope.viewModel.type;
      var moduleIds = $routeParams.module_ids;
      var pageIds = $routeParams.page_ids;
      if ($scope.viewModel.id) {
        $scope.viewModel.detailsUrl = `/post/${$scope.viewModel.specificulture}/${$scope.viewModel.id}/${$scope.viewModel.seoName}`;
      }
      await $scope.loadPostTypes();
      $scope.loadAdditionalData();
      if (moduleIds) {
        for (var moduleId of moduleIds.split(",")) {
          var moduleNav = $rootScope.findObjectByKey(
            $scope.viewModel.modules,
            "moduleId",
            moduleId
          );
          if (moduleNav) {
            moduleNav.isActived = true;
          }
        }
      }
      if (pageIds) {
        for (var pageId of pageIds.split(",")) {
          var pageNav = $rootScope.findObjectByKey(
            $scope.viewModel.categories,
            "pageId",
            pageId
          );
          if (pageNav) {
            pageNav.isActived = true;
          }
        }
      }
      if ($scope.viewModel.sysCategories) {
        angular.forEach($scope.viewModel.sysCategories, function (e) {
          e.attributeData.obj.isActived = true;
          $scope.selectedCategories.push(e.attributeData.obj);
        });
      }

      if ($scope.viewModel.sysTags) {
        angular.forEach($scope.viewModel.sysTags, function (e) {
          e.attributeData.obj.isActived = true;
          $scope.selectedCategories.push(e.attributeData.obj);
        });
      }
      if ($routeParams.template) {
        $scope.viewModel.view = $rootScope.findObjectByKey(
          $scope.viewModel.templates,
          "fileName",
          $routeParams.template
        );
      }
      $scope.viewModel.publishedDateTime = $filter("utcToLocalTime")(
        $scope.viewModel.publishedDateTime
      );
    };

    $scope.loadAdditionalData = async function () {
      const obj = {
        parentType: "Post",
        parentId: $scope.viewModel.id,
        databaseName: $scope.viewModel.type,
      };
      const getData = await dataService.getAdditionalData(obj);
      if (getData.isSucceed) {
        $scope.additionalData = getData.data;
        $scope.$apply();
      }
    };
    $scope.generateSeo = function () {
      if ($scope.viewModel) {
        if (
          $scope.viewModel.seoName === null ||
          $scope.viewModel.seoName === ""
        ) {
          $scope.viewModel.seoName = $rootScope.generateKeyword(
            $scope.viewModel.title,
            "-"
          );
        }
        if (
          $scope.viewModel.seoTitle === null ||
          $scope.viewModel.seoTitle === ""
        ) {
          $scope.viewModel.seoTitle = $scope.viewModel.title;
        }
        if (
          $scope.viewModel.seoDescription === null ||
          $scope.viewModel.seoDescription === ""
        ) {
          $scope.viewModel.seoDescription = $scope.viewModel.excerpt;
        }
        if (
          $scope.viewModel.seoKeywords === null ||
          $scope.viewModel.seoKeywords === ""
        ) {
          $scope.viewModel.seoKeywords = $scope.viewModel.title;
        }
      }
    };
    $scope.addAlias = async function () {
      var getAlias = await urlAliasService.getSingle();
      if (getAlias.isSucceed) {
        $scope.viewModel.urlAliases.push(getAlias.data);
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        $rootScope.showErrors(getAlias.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };

    $scope.removeAliasCallback = async function (index) {
      $scope.viewModel.urlAliases.splice(index, 1);
      $scope.$apply();
    };

    $scope.updateSysCategories = function (data) {
      // Loop selected categories
      angular.forEach($scope.selectedCategories, function (e) {
        // add if not exist in sysCategories
        var current = $rootScope.findObjectByKey(
          $scope.viewModel.sysCategories,
          "id",
          e.id
        );
        if (!current) {
          $scope.viewModel.sysCategories.push({
            id: e.id,
            parentId: $scope.viewModel.id,
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
          $scope.viewModel.sysTags,
          "id",
          e.id
        );
        if (!current) {
          $scope.viewModel.sysCategories.push({
            id: e.id,
            parentId: $scope.viewModel.id,
            mixDatabaseName: "sys_tag",
          });
        }
      });
    };
    $scope.validate = function () {
      angular.forEach($scope.viewModel.mixDatabaseNavs, function (nav) {
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
