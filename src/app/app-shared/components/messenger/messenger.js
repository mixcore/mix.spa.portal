sharedComponents.component("messenger", {
  templateUrl: "/mix-app/views/app-shared/components/messenger/index.html",
  controller: "MessengerController",
  bindings: {
    message: "=",
  },
});
