sharedComponents.component("starRating", {
  templateUrl:
    "/mix-app/views/app-shared/components/star-rating/star-rating.html",
  bindings: {
    ratingValue: "=",
    max: "=?", // optional (default is 5)
    onRatingSelect: "&?",
    isReadonly: "=?",
  },
  controller: "StarRatingController",
});

appShared.controller("StarRatingController", [
  "$rootScope",
  function ($rootScope) {
    var ctrl = this;
    ctrl.translate = function (keyword) {
      return $rootScope.translate(keyword);
    };
    ctrl.readonly = false;
    ctrl.rateFunction = function (rating) {
      console.log("Rating selected: " + rating);
    };
    ctrl.init = function () {
      ctrl.readonly = ctrl.isReadonly === "true";
      ctrl.stars = [];
      ctrl.max = ctrl.max || 5;
      for (var i = 0; i < ctrl.max; i++) {
        ctrl.stars.push({
          filled: i < ctrl.ratingValue,
        });
      }
    };
    ctrl.toggle = function (index) {
      if (ctrl.readonly === undefined || ctrl.readonly === false) {
        ctrl.ratingValue = index + 1;
      }
    };
    ctrl.filled = function (index) {
      return index < ctrl.ratingValue;
    };
  },
]);
