sharedComponents.component("mixSelect", {
  templateUrl: "/mix-app/views/app-shared/components/mix-select/view.html",
  bindings: {
    options: "=",
    model: "=",
    allowNull: "=?",
    callback: "&?",
  },
  controller: [
    "$rootScope",
    "$scope",
    function PortalTemplateController($rootScope, $scope) {
      var ctrl = this;
      ctrl.onSelect = function () {
        ctrl.callback({ type: ctrl.model });
      };
    },
  ],
});
