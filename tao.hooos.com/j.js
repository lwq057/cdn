function links(){$('a[href^="/go?"]').attr("target","_blank"),$('a[href^="/go_"]').attr("target","_blank"),$('a[href^="go?"]').attr("target","_blank"),$('a[href^="go_"]').attr("target","_blank"),$("form").attr("target","_blank")}function lazyload_img(){var b,a=document.querySelectorAll("img");for(b=0;b<a.length;b++)a[b].getAttribute("data-original-url")||a[b].getAttribute("data-ll-status")||(-1==a[b].src.indexOf(".gif")&&-1!=a[b].src.indexOf(".alicdn.com")&&-1!=a[b].src.indexOf(".tbcdn.cn")||-1==a[b].src.indexOf("/imgextra/")?a[b].setAttribute("data-original-url",a[b].src+"_400x400q90"):a[b].setAttribute("data-original-url",a[b].src),a[b].src="https://cdn.jsdelivr.net/gh/lwq057/cdn@2.4/tao.hooos.com/lazyload.gif");lazyload_run()}function lazyload_run(){"object"!=typeof window.lazyloads?window.lazyloads=new LazyLoad({elements_selector:"img",data_src:"original-url",threshold:500,callback_loaded:function(a){a.setAttribute("data-original-url",a.src)},callback_error:function(a){a.setAttribute("src",a.src)},cancel_on_exit:!0}):window.lazyloads.update()}function discount(a,b){return d=String(10/parseFloat(b/a)),d.substring(0,3)+"折"}function datas_list(a,b){var c="";if(0==a.length)return c;switch(b){case"search":$.each(a,function(a,b){c+='<a href="search?w='+a+'">',c+='<img src="'+b+'"><i>'+a+"</i>",c+="</a>"});break;case"tag":$.each(a,function(a,b){c+='<a href="tag_'+a+'.html">',c+='<img src="'+b+'"><i>'+a+"</i>",c+="</a>"});break;case"category":$.each(a,function(a,b){c+='<a href="category_'+a+'.html">',c+='<img src="'+b.p+'"><i>'+b.n+"</i>",c+="</a>"});break;default:$.each(a,function(a,b){var d,e,f;c+="<li>",c+='<a href="goods_'+b.item_id+'.html">',c+="<i>",c+='<img src="'+b.pict_url+'">',"string"==typeof b.item_description&&(c+="<u>"+b.item_description+"</u>"),c+="</i>",c+="<em>",d="优惠",b.hasOwnProperty("coupon_amount")&&0!=b.coupon_amount?c+="<b>"+(b.zk_final_price-b.coupon_amount).toFixed(1)+"</b><i>券后价</i><s>"+b.zk_final_price+"</s>":(c+="<b>"+b.zk_final_price+"</b>",b.zk_final_price==b.reserve_price?(c+="<i>低价</i>",d="低价"):(d=discount(b.zk_final_price,b.reserve_price),c+="<i>"+d+"</i><s>"+b.reserve_price+"</s>")),c+="</em>",c+="<h4>"+b.title+"</h4>",b.hasOwnProperty("tqg_online_end_time")?(c+="<p>",c+='<i cd="'+b.tqg_online_end_time+'" c>抢购中</i>',c+="<i>已抢"+b.tqg_sold_count+"/"+b.tqg_total_count+"</i>",c+="</p>"):(e="",b.hasOwnProperty("user_type")&&(e="1"==b.user_type?"m":"b"),c+="<p "+e+">",c+="<i>"+("m"==e?"天猫":"淘宝")+"月销"+b.volume+"</i>",b.hasOwnProperty("nick")&&(c+="<i>"+b.nick+"</i>"),c+="</p>"),c+="</a>",f="",b.hasOwnProperty("coupon_share_url")?f=b.coupon_share_url:b.hasOwnProperty("url")?f=b.url:b.hasOwnProperty("click_url")&&(f=b.click_url),f="go?url="+encodeURIComponent(f)+"&id="+b.item_id,c+='<a buy href="'+f+'">',c+=b.hasOwnProperty("coupon_amount")&&0!=b.coupon_amount?b.coupon_amount+"元优惠券":d+"购买",c+="</a>",c+="</li>"})}return c}function dav(a){if(a){var b=$('input[name="id"]').val();b&&$.ajax({url:"/dav_"+b,async:!0,data:a,type:"GET",dataType:"json",cache:"true",success:function(a){if(0==$("body>main>section>div>div>video").length&&a&&a.video&&$("body>main>section>div>div[n]").prepend(a.video),descattr(a),""==a.desc){var b="";$("main>article figure img").each(function(){var a=$(this).attr("data-original-url")||$(this).attr("src");-1==b.indexOf(a)&&(b+='<img data-original-url="'+a+'" src="'+a+'">')}),descattr({desc:b.replaceAll("_400x400q90","")})}}})}}function descattr(a){var b,c;$("body>main>section>div>div[n]").length>0&&(b=a.pcDescContent||a.desc,b&&$("body>main>section>div>div[n]").append(b).removeAttr("n")),$("body>main>section>ol[n]").length>0&&(c="",a.itemProperties?$.each(a.itemProperties,function(a,b){c+="<li>"+b["name"]+"："+b["value"]+"</li>"}):a.attr&&$.each(a.attr[0],function(a,b){$.each(b,function(a,b){$.each(b,function(a,b){c+="<li>"+a+"："+b+"</li>"})})}),c&&$("body>main>section>ol[n]").append(c).removeAttr("n")),load_viewer()}function load_viewer(){$("body>main>article>div[imgs]>figure").length>0&&"object"!=typeof window.figure_viewers&&(window.figure_viewers=new Viewer($("body>main>article>div[imgs]>figure")[0],{url:"data-original-url",shown:function(){lazyload_run()},view:function(a){var b=a.detail.image.src;a.detail.image.src=b.replace("_400x400q90","")}})),$("body>main>section>div>div").length>0&&("object"!=typeof window.viewers?window.viewers=new Viewer($("body>main>section>div>div")[0],{url:"data-original-url",shown:function(){lazyload_run()}}):window.viewers.update())}function countdown(){$("[cd]").each(function(a,b){var e,c=$(this).attr("cd"),d=$(this).is("[c]")?"后结束":"后开始";c&&0==isNaN(c)&&(c=parseInt(c)),e=new Date(c),e-new Date>0&&setInterval(function(){var a=new Date,c=e-a,f=parseInt(c/1e3/60/60/24),g=parseInt(c/1e3/60/60%24),h=parseInt(c/1e3/60%60),i=parseInt(c/1e3%60);f?$(b).html(f+"天"+g+":"+h+":"+i+d):$(b).html(g+":"+h+":"+i+d)},1e3),$(this).removeAttr("cd")})}var a,b,cnzz_s_tag,root_s;links(),lazyload_img(),$('body>header>form>input[type="search"]').ready(function(){return 0==$(this).length?!1:($('body>header>form>input[type="search"]').autocomplete({serviceUrl:"https://suggest.taobao.com/sug?code=utf-8",dataType:"jsonp",paramName:"q",appendTo:$("body>header>form"),width:"100%",transformResult:function(a){return{suggestions:$.map(a.result,function(a){return{value:a[0],data:a[0]}})}}}),void 0)}),$("main>article figure").ready(function(){return 0==$("main>article figure img").length?!1:($("main>article figure").addClass("goods-wrapper").parent().addClass("goods-container").scrollLeft(0).css("overflow","hidden"),$("main>article figure img").addClass("goods-slide"),$("main>article figure").after('<i class="p"></i>'),gs=new Swiper(".goods-container",{wrapperClass:"goods-wrapper",slideClass:"goods-slide",slidesPerView:"auto",direction:"horizontal",pagination:{el:".p",clickable:!0,bulletElement:"a",bulletActiveClass:"active"},centeredSlides:!0,spaceBetween:0,autoplay:!1,grabCursor:!0,mousewheel:!0,clickable:!0,loop:!0}),$(".goods-wrapper").hover(function(){gs.autoplay.stop()},function(){gs.autoplay.start()}),lazyload_run(),void 0)}),$("small[p]").ready(function(){var b,c,d,e,f,g,a=$("small[p]");return 0==a.length?!1:(b=parseInt(a.attr("p"))||0,c=parseInt(a.attr("m"))||0,0!=c&&b>=c?!1:(d=a.prev().attr("page",b),e=d.parent(),f=!1,g=2,a.append("<span></span>"),$(window).on("scroll",function(){return f||0>=g?!1:(b=parseInt(d.attr("page")),0!=c&&b>=c?(a.children("span").hide(),!1):($(document).scrollTop()+$(window).height()>e.height()+e.offset().top&&(f=!0,$.ajax({type:"POST",url:window.location.href,data:{page:b+1,ajax:"true"},dataType:"json",success:function(c){c.list&&(d.append(datas_list(c.list,c.type)),c.page&&a.html(c.page+"<span></span>"),links(),lazyload_img(),countdown(),d.attr("page",b+1)),g-=1,0>=g||!c.page?(a.children("span").hide(),f=!0):f=!1},error:function(){g-=1,a.children("span").hide()}})),void 0))}),void 0))}),$("main>div figure").ready(function(){return 0==$("main>div figure img").length?!1:($("main>div figure>div").addClass("swiper-w").parent().addClass("swiper-c").scrollLeft(0).css("overflow","hidden"),$("main>div figure>div>a").addClass("swiper-s"),new Swiper(".swiper-c",{wrapperClass:"swiper-w",slideClass:"swiper-s",slidesPerView:"auto",direction:"horizontal",centeredSlidesBounds:!0,touchMoveStopPropagation:!0,centeredSlides:!0,spaceBetween:10,autoplay:!0,grabCursor:!0,clickable:!0,loop:!0}),$(".swiper-c").each(function(a,b){var c=b.swiper;$(this).hover(function(){c.autoplay.stop()},function(){c.autoplay.start()})}),lazyload_run(),void 0)}),$("body>main>article").ready(function(){var b,c,d,e,f,g,h,i,j,k,a=$("body>main>article>q").length>0?"领券":"购买";$('body>main>article label[for="qr"]').length>0&&(b=$('input[name="url"]').val(),"//"==b.substr(0,2)&&(b="https:"+b),b=encodeURIComponent(b),c="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data="+b+"&h=400&w=400&logo=https://img.alicdn.com/tps/i3/T1OjaVFl4dXXa.JOZB-114-114.png&",d=$('input[name="id"]').val(),e=$('input[name="model"]').val(),f=$("body>main>article figure img").attr("data-original-url")||$("body>main>article figure img").attr("src"),g="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data="+encodeURIComponent("http://"+window.location.host+"/go?id="+d+"&url="+b+"&model="+e)+"&h=400&w=400&logo="+f+"&",$("body>main>article").append('<input id="qr" type="checkbox"><dialog><header>二维码'+a+'</header><section><input tab="" id="qr-t" type="checkbox"><div tab=""><img src="'+c+'" alt="淘宝APP二维码"><p>[淘宝二维码] 使用淘宝或天猫APP扫码'+a+'</p></div><div tab=""><img src="'+g+'" alt="通用二维码"><p>[通用二维码] 扫描或长按识别二维码'+a+'</p></div></section><footer><label for="qr-t">切换</label> <label for="qr">确定</label></footer></dialog>'),lazyload_run()),$('body>main>article label[for="model"]').length>0&&(e=Math.floor(10*Math.random())+"."+$('input[name="model"]').val()+".:/",$("body>main>article").append('<input id="model" type="checkbox"><dialog><header>淘口令'+a+'</header><section><p>长按或选中右击复制以下淘口令</p><p id="modelcopy" data-clipboard-text="'+e+'"><b>'+e+"</b></p><p>复制成功后打开淘宝或天猫APP即可"+a+'</p></section><footer><label id="copymodel" data-clipboard-text="'+e+'">一键复制</label><label for="model">确定</label></footer></dialog>'),$("#copymodel").ready(function(){if(0==$(this).length)return!1;var a=new ClipboardJS("#copymodel");a.on("success",function(){document.getElementById("copymodel").innerText="复制成功",$("#copymodel").text("复制成功")}),a.on("error",function(){$("#copymodel").text("手动复制")})})),$('body>main>article label[for="share"]').length>0&&(h={},h["id"]=$('input[name="id"]').val(),h["img"]=$("body>main>article figure img").attr("data-original-url")||$("body>main>article figure img").attr("src"),h["price"]=$("body>main>article>div[info]>div em>b[p]").text()||0,h["oprice"]=$("body>main>article>div[info]>div em>b[o]").text()||0,h["coupon"]=$("body>main>article>q>*>div>em").text()||0,h["title"]=$("body>main>article>div[info]>h2").text()||$("body>main>article>div[info]>h1").text(),h["tag"]=$("body>main>article>div[info]>div[t]>i").map(function(){return $(this).text()}).get().join(",")||"",i="/server/static/share.html?",$.each(h,function(a,b){i+="&"+a+"="+b}),h["num"]=$("body>main>article>div[info]>b>i").map(function(){return $(this).text()}).get().join("、")||"",h["model"]=$('input[name="model"]').val()||"",j='0.0<br><img src="'+h["img"]+'"><br>',j+=h["title"]+"<br>",k=$("body>main>article>div[info]>h3").text()||$("body>main>article>div[info]>h1").text()||"",k&&(j+=k+"<br>"),h["num"]&&(j+="[ "+h["num"]+" ]<br>"),h["oprice"]&&(j+="【原售价】"+h["oprice"]+"元"),h["price"]&&(j+=h["coupon"]?"【在售价】"+h["price"]+"元<br>":"【优惠价】"+h["price"]+"元<br>"),h["coupon"]&&(j+="【券后价】"+(h["price"]-h["coupon"]).toFixed(2)+"元",j+="【优惠券】"+h["coupon"]+"元<br>"),h["model"]&&(j+="【淘口令】"+h["model"]+"<br>",j+="(复制此消息，打开淘宝或天猫APP，即可"+a+")<br>"),j+="详情："+window.location.href,$("body>main>article").append('<input id="share" type="checkbox"><dialog><header>分享文字或图片</header><section><div share><input tab id="share_type" type="checkbox"><div tab><p>长按分享或保存图片发送给好友</p><iframe id="share_img" width="100%" height="100%" data-src="'+i+'" src="'+h["img"]+'"></iframe></div><div tab><div id="share_text">'+j+'<br><input id="copysharetext" type="submit" value="点击复制"></div></div></div></section><footer><label for="share_type">图片/文字</label> <label for="share">收起窗口</label></footer></dialog>'),$("#share").click(function(){var a=$("#share_img");a.attr("data-src")&&(a.attr("src",a.attr("data-src")),a.removeAttr("data-src"))}),$("#copysharetext").ready(function(){if(0==$(this).length)return!1;var a=new ClipboardJS("#copysharetext",{target:function(){return document.getElementById("share_text")}});a.on("success",function(){$("#copysharetext").val("复制成功去分享吧")}),a.on("error",function(){$("#copysharetext").val("复制失败请长按或选中右击复制")})}))}),$("body>main>article").ready(function(){var b,a=$('input[name="id"]').val();a&&($("body>main>section>div>div[n]").length>0||$("body>main>section>ol[n]").length>0)&&(b="https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdesc/6.0/?data={%22id%22:%22"+a+"%22}",$.ajax({url:b,timeout:1e3,tryCount:0,retryLimit:10,cache:!1,async:!1,dataType:"jsonp",jsonp:"callback",success:function(a){if(this.tryCount++,a.data.pcDescContent)descattr(a.data),dav({v:1});else{if(this.tryCount<this.retryLimit)return this.url.length>400&&(this.url=b),$.ajax(this),void 0;dav({d:1,a:1,v:1})}},error:function(){this.tryCount++,this.url.length>400&&(this.url=b),this.tryCount<this.retryLimit?$.ajax(this):dav({d:1,a:1,v:1})}}))}),load_viewer(),countdown(),$("main>section>div>label[i]").click(function(){$("body,html").animate({scrollTop:$("body>main>article").offset().top},400)}),$("body>main>article>q>label").ready(function(){var c,a=$("body>main>article>q>label"),b=$('body>main>article>nav>label[for="model"]');a.length>0&&b.length>0&&(c=navigator.userAgent.toLowerCase(),("micromessenger"==c.match(/MicroMessenger/i)||"baiduboxapp"==c.match(/baiduboxapp/i))&&a.attr("for","model"))}),$("body>footer").prepend('<p>工信部ICP备案：闽ICP备12002928号-2 &nbsp;&nbsp;&nbsp; 公安部备案：闽公网安备 35042502000103号 &nbsp;&nbsp;&nbsp; <a rel="external nofollow" href="http://wpa.qq.com/msgrd?v=3&amp;uin=12692752&amp;site=tao.hooos.com&amp;menu=yes" target="_blank" title="联系QQ">联系我们</a> &nbsp;&nbsp;&nbsp; <span id="cnzz_stat_icon_1253303069">CNZZ</span></p>'),$('body>header>form>input[type="search"]').ready(function(){var a=function(){var a=["最近想买的东西是不是有优惠了？","可以复制商品标题搜索看看","好像有什么东西该换新的了吧？","最近买的东西有没有买贵了？","查查家人喜欢的东西优惠力度大吗？","天猫淘宝优惠商品都在这里哦","家里是不是缺了点什么东西？","最近有什么想吃的东西吗？","最近有什么好玩的东西吗？","给TA买个礼物吧？"],b=Math.floor(Math.random()*a.length);$('body>header>form>input[type="search"]').attr("placeholder",a[b])},b=setInterval(a,1e4);$('body>header>form>input[type="search"]').focus(function(){clearInterval(b),$(this).attr("placeholder","可输入商品关键词、标题、ID、链接"),$(this).blur(function(){b=setInterval(a,1e4)})})}),$("body").append('<s><i t title="回顶部"></i><i r title="上一页"></i></s>'),$("body>s>i[t]").click(function(){$("body,html").animate({scrollTop:0},400)}),$("body>s>i[r]").click(function(){history.back()}),$(window).scroll(function(){$("body>s").hide(),clearTimeout($.data(this,"scrollTimer")),$.data(this,"scrollTimer",setTimeout(function(){$("body>s").show(),$(window).scrollTop()>100?$("body>s>i[t]").show():$("body>s>i[t]").hide(),document.referrer.indexOf(window.location.host)>0?$("body>s>i[r]").show():$("body>s>i[r]").hide()},800))}),$("body>main>article").length>0&&$("body>main>div>nav>a").length>0&&$("body>nav>a").eq(1).attr("href",$("body>main>div>nav>a").eq(0).attr("href")),a=document.createElement("script"),a.src="https"===window.location.protocol.split(":")[0]?"https://zz.bdstatic.com/linksubmit/push.js":"http://push.zhanzhang.baidu.com/push.js",b=document.getElementsByTagName("script")[0],b.parentNode.insertBefore(a,b),function(a){function b(a){var f,g,b=location.href,c=b.split("").reverse(),d=a.split(""),e=[];for(f=0,g=16;g>f;f++)e.push(d[f]+(c[f]||""));return e.join("")}var e,f,g,h,c=/([http|https]:\/\/[a-zA-Z0-9\_\.]+\.so\.com)/gi,d=a.location.href;d&&!c.test(d)&&window.navigator.appName&&(e="//s.360.cn/so/zz.gif",f="d182b3f28525f2db83acfaaf6e696dba",g=b(f),h=new Image,d&&(e+="?url="+encodeURIComponent(d)),f&&(e+="&sid="+f),g&&(e+="&token="+g),f&&(h.src=e))}(window),cnzz_s_tag=document.createElement("script"),cnzz_s_tag.type="text/javascript",cnzz_s_tag.async=!0,cnzz_s_tag.charset="utf-8",cnzz_s_tag.src="https://s4.cnzz.com/stat.php?id=1253303069&async=1&online=2",root_s=document.getElementsByTagName("script")[0],root_s.parentNode.insertBefore(cnzz_s_tag,root_s),$("<link>").attr({rel:"shortcut icon",href:"//cdn.jsdelivr.net/gh/lwq057/cdn@1.3/tao.hooos.com/favicon.ico"}).appendTo("head"),$("<link>").attr({rel:"manifest",href:"//cdn.jsdelivr.net/gh/lwq057/cdn@1.4/tao.hooos.com/manifest.json"}).appendTo("head"),-1==document.referrer.indexOf(document.domain)&&$(window).bind("beforeunload",function(){return window.is_confirm!==!1?"天猫淘宝的优惠券商品都在虎窝淘":void 0}).bind("mouseover mouseleave",function(a){is_confirm="mouseleave"==a.type}),$.ajax({url:"/?sitemap=true",cache:!0,async:!0}),console.log("%c\n _	  _  \n| |  | | \n| |__| |  _____    _____    _____   _____ \n|  __  | /  _  \\  /  _  \\  /  _  \\ /  ___\\ \n| |  | ||  |_|  ||  |_|  ||  |_|  |\\___  \\ \n|_|  |_| \\_____/  \\_____/  \\_____/ \\_____/ \n ","color:#fa54b6"),console.log("%c\n欢迎访问虎窝淘！\n ","color:#fa7e89"),console.log("%c\n意见反馈：https://www.hooos.com/group-287-1.html \n ","color:#fba45e");
