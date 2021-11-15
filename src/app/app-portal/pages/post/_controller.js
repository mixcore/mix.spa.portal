"use strict";
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
    $scope.viewmodelType = "post";
    $scope.additionalData = null;
    $scope.createUrl = "/portal/post/create?";
    $scope.selectedCategories = [];
    $scope.selectedTags = [];
    $scope.postType = {
      databaseName: "",
      title: "All",
    };
    $scope.cateRequest = angular.copy(ngAppSettings.request);
    $scope.postTypeRequest = angular.copy(ngAppSettings.request);
    $scope.postTypeRequest.mixDatabaseName = "post_type";
    $scope.postTypeRequest.orderBy = "Priority";
    $scope.postTypeRequest.direction = "Asc";

    $scope.initList = async function () {
      if ($routeParams.template) {
        $scope.createUrl = `${$scope.createUrl}&template=${$routeParams.template}`;
      }
      if ($routeParams.category) {
        $scope.request.category = $routeParams.category;
      }
      if ($routeParams.type) {
        $scope.createUrl = `${$scope.createUrl}&type=${$routeParams.type}`;
        $scope.request.postType = $routeParams.type;
      }
      if ($routeParams.page_ids) {
        $scope.createUrl = `${$scope.createUrl}&page_ids=${$routeParams.page_ids}`;
      }
      $scope.pageName = "postList";
      await $scope.loadPostTypes();
      await $scope.loadCategories();
      $scope.getList();
    };
    $scope.loadCategories = async function () {
      $scope.cateRequest.mixDatabaseName = "sys_category";
      var response = await dataService.getList($scope.cateRequest);
      if (response.isSucceed) {
        $scope.categories = response.data;
        $scope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.loadPostTypes = async function () {
      let getTypes = await dataService.getList($scope.postTypeRequest);
      if (getTypes.isSucceed) {
        $scope.postTypes = getTypes.data.items.map((m) => m.obj);
        $scope.postTypes.splice(
          0,
          0,
          {
            databaseName: "",
            title: "All",
            id: 0,
          },
          {
            databaseName: "sys_additional_column_post",
            title: "Default",
            id: 1,
          }
        );
        if ($scope.request.postType) {
          $scope.postType = $rootScope.findObjectByKey(
            $scope.postTypes,
            "databaseName",
            $scope.request.postType
          );
        }
        $scope.request.postType = $routeParams.type || "";
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
        $scope.viewmodel = resp.data;
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
      item.editUrl = "/portal/post/details/" + item.id;
      $rootScope.preview("post", item, item.title, "modal-lg");
    };
    $scope.onSelectType = function () {
      if ($scope.viewmodel) {
        $scope.viewmodel.type = $scope.postType.databaseName;
        $scope.loadAdditionalData();
      }
      $scope.request.postType = $scope.postType.databaseName;
      $scope.createUrl = `/portal/post/create?type=${$scope.request.postType}`;
      if ($routeParams.template) {
        $scope.createUrl += `&template=${$routeParams.template}`;
      }
      if (
        $scope.postType.databaseName &&
        (!$scope.viewmodel || !$scope.viewmodel.id)
      ) {
        $scope.getDefault($scope.request.postType);
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
        let result = [];
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
      if ($scope.additionalData) {
        $scope.additionalData.isClone = $scope.viewmodel.isClone;
        $scope.additionalData.cultures = $scope.viewmodel.cultures;
        $scope.additionalData.parentId = $scope.viewmodel.id;
        $scope.additionalData.parentType = "Post";
        let result = await dataService.save($scope.additionalData);
        if (!result.isSucceed) {
          $rootScope.showErrors(result.errors);
        } else {
          $scope.additionalData = result.data;
          $scope.saveColumns();
        }
      }
      $rootScope.isBusy = false;
      $scope.$apply();
    };

    $scope.saveColumns = async function () {
      let result = await columnService.saveMany($scope.additionalData.columns);
      if (result.isSucceed) {
        $rootScope.showMessage("success", "success");
      }
    };
    $scope.getSingleSuccessCallback = async function () {
      $scope.defaultThumbnailImgWidth =
        ngAppSettings.localizeSettings.DefaultThumbnailImgWidth;
      $scope.defaultThumbnailImgHeight =
        ngAppSettings.localizeSettings.DefaultThumbnailImgHeight;

      $scope.defaultFeatureImgWidth =
        ngAppSettings.localizeSettings.DefaultFeatureImgWidth;
      $scope.defaultFeatureImgHeight =
        ngAppSettings.localizeSettings.DefaultFeatureImgHeight;

      $scope.request.postType = $scope.viewmodel.type;
      var moduleIds = $routeParams.module_ids;
      var pageIds = $routeParams.page_ids;
      $scope.postType = $rootScope.findObjectByKey(
        $scope.postTypes,
        "databaseName",
        $scope.request.postType
      );
      await $scope.loadCategories();
      $scope.loadAdditionalData();
      if (moduleIds) {
        for (var moduleId of moduleIds.split(",")) {
          var moduleNav = $rootScope.findObjectByKey(
            $scope.viewmodel.modules,
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
            $scope.viewmodel.pages,
            "pageId",
            pageId
          );
          if (pageNav) {
            pageNav.isActived = true;
          }
        }
      }
      if ($scope.viewmodel.sysCategories) {
        angular.forEach($scope.viewmodel.sysCategories, function (e) {
          e.attributeData.obj.isActived = true;
          $scope.selectedCategories.push(e.attributeData.obj);
        });
      }

      if ($scope.viewmodel.sysTags) {
        angular.forEach($scope.viewmodel.sysTags, function (e) {
          e.attributeData.obj.isActived = true;
          $scope.selectedCategories.push(e.attributeData.obj);
        });
      }
      if ($routeParams.template) {
        $scope.viewmodel.view = $rootScope.findObjectByKey(
          $scope.viewmodel.templates,
          "fileName",
          $routeParams.template
        );
      }
    };
    $scope.loadAdditionalData = async function () {
      const obj = {
        parentType: "Post",
        parentId: $scope.viewmodel.id,
        databaseName: $scope.viewmodel.type || "",
      };
      const getData = await dataService.getAdditionalData(obj);
      if (getData.isSucceed) {
        $scope.additionalData = getData.data;
        $scope.$apply();
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
      var getAlias = await urlAliasService.getSingle();
      if (getAlias.isSucceed) {
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
