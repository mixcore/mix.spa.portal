sharedComponents.component("tags", {
  templateUrl: "/mix-app/views/app-shared/components/tags/tags.html",
  controller: [
    "$scope",
    function ($scope) {
      var ctrl = this;
    },
  ],
  bindings: {
    input: "=",
  },
});
