'use strict';

// CDN路径
var cdn_path = '/static/';

var lazysizes_path = 'https://cdn.staticfile.org/lazysizes/5.3.2/lazysizes.min.js';
var viewer_js_path = 'https://cdn.staticfile.org/viewerjs/1.11.4/viewer.min.js';
var viewer_css_path = 'https://cdn.staticfile.org/viewerjs/1.11.4/viewer.min.css';
var clipboard_js_path = 'https://cdn.staticfile.org/clipboard.js/2.0.11/clipboard.min.js';

var swiper_js_path = 'https://cdn.staticfile.org/Swiper/5.4.5/js/swiper.min.js';
var swiper_css_path = 'https://cdn.staticfile.org/Swiper/5.4.5/css/swiper.min.css';

// var swiper_bundle_js_path = 'https://cdn.staticfile.org/Swiper/10.0.4/swiper-bundle.min.js';
// var swiper_bundle_css_path = 'https://cdn.staticfile.org/Swiper/10.0.4/swiper-bundle.min.css';

// var lazysizes_path = 'https://lib.baomitu.com/lazysizes/5.3.2/lazysizes.min.js';
// var viewer_js_path = 'https://lib.baomitu.com/viewerjs/1.11.3/viewer.min.js';
// var viewer_css_path = 'https://lib.baomitu.com/viewerjs/1.11.3/viewer.min.css';
// var clipboard_js_path = 'https://lib.baomitu.com/clipboard.js/2.0.11/clipboard.min.js';

// var swiper_js_path = 'https://lib.baomitu.com/Swiper/5.4.5/js/swiper.min.js';
// var swiper_css_path = 'https://lib.baomitu.com/Swiper/5.4.5/css/swiper.min.css';
// var swiper_bundle_js_path = 'https://lib.baomitu.com/Swiper/10.0.4/swiper-bundle.min.js';
// var swiper_bundle_css_path = 'https://lib.baomitu.com/Swiper/10.0.4/swiper-bundle.min.css';

// 动态加载js
function loadJs(url, callback) {
    var ele = document.querySelector('script[load-js="' + url + '"]');
    if (ele) {
        if (callback) {
            if (ele.complete) {
                callback();
            } else {
                if (ele.addEventListener) {
                    ele.addEventListener('load', callback, false);
                } else {
                    ele.attachEvent('onreadystatechange', callback);
                }
            }
        }
        return false;
    }

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.setAttribute('load-js', url);
    if (callback) {
        if (script.addEventListener) {
            script.addEventListener('load', callback, false);
        } else {
            script.attachEvent('onreadystatechange', callback);
        }
    }
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}

// 图片延迟加载
function lazyload(eles, src) {
    if (eles.length == 0) {
        return false;
    }
    src = src || 'src';
    var eles_length = eles.length;
    for (var i = 0; i < eles_length; i++) {
        var ele = eles[i];
        if (ele.hasAttribute('lazyload')) {
            continue;
        }
        ele.setAttribute('lazyload', true);

        if (ele.src.indexOf('.gif') != -1 || ele.src.indexOf('/imgextra/') != -1 || ele.src.indexOf('_400x400q90') != -1) {
            ele.setAttribute('data-src', ele.src);
        } else if (ele.src.indexOf('.alicdn.com') != -1 || ele.src.indexOf('.tbcdn.cn') != -1) {
            ele.setAttribute('data-src', ele.src + '_400x400q90');
        } else {
            ele.setAttribute('data-src', ele.src);
        }

        ele.src = cdn_path + 'lazyload.gif';
        ele.setAttribute('class', (ele.getAttribute('class') || '') + ' ' + 'lazyload');
    }
    loadJs(lazysizes_path);
}
lazyload(document.querySelectorAll('main img,aside img'));

// 动态加载Css
function loadCss(href, callback) {
    if (document.querySelector('link[load-css="' + href + '"]')) {
        if (callback) {
            callback();
        }
        return false;
    }
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.setAttribute('load-css', href);
    link.href = href;
    if (callback) {
        link.onreadystatechange = callback;
        link.onload = callback;
    }
    document.getElementsByTagName('head')[0].appendChild(link);
}

//链接处理
function links() {
    var links_blank = document.querySelectorAll('a[href^="/go?"]:not([target]),a[href^="/go_"]:not([target]),a[href^="go?"]:not([target]),a[href^="go_"]:not([target]),a[href^="/static/go.html"]:not([target])');
    if (links_blank.length > 0) {
        for (var i = 0; i < links_blank.length; i++) {
            links_blank[i].setAttribute('target', '_blank');
        }
    }

    var is_standalone = false;
    try {
        is_standalone = window.matchMedia('(display-mode: standalone)').matches;
    } catch (error) { }
    if (!is_standalone) {
        var input = document.querySelector('input[name="w"]');
        if (!input || !input.value) {
            var forms_blank = document.querySelectorAll('form');
            if (forms_blank.length > 0) {
                for (var i = 0; i < forms_blank.length; i++) {
                    forms_blank[i].setAttribute('target', '_blank');
                }
            }
        }
    }
}
links();

// 图片预览
function images_viewer() {
    if (!document.querySelector('article img,section>div img')) {
        return false;
    }
    var articles = document.querySelectorAll('article:not([viewer]),section>div:not([viewer])');

    var viewer_js = function () {
        for (var i = 0; i < articles.length; i++) {
            new Viewer(articles[i], {
                url: function (image) {
                    return image.getAttribute('data-src') || image.src;
                },
                shown: function () {
                    lazyload(document.querySelectorAll('.viewer-list li img:not([lazyload])'), 'data-original-url');
                },
                view: function (o) {
                    var url = o.detail.image.src;
                    o.detail.image.src = url.replace('_400x400q90', '');
                }
            });
            articles[i].setAttribute('viewer', true);
        }
    }

    // loadCss(cdn_path + 'viewer.min.css');
    // loadJs(cdn_path + 'viewer.min.js', viewer_js);
    loadCss(viewer_css_path);
    loadJs(viewer_js_path, viewer_js);
}
images_viewer();

// 商品幻灯片
(function () {
    if (!document.querySelector('main>article figure img')) {
        return false;
    }

    // 初始化
    var figures = document.querySelectorAll('main>article figure');
    for (var i = 0; i < figures.length; i++) {
        var figure = figures[i];
        figure.className = 'goods-wrapper';
        figure.parentElement.className = 'goods-container';
        figure.parentElement.scrollLeft = 0;
        figure.parentElement.style.overflow = "hidden";
        figure.insertAdjacentHTML('afterend', '<i class="p"></i>');
    }

    var imgs = document.querySelectorAll('main>article figure img');
    for (var i = 0; i < imgs.length; i++) {
        imgs[i].setAttribute('class', (imgs[i].getAttribute('class') || '') + ' ' + 'goods-slide');
    }

    // 执行
    var swiper_js = function () {
        var goods_swiper = new Swiper('.goods-container', {
            wrapperClass: 'goods-wrapper',
            slideClass: 'goods-slide',
            slidesPerView: 'auto',
            direction: 'horizontal',
            pagination: {
                el: '.p',
                clickable: true,
                bulletElement: 'a',
                bulletActiveClass: 'active',
            },
            centeredSlides: true,
            spaceBetween: 0,
            autoplay: true,
            loopedSlides: 1,
            lazy: {
                lazy: true,
                loadPrevNext: true,
                loadPrevNextAmount: 1,
                elementClass: 'lazyload',
                loadingClass: 'lazyloading',
                loadedClass: 'lazyloaded',
            },
            grabCursor: true,
            mousewheel: true,
            clickable: true,
            loop: true
        });

        if (goods_swiper.length > 1) {
            for (var i = 0; i < goods_swiper.length; i++) {
                (function (goods_swiper_i) {
                    goods_swiper_i.el.onmouseover = function () {
                        goods_swiper_i.autoplay.stop();
                    }
                    goods_swiper_i.el.onmouseout = function () {
                        goods_swiper_i.autoplay.start();
                    }
                })(goods_swiper[i]);
            }
        } else {
            goods_swiper.el.onmouseover = function () {
                goods_swiper.autoplay.stop();
            }
            goods_swiper.el.onmouseout = function () {
                goods_swiper.autoplay.start();
            }
        }
        lazyload(document.querySelectorAll('main>article figure img'));
    }

    // loadCss(cdn_path + (is_es5() ? 'swiper.min.css' : 'swiper-bundle.min.css'));
    // loadJs(cdn_path + (is_es5() ? 'swiper.min.js' : 'swiper-bundle.min.js'), swiper_js);
    // loadCss(swiper_css_path);
    loadJs(swiper_js_path, swiper_js);
})();

// 商品列表幻灯片
(function () {
    if (!document.querySelector('main>div figure img')) {
        return false;
    }

    // 初始化
    var divs = document.querySelectorAll('main>div figure>div');
    for (var i = 0; i < divs.length; i++) {
        var div = divs[i];
        div.className = 'swiper-w';
        div.parentElement.className = 'swiper-c';
        div.parentElement.scrollLeft = 0;
        div.parentElement.style.overflow = 'hidden';
    }

    var figure_links = document.querySelectorAll('main>div figure>div>a');
    for (var i = 0; i < figure_links.length; i++) {
        figure_links[i].className += ' swiper-s';
    }

    // 执行
    var swiper_js = function () {
        var goods_swiper = new Swiper('.swiper-c', {
            wrapperClass: 'swiper-w',
            slideClass: 'swiper-s',
            slidesPerView: 'auto',
            direction: 'horizontal',
            centeredSlidesBounds: true,
            touchMoveStopPropagation: true,
            centeredSlides: true,
            spaceBetween: 10,
            grabCursor: true,
            clickable: true,
            loop: true,
            lazy: {
                lazy: true,
                loadPrevNext: true,
                loadPrevNextAmount: 2,
                elementClass: 'lazyload',
                loadingClass: 'lazyloading',
                loadedClass: 'lazyloaded'
            },
            autoplay: true,
            delay: 4000
        });

        if (goods_swiper.length > 1) {
            for (var i = 0; i < goods_swiper.length; i++) {
                (function (goods_swiper_i) {
                    goods_swiper_i.el.onmouseover = function () {
                        goods_swiper_i.autoplay.stop();
                    }
                    goods_swiper_i.el.onmouseout = function () {
                        goods_swiper_i.autoplay.start();
                    }
                })(goods_swiper[i]);
            }
        } else {
            goods_swiper.el.onmouseover = function () {
                goods_swiper.autoplay.stop();
            }
            goods_swiper.el.onmouseout = function () {
                goods_swiper.autoplay.start();
            }
        }
        links();
    }

    // loadCss(cdn_path + (is_es5() ? 'swiper.min.css' : 'swiper-bundle.min.css'));
    // loadJs(cdn_path + (is_es5() ? 'swiper.min.js' : 'swiper-bundle.min.js'), swiper_js);
    // loadCss(swiper_css_path);
    loadJs(swiper_js_path, swiper_js);
})();

// 填充详情&属性
(function () {

    // 详情
    var desc_n = document.querySelector('body>main>section>div>div[n]');
    if (desc_n) {
        var desc = '';
        var imgs = document.querySelectorAll('main>article figure img');
        for (var i = 0; i < imgs.length; i++) {
            var img = imgs[i];
            var src = img.getAttribute('data-original-url') || img.getAttribute('data-src') || img.src;
            src = src.replace('_400x400q90', '');
            if (desc.indexOf(src) == -1) {
                desc += '<img class="lazyload" alt="商品详情图" lazyload data-src="' + src + '" src="' + cdn_path + 'lazyload.gif' + '">';
            }
        }
        desc_n.insertAdjacentHTML('beforeend', desc);
        desc_n.removeAttribute('n');
    }

    // 属性
    var attr_n = document.querySelector('body>main>section>ol[n]');
    if (attr_n) {
        var attr = document.querySelector('body>main>article>div[info]>p').innerHTML.replace(/i>/g, 'li>');
        attr_n.insertAdjacentHTML('beforeend', attr);
        attr_n.removeAttribute('n');
    }

    //点击收起
    var fold_button = document.querySelector('main>section>div>label[i]');
    if (fold_button) {
        fold_button.onclick = function () {
            window.scrollTo({
                top: document.querySelector('body>main>article').offsetTop,
                behavior: 'smooth'
            });
        };
    }
})();

// 是否IE
// function is_es5() {
//     try {
//         var isES6Supported = Function("() => {}")();
//         return false;
//     } catch (err) {
//         return true;
//     }
// }

// AJAX
function AJAX(options) {
    options = options || {};
    options.type = (options.type || "GET").toUpperCase();
    options.async = (options.async == undefined) ? true : options.async;
    var params = options.processData == false ? options.data : formatParams(options.data, (options.cache == false ? true : false));
    if (window.XMLHttpRequest) {
        var xhr = new XMLHttpRequest();
    } else {
        var xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (options.type == 'GET') {
        if (params) {
            if (options.url.indexOf('?') == -1) {
                params = '?' + params;
            } else {
                params = '&' + params;
            }
        }
        xhr.open('GET', options.url + params, options.async);
        if (typeof options.cache == 'number') {
            xhr.setRequestHeader('Cache-Control', 'public, max-age=' + options.cache);
        }
        if (options.headers) {
            for (var key in options.headers) {
                xhr.setRequestHeader(key, options.headers[key]);
            }
        }
        xhr.send();
    } else if (options.type == 'POST') {
        xhr.open('POST', options.url, options.async);
        if (options.contentType !== false) {
            xhr.setRequestHeader("Content-Type", options.contentType || 'application/x-www-form-urlencoded');
        }
        if (options.headers) {
            for (var key in options.headers) {
                xhr.setRequestHeader(key, options.headers[key]);
            }
        }
        xhr.send(params);
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            options.callback && options.callback(xhr.responseText, xhr);
        };
    };
    function formatParams(data, rand) {
        var arr = [];
        for (var k in data) {
            if (typeof data[k] == 'object') {
                if (data[k].name && data[k].value != undefined) {
                    arr.push(encodeURIComponent(data[k].name) + "=" + encodeURIComponent(data[k].value));
                } else {
                    for (var kk in data[k]) {
                        arr.push(encodeURIComponent(kk) + "=" + encodeURIComponent(data[k][kk]));
                    }
                }
            } else {
                arr.push(encodeURIComponent(k) + "=" + encodeURIComponent(data[k]));
            }
        }
        if (rand) {
            arr.push('_=' + Date.now());
        }
        return arr.join("&");
    }
}

// 搜索表单自动完成
(function () {
    var search = document.querySelector('body>header>form>input[type="search"]');
    if (!search) {
        return false;
    }

    var script = document.createElement('script');
    document.getElementsByTagName('head')[0].appendChild(script);

    search.addEventListener("input", function (e) {
        var val = this.value;
        if (!val) { return false; }

        var new_script = document.createElement("script");
        new_script.src = 'https://suggest.taobao.com/sug?code=utf-8&callback=suggest_taobao_autocomplete&q=' + val + '&t=' + (new Date()).getTime();
        new_script.type = 'text/javascript';
        script.parentNode.replaceChild(new_script, script);
        script = new_script;
    });

    search.setAttribute('list', 'autocomplete');
    var datalist = document.createElement('datalist');
    datalist.id = 'autocomplete';
    document.querySelector('body>header>form').appendChild(datalist);

    window.suggest_taobao_autocomplete = function (data) {
        if (!data) {
            return false;
        }
        if (!data.result) {
            return false;
        }
        if (!data.result.length) {
            return false;
        }
        var html = '';
        for (var i = 0; i < data.result.length; i++) {
            html += '<option value="' + data.result[i][0] + '">';
        }
        datalist.innerHTML = html;
        datalist.style.display = 'black';
    }
})();

// 折扣数
function discount(zp, op) {
    var d = String(10 / parseFloat(op / zp));
    return d.substring(0, 3) + '折';
}

// 数据列表
function datas_list(data, type) {
    var html = '';
    if (data.length == 0) {
        return html;
    }
    switch (type) {
        case 'search':
            for (var k in data) {
                var v = data[k];
                html += '<a href="search?w=' + v.k + '">';
                html += '<img src="' + v.p + '"><i>' + v.k + '</i>';
                html += '</a>';
            }
            break;
        case 'tag':
            for (var k in data) {
                var v = data[k];
                html += '<a href="tag_' + v.k + '.html">';
                html += '<img src="' + v.p + '"><i>' + v.k + '</i>';
                html += '</a>';
            }
            break;
        case 'category':
            for (var k in data) {
                var v = data[k];
                html += '<a href="category_' + v.k + '.html">';
                html += '<img src="' + v.p + '"><i>' + v.n + '</i>';
                html += '</a>';
            }
            break;
        case 'promotion':
            var time = Date.now();
            for (var k in data) {
                var v = data[k];
                html += '<li>';

                html += '<a href="/go?url=' + encodeURIComponent(v.promotion_extend.promotion_url) + '" target="_blank">';
                html += '<i>';
                html += '<img src="' + v.shop_picture_url + '">';
                html += '</i>';

                var promotion_list = v.promotion_list.promotion_list[0];
                html += '<em>';
                html += '<b>' + promotion_list.entry_discount + '</b>';
                html += '<i>';
                html += v.condition_type == 1 ? '满元' : '满件';
                html += promotion_list.entry_condition;
                html += v.discount_type == 1 ? '抵扣' : '折扣';
                html += '</i>';
                html += '</em>';
                html += '<h4>' + v.shop_title + ' - ' + v.promotion_type + '</h4>';

                html += '<p>';
                if (time > promotion_list.entry_used_start_time) {
                    if (promotion_list.entry_used_end_time < time) {
                        html += '<i>已结束</i>';
                    } else {
                        html += '<i cd="' + promotion_list.entry_used_end_time + '" c>进行中</i>';
                    }
                } else {
                    html += '<i cd="' + promotion_list.entry_used_start_time + '">未开始</i>';
                }
                html += '<i>' + v.remain_count + '/' + v.total_count + '</i>';
                html += '</p>';

                html += '</a>';
                html += '</li>';
            }
            break;
        default:
            for (var k in data) {
                var v = data[k];
                html += '<li>';

                html += '<a href="goods_' + v.item_id + '.html">';
                html += '<i>';
                html += '<img src="' + v.pict_url + '">';
                if (typeof (v.item_description) == 'string') {
                    html += '<u>' + v.item_description + '</u>';
                }
                html += '</i>';
                html += '<em>';
                var buy = '优惠';
                if (v.hasOwnProperty('coupon_amount') && v.coupon_amount != 0) {
                    html += '<b>' + (v.zk_final_price - v.coupon_amount).toFixed(1) + '</b><i>券后价</i><s>' + v.zk_final_price + '</s>';
                } else {
                    html += '<b>' + v.zk_final_price + '</b>';
                    if (v.zk_final_price == v.reserve_price) {
                        html += '<i>低价</i>';
                        buy = '低价';
                    } else {
                        buy = discount(v.zk_final_price, v.reserve_price);
                        html += '<i>' + buy + '</i><s>' + v.reserve_price + '</s>';
                    }
                }
                html += '</em>';
                html += '<h4>' + v.title + '</h4>';

                if (v.hasOwnProperty('tqg_online_end_time')) {
                    html += '<p>';
                    html += '<i cd="' + v.tqg_online_end_time + '" c>抢购中</i>';
                    html += '<i>已抢' + v.tqg_sold_count + '/' + v.tqg_total_count + '</i>';
                    html += '</p>';
                } else {
                    var shop = '';
                    if (v.hasOwnProperty('user_type')) {
                        shop = (v.user_type == '1') ? 'm' : 'b';
                    }
                    html += '<p ' + shop + '>';
                    html += '<i>' + ((shop == 'm') ? '天猫' : '淘宝') + '月销' + v.volume + '</i>';
                    if (v.hasOwnProperty('nick')) {
                        html += '<i>' + v.nick + '</i>';
                    } else if (v.hasOwnProperty('level_one_category_name')) {
                        html += '<i>' + v.level_one_category_name + '</i>';
                    }
                    html += '</p>';
                }

                html += '</a>';

                var url = '';
                if (v.hasOwnProperty('coupon_share_url')) {
                    url = v.coupon_share_url;
                } else if (v.hasOwnProperty('url')) {
                    url = v.url;
                } else if (v.hasOwnProperty('click_url')) {
                    url = v.click_url;
                }
                url = 'go?url=' + encodeURIComponent(url) + '&id=' + v.item_id;
                html += '<a buy href="' + url + '">';
                if (v.hasOwnProperty('coupon_amount') && v.coupon_amount != 0) {
                    html += v.coupon_amount + '元优惠券';
                } else {
                    html += buy + '购买';
                }
                html += '</a>';

                html += '</li>';
            }
            break;
    }
    return html;
}

// 列表分页
function list_pages(data, nav) {
    // 基础参数
    var html = '';
    var url = function (p) {
        return data.url.replace('{page}', p);
    }

    if (data.total || data.max) {

        // 判断是否需要分页
        if (data.total && data.total <= data.size) {
            return '';
        }

        // 初始参数
        if (!data.max) {
            var mp = data.total / data.size;
            if (mp % 1 > 0) {
                data.max = parseInt(mp) + 1;
            } else {
                data.max = mp;
            }
        }

        // 首页
        if (data.page > 3) {
            html += (data.page == 1) ? '' : '<a href="' + url(1) + '">&lt;&lt;</a>';
        }

        // 中上
        var start;
        if (data.page > data.max) {
            start = (data.max - 2) > 0 ? data.max - 2 : 1;
            for (var i = start; i <= data.max; i++) {
                html += '<a href="' + url(i) + '">' + i + '</a>';
            }
        } else {
            start = (data.page - 2) > 0 ? data.page - 2 : 1;
            for (var i = start; i < data.page; i++) {
                html += '<a href="' + url(i) + '">' + i + '</a>';
            }
        }

        // 当前
        html += '<i>' + data.page + '</i>';

        // 中下
        var end = (data.page + 4) < data.max ? data.page + 4 : data.max;
        for (var i = data.page + 1; i <= end; i++) {
            html += '<a href="' + url(i) + '">' + i + '</a>';
        }

        // 尾页
        if (data.max > 6) {
            html += (data.page == data.max) ? '' : '<a href="' + url(data.max) + '">&gt;&gt;</a>';
        }

    } else if (data.now || data.now == 0) {

        // 上页
        if (data.page != 1) {
            html += '<a href="' + url(data.page - 1) + '">&lt;</a>';
        }

        // 中上
        if (data.page > 2) {
            var start = (data.page - 2) > 0 ? data.page - 2 : 1;
            for (var i = start; i < data.page; i++) {
                html += '<a href="' + url(i) + '">' + i + '</a>';
            }
        }

        html += '<i>' + data.page + '</i>';

        // 下页
        if (data.now == data.size) {
            html += '<a href="' + url(data.page + 1) + '">&gt;</a>';
        }
    }

    if (nav == false) {
        return html;
    }
    return '<nav p="' + data.page + '">' + html + '</nav>';
}

// 倒计时处理
function countdown() {
    if (!document.querySelector('[cd]')) {
        return;
    }
    var cds = document.querySelectorAll('[cd]');
    for (var i = 0; i < cds.length; i++) {
        var e = cds[i];
        var td = e.getAttribute('cd');
        var s = (e.hasAttribute('[c]')) ? '后结束' : '后开始';
        if (td && isNaN(td) == false) {
            td = parseInt(td);
        }
        var t = new Date(td);
        var tc = t - new Date();
        if (tc > 172800000) {
            e.innerHTML = parseInt(tc / 1000 / 60 / 60 / 24) + '天' + s;
            return;
        }
        if (tc > 0) {
            setInterval(function () {
                var nowtime = new Date();
                var time = t - nowtime;
                var day = parseInt(time / 1000 / 60 / 60 / 24);
                var hour = parseInt(time / 1000 / 60 / 60 % 24);
                var minute = parseInt(time / 1000 / 60 % 60);
                var seconds = parseInt(time / 1000 % 60);
                if (!day) {
                    e.innerHTML = hour + ':' + minute + ':' + seconds + s;
                } else {
                    e.innerHTML = day + '天' + hour + ':' + minute + ':' + seconds + s;
                }
            }, 1000);
        }
        e.removeAttribute('cd');
    }
}
countdown();

// 加载更多
(function () {
    var pages = document.querySelector('nav[p]');
    if (!pages) {
        return false;
    }
    var page = parseInt(pages.getAttribute('p')) || 0;
    var max_page = parseInt(pages.getAttribute('m')) || 0;
    if (max_page != 0 && page >= max_page) {
        return false;
    }
    var lists = pages.previousElementSibling;
    lists.getAttribute('page', page);
    var lists_parent = lists.parentElement;
    var load_lock = false;
    var load_num = 2;
    pages.insertAdjacentHTML('beforeend', '<span></span>');
    window.addEventListener("scroll", function () {
        if (load_lock || load_num <= 0) {
            return false;
        }
        page = parseInt(lists.getAttribute('page')) || page;
        if (max_page != 0 && page >= max_page) {
            pages.querySelector('span').style.display = 'none';
            return false;
        }
        if (((document.documentElement.scrollTop || document.body.scrollTop) + (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight)) > (lists_parent.offsetHeight + lists_parent.offsetTop)) {
            load_lock = true;
            AJAX({
                type: 'GET',
                url: window.location.href,
                data: { page: (page + 1), ajax: 'true' },
                callback: function (datas) {
                    if (datas) {
                        try {
                            datas = JSON.parse(datas);
                        } catch (error) {
                            load_num = load_num - 1;
                            pages.querySelector('span').style.display = 'none';
                            return;
                        }
                    }
                    if (datas.list) {
                        if (datas.list.length == 0) {
                            load_num = 0;
                            if (page == 1) {
                                pages.style.display = 'none';
                            } else {
                                pages.querySelector('span').style.display = 'none';
                            }
                            return;
                        }
                        lists.insertAdjacentHTML('beforeend', datas_list(datas.list, datas.type));
                        if (datas.page) {
                            pages.innerHTML = list_pages(datas.page, false) + '<span></span>';
                        }
                        links();
                        lazyload(document.querySelectorAll('main ul img'));
                        countdown();
                        lists.setAttribute('page', page + 1);
                    }
                    load_num = load_num - 1;
                    if ((load_num <= 0) || (!datas.page)) {
                        pages.querySelector('span').style.display = 'none';
                        load_lock = true;
                    } else {
                        load_lock = false;
                    }
                }
            });
        }
    });
})();

// 二维码&淘口令&分享
(function () {

    if (!document.querySelector('body>main>article')) {
        return false;
    }

    // 行为
    var action = (document.querySelector('body>main>article>q')) ? '领券' : '购买';

    //二维码
    if (document.querySelector('body>main>article label[for="qr"]')) {
        var url = document.querySelector('input[name="url"]').value;
        if (url.substr(0, 2) == '//') {
            url = 'https:' + url;
        }
        url = encodeURIComponent(url);
        // var src_1 = 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=' + url + '&h=400&w=400&logo=https://img.alicdn.com/tps/i3/T1OjaVFl4dXXa.JOZB-114-114.png&';
        var src_1 = 'https://quickchart.io/qr?margin=0&size=400&ecLevel=Q&centerImageUrl=https%3A%2F%2Fimg.alicdn.com%2Ftps%2Fi3%2FT1OjaVFl4dXXa.JOZB-114-114.png&text=' + url + '&';

        var id = document.querySelector('input[name="id"]').value;
        var model = document.querySelector('input[name="model"]').value;
        // var img = document.querySelector('body>main>article figure img').getAttribute('data-original-url') || document.querySelector('body>main>article figure img').getAttribute('data-src') || document.querySelector('body>main>article figure img').getAttribute('src');
        // var src_2 = 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=' + encodeURIComponent('http://' + window.location.host + '/go?id=' + id + '&url=' + url + '&model=' + model) + '&h=400&w=400&logo=' + img + '&';
        var src_2 = 'https://quickchart.io/qr?margin=0&size=400&ecLevel=Q&text=' + encodeURIComponent('http://' + window.location.host + '/go?id=' + id + '&url=' + url + '&model=' + model) + '&';

        document.querySelector('body>main>article').insertAdjacentHTML('beforeend', '<input id="qr" type="checkbox"><dialog><header>二维码' + action + '</header><section><input tab="" id="qr-t" type="checkbox"><div tab=""><img src="' + src_1 + '" alt="淘宝APP二维码"><p>[淘宝二维码] 使用淘宝或天猫APP扫码' + action + '</p></div><div tab=""><img src="' + src_2 + '" alt="通用二维码"><p>[通用二维码] 扫描或长按识别二维码' + action + '</p></div></section><footer><label for="qr-t">切换</label> <label for="qr">确定</label></footer></dialog>');
        lazyload(document.querySelectorAll('main img,aside img'));
    }

    //淘口令
    if (document.querySelector('body>main>article label[for="model"]')) {
        var model = Math.floor(Math.random() * 10) + '.' + document.querySelector('input[name="model"]').value + '.:/';

        document.querySelector('body>main>article').insertAdjacentHTML('beforeend', '<input id="model" type="checkbox"><dialog><header>淘口令' + action + '</header><section><p>长按或选中右击复制以下淘口令</p><p id="modelcopy" data-clipboard-text="' + model + '"><b>' + model + '</b></p><p>复制成功后打开淘宝或天猫APP即可' + action + '</p></section><footer><label id="copymodel" data-clipboard-text="' + model + '">一键复制</label><label for="model">确定</label></footer></dialog>');

        var copymodel_js = function () {
            var copymodel = document.getElementById('copymodel');
            if (!copymodel) {
                return false;
            }
            var copy = new ClipboardJS('#copymodel');
            copy.on('success', function (e) {
                copymodel.innerText = '复制成功';
            });
            copy.on('error', function (e) {
                copymodel.innerText = '手动复制';
            });
        }
        // loadJs(cdn_path + 'clipboard.min.js', copymodel);
        loadJs(clipboard_js_path, copymodel_js);
    }

    //分享
    if (document.querySelector('body>main>article label[for="share"]')) {
        var s = {};
        s['id'] = document.querySelector('input[name="id"]').value;
        s['img'] = document.querySelector('body>main>article figure img').getAttribute('data-original-url') || document.querySelector('body>main>article figure img').getAttribute('data-src') || document.querySelector('body>main>article figure img').getAttribute('src');
        s['price'] = document.querySelector('body>main>article>div[info]>div em>b[p]').innerText || 0;
        s['oprice'] = document.querySelector('body>main>article>div[info]>div em>b[o]') ? document.querySelector('body>main>article>div[info]>div em>b[o]').innerText : 0;
        s['coupon'] = document.querySelector('body>main>article>q>*>div>em') ? document.querySelector('body>main>article>q>*>div>em').innerText : 0;

        var info_t_i = document.querySelectorAll('body>main>article>div[info]>div[t]>i');
        var texts = Array.prototype.map.call(info_t_i, function (element) {
            return element.textContent;
        });
        s['tag'] = texts.join(',') || '';

        s['title'] = document.querySelector('body>main>article>div[info]>h2,body>main>article>div[info]>h1').innerText;

        var img_src = '/static/share.html?';
        for (var k in s) {
            img_src += '&' + k + '=' + s[k];
        }

        var info_b_i = document.querySelectorAll('body>main>article>div[info]>b>i');
        var texts = Array.prototype.map.call(info_b_i, function (element) {
            return element.textContent;
        });
        s['num'] = texts.join('、') || '';

        s['model'] = document.querySelector('input[name="model"]') ? document.querySelector('input[name="model"]').value : '';

        var s_t = '0.0<br><img alt="' + s['title'] + '" src="' + s['img'] + '"><br>';

        var categorys = document.querySelector('meta[property="og:product:category"][content]');
        if (categorys) {
            var category = categorys.getAttribute('content');
            if (category) {
                s_t += '#' + category.replace(/\//g, '# #') + '#<br>';
            }
        }

        s_t += s['title'] + '<br>';

        var title = document.querySelector('body>main>article>div[info]>h3,body>main>article>div[info]>h1').innerText || '';
        if (title && title != s['title']) {
            s_t += title + '<br>';
        }
        if (s['num']) {
            s_t += '[ ' + s['num'] + ' ]<br>';
        }
        if (s['oprice']) {
            s_t += '【原售价】' + s['oprice'] + '元';
        }
        if (s['price']) {
            if (s['coupon']) {
                s_t += '【在售价】' + s['price'] + '元<br>';
            } else {
                s_t += '【优惠价】' + s['price'] + '元<br>';
            }
        }
        if (s['coupon']) {
            s_t += '【券后价】' + (s['price'] - s['coupon']).toFixed(2) + '元';
            s_t += '【优惠券】' + s['coupon'] + '元<br>';
        }
        if (s['model']) {
            //s['model'] = s['model'].replace('￥','₳');
            s_t += '【淘口令】' + s['model'] + '<br>';
            s_t += '(复制此消息，打开淘宝或天猫APP，即可' + action + ')<br>';
        }
        s_t += '详情：' + window.location.href + '<br>';
        if (s['tag']) {
            s_t += '[ ' + s['tag'] + ' ]';
        }

        document.querySelector('body>main>article').insertAdjacentHTML('beforeend', '<input id="share" type="checkbox"><dialog><header>分享文字或图片</header><section><div share><input tab id="share_type" type="checkbox"><div tab><p>长按分享或保存图片发送给好友</p><iframe id="share_img" width="100%" height="100%" data-src="' + img_src + '" src="' + s['img'] + '"></iframe></div><div tab><div id="share_text">' + s_t + '<br><input id="copysharetext" type="submit" value="点击复制"></div></div></div></section><footer><label for="share_type">图片/文字</label> <label for="share">收起窗口</label></footer></dialog>');

        (function () {
            document.getElementById('share').addEventListener('click', function () {
                var share_img = document.getElementById('share_img');
                if (share_img.getAttribute('data-src')) {
                    share_img.setAttribute('src', share_img.getAttribute('data-src'));
                    share_img.removeAttribute('data-src');
                }
            });
        })();

        var copysharetext_js = function () {
            var copysharetext = document.getElementById('copysharetext');
            if (!copysharetext) {
                return false;
            }
            var copy = new ClipboardJS('#copysharetext', {
                target: function (e) {
                    return document.getElementById('share_text');
                }
            });
            copy.on('success', function (e) {
                copysharetext.value = '复制成功去分享吧';
                setTimeout(function () {
                    copysharetext.value = '点击复制';
                }, 8000);
            });
            copy.on('error', function (e) {
                copysharetext.value = '复制失败请长按或选中右击复制';
                setTimeout(function () {
                    copysharetext.value = '点击复制';
                }, 8000);
            });
        }
        // loadJs(cdn_path + 'clipboard.min.js', copysharetext_js);
        loadJs(clipboard_js_path, copysharetext_js);
    }

})();

//APP领券购买
(function () {
    var label = document.querySelector('body>main>article>q>label');
    var model = document.querySelector('body>main>article>nav>label[for="model"]');
    if (label && model) {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger' || ua.match(/baiduboxapp/i) == 'baiduboxapp') {
            label.setAttribute('for', 'model');
        }
    }
})();

//搜索提示改变
(function () {
    var search = document.querySelector('body>header>form>input[type="search"]');
    if (!search) {
        return false;
    }
    var search_placeholder = function () {
        var arr = ['最近想买的东西是不是有优惠了？', '可以复制商品标题搜索看看', '好像有什么东西该换新的了吧？', '最近买的东西有没有买贵了？', '查查家人喜欢的东西优惠力度大吗？', '天猫淘宝优惠商品都在这里哦', '家里是不是缺了点什么东西？', '最近有什么想吃的东西吗？', '最近有什么好玩的东西吗？', '给TA买个礼物吧？'];
        var index = Math.floor((Math.random() * arr.length));
        search.setAttribute('placeholder', arr[index]);
    };
    setTimeout(search_placeholder, 3000);
    var sp = setInterval(search_placeholder, 8000);
    search.addEventListener('focus', function () {
        clearInterval(sp);
        search.placeholder = '可输入商品关键词、标题、ID、链接';
        search.addEventListener('blur', function () {
            sp = setInterval(search_placeholder, 8000);
        });
    });
})();

// 快捷操作
(function () {
    document.body.insertAdjacentHTML('beforeend', '<s><i t title="回顶部"></i><i r title="上一页"></i></s>');

    (function () {
        document.querySelector('body>s>i[t]').onclick = function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        document.querySelector('body>s>i[r]').onclick = function () {
            history.back();
        }

        var sElements = document.querySelectorAll('body > s');
        var tIcon = document.querySelector('body>s>i[t]');
        var rIcon = document.querySelector('body>s>i[r]');
        window.addEventListener('scroll', function () {
            for (var i = 0; i < sElements.length; i++) {
                sElements[i].style.display = 'none';
            }
            clearTimeout(this.scrollTimer);
            this.scrollTimer = setTimeout(function () {
                for (var i = 0; i < sElements.length; i++) {
                    sElements[i].style.display = 'block';
                }
                if (window.pageYOffset > 100) {
                    tIcon.style.display = 'block';
                } else {
                    tIcon.style.display = 'none';
                }
                if (document.referrer.indexOf(window.location.host) > 0) {
                    rIcon.style.display = 'block';
                } else {
                    rIcon.style.display = 'none';
                }
            }, 800);
        });
    })();
})();

//关闭提示
(function () {
    if (document.referrer.indexOf(window.location.hostname) == -1) {
        window.addEventListener('beforeunload', function (event) {
            if (window.is_confirm !== false) {
                event.returnValue = '天猫淘宝的优惠券商品都在虎窝淘';
            }
        });

        window.addEventListener('mouseover', function (event) {
            window.is_confirm = false;
        });

        window.addEventListener('mouseleave', function (event) {
            window.is_confirm = true;
        });
    }
})();

// 其他
(function () {

    // 提示
    // console.log("%c\n _	  _  \n| |  | | \n| |__| |  _____    _____    _____   _____ \n|  __  | /  _  \\  /  _  \\  /  _  \\ /  ___\\ \n| |  | ||  |_|  ||  |_|  ||  |_|  |\\___  \\ \n|_|  |_| \\_____/  \\_____/  \\_____/ \\_____/ \n ", "color:#fa54b6");
    // console.log("%c\n欢迎访问虎窝淘！\n ", "color:#fa7e89");
    // console.log("%c\n意见反馈：https://www.hooos.com/ \n ", "color:#fba45e");

    document.addEventListener('DOMContentLoaded', function () {

        //百度主动提交
        var a = document.createElement("script"); "https" === window.location.protocol.split(":")[0] ? a.src = "https://zz.bdstatic.com/linksubmit/push.js" : a.src = "http://push.zhanzhang.baidu.com/push.js"; var b = document.getElementsByTagName("script")[0]; b.parentNode.insertBefore(a, b);

        //360主动提交
        //var src = (document.location.protocol == "http:") ? "http://js.passport.qihucdn.com/11.0.1.js?5d3c67eb55d22c0f5eb9d4f5ae86e8eb":"https://jspassport.ssl.qhimg.com/11.0.1.js?5d3c67eb55d22c0f5eb9d4f5ae86e8eb";document.write('<script src="' + src + '" id="sozz"><\/script>');
        //var a=document.createElement("script");a.id = 'sozz';a.src="https://jspassport.ssl.qhimg.com/11.0.1.js?d182b3f28525f2db83acfaaf6e696dba";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b);
        //var a=document.createElement("script");a.src="https://s.ssl.qhres.com/ssl/ab77b6ea7f3fbf79.js";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b);
        (function (e) { function t(e) { var t = location.href, n = t.split("").reverse(), r = e.split(""), i = []; for (var s = 0, o = 16; s < o; s++)i.push(r[s] + (n[s] || "")); return i.join("") } var n = /([http|https]:\/\/[a-zA-Z0-9\_\.]+\.so\.com)/gi, r = e.location.href; if (r && !n.test(r) && window.navigator.appName) { var i = "//s.360.cn/so/zz.gif", o = 'd182b3f28525f2db83acfaaf6e696dba', u = t(o), a = new Image; r && (i += "?url=" + encodeURIComponent(r)), o && (i += "&sid=" + o), u && (i += "&token=" + u), o && (a.src = i) } })(window);

        // analytics
        var analytics = document.createElement('script');
        analytics.type = 'text/javascript';
        analytics.async = true;
        analytics.src = 'https://www.googletagmanager.com/gtag/js?id=G-GX60JGL6QC';
        var root_s = document.getElementsByTagName('script')[0];
        root_s.parentNode.insertBefore(analytics, root_s);
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-GX60JGL6QC');
    });

    // 图标
    var icon = document.createElement('link');
    icon.rel = 'shortcut icon';
    icon.href = cdn_path + 'favicon.ico';
    document.head.appendChild(icon);

    var manifest = document.createElement('link');
    manifest.rel = 'manifest';
    manifest.href = cdn_path + 'manifest.json';
    document.head.appendChild(manifest);

    //尾部信息
    document.querySelector('body>footer').insertAdjacentHTML('beforeend', '<p>工信部ICP备案：闽ICP备12002928号-2 &nbsp;&nbsp;&nbsp; 公安部备案：闽公网安备 35042502000103号 &nbsp;&nbsp;&nbsp; <a rel="external nofollow" href="http://wpa.qq.com/msgrd?v=3&amp;uin=12692752&amp;site=tao.hooos.com&amp;menu=yes" target="_blank" title="联系QQ">联系我们</a></p>');

    // 网站地图
    AJAX({
        url: '/?sitemap=true',
        type: 'GET',
        cache: 3600000,
        async: true
    });
})();