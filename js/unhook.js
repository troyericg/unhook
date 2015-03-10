// Name:         unhooker.js
// Purpose:      Controlled fixies.
// Dependencies: jQuery, Love 
// Developer:    Troy Griggs 

;(function($, undefined) {

	var pluginName = 'unhook',
		defaults = {
			elem: null,
			container: null,
			topOfPage: 0,
			bottomOfContainer: 0,
			leftInset: null,
			topPadding: 0,
			bottomPadding: 0
		};

	function Plugin(element, options){
		this.element = element;
		this.opts = $.extend(defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		// play hooky 
		this.init();
	};

	Plugin.prototype.init = function(){
		this.setScrollEvent(this.opts);
	};
	
	Plugin.prototype.setScrollEvent = function(settings){
		var elem               = this.element,
			$container         = (settings.container) ? $(settings.container) : $(this.element).parent(),
			topOfPage          = settings.topOfPage,
			bottomOfContainer  = settings.bottomOfContainer,
			leftInset          = settings.leftInset + "px" || 'auto',
			paddingTop         = settings.topPadding,
			paddingBottom      = settings.bottomPadding,
			pixelPaddingTop    = paddingTop + "px",
			pixelPaddingBottom = paddingBottom + "px";

		$container.addClass("uh-scrollable");

		$(window).scroll(function(){
			var $win = $(this);

			$container.each(function(){
				var $this = $(this),
					target = $($(this).find(elem)),
					targetHeight = target.innerHeight(),
					containerTop = $(this).offset().top,
					containerBottom = $(this).position().top + $(this).innerHeight();

				// From top of page ... 
				if ( $win.scrollTop() + paddingTop >= $this.offset().top ) {
					target.css({'position':'fixed','top': pixelPaddingTop, 'bottom':'auto', left: leftInset })
						.addClass("down-scroll");;
				} 
				// ... to bottom of container ...
				if ( $win.scrollTop() >= containerBottom - paddingTop - targetHeight ) {
					target.css({'position':'absolute', 'top':'auto', 'bottom': pixelPaddingBottom, left: 'auto' });
				} 
				// .. Back to top of page
				else if ( target.hasClass("down-scroll") && $win.scrollTop() <= $this.offset().top ) {
					target.css({'position':'absolute', 'top': topOfPage, 'bottom':'auto', left: leftInset })
						.removeClass("down-scroll");
				}
			});
			
		});
	};

	$.fn[pluginName] = function (options) {
		return this.each(function(){
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
			}
		});
	}
})(jQuery);



// IMPLEMENTATION: 
// $(".uh-element").unhook();


