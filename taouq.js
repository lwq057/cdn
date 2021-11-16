//https://cdn.jsdelivr.net/combine/npm/jquery@3.6.0,npm/vanilla-lazyload@16.1.0,npm/devbridge-autocomplete@1.4.11,npm/clipboard@2.0.8,npm/viewerjs@1.10.0,npm/swiper@5.4.5,gh/lwq057/cdn@8.0/taouq.js

//获取商品属性与描述
var id = null;
if (document.querySelector('main>article')) {
    id = document.querySelector('main>article').getAttribute('id');
}
if (id) {
    $.ajax({
        url: "https://hws.m.taobao.com/cache/desc/5.0?id=" + id,
        timeout: 1000,
        tryCount: 0,
        retryLimit: 10,
        cache: false,
        async: true,
        dataType: 'jsonp',
        jsonp: 'callback',
        success: function (result) {
            this.tryCount++;
            if (result.sellerId) {
                desc(result);
            } else if (this.tryCount < this.retryLimit) {
                if (this.url.length > 400) {
                    this.url = "https://hws.m.taobao.com/cache/desc/5.0?id=" + id;
                }
                $.ajax(this);
                return;
            }
        },
        error: function () {
            this.tryCount++;
            if (this.url.length > 400) {
                this.url = "https://hws.m.taobao.com/cache/desc/5.0?id=" + id;
            }
            if (this.tryCount < this.retryLimit) {
                $.ajax(this);
            }
            return;
        }
    });
    
    attr(false);

    // $.ajax({
    //     url: 'https://acs.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/?data=%7B"itemNumId"%3A"' + id + '"%7D',
    //     timeout: 1000,
    //     tryCount: 0,
    //     retryLimit: 10,
    //     cache: false,
    //     async: true,
    //     dataType: 'jsonp',
    //     jsonp: 'callback',
    //     success: function (result) {
    //         this.tryCount++;
    //         if (result.data) {
    //             attr(result.data);
    //         } else if (this.tryCount < this.retryLimit) {
    //             if (this.url.length > 400) {
    //                 this.url = 'https://acs.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/?data=%7B"itemNumId"%3A"' + id + '"%7D';
    //             }
    //             $.ajax(this);
    //             return;
    //         }
    //     },
    //     error: function () {
    //         this.tryCount++;
    //         if (this.url.length > 400) {
    //             this.url = 'https://acs.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/?data=%7B"itemNumId"%3A"' + id + '"%7D';
    //         }
    //         if (this.tryCount < this.retryLimit) {
    //             $.ajax(this);
    //         }
    //         return;
    //     }
    // });
}

//链接处理
$('a[href^="/0/"]').attr('target', '_blank');

//图片添加alt
$('img:not([alt])').each(function () {
    if ($(this).siblings('h3').length > 0) {
        $(this).attr('alt', $(this).siblings('h3').text());
    } else if ($(this).siblings('i').length > 0) {
        $(this).attr('alt', $(this).siblings('i').text());
    } else if ($('h1').length > 0) {
        $(this).attr('alt', $('h1').text());
    }
});

// 导航定位
if (location.pathname && location.pathname != '/') {
    $('body>nav>a').each(function () {
        if (location.origin + '/' == this.href) {
            return true;
        }
        if ((location.origin + location.pathname).indexOf(this.href) == 0) {
            $('body>nav').scrollLeft($(this).offset().left - $(this).width());
            return false;
        }
    });
}

//表单自动完成
$('header form input[type="search"]').ready(function () {
    if ($(this).length == 0) {
        return false;
    }
    $('header form input[type="search"]').autocomplete({
        serviceUrl: 'https://suggest.taobao.com/sug?code=utf-8',
        dataType: 'jsonp',
        paramName: 'q',
        appendTo: $('header form'),
        width: '100%',
        transformResult: function (response) {
            return {
                suggestions: $.map(response.result, function (i) {
                    return { value: i[0], data: i[0] };
                })
            };
        }
    });
});


//文章预览
function load_viewer() {
    if ($('main>article').length > 0) {
        if (typeof (window.viewers) !== 'object') {
            window.viewers = new Viewer($('main>article')[0], {
                url: 'data-original-url'
            });
        } else {
            window.viewers.update();
        }
    }
}
load_viewer();


//读取描述
function desc(data) {
    var div = $('body>main>article>section>div');
    if ($.trim(div.html()).length > 20) {
        return false;
    }
    if (!data.wdescContent) { return null; }
    var desc_html = '';
    var desc_data = data.wdescContent;
    var regx = /<[^>]*>|<\/[^>]*>/gm;
    $.each(desc_data.pages, function (i, v) {
        if (v.indexOf("</img>") != -1) {
            desc_html += '<img alt="' + document.title + ' - 详情图" src="' + v.replace(regx, '') + '">';
        } else if (v.indexOf("</txt>") != -1) {
            desc_html += "<p>" + v.replace(regx, '') + "</p>";
        }
    });
    if (desc_html) {
        div.html(desc_html);
        load_viewer();
    }
}

//读取属性
function attr(datas) {
    var section = document.querySelector('body>main>article>section>ins');
    if ($.trim(section.innerHTML).length > 60) {
        return false;
    }
    section.innerHTML = '';
    if (datas == false){
        return false;
    }

    //商品评价
    var rate_html = '';
    if (datas.rate) {
        rate_html += '<h2>商品评价</h2>';
        if (datas.rate.keywords) {
            var arr = datas.rate.keywords;
            for (var k in arr) {
                rate_html += '<p>' + arr[k].count + '位买家觉得：' + '<b>' + arr[k].word + '</b></p>';
            }
        }
        var arr = datas.rate.rateList;
        for (var k in arr) {
            rate_html += '<p><q>' + arr[k].content + '</q></p>';
        };
        section.insertAdjacentHTML('beforeend', rate_html);
    }


    //商品属性
    var props_html = '';
    if (JSON.stringify(datas.props) != "{}") {
        if (datas.props.groupProps && datas.props.groupProps != 'undefined') {
            $.each(datas.props.groupProps[0], function (k, v) {
                props_html += '<h2>' + k + '</h2>';
                props_html += '<ul>';
                $.each(v, function (kk, vv) {
                    var kkk = Object.keys(vv)[0];
                    props_html += '<li title="' + vv[kkk] + '">' + kkk + ': ' + vv[kkk] + '</li>';
                });
                props_html += '</ul>';
            });
        }
        if (datas.props.importantProps) {
            props_html += '<h4>产品属性</h4>';
            props_html += '<ul>';
            $.each(datas.props.importantProps, function (k, v) {
                props_html += '<li title="' + v['value'] + '">' + v['name'] + ': ' + v['value'] + '</li>';
            });
            props_html += '</ul>';
        }
    }
    if (JSON.stringify(datas.props2) != "{}") {
        if (typeof (datas.props2.groupProps) != 'undefined') {
            $.each(datas.props2.groupProps[0], function (k, v) {
                props_html += '<h2>' + k + '</h2>';
                props_html += '<ul>';
                $.each(v, function (kk, vv) {
                    var kkk = Object.keys(vv)[0];
                    props_html += '<li title="' + vv[kkk] + '">' + kkk + ': ' + vv[kkk] + '</li>';
                });
                props_html += '</ul>';
            });
        }
        if (datas.props2.importantProps) {
            props_html += '<h4>产品属性</h4>';
            props_html += '<ul>';
            $.each(datas.props2.importantProps, function (k, v) {
                props_html += '<li title="' + v['value'] + '">' + v['name'] + ': ' + v['value'] + '</li>';
            });
            props_html += '</ul>';
        }
    }
    if (props_html) {
        section.insertAdjacentHTML('beforeend', props_html);
    }
    load_viewer();
}


//淘口令&分享&二维码
$('main>article').ready(function () {

    var action = ($('body>main>article address>p em[c]').length > 0) ? '领券' : '购买';

    //淘口令
    if ($('body>main>article label[for="model"]').length > 0) {
        var model = Math.floor(Math.random() * 10) + '.' + $('input[name="model"]').val() + '.:/';
        $('body>main>article').append('<input id="model" type="checkbox"><dialog><header>淘口令' + action + '</header><section><p>长按或选中右击复制</p><p><b>' + model + '</b></p><p>复制成功打开手机淘宝即可' + action + '</p></section><footer><label id="copymodel"data-clipboard-text="' + model + '">复制</label><label for="model">确定</label></footer></dialog>');
        $('#copymodel').ready(function () {
            if ($(this).length == 0) {
                return false;
            }
            var copymodel = new ClipboardJS('#copymodel');
            copymodel.on('success', function (e) {
                document.getElementById('copymodel').innerText = '复制成功';
                $('#copymodel').text('复制成功');
            });
            copymodel.on('error', function (e) {
                $('#copymodel').text('复制失败');
            });
        });
    }

    //二维码
    if ($('body>main>article label[for="qr"]').length > 0) {
        var url = $('input[name="u"]').val();
        if (url.substr(0, 2) == '//') {
            url = 'https:' + url;
        }
        url = encodeURIComponent(url);
        var src_1 = 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=' + url + '&h=400&w=400&logo=https://img.alicdn.com/tps/i3/T1OjaVFl4dXXa.JOZB-114-114.png&';
        var id = $('input[name="id"]').val();
        var model = $('input[name="model"]').val();
        var img = $('body>main>article figure img').attr('data-original-url') || $('body>main>article figure img').attr('src');
        var src_2 = 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=' + encodeURIComponent('http://' + window.location.host + '/0/?id=' + id + '&u=' + url + '&model=' + model) + '&h=400&w=400&logo=' + img + '&';

        $('body>main>article').append('<input id="qr" type="checkbox"><dialog><header>二维码' + action + '</header><section><input tab="" id="qr-t" type="checkbox"><div tab=""><img src="' + src_1 + '" alt="淘宝APP二维码"><p>[淘宝二维码] 使用淘宝或天猫APP扫码' + action + '</p></div><div tab=""><img src="' + src_2 + '" alt="通用二维码"><p>[通用二维码] 扫描或长按识别二维码' + action + '</p></div></section><footer><label for="qr-t">切换</label> <label for="qr">确定</label></footer></dialog>');
    }

    //分享
    if ($('body>main>article label[for="share"]').length > 0) {
        var s = {};
        s['id'] = $('input[name="id"]').val();
        s['img'] = $('body>main>article figure img').attr('data-original-url') || $('body>main>article figure img').attr('src');
        s['price'] = $('body>main>article address>p em[p]').text() || 0;
        s['oprice'] = $('body>main>article address>p em[o]').text() || 0;
        s['coupon'] = $('body>main>article address>p em[c]').text() || 0;
        s['title'] = $('body>main>article>h2').text() || $('body>main>article>h1').text();

        var img_src = '/0/share.html?';
        $.each(s, function (i, v) {
            img_src += '&' + i + '=' + v;
        });

        s['model'] = $('input[name="model"]').val() || '';
        s['category'] = $('body>main>article address>p a[c]').text() || '';

        var s_t = '0.0<br><img src="' + s['img'] + '"><br>';
        s_t += '#' + s['category'] + '#' + s['title'] + '<br>';
        if (s['oprice']) {
            s_t += '【原售价】' + s['oprice'] + '元';
        }
        if (s['price']) {
            if (s['coupon']) {
                s_t += '【在售价】' + s['price'] + '元<br>';
            } else {
                s_t += '【优惠价】' + s['price'] + '元<br>';
            }
        } else {
            s_t += '【在售价】?元<br>';
        }
        if (s['coupon']) {
            s_t += '【券后价】' + (s['price'] - s['coupon']).toFixed(2) + '元';
            s_t += '【优惠券】' + s['coupon'] + '元<br>';
        }
        if (s['model']) {
            //s['model'] = s['model'].replace('￥','₳');
            s_t += '【淘口令】' + s['model'] + '<br>';
            s_t += '(复制此内容，打开淘宝或天猫APP，即可' + action + ')<br>';
        }
        s_t += '详情：' + window.location.href;

        var url = $('input[name="u"]').val();
        if (url.substr(0, 2) == '//') {
            url = 'https:' + url;
        }
        url = encodeURIComponent(url);
        var qrimg = 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=' + url + '&h=400&w=400&logo=https://img.alicdn.com/tps/i3/T1OjaVFl4dXXa.JOZB-114-114.png&';

        $('body>main>article').append('<input id="share"type="checkbox"><dialog><header>分享文字或图片</header><section><div id="share_div"><input id="share_type"type="checkbox"><div id="share_img" data-iframe="' + img_src + '"><src src="' + qrimg + '"></div><div id="share_text"><div>' + s_t + '<input id="copysharetext" type="submit" value="点击复制"></div></div></div></section><footer><label for="share_type">图片/文字</label><label for="share">收起窗口</label></footer></dialog>');

        $('#share').click(function () {
            if (document.querySelector('#share_img>iframe') == null) {
                var share_img = document.getElementById('share_img');
                var iframe_url = share_img.getAttribute('data-iframe');
                var iframe = document.createElement('iframe');
                iframe.src = iframe_url;
                share_img.appendChild(iframe);
                $('#share_img>img').hide();
            }
        });

        $('#copysharetext').ready(function () {
            if ($(this).length == 0) {
                return false;
            }
            var copysharetext = new ClipboardJS('#copysharetext', {
                target: function (e) {
                    return document.getElementById('share_text');
                }
            });
            copysharetext.on('success', function (e) {
                $('#copysharetext').val('复制成功去分享吧');
            });
            copysharetext.on('error', function (e) {
                $('#copysharetext').val('复制失败,请长按或选中右击复制。');
            });
        });
    }

});


//幻灯片
$('main>article figure').ready(function () {
    if ($('main>article figure img').length == 0) {
        return false;
    }
    $('main>article figure').addClass('swiper-wrapper').css('width', '100%').parent().addClass('swiper-container').css('overflow', 'hidden');
    $('main>article figure img').addClass('swiper-slide');
    $('main>article figure img').css('padding', '0');
    $('main>article figure').after('<div class="p"></div>');

    pics = new Swiper('.swiper-container', {
        wrapperClass: 'swiper-wrapper',
        slideClass: 'swiper-slide',
        slidesPerView: 'auto',
        direction: 'horizontal',
        pagination: {
            el: '.p',
            clickable: true,
            bulletElement: 'a',
            bulletActiveClass: 'active',
        },
        centeredSlides: true,
        spaceBetween: 10,
        autoplay: false,
        grabCursor: true,
        mousewheel: true,
        clickable: true,
        loop: true
    });
    $('.swiper-wrapper').hover(function () {
        pics.autoplay.stop();
    }, function () {
        pics.autoplay.start();
    });
});


//快捷操作
$('body').append('<s><i t title="回顶部"></i><i r title="上一页"></i></s>');
$('body>s>i[t]').click(function () {
    $('body,html').animate({ scrollTop: 0 }, 400);
});
$('body>s>i[r]').click(function () {
    history.back();
});
$(window).scroll(function () {
    $('body>s').hide();
    clearTimeout($.data(this, 'scrollTimer'));
    $.data(this, 'scrollTimer', setTimeout(function () {
        $('body>s').show();
        if ($(window).scrollTop() > 100) {
            $('body>s>i[t]').show();
        } else {
            $('body>s>i[t]').hide();
        }
        if (document.referrer.indexOf(window.location.host) > 0) {
            $('body>s>i[r]').show();
        } else {
            $('body>s>i[r]').hide();
        }
    }, 800));
});


$('body').ready(function () {
    //网站地图
    if (window.location.pathname == '/') {
        $.ajax({
            url: '/?sitemap=true',
            cache: true,
            async: true
        });
    }

    //baidu提交
    !function () { var e = /([http|https]:\/\/[a-zA-Z0-9\_\.]+\.baidu\.com)/gi, r = window.location.href, t = document.referrer; if (!e.test(r)) { var o = "https://sp0.baidu.com/9_Q4simg2RQJ8t7jm9iCKT-xh_/s.gif"; t ? (o += "?r=" + encodeURIComponent(document.referrer), r && (o += "&l=" + r)) : r && (o += "?l=" + r); var i = new Image; i.src = o } }(window);

    //cnzz统计
    $("body>footer").append('<span id="cnzz_stat_icon_1279114273" style="display:none">cnzz</span>');
    var cnzz_s_tag = document.createElement('script'); cnzz_s_tag.type = 'text/javascript'; cnzz_s_tag.async = true; cnzz_s_tag.charset = 'utf-8'; cnzz_s_tag.src = 'https://c.cnzz.com/stat.php?id=1279114273&async=1&online=2'; var root_s = document.getElementsByTagName('script')[0]; root_s.parentNode.insertBefore(cnzz_s_tag, root_s);
});
