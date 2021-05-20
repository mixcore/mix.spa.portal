modules.component("funding", {
  templateUrl: "/mix-app/views/app-portal/components/funding/view.html",
  controller: [
    "$rootScope",
    "$http",
    function ($rootScope, $http) {
      var ctrl = this;
      ctrl.items = [
        {
          title: "opencollective.com/mixcore",
          href: "https://opencollective.com/mixcore",
          logo:
            "https://github.githubassets.com/images/modules/site/icons/funding_platforms/open_collective.svg",
        },
        {
          title: "funding.communitybridge.org/projects/mixcore",
          href: "https://crowdfunding.lfx.linuxfoundation.org/projects/mixcore",
          logo:
            "https://github.githubassets.com/images/modules/site/icons/funding_platforms/community_bridge.svg",
        },
        {
          title: "patreon.com/mixcore",
          href: "https://www.patreon.com/mixcore/creators",
          logo:
            "https://github.githubassets.com/images/modules/site/icons/funding_platforms/patreon.svg",
        },
        {
          title: "paypalme/mixcore",
          href: "https://www.paypal.me/mixcore",
          logo: "/mix-app/assets/img/svg/heart.svg",
        },
        {
          title: "buymeacoffee.com/mixcore",
          href: "https://www.buymeacoffee.com/mixcore",
          logo: "/mix-app/assets/img/svg/heart.svg",
        },
      ];
      ctrl.init = function () {};
    },
  ],
  bindings: {},
});
