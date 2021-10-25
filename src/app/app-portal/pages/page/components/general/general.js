app.component("pageGeneral", {
  templateUrl:
    "/mix-app/views/app-portal/pages/page/components/general/general.html",
  controller: function ($rootScope) {
    var ctrl = this;
    ctrl.isInRole = $rootScope.isInRole;
    ctrl.dataTypes = [
      {
        title: "String",
        value: "text",
      },
      {
        title: "Int",
        value: "int",
      },
      {
        title: "Image",
        value: "image",
      },
      {
        title: "Boolean",
        value: "boolean",
      },
    ];
    ctrl.configurations = {
      core: {},
      plugins: {
        btnsDef: {
          // Customizables dropdowns
          image: {
            dropdown: ["insertImage", "upload", "base64", "noembed"],
            ico: "insertImage",
          },
        },
        btns: [
          ["viewHTML"],
          ["undo", "redo"],
          ["formatting"],
          ["strong", "em", "del", "underline"],
          ["link"],
          ["image"],
          ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull"],
          ["unorderedList", "orderedList"],
          ["foreColor", "backColor"],
          ["preformatted"],
          ["horizontalRule"],
          ["fullscreen"],
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
        },
      },
    };
    ctrl.addProperty = function (type) {
      var i = $(".property").length;
      ctrl.page.properties.push({
        priority: 0,
        name: "",
        value: null,
        dataType: 0,
      });
    };
    ctrl.initEditor = function () {
      setTimeout(function () {
        // Init Code editor
        $.each($(".code-editor"), function (i, e) {
          var container = $(this);
          var editor = ace.edit(e);
          if (container.hasClass("json")) {
            editor.session.setMode("ace/mode/json");
          } else {
            editor.session.setMode("ace/mode/razor");
          }
          editor.setTheme("ace/theme/chrome");
          //editor.setReadOnly(true);

          editor.session.setUseWrapMode(true);
          editor.setOptions({
            maxLines: Infinity,
          });
          editor.getSession().on("change", function (e) {
            // e.type, etc
            $(container).parent().find(".code-content").val(editor.getValue());
          });
        });
        $.each($(".editor-content"), function (i, e) {
          var $demoTextarea = $(e);
          $demoTextarea.quill(ctrl.configurations.plugins);
        });
      }, 200);
    };
  },
  bindings: {
    page: "=",
    onDelete: "&",
    onUpdate: "&",
  },
});
