// Name:         unhooker.js
// Purpose:      Controlled fixies.
// Dependencies: JUST LOVE. 
// Developer:    Troy Griggs 

var defaults = {
	elem: null,
	container: null,
	topOfPage: 0,
	bottomOfContainer: 0,
	leftInset: null,
	topPadding: 0,
	bottomPadding: 0,
	scrollClass: { scrollable: "uh-scrollable", scrollDown: "down-scroll" },
	containerClass: "uh-container"
};

var setScrollEvent = function(settings){
	var settings = settings || defaults;
	var elem               = settings.elem,
		win				   = window,
		topOfPage          = settings.topOfPage,
		bottomOfContainer  = settings.bottomOfContainer,
		leftInset          = (settings.leftInset) ? settings.leftInset + "px" : "auto",
		paddingTop         = settings.topPadding,
		paddingBottom      = settings.bottomPadding,
		pixelPaddingTop    = paddingTop + "px",
		pixelPaddingBottom = paddingBottom + "px",
		scrollClass		   = settings.scrollClass.scrollDown;

	[].forEach.call(settings.elem, function(el){
		el.parentNode.className += (" " + settings.scrollClass.scrollable + " " + settings.containerClass);
	});

	var containers = document.querySelectorAll("." + settings.containerClass);

	setWindowScroll(win);

	function setWindowScroll(el){
		if (el.addEventListener) {
			el.addEventListener("scroll", scrollEvents, false);
		} else if (el.attachEvent) {
			el.attachEvent("onscroll", scrollEvents);
		};
	};

	function scrollEvents(){
		var curWin = this;
		[].forEach.call(containers, function(container){
			for (var i = 0; i < container.childNodes.length; i++) {
				if (container.childNodes[i].className && container.childNodes[i].className.match(settings.scrollClass.scrollable) !== undefined) {
					var target = container.childNodes[i],
						targetHeight = target.innerHeight,
						containerRect = container.getBoundingClientRect(),
						containerTop = container.offsetTop,
						containerBottom = containerRect.top + container.clientHeight,
						scrollTop = curWin.pageYOffset || document.documentElement.scrollTop;

					// From top of page ...
					if ( scrollTop + paddingTop >= containerTop ) {
						setFixedFromTop(target, scrollClass);
					} 
					// ... to bottom of container ...
					if ( scrollTop >= containerBottom - paddingTop - targetHeight ) {
						setFixedToBottom(target);
					} 
					// .. Back to top of page
					else if ( target.className.match(scrollClass) && scrollTop <= containerTop ) {
						console.log("what is happening?");
						setFixedFromBottom(target, scrollClass);
					}
					break;
				}
			};
		});
	};

	// Trigger unhook if page refreshes 
	// if (win.scrollTop() > 20) {
	// 	win.trigger("scroll");
	// };

	function setFixedFromTop(target, scrollClass){
		// console.log("setFixedFromTop");
		setStyles(target, {'pos':'fixed','top': pixelPaddingTop, 'bottom':'auto', 'left': leftInset });
		var reg = new RegExp(scrollClass, "g");
		target.className = target.className.replace(reg, "");
		target.className += " " + scrollClass;
	};
	function setFixedToBottom(target){
		// console.log("setFixedToBottom");
		setStyles(target, {'pos': 'absolute','top': 'auto', 'bottom': pixelPaddingBottom, 'left': 'auto' });
	};
	function setFixedFromBottom(target, scrollClass){
		console.log("setFixedFromBottom");
		setStyles(target, {'pos': 'absolute','top': topOfPage, 'bottom':'auto', 'left': leftInset });
		var reg = new RegExp(scrollClass, "g");
		target.className = target.className.replace(reg, "");
	};

	function setStyles(target, set){
		var styleObj = 'position: ' + set['pos'] + ';' +
					   'top: ' + set['top'] + ';' +
					   'bottom: ' + set['bottom'] + ';' +
					   'left: ' + set['left'] + ';';

		if( typeof( target.style.cssText ) != 'undefined' ) {
			target.style.cssText += " " + styleObj;
		} else {
			target.setAttribute('style', styleObj);
		}
	};
};