/// <binding Clean='clean' />
"use strict";

var gulp = require("gulp"),
  rimraf = require("rimraf"),
  concat = require("gulp-concat"),
  cssmin = require("gulp-cssmin"),
  //fontmin = require("gulp-fontmin"),
  htmlmin = require("gulp-htmlmin"),
  removeHtmlComments = require("gulp-remove-html-comments"),
  header = require("gulp-header"),
  uglify = require("gulp-uglify-es").default;

var sass = require("gulp-sass");

sass.compiler = require("node-sass");

var uglifyjs = require("uglify-es"); // can be a git checkout
// or another module (such as `uglify-es` for ES6 support)

var composer = require("gulp-uglify/composer");
var pump = require("pump");

var minify = composer(uglifyjs, console);
var dest = "."; //For publish folder use "./bin/Release/PublishOutput/";
//C:\\Git\\GitHub\\Queen-Beauty\\QueenBeauty\\

var paths = {
  webroot: "./dist/Mix.Cms.Web/wwwroot/mix-app/", // Use for current repo dist
  //webroot: "../mix.core/src/Mix.Cms.Web/wwwroot/mix-app/", // Use for mix.core repo
  webapp: "./src/app/", //app
  libs: "./src/lib/",
  nodeModules: "./node_modules/",
  scriptLib: "./src/lib/", //app
  styleLib: "./src/lib/", //app
  jsObtions: {},
  htmlOptions: {
    collapseWhitespace: true,
  },
  cssOptions: {}, //showLog : (True, false) to trun on or off of the log
  fontOptions: {
    fontPath: dest + "/wwwroot/fonts",
  },
};
var browserSync = require("browser-sync").create();

/////////////////////// INITITAL ///////////////////////////

paths.initApp = {
  src: [
    // `${paths.nodeModules}jquery/dist/jquery.min.js`,
    paths.webapp + "app-init/app.js",
    paths.webapp + "app-init/app.route.js",
    paths.webapp + "app-init/pages/**/*.js",
  ],
  dest: paths.webroot + "js/app-init.min.js",
};

/////////////////////// SECURITY ///////////////////////////

paths.securityApp = {
  src: [
    paths.webapp + "app-security/app.js",
    paths.webapp + "app-security/app.route.js",
    paths.webapp + "app-security/pages/**/*.js",
  ],
  dest: paths.webroot + "js/app-security.min.js",
};

/////////////////////// CLIENT ///////////////////////////

paths.clientApp = {
  src: [
    paths.webapp + "app-client/app.js",
    paths.webapp + "app-client/app-client-controller.js",
    paths.webapp + "app-client/components/**/*.js",
  ],
  dest: paths.webroot + "js/app-client.min.js",
};

paths.clientAppRequired = {
  src: [paths.webapp + "app-client/shared/**/*.js"],
  dest: paths.webroot + "js/app-client-required.min.js",
};

paths.sharedApp = {
  src: [
    paths.webapp + "app-shared/**/*.js",
    paths.webapp + "app-shared/**/*.*.js",
    `${paths.nodeModules}/html2canvas/dist/html2canvas.min.js`,
  ],
  dest: paths.webroot + "js/app-shared.min.js",
};

paths.framework = {
  src: [
    `${paths.nodeModules}angular/angular.min.js`,
    `${paths.nodeModules}angular-route/angular-route.min.js`,
    `${paths.nodeModules}angular-animate/angular-animate.min.js`,
    `${paths.nodeModules}angular-sanitize/angular-sanitize.min.js`,
    `${paths.nodeModules}angular-aria/angular-aria.min.js`,
    `${paths.nodeModules}angular-messages/angular-messages.min.js`,
    `${paths.nodeModules}angular-ui-bootstrap/dist/ui-bootstrap-tpls.js`,
    `${paths.nodeModules}angular-local-storage/dist/angular-local-storage.min.js`,
    `${paths.scriptLib}angularjs/**/*.min.js`,
    // `${paths.scriptLib}lazysizes-5.2.0/lazysizes.min.js`,
    // `${paths.scriptLib}clipboard.js-2.0.4/clipboard.min.js`
  ],
  dest: paths.webroot + "js/framework.min.js",
};

paths.shared = {
  src: [
    paths.scriptLib + "shared/**/*.js",
    paths.scriptLib + "shared/**/*.*.js",
  ],
  dest: paths.webroot + "js/shared.min.js",
};

gulp.task("min:initApp", function (cb) {
  return (
    gulp
      .src(paths.initApp.src, {
        base: ".",
      })
      .pipe(concat(paths.initApp.dest))
      //.pipe(uglify())
      //.pipe(minify(paths.jsOptions))
      .pipe(gulp.dest(dest))
  );
});

gulp.task("min:securityApp", function (cb) {
  return (
    gulp
      .src(paths.securityApp.src, {
        base: ".",
      })
      .pipe(concat(paths.securityApp.dest))
      //.pipe(uglify())
      //.pipe(minify(paths.jsOptions))
      .pipe(gulp.dest(dest))
  );
});

gulp.task("min:clientApp", function (cb) {
  return (
    gulp
      .src(paths.clientApp.src, {
        base: ".",
      })
      .pipe(concat(paths.clientApp.dest))
      //.pipe(uglify())
      //.pipe(minify(paths.jsOptions))
      .pipe(gulp.dest(dest))
  );
});

gulp.task("min:clientAppRequired", function (cb) {
  return gulp
    .src(paths.clientAppRequired.src, {
      base: ".",
    })
    .pipe(concat(paths.clientAppRequired.dest))
    .pipe(uglify())
    .pipe(minify(paths.jsOptions))
    .pipe(gulp.dest(dest));
});

gulp.task("min:sharedApp", function (cb) {
  return (
    gulp
      .src(paths.sharedApp.src, {
        base: ".",
      })
      .pipe(concat(paths.sharedApp.dest))
      //.pipe(uglify())
      //.pipe(minify(paths.jsOptions))
      .pipe(gulp.dest(dest))
  );
});

gulp.task("min:framework", function (cb) {
  return gulp
    .src(paths.framework.src, {
      base: ".",
    })
    .pipe(concat(paths.framework.dest))
    .pipe(minify(paths.jsOptions))
    .pipe(gulp.dest(dest));
});

gulp.task("min:shared", function (cb) {
  return gulp
    .src(paths.shared.src, {
      base: ".",
    })
    .pipe(concat(paths.shared.dest))
    .pipe(minify(paths.jsOptions))
    .pipe(gulp.dest(dest));
});

paths.appCss = {
  src: [
    paths.webapp + "app-shared/**/*.css",
    paths.webapp + "app-portal/**/*.css",
    paths.webapp + "app-security/**/*.css",
    paths.webapp + "app-init/**/*.css",
    paths.webroot + "css/app-vendor-scss.min.css",
    paths.styleLib + "**/*.css",
    `${paths.nodeModules}angular-ui-bootstrap/dist/ui-bootstrap-csp.css`,
  ],
  dest: paths.webroot + "css/app-vendor.min.css",
};

paths.scss = {
  src: [
    paths.webapp + "app-shared/**/*.scss",
    paths.webapp + "app-portal/**/*.scss",
    paths.webapp + "app-security/**/*.scss",
    paths.webapp + "app-init/**/*.scss",
  ],
  dest: paths.webroot + "css/app-vendor-scss.min.css",
};

paths.appClientCss = {
  src: [paths.webapp + "app-client/components/**/*.css"],
  dest: paths.webroot + "css/app-client.min.css",
};

gulp.task("min:appCss", function (cb) {
  return gulp
    .src(paths.appCss.src, {
      base: ".",
    })
    .pipe(concat(paths.appCss.dest))
    .pipe(cssmin(paths.appCssOptions))
    .pipe(header("/* " + Date() + " */"))
    .pipe(gulp.dest(dest));
});

gulp.task("min:scss", function (cb) {
  return gulp
    .src(paths.scss.src)
    .pipe(concat(paths.scss.dest))
    .pipe(sass().on("error", sass.logError))
    .pipe(header("/* " + Date() + " */"))
    .pipe(gulp.dest(dest));
});

gulp.task("min:appClientCss", function (cb) {
  return gulp
    .src(paths.appClientCss.src, {
      base: ".",
    })
    .pipe(concat(paths.appClientCss.dest))
    .pipe(cssmin(paths.appCssOptions))
    .pipe(header("/* " + Date() + " */"))
    .pipe(gulp.dest(dest));
});

paths.appInitCss = {
  src: [paths.webapp + "app-init/**/*.css"],
  dest: paths.webroot + "css/app-init.min.css",
};
gulp.task("min:appInitCss", function (cb) {
  return gulp
    .src(paths.appInitCss.src, {
      base: ".",
    })
    .pipe(concat(paths.appInitCss.dest))
    .pipe(cssmin(paths.appInitCss))
    .pipe(header("/* " + Date() + " */"))
    .pipe(gulp.dest(dest));
});

paths.sharedCss = {
  src: ["./src/lib/shared/**/*.css", "./src/lib/shared/**/*.*.css"],
  dest: paths.webroot + "css/shared.min.css",
};
gulp.task("min:sharedCss", function (cb) {
  return gulp
    .src(paths.sharedCss.src, {
      base: ".",
    })
    .pipe(concat(paths.sharedCss.dest))
    .pipe(cssmin(paths.appCssOptions))
    .pipe(header("/* " + Date() + " */"))
    .pipe(gulp.dest(dest));
});

////////////////////////////////////
//         CLEAN & MIN            //
////////////////////////////////////

// PORTAL ///////////////////////////
// VIEWS
paths.views = {
  src: [
    paths.webapp + "app-shared/**/*.html",
    paths.webapp + "app-portal/**/*.html",
    paths.webapp + "app-portal-odata/**/*.html",
    paths.webapp + "app-client/**/*.html",
    paths.webapp + "app-init/**/*.html",
    paths.webapp + "app-security/**/*.html",
  ],
  dest: paths.webroot + "views/",
};
gulp.task("clean:views", function (cb) {
  rimraf(paths.views.dest, cb);
});
gulp.task("min:views", function (cb) {
  return gulp
    .src(paths.views.src, {
      base: "./src/app/",
    })
    .pipe(htmlmin(paths.htmlOptions))
    .pipe(removeHtmlComments())
    .pipe(gulp.dest(paths.views.dest));
});

// JS
paths.appPortal = {
  src: [
    paths.webapp + "app-portal/app.js",
    paths.webapp + "app-portal/app-portal-controller.js",
    paths.webapp + "app-portal/app.route.js",
    paths.webapp + "app-portal/services/**/*.js",
    paths.webapp + "app-portal/pages/**/*.js",
    paths.webapp + "app-portal/components/**/*.js",
  ],
  dest: paths.webroot + "js/app-portal.min.js",
};
paths.appPortalRequired = {
  src: [
    `${paths.nodeModules}jquery/dist/jquery.min.js`,
    `${paths.nodeModules}bootstrap/dist/js/bootstrap.min.js`,
    `${paths.nodeModules}bootstrap-notify/bootstrap-notify.min.js`,
    paths.scriptLib + "portal/prism/prism.min.js",
    paths.scriptLib + "portal/Trumbowyg/**/*.*.js",
    paths.webapp + "app-portal/shared/**/*.js",
  ],
  dest: paths.webroot + "js/app-portal-required.min.js",
};

gulp.task("clean:portalApp", function (cb) {
  rimraf(paths.appPortal.dest, cb);
});
gulp.task("min:portalApp", function (cb) {
  return (
    gulp
      .src(paths.appPortal.src, {
        base: ".",
      })
      .pipe(concat(paths.appPortal.dest))
      .pipe(header("/* " + Date() + " */"))
      //.pipe(uglify())
      // .pipe(minify(paths.jsOptions))
      .pipe(gulp.dest(dest))
  );
});

gulp.task("clean:portalAppRequired", function (cb) {
  rimraf(paths.appPortalRequired.dest, cb);
});
gulp.task("min:portalAppRequired", function (cb) {
  return gulp
    .src(paths.appPortalRequired.src, {
      base: ".",
    })
    .pipe(concat(paths.appPortalRequired.dest))
    .pipe(uglify())
    .pipe(minify(paths.jsOptions))
    .pipe(header("/* " + Date() + " */"))
    .pipe(gulp.dest(dest));
});

// CSS
paths.portalCss = {
  src: [
    `${paths.nodeModules}bootstrap/dist/css/bootstrap.min.css`,
    paths.libs + "portal/**/*.css",
    paths.libs + "portal/**/*.*.css",
  ],
  dest: paths.webroot + "css/portal.min.css",
};
gulp.task("clean:portalCss", function (cb) {
  rimraf(paths.portalCss.dest, cb);
});
gulp.task("min:portalCss", function (cb) {
  return gulp
    .src(paths.portalCss.src, {
      base: ".",
    })
    .pipe(concat(paths.portalCss.dest))
    .pipe(cssmin(paths.appCssOptions))
    .pipe(header("/* " + Date() + " */"))
    .pipe(gulp.dest(dest));
});

gulp.task("clean:portalall", gulp.parallel("clean:views", "clean:portalCss"));

gulp.task(
  "build:portal",
  gulp.series("clean:portalall", "min:views", "min:portalCss")
);

/////////////////////////////////////////

gulp.task("clean:shared", function (cb) {
  rimraf(paths.shared.dest, cb);
});

gulp.task("clean:framework", function (cb) {
  rimraf(paths.framework.dest, cb);
});

gulp.task("clean:clientApp", function (cb) {
  rimraf(paths.clientApp.dest, cb);
});
gulp.task("clean:clientAppRequired", function (cb) {
  rimraf(paths.clientAppRequired.dest, cb);
});

gulp.task("clean:sharedApp", function (cb) {
  rimraf(paths.sharedApp.dest, cb);
});

gulp.task("clean:initApp", function (cb) {
  rimraf(paths.initApp.dest, cb);
});

gulp.task("clean:securityApp", function (cb) {
  rimraf(paths.securityApp.dest, cb);
});

gulp.task("clean:appCss", function (cb) {
  rimraf(paths.appCss.dest, cb);
});

gulp.task("clean:appInitCss", function (cb) {
  rimraf(paths.appInitCss.dest, cb);
});

gulp.task("clean:sharedCss", function (cb) {
  rimraf(paths.sharedCss.dest, cb);
});

gulp.task(
  "clean:css",
  gulp.series(
    "clean:appCss",
    "clean:appInitCss",
    "clean:portalCss",
    "clean:sharedCss"
  )
);
gulp.task(
  "clean:js",
  gulp.series(
    "clean:framework",
    "clean:shared",
    "clean:portalApp",
    "clean:portalAppRequired",
    "clean:clientApp",
    "clean:clientAppRequired",
    "clean:sharedApp",
    "clean:initApp",
    "clean:securityApp"
  )
);
gulp.task(
  "min:js",
  gulp.series(
    "min:portalApp",
    "min:portalAppRequired",
    "min:initApp",
    "min:securityApp",
    "min:clientApp",
    "min:clientAppRequired",
    "min:sharedApp",
    "min:shared",
    "min:framework"
  )
);
gulp.task(
  "min:css",
  gulp.series(
    "min:scss",
    "min:appCss",
    "min:appClientCss",
    "min:appInitCss",
    "min:portalCss",
    "min:sharedCss"
  )
);

////////////////////////////////////
//         BUILD & WATCH          //
////////////////////////////////////

gulp.task("build", gulp.series("clean:js", "min:js", "min:css", "min:views"));
gulp.task(
  "buildp",
  gulp.series(
    "min:portalApp",
    "min:scss",
    "min:appCss",
    "min:appClientCss",
    "min:portalCss",
    "min:views"
  )
);
gulp.task("watch", function () {
  gulp.watch("./src/app/**/**/*.html", gulp.series("min:views"));
  gulp.watch("./src/app/app-portal/**/*.js", gulp.series("min:portalApp"));
  gulp.watch(
    "./src/app/app-portal/shared/**/*.js",
    gulp.series("min:portalAppRequired")
  );
  gulp.watch("./src/lib/portal/**/*.js", gulp.series("min:portalAppRequired"));
  gulp.watch("./src/app/app-shared/**/*.js", gulp.series("min:sharedApp"));
  gulp.watch(
    "./src/app/app-client/**/*.js",
    gulp.series("min:clientApp", "min:clientAppRequired")
  );
  gulp.watch("./src/app/app-security/**/*.js", gulp.series("min:securityApp"));
  gulp.watch("./src/app/app-init/**/*.js", gulp.series("min:initApp"));
  gulp.watch("./src/app/app-/**/*.js", gulp.series("min:sharedApp"));
  gulp.watch("./src/lib/**/*.js", gulp.series("min:framework"));
  gulp.watch(
    "./src/app/**/**/*.css",
    gulp.series("min:scss", "min:appCss", "min:appClientCss", "min:appInitCss")
  );
  gulp.watch(
    "./src/app/**/**/*.scss",
    gulp.series("min:scss", "min:appCss", "min:appClientCss", "min:appInitCss")
  );
});

// [Watch Portal] View & Portal's js & CSS > gulp watch:html

gulp.task(
  "portalView-watch",
  gulp.series("min:views", function (done) {
    browserSync.reload();
    done();
  })
);

gulp.task(
  "portalJS-watch",
  gulp.series("clean:js", "min:js", function (done) {
    browserSync.reload();
    done();
  })
);

gulp.task(
  "portalCSS-watch",
  gulp.series("min:css", function (done) {
    browserSync.reload();
    done();
  })
);

gulp.task("serve", function () {
  browserSync.init({
    proxy: "https://localhost:5001/",
  });
  gulp.watch("./app/**/**/*.html", ["portalView-watch"]);
  gulp.watch("./app/**/**/*.js", ["portalJS-watch"]);
  gulp.watch("./app/**/**/*.css", ["portalCSS-watch"]);
  gulp.watch("./app/**/**/*.scss", ["portalCSS-watch"]);
});
