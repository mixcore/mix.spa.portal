!(function (t) {
  var e = {};
  function i(n) {
    if (e[n]) return e[n].exports;
    var s = (e[n] = { i: n, l: !1, exports: {} });
    return t[n].call(s.exports, s, s.exports, i), (s.l = !0), s.exports;
  }
  (i.m = t),
    (i.c = e),
    (i.d = function (t, e, n) {
      i.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: n });
    }),
    (i.r = function (t) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(t, "__esModule", { value: !0 });
    }),
    (i.t = function (t, e) {
      if ((1 & e && (t = i(t)), 8 & e)) return t;
      if (4 & e && "object" == typeof t && t && t.__esModule) return t;
      var n = Object.create(null);
      if (
        (i.r(n),
        Object.defineProperty(n, "default", { enumerable: !0, value: t }),
        2 & e && "string" != typeof t)
      )
        for (var s in t)
          i.d(
            n,
            s,
            function (e) {
              return t[e];
            }.bind(null, s)
          );
      return n;
    }),
    (i.n = function (t) {
      var e =
        t && t.__esModule
          ? function () {
              return t.default;
            }
          : function () {
              return t;
            };
      return i.d(e, "a", e), e;
    }),
    (i.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }),
    (i.p = ""),
    i((i.s = 40));
})({
  40: function (t, e) {
    gapi.analytics.ready(function () {
      gapi.analytics.createComponent("ActiveUsers", {
        initialize: function () {
          (this.activeUsers = 0),
            gapi.analytics.auth.once("signOut", this.handleSignOut_.bind(this));
        },
        execute: function () {
          this.polling_ && this.stop(),
            this.render_(),
            gapi.analytics.auth.isAuthorized()
              ? this.pollActiveUsers_()
              : gapi.analytics.auth.once(
                  "signIn",
                  this.pollActiveUsers_.bind(this)
                );
        },
        stop: function () {
          clearTimeout(this.timeout_),
            (this.polling_ = !1),
            this.emit("stop", { activeUsers: this.activeUsers });
        },
        render_: function () {
          var t = this.get();
          (this.container =
            "string" == typeof t.container
              ? document.getElementById(t.container)
              : t.container),
            (this.container.innerHTML = t.template || this.template),
            (this.container.querySelector("b").innerHTML = this.activeUsers);
        },
        pollActiveUsers_: function () {
          var t = this.get(),
            e = 1e3 * (t.pollingInterval || 5);
          if (isNaN(e) || e < 5e3)
            throw new Error("Frequency must be 5 seconds or more.");
          (this.polling_ = !0),
            gapi.client.analytics.data.realtime
              .get({ ids: t.ids, metrics: "rt:activeUsers" })
              .then(
                function (t) {
                  var i = t.result,
                    n = i.totalResults ? +i.rows[0][0] : 0,
                    s = this.activeUsers;
                  this.emit("success", { activeUsers: this.activeUsers }),
                    n != s && ((this.activeUsers = n), this.onChange_(n - s)),
                    1 == this.polling_ &&
                      (this.timeout_ = setTimeout(
                        this.pollActiveUsers_.bind(this),
                        e
                      ));
                }.bind(this)
              );
        },
        onChange_: function (t) {
          var e = this.container.querySelector("b");
          e && (e.innerHTML = this.activeUsers),
            this.emit("change", { activeUsers: this.activeUsers, delta: t }),
            t > 0
              ? this.emit("increase", {
                  activeUsers: this.activeUsers,
                  delta: t,
                })
              : this.emit("decrease", {
                  activeUsers: this.activeUsers,
                  delta: t,
                });
        },
        handleSignOut_: function () {
          this.stop(),
            gapi.analytics.auth.once("signIn", this.handleSignIn_.bind(this));
        },
        handleSignIn_: function () {
          this.pollActiveUsers_(),
            gapi.analytics.auth.once("signOut", this.handleSignOut_.bind(this));
        },
        template:
          '<div class="ActiveUsers">Active Users: <b class="ActiveUsers-value"></b></div>',
      });
    });
  },
});
