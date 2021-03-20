"use strict";
appShared.factory("CryptoService", [
  "ngAppSettings",
  function (ngAppSettings) {
    var factory = {};
    var size = 128;
    //size: 128 / 256 / 512
    var _encryptSHA = function (message) {
      var key = _getKey(size);
      var options = {
        iv: key,
        keySize: size / 8,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      };
      var encrypted = CryptoJS.AES.encrypt(message, key, options);
      return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    };

    //size: 128 / 256 / 512
    var _decryptSHA = function (ciphertext) {
      var key = _getKey(size);
      var iv = _getKey(size);
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

    var _getKey = function () {
      return CryptoJS.enc.Utf8.parse(ngAppSettings.secretKey);
    };

    factory.encryptSHA = _encryptSHA;
    factory.decryptSHA = _decryptSHA;
    factory.getKey = _getKey;
    return factory;
  },
]);
