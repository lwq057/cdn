

//链接处理
function links(){
    $('a[href^="/go?"]').attr('target','_blank');
    $('a[href^="/go_"]').attr('target','_blank');
    $('a[href^="go?"]').attr('target','_blank');
    $('a[href^="go_"]').attr('target','_blank');
    $('form').attr('target','_blank');
}
links();

//处理延迟加载
function lazyload_img(){
    var imgs = document.querySelectorAll('img');
    for(var i=0; i<imgs.length; i++){
        if (!imgs[i].getAttribute('data-original-url') && !imgs[i].getAttribute('data-ll-status')){
            if ( ( imgs[i].src.indexOf('.gif') != -1 || imgs[i].src.indexOf('.alicdn.com') == -1 || imgs[i].src.indexOf('.tbcdn.cn') == -1 ) && imgs[i].src.indexOf('/imgextra/') != -1){
                imgs[i].setAttribute('data-original-url',imgs[i].src);
            }else{
                imgs[i].setAttribute('data-original-url',imgs[i].src+'_400x400q90');
            }
            imgs[i].src = 'https://cdn.jsdelivr.net/gh/lwq057/cdn@2.4/tao.hooos.com/lazyload.gif';
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
                html += '<a href="search?w='+k+'">';
                    html += '<img src="'+v+'"><i>'+k+'</i>';
                html += '</a>';
            });
            break;
        case 'tag':
            $.each(data,function(k,v){
                html += '<a href="tag_'+k+'.html">';
                    html += '<img src="'+v+'"><i>'+k+'</i>';
                html += '</a>';
            });
            break;
        case 'category':
            $.each(data,function(k,v){
                html += '<a href="category_'+k+'.html">';
                    html += '<img src="'+v.p+'"><i>'+v.n+'</i>';
                html += '</a>';
            });
            break;
        default:
            $.each(data,function(i,v){
                html += '<li>';

                html += '<a href="goods_'+v.item_id+'.html">';
                    html += '<i>';
                    html += '<img src="'+v.pict_url+'">';
                    if (typeof(v.item_description)=='string'){
                        html += '<u>'+v.item_description+'</u>';
                    }
                    html += '</i>';
                    html += '<em>';
                        var buy = '优惠';
                        if (v.hasOwnProperty('coupon_amount') && v.coupon_amount != 0){
                            html += '<b>'+(v.zk_final_price - v.coupon_amount).toFixed(1)+'</b><i>券后价</i><s>'+v.zk_final_price+'</s>';
                        }else{
                            html += '<b>'+v.zk_final_price+'</b>';
                            if (v.zk_final_price == v.reserve_price){
                                html += '<i>低价</i>';
                                buy = '低价';
                            }else{
                                buy = discount(v.zk_final_price,v.reserve_price);
                                html += '<i>'+buy+'</i><s>'+v.reserve_price+'</s>';
                            }
                        }
                    html += '</em>';
                    html += '<h4>'+v.title+'</h4>';

                    if (v.hasOwnProperty('tqg_online_end_time')){
                        html += '<p>';
                            html += '<i cd="'+v.tqg_online_end_time+'" c>抢购中</i>';
                            html += '<i>已抢'+v.tqg_sold_count+'/'+v.tqg_total_count+'</i>';
                        html += '</p>';
                    }else{
                        var shop = '';
                        if (v.hasOwnProperty('user_type')){
                            shop = (v.user_type == '1') ? 'm' : 'b';
                        }
                        html += '<p '+shop+'>';
                            html += '<i>'+((shop == 'm') ? '天猫' : '淘宝')+'月销'+v.volume+'</i>';
                            if (v.hasOwnProperty('nick')){
                                html += '<i>'+v.nick+'</i>';
                            }
                        html += '</p>';
                    }

                html += '</a>';

                var url = '';
                if (v.hasOwnProperty('coupon_share_url')){
                    url = v.coupon_share_url;
                }else if (v.hasOwnProperty('url')){
                    url = v.url;
                }else if (v.hasOwnProperty('click_url')){
                    url = v.click_url;
                }
                url = 'go?url='+encodeURIComponent(url)+'&id='+v.item_id;
                html += '<a buy href="'+url+'">';
                    if (v.hasOwnProperty('coupon_amount') && v.coupon_amount != 0){
                        html += v.coupon_amount+'元优惠券';
                    }else{
                        html += buy+'购买';
                    }
                html += '</a>';

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


//二维码&淘口令&分享
$('body>main>article').ready(function(){

    var action = ($('body>main>article>q').length > 0) ? '领券' : '购买';

    //二维码
    if ($('body>main>article label[for="qr"]').length>0){
        var url = $('input[name="url"]').val();
        if (url.substr(0,2) == '//'){
            url = 'https:'+url;
        }
        url = encodeURIComponent(url);
        var src_1 = 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data='+url+'&h=400&w=400&logo=https://img.alicdn.com/tps/i3/T1OjaVFl4dXXa.JOZB-114-114.png&';

        var id = $('input[name="id"]').val();
        var model = $('input[name="model"]').val();
        var img = $('body>main>article figure img').attr('data-original-url') || $('body>main>article figure img').attr('src');
        var src_2 = 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=' + encodeURIComponent('http://'+window.location.host+'/go?id='+id+'&url='+url+'&model='+model) + '&h=400&w=400&logo='+img+'&';

        $('body>main>article').append('<input id="qr" type="checkbox"><dialog><header>二维码'+action+'</header><section><input tab="" id="qr-t" type="checkbox"><div tab=""><img src="'+src_1+'" alt="淘宝APP二维码"><p>[淘宝二维码] 使用淘宝或天猫APP扫码'+action+'</p></div><div tab=""><img src="'+src_2+'" alt="通用二维码"><p>[通用二维码] 扫描或长按识别二维码'+action+'</p></div></section><footer><label for="qr-t">切换</label> <label for="qr">确定</label></footer></dialog>');
        lazyload_run();
    }

    //淘口令
    if ($('body>main>article label[for="model"]').length>0){
        var model = Math.floor(Math.random()*10) +'.'+ $('input[name="model"]').val() + '.:/';
        $('body>main>article').append('<input id="model" type="checkbox"><dialog><header>淘口令'+action+'</header><section><p>长按或选中右击复制以下淘口令</p><p id="modelcopy" data-clipboard-text="'+model+'"><b>'+model+'</b></p><p>复制成功后打开淘宝或天猫APP即可'+action+'</p></section><footer><label id="copymodel" data-clipboard-text="'+model+'">一键复制</label><label for="model">确定</label></footer></dialog>');

        $('#copymodel').ready(function(){
            if ($(this).length == 0){
                return false;
            }
            var copymodel = new ClipboardJS('#copymodel');
            copymodel.on('success', function(e) {
                document.getElementById('copymodel').innerText = '复制成功';
                $('#copymodel').text('复制成功');
            });
            copymodel.on('error', function(e) {
                $('#copymodel').text('手动复制');
            });
        });
    }

    //分享
    if ($('body>main>article label[for="share"]').length>0){
        var s = {};
        s['id'] = $('input[name="id"]').val();
        s['img'] = $('body>main>article figure img').attr('data-original-url') || $('body>main>article figure img').attr('src');
        s['price'] = $('body>main>article>div[info]>div em>b[p]').text() || 0;
        s['oprice'] = $('body>main>article>div[info]>div em>b[o]').text() || 0;
        s['coupon'] = $('body>main>article>q>*>div>em').text() || 0;
        s['title'] = $('body>main>article>div[info]>h2').text() || $('body>main>article>div[info]>h1').text();
        s['tag'] = $('body>main>article>div[info]>div[t]>i').map(function(){
            return $(this).text();
        }).get().join(',') || '';

        var img_src = '/server/static/share.html?';
        $.each(s,function(i,v){
            img_src += '&'+i+'='+v;
        });

        s['num'] = $('body>main>article>div[info]>b>i').map(function(){
            return $(this).text();
        }).get().join(',') || '';
        s['model'] = $('input[name="model"]').val() || '';

        var s_t = '0.0<br><img src="'+s['img']+'"><br>';
        s_t += s['title']+'<br>';
        if (s['num']){
            s_t += '[ '+s['num']+' ]<br>';
        }
        if (s['oprice']){
            s_t += '【原售价】'+s['oprice']+'元';
        }
        if (s['price']){
            if (s['coupon']){
                s_t += '【在售价】'+s['price']+'元<br>';
            }else{
                s_t += '【优惠价】'+s['price']+'元<br>';
            }
        }
        if (s['coupon']){
            s_t += '【券后价】'+(s['price']-s['coupon']).toFixed(2)+'元';
            s_t += '【优惠券】'+s['coupon']+'元<br>';
        }
        if (s['model']){
            //s['model'] = s['model'].replace('￥','₳');
            s_t += '【淘口令】'+s['model']+'<br>';
            s_t +='(复制此消息，打开淘宝或天猫APP，即可'+action+')<br>';
        }
        if (s['tag']){
            s_t += '[ '+s['tag']+' ]<br>';
        }
        s_t +='详情：'+window.location.href;

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

//获取视频
function dav(q){
    if (q){
        var id = $('input[name="id"]').val();
        if (id){
            $.ajax({
                url:'/dav_'+id,
                async:true,
                data:q,
                type:'GET',
                dataType:'json',
                cache:'true',
                success:function(result){
                    if ($('body>main>section>div>div>video').length == 0){
                        if (result && result.video){
                            $('body>main>section>div>div[n]').prepend(result.video);
                        }
                    }
                    descattr(result);
                    if (result.desc == ''){
                        var desc = '';
                        $('main>article figure img').each(function(){
                            var src = $(this).attr('data-original-url') || $(this).attr('src');
                            if(desc.indexOf(src)==-1){
                                desc += '<img src="'+src+'">';
                            }
                        });
                        descattr({
                            desc:desc.replaceAll('_400x400q90','')
                        });
                    }
                }
            });
        }
    }
}

//读取详情与属性
function descattr(data){
    if ($('body>main>section>div>div[n]').length > 0){
        var desc = data.pcDescContent || data.desc;
        if (desc){
            $('body>main>section>div>div[n]').append(desc).removeAttr('n');
        }
    }
    if ($('body>main>section>ol[n]').length > 0){
        var attr = '';
        if (data.itemProperties){
            $.each(data.itemProperties,function(i,v){
                attr += '<li>'+v['name']+'：'+v['value']+'</li>';
            });
        }else if(data.attr){
            $.each(data.attr[0],function(i,v){
                $.each(v,function(ii,vv){
                    $.each(vv,function(iii,vvv){
                        attr += '<li>'+iii+'：'+vvv+'</li>';
                    });
                });
            });
        }
        if (attr){
            $('body>main>section>ol[n]').append(attr).removeAttr('n');
        }
    }
    load_viewer();
}

//获取商品属性
$('body>main>article').ready(function(){
    var id = $('input[name="id"]').val();
    if (id){
        if ( ($('body>main>section>div>div[n]').length > 0) || ($('body>main>section>ol[n]').length > 0) ){
            var api = 'https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdesc/6.0/?data={%22id%22:%22'+id+'%22}';
            $.ajax({
                url:api,
                timeout:1000,
                tryCount:0,
                retryLimit:10,
                cache:false,
                async:false,
                dataType:'jsonp',
                jsonp:'callback',
                success:function(result){
                    this.tryCount++;
                    if (result.data.pcDescContent){
                        descattr(result.data);
                        dav({v:1});
                    }else if(this.tryCount < this.retryLimit){
                        if (this.url.length > 400){
                            this.url = api;
                        }
                        $.ajax(this);
                        return;
                    }else{
                        dav({d:1,a:1,v:1});
                    }
                },
                error:function(){
                    this.tryCount++;
                    if (this.url.length > 400){
                        this.url = api;
                    }
                    if(this.tryCount < this.retryLimit){
                        $.ajax(this);
                    }else{
                        dav({d:1,a:1,v:1});
                    }
                    return;
                }
            });
        }

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


//APP领券购买
$('body>main>article>q>label').ready(function(){
    var label = $('body>main>article>q>label');
    var model = $('body>main>article>nav>label[for="model"]');
    if (label.length>0 && model.length>0){
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger' || ua.match(/baiduboxapp/i) == 'baiduboxapp'){
            label.attr('for','model');
        }
    }
});

//尾部信息
$('body>footer').prepend('<p>工信部ICP备案：闽ICP备12002928号-2 &nbsp;&nbsp;&nbsp; 公安部备案：闽公网安备 35042502000103号 &nbsp;&nbsp;&nbsp; <a rel="external nofollow" href="http://wpa.qq.com/msgrd?v=3&amp;uin=12692752&amp;site=tao.hooos.com&amp;menu=yes" target="_blank" title="联系QQ">联系我们</a> &nbsp;&nbsp;&nbsp; <span id="cnzz_stat_icon_1253303069">CNZZ</span></p>');


//搜索提示改变
$('body>header>form>input[type="search"]').ready(function(){
    var search_placeholder = function(){
        var arr = ['最近想买的东西是不是有优惠了？','可以复制商品标题搜索看看','好像有什么东西该换新的了吧？','最近买的东西有没有买贵了？','查查家人喜欢的东西优惠力度大吗？','天猫淘宝优惠商品都在这里哦','家里是不是缺了点什么东西？','最近有什么想吃的东西吗？','最近有什么好玩的东西吗？','给TA买个礼物吧？'];
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

//导航相关
if ($('body>main>article').length > 0){
    if ($('body>main>div>nav>a').length > 0){
        $('body>nav>a').eq(1).attr('href',$('body>main>div>nav>a').eq(0).attr('href'));
    }
}

//百度主动提交
var a=document.createElement("script");"https"===window.location.protocol.split(":")[0]?a.src="https://zz.bdstatic.com/linksubmit/push.js":a.src="http://push.zhanzhang.baidu.com/push.js";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b);

//360主动提交
//var src = (document.location.protocol == "http:") ? "http://js.passport.qihucdn.com/11.0.1.js?5d3c67eb55d22c0f5eb9d4f5ae86e8eb":"https://jspassport.ssl.qhimg.com/11.0.1.js?5d3c67eb55d22c0f5eb9d4f5ae86e8eb";document.write('<script src="' + src + '" id="sozz"><\/script>');
//var a=document.createElement("script");a.id = 'sozz';a.src="https://jspassport.ssl.qhimg.com/11.0.1.js?d182b3f28525f2db83acfaaf6e696dba";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b);
//var a=document.createElement("script");a.src="https://s.ssl.qhres.com/ssl/ab77b6ea7f3fbf79.js";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b);
(function(e){function t(e){var t=location.href,n=t.split("").reverse(),r=e.split(""),i=[];for(var s=0,o=16;s<o;s++)i.push(r[s]+(n[s]||""));return i.join("")}var n=/([http|https]:\/\/[a-zA-Z0-9\_\.]+\.so\.com)/gi,r=e.location.href;if(r&&!n.test(r)&&window.navigator.appName){var i="//s.360.cn/so/zz.gif",o='d182b3f28525f2db83acfaaf6e696dba',u=t(o),a=new Image;r&&(i+="?url="+encodeURIComponent(r)),o&&(i+="&sid="+o),u&&(i+="&token="+u),o&&(a.src=i)}})(window);

//cnzz数据统计
var cnzz_s_tag =document.createElement('script');cnzz_s_tag.type ='text/javascript';cnzz_s_tag.async =true;cnzz_s_tag.charset= 'utf-8';cnzz_s_tag.src ='https://s4.cnzz.com/stat.php?id=1253303069&async=1&online=2';var root_s =document.getElementsByTagName('script')[0];root_s.parentNode.insertBefore(cnzz_s_tag,root_s);

//图标
$("<link>").attr({rel:'shortcut icon',href:"//cdn.jsdelivr.net/gh/lwq057/cdn@1.3/tao.hooos.com/favicon.ico"}).appendTo("head");
$("<link>").attr({rel:'manifest',href:"//cdn.jsdelivr.net/gh/lwq057/cdn@1.4/tao.hooos.com/manifest.json"}).appendTo("head");

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

console.log("%c\n _	  _  \n| |  | | \n| |__| |  _____    _____    _____   _____ \n|  __  | /  _  \\  /  _  \\  /  _  \\ /  ___\\ \n| |  | ||  |_|  ||  |_|  ||  |_|  |\\___  \\ \n|_|  |_| \\_____/  \\_____/  \\_____/ \\_____/ \n ","color:#fa54b6");
console.log("%c\n欢迎访问虎窝淘！\n ","color:#fa7e89");
console.log("%c\n意见反馈：https://www.hooos.com/group-287-1.html \n ","color:#fba45e");
