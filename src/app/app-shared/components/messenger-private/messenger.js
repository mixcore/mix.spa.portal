sharedComponents.component("messengerPrivate", {
  templateUrl:
    "/mix-app/views/app-shared/components/messenger-private/index.html",
  controller: "MessengerController",
  bindings: {
    message: "=",
    connectionId: "=",
  },
});
