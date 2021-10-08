sharedComponents.component("trumbowyg", {
  templateUrl: "/mix-app/views/app-shared/components/trumbowyg/trumbowyg.html",
  bindings: {
    options: "<?",
    ngDisabled: "<?",
    placeholder: "@?",
    onFocus: "&?",
    onBlur: "&?",
    onInit: "&?",
    onChange: "&?",
    onResize: "&?",
    onPaste: "&?",
    onOpenfullscreen: "&?",
    onClosefullscreen: "&?",
    onClose: "&?",
    removeformatPasted: "=",
  },
  require: {
    ngModel: "ngModel",
  },
  controller: [
    "$element",
    "$scope",
    "$attrs",
    "ngAppSettings",
    function ($element, $scope, $attrs) {
      var ctrl = this;
      const TBW_EVENTS = [
          "focus",
          "blur",
          "init",
          "change",
          "resize",
          "paste",
          "openfullscreen",
          "closefullscreen",
          "close",
        ],
        EVENTS_PREFIX = "tbw";
      ctrl.options = {
        svgPath: "/mix-app/assets/icons.svg",
        removeformatPasted: false,
        imageWidthModalEdit: true,
        resetCss: true,
        tagClasses: {
          iframe: "w-100", // Tailwind CSS example
        },
        btnsDef: {
          // Customizables dropdowns
          image: {
            dropdown: ["insertImage", "upload", "noembed"],
            ico: "insertImage",
          },
        },
        btns: [
          ["table"],
          ["emoji"],
          ["formatting"],
          ["strong", "em", "del", "underline"],
          ["fontsize"],
          ["foreColor", "backColor"],
          ["highlight"],
          ["link"],
          ["image"],
          ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull"],
          ["unorderedList", "orderedList"],
          ["indent", "outdent"],
          ["preformatted"],
          ["horizontalRule"],
          ["fullscreen"],
          ["viewHTML"],
        ],
        plugins: {
          // Add imagur parameters to upload plugin
          upload: {
            serverPath: "/api/v1/vi-vn/media/upload-media",
            fileFieldName: "file",
            headers: {
              Authorization: "Client-ID 9e57cb1c4791cea",
            },
            urlPropertyName: "data.fullPath",
            statusPropertyName: "isSucceed",
          },
          table: {},
          fontfamily: {
            init: function (trumbowyg) {
              trumbowyg.o.plugins.fontfamily =
                trumbowyg.o.plugins.fontfamily || defaultOptions;
              trumbowyg.addBtnDef("fontfamily", {
                dropdown: buildDropdown(trumbowyg),
                hasIcon: false,
                text: trumbowyg.lang.fontFamily,
              });
            },
          },
        },
      };
      ctrl.getElementReference = function () {
        return $($element.find("div"));
      };

      ctrl.getEditorReference = function () {
        return ctrl.getElementReference().find(".trumbowyg-editor");
      };
      ctrl.updateModelValue = () => {
        $scope.$applyAsync(() => {
          const value = ctrl.getEditorReference().trumbowyg("html");
          ctrl.ngModel.$setViewValue(value);
        });
      };

      ctrl.emitEvent = (event) => {
        const attr = $attrs.$normalize(`on-${event}`);
        if (angular.isFunction(this[attr])) {
          $scope.$applyAsync(() => this[attr]());
        }
      };

      ctrl.initializeEditor = (element) => {
        if (ctrl.removeformatPasted) {
          ctrl.options.plugins.removeformatPasted =
            ctrl.removeformatPasted == "true";
        }
        element
          .trumbowyg(ctrl.options)
          .on("tbwchange", () => ctrl.updateModelValue())
          .on("tbwpaste", () => ctrl.updateModelValue());
        angular.forEach(TBW_EVENTS, (event) => {
          element.on(`${EVENTS_PREFIX}${event}`, () => ctrl.emitEvent(event));
        });
        ctrl.ngModel.$render();
      };

      ctrl.$onDestroy = () => {
        ctrl.getElementReference().trumbowyg("destroy");
      };

      ctrl.$onChanges = (changes) => {
        const element = ctrl.getElementReference();

        if (changes.options && !changes.options.isFirstChange()) {
          element.trumbowyg("destroy");
        }
        ctrl.options = ctrl.options || {};
        ctrl.initializeEditor(element);

        if (changes.ngDisabled) {
          element.trumbowyg(ctrl.ngDisabled ? "disable" : "enable");
        }

        if (changes.placeholder) {
          ctrl.getEditorReference().attr("placeholder", ctrl.placeholder);
        }
      };

      ctrl.$onInit = () => {
        ctrl.ngModel.$render = () => {
          const element = ctrl.getEditorReference();
          element.trumbowyg("html", ctrl.ngModel.$modelValue);
        };
      };
    },
  ],
});
