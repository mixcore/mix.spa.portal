﻿"use strict";
app.controller("CustomerController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$routeParams",
  "$timeout",
  "$location",
  "CustomerServices",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $routeParams,
    $timeout,
    $location,
    customerServices
  ) {
    $scope.request = angular.copy(ngAppSettings.request);
    $scope.request.contentStatuses = ["Active"];
    $scope.request.status = "0";
    $scope.activedCustomer = null;
    $scope.relatedCustomers = [];
    $rootScope.isBusy = false;
    $scope.data = {
      pageIndex: 0,
      pageSize: 1,
      totalItems: 0,
    };
    $scope.errors = [];

    $scope.range = function (max) {
      var input = [];
      for (var i = 1; i <= max; i += 1) input.push(i);
      return input;
    };

    $scope.loadCustomer = async function () {
      $rootScope.isBusy = true;
      var id = $routeParams.id;
      var response = await customerServices.getCustomer(id, "portal");
      if (response.success) {
        $scope.activedCustomer = response.data;
        $rootScope.initEditor();
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.loadCustomers = async function (pageIndex) {
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
      var resp = await customerServices.getCustomers($scope.request);
      if (resp && resp.success) {
        $scope.data = resp.data;
        //$("html, body").animate({ "scrollTop": "0px" }, 500);
        $.each($scope.data.items, function (i, customer) {
          $.each($scope.activedCustomers, function (i, e) {
            if (e.customerId === customer.id) {
              customer.isHidden = true;
            }
          });
        });
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors);
        }
        $scope.$apply();
      }
    };

    $scope.removeCustomer = function (id) {
      $rootScope.showConfirm(
        $scope,
        "removeCustomerConfirmed",
        [id],
        null,
        "Remove Customer",
        "Deleted data will not able to recover, are you sure you want to delete this item?"
      );
    };

    $scope.removeCustomerConfirmed = async function (id) {
      var result = await customerServices.removeCustomer(id);
      if (result.success) {
        $rootScope.showMessage("success", "success");
        $scope.loadCustomers();
      } else {
        $rootScope.showMessage("failed");
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };

    $scope.saveCustomer = async function (customer) {
      customer.content = $(".editor-content").val();
      var resp = await customerServices.saveCustomer(customer);
      if (resp && resp.success) {
        $scope.activedCustomer = resp.data;
        $rootScope.showMessage("Update successfully!", "success");
        $rootScope.isBusy = false;
        $scope.$apply();
        //$location.path('/admin/customer/details/' + resp.data.id);
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors);
        }
        $scope.$apply();
      }
    };
  },
]);
