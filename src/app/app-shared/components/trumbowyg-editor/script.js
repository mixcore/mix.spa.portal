sharedComponents.component("trumbowygEditor", {
  templateUrl:
    "/mix-app/views/app-shared/components/trumbowyg-editor/view.html",
  bindings: {
    content: "=",
  },
  controller: [
    "$rootScope",
    "$scope",
    "$element",
    "$attrs",
    "ngAppSettings",
    function ($rootScope, $scope, $element, $attrs, ngAppSettings) {
      var ctrl = this;
      ctrl.previousId = null;
      ctrl.editor = null;
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
        core: {},
        plugins: {
          svgPath: "/mix-app/assets/icons.svg",
          removeformatPasted: false,
          imageWidthModalEdit: true,
          resetCss: true,
          tagsToRemove: ["p"],
          tagClasses: {
            p: "p",
            h1: "h1",
            blockquote: "bg-grey-100 rounded-xl",
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
              serverPath: "https://api.imgur.com/3/image",
              fileFieldName: "image",
              headers: {
                Authorization: "Client-ID 9e57cb1c4791cea",
              },
              urlPropertyName: "data.link",
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
        },
      };
      ctrl.$onChanges = (changes) => {
        setTimeout(() => {
          ctrl.initializeEditor();
        }, 100);
      };

      ctrl.initializeEditor = () => {
        ctrl.editor = $($element.find("div"));
        if (ctrl.removeformatPasted) {
          ctrl.options.plugins.removeformatPasted =
            ctrl.removeformatPasted == "true";
        }
        ctrl.editor
          .trumbowyg(ctrl.options.plugins)
          .on("tbwchange", () => ctrl.updateModelValue())
          .on("tbwpaste", () => ctrl.updateModelValue());
        angular.forEach(TBW_EVENTS, (event) => {
          ctrl.editor.on(`${EVENTS_PREFIX}${event}`, () =>
            ctrl.emitEvent(event)
          );
        });

        ctrl.editor.trumbowyg("html", ctrl.content);
      };

      ctrl.emitEvent = (event) => {
        const attr = $attrs.$normalize(`on-${event}`);
        if (angular.isFunction(this[attr])) {
          $scope.$applyAsync(() => this[attr]());
        }
      };

      ctrl.updateModelValue = () => {
        $scope.$applyAsync(() => {
          const value = ctrl.editor.trumbowyg("html");
          ctrl.content = value;
        });
      };
    },
  ],
});
