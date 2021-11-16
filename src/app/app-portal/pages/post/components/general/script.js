app.component("postGeneral", {
  templateUrl:
    "/mix-app/views/app-portal/pages/post/components/general/view.html",
  controller: [
    "$rootScope",
    "ngAppSettings",
    function ($rootScope, ngAppSettings) {
      var ctrl = this;
      ctrl.dataTypes = $rootScope.globalSettings.dataTypes;
      ctrl.$onInit = function () {};
      ctrl.addProperty = function (type) {
        var i = $(".property").length;
        ctrl.post.properties.push({
          title: "",
          name: "",
          value: null,
          dataType: "text",
        });
      };
    },
  ],
  bindings: {
    post: "=",
    isAdmin: "=",
    onDelete: "&",
    onUpdate: "&",
  },
});
