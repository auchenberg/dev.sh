Array.prototype.sortBy = function sortBy(propertyName, desc) {
	var reverser = desc ? -1 : 1;
	this.sort(function sortFn(a, b) {	
		return a[propertyName].localeCompare(b[propertyName]) * reverser;
	});
	return this;
};

Array.prototype.sortByBool = function sortByBool(propertyName, desc) {
	
	this.sort(function sortFn(a, b) {	
		var aa = a[propertyName], bb = b[propertyName];
		
		a = (aa == false ? 0 : 1);
		b = (bb == false ? 0 : 1);
		
		return desc ? (b - a) : (a - b);
	});
	return this;
};

Array.prototype.sortByNumeric = function sortByNumeric(propertyName, desc) {

	this.sort(function sortFn(a, b) {	
		var aa = a[propertyName], bb = b[propertyName];
		var a = parseFloat(aa), b = parseFloat(bb);
		
		a = (isNaN(a) ? 0 : a);
		b = (isNaN(b) ? 0 : b);
		
		return desc ? (b - a) : (a - b);
	});
	return this;
};

Array.prototype.getElementByPropertyValue = function getElementByPropertyValue(propertyName, propertyValue) {
	for (var i = 0, elm; elm = this[i]; i++) {
		if (elm[propertyName] == propertyValue) {
			return elm;
		}
	}
	return undefined;
};

Function.prototype.partial = function(){
	var fn = this, args = Array.prototype.slice.call(arguments);
	return function(){
	  var arg = 0;
	  for ( var i = 0; i < args.length && arg < arguments.length; i++ )
		if ( args[i] === undefined )
		  args[i] = arguments[arg++];
	  return fn.apply(this, args);
	};
};

String.prototype.hashColorToRgbArray = function hashColorToRgbArray() {
	var r = [], a = this.replace(/^#/, ''), b = a.length / 3, c = b - 1;
	for (var i = 0; i < 3; i++) {
		r[i] = parseInt(a.charAt(i * b) + a.charAt(i * b + c), 16);
	}
	return r;
};

(function($) {
$.fn.extend({
		yellowFade: function yellowFade() {
			return this.animBackgroundColor('#ffb', '#fff', 1000);
		},
		/*********************************************************/
		animBackgroundColor: function animBackgroundColor(fromColor, toColor, delay) {

			function changeColor(elm, r, g, b, queueIndex) {
				elm.css('background-color', 'rgb(' + r + ',' + g + ',' + b + ')');
			};

			function resetColor(elm) {
				elm.css('background-color', '');
			};

			var f = fromColor.hashColorToRgbArray(), t = toColor.hashColorToRgbArray(), steps = [];

			while (f[0] != t[0] || f[1] != t[1] || f[2] != t[2]) {
				for (var i = 0; i < 3; i++) {
					if (f[i] < t[i]) { f[i]++; }
					else if (f[i] > t[i]) { f[i]--; }
				}
				steps.push(f.slice(0));
			}
			var stepDelay = delay / steps.length;
			for (var i = 0, n = steps.length; i < n; i++) {
				setTimeout(changeColor.partial(this, steps[i][0], steps[i][1], steps[i][2]), parseInt(stepDelay * i, 10));
			}
			setTimeout(resetColor.partial(this), delay + 10);
			return this;
		}
	});

})(jQuery);		