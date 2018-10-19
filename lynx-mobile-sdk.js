(function (window) {
    function lynxMobile() {

        var _retval = {};

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
        _retval.setAccountName = function (accountName) {
            if (typeof accountName == "string" || accountName instanceof String) {
                var event = new CustomEvent("lynxMobileOnSetAccountName", {
                    detail: {
                        accountName: accountName
                    }
                });
                window.dispatchEvent(event);
            }
        };

        // PRIVATE
        _retval.transactionResult = function (success, result) {
            var parsedResult = parseJSON(result);
            console.log(parsedResult);
            var event = new CustomEvent("lynxMobileOnTransactionResult", {
                detail: {
                    success: success,
                    result: (typeof parsedResult === 'undefined') ? result : parsedResult
                }
            });
            window.dispatchEvent(event);
        };

        ///////////////////////////////////////////
        // Public functions. These are to be called
        // by your web application
        ///////////////////////////////////////////

        // PUBLIC
        _retval.listenOnSetAccountName = function (callBack) {
            if (typeof callBack == "function") {
                var _func = function (e) {
                    callBack(e.detail);
                };
                window.removeEventListener("lynxMobileOnSetAccountName", _func, false);
                window.addEventListener("lynxMobileOnSetAccountName", _func, false);
            }
        };

        // PUBLIC
        _retval.listenOnTransactionResult = function (callBack) {
            if (typeof callBack == "function") {
                var _func = function (e) {
                    callBack(e.detail);
                };
                window.removeEventListener("lynxMobileOnTransactionResult", _func);
                window.addEventListener("lynxMobileOnTransactionResult", _func);
            }
        };

        // PUBLIC
        _retval.eosTransfer = function (data) {
            if (data) {
                if (window.webkit) {
                    window.webkit.messageHandlers.eosTransfer.postMessage(
                        JSON.stringify(data)
                    );
                } else if (window.android) {
                    window.android.eosTransfer(JSON.stringify(data));
                }
            }
        };

        // PUBLIC
        _retval.transfer = function (data) {
            if (data) {
                if (window.webkit) {
                    window.webkit.messageHandlers.transfer.postMessage(
                        JSON.stringify(data)
                    );
                } else if (window.android) {
                    window.android.transfer(JSON.stringify(data));
                }
            }
        };

        // PUBLIC
        _retval.requestSetAccountName = function () {
            if (window.webkit) {
                window.webkit.messageHandlers.requestSetAccountName.postMessage(null);
            } else if (window.android) {
                window.android.requestSetAccountName("");
            }
        };

        // PUBLIC
        _retval.transact = function (data) {
            if (data) {
                if (window.webkit) {
                    window.webkit.messageHandlers.transact.postMessage(
                        JSON.stringify(data)
                    );
                } else if (window.android) {
                    window.android.transact(JSON.stringify(data));
                }
            }
        };

        return _retval;
    }

    if (typeof window.lynxMobile === "undefined") {
        window.lynxMobile = lynxMobile();
        console.log("LynxMobile Initiated");
    }
    
})(window);