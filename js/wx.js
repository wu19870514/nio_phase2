$(function(){
    $.ajax({
        url:'http://wechat.rource.com/Home/Index/getJsSign',
        type:'GET',
        data:
        {
            url:encodeURIComponent(location.href.split("#")[0])
        },
        dataType:"jsonp",
        jsonp:"jsonpcallback",
        success:function(data){
            wx.config({
                debug: false,
                appId: data.appid,
                timestamp: data.timestamp,
                nonceStr:  data.noncestr,
                signature: data.signature,
                jsApiList: ['updateAppMessageShareData','updateTimelineShareData','onMenuShareTimeline','onMenuShareAppMessage']
            });

            setWxData('邀请好友试驾，赢三亚之旅！',
                '蔚来有礼啦～全国往返机票，五星级酒店住宿，享三亚Formula E观赛之旅～',
                '蔚来有礼啦～全国往返机票，五星级酒店住宿，享三亚Formula E观赛之旅～',
                location.href,
                'http://nio.rource.com/hn/img/fx.jpg');
        }
    });
});

function  setWxData(title,desc,timelinetitle,link,img){
    wx.ready(function () { 
        wx.updateAppMessageShareData({ 
            title: title,
            desc: desc,
            link: link,
            imgUrl: img,
            success: function () {
            }
        });

        wx.updateTimelineShareData({ 
            title: timelinetitle,
            link: link,
            imgUrl: img,
            success: function () {
            }
        });

        wx.onMenuShareTimeline({
            title: timelinetitle,
            link: link,
            imgUrl: img,
            success: function () {
            }
        });

        wx.onMenuShareAppMessage({
            title: title,
            desc: desc,
            link: link,
            imgUrl: img,
            success: function () {
            }
        })
    });
}