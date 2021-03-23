"use strict";
appShared.factory("CryptoService", [
  "ngAppSettings",
  function (ngAppSettings) {
    var factory = {};
    //size: 128 / 192 / 256
    var size = 256;

    var _encryptAES = function (message, iCompleteEncodedKey = null) {
      var key, iv;
      if (iCompleteEncodedKey) {
        var keys = _parseKeys(iCompleteEncodedKey);
        key = keys.key;
        iv = keys.iv;
      } else {
        key = CryptoJS.enc.Utf8.parse(ngAppSettings.encryptKey);
        iv = CryptoJS.enc.Utf8.parse(ngAppSettings.encryptIV);
      }
      return _encryptMessage(message, key, iv);
    };

    var _decryptAES = function (ciphertext, iCompleteEncodedKey = null) {
      var key, iv;
      if (iCompleteEncodedKey) {
        var keys = _parseKeys(iCompleteEncodedKey);
        key = keys.key;
        iv = keys.iv;
      } else {
        key = CryptoJS.enc.Utf8.parse(ngAppSettings.encryptKey);
        iv = CryptoJS.enc.Utf8.parse(ngAppSettings.encryptIV);
      }
      return _decryptMessage(ciphertext, key, iv);
    };

    var _decryptMessage = function (ciphertext, key, iv) {
      var cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(ciphertext),
      });
      var options = {
        iv: iv,
        keySize: size / 8,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      };
      var decrypted = CryptoJS.AES.decrypt(cipherParams, key, options);
      return decrypted.toString(CryptoJS.enc.Utf8);
    };

    var _encryptMessage = function (message, key, iv) {
      var options = {
        iv: iv,
        keySize: size / 8,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      };
      var encrypted = CryptoJS.AES.encrypt(message, key, options);
      return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    };

    var _parseKeys = function (iCompleteEncodedKey) {
      var keyStrings = CryptoJS.enc.Utf8.stringify(
        CryptoJS.enc.Base64.parse(iCompleteEncodedKey)
      ).split(",");
      return {
        iv: CryptoJS.enc.Base64.parse(keyStrings[0]),
        key: CryptoJS.enc.Base64.parse(keyStrings[1]),
      };
    };

    factory.encryptAES = _encryptAES;
    factory.decryptAES = _decryptAES;
    return factory;
  },
]);
