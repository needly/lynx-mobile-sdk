const AGENT_IOS = "EOSLynx IOS";
const AGENT_ANDROID = "EOSLynx Android";
const AGENT_DESKTOP = "EOSLynx Desktop";

(function (window) {
  function lynxMobile() {

    // promise handlers
    // these are also the names of the functions
    // that will need to be called back into on window
    // from ios,android or desktop
    const HANDLER_SET_ACCOUNT = "setAccount";
    const HANDLER_SET_ACCOUNT_NAME = "setAccountName";
    const HANDLER_TRANSACTION_RESULT = "transactionResult";
    const HANDLER_SIGNATURE_RESULT = "signatureResult";
    const HANDLER_ARBITRARY_RESULT = "arbitrarySignatureResult";

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

    var _retval = {};
    var handlers = {};
    _retval.handlers = handlers;

    ///////////////////////////////////////////
    // Private functions. DO NOT CALL FROM WEB
    // These are used by the native app
    ///////////////////////////////////////////

    // PRIVATE
    _retval.setAccount = function (success, result) {

      var parsedResult = parseJSON(result);

      if (this.handlers.hasOwnProperty(HANDLER_SET_ACCOUNT)) {
        if (success && typeof parsedResult !== 'undefined') {
          this.handlers[HANDLER_SET_ACCOUNT].resolve(parsedResult);
        } else {
          this.handlers[HANDLER_SET_ACCOUNT].reject(new Error('There was a problem fetching Account'));
        }
        delete this.handlers[HANDLER_SET_ACCOUNT];
      }

    };

    // PRIVATE
    _retval.setAccountName = function (accountName) {

      if (this.handlers.hasOwnProperty(HANDLER_SET_ACCOUNT_NAME)) {
        if (typeof accountName == "string" || accountName instanceof String) {
          this.handlers[HANDLER_SET_ACCOUNT_NAME].resolve(accountName);
        } else {
          this.handlers[HANDLER_SET_ACCOUNT_NAME].reject(new Error('There was a problem fetching Account Name'));
        }
        delete this.handlers[HANDLER_SET_ACCOUNT_NAME];
      }

    };

    // PRIVATE
    _retval.transactionResult = function (success, result) {

      var parsedResult = parseJSON(result);

      if (this.handlers.hasOwnProperty(HANDLER_TRANSACTION_RESULT)) {
        if (success && typeof parsedResult !== 'undefined') {
          this.handlers[HANDLER_TRANSACTION_RESULT].resolve(parsedResult);
        } else if (!success && typeof parsedResult !== 'undefined') {
          this.handlers[HANDLER_TRANSACTION_RESULT].reject(parsedResult);
        } else {
          this.handlers[HANDLER_TRANSACTION_RESULT].reject(new Error('Transaction was cancelled or there was a problem'));
        }
        delete this.handlers[HANDLER_TRANSACTION_RESULT];
      }

    };

    // PRIVATE
    _retval.signatureResult = function (success, result) {

      var parsedResult = parseJSON(result);

      if (this.handlers.hasOwnProperty(HANDLER_SIGNATURE_RESULT)) {
        if (success && typeof parsedResult !== 'undefined') {
          this.handlers[HANDLER_SIGNATURE_RESULT].resolve(parsedResult);
        } else if (!success && typeof parsedResult !== 'undefined') {
          this.handlers[HANDLER_SIGNATURE_RESULT].reject(parsedResult);
        } else {
          this.handlers[HANDLER_SIGNATURE_RESULT].reject(new Error('Signature request was cancelled or there was a problem'));
        }
        delete this.handlers[HANDLER_SIGNATURE_RESULT];
      }

    };

    // PRIVATE
    _retval.arbitrarySignatureResult = function (success, result) {

      if (this.handlers.hasOwnProperty(HANDLER_ARBITRARY_RESULT)) {
        if (success && typeof result == "string" || result instanceof String) {
          this.handlers[HANDLER_ARBITRARY_RESULT].resolve(result);
        } else if (!success && typeof result == "string" || result instanceof String) {
          this.handlers[HANDLER_ARBITRARY_RESULT].reject(new Error(result));
        } else {
          this.handlers[HANDLER_ARBITRARY_RESULT].reject(new Error('There was an error providing signature'));
        }
        delete this.handlers[HANDLER_ARBITRARY_RESULT];
      }

    };

    ///////////////////////////////////////////
    // Public functions. These are to be called
    // by your web application
    ///////////////////////////////////////////

    // PUBLIC
    _retval.eosTransfer = function (data) {

      return new Promise((resolve, reject) => {

        this.handlers[HANDLER_TRANSACTION_RESULT] = { resolve, reject };

        switch (navigator.userAgent) {
          case AGENT_IOS:
            window.webkit.messageHandlers.eosTransfer.postMessage(JSON.stringify(data));
            break;
          case AGENT_ANDROID:
            window.android.eosTransfer(JSON.stringify(data) || "");
            break;
          case AGENT_DESKTOP:
            // ADD FUNCTION CALL TO DESKTOP
            break;
        }

      });

    };

    // PUBLIC
    _retval.transfer = function (data) {
      return new Promise((resolve, reject) => {

        this.handlers[HANDLER_TRANSACTION_RESULT] = { resolve, reject };

        switch (navigator.userAgent) {
          case AGENT_IOS:
            window.webkit.messageHandlers.transfer.postMessage(JSON.stringify(data));
            break;
          case AGENT_ANDROID:
            window.android.transfer(JSON.stringify(data) || "");
            break;
          case AGENT_DESKTOP:
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

        this.handlers[HANDLER_TRANSACTION_RESULT] = { resolve, reject };

        switch (navigator.userAgent) {
          case AGENT_IOS:
            window.webkit.messageHandlers.transact.postMessage(JSON.stringify(modifiedData));
            break;
          case AGENT_ANDROID:
            window.android.transact(JSON.stringify(modifiedData) || "");
            break;
          case AGENT_DESKTOP:
            // ADD FUNCTION CALL TO DESKTOP
            break;
        }

      });
    };

    // PUBLIC
    _retval.requestSetAccountName = function () {
      return new Promise((resolve, reject) => {

        this.handlers[HANDLER_SET_ACCOUNT_NAME] = { resolve, reject };

        switch (navigator.userAgent) {
          case AGENT_IOS:
            window.webkit.messageHandlers.requestSetAccountName.postMessage(null);
            break;
          case AGENT_ANDROID:
            window.android.requestSetAccountName("");
            break;
          case AGENT_DESKTOP:
            // ADD FUNCTION CALL TO DESKTOP
            break;
        }

      });
    };

    // PUBLIC
    _retval.requestSetAccount = function (data) {
      return new Promise((resolve, reject) => {

        this.handlers[HANDLER_SET_ACCOUNT] = { resolve, reject };

        switch (navigator.userAgent) {
          case AGENT_IOS:
            window.webkit.messageHandlers.requestSetAccount.postMessage(data);
            break;
          case AGENT_ANDROID:
            window.android.requestSetAccount(data || "");
            break;
          case AGENT_DESKTOP:
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
          case AGENT_IOS:
            window.webkit.messageHandlers.requestArbitrarySignature.postMessage(JSON.stringify(data));
            break;
          case AGENT_ANDROID:
            window.android.requestArbitrarySignature(JSON.stringify(data) || "");
            break;
          case AGENT_DESKTOP:
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

        this.handlers[HANDLER_SIGNATURE_RESULT] = { resolve, reject };

        switch (navigator.userAgent) {
          case AGENT_IOS:
            window.webkit.messageHandlers.requestSignature.postMessage(JSON.stringify(data));
            break;
          case AGENT_ANDROID:
            window.android.requestSignature(JSON.stringify(data) || "");
            break;
          case AGENT_DESKTOP:
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
      case AGENT_IOS:

        setTimeout(function () {
          window.dispatchEvent(new CustomEvent("lynxMobileLoaded"));
          console.log("LynxMobile Loaded");
        }, 300);

        break;

      case AGENT_ANDROID:
      case AGENT_DESKTOP:

        window.dispatchEvent(new CustomEvent("lynxMobileLoaded"));
        console.log("LynxMobile Loaded");

        break;
    }

  }

})(window);