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
	}
};
utils.addcss();

/*
	事件集合，
	tabclick -- tab标签页的点击回调
	tabdel -- tab标签页的删除回调
	tabadd -- tab标签页的新增回调
*/
var events = {};

/*
	操作集合
	tab点击、tab删除、tab新增、tab自适应
*/
var calls = {
	navClick:function(evt){
		var nav = this; //选中的一级菜单导航元素
		var target = evt.target;
		var targetNav; //选中的菜单导航元素

		var checkIt = function(nav){
			var _navs = utils.siblings(nav);
			utils.each(_navs,function(index,_nav){
				utils.removeClass(_nav,'hc-active');
			})
			utils.addClass(nav,'hc-active');
		}

		//判断点击的是否是二级菜单栏
		var _p = utils.parent(target);
		if( utils.hasClass(_p,'hc-nav-child') ){ //是二级菜单栏
			targetNav = target;
			checkIt(target);
			var nav = utils.parent(_p);
			checkIt(nav);
			utils.removeClass(_p,'hc-show');
		}else{ //是一级菜单栏
			targetNav = nav;
			if( utils.children(nav,'.hc-nav-child')[0] ){ //有二级菜单栏
				return;
			}else{ //无二级菜单栏，直接点击
				checkIt(nav);
			}
		}

		//触发回调事件
		var filter = utils.attr( utils.parent(nav), 'hc-filter');
		if(events['navclick'] && events['navclick'][filter]){
			events['navclick'][filter].call(targetNav,evt);
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
		if(events['tabclick'] && events['tabclick'][filter]){
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
		if(events['tabdel'] && events['tabdel'][filter]){
			events['tabdel'][filter].call(li,evt,index)
		}

		var content = tab.getElementsByClassName('hc-tab-content-item')[index];
		if( utils.hasClass(li,'hc-active') ){
			var next = utils.next(li);
			// 后面还有tab标签页时（注意 next 还有可能是展开按钮：hc-tab-bar),选中后面一个
			if(next && !utils.hasClass(next,'hc-tab-bar')){
				//that.tabClick(next);
				calls.tabClick.call(next);
			}else{ //否则选中前面
				var prev = utils.prev(li);
				/*if(prev) that.tabClick(prev);*/
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
		if(events['tabadd'] && events['tabadd'][filter]){
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


var views = {

	//菜单导航栏初始化
	nav:function(){
		views.naves  = document.getElementsByClassName('hc-nav');

		utils.each(views.naves,function(index,nav){

			var background = utils.attr(nav,'hc-background'), //背景颜色
				textColor = utils.attr(nav,'hc-text-color'); //文字颜色
				//textColorActive = utils.attr(nav,'hc-text-color-active'); //选中的文字颜色
			
			if(background){
				utils.css(nav,{background:background});
			}
			if(textColor){
				utils.css(nav,{color:textColor});
			}
			
			//导航栏的鼠标悬停事件（若有二级菜单，则弹出）
			var navItems = utils.children(nav,'li');
			utils.each(navItems,function(index,navItem){
				var child = utils.children(navItem,'.hc-nav-child')[0];
				var timeId;
				if(child){ //有二级菜单时
					//名称旁加一个箭头按钮
					var _title = utils.prev(child);
					var arrow = document.createElement('i');
					utils.addClass(arrow,'hc-icon-arrow hc-icon-arrow-down');
					_title.appendChild(arrow);

					navItem.onmouseenter = function(){
						if(timeId) clearTimeout(timeId);

						//箭头向下
						utils.addClass(arrow,'hc-icon-arrow-up');

						//不是当前选中的navItem，还原其二级菜单的样式（即：去掉选中的样式）
						if( !utils.hasClass(navItem,'hc-active') ){
							var _childNaves = utils.children(child,'li');
							utils.each(_childNaves,function(index,_childNav){
								utils.removeClass(_childNav,'hc-active');
							});
						}

						timeId = setTimeout(function(){
							utils.addClass(child,'hc-show');
						},300);
					};
					navItem.onmouseleave = function(){
						if(timeId) clearTimeout(timeId);

						//箭头向上
						utils.removeClass(arrow,'hc-icon-arrow-up');

						timeId = setTimeout(function(){
							utils.removeClass(child,'hc-show');
						},300);
					};
				}
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
	if(!events[eventName]){
		events[eventName] = {};
	}
	events[eventName][filter] = fn;
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