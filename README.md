## Dev environment

### Working folder structure

```bash
mixcore
├─mix.core
├─mix.heart
├─mix.identity
└─mix.spa.portal
```

### Main Repositories

- [mix.core](https://github.com/mixcore/mix.core): The main project that run the CMS
- [mix.spa.portal](https://github.com/mixcore/mix.spa.portal): This is the Admin Portal SPA built with AngularJS

Ref:

- [mix.heart](https://github.com/mixcore/mix.heart): This is the heart framework library that powered by C# [Generic Methods](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/generics/generic-methods)

### **mix.core** Repository

:::note

Required ASP.Net Core knowledge.
For more information: https://docs.microsoft.com/en-us/aspnet/core/

:::

#### How to built & run:

```bash
cd mixcore

git clone https://github.com/mixcore/mix.core.git

cd mix.core\src\Mix.Cms.Web

# Make sure you installed the latest dotnet core v5 SDK
# from here https://dotnet.microsoft.com/download/dotnet-core
dotnet build
dotnet run
```

Now you can access the site via https://localhost:5001. For the first time the CMS will redirect you to the Setup screen. Ref: [Installation Section](/installation-install-mixcore)

:::info

If you can not see the Setup screen, try to check if the "mix.core\src\Mix.Cms.Web\appsettings.json" file is exist. Delete it then run again.

:::

#### Project main folders:

```bash
mix.core\src\Mix.Cms.Web\
├─Controllers # Default ASP.Net folder
├─MixContent
│  └─data
├─Models # Default ASP.Net folder
├─Views # Default ASP.Net folder
│  ├─Data
│  ├─Home
│  ├─Init
│  ├─Module
│  ├─Page
│  ├─Portal
│  ├─Post
│  ├─Security
│  ├─Shared
│  │  └─Templates # Contain all of the theme's templates
│  │     └─material-kit
│  └─Vue
└─wwwroot
   ├─mix-app # This folder contain all of the mix.spa.portal compiled files
   └─mix-content
      ├─assets # This folder contain all of the theme's assets (eg. js, img, css...)
      │  └─material-kit
      ├─exports
      ├─imports
      └─uploads
```

### **mix.spa.portal** Repository

:::note

Required AngularJS knowledge. For more information: https://angularjs.org. FYI, AngularJS framwork is just help us built the Admin Portal more fast and flexible. It is not related to mix.core server side or ASP.NET Core infrastructure. You still able to develop an admin portal with another trending framworks like Blazor, AngularIO, React, VueJS...

:::

#### How to built:

```bash
cd mixcore

git clone https://github.com/mixcore/mix.spa.portal.git

# install nodejs modules
npm i
npm install --global gulp-cli

# using gulp to build and export the portal front-end source
gulp build

# --> All of the front-end source will be exported to the following folder:
# ..\mixcore\mix.core\src\Mix.Cms.Web\wwwroot\mix-app
```

:::info

Latest source code always existing inside mix.core repository. If you did not changed anything, you don't needs to buid mix.spa.portal.

:::
