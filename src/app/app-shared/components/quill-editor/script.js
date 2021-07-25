sharedComponents.component("quillEditor", {
  templateUrl: "/mix-app/views/app-shared/components/quill-editor/view.html",
  controller: [
    "$rootScope",
    "$scope",
    "$element",
    "ngAppSettings",
    function ($rootScope, $scope, $element, ngAppSettings) {
      var ctrl = this;
      ctrl.previousId = null;
      ctrl.editor = null;
      ctrl.init = function () {
        if (ctrl.content == undefined) {
          ctrl.content = "";
        }
        ctrl.guid = $rootScope.generateUUID();
        setTimeout(() => {
          var toolbarOptions = {
            container: [
              ["bold", "italic", "underline", "strike"], // toggled buttons
              ["blockquote", "image", "link", "code-block"],

              [{ header: 1 }, { header: 2 }], // custom button values
              [{ list: "ordered" }, { list: "bullet" }],
              [{ script: "sub" }, { script: "super" }], // superscript/subscript
              [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
              [{ direction: "rtl" }], // text direction

              [{ size: ["small", false, "large", "huge"] }], // custom dropdown
              [{ header: [1, 2, 3, 4, 5, 6, false] }],

              [{ color: [] }, { background: [] }], // dropdown with defaults from theme
              [{ font: [] }],
              [{ align: [] }],

              ["clean"], // remove formatting button
            ],
            handlers: {
              // handlers object will be merged with default handlers object
              link: function (value) {
                if (value) {
                  var href = prompt("Enter the URL");
                  this.quill.format("link", href);
                } else {
                  this.quill.format("link", false);
                }
              },
              image: function () {
                var range = this.quill.getSelection();
                var value = prompt("Enter the image URL");
                this.quill.insertEmbed(
                  range.index,
                  "image",
                  value,
                  Quill.sources.USER
                );
              },
            },
          };

          ctrl.editor = new Quill("#quill-editor-" + ctrl.guid, {
            modules: {
              toolbar: toolbarOptions,
              imageResize: {},
            },
            placeholder: "Compose an epic...",
            theme: "snow",
          });

          // Init content
          ctrl.editor.clipboard.dangerouslyPasteHTML(0, ctrl.content);

          ctrl.editor.on("text-change", function (delta, oldDelta, source) {
            if (source == "api") {
              console.log("An API call triggered this change.");
            } else if (source == "user") {
              console.log("A user action triggered this change.");
            }
            ctrl.updateContent();
          });
        });
      };
      window.fsClick = function () {
        $(".quill-editor-defaultUI").toggleClass("fs");
      };
      ctrl.updateContent = function () {
        // ctrl.content = JSON.stringify(ctrl.editor.getContents());
        ctrl.content = ctrl.editor.root.innerHTML;
        $scope.$apply();
        // console.log(ctrl.content);
      };
    },
  ],
  bindings: {
    content: "=",
  },
});
