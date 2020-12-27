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
  "RestAttributeSetDataPortalService",
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
    $scope.addictionalData = null;
    $scope.createUrl = "/portal/post/create";
    $scope.selectedCategories = [];
    $scope.selectedTags = [];
    $scope.postTypes = [];
    $scope.type = {
      obj: {
        title: "All",
        attribute_set_name: "",
      },
    };

    $scope.postTypeRequest = angular.copy(ngAppSettings.request);
    $scope.postTypeRequest.attributeSetName = "post_type";
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
      $scope.postTypes.push($scope.type);
      let getTypes = await dataService.getList($scope.postTypeRequest);
      if (getTypes.isSucceed) {
        $scope.postTypes = $scope.postTypes.concat(getTypes.data.items);
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
        $scope.activedData = resp.data;
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
      $scope.createUrl = `/portal/post/create?type=${$scope.request.type}`;
      if ($routeParams.template) {
        $scope.createUrl += `&template=${$routeParams.template}`;
      }
      if (!$scope.activedData || !$scope.activedData.id) {
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
        $scope.activedData.postNavs = $rootScope.filterArray(
          $scope.activedData.postNavs,
          ["isActived"],
          [true]
        );
        angular.forEach(resp.data.items, (element) => {
          var obj = {
            description: element.title,
            destinationId: element.id,
            image: element.image,
            isActived: false,
            sourceId: $scope.activedData.id,
            specificulture: $scope.activedData.specificulture,
            status: "Published",
          };
          $scope.activedData.postNavs.push(obj);
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
      angular.forEach($scope.activedData.attributeSetNavs, function (nav) {
        if (nav.isActived) {
          $rootScope.decryptAttributeSet(
            nav.attributeSet.attributes,
            nav.attributeSet.postData.items
          );
        }
      });
    };
    $scope.saveSuccessCallback = async function () {
      if ($scope.addictionalData) {
        $scope.addictionalData.parentId = $scope.activedData.id;
        $scope.addictionalData.parentType = "Post";
        var saveData = await dataService.save($scope.addictionalData);
        if (saveData.isSucceed) {
          if ($location.path() == "/portal/post/create") {
            $scope.goToDetail($scope.activedData.id, "post");
          } else {
            $scope.addictionalData = saveData.data;
          }
        }
      }
      $rootScope.isBusy = false;
      $scope.$apply();
    };
    $scope.getSingleSuccessCallback = function () {
      $scope.imgW = ngAppSettings.settings.post_image_width;
      $scope.imgH = ngAppSettings.settings.post_image_height;
      var moduleIds = $routeParams.module_ids;
      var pageIds = $routeParams.page_ids;
      if ($scope.activedData.id) {
        $scope.activedData.detailsUrl = `/post/${$scope.activedData.specificulture}/${$scope.activedData.id}/${$scope.activedData.seoName}`;
      }
      $scope.loadAddictionalData();
      if (moduleIds) {
        for (var moduleId of moduleIds.split(",")) {
          var moduleNav = $rootScope.findObjectByKey(
            $scope.activedData.modules,
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
            $scope.activedData.categories,
            "pageId",
            pageId
          );
          if (pageNav) {
            pageNav.isActived = true;
          }
        }
      }
      if ($scope.activedData.sysCategories) {
        angular.forEach($scope.activedData.sysCategories, function (e) {
          e.attributeData.obj.isActived = true;
          $scope.selectedCategories.push(e.attributeData.obj);
        });
      }

      if ($scope.activedData.sysTags) {
        angular.forEach($scope.activedData.sysTags, function (e) {
          e.attributeData.obj.isActived = true;
          $scope.selectedCategories.push(e.attributeData.obj);
        });
      }
      if ($routeParams.template) {
        $scope.activedData.view = $rootScope.findObjectByKey(
          $scope.activedData.templates,
          "fileName",
          $routeParams.template
        );
      }
      $scope.activedData.publishedDateTime = $filter("utcToLocalTime")(
        $scope.activedData.publishedDateTime
      );
    };

    $scope.loadAddictionalData = async function () {
      const obj = {
        parentType: "Post",
        parentId: $scope.activedData.id,
        databaseName: $scope.activedData.type,
      };
      const getData = await dataService.getAddictionalData(obj);
      if (getData.isSucceed) {
        $scope.addictionalData = getData.data;
        $scope.$apply();
      }
    };
    $scope.generateSeo = function () {
      if ($scope.activedData) {
        if (
          $scope.activedData.seoName === null ||
          $scope.activedData.seoName === ""
        ) {
          $scope.activedData.seoName = $rootScope.generateKeyword(
            $scope.activedData.title,
            "-"
          );
        }
        if (
          $scope.activedData.seoTitle === null ||
          $scope.activedData.seoTitle === ""
        ) {
          $scope.activedData.seoTitle = $scope.activedData.title;
        }
        if (
          $scope.activedData.seoDescription === null ||
          $scope.activedData.seoDescription === ""
        ) {
          $scope.activedData.seoDescription = $scope.activedData.excerpt;
        }
        if (
          $scope.activedData.seoKeywords === null ||
          $scope.activedData.seoKeywords === ""
        ) {
          $scope.activedData.seoKeywords = $scope.activedData.title;
        }
      }
    };
    $scope.addAlias = async function () {
      var getAlias = await urlAliasService.getSingle();
      if (getAlias.isSucceed) {
        $scope.activedData.urlAliases.push(getAlias.data);
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        $rootScope.showErrors(getAlias.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };

    $scope.removeAliasCallback = async function (index) {
      $scope.activedData.urlAliases.splice(index, 1);
      $scope.$apply();
    };

    $scope.updateSysCategories = function (data) {
      // Loop selected categories
      angular.forEach($scope.selectedCategories, function (e) {
        // add if not exist in sysCategories
        var current = $rootScope.findObjectByKey(
          $scope.activedData.sysCategories,
          "id",
          e.id
        );
        if (!current) {
          $scope.activedData.sysCategories.push({
            id: e.id,
            parentId: $scope.activedData.id,
            attributeSetName: "sys_category",
          });
        }
      });
    };
    $scope.updateSysTags = function (data) {
      // Loop selected categories
      angular.forEach($scope.selectedTags, function (e) {
        // add if not exist in sysCategories
        var current = $rootScope.findObjectByKey(
          $scope.activedData.sysTags,
          "id",
          e.id
        );
        if (!current) {
          $scope.activedData.sysCategories.push({
            id: e.id,
            parentId: $scope.activedData.id,
            attributeSetName: "sys_tag",
          });
        }
      });
    };
    $scope.validate = function () {
      angular.forEach($scope.activedData.attributeSetNavs, function (nav) {
        if (nav.isActived) {
          $rootScope.encryptAttributeSet(
            nav.attributeSet.attributes,
            nav.attributeSet.postData.items
          );
        }
      });
      return true;
    };
  },
]);
