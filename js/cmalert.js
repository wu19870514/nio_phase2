var isFunction = (function () { return "object" === typeof document.getElementById ? isFunction = function (fn) { try { return /^\s*\bfunction\b/.test("" + fn); } catch (x) { return false } } : isFunction = function (fn) { return "[object Function]" === Object.prototype.toString.call(fn); }; })();
var alertCallback = null, alertArgs = null;

function cmalert(mess, hidebutton, callback, args) {
    alertCallback = callback;
    alertArgs = args;
    if (hidebutton === true)
        $('body').append('<section class="m-alert nobtn"><div class="m-abs d-albg"><div class="d-altxt hmiddle"><div class="subwrap"><div class="content">' + mess + '</div></div></div></div></section>');
    else
        $('body').append('<section class="m-alert"><div class="m-abs d-albg"><div class="d-altxt hmiddle"><div class="subwrap"><div class="content">' + mess + '</div></div></div><div class="m-abs d-albutton" onclick="alertclose()">知道了</div></div></section>');
    $('.m-alert').fadeIn();
}
function alertclose() {
    $('.m-alert').fadeOut('normal', function () {
        $('.m-alert').remove();
    });
    isFunction(alertCallback) && alertCallback(alertArgs);
}