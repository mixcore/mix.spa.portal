'use strict';
app.controller('LocalizeController',
    ['$scope', '$rootScope', 'ngAppSettings', '$routeParams', '$location', 'LocalizeService', 'CommonService',
        function ($scope, $rootScope, ngAppSettings, $routeParams, $location, service, commonService) {
            BaseRestCtrl.call(this, $scope, $rootScope, $routeParams, ngAppSettings, service);
            $scope.cates = [];
            $scope.settings = $rootScope.globalSettings;
            $scope.defaultId = 'default';
            $scope.languageFile = {
                file: null,
                fullPath: '',
                folder: 'Language',
                title: '',
                description: ''
            };                
            $scope.dataTypes = $rootScope.globalSettings.dataTypes;
            $scope.$on('$viewContentLoaded', function() {
                $scope.cates = ngAppSettings.enums.language_types;
                $scope.settings = $rootScope.globalSettings;
                $scope.cate = $scope.cates[0];
            });
            $scope.save = async function () {
                $rootScope.isBusy = true;
                if ($scope.validate) {
                    $scope.isValid = await $rootScope.executeFunctionByName('validate', $scope.validateArgs, $scope);
                }
                if ($scope.isValid) {
                    var resp = null;
                    if($scope.activedData.keyword == null)
                    {
                        resp = await service.create($scope.activedData);
                    }
                    else{
                        resp = await service.update($scope.activedData);
                    }
                    if (resp.isSucceed) {
                        $scope.activedData = resp.data;
                        $rootScope.showMessage('success', 'success');
        
                        if ($scope.saveSuccessCallback) {
                            $rootScope.executeFunctionByName('saveSuccessCallback', $scope.saveSuccessCallbackArgs, $scope);
                        }
                        else{
                            $rootScope.isBusy = false;
                            $scope.$apply();
                        }
                    } else {
                        if ($scope.saveFailCallback) {
                            $rootScope.executeFunctionByName('saveFailCallback', $scope.saveSuccessCallbackArgs, $scope)
                        }
                        if (resp) {
                            $rootScope.showErrors(resp.errors);
                        }
                        $rootScope.isBusy = false;
                        $scope.$apply();
                    }
                    return resp;
                }
                else {
                    $rootScope.showErrors(['invalid model']);
                    $rootScope.isBusy = false;
                    $scope.$apply();
                }
            };
            $scope.saveSuccessCallback = function () {
                commonService.initAllSettings().then(function () {
                    $location.url($scope.referrerUrl);
                    $rootScope.isBusy = false;
                    $scope.$apply();
                });
            }
            $scope.removeCallback = function () {
                commonService.initAllSettings().then(function () {
                    // $location.url($scope.referrerUrl);
                });
            }
            $scope.generateDefault = function (text, cate) {
                if (!$routeParams.id && !$scope.activedData.keyword) {
                    $scope.activedData.defaultValue = text;
                    $scope.activedData.keyword = cate.prefix + text.replace(/[^a-zA-Z0-9]+/g, '_')
                        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
                        .replace(/([a-z])([A-Z])/g, '$1-$2')
                        .replace(/([0-9])([^0-9])/g, '$1-$2')
                        .replace(/([^0-9])([0-9])/g, '$1-$2')
                        .replace(/-+/g, '_')
                        .toLowerCase();
                }
            };
    
        }]);
