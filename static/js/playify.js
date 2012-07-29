 
(function() {
	
	var elements = {}, cache = [];
	
	$(document).ready(function() {
		elements.header = $('header');
		elements.button = $("div.button");
		elements.result = $('div.result');
		elements.progress = $('div.progress');
		elements.progressCurrent = $('div.progress').find('div.current');
		elements.resultList = elements.result.find('div.list');
		elements.loader = $('div.loader');
		elements.frontpage = $('div.frontpage');
		elements.sortnav = elements.result.find('.sort-nav').delegate('li:not(.selected)', 'click', onSortItemClick);
		
		new AjaxUpload(elements.button, {
			action: '/upload', 
			name: 'file',
			onSubmit : onUploadSubmit,
			onComplete: onUploadComplete
		});
		
		var operating_system = detectOs();
		if(operating_system == "windows") {
			$('h3').text('Its in your Music-library > iTunes > iTunes Music Library.xml');
		} else if (operating_system == "mac") { 
			$('h3').text('Its in your home folder > Music > iTunes > iTunes Music Library.xml');
		}
	})
	
	function detectOs() {
		var name = "Unknown OS";
		if (navigator.appVersion.indexOf("Win")!=-1) name = "windows";
		if (navigator.appVersion.indexOf("Mac")!=-1) name = "mac";
		if (navigator.appVersion.indexOf("X11")!=-1) name = "unix";
		if (navigator.appVersion.indexOf("Linux")!=-1) name = "linux";

		return name;
	}

	function lookupAlbums(data) {
		
		for (var i=0, il=data.length; i<il; i++) 
		{
			var item = data[i];
			$.ajax({
				url: "/lookupAlbum/",
				type: "POST",
				data: { artist: item.Artist, album : item.Album },
				dataType: "json",
				success: onAlbumLookupComplete.partial(item, undefined),
				error: onAlbumLookupFaliure.partial(item)
			});
			
		};
	}	

	function renderList(data) {
		elements.resultList.find('ul.list.hidden').remove();
		var mainList = elements.resultList.find('ul.list:not(.hidden)');
		
		var container = $('<ul class="list" />');
		var shouldHide = elements.resultList.find('ul.list').length > 0;
		
		if(shouldHide) container.addClass('hidden');
		
		for (var i=0, il=data.length; i<il; i++) 
		{
			var item = data[i];
			var element = $("<li data-id='" + item["Track ID"] + "' class='parsed'><img src='i/cover.png' alt='cover' /><h2>" + item.Album + "</h2><h3>" + item.Artist + "</h3><a class='open'>Open in Spotify</a></li>");
			element.appendTo(container);
			item.element = element;		
			
			if(item.found) {
				item.element.addClass('found');
				item.element.find('a').attr('href',item.url);
				if(item.cover) { 
					item.element.find('img').attr('src', item.cover);
				}
			}
		};
		
		container.appendTo(elements.resultList);
		
		if(data.length > 70) {
			mainList.remove();
			container.removeClass('hidden');
			
		} else {
			if(shouldHide){
				mainList.quicksand(container.find('li'), { duration: 800, easing: 'easeInOutQuad' });
				container.remove();
			}
		}
	}
	
	function onSortItemClick(e) {
		var elm = $(this);
		if(elm.hasClass('played')) {
			cache.sortByNumeric('Play Count', true);
		
		} else if(elm.hasClass('album')) {
			cache.sortBy('Album');

		} else if(elm.hasClass('artist')) {
			cache.sortBy('Artist');
		} else if(elm.hasClass('spotify')) {
			cache.sortByBool('found', true);
		}		
		elm.addClass('selected');
		elm.siblings().removeClass('selected');
		
		renderList(cache);
	}
	
	function increaseProgress() {
		var pixelAmount = elements.progress.width() / cache.length;
		var newWidth = elements.progressCurrent.width() + pixelAmount + 0.5;
		
		if(newWidth >= elements.progress.width()) {
			newWidth = elements.progress.width();
			onAlbumsLookupComplete();
		}
		elements.progressCurrent.width(newWidth + 'px');
		
	}
	
	function onAlbumsLookupComplete() {	
		//elements.progress.slideUp();
		elements.result.find('h2:first-child').text('Done! Enjoy your albums in Spotify!');
		elements.result.find('h2:first-child').yellowFade();
		elements.sortnav.show();
	
	}
	
	function onAlbumLookupComplete(item, response) {
	
		var pixelAmount = elements.progress.width() / cache.length;
	
		if(response && response.url) {
			item.found = true;
			item.url = response.url;
			item.cover = response.cover;
		
			item.element.addClass('found')
			item.element.find('a').attr('href',response.url);
			
			if(response.cover) {
				item.element.find('img').attr('src', response.cover);
			}	
		} else {
			item.found = false;
		}
		
		increaseProgress();
	}
	
	function onAlbumLookupFaliure(item) {
		item.found = false;
		increaseProgress();
	}
	
	function onUploadComplete(file, response) {
		elements.result.show();
		elements.frontpage.hide();
		elements.header.hide();
		elements.loader.hide();
		
		var data = JSON.parse(response);
		cache = data.albums;
		
		if(cache.length > 0) {
			elements.result.find('h2').text("Almost there! Now locating your albums in Spotify!");
			cache.sortByNumeric('Play Count', true);
			renderList(cache);
			lookupAlbums(cache);
		}
	}

	function onUploadSubmit() {
		elements.loader.show();
	}
	 
})();

