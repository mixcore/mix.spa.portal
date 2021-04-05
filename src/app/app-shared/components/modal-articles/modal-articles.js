sharedComponents.component("modalPosts", {
  templateUrl:
    "/mix-app/views/app-shared/components/modal-posts/modal-posts.html",
  controller: "ModalPostController",
  bindings: {
    data: "=",
    childName: "=",
    canDrag: "=",
    editUrl: "=",
    columns: "=",
    onDelete: "&",
    onUpdateInfos: "&",
    onUpdateChildInfos: "&",
  },
});
