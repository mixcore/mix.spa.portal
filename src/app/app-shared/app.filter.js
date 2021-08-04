"use strict";
appShared
  .filter("trim", trimString)
  .filter("utcToLocal", FilterUtcDate)
  .filter("utcToLocalTime", FilterUtcDateTime)
  .filter("phoneNumber", FilterPhoneNumber)
  .filter("money", FilterMoney)
  .filter("markdown", MarkdownToHtml)
  .filter("trustUrl", trustUrl)
  .filter("trustHtml", trustHtml)
  .constant("ngAppSettings", {
    serviceBase: "",
    clientId: "ngAuthApp",
    facebookAppId: "",
    request: {
      pageSize: "20",
      pageIndex: 0,
      status: "Published",
      orderBy: "CreatedDateTime",
      direction: "Desc",
      fromDate: null,
      toDate: null,
      keyword: "",
      key: "",
      query: "{}",
    },
    privacies: ["VND", "USD"],
    pageSizes: ["5", "10", "15", "20"],
    directions: [
      {
        value: "0",
        title: "Asc",
      },
      {
        value: "1",
        title: "Desc",
      },
    ],
    orders: [
      {
        value: "CreatedDateTime",
        title: "Created Date",
      },
      {
        value: "Priority",
        title: "Priority",
      },

      {
        value: "Title",
        title: "Title",
      },
    ],
    contentStatuses: ["Deleted", "Preview", "Published", "Draft", "Schedule"],
    dataTypes: [
      { title: "Custom", value: 0 },
      { title: "DateTime", value: 1 },
      { title: "Date", value: 2 },
      { title: "Time", value: 3 },
      { title: "Duration", value: 4 },
      { title: "PhoneNumber", value: 5 },
      { title: "Currency", value: 6 },
      { title: "Text", value: 7 },
      { title: "Html", value: 8 },
      { title: "MultilineText", value: 9 },
      { title: "EmailAddress", value: 10 },
      { title: "Password", value: 11 },
      { title: "Url", value: 12 },
      { title: "ImageUrl", value: 13 },
      { title: "CreditCard", value: 14 },
      { title: "PostalCode", value: 15 },
      { title: "Upload", value: 16 },
    ],
  });

function trustUrl($sce) {
  return (url) => $sce.trustAsResourceUrl(url);
}

function trustHtml($sce) {
  return (html) => $sce.trustAsHtml(html);
}

function MarkdownToHtml($filter) {
  return function (mdContent) {
    var converter = new showdown.Converter();
    return converter.makeHtml(mdContent);
  };
}

function trimString() {
  return function (content, length = 150) {
    return content.length > length
      ? `${content.substring(0, length)}...`
      : content;
  };
}

function FilterUtcDate($filter) {
  return function (utcDateString, format) {
    format = format || "MM.dd.yyyy - hh:mm:ss a";
    // return if input date is null or undefined
    if (!utcDateString) {
      return;
    }

    // append 'Z' to the date string to indicate UTC time if the timezone isn't already specified
    if (
      typeof utcDateString == "string" &&
      utcDateString.indexOf("Z") === -1 &&
      utcDateString.indexOf("+") === -1
    ) {
      utcDateString += "Z";
    }

    // convert and format date using the built in angularjs date filter
    return $filter("date")(utcDateString, format);
  };
}
function FilterUtcDateTime($filter) {
  return function (utcDateString, format) {
    format = format || "yyyy-MM-ddThh:mm";
    // return if input date is null or undefined
    if (!utcDateString) {
      return;
    }

    // append 'Z' to the date string to indicate UTC time if the timezone isn't already specified
    if (
      typeof utcDateString == "string" &&
      utcDateString.indexOf("Z") === -1 &&
      utcDateString.indexOf("+") === -1
    ) {
      utcDateString += "Z";
    }

    // convert and format date using the built in angularjs date filter
    return $filter("date")(utcDateString, format);
  };
}
function buildDropdown(trumbowyg) {
  var dropdown = [];

  $.each(trumbowyg.o.plugins.fontfamily.fontList, function (index, font) {
    trumbowyg.addBtnDef("fontfamily_" + index, {
      title:
        '<span style="font-family: ' +
        font.family +
        ';">' +
        font.name +
        "</span>",
      hasIcon: false,
      fn: function () {
        trumbowyg.execCmd("fontName", font.family, true);
      },
    });
    dropdown.push("fontfamily_" + index);
  });

  return dropdown;
}
function FilterPhoneNumber() {
  return function (phone) {
    return phone.replace(/^([0-9]{3})([0-9]{3})([0-9]{4,})$/, "($1) $2-$3");
  };
}

function FilterMoney() {
  return function (money) {
    if (money) {
      return money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }
  };
}
