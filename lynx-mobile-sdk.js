(function (window) {
  function lynxMobile() {

    var _retval = {};
    var handlers = {};
    _retval.handlers = handlers;

    function parseJSON(json) {
      if (typeof json === 'object' && json !== null) {
        return json;
      } else {
        var parsed;
        try {
          parsed = JSON.parse(json)
        } catch (e) { }
        return parsed || json;
      }
    }

    ///////////////////////////////////////////
    // Private functions. DO NOT CALL FROM WEB
    // These are used by the native app
    ///////////////////////////////////////////

    // PRIVATE
    _retval.setAccount = function (success, result) {

      var parsedResult = parseJSON(result);

      if (this.handlers.hasOwnProperty('setAccount')) {
        if (success && typeof parsedResult !== 'undefined') {
          this.handlers["setAccount"].resolve(parsedResult);
        } else {
          this.handlers["setAccount"].reject(new Error('There was a problem fetching Account'));
        }
        delete this.handlers["setAccount"];
      }

    };

    // PRIVATE
    _retval.setAccountName = function (accountName) {

      if (this.handlers.hasOwnProperty('setAccountName')) {
        if (typeof accountName == "string" || accountName instanceof String) {
          this.handlers["setAccountName"].resolve(accountName);
        } else {
          this.handlers["setAccountName"].reject(new Error('There was a problem fetching Account Name'));
        }
        delete this.handlers["setAccountName"];
      }

    };

    // PRIVATE
    _retval.transactionResult = function (success, result) {

      var parsedResult = parseJSON(result);

      if (this.handlers.hasOwnProperty('transactionResult')) {
        if (success && typeof parsedResult !== 'undefined') {
          this.handlers["transactionResult"].resolve(parsedResult);
        } else if (!success && typeof parsedResult !== 'undefined') {
          this.handlers["transactionResult"].reject(parsedResult);
        } else {
          this.handlers["transactionResult"].reject(new Error('Transaction was cancelled or there was a problem'));
        }
        delete this.handlers["transactionResult"];
      }

    };

    // PRIVATE
    _retval.signatureResult = function (success, result) {

      var parsedResult = parseJSON(result);

      if (this.handlers.hasOwnProperty('signatureResult')) {
        if (success && typeof parsedResult !== 'undefined') {
          this.handlers["signatureResult"].resolve(parsedResult);
        } else if (!success && typeof parsedResult !== 'undefined') {
          this.handlers["signatureResult"].reject(parsedResult);
        } else {
          this.handlers["signatureResult"].reject(new Error('Signature request was cancelled or there was a problem'));
        }
        delete this.handlers["signatureResult"];
      }

    };

    // PRIVATE
    _retval.arbitrarySignatureResult = function (success, result) {

      if (this.handlers.hasOwnProperty('arbitrarySignatureResult')) {
        if (success && typeof result == "string" || result instanceof String) {
          this.handlers["arbitrarySignatureResult"].resolve(result);
        } else if (!success && typeof result == "string" || result instanceof String) {
          this.handlers["arbitrarySignatureResult"].reject(new Error(result));
        } else {
          this.handlers["arbitrarySignatureResult"].reject(new Error('There was an error providing signature'));
        }
        delete this.handlers["arbitrarySignatureResult"];
      }

    };

    ///////////////////////////////////////////
    // Public functions. These are to be called
    // by your web application
    ///////////////////////////////////////////

    // PUBLIC
    _retval.eosTransfer = function (data) {

      return new Promise((resolve, reject) => {

        this.handlers["transactionResult"] = { resolve, reject };

        switch (navigator.userAgent) {
          case "EOSLynx IOS":
            window.webkit.messageHandlers.eosTransfer.postMessage(JSON.stringify(data));
            break;
          case "EOSLynx Android":
            window.android.eosTransfer(JSON.stringify(data) || "");
            break;
          case "EOSLynx Desktop":
            // ADD FUNCTION CALL TO DESKTOP
            break;
        }

      });

    };

    // PUBLIC
    _retval.transfer = function (data) {
      return new Promise((resolve, reject) => {

        this.handlers["transactionResult"] = { resolve, reject };

        switch (navigator.userAgent) {
          case "EOSLynx IOS":
            window.webkit.messageHandlers.transfer.postMessage(JSON.stringify(data));
            break;
          case "EOSLynx Android":
            window.android.transfer(JSON.stringify(data) || "");
            break;
          case "EOSLynx Desktop":
            // ADD FUNCTION CALL TO DESKTOP
            break;
        }

      });
    };

    // PUBLIC
    _retval.transact = function (data) {
      return new Promise((resolve, reject) => {

        let modifiedData = data;

        if (typeof data === 'object' && data.constructor === Array) {
          modifiedData = { actions: data };
        } else if (typeof data === undefined || typeof data !== 'object' && data.constructor !== Object) {
          reject(new Error('First argument not an object'));
        }

        this.handlers["transactionResult"] = { resolve, reject };

        switch (navigator.userAgent) {
          case "EOSLynx IOS":
            window.webkit.messageHandlers.transact.postMessage(JSON.stringify(modifiedData));
            break;
          case "EOSLynx Android":
            window.android.transact(JSON.stringify(modifiedData) || "");
            break;
          case "EOSLynx Desktop":
            // ADD FUNCTION CALL TO DESKTOP
            break;
        }

      });
    };

    // PUBLIC
    _retval.requestSetAccountName = function () {
      return new Promise((resolve, reject) => {

        this.handlers["setAccountName"] = { resolve, reject };

        switch (navigator.userAgent) {
          case "EOSLynx IOS":
            window.webkit.messageHandlers.requestSetAccountName.postMessage(null);
            break;
          case "EOSLynx Android":
            window.android.requestSetAccountName("");
            break;
          case "EOSLynx Desktop":
            // ADD FUNCTION CALL TO DESKTOP
            break;
        }

      });
    };

    // PUBLIC
    _retval.requestSetAccount = function (data) {
      return new Promise((resolve, reject) => {

        this.handlers["setAccount"] = { resolve, reject };

        switch (navigator.userAgent) {
          case "EOSLynx IOS":
            window.webkit.messageHandlers.requestSetAccount.postMessage(data);
            break;
          case "EOSLynx Android":
            window.android.requestSetAccount(data || "");
            break;
          case "EOSLynx Desktop":
            // ADD FUNCTION CALL TO DESKTOP
            break;
        }

      });
    };

    // PUBLIC
    _retval.requestArbitrarySignature = function (data) {
      return new Promise((resolve, reject) => {

        if (typeof data === undefined || typeof data !== 'object' && data.constructor !== Object) {
          reject(new Error('Argument not an object. Expected { data: string, whatFor: string}'));
        }

        this.handlers["arbitrarySignatureResult"] = { resolve, reject };

        switch (navigator.userAgent) {
          case "EOSLynx IOS":
            window.webkit.messageHandlers.requestArbitrarySignature.postMessage(JSON.stringify(data));
            break;
          case "EOSLynx Android":
            window.android.requestArbitrarySignature(JSON.stringify(data) || "");
            break;
          case "EOSLynx Desktop":
            // ADD FUNCTION CALL TO DESKTOP
            break;
        }

      });
    };

    // PUBLIC
    _retval.requestSignature = function (data) {
      return new Promise((resolve, reject) => {

        if (typeof data === undefined || typeof data !== 'object' && data.constructor !== Object) {
          reject(new Error('Argument not an object. Expected deserialized transaction'));
        }

        if (data.hasOwnProperty("serializedTransaction")) {
          reject(new Error('Signing serialized transactions not supported yet. Please pass deserialized transaction.'));
        }

        this.handlers["signatureResult"] = { resolve, reject };

        switch (navigator.userAgent) {
          case "EOSLynx IOS":
            window.webkit.messageHandlers.requestSignature.postMessage(JSON.stringify(data));
            break;
          case "EOSLynx Android":
            window.android.requestSignature(JSON.stringify(data) || "");
            break;
          case "EOSLynx Desktop":
            // ADD FUNCTION CALL TO DESKTOP
            break;
        }

      });
    };

    return _retval;
  }

  if (typeof window.lynxMobile === "undefined") {

    window.lynxMobile = lynxMobile();

    switch (navigator.userAgent) {
      case "EOSLynx IOS":

        setTimeout(function () {
          window.dispatchEvent(new CustomEvent("lynxMobileLoaded"));
          console.log("LynxMobile Loaded");
        }, 300);

        break;

      case "EOSLynx Android":
      case "EOSLynx Desktop":

        window.dispatchEvent(new CustomEvent("lynxMobileLoaded"));
        console.log("LynxMobile Loaded");

        break;
    }

  }

})(window);