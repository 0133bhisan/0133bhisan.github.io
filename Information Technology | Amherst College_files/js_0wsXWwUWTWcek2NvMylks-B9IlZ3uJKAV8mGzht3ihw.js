(function ($) {

  Drupal.behaviors.ithome_service_outage_noftification = {
    attach: function (context, settings) {

      /*****
       *
       * The service outages are a block. At the page level, the block is a black box.
       * The notification should only appear when there is an active outage.
       * To do so, we use jQuery to check whether an outage is listed in the service outage block markup
       * and to add a notification to the top of the IT Home page.
       *
       *****/

      // First check the service outage block markup
      var outage_list = $('#block-amherst-it-service-outages ul.it-current-outages a');
      if (outage_list.length) {
        var link;
        if (outage_list.length == 1) {
          link = outage_list.parent().html();
        }
        else {
          link = "<a href='it/service-outages#current'>Multiple Service Outages</a>";
        }

        var markup = "<div id='it-service-outage-notice'>" + link + "</div>";

        // Find an element that always exists, like the main-content anchor, and use it as the insertion point
        $('#main-content').after(markup);
      }
    }
  };

})(jQuery);
;
(function ($) {

  Drupal.behaviors.itdefault_scrollToNavMenu = {
    attach: function (context, settings) {

      function footernav_add_nav_anchor (el, anchor_el) {
        //change text of anchor el to match anchor_link_el
        anchor_el.text(el.text());

        // duplicate and add element to top of content area
        el.clone().insertAfter($('#main-content'));

        // get the new anchor element
        var anchor_link = $('#main-content').siblings('a.open-slide');

        // change the attributes
        anchor_link.attr('id', 'footer-nav-menu-anchor-link').attr('href', '#footer-nav-menu-anchor');

        // add click handler to scroll to nav
        anchor_link.click(ItDefault_scrollNavMenu);
      }





      // Scroll to bottom of page using animation
      var ItDefault_scrollNavMenu = function (e) {
        e.preventDefault();
        if ($(this.hash).length > 0) {
          $('html,body').stop().animate({scrollTop: $(this.hash).offset().top}, 'slow', 'linear', function () {
            if ( $('#footer-nav').hasClass('nav-collapsed') ) {
              $('#footer-nav').slideDown('fast', function () {
                $(this).removeClass('nav-collapsed').addClass('nav-expanded');
                $('#footer-nav-menu-toggle > img').removeClass('nav-collapsed').addClass('nav-expanded');
              });
            }
          });
        }
        else {
          return false;
        }
      };





      /******
      * Scroll the top menu/wordmark out of viewport
      * NOTE: Needs to be tested on iPhone
      ******/
      var headermenu_scroll_out = function (el) {
        // if page is still at top of viewport, scroll down
        if ($('html,body').offset().top == 0) {
          $('html,body').animate({scrollTop: el.height()}, 'slow', 'linear');
        }
      };




      /******
      * Apply scroll to animation to anchor links
      ******/
      function anchor_scroll_to (anchorlinks, targetisdiv) {
        anchorlinks.live('click', function (e) {
          e.preventDefault();
          var name = $(this).attr('href').replace('#', '');
          var selector = "a[name='" + name + "']";
          var id = $(this).attr('href'); // possible div id

          // element not always an anchor, it may be a div
          if ( ($(selector).length <= 0) && $(id).is('div')) selector = id;

          $('html,body').stop().animate({scrollTop: $(selector).offset().top}, 'slow', 'linear');
        });
      }





      // add an anchor to scroll-to footer-nav
      var nav_active_el = $('#footer-nav > .region > .block-monster-menus > .content > ul.menu > li:first-child > a.open-slide');
      var anchor_el = $('#footer-nav-menu-anchor');

      footernav_add_nav_anchor(nav_active_el, anchor_el);




      // this should use a "scroll-to" class
      var anchors = [ $('#amherst-it-services #a2z ul:first-child > li > a'), $('#amherst-it-services #by-audience ul:first-child > li > a'), $('ul.service-offering > li > a'), $('.service-outages-all > ul.links > li > a')];

      for (i=0;i<anchors.length;i++) {
        if (0 < anchors[i].length) {
          anchor_scroll_to(anchors[i]);
        }
      }




      // if mobile size, scroll the banner off viewport
//      var breakpoint = 480;
//      if ($(window).width() <= breakpoint) {
//        window.setTimeout(headermenu_scroll_out, 1500, $('#banner'));
//      }
    }
  };

})(jQuery);
;
// JavaScript Document
(function ($) {

  Drupal.behaviors.itdefault_footernav_expand_collapse = {
    attach: function (context, settings) {

      function footernav_expand_collapse(nav, btn) {

        btn.click([nav], function () {
          if ( nav.hasClass('nav-expanded') ) {
            nav.slideUp('fast', function () {
              $(this).removeClass('nav-expanded').addClass('nav-collapsed');  // footer nav
              $('#footer-nav-menu-toggle > img').removeClass('nav-expanded').addClass('nav-collapsed'); // icon
            });
            return;
          }

          if ( nav.hasClass('nav-collapsed') ) {
            nav.slideDown('fast', function () {
              $(this).removeClass('nav-collapsed').addClass('nav-expanded');
              $('#footer-nav-menu-toggle > img').removeClass('nav-collapsed').addClass('nav-expanded');
            });
            return;
          }
        });
      }





      var breakpoint = 767;  // breakpoints defined in media-query-breakpoints.scss

      // inital class is always expanded
      $('#footer-nav').addClass('nav-expanded');
      $('#footer-nav-menu-toggle > img').addClass('nav-expanded');


      // add/remove handler for mobile/desktop
      $(window).resize(function () {
        $('#footer-nav-title').unbind('click');  // resize fires continuously always remove handler to prevent duplication
        if ($(window).width() < breakpoint) {  // mobile display
          footernav_expand_collapse($('#footer-nav'), $('#footer-nav-title'));  // add expand/collapse
        }

        // if on larger view, make sure nav is expanded
        if ($(window).width() > breakpoint) {  // large display
          if ( $('#footer-nav').hasClass('nav-collapsed') ) {  // if collapsed
            $('#footer-nav').slideDown('fast', function () {  // expand the menu
              $(this).removeClass('nav-collapsed').addClass('nav-expanded');
              $('#footer-nav-menu-toggle > img').removeClass('nav-collapsed').addClass('nav-expanded');
            });
          }
        }
      });

      // initialize expand/collapse
      if ($(window).width() < breakpoint) { // mobile display
        footernav_expand_collapse($('#footer-nav'), $('#footer-nav-title'));  // add expand/collapse

        // initially collapse for mobile
        $('#footer-nav').slideUp('fast', function () {
          $(this).removeClass('nav-expanded').addClass('nav-collapsed');
          $('#footer-nav-menu-toggle > img').removeClass('nav-expanded').addClass('nav-collapsed');
        });
      }



    }
  };

})(jQuery);;
