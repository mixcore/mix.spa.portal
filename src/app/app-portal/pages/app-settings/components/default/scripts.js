app.component("appSettingsDefault", {
  templateUrl:
    "/mix-app/views/app-portal/pages/app-settings/components/default/view.html",
  controller: [
    "$rootScope",
    "ngAppSettings",
    function ($rootScope, ngAppSettings) {
      var ctrl = this;
      ctrl.$onInit = function () {
        ctrl.properties = $.parseJSON(
          ctrl.appSettings.AppSettings.DefaultPostAttr
        );
        ctrl.trackedProperties = $.parseJSON(
          ctrl.appSettings.AppSettings.DefaultPostAttr
        );
        ctrl.dataTypes = $rootScope.appSettings.dataTypes;
      };
      ctrl.addPostProperty = function () {
        ctrl.properties.push({
          priority: 0,
          name: "",
          value: null,
          dataType: "7",
        });
      };
      ctrl.$doCheck = function () {
        if (ctrl.trackedProperties != ctrl.properties) {
          ctrl.trackedProperties = angular.copy(ctrl.properties);
          ctrl.appSettings.AppSettings.DefaultPostAttr = JSON.stringify(
            ctrl.properties
          );
        }
      }.bind(ctrl);
    },
  ],
  bindings: {
    appSettings: "=",
    cultures: "=",
    statuses: "=",
    onDelete: "&",
    onUpdate: "&",
  },
});
