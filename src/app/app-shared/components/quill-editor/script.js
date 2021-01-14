﻿modules.component('quillEditor', {
    templateUrl: '/app/app-shared/components/quill-editor/view.html',
    controller: ['$rootScope', '$scope', '$element', 'ngAppSettings',
        function ($rootScope, $scope, $element, ngAppSettings) {
            var ctrl = this;
            ctrl.previousId = null;
            ctrl.editor = null;
            ctrl.init = function () {
                ctrl.guid = $rootScope.generateUUID();
                setTimeout(() => {

                    var toolbarOptions = [
                        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                        ['blockquote', 'code-block'],
                      
                        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                        [{ 'direction': 'rtl' }],                         // text direction
                      
                        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                      
                        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                        [{ 'font': [] }],
                        [{ 'align': [] }],
                      
                        ['clean']                                         // remove formatting button
                      ];

                    ctrl.editor = new Quill('#quill-editor-' + ctrl.guid, {
                        modules: {
                            toolbar: toolbarOptions
                        },
                        placeholder: 'Compose an epic...',
                        theme: 'snow'
                    });

                    // Init content
                    ctrl.editor.clipboard.dangerouslyPasteHTML(0, ctrl.content);

                    ctrl.editor.on('text-change', function (delta, oldDelta, source) {
                        if (source == 'api') {
                            console.log("An API call triggered this change.");
                        } else if (source == 'user') {
                            console.log("A user action triggered this change.");
                        }
                        ctrl.updateContent();
                    });


                }, 100);
            };
            window.fsClick = function () {
                $(".quill-editor-defaultUI").toggleClass("fs");
            };
            ctrl.updateContent = function () {
                // ctrl.content = JSON.stringify(ctrl.editor.getContents());
                ctrl.content = ctrl.editor.root.innerHTML;
                console.log(ctrl.content);
            };


        }
    ],
    bindings: {
        content: '='
    }
});