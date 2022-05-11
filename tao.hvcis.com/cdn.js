//IE H5兼容
(function(){
    var html5elmeents = "article|aside|audio|canvas|footer|header|menu|nav|section|time|video".split('|'); 
    for(var i = 0; i < html5elmeents.length; i++){ 
       document.createElement(html5elmeents[i]); 
    }
 })();

function emptys(v){
	return (v) ? v : '';
}

function getCookie(k){
    var a,r=new RegExp("(^| )"+k+"=([^;]*)(;|$)");
    if(a=document.cookie.match(r)){
		return unescape(a[2]);
	}
    return null;
}
function setCookie(k,v,s){
    var e = new Date();
    e.setTime(e.getTime() + s*1000);
    document.cookie = k + "="+ escape (v) + ";expires=" + e.toGMTString();
}

//ajax缓存
$.ajaxSetup({cache:true});

//延迟加载图片处理
function lazyload_img(v){
	if (v){
		data_dom = $(v);
		data_dom.find("img").each(function(i){
			data_dom.find("img")[i].setAttribute('data-src', $(this).attr('src') );
			data_dom.find("img")[i].setAttribute('class', 'l' );
		});
		//data_dom.find("img").removeAttr("src");
		data_dom.find("img").attr('src','https://cdn.jsdelivr.net/gh/lwq057/cdn/tao.hvcis.com/lazyload.gif');
		lazyload_run();
		return data_dom;
	}else{
		$("div img.l").each(function(i){
			if (!$(this).attr('data-src')){
				$(this).attr('data-src',$(this).attr('src'));
				$(this).attr('src','https://cdn.jsdelivr.net/gh/lwq057/cdn/tao.hvcis.com/lazyload.gif');
				//$(this).removeAttr("src");
			}
		});
	}
	lazyload_run();
}

//延迟加载
var lazyloads;
function lazyload_run(){
	$.getScript('https://cdn.jsdelivr.net/npm/vanilla-lazyload@16.1.0/dist/lazyload.min.js',function(){
		if (typeof(window.lazyloads) !== 'object'){
			lazyload_img();
			window.lazyloads = new LazyLoad({
				elements_selector:'img',
				cancel_on_exit: true,
				callback_loaded:function(el){
					$(el).removeClass('l');
				}
			});
		}else{
			window.lazyloads.update();
		}
	});
};
lazyload_run();


//展览幻灯片
$('.exhibition').ready(function(){
	if ($('.exhibition .body').length > 0){
		$.getScript("https://cdn.jsdelivr.net/npm/swiper@5.4.1/js/swiper.min.js",function(){
			$(".exhibition .list img").each(function(i){
				$(this).addClass('sl');
				$(this).attr('data-src',$(this).attr('src'));
				$(this).attr('src','https://cdn.jsdelivr.net/gh/lwq057/cdn/tao.hvcis.com/lazyload.gif');
			});
			new Swiper('.exhibition .body',{
				lazy: {
					lazy: true,
					elementClass: 'sl',
					loadPrevNext: true,
					loadPrevNextAmount: 5
				},
				slidesPerView: 'auto',
				centeredSlidesBounds:true,
				wrapperClass : 'list',
				slideClass : 'item',
				autoplay: true,
				grabCursor: true,
				autoplay: {
					delay: 5000,
					disableOnInteraction: false
				},
				//mousewheel: true,
				clickable: true,
				loop: true
			});
		});
	}
});

//宝贝幻灯片
$('.goods .cover').ready(function(){
	if ($('.goods .cover').length > 0){
		$('.goods .cover .slide').append('<div class="pagination"></div>');
		$.getScript("https://cdn.jsdelivr.net/npm/swiper@5.4.1/js/swiper.min.js",function(){
			pics = new Swiper('.goods .cover .slide',{
				wrapperClass : 'g-c-u',
				slideClass : 'g-c-i',
				slidesPerView: 'auto',
				centeredSlides: true,
				spaceBetween: 10,
				autoplay: false,
				grabCursor: true,
				pagination: {
					el: '.pagination',
					clickable: true,
					bulletElement : 'a',
					bulletActiveClass: 'active',
				},
				mousewheel: true,
				clickable: true,
				loop: true
			});
			$('.goods .cover').hover(function(){
					pics.autoplay.stop();
			},function(){
					pics.autoplay.start();
			});


			$('.goods .recommends').ready(function(){
				recommend = new Swiper('.goods .recommends .recommend',{
					wrapperClass : 'r-c-u',
					slideClass : 'gi',
					slidesPerView: 'auto',
					centeredSlides: true,
					grabCursor: true,
					autoplay: true,
					autoplay: {
						delay: 2000,
						disableOnInteraction: false
					},
					mousewheel: true,
					clickable: true,
					loop: true,
					observer:true,
					observeParents:true
				});
				$('.goods .recommends .recommend').hover(function(){
						recommend.autoplay.stop();
				},function(){
						recommend.autoplay.start();
				});
			});

		});
	}
});


//TAB切换
$("[tab^='tab-']").click(function(){
	var tab = $(this).attr('tab');
	$(this).siblings("[tab^='tab-']").removeClass('c');
	$(this).addClass('c');
	$('.tab.'+tab).siblings('.tab').hide();
	$('.tab.'+tab).show();
});


//回车搜索
$('header .search input[type="search"]').bind('keypress', function (event){
	if (event.keyCode == "13"){
		$('header .search input[type="submit"]').click();
	}
});

//搜索自动完成
$('.search').ready(function(){
	$.getScript('https://cdn.jsdelivr.net/npm/devbridge-autocomplete@1.4.11/dist/jquery.autocomplete.min.js',function(){
		$('header .search input[type="search"]').autocomplete({
			serviceUrl: 'https://suggest.taobao.com/sug?code=utf-8',
			dataType: 'jsonp',
			paramName: 'q',
			transformResult: function(response){
				return {
					suggestions: $.map(response.result, function(i){
						return { value: i[0], data: i[0] };
					})
				};
			}
		});
	});

});



//加载详情与属性
$('body').ready(function(){
	var id = parseInt($('.goods').attr("data-id"));
	var is_cache = parseInt($('.goods').attr("data-cache"));
	var sellerid = $('.goods').attr("data-sellerid");

	if (id){
		
		if ($('#desc .body[n]').length > 0){
			//获取详情
			$.ajax({
				url:"https://hws.m.taobao.com/cache/desc/5.0?id="+id,
				timeout:1000,
				tryCount:0,
				retryLimit:5,
				cache:false,
				async: false,
				dataType:'jsonp',
				jsonp:'callback',
				success:function(result){
					this.tryCount++;
					if (result.sellerId){
						desc(result);
						store_desc(result);
					}else if(this.tryCount < this.retryLimit){
						if (this.url.length > 400){
							this.url = "https://hws.m.taobao.com/cache/desc/5.0?id="+id;
						}
						$.ajax(this);
						return;
					} else {
                        alternate_desc();
                    }
				},
				error:function(){
					this.tryCount++;
					if (this.url.length > 400){
						this.url = "https://hws.m.taobao.com/cache/desc/5.0?id="+id;
					}
					if(this.tryCount < this.retryLimit){
						$.ajax(this);
					} else {
                        alternate_desc();
                    }
					return;
				}
			});
		}

		if ($('#attr .body').text().trim().length == 0){
			return;
			//获取属性
			$.ajax({
				url:'https://acs.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/?data=%7B"itemNumId"%3A"'+id+'"%7D',
				timeout:1000,
				tryCount:0,
				retryLimit:5,
				cache:false,
				async: false,
				dataType:'jsonp',
				jsonp:'callback',
				success:function(result){
					this.tryCount++;
					if (result.data){
						attr(result.data);
					}else if(this.tryCount < this.retryLimit){
						if (this.url.length > 400){
							this.url = 'https://acs.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/?data=%7B"itemNumId"%3A"'+id+'"%7D';
						}
						$.ajax(this);
						return;
					}
				},
				error:function(){
					this.tryCount++;
					if (this.url.length > 400){
						this.url = 'https://acs.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/?data=%7B"itemNumId"%3A"'+id+'"%7D';
					}
					if(this.tryCount < this.retryLimit){
						$.ajax(this);
					}
					return;
				}
			});
		}

		
	}

});

//保存提交描述
function store_desc(data){
	data = JSON.stringify(data);
	id = parseInt($('.goods').attr("data-id"));
	token = $('.goods').attr("data-token");
	$.post("/plugin-storedesc",{desc:data,id:id,token:token});
}


//保存提交属性
function store_attr(data){
	data = JSON.stringify(data);
	id = parseInt($('.goods').attr("data-id"));
	token = $('.goods').attr("data-token");
	$.post("/plugin-storeattr",{attr:data,id:id,token:token});
}

//读取属性
function attr(datas){

	//卖家
	if (datas.seller){
		var seller_html = '<h4><div class="i"><img src="'+((datas.seller.shopIcon) ? datas.seller.shopIcon : '/static/ico-114.png')+'"/></div><div class="c"><i class="'+ ((datas.seller.shopType=='B')?'tmall':'taobao') +'"></i><b>'+datas.seller.shopName+'</b></div></h4>';
		seller_html += '<div class="body">';
		seller_html += '<dl><dt>店铺粉丝</dt><dd>'+datas.seller.fans+'</dd></dl>';
		$.each(datas.seller.evaluates,function(k,v){
			seller_html += '<dl><dt>'+v.title+'</dt><dd>'+v.score+'</dd></dl>';
		});
		seller_html += '</div>';
		$('#attr .body .seller').html(seller_html);
	}


	//属性
	var props_html = '';
	if (JSON.stringify(datas.props) != "{}"){
		if (datas.props.groupProps != 'undefined'){
			$.each(datas.props.groupProps[0],function(k,v){
				props_html += '<h4>'+k+'</h4>';
				props_html += '<ul>';
				$.each(v,function(kk,vv){
					var kkk = Object.keys(vv)[0];
					props_html += '<li title="'+vv[kkk]+'">'+kkk+': '+vv[kkk]+'</li>';
				});
				props_html += '</ul>';
			});
		}
		if (datas.props.importantProps){
			props_html += '<h4>产品属性</h4>';
			props_html += '<ul>';
			$.each(datas.props.importantProps,function(k,v){
				props_html += '<li title="'+v['value']+'">'+v['name']+': '+v['value']+'</li>';
			});
			props_html += '</ul>';
		}
	}
	if (JSON.stringify(datas.props2) != "{}"){
		if (datas.props2.groupProps != 'undefined'){
			$.each(datas.props2.groupProps[0],function(k,v){
				props_html += '<h4>'+k+'</h4>';
				props_html += '<ul>';
				$.each(v,function(kk,vv){
					var kkk = Object.keys(vv)[0];
					props_html += '<li title="'+vv[kkk]+'">'+kkk+': '+vv[kkk]+'</li>';
				});
				props_html += '</ul>';
			});
		}
		if (datas.props2.importantProps){
			props_html += '<h4>产品属性</h4>';
			props_html += '<ul>';
			$.each(datas.props2.importantProps,function(k,v){
				props_html += '<li title="'+v['value']+'">'+v['name']+': '+v['value']+'</li>';
			});
			props_html += '</ul>';
		}
	}
	if (props_html){
		$('#attr .body .props').html(props_html);
	}else{
		$('#attr .body .props').hide();
	}


	//评论
	var rate_html = '';
	if (datas.rate.keywords){
		rate_html += '<h4>大众印象</h4>';
		rate_html += '<ul>';
		$.each(datas.rate.keywords,function(k,v){
			rate_html += '<li>'+v.word+'<i>'+v.count+'</i></li>';
		});
		rate_html += '</ul>';
	}
	rate_html += '<h4>最佳评价</h4>';
	$.each(datas.rate.rateList,function(k,v){v
		rate_html += '<p>'+ (v.skuInfo?'<i>'+v.skuInfo+'</i>':'') + v.content+'</p>';
	});
	$('#attr .body .rate').html(rate_html);

	//存储
	var attr_data = {};
	attr_data.seller = datas.seller;
	attr_data.props = datas.props;
	attr_data.props2 = datas.props2;
	attr_data.rate = datas.rate;
	store_attr(attr_data);

}

// 替补详情
function alternate_desc() {
    var desc = '';
    $('.goods .slide img').each(function () {
        var src = $(this).attr('data-original-url') || $(this).attr('src');
        if (desc.indexOf(src) == -1) {
            desc += '<img data-original-url="' + src + '" src="' + src + '">';
        }
    });
    $('#desc .body').html( desc.replace(/_500x500q90.jpg/g, '') );
    lazyload_img();
	viewers();
}

//读取详情
function desc(data){
	if (!data.wdescContent){ return null; }
	var desc_html = '';
	var desc_data = data.wdescContent;
	var regx = /<[^>]*>|<\/[^>]*>/gm;
	$.each(desc_data.pages,function(i,v){
		if (v.indexOf("</img>") != -1) {
			desc_html += "<img class='l'src='" + v.replace(regx,'') + "'>";
		}else if (v.indexOf("</txt>") != -1) {
			desc_html += "<p>" + v.replace(regx,'') + "</p>";
		}
	});
	if (desc_html){
		$('#desc .body').html( desc_html );
		// desc_html = '<section class="box"><h2 class="title">宝贝介绍</h2><div id="desc">'+desc_html+'<div class="stretch"><span>展开全部</span></div></div></section>';
		// $('.goods').parent('.box').after(desc_html);
		lazyload_img();
		viewers();
		// stretch();
	}
}

//加载更多
$('#list').ready(function(){
	lists = $('#list');
	max_lists_num = 1;
	get_lists_ing = 0;
	$(window).on("scroll",function(){
		if ( (!get_lists_ing)&&(max_lists_num > 0) ){
			if( ($(document).scrollTop()+$(window).height()-50) > (lists.height()+lists.scrollTop()) ){
				if ($('.page')){
					$('.page .l').show();
					$('.page .l').html('<i></i><i></i><i></i>');
				}
				get_lists_ing = 1;
				var data_page = parseInt(lists.attr("data-page"));
				if (data_page){
					$.ajax({
						type:'POST',
						url:window.location.href,
						data:{ page:(data_page+1) , is_ajax:'true' },
						dataType:'json',
						success: function (datas){
							if (datas.data){
								lists.append(lazyload_img(datas.data));
								lists.attr("data-page",data_page+1);
								if (datas.page){
									$('.page').html(datas.page);
								}
								get_lists_ing = 0;
								item_time();
							}
							max_lists_num = max_lists_num-1;
							if ((max_lists_num <= 0)||(!datas.page)){
								lists.attr("data-page",0);
								$('.page .l').hide();
							}
						}
					});
				}
			}
		}
	});
});


//倒计时
function countdown(time_e,time_t){
	if (!(/^\d+$/.test(time_t))){
		time_t = time_t.replace(new RegExp(/-/gm) ,'/');
		var time_t = new Date(time_t);
	}
	if ( ( time_t - (new Date) ) > 0 ){
		setInterval(function (){
			var nowtime = new Date();
			var time = time_t - nowtime;
			var day = parseInt(time / 1000 / 60 / 60 / 24);
			var hour = parseInt(time / 1000 / 60 / 60 % 24);
			var minute = parseInt(time / 1000 / 60 % 60);
			var seconds = parseInt(time / 1000 % 60);
			if (!day){
				time_e.html(hour + ':' + minute + ':' + seconds);
			}else{
				time_e.html(day + '天' + hour + ':' + minute + ':' + seconds);
			}
		}, 1000);
	}
}


//宝贝优惠倒计时
function item_time(){
	$('.item i.time').ready(function(){
		$('.item i.time').each(function(){
			var time_e = $(this);
			var time_t = time_e.attr("data-time");
			var time_st = time_e.attr("data-st");
			var time_et = time_e.attr("data-et");
			if (time_t){
				countdown(time_e,time_t,null);
			}else if(time_st && time_et){
				countdown(time_e,time_et,null);
			}
			time_e.removeClass('time');
		});
	});
}
item_time();


//宝贝介绍评价图片浏览
$('#desc,#rates,.goods .cover .slide').ready(function (){
	if ($('#desc,#rates,.goods .cover .slide').length > 0){
		$.getScript("https://cdn.jsdelivr.net/npm/viewerjs@1.5.0/dist/viewer.min.js",function(){
			window.Viewer = Viewer;
			viewers();
		});
	}
});
function viewers(){
	if (window.Viewer){
		if($('#viewer_css').length == 0){
			$("<link>").attr({id: "viewer_css",rel: "stylesheet",type:"text/css",href:"https://cdn.jsdelivr.net/npm/viewerjs@1.5.0/dist/viewer.min.css"}).appendTo("head");
		}
		if($('#desc .body img').length > 0){
			if (!window.desc_viewer){
				window.desc_viewer = new window.Viewer(document.getElementById('desc'),{url: 'data-src'});
			}
		}
		if($('.goods .cover .slide img').length > 0){
			if (!window.slide_viewer){
				window.slide_viewer = new window.Viewer($('.goods .cover .slide')[0],{url: 'data-src'});
			}
		}
		lazyload_run();
	}
}


//提示框
function prompts(id,info,buttons,title,callback){
	if(!buttons){
		buttons = '<span onclick="javascript:$(\'#'+id+'\').toggle();">确定</span><span onclick="javascript:$(\'#'+id+'\').toggle();">关闭</span>';
	}
	if(!title){
		title_html = '';
	}else{
		title_html = '<h4 class="title">'+title+'</h4>';
	}
	var html = '<div class="prompt-box" id="'+id+'">'+title_html+'<div class="body">'+info+'</div><div class="button">'+buttons+'</div></div>';
	if($('#'+id).length>0){ $('#'+id).remove();}
	$('body').append(html);
	
	if (callback){
		callback();
	}
}


//淘口令
$('#command').click(function(){
	var command = $('#command').attr("data-command");
	if (command){
		var id = 'commandbox';
		var info = '<p>复制淘口令领取购买,宝贝的淘口令（包含￥符号）</p><p style="padding:0.5rem 0;"><b style="font-size:1.4rem;color:#fe6f84;">'+command+'</b></p><p>复制成功:手动打开淘宝APP即可购买.</p><p>复制失败:请尝试手动复制,选中或长按淘口令复制.</p>';
		var buttons = '<span class="copycommand" data-clipboard-text="'+command+'">复制</span><span onclick="javascript:$(\'#'+id+'\').toggle();">关闭</span>';
		prompts(id,info,buttons,'淘口令购买');

		if(typeof(ClipboardJS)=='undefined'){
			$.getScript('https://cdn.jsdelivr.net/npm/clipboard@2.0.6/dist/clipboard.min.js',function(){
				var clipboard = new ClipboardJS('.copycommand');
				clipboard.on('success', function(e){
					$('.copycommand').html('复制成功');
				});
				clipboard.on('error', function(e){
					$('.copycommand').html('请手动复制');
					$('.prompt-info p b').select();
				});
			});
		}else{
			var clipboard = new ClipboardJS('.copycommand');
			clipboard.on('success', function(e){
				$('.copycommand').html('复制成功');
			});
			clipboard.on('error', function(e){
				$('.copycommand').html('请手动复制');
				$('.prompt-info p b').select();
			});
		}
	}
});


//分享
$('#share').click(function(){
	if ($('#sharebox').length !=0 ){
		$('#sharebox').toggle();
		return true;
	}
	var command = emptys( $('#command').attr("data-command") );
	var title = emptys( $("h1").text() );
	var img = emptys( $(".g-c-u").find("img").eq(0).attr("src") );
	var id = emptys( $('.goods').attr("data-id") );
	var price = emptys( $('.goods').attr("data-price") );
	var oprice = emptys( $('.goods').attr("data-oprice") );
	var coupon = $('.goods').attr("data-coupon");
	var category = emptys( $('.goods').attr("data-category") );
	var url = window.location.href;
	var sitename = '优惠世家';
	//var discount = $('meta[name="description"]')[0].content;
	
	var lf = '<br/>';
	discount = '<img style="max-width:30%;" src="'+ img +'" />'+ lf;
	discount += '【'+category+'】'+ title + lf;
	if (oprice) { discount += '【原价】'+ oprice +'元 '+lf; }
	if (price) { discount += '【优惠价】'+ price +'元 '+lf; }
	if (coupon !== '0'){
		if (price){
			discount += '【券后价】'+(Math.floor(parseFloat(price-coupon) * 100) / 100)+'元';
		}else{
			discount += '【券后价】'+(Math.floor(parseFloat(price-coupon) * 100) / 100)+'元';
		}
		discount += ' ('+coupon+'元优惠券) '+lf;
	}
	if (command) { discount += '【淘口令】'+ command +' '+lf; }
	discount += '【下单地址】'+ window.location.href +' '+lf;
	if (command){
		if (coupon){
			discount += '复制此消息,打开[手机淘宝]即可领券下单.';
		}else{
			discount += '复制此消息,打开[手机淘宝]即可下单.';
		}
	}else{
		discount += '更多超值得买的商品,访问网站查看：'+document.domain;
	}

	var tag = $('.goods .info .r p:last').text();

	if (title && img && id){

		var discount_txt = discount.replace(/<[^>]+>|&[^>]+;/g,"\n").trim();
		var sites_data = '';
		sites_data += '<a href="http://service.weibo.com/share/share.php?url='+url+'&title='+ encodeURIComponent("#"+ ( (category) ? category : sitename ) +"# "+discount_txt) +'&pic='+img+'" target="_blank">新浪微博</a>';
		sites_data += '<a href="https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+url+'&title='+title+'&pics='+img+'&site='+sitename+'" target="_blank">QQ空间</a>';
		sites_data += '<a href="http://tieba.baidu.com/f/commit/share/openShareApi?url='+encodeURIComponent(url)+'&title='+title+'&pic='+img.replace('https://','http://')+'&site='+sitename+'" target="_blank">百度贴吧</a>';
		sites_data += '<a href="https://www.douban.com/share/service?href='+url+'&name='+title+'&image='+img+'&site='+sitename+'&text='+encodeURIComponent(discount_txt)+'" target="_blank">豆瓣</a>';
		sites_data += '<a href="https://connect.qq.com/widget/shareqq/index.html?url='+encodeURIComponent(url)+'&title='+title+'&pics='+img+'&desc='+encodeURIComponent(discount_txt)+'" target="_blank">QQ好友</a>';
		sites_data += '<a href="http://widget.renren.com/dialog/share?resourceUrl='+url+'&title='+title+'&pic='+img+'&description='+encodeURIComponent(discount_txt)+'" target="_blank">人人网</a>';
		sites_data += '<a href="https://www.facebook.com/share.php?u='+url+'&t='+title+'&pic='+img.replace('https://','http://')+'" target="_blank">Facebook</a>';
		sites_data += '<a href="https://twitter.com/intent/tweet?url='+encodeURIComponent(url)+'&text='+encodeURIComponent(discount_txt)+'&pic='+encodeURIComponent(img)+'&hashtags='+category+'" target="_blank">Twitter</a>';
		sites_data += '<a href="mailto:?subject='+title+'&body='+discount_txt+'" target="_blank">电子邮件</a>';
		sites_data += '<a href="sms:?body='+discount_txt+'" target="_blank">短信</a>';

		var prompt_id = 'sharebox';

		var info = '<div class="share-box" id="share_txt" style="display:none;line-height:2rem;"><p>长按或选中复制此消息分享给你的好友：</p><p class="share_txt_box"><i contentEditable="false" class="share_txt_cut" style="font-style:initial;white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;overflow:auto;word-break:break-all;word-wrap:break-word">'+discount+'</i><div class="copysharetxt" style="width:40%;margin:0.2rem auto;cursor:pointer;background-color:#ffffff;color:#57606f;font-size:0.8rem;border-radius:3px;border:0.1rem solid #57606f;">点击复制文字</div></p></div>';
		info += '<div class="share-box" id="share_img" style="line-height:2rem;"><p>右击或长按保存图片分享给你的好友：</p><div style="width:100%;position: relative;padding-top: 90%;"><iframe id="share_img_iframe" style="position:absolute;top:0;left: 0;width:100%;height:100%;overflow:hidden;" scrolling="no" src=""></iframe></div></div>';
		info += '<div class="share-box" id="share_site" style="display:none;line-height:2rem;"><p>分享到社交平台：</p><div style="display:flex;flex-wrap:wrap;text-align:center;"><style>#share_site a{background-color:#ffffff;padding:0 0.4rem;margin:0.5rem 1rem;color:#57606f;flex-grow:1;font-size:0.8rem;border-radius:3px;border:0.1rem solid #57606f;}#share_site a:hover{background-color:#7bed9f;color:#fff;border-color:#2ed573;}</style>'+sites_data+'</div></div>';
		
		var buttons = '<span onclick="javascript:$(\'.share-box\').hide();$(\'#share_img\').show();">图片</span><span onclick="javascript:$(\'.share-box\').hide();$(\'#share_txt\').show();">文字</span><span onclick="javascript:$(\'.share-box\').hide();$(\'#share_site\').show();">平台</span><span onclick="javascript:$(\'#'+prompt_id+'\').toggle();">关闭</span>';
		
		var share_img_url = '/static/share_img.html?hooos&img='+img+'&id='+id+'&price='+price+'&oprice='+oprice+'&coupon='+coupon+'&tag='+tag+'&title='+encodeURIComponent(encodeURI(title))+'&_t='+Date.parse(new Date());
		
		prompts(prompt_id,info,buttons,'分享优惠商品');
		if ( $("#share_img_iframe").attr('src') != share_img_url){
			$("#share_img_iframe").attr('src',share_img_url);
		}
	
		$('.share_txt_box').click(function(){
			$(this).select();
		});

		$.getScript('https://cdn.jsdelivr.net/npm/clipboard@2.0.6/dist/clipboard.min.js',function(){
			var share_txt = new ClipboardJS('.share_txt_box', {
				target: function(e){
					return document.querySelector('.share_txt_cut');
				}
			});
			share_txt.on('success', function(e){
				share_txt.destroy();
			});
			share_txt.on('error', function(e){
				share_txt.destroy();
			});

			var clipboard = new ClipboardJS('.copysharetxt', {
				target: function(e){
					return document.querySelector('.share_txt_cut');
				}
			});
			clipboard.on('success', function(e){
				$('.copysharetxt').html('复制成功');
			});
			clipboard.on('error', function(e){
				$('.copysharetxt').html('请手动复制');
				$('#share_txt_cut').select();
			});
		});

	
	}
});





//支付宝红包
$('.alipay_rp').click(function(){
	var prompt_id = 'alipayrpbox';
	var info = '<p style="background-color:#e72a3d;"><a target="_blank" href="/goto?url=https://qr.alipay.com/c1x06663un01sztsrmasqb9"><img title="支付宝红包" src="/static/zfbhb.png" style="max-height:28rem;max-height:62vh;max-width:100%;" /></a></p><p>支付宝APP搜索 “549377813” 领取红包.</p><p>可长按或右键保存图片分享给你的好友领取.</p><p>点击图片可直接跳转至支付宝.</p>';
	var buttons = '<span class="alipay_rp_copy" data-clipboard-text="549377813">复制搜索码</span><span onclick="javascript:$(\'#'+prompt_id+'\').toggle();">关闭</span>';
	prompts(prompt_id,info,buttons,'支付宝每天领门店付款抵扣红包',function(){
		$('#'+prompt_id).show();
	});
	$.getScript('https://cdn.jsdelivr.net/npm/clipboard@2.0.6/dist/clipboard.min.js',function(){
		var clipboard = new ClipboardJS('.alipay_rp_copy');
		clipboard.on('success', function(e){
			$('#'+prompt_id).hide();
		});
		clipboard.on('error', function(e){
			$('.alipay_rp_copy').html('请手动复制');
		});
	});
});


//微信公众号
function oa_weixin_show(){
	var prompt_id = 'oaweixin';
	var info = '<p>天猫淘宝优惠商品都在这</p><p>关注优惠世家公众号方便随时使用</p><p><img title="微信公众号二维码" src="/static/weixin_oa.jpg" style="max-height:28rem;max-height:62vh;max-width:100%;" /></p><p>微信扫码关注或长按识别二维码</p><p>也可以通过微信搜索公公众号[优惠世家]</p><p>长按或右击二维码保存可分享给好友</p>';
	var buttons = '<span style="width:100%;" onclick="javascript:$(\'#'+prompt_id+'\').toggle();setCookie(\'cwx\',1,2592000);">关闭</span>';
	prompts(prompt_id,info,buttons,'关注优惠世家公众号',function(){
		$('#'+prompt_id).show();
	});
}
$('.oa_weixin').click(function(){oa_weixin_show();});
$('body').ready(function(){
	if (!getCookie('cwx')){
		setTimeout(function(){ oa_weixin_show(); }, 20000);
	}
});


//宝贝详情收起
$('#desc .dc.c-o').click(function(){
	$('html,body').animate({scrollTop:$('#desc').offset().top},400);
});


//图片加载失败
$('img').on('error',function(){
	var src = $(this).attr('src');
	if(src.indexOf('_.webp') > 0){
		$(this).attr('src',src.replace('_.webp',''));
	}else{
		if ( !$(this).hasClass('l') && !$(this).hasClass('ls') ){
		    if (!$(this).attr('error')){
    			if ($(this).attr('data-original')){
    				$(this).attr('data-src',$(this).attr('data-original'));
    			}else if (!$(this).attr('data-src')){
    				$(this).attr('data-src',$(this).attr('src'));
    			}
    			$(this).attr("error",'1');
    			$(this).attr("src",$(this).attr('data-src'));
		    }
			if (typeof(window.lazyloads) == 'object'){
				window.lazyloads.update();
			}else{
				lazyload_run();
			}
		}
	}
});


//清理异常商品cookie
if (document.cookie.length > 5000){
	var arr,reg=new RegExp("(^| )goods=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg)){
		var cookie_goods = arr[2];
		var cookie_all = document.cookie.split(";");
		var ng = '';
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		for (var i = 0; i < cookie_all.length; i++){
			var ct = cookie_all[i].split("=");
			if ( ct[0].indexOf("goods_") != -1 ){
				var goods_id = ct[0].replace(/[^0-9]/ig,'');
				if ( cookie_goods.indexOf(goods_id) == -1 ){
					document.cookie = ct[0]+"='';expires="+exp.toGMTString();
				}else{
					ng += goods_id+'_';
				}
			}
		}
		document.cookie = 'goods='+ng;
	}
}


//定位导航
if ($("nav a.c").length>0 && $("nav a.c").offset().left>$(document).width()){
    $("nav").animate({
        scrollLeft:$("nav a.c").offset().left
    }, 500);
}


$('body').ready(function(){
	//document.body.addEventListener('touchstart',function(){});
	
	//baidu提交
	!function(){var e=/([http|https]:\/\/[a-zA-Z0-9\_\.]+\.baidu\.com)/gi,r=window.location.href,t=document.referrer;if(!e.test(r)){var o="https://sp0.baidu.com/9_Q4simg2RQJ8t7jm9iCKT-xh_/s.gif";t?(o+="?r="+encodeURIComponent(document.referrer),r&&(o+="&l="+r)):r&&(o+="?l="+r);var i=new Image;i.src=o}}(window);
	// var a=document.createElement("script");"https"===window.location.protocol.split(":")[0]?a.src="https://zz.bdstatic.com/linksubmit/push.js":a.src="http://push.zhanzhang.baidu.com/push.js";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b);
	
	//360主动提交
	(function(e){function t(e){var t=location.href,n=t.split("").reverse(),r=e.split(""),i=[];for(var s=0,o=16;s<o;s++)i.push(r[s]+(n[s]||""));return i.join("")}var n=/([http|https]:\/\/[a-zA-Z0-9\_\.]+\.so\.com)/gi,r=e.location.href;if(r&&!n.test(r)&&window.navigator.appName){var i="//s.360.cn/so/zz.gif",o='d182b3f28525f2db83acfaaf6e696dba',u=t(o),a=new Image;r&&(i+="?url="+encodeURIComponent(r)),o&&(i+="&sid="+o),u&&(i+="&token="+u),o&&(a.src=i)}})(window);
});

// analytics
(function () {
    var analytics = document.createElement('script');
    analytics.type = 'text/javascript';
    analytics.async = true;
    analytics.src = 'https://www.googletagmanager.com/gtag/js?id=G-17HDHSSJ6V';
    var root_s = document.getElementsByTagName('script')[0];
    root_s.parentNode.insertBefore(analytics, root_s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-17HDHSSJ6V');
})();
