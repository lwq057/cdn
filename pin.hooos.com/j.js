function links(){$('a[href^="/go?"]').attr("target","_blank"),$('a[href^="/go/"]').attr("target","_blank"),$('a[href^="/go-"]').attr("target","_blank"),$('a[href^="go?"]').attr("target","_blank"),$('a[href^="go-"]').attr("target","_blank"),$("form").attr("target","_blank")}function lazyload_img(){for(var e=document.querySelectorAll("img"),t=0;t<e.length;t++)e[t].getAttribute("data-original-url")||e[t].getAttribute("data-ll-status")||(e[t].setAttribute("data-original-url",e[t].src),e[t].src="https://cdn.jsdelivr.net/gh/lwq057/cdn@2.4/tao.hooos.com/lazyload.gif");lazyload_run()}function lazyload_run(){"object"!=typeof window.lazyloads?window.lazyloads=new LazyLoad({elements_selector:"img",data_src:"original-url",threshold:500,callback_loaded:function(e){e.setAttribute("data-original-url",e.src)},callback_error:function(e){e.setAttribute("src",e.src)},cancel_on_exit:!0}):window.lazyloads.update()}function discount(e,t){return d=String(10/parseFloat(t/e)),d.substring(0,3)+"折"}function datas_list(e,t){var a="";if(0==e.length)return a;switch(t){case"search":$.each(e,function(e,t){a+='<a href="/w-'+e+'/">',a+='<img src="'+t+'"><i>'+e+"</i>",a+="</a>"});break;case"category":$.each(e,function(e,t){a+='<a href="/c-'+e+'/">',a+='<img src="'+t.p+'"><i>'+t.n+"</i>",a+="</a>"});break;default:$.each(e,function(e,t){a+="<li>",a+='<a href="/g-'+t.goods_id+'/">',a+="<i>",a+='<img src="'+t.goods_thumbnail_url+'">',t.hasOwnProperty("unified_tags")&&(a+="<u>优惠 "+t.unified_tags.join(" ")+"</u>"),a+="</i>",a+="<em>";var i="优惠购买";t.hasOwnProperty("coupon_discount")&&0!=t.coupon_discount?(a+="<b>"+((t.min_group_price-t.coupon_discount)/100).toFixed(1)+"</b><i>券后价</i>",i=t.coupon_discount/100+"元优惠券"):(a+="<b>"+t.min_group_price+"</b>",t.min_normal_price==t.min_group_price?(a+="<i>低价</i>",i="低价购买"):(i=discount(t.min_group_price,t.min_normal_price),a+="<i>"+i+"</i>",i+="抢购")),a+="<s>"+t.min_normal_price/100+"</s>",a+="</em>",a+="<h4>"+t.goods_name+"</h4>",a+="<p><i>销量"+t.sales_tip+"</i><i>"+t.mall_name+"</i></p>",a+="</a>",a+='<a buy href="/go-'+t.goods_id+'/">'+i+"</a>",a+="</li>"})}return a}function load_viewer(){$("body>main>article>div[imgs]>figure").length>0&&"object"!=typeof window.figure_viewers&&(window.figure_viewers=new Viewer($("body>main>article>div[imgs]>figure")[0],{url:"data-original-url",shown:function(){lazyload_run()},view:function(e){var t=e.detail.image.src;e.detail.image.src=t.replace("_400x400q90","")}})),$("body>main>section>div>div").length>0&&("object"!=typeof window.viewers?window.viewers=new Viewer($("body>main>section>div>div")[0],{url:"data-original-url",shown:function(){lazyload_run()}}):window.viewers.update())}function countdown(){$("[cd]").each(function(e,t){var a=$(this).attr("cd"),i=$(this).is("[c]")?"后结束":"后开始";a&&0==isNaN(a)&&(a=parseInt(a));var r=new Date(a);r-new Date>0&&setInterval(function(){var e=new Date,a=r-e,n=parseInt(a/1e3/60/60/24),o=parseInt(a/1e3/60/60%24),s=parseInt(a/1e3/60%60),l=parseInt(a/1e3%60);n?$(t).html(n+"天"+o+":"+s+":"+l+i):$(t).html(o+":"+s+":"+l+i)},1e3),$(this).removeAttr("cd")})}links(),lazyload_img(),$('body>header>form>input[type="search"]').ready(function(){if(0==$(this).length)return!1;$('body>header>form>input[type="search"]').autocomplete({serviceUrl:"https://suggest.taobao.com/sug?code=utf-8",dataType:"jsonp",paramName:"q",appendTo:$("body>header>form"),width:"100%",transformResult:function(e){return{suggestions:$.map(e.result,function(e){return{value:e[0],data:e[0]}})}}})}),$("main>article figure").ready(function(){if(0==$("main>article figure img").length)return!1;$("body>main>section>div>div").append($("main>article figure").html()),load_viewer(),$("main>article figure").addClass("goods-wrapper").parent().addClass("goods-container").scrollLeft(0).css("overflow","hidden"),$("main>article figure img").addClass("goods-slide"),$("main>article figure").after('<i class="p"></i>'),gs=new Swiper(".goods-container",{wrapperClass:"goods-wrapper",slideClass:"goods-slide",slidesPerView:"auto",direction:"horizontal",pagination:{el:".p",clickable:!0,bulletElement:"a",bulletActiveClass:"active"},centeredSlides:!0,spaceBetween:0,autoplay:!1,grabCursor:!0,mousewheel:!0,clickable:!0,loop:!0}),$(".goods-wrapper").hover(function(){gs.autoplay.stop()},function(){gs.autoplay.start()}),lazyload_run()}),$("small[p]").ready(function(){var e=$("small[p]");if(0==e.length)return!1;var t=parseInt(e.attr("p"))||0,a=parseInt(e.attr("m"))||0;if(0!=a&&t>=a)return!1;var i=e.prev().attr("page",t),r=i.parent(),n=!1,o=2;e.append("<span></span>"),$(window).on("scroll",function(){return!(n||o<=0)&&(t=parseInt(i.attr("page")),0!=a&&t>=a?(e.children("span").hide(),!1):void($(document).scrollTop()+$(window).height()>r.height()+r.offset().top&&(n=!0,$.ajax({type:"POST",url:window.location.href,data:{page:t+1,ajax:"true"},dataType:"json",success:function(a){a.list&&(i.append(datas_list(a.list,a.type)),a.page&&e.html(a.page+"<span></span>"),links(),lazyload_img(),countdown(),i.attr("page",t+1)),o-=1,o<=0||!a.page?(e.children("span").hide(),n=!0):n=!1},error:function(){o-=1,e.children("span").hide()}}))))})}),$("main>div figure").ready(function(){if(0==$("main>div figure img").length)return!1;$("main>div figure>div").addClass("swiper-w").parent().addClass("swiper-c").scrollLeft(0).css("overflow","hidden"),$("main>div figure>div>a").addClass("swiper-s"),new Swiper(".swiper-c",{wrapperClass:"swiper-w",slideClass:"swiper-s",slidesPerView:"auto",direction:"horizontal",centeredSlidesBounds:!0,touchMoveStopPropagation:!0,centeredSlides:!0,spaceBetween:10,autoplay:!0,grabCursor:!0,clickable:!0,loop:!0}),$(".swiper-c").each(function(e,t){var a=t.swiper;$(this).hover(function(){a.autoplay.stop()},function(){a.autoplay.start()})}),lazyload_run()}),$("body>main>article").ready(function(){var e=$("body>main>article>q").length>0?"领券":"购买";if($('body>main>article label[for="qr"]').length>0){var t=$('input[name="id"]').val(),a=$('input[name="url"]').val(),i=$('input[name="url"]').val(),r=$("body>main>article figure img").attr("data-original-url")||$("body>main>article figure img").attr("src");$("body>main>article").append('<input id="qr" type="checkbox"><dialog><header>二维码'+e+'</header><section><input tab="" id="qr-t" type="checkbox"><div id="q1" tab></div><div id="q2" tab></div></section><footer><label for="qr-t">切换</label> <label for="qr">确定</label></footer></dialog>');var n={render:"canvas",minVersion:1,maxVersion:40,ecLevel:"H",left:0,top:0,size:500,text:location.origin,fill:"#000",background:null,radius:.1,quiet:2,mode:4,mSize:.2,mPosX:.5,mPosY:.5,label:"goods",fontname:"sans",fontcolor:"#000"},o=new Image;o.src="https://cdn.jsdelivr.net/gh/lwq057/cdn@4.4/pin.hooos.com/wx.png",o.onload=function(){n.text=a,n.image=this,$("#q1").qrcode(n).append("<p>[微信二维码] 使用微信、微博、浏览器等APP扫码"+e+"</p>")};var s=new Image;s.src=r,s.onload=function(){n.text=location.origin+"/go-"+t+"/?url="+encodeURIComponent(a)+"&murl="+encodeURIComponent(i),n.image=this,$("#q2").qrcode(n).append("<p>[通用二维码] 扫描或长按识别二维码"+e+"</p>")}}if($('body>main>article label[for="share"]').length>0){var l={};l.id=$('input[name="id"]').val(),l.url=$('input[name="url"]').val()||$('input[name="murl"]').val()||"",l.img=$("body>main>article figure img").attr("data-original-url")||$("body>main>article figure img").attr("src"),l.price=$("body>main>article>div[info]>div em>b[p]").text()||0,l.oprice=$("body>main>article>div[info]>div em>b[o]").text()||0,l.coupon=$("body>main>article>q>*>div>em").text()||0;var c=l.title=$("body>main>article>div[info]>h2").text()||$("body>main>article>div[info]>h1").text();l.tag=$("body>main>article>div[info]>div[t]>i").map(function(){return $(this).text()}).get().join("、")||"",l.cat=$("body>main>div>nav>a").eq(0).text()||"";var d="/server/share.html?";l.title=encodeURI(l.title),$.each(l,function(e,t){d+="&"+e+"="+t}),l.title=c,l.num=$("body>main>article>div[info]>b>i").map(function(){return $(this).text()}).get().join("、")||"";var p='<img src="'+l.img+'"><br>';l.cat&&(p+="#"+l.cat+"#<br>"),p+=l.title+"<br>",l.num&&(p+=l.num+"<br>"),l.oprice&&(p+="【原售价】"+l.oprice+"￥"),l.price&&(l.coupon?p+="【在售价】"+l.price+"￥<br>":p+="【优惠价】"+l.price+"￥<br>"),l.coupon&&(p+="【券后价】"+(l.price-l.coupon).toFixed(2)+"￥",p+="【优惠券】"+l.coupon+"￥<br>"),l.tag&&(p+="[ "+l.tag+" ]<br>"),p+="购买链接："+l.url+"<br>",p+="更多详情："+window.location.href,$("body>main>article").append('<input id="share" type="checkbox"><dialog><header>分享文字或图片</header><section><div share><input tab id="share_type" type="checkbox"><div tab><p>长按分享或保存图片发送给好友</p><iframe id="share_img" width="100%" height="100%" data-src="'+d+'" src="'+l.img+'"></iframe></div><div tab><div id="share_text">'+p+'<br><input id="copysharetext" type="submit" value="点击复制"></div></div></div></section><footer><label for="share_type">图片/文字</label> <label for="share">收起窗口</label></footer></dialog>'),$("#share").click(function(){var e=$("#share_img");e.attr("data-src")&&(e.attr("src",e.attr("data-src")),e.removeAttr("data-src"))}),$("#copysharetext").ready(function(){if(0==$(this).length)return!1;var e=new ClipboardJS("#copysharetext",{target:function(e){return document.getElementById("share_text")}});e.on("success",function(e){$("#copysharetext").val("复制成功去分享吧")}),e.on("error",function(e){$("#copysharetext").val("复制失败请长按或选中右击复制")})})}}),load_viewer(),countdown(),$("main>section>div>label[i]").click(function(){$("body,html").animate({scrollTop:$("body>main>article").offset().top},400)}),$("body>footer").prepend('<p>闽ICP备12002928号 &nbsp;&nbsp;&nbsp; 闽公网安备 35042502000103号 &nbsp;&nbsp;&nbsp; <a rel="external nofollow" href="http://wpa.qq.com/msgrd?v=3&amp;uin=12692752&amp;site=tao.hooos.com&amp;menu=yes" target="_blank" title="联系QQ">联系我们</a> &nbsp;&nbsp;&nbsp; <span id="cnzz_stat_icon_1253303069">CNZZ</span></p>'),$('body>header>form>input[type="search"]').ready(function(){var e=function(){var e=["最近想买的东西是不是有优惠了？","可以复制商品标题搜索看看","好像有什么东西该换新的了吧？","最近买的东西有没有买贵了？","查查家人喜欢的东西优惠力度大吗？","家里是不是缺了点什么东西？","最近有什么想吃的东西吗？","最近有什么好玩的东西吗？","给TA买个礼物吧？"],t=Math.floor(Math.random()*e.length);$('body>header>form>input[type="search"]').attr("placeholder",e[t])},t=setInterval(e,1e4);$('body>header>form>input[type="search"]').focus(function(){clearInterval(t),$(this).attr("placeholder","可输入商品关键词、标题、ID、链接"),$(this).blur(function(){t=setInterval(e,1e4)})})}),$("body").append('<s><i t title="回顶部"></i><i r title="上一页"></i></s>'),$("body>s>i[t]").click(function(){$("body,html").animate({scrollTop:0},400)}),$("body>s>i[r]").click(function(){history.back()}),$(window).scroll(function(){$("body>s").hide(),clearTimeout($.data(this,"scrollTimer")),$.data(this,"scrollTimer",setTimeout(function(){$("body>s").show(),$(window).scrollTop()>100?$("body>s>i[t]").show():$("body>s>i[t]").hide(),document.referrer.indexOf(window.location.host)>0?$("body>s>i[r]").show():$("body>s>i[r]").hide()},800))});var a=document.createElement("script");"https"===window.location.protocol.split(":")[0]?a.src="https://zz.bdstatic.com/linksubmit/push.js":a.src="http://push.zhanzhang.baidu.com/push.js";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b),function(e){var t=/([http|https]:\/\/[a-zA-Z0-9\_\.]+\.so\.com)/gi,a=e.location.href;if(a&&!t.test(a)&&window.navigator.appName){var i="//s.360.cn/so/zz.gif",r="d182b3f28525f2db83acfaaf6e696dba",n=function(e){for(var t=location.href,a=t.split("").reverse(),i=e.split(""),r=[],n=0;n<16;n++)r.push(i[n]+(a[n]||""));return r.join("")}(r),o=new Image;a&&(i+="?url="+encodeURIComponent(a)),i+="&sid="+r,n&&(i+="&token="+n),o.src=i}}(window);var cnzz_s_tag=document.createElement("script");cnzz_s_tag.type="text/javascript",cnzz_s_tag.async=!0,cnzz_s_tag.charset="utf-8",cnzz_s_tag.src="https://s4.cnzz.com/stat.php?id=1253303069&async=1&online=2";var root_s=document.getElementsByTagName("script")[0];root_s.parentNode.insertBefore(cnzz_s_tag,root_s),-1==document.referrer.indexOf(document.domain)&&$(window).bind("beforeunload",function(){if(!1!==window.is_confirm)return"天猫淘宝的优惠券商品都在虎窝淘"}).bind("mouseover mouseleave",function(e){is_confirm="mouseleave"==e.type}),console.log("%c\n _\t  _  \n| |  | | \n| |__| |  _____    _____    _____   _____ \n|  __  | /  _  \\  /  _  \\  /  _  \\ /  ___\\ \n| |  | ||  |_|  ||  |_|  ||  |_|  |\\___  \\ \n|_|  |_| \\_____/  \\_____/  \\_____/ \\_____/ \n ","color:#e3544c"),console.log("%c\n欢迎访问虎窝拼！\n ","color:#fa7e89");
