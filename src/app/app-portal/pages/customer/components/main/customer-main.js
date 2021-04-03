app.component("customerMain", {
  templateUrl:
    "/mix-app/views/app-portal/pages/customer/components/main/customer-main.html",
  bindings: {
    customer: "=",
    onDelete: "&",
    onUpdate: "&",
  },
});
