"use strict";
function BaseRestCtrl(
  $scope,
  $rootScope,
  $location,
  $routeParams,
  ngAppSettings,
  service
) {
  $scope.request = $rootScope.getRequest();
  $scope.contentStatuses = angular.copy(ngAppSettings.contentStatuses);
  $scope.viewmodel = null;

  $scope.isScrollTop = true;
  $scope.defaultId = 0;
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
    $scope.referrerUrl = `/portal/${service.modelName.substr(
      0,
      service.modelName.indexOf("/")
    )}/list`; // document.referrer);
  }

  $scope.duplicate = async function (id) {
    $rootScope.isBusy = true;
    if (!id) {
      return await this.getDefault();
    } else {
      var resp = await service.duplicate([id]);
      if (resp.isSucceed) {
        $scope.goToDetail(resp.data.id, $scope.viewmodelType);
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors);
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    }
  };

  $scope.goToDetail = function (id, type) {
    const url = `/portal/${type}/details/${id}`;
    window.location.href = url;
  };
  $scope.getSingle = async function (params = []) {
    $rootScope.isBusy = true;
    var id = $routeParams.id;
    if (!id) {
      return await this.getDefault();
    } else {
      params.splice(0, 0, id);
      var resp = await service.getSingle([id]);
      if (resp.isSucceed) {
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
    }
  };

  $scope.getDefault = async function () {
    $rootScope.isBusy = true;
    var resp = await service.getDefault();
    if (resp.isSucceed) {
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

  $scope.getList = async function (pageIndex, params = []) {
    $rootScope.isBusy = true;
    if (pageIndex !== undefined) {
      $scope.request.pageIndex = pageIndex;
    }
    if ($scope.request.fromDate !== null) {
      var d = new Date($scope.request.fromDate);
      $scope.request.fromDate = d.toISOString();
    }
    if ($scope.request.toDate !== null) {
      var dt = new Date($scope.request.toDate);
      $scope.request.toDate = dt.toISOString();
    }
    var resp = await service.getList($scope.request, params);
    if (resp && resp.isSucceed) {
      $scope.data = resp.data;
      $.each($scope.data, function (i, data) {
        $.each($scope.viewmodels, function (i, e) {
          if (e.dataId === data.id) {
            data.isHidden = true;
          }
        });
      });
      if ($scope.getListSuccessCallback) {
        $scope.getListSuccessCallback();
      }
      if ($scope.isScrollTop) {
        $("html, body").animate({ scrollTop: "0px" }, 500);
      }
      $rootScope.isBusy = false;
      $scope.$apply();
    } else {
      if (resp) {
        $rootScope.showErrors(resp.errors || ["Failed"]);
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
    var result = await service.delete([id]);
    if (result.isSucceed) {
      if ($scope.removeCallback) {
        $rootScope.executeFunctionByName(
          "removeCallback",
          $scope.removeCallbackArgs,
          $scope
        );
      }
      $scope.getList();
    } else {
      $rootScope.showMessage("failed");
      $rootScope.isBusy = false;
      $scope.$apply();
    }
  };

  $scope.save = async function () {
    $rootScope.isBusy = true;
    if ($scope.validate) {
      $scope.isValid = await $rootScope.executeFunctionByName(
        "validate",
        $scope.validateArgs,
        $scope
      );
    }
    if ($scope.isValid) {
      var resp = null;
      if ($scope.viewmodel.id == 0 || $scope.viewmodel.id == null) {
        resp = await service.create($scope.viewmodel);
      } else {
        resp = await service.update($scope.viewmodel.id, $scope.viewmodel);
      }

      if (resp.isSucceed) {
        $scope.viewmodel = resp.data;
        $rootScope.showMessage("success", "success");

        if ($scope.saveSuccessCallback) {
          $rootScope.executeFunctionByName(
            "saveSuccessCallback",
            $scope.saveSuccessCallbackArgs,
            $scope
          );
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
      }
      $rootScope.isBusy = false;
      $scope.$apply();
      return resp;
    } else {
      $rootScope.showErrors($scope.errors);
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
      "Are you sure to " + $scope.selectedList.action + " these items"
    );
  };

  $scope.applyListConfirmed = async function () {
    $rootScope.isBusy = true;
    var resp = await service.applyList($scope.selectedList);
    if (resp && resp.isSucceed) {
      $rootScope.showMessage("success", "success");
      switch ($scope.selectedList.action) {
        case "Export":
          window.top.location = resp.data.data.webPath;
          $rootScope.isBusy = false;
          $scope.$apply();
          break;
        case "Delete":
        default:
          $scope.selectedList.isSelectAll = false;
          $scope.selectedList.data = [];
          $scope.getList();
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
  $scope.clearCache = async function () {
    if ($scope.viewmodel) {
      $rootScope.isBusy = true;
      var resp = await service.clearCache([$scope.viewmodel.id]);
      if (resp.isSucceed) {
        $rootScope.showMessage("success", "success");
      } else {
        $rootScope.showErrors(resp.errors);
      }
      $rootScope.isBusy = false;
      $scope.$apply();
    }
  };

  $scope.handleResult = function (result) {
    if (result.isSucceed) {
      $rootScope.showMessage("Success");
    } else {
      $rootScope.showErrors(result.errors);
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
}
