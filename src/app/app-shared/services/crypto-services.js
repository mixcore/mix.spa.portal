"use strict";
appShared.factory("CryptoService", [
  "ngAppSettings",
  function (ngAppSettings) {
    var factory = {};
    var size = 256;
    //size: 128 / 192 / 256
    var _encryptAES = function (message) {
      var key = CryptoJS.enc.Utf8.parse(ngAppSettings.encryptKey);
      var iv = CryptoJS.enc.Utf8.parse(ngAppSettings.encryptIV);
      var options = {
        iv: iv,
        keySize: size / 8,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      };
      var encrypted = CryptoJS.AES.encrypt(message, key, options);
      return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    };

    //size: 128 / 256 / 512
    var _decryptAES = function (ciphertext) {
      var key = CryptoJS.enc.Utf8.parse(ngAppSettings.encryptKey);
      var iv = CryptoJS.enc.Utf8.parse(ngAppSettings.encryptIV);
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

    factory.encryptAES = _encryptAES;
    factory.decryptAES = _decryptAES;
    return factory;
  },
]);
