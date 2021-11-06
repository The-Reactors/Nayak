var doMagic = function() {
	(function($) {

		"use strict";
	
		var fullHeight = function() {
	
			$('.js-fullheight').css('height', $(window).height());
			$(window).resize(function(){
				$('.js-fullheight').css('height', $(window).height());
			});
	
		};
		fullHeight();
	
		$('#sidebarCollapse').on('click', function () {
		  $('#sidebar').toggleClass('active');
	  });
	
	})(jQuery);
}


function checkContainer () {
    if($('#sidebarCollapse').is(':visible')){ //if the container is visible on the page
      doMagic();  
    } else {
      setTimeout(checkContainer, 50); //wait 50 ms, then try again
    }
  }

$(document).ready(checkContainer);