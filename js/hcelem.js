(function(){


var utils = {
	addcss:function(){
		var id = 'hc-tab-css';
		if(document.getElementById(id)) return;
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		var path = this.getPath();
		link.rel = 'stylesheet';
		link.href = path + '../css/hcelem.css';
		link.id = id;
		head.appendChild(link);
	},
	getPath:function(){
		// IE9下，document.currentScript 为 null
		var jsPath = document.currentScript ? document.currentScript.src : function(){
			var js = document.scripts
			,last = js.length - 1
			,src;
			for(var i = last; i > 0; i--){
				if(js[i].readyState === 'interactive'){
				  src = js[i].src;
				  break;
				}
			}
			return src || js[last].src;
	    }();
		return jsPath.substring(0,jsPath.lastIndexOf('/')+1);
	},
	stripAndCollapse:function(value){
		//var htmlwhite = ( /[^\x20\t\r\n\f]+/g );
		var htmlwhite = ( /[^\s]+/g );
		var arr = value.match(htmlwhite)||[];
		return arr.join(' ');
	},
	classesToArray:function(value){
		if ( Array.isArray( value ) ) {
			return value;
		}
		if ( typeof value === "string" ) {
			//var htmlwhite = ( /[^\x20\t\r\n\f]+/g );
			var htmlwhite = ( /[^\s]+/g );
			return value.match( htmlwhite ) || [];
		}
		return [];
	},
	addClass:function(el, value){
		var classes = this.classesToArray(value),
		curValue,cur,j,clazz,finalValue;

		if(classes.length>0){
			curValue = el.getAttribute && el.getAttribute('class') || '';
			cur = ' '+this.stripAndCollapse(curValue)+' ';

			if(cur){
				var j=0;
				while( (clazz = classes[j++]) ){
					if ( cur.indexOf( ' ' + clazz + ' ' ) < 0 ) {
						cur += clazz + ' ';
					}
				}

				finalValue = this.stripAndCollapse(cur);
				if(curValue !== finalValue){
					el.setAttribute('class',finalValue);
				}
			}
		}
		return el;
	},
	removeClass:function(el, value){
		var classes = this.classesToArray(value),
		curValue,cur,j,clazz,finalValue;

		if(classes.length>0){
			curValue = el.getAttribute && el.getAttribute('class') || '';
			cur = ' '+this.stripAndCollapse(curValue)+' ';

			if(cur){
				var j=0;
				while( (clazz = classes[j++]) ){
					if ( cur.indexOf( ' ' + clazz + ' ' ) > -1 ) {
						cur = cur.replace(' '+clazz+' ' ,' ');
					}
				}

				finalValue = this.stripAndCollapse(cur);
				if(curValue !== finalValue){
					el.setAttribute('class',finalValue);
				}
			}
		}
		return el;
	},
	hasClass:function(el,value){
		var className = ' '+value+' ';
		var curValue = el.getAttribute && el.getAttribute('class') || '';
		var cur = ' '+this.stripAndCollapse(curValue)+' ';

		if(cur.indexOf(className) > -1){
			return true;
		}
		return false;
	},
	siblings:function(el){
		var matched = [];
		var node = ( el.parentNode || {} ).firstChild;
		for( ; node; node=node.nextSibling ){
			if( node.nodeType === 1 && node !== el){
				matched.push(node);
			}
		}
		return matched;
	},
	prevAll:function(el){
		var matched = [];
		while( (el = el.previousSibling ) && el.nodeType !== 9 ){
		if(el.nodeType === 1)
			matched.push(el);
		}
		return matched;
	},
	index:function(el){
		return this.prevAll(el).length;
	},
	attr:function(el,prop){
		if(!el) return;
		return el.getAttribute(prop);
	},
	remove:function(el){
		if(!el) return el;
		var p = el.parentNode;
		if(p){
			el.parentNode.removeChild( el );
		}
		return el;
	},
	children(elem,filter){
		var node = elem.firstChild;
		var children = [];
		var matchFn = function(node,filter){
			if(!filter) return true;

			if( filter.match(/^\./) ){ // 为class
				return utils.hasClass( node, filter.replace('.','') );
			}else if( filter.match(/^\#/) ){ // 为id
				return node.id === filter.replace('#','');
			}else{ // 为tagName
				return node.tagName.toLowerCase() === filter;
			}
		}
		for(;node;node=node.nextSibling){
			if(node.nodeType === 1){
				if( matchFn(node,filter) ){
					children.push(node);
				}
			}
		}
		return children;
	},
	parent:function(elem){
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent:null;
	},
	// filter 为 classname
	parents:function(el,filter){
		var matched = [];
		while( (el=el.parentNode) && el.nodeType !== 9 ){
			if(el.nodeType === 1){
				matched.push(el);
			}
		}
		if(filter){
			var node;
			for(var i=0,l=matched.length;i<l;i++){
				node = matched[i];
				if( utils.hasClass(node,filter) ){
					return node;
				}
			}
		}
		return matched;
	},
	next:function(el){
		while( (el = el.nextSibling) && el.nodeType != 1 ){};
		return el;
	},
	prev:function(el){
		while( (el = el.previousSibling) && el.nodeType != 1 ){};
		return el;
	},
	css:function(el,name,value){
		// 取值
		if(typeof name === 'string' && value === undefined){
			var styles = this.getStyle(el);
			var val = this.curCSS(el,name,styles);
			return val;
		}

		// 赋值		
		var type = typeof name,
		i;
		if(type === 'string'){
			this.style(el,name,value);
		}else if(type === 'object'){
			for(i in name){
				this.style(el,i,name[i]);
			}
		}
	},
	style:function(el,name,value){
		var type = typeof value,
			style = el.style;
		if ( value !== undefined ) {

			if(type === 'number'){
				value += this.cssNumber[name]?'':'px';
			}

			style[ name ] = value;
		}
	},
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},
	getStyle:function(el){
		var view = el.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( el );
	},
	curCSS:function(el,type,styles){
		var val;
		if(styles){
			val = styles.getPropertyValue(type) || styles[type];
		}
		return val;
	},
	each:function(obj,fn){
		if(typeof fn !== 'function') return;
		var key;
		obj = obj || [];
		if(obj.constructor === Object){
			for(key in obj){
				if( fn.call(obj[key],key,obj[key]) ) break;
			}
		}else{
			for(key=0;key<obj.length;key++){
				if( fn.call(obj[key],key,obj[key]) ) break;
			}
		}
	},
	/*16进制颜色转为RGB格式*/  
	toRgb:function(value){  //十六进制颜色值的正则表达式  
		var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;  
	    var sColor = value.toLowerCase();  
	    if(sColor && reg.test(sColor)){  
	        if(sColor.length === 4){  
	            var sColorNew = "#";  
	            for(var i=1; i<4; i+=1){
	                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));     
	            }  
	            sColor = sColorNew;  
	        }  
	        //处理六位的颜色值  
	        var sColorChange = [];  
	        for(var i=1; i<7; i+=2){ 
	            //sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
	            sColorChange.push( parseInt("0x"+sColor.slice(i,i+2))-(16+i) );
	        }  
	        return "rgb(" + sColorChange.join(",") + ")";  
	    }else{  
	        return sColor;    
	    }  
	}
};
//utils.addcss();

/*
	事件集合，
	navclick -- nav菜单栏的点击回调
	tabclick -- tab标签页的点击回调
	tabdel -- tab标签页的删除回调
	tabadd -- tab标签页的新增回调
*/
var events = {
	'navclick':{},
	'tabclick':{},
	'tabdel':{},
	'tabadd':{}
};

/*
	操作集合
	tab点击、tab删除、tab新增、tab自适应
*/
var calls = {
	navClick:function(evt){
		var navItem = this; //选中的一级菜单导航元素
		var nav = navItem.nav;
		var isVertical = nav.isVertical; // 是否是垂直菜单栏
		var textColor = nav.textColor; //文字颜色
		var textColorActive = nav.textColorActive; //选中的文字颜色

		var target = evt.target;
		var targetNavItem; //鼠标选中的菜单导航元素

		var checkIt = function(navItem){
			/*
				垂直菜单栏的情况，把上一次选中的item存储起来；
				每次点击时，先还原上次选中item的样式--这样可以避免多次DOM遍历
			*/
			if(isVertical){
				if(nav.navClicked){
					utils.removeClass(nav.navClicked,'hc-active');
					if(textColorActive){
						if(textColor) utils.css(nav.navClicked,'color',textColor);
					}
				}
				nav.navClicked = navItem;
				utils.addClass(navItem,'hc-active');
				if(textColorActive){
					utils.css(navItem,'color',textColorActive);
				}
				return;
			}

			var _navItems = utils.siblings(navItem);
			if(textColorActive){
				utils.each(_navItems,function(index,_navItem){
					utils.removeClass(_navItem,'hc-active');
					if(textColor) utils.css(_navItem,{'color':textColor, 'border-bottom-color':'transparent'});
				})
				utils.addClass(navItem,'hc-active');
				utils.css(navItem,{'color':textColorActive, 'border-bottom-color':textColorActive});
			}else{
				utils.each(_navItems,function(index,_navItem){
					utils.removeClass(_navItem,'hc-active');
				})
				utils.addClass(navItem,'hc-active');
			}
		}

		//判断点击的是否是二级菜单栏
		if(target.parentNavItem){  //是二级菜单栏
			targetNavItem = target;
			checkIt(target); //自己的选中样式

			/*
				默认菜单栏，选中二级菜单后，其父菜单栏也设置选中；
				垂直菜单栏，选中二级菜单后，其父菜单栏样式不做处理。
			*/
			if(!isVertical){
				checkIt(target.parentNavItem);
			}
			//utils.parent(target) 就是 childNav
			utils.removeClass(utils.parent(target),'hc-show');
		}else{ //是一级菜单栏
			targetNavItem = navItem;
			if( utils.children(navItem,'.hc-nav-child')[0] ){ //有二级菜单栏
				if( utils.hasClass(navItem,'hc-nav-expand') ){ //折叠它
					utils.removeClass(navItem,'hc-nav-expand');
					utils.removeClass(navItem.arrow,'hc-icon-arrow-up');
				}else{ //展开它
					utils.addClass(navItem,'hc-nav-expand');
					utils.addClass(navItem.arrow,'hc-icon-arrow-up');
					if(textColor) utils.css(navItem,'color',textColor);
				}
				return;
			}else{ //无二级菜单栏，直接点击
				checkIt(navItem);
			}
		}

		//触发回调事件
		var filter = utils.attr( nav, 'hc-filter');
		if(events['navclick'][filter]){
			events['navclick'][filter].call(targetNavItem,evt);
		}

	},
	tabClick:function(evt){
		var li = this;
		//tab标签样式改变
		utils.addClass(li,'hc-active');
		var _lis = utils.siblings(li);
		utils.each(_lis,function(index,li){
			utils.removeClass(li,'hc-active');
		})

		//获得点击的<li>的index，根据index确定对应的item内容显示
		var index = utils.index(li);

		//内容显示切换
		var _p = utils.parent(li);
		var _tab = utils.parent(_p);
		var filter = utils.attr(_tab,'hc-filter');
		var items = _tab.getElementsByClassName('hc-tab-content-item');
		utils.each(items,function(i,item){
			if(i === index){
				utils.addClass(item,'hc-show');
			}else{
				utils.removeClass(item,'hc-show');
			}
		})

		//触发回调事件
		if( events['tabclick'][filter]){
			events['tabclick'][filter].call(li,evt,index)
		}
	},
	tabDel:function(evt){
		var li = this;
		var tab = utils.parents(li,'hc-tab');
		if( !(tab instanceof HTMLElement) ) return;
		var index = utils.index(li);

		//触发回调事件
		var filter = utils.attr(tab,'hc-filter');
		if( events['tabdel'][filter]){
			events['tabdel'][filter].call(li,evt,index)
		}

		var content = tab.getElementsByClassName('hc-tab-content-item')[index];
		if( utils.hasClass(li,'hc-active') ){
			var next = utils.next(li);
			// 后面还有tab标签页时（注意 next 还有可能是展开按钮：hc-tab-bar),选中后面一个
			if(next && !utils.hasClass(next,'hc-tab-bar')){
				calls.tabClick.call(next);
			}else{ //否则选中前面
				var prev = utils.prev(li);
				if(prev) calls.tabClick.call(prev);
			}
		}
		utils.remove(li);
		utils.remove(content);
		calls.tabAuto();
	},
	tabAdd:function(filter,opt){
		var that = this;
		var tabs = views.tabs;
		var tarTab;
		utils.each(tabs,function(i,tab){
			var f = utils.attr(tab,'hc-filter');
			if(f === filter){
				tarTab = tab;
				return true;
			}
		});
		
		//标签是否有删除按钮
		var close = '';
		if( utils.attr(tarTab,'hc-tab-close') ){
			close = '<i class="hc-tab-close">x</i>';
		}
		
		//标签的文本
		var li = document.createElement('li');
		li.innerHTML = opt.title+close;

		//内容体
		var div = document.createElement('div');
		utils.addClass(div,'hc-tab-content-item');
		div.innerHTML = opt.content;

		var title = tarTab.getElementsByClassName('hc-tab-title')[0];
		var content = tarTab.getElementsByClassName('hc-tab-content')[0];
		title.appendChild(li);
		content.appendChild(div);

		//触发回调
		if( events['tabadd'][filter]){
			events['tabadd'][filter](li);
		}

		calls.tabAuto();

		return li;
	},
	/*
		自适应tab栏，当tab标签页太多超出title栏时自动分行

		注意，这里打开浏览器第一次渲染页面时，若是不使用 setTimeout(), 发现 scrollWidth 的值 和 clientWidth 值一样！
		可能是在 js 里加载 css 文件导致的；
		因为关掉自动载入css，直接在html文件的头部引用css，scrollWidth 获取正常。

		使用 setTimeout 后发现第一次打开页面还是偶尔有概率没有自适应，所以改为 onreadystatechange 监听来限制。
	*/
	tabAuto:function(){
		var that = this;
		utils.each(that.tabTitles,function(index,title){
			utils.removeClass(title,'hc-tab-more');
			var bar = title.getElementsByClassName('hc-tab-bar')[0];
			if(bar){
				utils.remove(bar);
			}
			var width = title.clientWidth;
			var swidth = title.scrollWidth;
			if(swidth>width){
				utils.addClass(title,'hc-overflow');
				var bar = title.getElementsByClassName('hc-tab-bar')[0];
				if(!bar){
					var span = document.createElement('span');
					utils.addClass(span,'hc-tab-bar');
					title.appendChild(span);
					span.onclick = function(){
						if(this.title){
							utils.removeClass(title,'hc-tab-more');
						}else{
							utils.addClass(title,'hc-tab-more');
						}
						this.title = this.title ? '' : '折叠';
					}
				}
			}else{
				utils.removeClass(title,'hc-tab-more hc-overflow');
				var bar = title.getElementsByClassName('hc-tab-bar')[0];
				if(bar){
					utils.remove(bar);
				}
			}
		});
	}
};


/*############## 菜单栏的样式方法 #################*/
//初始化菜单栏样式
function initNavStyle(nav){
	if(nav.background){
		//给菜单栏nav添加标签
		utils.addClass(nav,'hc-nav-custom'); 
		//菜单栏的背景设置
		utils.css(nav,{background: nav.background});
	}
	if(nav.textColor){
		utils.css(nav,{color: nav.textColor});
	}
}
//初始化菜单栏Item的样式
function initNavItemStyle(navItem){
	var nav = navItem.nav;
	var childNav = utils.children(navItem,'.hc-nav-child')[0]; //二级菜单栏
	if(childNav){
		//建立与父菜单栏item的索引
		childNav.parentNavItem = navItem;
		//垂直状态栏下，有二级菜单栏的一级菜单item没有 active 状态
		if(nav.isVertical && utils.hasClass(navItem,'hc-active')){
			utils.removeClass(navItem,'hc-active');
		}

		//初始化二级菜单栏的样式
		initChildNavStyle(childNav);
	}
}
//初始化二级菜单栏的样式
function initChildNavStyle(childNav){
	var nav = childNav.parentNavItem.nav;

	//添加动画
	utils.addClass(childNav,'hc-anim hc-anim-slipdown');

	//childNav的自定义样式的处理
	if(nav.background){
		if(nav.isVertical){
			//垂直菜单栏中二级菜单颜色要浅一些
			utils.css(childNav,{'background': nav.backgroundHover});
		}else{
			//普通菜单栏中二级菜单栏的背景也设为background
			utils.css(childNav,{'background': nav.background});
		}
	}
	if(nav.textColor){
		//设置二级菜单的color
		utils.css( childNav,{'color':nav.textColor} );
	}

	//名称旁加一个箭头
	var _title = utils.prev(childNav);
	arrow = document.createElement('i');
	utils.addClass(arrow,'hc-icon-arrow hc-icon-arrow-down');
	if( utils.hasClass(childNav.parentNavItem,'hc-nav-expand') ){
		utils.addClass(arrow,'hc-icon-arrow-up');
	}
	_title.appendChild(arrow);
	childNav.parentNavItem.arrow = arrow;

	// 遍历二级菜单栏的item
	var _childNavItems = utils.children(childNav,'li');
	utils.each(_childNavItems,function(index,_childNavItem){
		//建立与父item的索引
		_childNavItem.parentNavItem = childNav.parentNavItem;

		//设置 active 样式
		if( utils.hasClass(_childNavItem,'hc-active') ){
			setNavItemActiveStyle(_childNavItem);
		}

		//鼠标移入/移出事件
		_childNavItem.onmouseenter = function(){
			setNavItemHoverInStyle(_childNavItem)
		};
		_childNavItem.onmouseleave = function(){
			setNavItemHoverOutStyle(_childNavItem)
		};
	});

}
//设置active状态的item样式
function setNavItemActiveStyle(navItem){
	var nav;
	//说明该item为二级菜单栏item
	if( navItem.parentNavItem ){
		nav = navItem.parentNavItem.nav;
		//垂直菜单栏情况下，记得设置 navClicked。
		if(nav.isVertical){
			nav.navClicked = navItem;
		}
		//水平菜单栏情况下，二级菜单item选中，其父item也要设为选中状态
		else{
			utils.addClass(navItem.parentNavItem,'hc-active');
		}
	}
	//为一级菜单栏item
	else{
		nav = navItem.nav;
	}

	//自定义的active颜色样式
	if( nav.textColorActive ){
		utils.css(navItem, 'color', nav.textColorActive);
	}
}
//设置鼠标移入时的item样式
function setNavItemHoverInStyle(navItem){
	var nav;
	//目标是二级菜单item
	if( navItem.parentNavItem ){
		nav = navItem.parentNavItem.nav;
		//水平菜单栏状态：背景变深。垂直菜单栏状态：字体颜色变化
		if(nav.isVertical){
			utils.css(navItem, {'color': nav.textColorActive});
		}else{
			utils.css(navItem, {'background': nav.backgroundHover});
		}
	}
	//目标是一级菜单item
	else{
		nav = navItem.nav;
		if(nav.isVertical){
			if( !utils.hasClass(navItem,'hc-nav-expand') ){ //如果是展开的，就不要变色了
				utils.css(navItem,{'color': nav.textColorActive});
			}
		}else{
			utils.css(navItem,{'background': nav.backgroundHover});
		}
	}
}
//设置鼠标移出时的item样式
function setNavItemHoverOutStyle(navItem){
	var nav;
	//目标是二级菜单item
	if( navItem.parentNavItem ){
		nav = navItem.parentNavItem.nav;
		//水平菜单栏状态：背景恢复。垂直菜单栏状态：字体颜色变化
		if(nav.isVertical && !utils.hasClass(navItem,'hc-active') ){
			utils.css(navItem, {'color':nav.textColor});
		}else{
			utils.css(navItem, {'background':'none'});
		}
	}
	//目标是一级菜单item
	else{
		nav = navItem.nav;
		if(nav.isVertical && !utils.hasClass(navItem,'hc-active') ){
			utils.css(navItem,{'color': nav.textColor});
		}else{
			utils.css(navItem,{'background':'none'});
		}
	}
}
/*############## 菜单栏的样式方法 END #################*/


var views = {

	//菜单导航栏初始化
	nav:function(){
		views.naves  = document.getElementsByClassName('hc-nav');

		utils.each(views.naves,function(index,nav){
			//是否是垂直菜单栏
			var isVertical = nav.isVertical = utils.hasClass(nav,'hc-nav-vertical');

			//设置自定义的样式
			var background = nav.background = utils.attr(nav,'hc-background'), //自定义的背景颜色
				textColor = nav.textColor = utils.attr(nav,'hc-text-color'), //自定义的文字颜色
				textColorActive = nav.textColorActive = utils.attr(nav,'hc-text-color-active'), //自定义的选中的文字颜色
				backgroundHover; //鼠标悬停时的background（变为比原来的颜色深);
			if(background){
				backgroundHover = nav.backgroundHover = utils.toRgb(background);
			}

			//初始化菜单栏的样式
			initNavStyle(nav);
			
			//遍历 navItem 做一些处理
			var navItems = utils.children(nav,'li');
			utils.each(navItems,function(index,navItem){
				navItem.nav = nav;//建立与nav的索引
				var timeId;
				var child = utils.children(navItem,'.hc-nav-child')[0]; //二级菜单栏

				initNavItemStyle(navItem);

				/*
					这段代码要放在 initNavItemStyle() 之后。
					因为经过 initNavItemStyle() 的处理，可能一些一级菜单栏（本来没有设置active状态）变为了active状态，
					因此要在后面设置样式。
				*/
				if(textColorActive){
					if( utils.hasClass(navItem,'hc-active') ){ //选中的样式
						utils.css(navItem,{'color':textColorActive, 'border-bottom-color':textColorActive});
					}
				}

				/*
					悬停的处理
					对于默认菜单栏（水平）的鼠标悬停事件：若有二级菜单，则弹出;
					对于垂直菜单栏：1、展开状态时：自定义颜色的不做处理，默认的变色
					2、折叠状态时：文字变色
				*/
				navItem.onmouseenter = function(e){
					var target = e.target;
					
					if(timeId) clearTimeout(timeId);

					setNavItemHoverInStyle(navItem);

					//垂直菜单栏状态时，悬停时不会对二级菜单栏做处理
					if(isVertical) return false;

					//有二级菜单栏时
					if(child){
						//箭头向下
						utils.addClass(navItem.arrow,'hc-icon-arrow-up');
						//不是当前选中的navItem，还原其二级菜单的样式（即：去掉选中的样式）
						if( !utils.hasClass(navItem,'hc-active') ){
							var _childNavItems = utils.children(child,'li');
							utils.each(_childNavItems,function(index,_childNavItem){
								utils.removeClass(_childNavItem,'hc-active');
								if(textColor){
									utils.css(_childNavItem,{'color':textColor});
								}
							});
						}
						//显示二级菜单栏
						timeId = setTimeout(function(){
							utils.addClass(child,'hc-show');
						},300);
					}
				};
				navItem.onmouseleave = function(){
					if(timeId) clearTimeout(timeId);

					setNavItemHoverOutStyle(navItem);
					
					if(isVertical) return false;

					if(child){
						//箭头向上
						utils.removeClass(navItem.arrow,'hc-icon-arrow-up');
						//二级菜单栏隐藏
						timeId = setTimeout(function(){
							utils.removeClass(child,'hc-show');
						},300);
					}
				};

				//点击事件
				navItem.onclick = function(evt){
					calls.navClick.call(this,evt);
				};
			})
		})
	},

	//选项卡初始化
	tab:function(){
		views.tabs  = document.getElementsByClassName('hc-tab');
		views.tabTitles  = document.getElementsByClassName('hc-tab-title');
		//判断是否开启 tab 的删除按钮
		var tabs = views.tabs;
		utils.each(tabs,function(i,tab){
			if( utils.attr(tab,'hc-tab-close') ){ //如果属性"hc-tab-close"为true，开启删除按钮
				var title = tab.getElementsByClassName('hc-tab-title')[0];
				var lis = title.getElementsByTagName('li'); //选项卡集合
				utils.each(lis,function(index,li){
					var el = document.createElement('i');
					utils.addClass(el,'hc-tab-close');
					el.textContent = 'x';
					li.appendChild(el);
				});
			}
		});
		//tab的点击切换事件/删除事件
		var tabTitles = views.tabTitles;
		utils.each(tabTitles,function(index,tabTitle){
			tabTitle.onclick = function(evt){
				var tar = evt.target;
				var tagName = tar.tagName.toLowerCase();
				if( tagName === 'li'){ //点击切换标签
					calls.tabClick.call(tar,evt);
				}else if( utils.hasClass(tar,'hc-tab-close') ){ //删除标签
					var li = utils.parent(tar);
					calls.tabDel.call(li,evt);
				}
			}
		});
	}

}

var Element = function(){
	this.tabs = calls.tabs = document.getElementsByClassName('hc-tab');
	this.tabTitles = calls.tabTitles = document.getElementsByClassName('hc-tab-title');
}

Element.prototype.init = function(){
	var that = this,
		item;

	for(item in views){
		views[item]();
	}

	// title 高度自适应：tab标签页过多的时候，自动分行
	document.onreadystatechange = function(){
		if(document.readyState == 'complete'){
			calls.tabAuto();
		}
	}
	/*setTimeout(function(){
		calls.tabAuto();
	},0)*/
	
	window.onresize = function(){
		calls.tabAuto();
	}
}


/*
	eventName：事件名--tabclick,tabdel,tabadd
	filter：hc-filter的值
	fn：回调函数
*/
Element.prototype.on = function(eventName,filter,fn){
	if(events[eventName]){
		events[eventName][filter] = fn;
	}
}

//tab的点击切换
Element.prototype.tabClick = function(li){
	calls.tabClick.call(li);
}

//删除tab
Element.prototype.tabDel = function(li){
	calls.tabDel.call(li);
}

//添加tab
/*
filter: 元素的属性“hc-filter”的值
opt={
	title:标题
	content:内容
}
*/
Element.prototype.tabAdd = function(filter,opt){
	return calls.tabAdd(filter,opt);
}

var element = window.element = new Element();
element.init();



})()