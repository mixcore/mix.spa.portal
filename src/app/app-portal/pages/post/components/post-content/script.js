app.component("postContent", {
  templateUrl:
    "/mix-app/views/app-portal/pages/post/components/post-content/view.html",
  bindings: {
    model: "=",
    additionalData: "=",
  },
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "PostRestService",
    function ($rootScope, $scope, ngAppSettings, service) {
      var ctrl = this;
      ctrl.request = angular.copy(ngAppSettings.request);
      ctrl.translate = $rootScope.translate;
      ctrl.relatedData = {};
      ctrl.$onInit = function () {
        ctrl.backUrl = `/portal/post/details`;
      };
      ctrl.generateSeo = function () {
        if (ctrl.model) {
          if (ctrl.model.seoName === null || ctrl.model.seoName === "") {
            ctrl.model.seoName = $rootScope.generateKeyword(
              ctrl.model.title,
              "-"
            );
          }
          if (ctrl.model.seoTitle === null || ctrl.model.seoTitle === "") {
            ctrl.model.seoTitle = ctrl.model.title;
          }
          if (
            ctrl.model.seoDescription === null ||
            ctrl.model.seoDescription === ""
          ) {
            ctrl.model.seoDescription = ctrl.model.excerpt;
          }
          if (
            ctrl.model.seoKeywords === null ||
            ctrl.model.seoKeywords === ""
          ) {
            ctrl.model.seoKeywords = ctrl.model.title;
          }
        }
      };
      ctrl.getListRelated = async function (pageIndex) {
        if (pageIndex !== undefined) {
          ctrl.request.pageIndex = pageIndex;
        }
        if (ctrl.request.fromDate !== null) {
          var d = new Date(ctrl.request.fromDate);
          ctrl.request.fromDate = d.toISOString();
        }
        if (ctrl.request.toDate !== null) {
          var d = new Date(ctrl.request.toDate);
          ctrl.request.toDate = d.toISOString();
        }
        var resp = await service.getList(ctrl.request);
        if (resp && resp.isSucceed) {
          ctrl.relatedData = angular.copy(resp.data);
          ctrl.relatedData.items = [];
          angular.forEach(resp.data.items, (element) => {
            var existed = $rootScope.findObjectByKey(
              ctrl.model.postNavs,
              ["sourceId", "destinationId"],
              [ctrl.model.id, element.id]
            );

            var obj = {
              description: element.title,
              destinationId: element.id,
              image: element.image,
              isActived: existed !== null,
              sourceId: ctrl.model.id,
              specificulture: ctrl.model.specificulture,
              status: "Published",
            };

            ctrl.relatedData.items.push(obj);
          });
          console.log(ctrl.relatedData);
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          $rootScope.showErrors(getData.errors);
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };
    },
  ],
});
