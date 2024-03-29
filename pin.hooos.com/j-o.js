//链接处理
function links(){
    $('a[href^="/go?"]').attr('target','_blank');
    $('a[href^="/go/"]').attr('target','_blank');
    $('a[href^="/go-"]').attr('target','_blank');
    $('a[href^="go?"]').attr('target','_blank');
    $('a[href^="go-"]').attr('target','_blank');
    $('form').attr('target','_blank');
}
links();

//处理延迟加载
function lazyload_img(){
    var imgs = document.querySelectorAll('img');
    for(var i=0; i<imgs.length; i++){
        if (!imgs[i].getAttribute('data-original-url') && !imgs[i].getAttribute('data-ll-status')){
            imgs[i].setAttribute('data-original-url',imgs[i].src);
            imgs[i].src = 'https://cdn.jsdelivr.net/gh/lwq057/cdn@5.7/pin.hooos.com/pdd.png';
        }
    }
	lazyload_run();
}

//执行延迟加载
function lazyload_run(){
    if (typeof(window.lazyloads) !== 'object'){
        window.lazyloads = new LazyLoad({
            elements_selector:'img',
            data_src:'original-url',
            threshold:500,
            callback_loaded:function(el){
                el.setAttribute('data-original-url',el.src);
            },
            callback_error:function(el){
                el.setAttribute('src',el.src);
            },
            cancel_on_exit: true
        });
    }else{
        window.lazyloads.update();
    }
}
lazyload_img();


//表单自动完成
$('body>header>form>input[type="search"]').ready(function(){
    if ($(this).length == 0){
        return false;
    }
    $('body>header>form>input[type="search"]').autocomplete({
        serviceUrl: 'https://suggest.taobao.com/sug?code=utf-8',
        dataType: 'jsonp',
        paramName: 'q',
        appendTo: $('body>header>form'),
        width:'100%',
        transformResult: function(response){
            return {
                suggestions: $.map(response.result, function(i){
                    return { value: i[0], data: i[0] };
                })
            };
        }
    });
});

//商品幻灯片
$('main>article figure').ready(function(){
    if ($('main>article figure img').length == 0){
        return false;
    }
    $('body>main>section>div>div').append($('main>article figure').html());
    load_viewer();
    $('main>article figure').addClass('goods-wrapper').parent().addClass('goods-container').scrollLeft(0).css('overflow','hidden');
    $('main>article figure img').addClass('goods-slide');
    $('main>article figure').after('<i class="p"></i>');

    gs = new Swiper('.goods-container',{
        wrapperClass : 'goods-wrapper',
        slideClass : 'goods-slide',
        slidesPerView: 'auto',
        direction: 'horizontal',
        pagination: {
            el: '.p',
            clickable: true,
            bulletElement : 'a',
            bulletActiveClass: 'active',
        },
        centeredSlides: true,
        spaceBetween: 0,
        autoplay: false,
        grabCursor: true,
        mousewheel: true,
        clickable: true,
        loop: true
    });
    $('.goods-wrapper').hover(function(){
        gs.autoplay.stop();
    },function(){
        gs.autoplay.start();
    });
    lazyload_run();
});

//折扣数
function discount(zp,op){
    d = String(10 / parseFloat(op/zp));
    return d.substring(0,3)+'折';
}

//数据列表
function datas_list(data,type){
    var html = '';
    if (data.length == 0){
        return html;
    }
    switch (type) {
        case 'search':
            $.each(data,function(k,v){
                html += '<a href="/w-'+k+'/">';
                    html += '<img src="'+v+'"><i>'+k+'</i>';
                html += '</a>';
            });
            break;
        case 'category':
            $.each(data,function(k,v){
                html += '<a href="/c-'+k+'/">';
                    html += '<img src="'+v.p+'"><i>'+v.n+'</i>';
                html += '</a>';
            });
            break;
        default:
            $.each(data,function(i,v){
                html += '<li>';
                html += '<a href="/g-'+v.goods_sign+'/">';
                    html += '<i>';
                    html += '<img src="'+v.goods_thumbnail_url+'">';
                    if (v.hasOwnProperty('unified_tags')){
                        html += '<u>优惠 '+v.unified_tags.join(' ')+'</u>';
                    }
                    html += '</i>';
                    html += '<em>';
                        var buy = '优惠购买';
                        if (v.hasOwnProperty('coupon_discount') && v.coupon_discount != 0){
                            html += '<b>'+((v.min_group_price - v.coupon_discount)/100).toFixed(1)+'</b><i>券后价</i>';
                            buy = (v.coupon_discount/100)+'元优惠券';
                        }else{
                            html += '<b>'+(v.min_group_price/100)+'</b>';
                            if (v.min_normal_price == v.min_group_price){
                                html += '<i>低价</i>';
                                buy = '低价购买';
                            }else{
                                buy = discount(v.min_group_price,v.min_normal_price);
                                html += '<i>'+buy+'</i>';
                                buy = buy+'抢购';
                            }
                        }
                        html += '<s>'+(v.min_normal_price/100)+'</s>';
                    html += '</em>';
                    html += '<h4>'+v.goods_name+'</h4>';
                    html += '<p><i>销量'+v.sales_tip+'</i><i>'+v.mall_name+'</i></p>';
                html += '</a>';
                if (v.hasOwnProperty('coupon_discount') && v.coupon_discount != 0){
                    html += '<a c href="/go-'+v.goods_sign+'/">'+buy+'</a>';
                }else{
                    html += '<a href="/go-'+v.goods_sign+'/">'+buy+'</a>';
                }
                html += '</li>';
            });
            break;
    }
    return html;
}

//加载更多
$('small[p]').ready(function(){
    var pages = $('small[p]');
    if (pages.length == 0){
        return false;
    }
    var page = parseInt(pages.attr('p')) || 0;
    var max_page = parseInt(pages.attr('m')) || 0;
    if (max_page != 0 && page >= max_page){
        return false;
    }
    var lists = pages.prev().attr('page',page);
    var lists_parent = lists.parent();
    var load_lock = false;
    var load_num = 2;
    pages.append('<span></span>');
    $(window).on("scroll",function(){
        if (load_lock || load_num <= 0){
            return false;
        }
        page = parseInt(lists.attr('page'));
        if (max_page != 0 && page >= max_page){
            pages.children('span').hide();
            return false;
        }
        if( ($(document).scrollTop()+$(window).height()) > (lists_parent.height()+lists_parent.offset().top) ){
            load_lock = true;
            $.ajax({
                type:'POST',
                url:window.location.href,
                data:{ page:(page+1) , ajax:'true' },
                dataType:'json',
                success: function (datas){
                    if (datas.list){
                        lists.append(datas_list(datas.list,datas.type));
                        if (datas.page){
                            pages.html(datas.page+'<span></span>');
                        }
                        links();
                        lazyload_img();
                        countdown();
                        lists.attr("page",page+1);
                    }
                    load_num = load_num-1;
                    if ((load_num <= 0)||(!datas.page)){
                        pages.children('span').hide();
                        load_lock = true;
                    }else{
                        load_lock = false;
                    }
                },
                error:function(){
                    load_num = load_num-1;
                    pages.children('span').hide();
                }
            });
        }
    });
});


//商品列表幻灯片
$('main>div figure').ready(function(){
    if ($('main>div figure img').length == 0){
        return false;
    }
    $('main>div figure>div').addClass('swiper-w').parent().addClass('swiper-c').scrollLeft(0).css('overflow','hidden');
    $('main>div figure>div>a').addClass('swiper-s');

    new Swiper('.swiper-c',{
        wrapperClass : 'swiper-w',
        slideClass : 'swiper-s',
        slidesPerView: 'auto',
        direction: 'horizontal',
        centeredSlidesBounds:true,
        touchMoveStopPropagation:true,
        centeredSlides: true,
        spaceBetween: 10,
        autoplay: true,
        grabCursor: true,
        clickable: true,
        loop: true
    });
    $(".swiper-c").each(function(e,t){
        var swp = t.swiper;
        $(this).hover(function() {
            swp.autoplay.stop();
        }, function() {
            swp.autoplay.start();
        });
    });
    lazyload_run();
});


//二维码&分享
$('body>main>article').ready(function(){

    var action = ($('body>main>article>q').length > 0) ? '领券' : '购买';

    //二维码
    if ($('body>main>article label[for="qr"]').length>0){
        var id = $('input[name="id"]').val();
        var url = $('input[name="url"]').val();
        var murl = $('input[name="url"]').val();
        var img = $('body>main>article figure img').attr('data-original-url') || $('body>main>article figure img').attr('src');

        $('body>main>article').append('<input id="qr" type="checkbox"><dialog><header>二维码'+action+'</header><section><input tab="" id="qr-t" type="checkbox"><div id="q1" tab></div><div id="q2" tab></div></section><footer><label for="qr-t">切换</label> <label for="qr">确定</label></footer></dialog>');
        
        var op = {
            render: 'canvas',
            minVersion: 1,
            maxVersion: 40,
            ecLevel: 'H', 
            left: 0,
            top: 0,
            size: 500,
            text: location.origin,
            fill: '#000',
            background: null,
            radius: 0.1,
            quiet: 2,
            mode: 4,
            mSize: 0.2,
            mPosX: 0.5,
            mPosY: 0.5,
            label: 'goods',
            fontname: 'sans',
            fontcolor: '#000'
        }

        let is_pc = true;
        if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)){
            is_pc = false;
        }

        var image1 = new Image();
        image1.src = 'https://cdn.jsdelivr.net/gh/lwq057/cdn@4.4/pin.hooos.com/wx.png';
        image1.onload = function(){
            op.text = url;
            if (is_pc){
                op.image = this;
            }else{
                op.render = 'image';
            }
            $("#q1").qrcode(op).append('<p>[微信二维码] 使用微信、微博、浏览器等APP扫码'+action+'</p>');
        }

        var image2 = new Image();
        image2.src = img;
        image2.onload = function(){
            op.text = location.origin + '/go-'+id+'/?url='+encodeURIComponent(url)+'&murl='+encodeURIComponent(murl);
            if (is_pc){
                op.image = this;
            }else{
                op.render = 'image';
            }
            $("#q2").qrcode(op).append('<p>[通用二维码] 扫描或长按识别二维码'+action+'</p>');
        }
    }

    //分享
    if ($('body>main>article label[for="share"]').length>0){
        var s = {};
        s['id'] = $('input[name="id"]').val();
        s['url'] = $('input[name="url"]').val() || $('input[name="murl"]').val() || '';
        s['img'] = $('body>main>article figure img').attr('data-original-url') || $('body>main>article figure img').attr('src');
        s['price'] = $('body>main>article>div[info]>div em>b[p]').text() || 0;
        s['oprice'] = $('body>main>article>div[info]>div em>b[o]').text() || 0;
        s['coupon'] = $('body>main>article>q>*>div>em').text() || 0;
        var title = s['title'] = $('body>main>article>div[info]>h2').text() || $('body>main>article>div[info]>h1').text();
        s['tag'] = $('body>main>article>div[info]>div[t]>i').map(function(){
            return $(this).text();
        }).get().join('、') || '';
        s['cat'] = $('body>main>div>nav>a').eq(0).text() || '';

        var img_src = '/server/share.html?';
        s['title'] = encodeURI(s['title']);
        $.each(s,function(i,v){
            img_src += '&'+i+'='+v;
        });
        s['title'] = title;

        s['num'] = $('body>main>article>div[info]>b>i').map(function(){
            return $(this).text();
        }).get().join('、') || '';

        var s_t = '<img src="'+s['img']+'"><br>';
        if (s['cat']){
            s_t += '#'+s['cat']+'#<br>';
        }
        s_t += s['title']+'<br>';
        if (s['num']){
            s_t += s['num']+'<br>';
        }
        if (s['oprice']){
            s_t += '【原售价】'+s['oprice']+'￥';
        }
        if (s['price']){
            if (s['coupon']){
                s_t += '【在售价】'+s['price']+'￥<br>';
            }else{
                s_t += '【优惠价】'+s['price']+'￥<br>';
            }
        }
        if (s['coupon']){
            s_t += '【券后价】'+(s['price']-s['coupon']).toFixed(2)+'￥';
            s_t += '【优惠券】'+s['coupon']+'￥<br>';
        }
        if (s['tag']){
            s_t += '[ '+s['tag']+' ]<br>';
        }
        s_t +='购买链接：'+s['url'] +'<br>';
        s_t +='更多详情：'+window.location.href;

        $('body>main>article').append('<input id="share" type="checkbox"><dialog><header>分享文字或图片</header><section><div share><input tab id="share_type" type="checkbox"><div tab><p>长按分享或保存图片发送给好友</p><iframe id="share_img" width="100%" height="100%" data-src="'+img_src+'" src="'+s['img']+'"></iframe></div><div tab><div id="share_text">'+s_t+'<br><input id="copysharetext" type="submit" value="点击复制"></div></div></div></section><footer><label for="share_type">图片/文字</label> <label for="share">收起窗口</label></footer></dialog>');

        $('#share').click(function(){
            var share_img = $('#share_img');
            if (share_img.attr('data-src')){
                share_img.attr('src',share_img.attr('data-src'));
                share_img.removeAttr('data-src');
            }
        });

        $('#copysharetext').ready(function(){
            if ($(this).length == 0){
                return false;
            }
            var copysharetext = new ClipboardJS('#copysharetext', {
                target: function(e){
                    return document.getElementById('share_text');
                }
            });
            copysharetext.on('success', function(e) {
                $('#copysharetext').val('复制成功去分享吧');
            });
            copysharetext.on('error', function(e) {
                $('#copysharetext').val('复制失败请长按或选中右击复制');
            });
        });
    }

});

//图片预览
function load_viewer(){
    if ($('body>main>article>div[imgs]>figure').length>0){
        if (typeof(window.figure_viewers) !== 'object'){
            window.figure_viewers = new Viewer($('body>main>article>div[imgs]>figure')[0],{url:'data-original-url',shown:function(){
                lazyload_run();
            },view:function(o){
                var url = o.detail.image.src;
                o.detail.image.src = url.replace('_400x400q90','');
            }});
        }
    }
    if ($('body>main>section>div>div').length>0){
        if (typeof(window.viewers) !== 'object'){
            window.viewers = new Viewer($('body>main>section>div>div')[0],{url:'data-original-url',shown:function(){
                lazyload_run();
            }});
        }else{
            window.viewers.update();
        }
    }
}
load_viewer();


//倒计时处理
function countdown(){
    $('[cd]').each(function(i,e){
        var td = $(this).attr('cd');
        var s = ($(this).is('[c]')) ? '后结束' : '后开始';
        if (td && isNaN(td) == false){
            td = parseInt(td);
        }
        var t = new Date(td);
        if ( ( t - (new Date()) ) > 0 ){
            setInterval(function (){
                var nowtime = new Date();
                var time = t - nowtime;
                var day = parseInt(time / 1000 / 60 / 60 / 24);
                var hour = parseInt(time / 1000 / 60 / 60 % 24);
                var minute = parseInt(time / 1000 / 60 % 60);
                var seconds = parseInt(time / 1000 % 60);
                if (!day){
                    $(e).html(hour + ':' + minute + ':' + seconds + s);
                }else{
                    $(e).html(day + '天' + hour + ':' + minute + ':' + seconds + s);
                }
            },1000);
        }
        $(this).removeAttr('cd');
    });
}
countdown();


//点击收起
$('main>section>div>label[i]').click(function(){
    $('body,html').animate({
		scrollTop:$('body>main>article').offset().top
	},400);
});


//尾部信息
$('body>footer').prepend('<p>闽ICP备12002928号 &nbsp;&nbsp;&nbsp; 闽公网安备 35042502000103号 &nbsp;&nbsp;&nbsp; <a rel="external nofollow" href="http://wpa.qq.com/msgrd?v=3&amp;uin=12692752&amp;site=tao.hooos.com&amp;menu=yes" target="_blank" title="联系QQ">联系我们</a><span id="cnzz_stat_icon_1253303069" style="display:none;">CNZZ</span></p>');


//搜索提示改变
$('body>header>form>input[type="search"]').ready(function(){
    var search_placeholder = function(){
        var arr = ['最近想买的东西是不是有优惠了？','可以复制商品标题搜索看看','好像有什么东西该换新的了吧？','最近买的东西有没有买贵了？','查查家人喜欢的东西优惠力度大吗？','家里是不是缺了点什么东西？','最近有什么想吃的东西吗？','最近有什么好玩的东西吗？','给TA买个礼物吧？'];
        var index = Math.floor((Math.random()*arr.length));
        $('body>header>form>input[type="search"]').attr('placeholder',arr[index]);
    };
    var sp = setInterval(search_placeholder,10000);
    $('body>header>form>input[type="search"]').focus(function(){
        clearInterval(sp);
        $(this).attr('placeholder','可输入商品关键词、标题、ID、链接');
        $(this).blur(function(){
            sp = setInterval(search_placeholder,10000);
        });
    });
});


//快捷操作
$('body').append('<s><i t title="回顶部"></i><i r title="上一页"></i></s>');
$('body>s>i[t]').click(function(){
    $('body,html').animate({scrollTop:0},400);
});
$('body>s>i[r]').click(function(){
    history.back();
});
$(window).scroll(function(){
    $('body>s').hide();
    clearTimeout($.data(this,'scrollTimer'));
    $.data(this,'scrollTimer',setTimeout(function(){
        $('body>s').show();
        if ($(window).scrollTop() > 100){
            $('body>s>i[t]').show();
        }else{
            $('body>s>i[t]').hide();
        }
        if (document.referrer.indexOf(window.location.host) > 0){
            $('body>s>i[r]').show();
        }else{
            $('body>s>i[r]').hide();
        }
    },800));
});


//百度主动提交
var a=document.createElement("script");"https"===window.location.protocol.split(":")[0]?a.src="https://zz.bdstatic.com/linksubmit/push.js":a.src="http://push.zhanzhang.baidu.com/push.js";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b);

//360主动提交
//var src = (document.location.protocol == "http:") ? "http://js.passport.qihucdn.com/11.0.1.js?5d3c67eb55d22c0f5eb9d4f5ae86e8eb":"https://jspassport.ssl.qhimg.com/11.0.1.js?5d3c67eb55d22c0f5eb9d4f5ae86e8eb";document.write('<script src="' + src + '" id="sozz"><\/script>');
//var a=document.createElement("script");a.id = 'sozz';a.src="https://jspassport.ssl.qhimg.com/11.0.1.js?d182b3f28525f2db83acfaaf6e696dba";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b);
//var a=document.createElement("script");a.src="https://s.ssl.qhres.com/ssl/ab77b6ea7f3fbf79.js";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b);
(function(e){function t(e){var t=location.href,n=t.split("").reverse(),r=e.split(""),i=[];for(var s=0,o=16;s<o;s++)i.push(r[s]+(n[s]||""));return i.join("")}var n=/([http|https]:\/\/[a-zA-Z0-9\_\.]+\.so\.com)/gi,r=e.location.href;if(r&&!n.test(r)&&window.navigator.appName){var i="//s.360.cn/so/zz.gif",o='d182b3f28525f2db83acfaaf6e696dba',u=t(o),a=new Image;r&&(i+="?url="+encodeURIComponent(r)),o&&(i+="&sid="+o),u&&(i+="&token="+u),o&&(a.src=i)}})(window);

//cnzz数据统计
var cnzz_s_tag =document.createElement('script');cnzz_s_tag.type ='text/javascript';cnzz_s_tag.async =true;cnzz_s_tag.charset= 'utf-8';cnzz_s_tag.src ='https://s4.cnzz.com/stat.php?id=1253303069&async=1&online=2';var root_s =document.getElementsByTagName('script')[0];root_s.parentNode.insertBefore(cnzz_s_tag,root_s);

//关闭提示
if(document.referrer.indexOf(document.domain) == -1){
    $(window).bind('beforeunload', function(){
        if(window.is_confirm !== false)
            return '天猫淘宝的优惠券商品都在虎窝淘';
    })
    .bind('mouseover mouseleave', function(event){
        is_confirm = event.type == 'mouseleave';
    });
}

//网站地图
$.ajax({
    url:'/?sitemap=true',
    cache:true,
    async:true
});

console.log("%c\n _	  _  \n| |  | | \n| |__| |  _____    _____    _____   _____ \n|  __  | /  _  \\  /  _  \\  /  _  \\ /  ___\\ \n| |  | ||  |_|  ||  |_|  ||  |_|  |\\___  \\ \n|_|  |_| \\_____/  \\_____/  \\_____/ \\_____/ \n ","color:#e3544c");
console.log("%c\n欢迎访问虎窝拼！\n ","color:#fa7e89");
