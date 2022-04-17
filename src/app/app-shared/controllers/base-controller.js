"use strict";

function BaseCtrl($scope, $rootScope, $routeParams, ngAppSettings, service) {
  $scope.request = angular.copy(ngAppSettings.request);
  $scope.contentStatuses = angular.copy(ngAppSettings.contentStatuses);
  $scope.viewmodel = null;
  $scope.data = null;
  $scope.isInit = false;
  $scope.isValid = true;
  $scope.errors = [];
  $scope.saveSuccessCallbackArgs = [];
  $scope.validateArgs = [];
  $scope.removeCallbackArgs = [];
  $scope.range = $rootScope.range;
  $scope.validate = null;
  $scope.getSingleSuccessCallback = null;
  $scope.getSingleFailCallback = null;
  $scope.getListSuccessCallback = null;
  $scope.getListFailCallback = null;
  $scope.saveFailCallback = null;
  $scope.selectedList = {
    action: "",
    data: [],
  };
  $scope.actions = ["Delete", "Publish", "Export"];
  $scope.translate = $rootScope.translate;
  if ($rootScope.referrerUrl) {
    $scope.referrerUrl = $rootScope.referrerUrl;
  } else {
    $scope.referrerUrl = `/portal/${service.modelName}/list`;
  }
  $scope.getSingle = async function () {
    $rootScope.isBusy = true;
    var id = $routeParams.id;
    var resp = await service.getSingle([id, "portal"]);
    if (resp && resp.success) {
      $scope.viewmodel = resp.data;
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
  $scope.getList = async function (pageIndex) {
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
    $rootScope.isBusy = true;
    var resp = await service.getList($scope.request);
    if (resp && resp.success) {
      $scope.data = resp.data;
      $.each($scope.data.items, function (i, data) {
        $.each($scope.viewmodels, function (i, e) {
          if (e.dataId === data.id) {
            data.isHidden = true;
          }
        });
      });
      if ($scope.getListSuccessCallback) {
        $scope.getListSuccessCallback();
      }
      $("html, body").animate({ scrollTop: "0px" }, 500);
      $rootScope.isBusy = false;
      $scope.$apply();
    } else {
      if (resp) {
        $rootScope.showErrors(resp.errors);
      }
      if ($scope.getListFailCallback) {
        $scope.getListFailCallback();
      }
      $rootScope.isBusy = false;
      $scope.$apply();
    }
  };

  $scope.remove = function (id) {
    $rootScope.showConfirm(
      $scope,
      "removeConfirmed",
      [id],
      null,
      "Remove",
      "Deleted data will not able to recover, are you sure you want to delete this item?"
    );
  };

  $scope.removeConfirmed = async function (id) {
    $rootScope.isBusy = true;
    var result = await service.delete(id);
    if (result.success) {
      if ($scope.removeCallback) {
        $rootScope.executeFunctionByName(
          "removeCallback",
          $scope.removeCallbackArgs,
          $scope
        );
      }
      $scope.getList();
    } else {
      $rootScope.showErrors(result.errors);
      $rootScope.isBusy = false;
      $scope.$apply();
    }
  };
  $scope.applyList = async function () {
    $rootScope.showConfirm(
      $scope,
      "applyListConfirmed",
      [],
      null,
      "Remove",
      "Are you sure to " + $scope.selectedList.action + " these items"
    );
  };

  $scope.applyListConfirmed = async function () {
    $rootScope.isBusy = true;
    var resp = await service.applyList($scope.selectedList);
    if (resp && resp.success) {
      $scope.viewmodel = resp.data;
      $rootScope.showMessage("success", "success");
      switch ($scope.selectedList.action) {
        case "Delete":
          $scope.selectedList.isSelectAll = false;
          $scope.selectedList.data = [];
          $scope.getList();
          break;
        case "Export":
          window.open(resp.data.webPath, "_blank");
          $rootScope.isBusy = false;
          $scope.$apply();
          break;
      }
    } else {
      if (resp) {
        $rootScope.showErrors("Failed");
      }
      $rootScope.isBusy = false;
      $scope.$apply();
    }
  };

  $scope.save = async function (data) {
    if ($scope.validate) {
      $scope.isValid = await $rootScope.executeFunctionByName(
        "validate",
        $scope.validateArgs,
        $scope
      );
    }
    $rootScope.isBusy = true;
    $scope.viewmodel = data || $scope.viewmodel;
    if ($scope.isValid) {
      var resp = await service.save($scope.viewmodel);
      if (resp && resp.success) {
        $scope.viewmodel = resp.data;
        $rootScope.showMessage("success", "success");

        if ($scope.saveSuccessCallback) {
          $rootScope.executeFunctionByName(
            "saveSuccessCallback",
            $scope.saveSuccessCallbackArgs,
            $scope
          );
        } else {
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      } else {
        if ($scope.saveFailCallback) {
          $rootScope.executeFunctionByName(
            "saveFailCallback",
            $scope.saveSuccessCallbackArgs,
            $scope
          );
        }
        if (resp) {
          $rootScope.showErrors(resp.errors);
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    } else {
      $rootScope.showErrors(["invalid model"]);
      $rootScope.isBusy = false;
      $scope.$apply();
    }
  };
  $scope.select = function (id, isSelected) {
    if (isSelected) {
      $scope.selectedList.data.push(id);
    } else {
      $scope.removeObject($scope.selectedList.data, id);
    }
  };
  $scope.selectAll = function (isSelected) {
    $scope.selectedList.data = [];
    angular.forEach($scope.data.items, function (e) {
      e.isSelected = isSelected;
      if (isSelected) {
        $scope.selectedList.data.push(e.id);
      }
    });
  };
  $scope.applyList = async function () {
    $rootScope.showConfirm(
      $scope,
      "applyListConfirmed",
      [],
      null,
      "Remove",
      "Are you sure to" + $scope.selectedList.action + " these items"
    );
  };

  $scope.applyListConfirmed = async function () {
    $rootScope.isBusy = true;
    var resp = await service.applyList($scope.selectedList);
    if (resp && resp.success) {
      $scope.viewmodel = resp.data;
      $rootScope.showMessage("success", "success");
      switch ($scope.selectedList.action) {
        case "Delete":
          $scope.selectedList.isSelectAll = false;
          $scope.selectedList.data = [];
          $scope.getList();
          break;
        case "Export":
          window.open(resp.data.webPath, "_blank");
          $rootScope.isBusy = false;
          $scope.$apply();
          break;
      }
    } else {
      if (resp) {
        $rootScope.showErrors(resp.errors);
      }
      $rootScope.isBusy = false;
      $scope.$apply();
    }
  };

  $scope.shortString = function (msg, max) {
    if (msg) {
      var data = decodeURIComponent(msg);

      if (max < data.length) {
        return data.replace(/[+]/g, " ").substr(0, max) + " ...";
      } else {
        return data.replace(/[+]/g, " ");
      }
    } else {
      return "";
    }
  };

  $scope.handleResult = function (result) {
    if (result.success) {
      $rootScope.showMessage("Success");
    } else {
      $rootScope.showErrors(result.errors);
    }
  };
}
