﻿sharedComponents.component("limitString", {
  templateUrl:
    "/mix-app/views/app-shared/components/limit-string/limit-string.html",
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    function ($rootScope, $scope, ngAppSettings) {
      var ctrl = this;
      ctrl.shortenString = "";
      ctrl.previousContentId = undefined;

      this.$onInit = () => {
        ctrl.previousContentId = angular.copy(ctrl.contentId);
      };

      this.$doCheck = () => {
        if (ctrl.contentId !== ctrl.previousContentId) {
          ctrl.loadModuleData();
          ctrl.previousContentId = ctrl.contentId;
        }
      };
      ctrl.shortString = function () {
        var data = decodeURIComponent(ctrl.content);
        if (data) {
          if (ctrl.max < data.length) {
            ctrl.shortenString =
              data.replace(/[+]/g, " ").substr(0, ctrl.max) + " ...";
          } else {
            ctrl.shortenString = data.replace(/[+]/g, " ");
          }
        }
      };
      ctrl.view = function () {
        var obj = {
          moduleContentId: ctrl.moduleContentId,
          id: ctrl.contentId,
        };
        $rootScope.preview("module-data", obj, null, "modal-lg");
      };
      ctrl.translate = $rootScope.translate;
    },
  ],
  bindings: {
    content: "=",
    showData: "=",
    max: "=",
    moduleContentId: "=",
    contentId: "=",
  },
});
