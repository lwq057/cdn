function emptys(a){return a?a:""}function getCookie(a){var b,c=new RegExp("(^| )"+a+"=([^;]*)(;|$)");return(b=document.cookie.match(c))?unescape(b[2]):null}function setCookie(a,b,c){var d=new Date;d.setTime(d.getTime()+1e3*c),document.cookie=a+"="+escape(b)+";expires="+d.toGMTString()}function lazyload_img(a){return a?(data_dom=$(a),data_dom.find("img").each(function(a){data_dom.find("img")[a].setAttribute("data-src",$(this).attr("src")),data_dom.find("img")[a].setAttribute("class","l")}),data_dom.find("img").attr("src","/static/lazyload.gif"),lazyload_run(),data_dom):($("div img.l").each(function(){$(this).attr("data-src")||($(this).attr("data-src",$(this).attr("src")),$(this).attr("src","/static/lazyload.gif"))}),lazyload_run(),void 0)}function lazyload_run(){$.getScript("https://cdn.jsdelivr.net/npm/vanilla-lazyload@16.1.0/dist/lazyload.min.js",function(){"object"!=typeof window.lazyloads?(lazyload_img(),window.lazyloads=new LazyLoad({elements_selector:"img",cancel_on_exit:!0,callback_loaded:function(a){$(a).removeClass("l")}})):window.lazyloads.update()})}function store_desc(a){a=JSON.stringify(a),id=parseInt($(".goods").attr("data-id")),token=$(".goods").attr("data-token"),$.post("/plugin-storedesc",{desc:a,id:id,token:token})}function store_attr(a){a=JSON.stringify(a),id=parseInt($(".goods").attr("data-id")),token=$(".goods").attr("data-token"),$.post("/plugin-storeattr",{attr:a,id:id,token:token})}function attr(a){var c,d,e,b='<h4><div class="i"><img src="'+(a.seller.shopIcon?a.seller.shopIcon:"/static/ico-114.png")+'"/></div><div class="c"><i class="'+("B"==a.seller.shopType?"tmall":"taobao")+'"></i><b>'+a.seller.shopName+"</b></div></h4>";b+='<div class="body">',b+="<dl><dt>店铺粉丝</dt><dd>"+a.seller.fans+"</dd></dl>",$.each(a.seller.evaluates,function(a,c){b+="<dl><dt>"+c.title+"</dt><dd>"+c.score+"</dd></dl>"}),b+="</div>",$("#attr .body .seller").html(b),c="","{}"!=JSON.stringify(a.props)&&("undefined"!=a.props.groupProps&&$.each(a.props.groupProps[0],function(a,b){c+="<h4>"+a+"</h4>",c+="<ul>",$.each(b,function(a,b){var d=Object.keys(b)[0];c+='<li title="'+b[d]+'">'+d+": "+b[d]+"</li>"}),c+="</ul>"}),a.props.importantProps&&(c+="<h4>产品属性</h4>",c+="<ul>",$.each(a.props.importantProps,function(a,b){c+='<li title="'+b["value"]+'">'+b["name"]+": "+b["value"]+"</li>"}),c+="</ul>")),"{}"!=JSON.stringify(a.props2)&&("undefined"!=a.props2.groupProps&&$.each(a.props2.groupProps[0],function(a,b){c+="<h4>"+a+"</h4>",c+="<ul>",$.each(b,function(a,b){var d=Object.keys(b)[0];c+='<li title="'+b[d]+'">'+d+": "+b[d]+"</li>"}),c+="</ul>"}),a.props2.importantProps&&(c+="<h4>产品属性</h4>",c+="<ul>",$.each(a.props2.importantProps,function(a,b){c+='<li title="'+b["value"]+'">'+b["name"]+": "+b["value"]+"</li>"}),c+="</ul>")),c?$("#attr .body .props").html(c):$("#attr .body .props").hide(),d="",a.rate.keywords&&(d+="<h4>大众印象</h4>",d+="<ul>",$.each(a.rate.keywords,function(a,b){d+="<li>"+b.word+"<i>"+b.count+"</i></li>"}),d+="</ul>"),d+="<h4>最佳评价</h4>",$.each(a.rate.rateList,function(a,b){d+="<p>"+(b.skuInfo?"<i>"+b.skuInfo+"</i>":"")+b.content+"</p>"}),$("#attr .body .rate").html(d),e={},e.seller=a.seller,e.props=a.props,e.props2=a.props2,e.rate=a.rate,store_attr(e)}function desc(a){var b,c,d;return a.wdescContent?(b="",c=a.wdescContent,d=/<[^>]*>|<\/[^>]*>/gm,$.each(c.pages,function(a,c){-1!=c.indexOf("</img>")?b+="<img class='l'src='"+c.replace(d,"")+"'>":-1!=c.indexOf("</txt>")&&(b+="<p>"+c.replace(d,"")+"</p>")}),b&&($("#desc .body").html(b),lazyload_img(),viewers()),void 0):null}function countdown(a,b){if(!/^\d+$/.test(b)){b=b.replace(new RegExp(/-/gm),"/");var b=new Date(b)}b-new Date>0&&setInterval(function(){var c=new Date,d=b-c,e=parseInt(d/1e3/60/60/24),f=parseInt(d/1e3/60/60%24),g=parseInt(d/1e3/60%60),h=parseInt(d/1e3%60);e?a.html(e+"天"+f+":"+g+":"+h):a.html(f+":"+g+":"+h)},1e3)}function item_time(){$(".item i.time").ready(function(){$(".item i.time").each(function(){var a=$(this),b=a.attr("data-time"),c=a.attr("data-st"),d=a.attr("data-et");b?countdown(a,b,null):c&&d&&countdown(a,d,null),a.removeClass("time")})})}function viewers(){window.Viewer&&(0==$("#viewer_css").length&&$("<link>").attr({id:"viewer_css",rel:"stylesheet",type:"text/css",href:"https://cdn.jsdelivr.net/npm/viewerjs@1.5.0/dist/viewer.min.css"}).appendTo("head"),$("#desc .body img").length>0&&(window.desc_viewer||(window.desc_viewer=new window.Viewer(document.getElementById("desc"),{url:"data-src"}))),$(".goods .cover .slide img").length>0&&(window.slide_viewer||(window.slide_viewer=new window.Viewer($(".goods .cover .slide")[0],{url:"data-src"}))),lazyload_run())}function prompts(a,b,c,d,e){c||(c="<span onclick=\"javascript:$('#"+a+"').toggle();\">确定</span><span onclick=\"javascript:$('#"+a+"').toggle();\">关闭</span>"),title_html=d?'<h4 class="title">'+d+"</h4>":"";var f='<div class="prompt-box" id="'+a+'">'+title_html+'<div class="body">'+b+'</div><div class="button">'+c+"</div></div>";$("#"+a).length>0&&$("#"+a).remove(),$("body").append(f),e&&e()}function oa_weixin_show(){var a="oaweixin",b='<p>天猫淘宝优惠商品都在这</p><p>关注优惠世家公众号方便随时使用</p><p><img title="微信公众号二维码" src="/static/weixin_oa.jpg" style="max-height:28rem;max-height:62vh;max-width:100%;" /></p><p>微信扫码关注或长按识别二维码</p><p>也可以通过微信搜索公公众号[优惠世家]</p><p>长按或右击二维码保存可分享给好友</p>',c='<span style="width:100%;" onclick="javascript:$(\'#'+a+"').toggle();setCookie('cwx',1,2592000);\">关闭</span>";prompts(a,b,c,"关注优惠世家公众号",function(){$("#"+a).show()})}var lazyloads,arr,reg,cookie_goods,cookie_all,ng,exp,i,ct,goods_id;if(function(){var b,a="article|aside|audio|canvas|footer|header|menu|nav|section|time|video".split("|");for(b=0;b<a.length;b++)document.createElement(a[b])}(),$.ajaxSetup({cache:!0}),lazyload_run(),$(".exhibition").ready(function(){$(".exhibition .body").length>0&&$.getScript("https://cdn.jsdelivr.net/npm/swiper@5.4.1/js/swiper.min.js",function(){$(".exhibition .list img").each(function(){$(this).addClass("sl"),$(this).attr("data-src",$(this).attr("src")),$(this).attr("src","./static/lazyload.gif")}),new Swiper(".exhibition .body",{lazy:{lazy:!0,elementClass:"sl",loadPrevNext:!0,loadPrevNextAmount:5},slidesPerView:"auto",centeredSlidesBounds:!0,wrapperClass:"list",slideClass:"item",autoplay:!0,grabCursor:!0,autoplay:{delay:5e3,disableOnInteraction:!1},clickable:!0,loop:!0})})}),$(".goods .cover").ready(function(){$(".goods .cover").length>0&&($(".goods .cover .slide").append('<div class="pagination"></div>'),$.getScript("https://cdn.jsdelivr.net/npm/swiper@5.4.1/js/swiper.min.js",function(){pics=new Swiper(".goods .cover .slide",{wrapperClass:"g-c-u",slideClass:"g-c-i",slidesPerView:"auto",centeredSlides:!0,spaceBetween:10,autoplay:!1,grabCursor:!0,pagination:{el:".pagination",clickable:!0,bulletElement:"a",bulletActiveClass:"active"},mousewheel:!0,clickable:!0,loop:!0}),$(".goods .cover").hover(function(){pics.autoplay.stop()},function(){pics.autoplay.start()}),$(".goods .recommends").ready(function(){recommend=new Swiper(".goods .recommends .recommend",{wrapperClass:"r-c-u",slideClass:"gi",slidesPerView:"auto",centeredSlides:!0,grabCursor:!0,autoplay:!0,autoplay:{delay:2e3,disableOnInteraction:!1},mousewheel:!0,clickable:!0,loop:!0,observer:!0,observeParents:!0}),$(".goods .recommends .recommend").hover(function(){recommend.autoplay.stop()},function(){recommend.autoplay.start()})})}))}),$("[tab^='tab-']").click(function(){var a=$(this).attr("tab");$(this).siblings("[tab^='tab-']").removeClass("c"),$(this).addClass("c"),$(".tab."+a).siblings(".tab").hide(),$(".tab."+a).show()}),$('header .search input[type="search"]').bind("keypress",function(a){"13"==a.keyCode&&$('header .search input[type="submit"]').click()}),$(".search").ready(function(){$.getScript("https://cdn.jsdelivr.net/npm/devbridge-autocomplete@1.4.11/dist/jquery.autocomplete.min.js",function(){$('header .search input[type="search"]').autocomplete({serviceUrl:"https://suggest.taobao.com/sug?code=utf-8",dataType:"jsonp",paramName:"q",transformResult:function(a){return{suggestions:$.map(a.result,function(a){return{value:a[0],data:a[0]}})}}})})}),$("body").ready(function(){var a=parseInt($(".goods").attr("data-id"));parseInt($(".goods").attr("data-cache")),$(".goods").attr("data-sellerid"),a&&(0==$("#desc .body").html().length&&$.ajax({url:"https://hws.m.taobao.com/cache/desc/5.0?id="+a,timeout:1e3,tryCount:0,retryLimit:10,cache:!1,async:!1,dataType:"jsonp",jsonp:"callback",success:function(b){if(this.tryCount++,b.sellerId)desc(b),store_desc(b);else if(this.tryCount<this.retryLimit)return this.url.length>400&&(this.url="https://hws.m.taobao.com/cache/desc/5.0?id="+a),$.ajax(this),void 0},error:function(){this.tryCount++,this.url.length>400&&(this.url="https://hws.m.taobao.com/cache/desc/5.0?id="+a),this.tryCount<this.retryLimit&&$.ajax(this)}}),0==$("#attr .body").text().trim().length&&$.ajax({url:'https://acs.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/?data=%7B"itemNumId"%3A"'+a+'"%7D',timeout:1e3,tryCount:0,retryLimit:10,cache:!1,async:!1,dataType:"jsonp",jsonp:"callback",success:function(b){if(this.tryCount++,b.data)attr(b.data);else if(this.tryCount<this.retryLimit)return this.url.length>400&&(this.url='https://acs.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/?data=%7B"itemNumId"%3A"'+a+'"%7D'),$.ajax(this),void 0},error:function(){this.tryCount++,this.url.length>400&&(this.url='https://acs.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/?data=%7B"itemNumId"%3A"'+a+'"%7D'),this.tryCount<this.retryLimit&&$.ajax(this)}}))}),$("#list").ready(function(){lists=$("#list"),max_lists_num=1,get_lists_ing=0,$(window).on("scroll",function(){if(!get_lists_ing&&max_lists_num>0&&$(document).scrollTop()+$(window).height()-50>lists.height()+lists.scrollTop()){$(".page")&&($(".page .l").show(),$(".page .l").html("<i></i><i></i><i></i>")),get_lists_ing=1;var a=parseInt(lists.attr("data-page"));a&&$.ajax({type:"POST",url:window.location.href,data:{page:a+1,is_ajax:"true"},dataType:"json",success:function(b){b.data&&(lists.append(lazyload_img(b.data)),lists.attr("data-page",a+1),b.page&&$(".page").html(b.page),get_lists_ing=0,item_time()),max_lists_num-=1,(0>=max_lists_num||!b.page)&&(lists.attr("data-page",0),$(".page .l").hide())}})}})}),item_time(),$("#desc,#rates,.goods .cover .slide").ready(function(){$("#desc,#rates,.goods .cover .slide").length>0&&$.getScript("https://cdn.jsdelivr.net/npm/viewerjs@1.5.0/dist/viewer.min.js",function(){window.Viewer=Viewer,viewers()})}),$("#command").click(function(){var b,c,d,e,a=$("#command").attr("data-command");a&&(b="commandbox",c='<p>复制淘口令领取优惠券,宝贝的淘口令（包含￥符号）</p><p style="padding:0.5rem 0;"><b style="font-size:1.4rem;color:#fe6f84;">'+a+"</b></p><p>复制成功:手动打开淘宝APP即可领取优惠券购买.</p><p>复制失败:请尝试手动复制,选中或长按淘口令复制.</p>",d='<span class="copycommand" data-clipboard-text="'+a+'">复制</span><span onclick="javascript:$(\'#'+b+"').toggle();\">关闭</span>",prompts(b,c,d,"淘口令领券"),"undefined"==typeof ClipboardJS?$.getScript("https://cdn.jsdelivr.net/npm/clipboard@2.0.6/dist/clipboard.min.js",function(){var a=new ClipboardJS(".copycommand");a.on("success",function(){$(".copycommand").html("复制成功")}),a.on("error",function(){$(".copycommand").html("请手动复制"),$(".prompt-info p b").select()})}):(e=new ClipboardJS(".copycommand"),e.on("success",function(){$(".copycommand").html("复制成功")}),e.on("error",function(){$(".copycommand").html("请手动复制"),$(".prompt-info p b").select()})))}),$("#share").click(function(){var a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r;return 0!=$("#sharebox").length?($("#sharebox").toggle(),!0):(a=emptys($("#command").attr("data-command")),b=emptys($("h1").text()),c=emptys($(".g-c-u").find("img").eq(0).attr("src")),d=emptys($(".goods").attr("data-id")),e=emptys($(".goods").attr("data-price")),f=emptys($(".goods").attr("data-oprice")),g=$(".goods").attr("data-coupon"),h=emptys($(".goods").attr("data-category")),i=window.location.href,j="优惠世家",k="<br/>",discount='<img style="max-width:30%;" src="'+c+'" />'+k,discount+="【"+h+"】"+b+k,f&&(discount+="【原价】"+f+"元 "+k),e&&(discount+="【优惠价】"+e+"元 "+k),"0"!==g&&(discount+=e?"【券后价】"+Math.floor(100*parseFloat(e-g))/100+"元":"【券后价】"+Math.floor(100*parseFloat(e-g))/100+"元",discount+=" ("+g+"元优惠券) "+k,a&&(discount+="【淘口令】"+a+" "+k)),discount+="【下单地址】"+window.location.href+" "+k,discount+=a?"复制此消息,打开[手机淘宝]即可领券下单.":"更多超值得买的商品,访问网站查看："+document.domain,l=$(".goods .info .r p:last").text(),b&&c&&d&&(m=discount.replace(/<[^>]+>|&[^>]+;/g,"\n").trim(),n="",n+='<a href="http://service.weibo.com/share/share.php?url='+i+"&title="+encodeURIComponent("#"+(h?h:j)+"# "+m)+"&pic="+c+'" target="_blank">新浪微博</a>',n+='<a href="https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+i+"&title="+b+"&pics="+c+"&site="+j+'" target="_blank">QQ空间</a>',n+='<a href="http://tieba.baidu.com/f/commit/share/openShareApi?url='+encodeURIComponent(i)+"&title="+b+"&pic="+c.replace("https://","http://")+"&site="+j+'" target="_blank">百度贴吧</a>',n+='<a href="https://www.douban.com/share/service?href='+i+"&name="+b+"&image="+c+"&site="+j+"&text="+encodeURIComponent(m)+'" target="_blank">豆瓣</a>',n+='<a href="https://connect.qq.com/widget/shareqq/index.html?url='+encodeURIComponent(i)+"&title="+b+"&pics="+c+"&desc="+encodeURIComponent(m)+'" target="_blank">QQ好友</a>',n+='<a href="http://widget.renren.com/dialog/share?resourceUrl='+i+"&title="+b+"&pic="+c+"&description="+encodeURIComponent(m)+'" target="_blank">人人网</a>',n+='<a href="https://www.facebook.com/share.php?u='+i+"&t="+b+"&pic="+c.replace("https://","http://")+'" target="_blank">Facebook</a>',n+='<a href="https://twitter.com/intent/tweet?url='+encodeURIComponent(i)+"&text="+encodeURIComponent(m)+"&pic="+encodeURIComponent(c)+"&hashtags="+h+'" target="_blank">Twitter</a>',n+='<a href="mailto:?subject='+b+"&body="+m+'" target="_blank">电子邮件</a>',n+='<a href="sms:?body='+m+'" target="_blank">短信</a>',o="sharebox",p='<div class="share-box" id="share_txt" style="display:none;line-height:2rem;"><p>长按或选中复制此消息分享给你的好友：</p><p class="share_txt_box"><i contentEditable="false" class="share_txt_cut" style="font-style:initial;white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;overflow:auto;word-break:break-all;word-wrap:break-word">'+discount+'</i><div class="copysharetxt" style="width:40%;margin:0.2rem auto;cursor:pointer;background-color:#ffffff;color:#57606f;font-size:0.8rem;border-radius:3px;border:0.1rem solid #57606f;">点击复制文字</div></p></div>',p+='<div class="share-box" id="share_img" style="line-height:2rem;"><p>右击或长按保存图片分享给你的好友：</p><div style="width:100%;position: relative;padding-top: 90%;"><iframe id="share_img_iframe" style="position:absolute;top:0;left: 0;width:100%;height:100%;overflow:hidden;" scrolling="no" src=""></iframe></div></div>',p+='<div class="share-box" id="share_site" style="display:none;line-height:2rem;"><p>分享到社交平台：</p><div style="display:flex;flex-wrap:wrap;text-align:center;"><style>#share_site a{background-color:#ffffff;padding:0 0.4rem;margin:0.5rem 1rem;color:#57606f;flex-grow:1;font-size:0.8rem;border-radius:3px;border:0.1rem solid #57606f;}#share_site a:hover{background-color:#7bed9f;color:#fff;border-color:#2ed573;}</style>'+n+"</div></div>",q="<span onclick=\"javascript:$('.share-box').hide();$('#share_img').show();\">图片</span><span onclick=\"javascript:$('.share-box').hide();$('#share_txt').show();\">文字</span><span onclick=\"javascript:$('.share-box').hide();$('#share_site').show();\">平台</span><span onclick=\"javascript:$('#"+o+"').toggle();\">关闭</span>",r="/static/share_img.html?hooos&img="+c+"&id="+d+"&price="+e+"&oprice="+f+"&coupon="+g+"&tag="+l+"&title="+encodeURIComponent(encodeURI(b))+"&_t="+Date.parse(new Date),prompts(o,p,q,"分享优惠商品"),$("#share_img_iframe").attr("src")!=r&&$("#share_img_iframe").attr("src",r),$(".share_txt_box").click(function(){$(this).select()}),$.getScript("https://cdn.jsdelivr.net/npm/clipboard@2.0.6/dist/clipboard.min.js",function(){var b,a=new ClipboardJS(".share_txt_box",{target:function(){return document.querySelector(".share_txt_cut")}});a.on("success",function(){a.destroy()}),a.on("error",function(){a.destroy()}),b=new ClipboardJS(".copysharetxt",{target:function(){return document.querySelector(".share_txt_cut")}}),b.on("success",function(){$(".copysharetxt").html("复制成功")}),b.on("error",function(){$(".copysharetxt").html("请手动复制"),$("#share_txt_cut").select()})})),void 0)}),$(".alipay_rp").click(function(){var a="alipayrpbox",b='<p style="background-color:#e72a3d;"><a target="_blank" href="/goto?url=https://qr.alipay.com/c1x06663un01sztsrmasqb9"><img title="支付宝红包" src="/static/zfbhb.png" style="max-height:28rem;max-height:62vh;max-width:100%;" /></a></p><p>支付宝APP搜索 “549377813” 领取红包.</p><p>可长按或右键保存图片分享给你的好友领取.</p><p>点击图片可直接跳转至支付宝.</p>',c='<span class="alipay_rp_copy" data-clipboard-text="549377813">复制搜索码</span><span onclick="javascript:$(\'#'+a+"').toggle();\">关闭</span>";prompts(a,b,c,"支付宝每天领门店付款抵扣红包",function(){$("#"+a).show()}),$.getScript("https://cdn.jsdelivr.net/npm/clipboard@2.0.6/dist/clipboard.min.js",function(){var b=new ClipboardJS(".alipay_rp_copy");b.on("success",function(){$("#"+a).hide()}),b.on("error",function(){$(".alipay_rp_copy").html("请手动复制")})})}),$(".oa_weixin").click(function(){oa_weixin_show()}),$("body").ready(function(){getCookie("cwx")||setTimeout(function(){oa_weixin_show()},2e4)}),$("#desc .dc.c-o").click(function(){$("html,body").animate({scrollTop:$("#desc").offset().top},400)}),$("img").on("error",function(){var a=$(this).attr("src");a.indexOf("_.webp")>0?$(this).attr("src",a.replace("_.webp","")):$(this).hasClass("l")||$(this).hasClass("ls")||($(this).attr("error")||($(this).attr("data-original")?$(this).attr("data-src",$(this).attr("data-original")):$(this).attr("data-src")||$(this).attr("data-src",$(this).attr("src")),$(this).attr("error","1"),$(this).attr("src",$(this).attr("data-src"))),"object"==typeof window.lazyloads?window.lazyloads.update():lazyload_run())}),document.cookie.length>5e3&&(reg=new RegExp("(^| )goods=([^;]*)(;|$)"),arr=document.cookie.match(reg))){for(cookie_goods=arr[2],cookie_all=document.cookie.split(";"),ng="",exp=new Date,exp.setTime(exp.getTime()-1),i=0;i<cookie_all.length;i++)ct=cookie_all[i].split("="),-1!=ct[0].indexOf("goods_")&&(goods_id=ct[0].replace(/[^0-9]/gi,""),-1==cookie_goods.indexOf(goods_id)?document.cookie=ct[0]+"='';expires="+exp.toGMTString():ng+=goods_id+"_");document.cookie="goods="+ng}$("nav a.c").length>0&&$("nav a.c").offset().left>$(document).width()&&$("nav").animate({scrollLeft:$("nav a.c").offset().left},500),$("body").ready(function(){var a,b;!function(){var d,e,a=/([http|https]:\/\/[a-zA-Z0-9\_\.]+\.baidu\.com)/gi,b=window.location.href,c=document.referrer;a.test(b)||(d="https://sp0.baidu.com/9_Q4simg2RQJ8t7jm9iCKT-xh_/s.gif",c?(d+="?r="+encodeURIComponent(document.referrer),b&&(d+="&l="+b)):b&&(d+="?l="+b),e=new Image,e.src=d)}(window),function(a){function b(a){var f,g,b=location.href,c=b.split("").reverse(),d=a.split(""),e=[];for(f=0,g=16;g>f;f++)e.push(d[f]+(c[f]||""));return e.join("")}var e,f,g,h,c=/([http|https]:\/\/[a-zA-Z0-9\_\.]+\.so\.com)/gi,d=a.location.href;d&&!c.test(d)&&window.navigator.appName&&(e="//s.360.cn/so/zz.gif",f="d182b3f28525f2db83acfaaf6e696dba",g=b(f),h=new Image,d&&(e+="?url="+encodeURIComponent(d)),f&&(e+="&sid="+f),g&&(e+="&token="+g),f&&(h.src=e))}(window),a=document.createElement("script"),a.type="text/javascript",a.async=!0,a.charset="utf-8",a.src="https://c.cnzz.com/stat.php?id=1278661311&async=1&online=2",b=document.getElementsByTagName("script")[0],b.parentNode.insertBefore(a,b)});