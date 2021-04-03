"use strict";
appShared
  .directive("ngEnter", function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if (event.which === 13) {
          scope.$apply(function () {
            scope.$eval(attrs.ngEnter);
          });

          event.preventDefault();
        }
      });
    };
  })
  .directive("ngScroll", function () {
    return function (scope, element, attrs) {
      element.bind("scroll", function (event) {
        scope.$apply(function () {
          scope.$eval(attrs.ngScroll);
        });
        event.preventDefault();
      });
    };
  })
  .directive("file", function () {
    return {
      scope: {
        file: "=",
        files: "=",
      },
      link: function (scope, el, attrs) {
        el.bind("change", function (event) {
          var files = event.target.files;
          var file = files[0];
          scope.file = file;
          scope.files = files;
          scope.$apply();
        });
      },
    };
  })
  .directive("imageonload", function () {
    return {
      restrict: "A",
      link: function (scope, element, attrs) {
        element.bind("load", function () {});
        element.bind("error", function () {});
      },
    };
  });
