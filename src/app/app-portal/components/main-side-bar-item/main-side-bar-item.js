modules.component("mainSideBarItem", {
  templateUrl:
    "/mix-app/views/app-portal/components/main-side-bar-item/main-side-bar-item.html",
  controller: [
    "$rootScope",
    function ($rootScope) {
      var ctrl = this;
      ctrl.translate = $rootScope.translate;
      ctrl.addClass = function (obj) {
        obj.currentTarget.classList.add("btn-group-lg");
        //alert(obj);
      };
      ctrl.removeClass = function (obj) {
        obj.currentTarget.classList.remove("btn-group-lg");
        //alert(obj);
      };
    },
  ],
  bindings: {
    item: "=",
  },
});
