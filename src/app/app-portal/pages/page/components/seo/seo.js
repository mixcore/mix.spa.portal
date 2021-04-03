app.component("pageSeo", {
  templateUrl: "/mix-app/views/app-portal/pages/page/components/seo/seo.html",
  controller: [
    "$rootScope",
    function ($rootScope) {
      var ctrl = this;
      ctrl.translate = function (keyword) {
        return $rootScope.translate(keyword);
      };
    },
  ],
  bindings: {
    page: "=",
    onDelete: "&",
    onUpdate: "&",
  },
});
