(function($) {
    "use strict"; // Start of use strict
          
      // Navbar expanded color
      $( '.navbar-toggler' ).on( 'click', function () {
      $( '#mainNav' ).toggleClass( 'expanded');
  });
  
    // Collapse Navbar
    var navbarCollapse = function() {
      if ($("#mainNav").offset().top > 100) {
        $("#mainNav").addClass("navbar-shrink");
      } else {
        $("#mainNav").removeClass("navbar-shrink");
      }
    };
    // Collapse now if page is not at top
    navbarCollapse();
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);

    // Back to top arrow
    $(window).scroll(function(){
      if ($(this).scrollTop() > 50) {
          $('.back-to-top').fadeIn();
      } else {
          $('.back-to-top').fadeOut();
      }
    });

    $('.back-to-top').click(function () {
      $('.back-to-top').tooltip('hide');
      $('body,html').animate({
          scrollTop: 0
      }, 800);
      return false;

      $('.back-to-top').tooltip('show');
  });
  
  })(jQuery); // End of use strict