!function(s){var n;void 0===s.lynxMobile&&(s.lynxMobile=((n={setAccountName:function(n){if("string"==typeof n||n instanceof String){var e=new CustomEvent("lynxMobileOnSetAccountName",{detail:{accountName:n}});s.dispatchEvent(e)}}}).transactionResult=function(n,e){var t=function(n){var e;try{e=JSON.parse(n)}catch(n){}return e}(e);console.log(t);var i=new CustomEvent("lynxMobileOnTransactionResult",{detail:{success:n,result:void 0===t?e:t}});s.dispatchEvent(i)},n.listenOnSetAccountName=function(e){if("function"==typeof e){var n=function(n){e(n.detail)};s.removeEventListener("lynxMobileOnSetAccountName",n,!1),s.addEventListener("lynxMobileOnSetAccountName",n,!1)}},n.listenOnTransactionResult=function(e){if("function"==typeof e){var n=function(n){e(n.detail)};s.removeEventListener("lynxMobileOnTransactionResult",n),s.addEventListener("lynxMobileOnTransactionResult",n)}},n.eosTransfer=function(n){n&&(s.webkit?s.webkit.messageHandlers.eosTransfer.postMessage(JSON.stringify(n)):s.android&&s.android.eosTransfer(JSON.stringify(n)))},n.transfer=function(n){n&&(s.webkit?s.webkit.messageHandlers.transfer.postMessage(JSON.stringify(n)):s.android&&s.android.transfer(JSON.stringify(n)))},n.requestSetAccountName=function(){s.webkit?s.webkit.messageHandlers.requestSetAccountName.postMessage(null):s.android&&s.android.requestSetAccountName("")},n.transact=function(n){n&&(s.webkit?s.webkit.messageHandlers.transact.postMessage(JSON.stringify(n)):s.android&&s.android.transact(JSON.stringify(n)))},n),console.log("LynxMobile Initiated"))}(window);