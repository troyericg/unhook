// Name:         unhooker.js
// Purpose:      Controlled fixies.
// Dependencies: JUST LOVE. 
// Developer:    Troy Griggs 

function Unhook(settings){

	var unhook = unhook || {};

	unhook.init = function(settings){
		var defaults = {
			container: null,
			topOfPage: 0,
			bottomOfContainer: 0,
			leftInset: "auto",
			paddingTop: 0,
			paddingBottom: 0,
			scrollClasses: { scrollable: "uh-scrollable", scrollDown: "down-scroll" },
			containerClass: "uh-container",
			targetClass: "uh-element"
		};

		var settings = settings || defaults;
		
		this.options = {
			elem 			   : (settings.targetClass) ? document.querySelectorAll("." + settings.targetClass) : document.querySelectorAll("." + defaults.targetClass),
			topOfPage          : settings.topOfPage || defaults.topOfPage,
			bottomOfContainer  : settings.bottomOfContainer || defaults.bottomOfContainer,
			leftInset          : (settings.leftInset) ? settings.leftInset + "px" : defaults.leftInset,
			paddingTop         : settings.paddingTop || defaults.paddingTop,
			paddingBottom      : settings.paddingBottom || defaults.paddingBottom,
			pixelPaddingTop    : (settings.paddingTop || defaults.paddingTop) + "px",
			pixelPaddingBottom : (settings.paddingBottom || defaults.paddingBottom) + "px",
			scrollClasses	   : settings.scrollClasses || defaults.scrollClasses,
			scrollClass		   : defaults.scrollClasses.scrollable,
			containerClass	   : settings.containerClass || defaults.containerClass,
			targetClass		   : settings.targetClass || defaults.targetClass
		};

		this.setScrollEvent();
	};

	unhook.setScrollEvent = function(){
		var win				   = window,
			winTop			   = win.pageYOffset || document.documentElement.scrollTop,
			options			   = this.options;

		[].forEach.call(options.elem, function(el, i){
			var parentClasses = el.parentNode.className;
			if(!parentClasses.match(options.containerClass)){
				parentClasses = " " + options.scrollClasses.scrollable + " " + options.containerClass + " index-" + i;
			} else {
				parentClasses = " " + options.scrollClasses.scrollable + " index-" + i;
			};
			el.parentNode.className += parentClasses;
		});

		setWindowScroll(win);

		function setWindowScroll(el){
			if (el.addEventListener) {
				el.addEventListener("scroll", scrollEvents, false);
			} else if (el.attachEvent) {
				el.attachEvent("onscroll", scrollEvents);
			};
		};

		function scrollEvents(){
			var curWin = this,
				scrollTop = curWin.pageYOffset || document.documentElement.scrollTop,
				containers = document.querySelectorAll("." + options.containerClass);

			[].forEach.call(containers, function(container, i){
				for (var i = 0; i < container.childNodes.length; i++) {
					if ( container.childNodes[i].className && Boolean(container.childNodes[i].className.match(options.targetClass)) ) {
						var target = container.childNodes[i],
							targetHeight = target.clientHeight,
							containerRect = container.getBoundingClientRect(),
							containerTop = container.offsetTop,
							containerBottom = containerTop + container.clientHeight,
							pastTopOfContainer = Boolean(scrollTop + options.paddingTop >= containerTop),
							atBottomOfContainer = Boolean(scrollTop >= containerBottom - options.paddingTop - targetHeight),
							backToTopOfContainer = Boolean(target.className.match(options.targetClass) && scrollTop <= containerTop);

						if (pastTopOfContainer) {
							console.log("scrollTop: " + scrollTop);
							console.log("containerTop: " + containerTop);
							setFixed("fromTop", target, options.scrollClass);
						}
						if (atBottomOfContainer) {
							setFixed("toBottom", target);
						} 
						else if (backToTopOfContainer) {
							setFixed("fromBottom", target, options.scrollClass);
						}
					}
				};
			});
		};

		function setFixed(flag, target, scrollClass){
			var stylesObj = {
				"fromTop": {'pos':'fixed','top': options.pixelPaddingTop, 'bottom':'auto', 'left': options.leftInset },
				"toBottom": {'pos': 'absolute','top': 'auto', 'bottom': options.pixelPaddingBottom, 'left': 'auto' },
				"fromBottom": {'pos': 'absolute','top': options.topOfPage, 'bottom':'auto', 'left': options.leftInset }
			};

			setStyles(target, stylesObj[flag]);

			if (scrollClass) {
				var reg = new RegExp(" " + scrollClass, "g");
				target.className = target.className.replace(reg, "");
				if (flag === "fromTop") {
					target.className += " " + scrollClass;
				}
			}
		};

		function setStyles(target, set){
			var styleObj = 'position: ' + set['pos'] + ';' +
						   'top: ' + set['top'] + ';' +
						   'bottom: ' + set['bottom'] + ';' +
						   'left: ' + set['left'] + ';';
			if (target.className.match(options.scrollClass)) {
				if (typeof( target.style.cssText ) != 'undefined') {
					target.style.cssText += " " + styleObj;
				} else {
					target.setAttribute('style', styleObj);
				}
			}
		};
	};

	return unhook.init(settings);
};