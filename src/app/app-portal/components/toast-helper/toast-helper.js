modules.component("toastHelper", {
  templateUrl:
    "/mix-app/views/app-portal/components/toast-helper/toast-helper.html",
  bindings: {
    url: "=?",
    title: "=?",
  },
  controller: [
    "$rootScope",
    function ($rootScope) {
      var ctrl = this;
      ctrl.visible = $rootScope.visible;
    },
  ],
});
