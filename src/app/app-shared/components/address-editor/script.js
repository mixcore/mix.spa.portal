sharedComponents.component("addressEditor", {
  templateUrl: "/mix-app/views/app-shared/components/address-editor/view.html",
  bindings: {
    province: "=",
    provinceClass: "=?",
    district: "=",
    districtClass: "=?",
    ward: "=",
    wardClass: "=?",
  },
  controller: "AddressEditorController",
});

sharedComponents.controller("AddressEditorController", [
  "$rootScope",
  "$scope",
  "ApiService",
  function PortalTemplateController($rootScope, $scope, apiService) {
    var ctrl = this;
    ctrl.provinceEndpoint = "/rest/shared/json-data/provinces.json/true";
    ctrl.districtEndpoint = "/rest/shared/json-data/districts.json/true";
    ctrl.wardEndpoint = "/rest/shared/json-data/wards.json/true";
    ctrl.$onInit = async function () {
      ctrl.provinceClass =
        ctrl.provinceClass || "form-select form-control mb-3";
      ctrl.districtClass =
        ctrl.districtClass || "form-select form-control mb-3";
      ctrl.wardClass = ctrl.wardClass || "form-select form-control mb-3";

      ctrl.provinceOptions = await apiService.getApiResult({
        url: ctrl.provinceEndpoint,
      });
      $scope.$apply();
      $rootScope.$watch(
        () => {
          return ctrl.province;
        },
        async function (newVal, oldVal) {
          if (newVal != oldVal || !ctrl.district) {
            if (!ctrl.allDistrictOptions) {
              ctrl.allDistrictOptions = await apiService.getApiResult({
                url: ctrl.districtEndpoint,
              });
              ctrl.districtOptions = ctrl.allDistrictOptions.filter(
                (m) => m["province"] == ctrl.province
              );
              $scope.$apply();
            } else {
              ctrl.districtOptions = ctrl.allDistrictOptions.filter(
                (m) => m["province"] == ctrl.province
              );
            }
          }
        }
      );
      $rootScope.$watch(
        () => {
          return ctrl.district;
        },
        async function (newVal, oldVal) {
          if (newVal != oldVal) {
            if (!ctrl.allWardOptions) {
              ctrl.allWardOptions = await apiService.getApiResult({
                url: ctrl.wardEndpoint,
              });
              ctrl.wardOptions = ctrl.allWardOptions.filter(
                (m) => m["district"] == ctrl.district
              );
              $scope.$apply();
            } else {
              ctrl.wardOptions = ctrl.allWardOptions.filter(
                (m) => m["district"] == ctrl.district
              );
            }
          }
        }
      );
    };
  },
]);
