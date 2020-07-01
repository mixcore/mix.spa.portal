'use strict';
app.controller('PostController', ['$scope', '$rootScope', '$location', '$filter',
    'ngAppSettings', '$routeParams', 'PostRestService', 'UrlAliasService', 'AttributeSetService',
    function ($scope, $rootScope, $location, $filter, ngAppSettings, $routeParams, service, urlAliasService, attributeSetService) {
        BaseRestCtrl.call(this, $scope, $rootScope, $routeParams, ngAppSettings, service);
        $scope.selectedCategories = [];
        $scope.selectedTags = [];

        $scope.preview = function (item) {
            item.editUrl = '/portal/post/details/' + item.id;
            $rootScope.preview('post', item, item.title, 'modal-lg');
        };

        // $scope.saveSuccessCallback = function () {
        //     $location.url($scope.referrerUrl);
        // }
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

                $scope.activedData.postNavs = $rootScope.filterArray($scope.activedData.postNavs, ['isActived'], [true]);
                angular.forEach(resp.data.items, element => {
                    var obj = {
                        description: element.title,
                        destinationId: element.id,
                        image: element.image,
                        isActived: false,
                        sourceId: $scope.activedData.id,
                        specificulture: $scope.activedData.specificulture,
                        status: 'Published'
                    };
                    $scope.activedData.postNavs.push(obj);
                });
                $rootScope.isBusy = false;
                $scope.$apply();
            }
            else {
                $rootScope.showErrors(getData.errors);
                $rootScope.isBusy = false;
                $scope.$apply();
            }

        };
        $scope.saveFailCallback = function () {
            angular.forEach($scope.activedData.attributeSetNavs, function (nav) {
                if (nav.isActived) {
                    $rootScope.decryptAttributeSet(nav.attributeSet.attributes, nav.attributeSet.postData.items);
                }
            });
        };
        $scope.saveSuccessCallback = function () {
            angular.forEach($scope.activedData.attributeSetNavs, function (nav) {
                if (nav.isActived) {
                    $rootScope.decryptAttributeSet(nav.attributeSet.attributes, nav.attributeSet.postData.items);
                }
            });
            $rootScope.isBusy = false;
            $scope.$apply();
        };
        $scope.getSingleSuccessCallback = function () {
            var moduleId = $routeParams.module_id;
            var pageId = $routeParams.page_id;
            if (moduleId) {
                var moduleNav = $rootScope.findObjectByKey($scope.activedData.modules, 'moduleId', moduleId);
                if (moduleNav) {
                    moduleNav.isActived = true;
                }
            }
            if (pageId) {
                var pageNav = $rootScope.findObjectByKey($scope.activedData.categories, 'pageId', pageId);
                if (pageNav) {
                    pageNav.isActived = true;
                }
            }
            if ($routeParams.attr_set_ids) {
                var req = angular.copy(ngAppSettings.request);
                req.query = 'attr_set_ids=' + $routeParams.attr_set_ids;
                var getData = attributeSetService.getList(req);
                if (getData.isSucceed) {
                    angular.forEach(getData.data.items, function (e) {
                        e.isActived = true;
                    });
                    $scope.activedData.attributeSetNavs = getData.data;
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

            $scope.activedData.publishedDateTime = $filter('utcToLocalTime')($scope.activedData.publishedDateTime);
        }
        $scope.generateSeo = function () {
            if ($scope.activedData) {
                if ($scope.activedData.seoName === null || $scope.activedData.seoName === '') {
                    $scope.activedData.seoName = $rootScope.generateKeyword($scope.activedData.title, '-');
                }
                if ($scope.activedData.seoTitle === null || $scope.activedData.seoTitle === '') {
                    $scope.activedData.seoTitle = $scope.activedData.title;
                }
                if ($scope.activedData.seoDescription === null || $scope.activedData.seoDescription === '') {
                    $scope.activedData.seoDescription = $scope.activedData.excerpt;
                }
                if ($scope.activedData.seoKeywords === null || $scope.activedData.seoKeywords === '') {
                    $scope.activedData.seoKeywords = $scope.activedData.title;
                }
            }
        }
        $scope.addAlias = async function () {
            var getAlias = await urlAliasService.getSingle();
            if (getAlias.isSucceed) {
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

        $scope.removeAliasCallback = async function (index) {
            $scope.activedData.urlAliases.splice(index, 1);
            $scope.$apply();
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
        };
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
        $scope.validate = function () {
            angular.forEach($scope.activedData.attributeSetNavs, function (nav) {
                if (nav.isActived) {
                    $rootScope.encryptAttributeSet(nav.attributeSet.attributes, nav.attributeSet.postData.items);
                }
            });
            return true;
        };
    }
]);