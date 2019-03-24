/**
 * Created by Administrator on 2017/4/19 0019.
 */

var submitting = false;
var apihost = "http://crm.foreo.cn/wechat/backend/index.php?s=";
var apicontroller = "api/Christmas/";
var jsApiParameters = {};
var orderid = 0;
var province, city, district, address, price, ordernum, status, code, nickname, buydate, usetime, storeid = 0;

var index = 1;

function loadingshow() { $("#page_loading").fadeIn(); }
function loadinghide() { $("#page_loading").fadeOut(); }

function validatemobile(mobile) 
{
    if(mobile.length==0)
    {
        return false; 
    }     
    if(mobile.length!=11) 
    {
        return false; 
    } 
    var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/; 
    if(!myreg.test(mobile)) 
    {
        return false; 
    }else{
        return true;
    }
}

function isNumber(str) {
    if (str.search(/^[0-9]{1,}$/) != -1) {
        return true;
    } else {
        return false;
    }
}

function utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}

function getcookie(name) {
    var ret = new RegExp('(?:^|[^;])' + name + '=([^;]+)').exec(document.cookie);
    return ret ? (ret[1]) : null;
}

// var isFunction = (function () { return "object" === typeof document.getElementById ? isFunction = function (fn) { try { return /^\s*\bfunction\b/.test("" + fn); } catch (x) { return false } } : isFunction = function (fn) { return "[object Function]" === Object.prototype.toString.call(fn); }; })();
// var alertCallback = null, alertArgs = null;

// function alert(mess, hidebutton, callback, args) {
//     alertCallback = callback;
//     alertArgs = args;
//     if (hidebutton === true)
//         $('body').append('<section class="m-alert nobtn"><div class="m-abs d-albg"><div class="d-altxt hmiddle"><div class="subwrap"><div class="content">' + mess + '</div></div></div></div></section>');
//     else
//         $('body').append('<section class="m-alert"><div class="m-abs d-albg"><div class="d-altxt hmiddle"><div class="subwrap"><div class="content">' + mess + '</div></div></div><div class="m-abs d-albutton" onclick="alertclose()">知道了</div></div></section>');
//     $('.m-alert').fadeIn();
// }
// function alertclose() {
//     $('.m-alert').fadeOut('normal', function () {
//         $('.m-alert').remove();
//     });
//     isFunction(alertCallback) && alertCallback(alertArgs);
// }

$(function () {
    $(stores).each(function(k,v){
        $("#city").append('<option value="'+v.province+'">'+v.province+'</option>');
    })

    $("#city").change(function(event) {
        $("#counter").html('<option value="">专柜</option>');
        $(stores).each(function(k,v){
            if($("#city").val() == v.province){
                $(v.counters).each(function(kk,vv){
                    $("#counter").append('<option value="'+vv.counter+'">'+vv.counter+'</option>');
                })
            }
        })
    });


    var isSent = false, sendTime = new Date().getTime() - 60 * 1000, sentTimer = null;
    $(".verify-code").click(function () {
        var mobile = $('#mobile').val();
        if (!mobile || !validatemobile(mobile)) {
            alert("手机号码不正确，请重新输入！");
            return;
        }
        if (!isSent && new Date().getTime() - sendTime > 60 * 1000) {
            isSent = true;
            sendTime = new Date().getTime();
            $(".verify-code").html("重新发送(60)");
            sentTimer = setInterval(function () {
                var sec = 60 - ~~((new Date().getTime() - sendTime) / 1000);
                if (sec > 0) {
                    $(".verify-code").html("重新发送(" + (sec) + ")");
                }
                else {
                    isSent = false;
                    clearInterval(sentTimer);
                    sentTimer = null;
                    $(".verify-code").html("重新发送");
                }
            }, 1000);
            $.ajax({
                url: apihost + "api/Mobileverify",
                type: "POST",
                async: true,
                cache: false,
                data: { mobile: mobile },
                dataType: "json",
                success: function (json) {
                    console.log(json);
                    if (json.code == 0) {
                        alert("验证码发送成功！");
                    }
                    else {
                        alert(json.msg);
                        clearInterval(sentTimer);
                        sentTimer = null;
                        sendTime = new Date().getTime() - 60 * 1000
                        isSent = false;
                        $(".verify-code").html("重新发送");
                    }
                },
                error: function () {
                    alert("验证码发送失败，请重试！");
                    clearInterval(sentTimer);
                    sentTimer = null;
                    sendTime = new Date().getTime() - 60 * 1000
                    isSent = false;
                    $(".verify-code").html("重新发送");
                }
            });
        }
    });


    $(".default .form-box .btn2").click(function () {
        var mobile = $('#mobile').val();
        var code = $('#code').val();
        var password = $('#password').val();
        var repassword = password;// $('#repassword').val();
        if (!mobile || !validatemobile(mobile)) {
            alert("手机号码不正确，请重新输入！");
            return;
        }
        if (!code || code.length != 6 || !isNumber(code)) {
            alert("验证码有误，请重新输入！");
            return;
        }
        if (!password || !repassword) {
            alert("请输入密码！");
            return;
        }
        if (password.length < 6) {
            alert("密码需要大于等于6位！");
            return;
        }
        if (password != repassword) {
            alert("两次输入的密码不一致！");
            return;
        }
        if (!submitting) {
            submitting = true;
            $.ajax({
                url: apihost + "api/User/Register",
                type: "POST",
                async: true,
                cache: false,
                data: { mobile: mobile, password: password, repassword: repassword, vcode: code, from: 2 },
                dataType: "json",
                success: function (json) {
                    if (json.code == 0) {
                        $.ajax({
                            url: apihost + apicontroller + "GetUserInfo",
                            type: "GET",
                            dataType: "json",
                            success: function (json) {
                                if(json.code == 1){

                                    $(".member img").attr("src",json.headimgurl);
                                    $(".member .nickname").html(json.nickname);
                                    $(".member .membercode").html("会员号：" + json.membercode);
                                }
                            }
                        });
                        $(".default").fadeOut();
                        draw();
                    }
                    else {
                            alert(json.msg);
                    }
                    submitting = false;
                },
                error: function () {
                    alert("注册失败，请重试！");
                    submitting = false;
                }
            });
        }
    });
})




var shareCallback = null;
var callbackShare = true;
var wxurl = 'http://crm.foreo.cn/wechat/201712/index.html';
var funLoadCallback = null;
var shareData = {
    title: "悦享圣诞 感恩回馈",
    link: wxurl,
    friendtitle: "悦享圣诞 感恩回馈",
    frienddesc: "凡购买过FOREO仪器产品的顾客，即可参与圣诞抽奖活动。",
    friendlink: wxurl,
    imgUrl: "http://crm.foreo.cn/wechat/201712/img/wx.jpg?" + Math.random()
};

function wxconfig(config, apilist, callback) {
    funLoadCallback = callback;
    if (!apilist) apilist = ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone", "scanQRCode"];
    if (config && config.appId && config.timestamp && config.nonceStr && config.signature) {
        wx.config({
            debug: false,
            appId: config.appId,
            timestamp: config.timestamp,
            nonceStr: config.nonceStr,
            signature: config.signature,
            jsApiList: apilist
        });
    } else {
        $.ajax({
            url: apihost + apicontroller + "Status",
            type: "POST",
            data: { url: location.href.split("#")[0] },
            async: true,
            cache: false,
            dataType: "json",
            success: function (data) {
                if (data && data.config) {
                    data = data.config;
                    if (data.appId && data.timestamp && data.nonceStr && data.signature) {
                        wx.config({
                            debug: false,
                            appId: data.appId,
                            timestamp: data.timestamp,
                            nonceStr: data.nonceStr,
                            signature: data.signature,
                            jsApiList: apilist
                        });
                    } else { }
                }
            },
            error: function (xhr, msg, exc) { }
        });
    }
}

function wxevent(data) {
    if (!data || data == undefined || data == null) data = shareData;
    wx.onMenuShareAppMessage({
        title: data.friendtitle,
        desc: data.frienddesc,
        link: data.friendlink,
        imgUrl: data.imgUrl,
        trigger: function (res) { },
        success: function (res) {
            track('share', 'friends', 'succeed', 'friends_su');
            if (callbackShare && isFunction(shareCallback)) shareCallback();
        },
        cancel: function (res) { track('share', 'friends', 'cancel', 'friends_ca'); },
        fail: function (res) { track('share', 'friends', 'cancel', 'friends_ca'); }
    });
    wx.onMenuShareTimeline({
        title: data.title,
        link: data.link,
        imgUrl: data.imgUrl,
        trigger: function (res) { },
        success: function (res) {
            track('share', 'moments', 'succeed', 'moments_su');
            if (callbackShare && isFunction(shareCallback)) shareCallback();
        },
        cancel: function (res) { track('share', 'moments', 'cancel', 'moments_ca'); },
        fail: function (res) { track('share', 'moments', 'cancel', 'moments_ca'); }
    });
    wx.onMenuShareQQ({
        title: data.friendtitle,
        desc: data.frienddesc,
        link: data.friendlink,
        imgUrl: data.imgUrl,
        trigger: function (res) { },
        complete: function (res) {
            if (callbackShare && isFunction(shareCallback)) shareCallback();
        },
        success: function (res) {
            track('share', 'QQ', 'succeed', 'QQ_su');
            if (callbackShare && isFunction(shareCallback)) shareCallback();
        },
        cancel: function (res) { track('share', 'QQ', 'cancel', 'QQ_ca'); },
        fail: function (res) { track('share', 'QQ', 'cancel', 'QQ_ca'); }
    });
    wx.onMenuShareWeibo({
        title: data.friendtitle,
        desc: data.frienddesc,
        link: data.friendlink,
        imgUrl: data.imgUrl,
        trigger: function (res) { },
        complete: function (res) {
            if (callbackShare && isFunction(shareCallback)) shareCallback();
        },
        success: function (res) {
            track('share', 'Tqq', 'succeed', 'Tqq_su');
            if (callbackShare && isFunction(shareCallback)) shareCallback();
        },
        cancel: function (res) { track('share', 'Tqq', 'cancel', 'Tqq_ca'); },
        fail: function (res) { track('share', 'Tqq', 'cancel', 'Tqq_ca'); }
    });
    wx.onMenuShareQZone({
        title: data.friendtitle,
        desc: data.frienddesc,
        link: data.friendlink,
        imgUrl: data.imgUrl,
        success: function () {
            track('share', 'Qzone', 'succeed', 'Qzone_su');
            if (callbackShare && isFunction(shareCallback)) shareCallback();
        },
        cancel: function (res) { track('share', 'Qzone', 'cancel', 'Qzone_ca'); },
        fail: function (res) { track('share', 'Qzone', 'cancel', 'Qzone_ca'); }
    });
}

wx.ready(function () {
    wxevent();
    if (isFunction(funLoadCallback)) funLoadCallback();
});

wx.error(function (res) { });