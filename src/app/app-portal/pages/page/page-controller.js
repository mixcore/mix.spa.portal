'use strict';
app.controller('PageController', ['$scope', '$rootScope', 'ngAppSettings', '$location', '$routeParams',
    'PageService', 'PagePostService', 'PagePageService', 'UrlAliasService',
    function ($scope, $rootScope, ngAppSettings, $location, $routeParams,
        service, pagePostService, pagePageService, urlAliasService) {
        BaseCtrl.call(this, $scope, $rootScope, $routeParams, ngAppSettings, service);
        $scope.request.query = 'level=0';
        $scope.pageType = '';
        $scope.pageTypes = $rootScope.globalSettings.pageTypes;
        $scope.selectedCategories = [];
        $scope.selectedTags = [];
        $scope.pageData = {
            posts: [],
            products: [],
            data: [],
        };
        $scope.postRequest = angular.copy(ngAppSettings.request);
        $scope.canDrag = $scope.request.orderBy !== 'Priority' || $scope.request.direction !== '0';
        $scope.loadPosts = async function () {
            $rootScope.isBusy = true;
            var id = $routeParams.id;
            $scope.postRequest.query += '&page_id=' + id;
            var response = await pagePostService.getList($scope.postRequest);
            if (response.isSucceed) {
                $scope.pageData.posts = response.data;
                $rootScope.isBusy = false;
                $scope.$apply();
            }
            else {
                $rootScope.showErrors(response.errors);
                $rootScope.isBusy = false;
                $scope.$apply();
            }
        };
        $scope.getSingleSuccessCallback = function () {

            if ($scope.activedData.sysCategories) {
                angular.forEach($scope.activedData.sysCategories, function (e) {
                    e.data.data.isActived = true;
                    $scope.selectedCategories.push(e.data.data);
                });
            }

            if ($scope.activedData.sysTags) {
                angular.forEach($scope.activedData.sysTags, function (e) {
                    e.data.data.isActived = true;
                    $scope.selectedCategories.push(e.data.data);
                });
            }

        }
        $scope.getListSuccessCallback = function () {
            $scope.canDrag = $scope.request.orderBy !== 'Priority' || $scope.request.direction !== '0';
        };
        $scope.showChilds = function (id) {
            $('#childs-' + id).toggleClass('collapse');
        };
        $scope.updateInfos = async function (index) {
            $scope.data.items.splice(index, 1);
            $rootScope.isBusy = true;
            var startIndex = $scope.data.items[0].priority - 1;
            for (var i = 0; i < $scope.data.items.length; i++) {
                $scope.data.items[i].priority = startIndex + i + 1;
            }
            var resp = await service.updateInfos($scope.data.items);
            if (resp && resp.isSucceed) {
                $scope.activedPage = resp.data;
                $rootScope.showMessage('success', 'success');
                $rootScope.isBusy = false;
                $scope.$apply();
            }
            else {
                if (resp) { $rootScope.showErrors(resp.errors); }
                $rootScope.isBusy = false;
                $scope.$apply();
            }
        };
        $scope.selPageType = function () {
            $scope.request.query = 'level=0&pageType=' + $scope.pageType;
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
            var resp = await pagePageService.updateInfos(items);
            if (resp && resp.isSucceed) {
                $scope.activedPage = resp.data;
                $rootScope.showMessage('success', 'success');
                $scope.getList();
            }
            else {
                if (resp) { $rootScope.showErrors(resp.errors); }
                $rootScope.isBusy = false;
                $scope.$apply();
            }
        };
        // $scope.saveSuccessCallback = function () {
        //     $location.url($scope.referrerUrl);
        // }
        $scope.validate = async function () {

            // Add default alias if create new page
            if (!$scope.activedData.id && !$scope.activedData.urlAliases.length) {
                // Ex: en-us/page-seo-name
                // await $scope.addAlias($scope.activedData.specificulture + '/' + $scope.activedData.seoName);
                return true;
            }
            else{
                return true;
            }
        };
        $scope.addAlias = async function (alias) {
            var getAlias = await urlAliasService.getSingle();
            if (getAlias.isSucceed) {
                if (alias) {
                    getAlias.data.alias = alias;
                }
                $scope.activedData.urlAliases.push(getAlias.data);
                $rootScope.isBusy = false;
                $scope.$apply();
            }
            else {
                $rootScope.showErrors(getAlias.errors);
                $rootScope.isBusy = false;
                $scope.$apply();
            }
        }
        $scope.updateSysCategories = function (data) {
            // Loop selected categories
            angular.forEach($scope.selectedCategories, function (e) {
                // add if not exist in sysCategories                
                var current = $rootScope.findObjectByKey($scope.activedData.sysCategories, 'id', e.id);
                if (!current) {
                    $scope.activedData.sysCategories.push({
                        id: e.id,
                        parentId: $scope.activedData.id,
                        attributeSetName: 'sys_category'
                    });
                }
            });
        }
        $scope.updateSysTags = function (data) {
            // Loop selected categories
            angular.forEach($scope.selectedTags, function (e) {
                // add if not exist in sysCategories                
                var current = $rootScope.findObjectByKey($scope.activedData.sysTags, 'id', e.id);
                if (!current) {
                    $scope.activedData.sysCategories.push({
                        id: e.id,
                        parentId: $scope.activedData.id,
                        attributeSetName: 'sys_tag'
                    });
                }
            });
        }
        $scope.removeAliasCallback = async function (index) {
            $scope.activedData.urlAliases.splice(index, 1);
            $scope.$apply();
        }

    }]);
