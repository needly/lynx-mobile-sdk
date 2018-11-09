(function (window) {
    function lynxMobile() {

        var _retval = {};
        var handlers = {};
        _retval.handlers = handlers;

        function parseJSON(json) {
            var parsed;
            try {
                parsed = JSON.parse(json)
            } catch (e) { }
            return parsed;
        }

        ///////////////////////////////////////////
        // Private functions. DO NOT CALL FROM WEB
        // These are used by the native app
        ///////////////////////////////////////////

        // PRIVATE
        _retval.setAccount = function (success, result) {

            var parsedResult = parseJSON(result);

            var event = new CustomEvent("lynxMobileOnSetAccount", {
                detail: {
                    success: success,
                    result: (typeof parsedResult === 'undefined') ? result : parsedResult
                }
            });
            window.dispatchEvent(event);

            if (success && typeof parsedResult !== 'undefined') {
                this.handlers["setAccount"].resolve(parsedResult);
            } else {
                this.handlers["setAccount"].reject(new Error('There was a problem fetching Account'));
            }
            delete this.handlers["setAccount"];

        };

        // PRIVATE
        _retval.setAccountName = function (accountName) {

            if (typeof accountName == "string" || accountName instanceof String) {
                var event = new CustomEvent("lynxMobileOnSetAccountName", {
                    detail: {
                        accountName: accountName
                    }
                });
                window.dispatchEvent(event);
            }

            if (typeof accountName == "string" || accountName instanceof String) {
                this.handlers["setAccountName"].resolve(accountName);
            } else {
                this.handlers["setAccountName"].reject(new Error('There was a problem fetching Account Name'));
            }
            delete this.handlers["setAccountName"];

        };

        // PRIVATE
        _retval.transactionResult = function (success, result) {

            var parsedResult = parseJSON(result);

            var event = new CustomEvent("lynxMobileOnTransactionResult", {
                detail: {
                    success: success,
                    result: (typeof parsedResult === 'undefined') ? result : parsedResult
                }
            });
            window.dispatchEvent(event);

            if (success && typeof parsedResult !== 'undefined') {
                this.handlers["transactionResult"].resolve(parsedResult);
            } else if (!success && typeof parsedResult !== 'undefined') {
                this.handlers["transactionResult"].reject(parsedResult);
            } else {
                this.handlers["transactionResult"].reject(new Error('Transaction was cancelled or there was a problem'));
            }
            delete this.handlers["transactionResult"];
            
        };

        // PRIVATE
        _retval.arbitrarySignatureResult = function (success, result) {

            var event = new CustomEvent("lynxMobileOnArbitrarySignatureResult", {
                detail: {
                    success: success,
                    result: result
                }
            });
            window.dispatchEvent(event);

            if (success && typeof result == "string" || result instanceof String) {
                this.handlers["arbitrarySignatureResult"].resolve(result);
            } else if (!success && typeof result == "string" || result instanceof String) {
                this.handlers["arbitrarySignatureResult"].reject(new Error(result));
            } else {
                this.handlers["arbitrarySignatureResult"].reject(new Error('There was an error providing signature'));
            }
            delete this.handlers["arbitrarySignatureResult"];

        };

        ///////////////////////////////////////////
        // Public functions. These are to be called
        // by your web application
        ///////////////////////////////////////////

        // PUBLIC LISTENER
        _retval.listenOnSetAccount = function (callBack) {
            if (typeof callBack == "function") {
                var _func = function (e) {
                    callBack(e.detail);
                };
                window.removeEventListener("lynxMobileOnSetAccount", _func, false);
                window.addEventListener("lynxMobileOnSetAccount", _func, false);
            }
        };

        // PUBLIC LISTENER
        _retval.listenOnSetAccountName = function (callBack) {
            if (typeof callBack == "function") {
                var _func = function (e) {
                    callBack(e.detail);
                };
                window.removeEventListener("lynxMobileOnSetAccountName", _func, false);
                window.addEventListener("lynxMobileOnSetAccountName", _func, false);
            }
        };

        // PUBLIC LISTENER
        _retval.listenOnTransactionResult = function (callBack) {
            if (typeof callBack == "function") {
                var _func = function (e) {
                    callBack(e.detail);
                };
                window.removeEventListener("lynxMobileOnTransactionResult", _func);
                window.addEventListener("lynxMobileOnTransactionResult", _func);
            }
        };

        // PUBLIC LISTENER
        _retval.listenOnArbitrarySignatureResult = function (callBack) {
            if (typeof callBack == "function") {
                var _func = function (e) {
                    callBack(e.detail);
                };
                window.removeEventListener("lynxMobileOnArbitrarySignatureResult", _func);
                window.addEventListener("lynxMobileOnArbitrarySignatureResult", _func);
            }
        };

        // PUBLIC
        _retval.eosTransfer = function async (data) {

            return new Promise((resolve, reject) => {

                this.handlers["transactionResult"] = { resolve, reject };

                if (window.webkit) {
                    window.webkit.messageHandlers.eosTransfer.postMessage(JSON.stringify(data));
                } else if (window.android) {
                    window.android.eosTransfer(JSON.stringify(data) || "");
                }

            });

        };

        // PUBLIC
        _retval.transfer = function async (data) {
            return new Promise((resolve, reject) => {

                this.handlers["transactionResult"] = { resolve, reject };

                if (window.webkit) {
                    window.webkit.messageHandlers.transfer.postMessage(JSON.stringify(data));
                } else if (window.android) {
                    window.android.transfer(JSON.stringify(data) || "");
                }

            });
        };

        // PUBLIC
        _retval.transact = function async (data) {
            return new Promise((resolve, reject) => {

                this.handlers["transactionResult"] = { resolve, reject };

                if (window.webkit) {
                    window.webkit.messageHandlers.transact.postMessage(JSON.stringify(data));
                } else if (window.android) {
                    window.android.transact(JSON.stringify(data) || "");
                }

            });
        };

        // PUBLIC
        _retval.requestSetAccountName = function async () {
            return new Promise((resolve, reject) => {

                this.handlers["setAccountName"] = { resolve, reject };

                if (window.webkit) {
                    window.webkit.messageHandlers.requestSetAccountName.postMessage(null);
                } else if (window.android) {
                    window.android.requestSetAccountName("");
                }

            });
        };

        // PUBLIC
        _retval.requestSetAccount = function async (data) {
            return new Promise((resolve, reject) => {

                this.handlers["setAccount"] = { resolve, reject };

                if (window.webkit) {
                    window.webkit.messageHandlers.requestSetAccount.postMessage(data);
                } else if (window.android) {
                    window.android.requestSetAccount(data || "");
                }

            });
        };

        // PUBLIC
        _retval.requestArbitrarySignature = function async (data) {
            return new Promise((resolve, reject) => {

                this.handlers["arbitrarySignatureResult"] = { resolve, reject };

                if (window.webkit) {
                    window.webkit.messageHandlers.requestArbitrarySignature.postMessage(JSON.stringify(data));
                } else if (window.android) {
                    window.android.requestArbitrarySignature(JSON.stringify(data) || "");
                }

            });
        };

        return _retval;
    }

    if (typeof window.lynxMobile === "undefined") {
        
        window.lynxMobile = lynxMobile();

        if (window.webkit) {
            setTimeout(function(){ 
                window.dispatchEvent(new CustomEvent("lynxMobileLoaded"));
                console.log("LynxMobile Loaded");
            }, 300);
        } else {
            window.dispatchEvent(new CustomEvent("lynxMobileLoaded"));
            console.log("LynxMobile Loaded");
        }

    }
    
})(window);