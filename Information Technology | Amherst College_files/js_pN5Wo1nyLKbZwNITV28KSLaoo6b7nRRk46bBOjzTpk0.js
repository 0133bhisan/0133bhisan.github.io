(function ($) {

Drupal.behaviors.amhNavBars = {
  attach: function (context, settings) {
    $('html', context).once('amh-nav-bars', function () {
      var effect = function (obj, hide) {
        if ($(document).width() <= 600 || obj.parents('#pageslide').length) {
          if (hide) {
            obj.slideUp('fast', function() {
              // revert to display mode in CSS
              obj.css('display', '');
            }).removeClass('nav-bar-active');
          }
          else {
            // stop any animations already running
            $(':animated').stop(true, true);
            // slide down and move the thing fully into view
            obj.addClass('nav-bar-active').slideDown('fast');
            if (!obj.closest('#pageslide').length) {
              $('html,body').animate({scrollTop: obj.parent().offset().top}, 'fast');
            }
          }
        }
        else {
          hide ? obj.fadeOut('fast').removeClass('nav-bar-active') : obj.addClass('nav-bar-active').fadeIn('fast');
        }
      };

      var oldWidth, menu;
      var onResize = function() {
        if (window.innerWidth != oldWidth) {
          $(window).unbind('resize.navBar');
          $(document).click();
        }
      };

      $('#nav-bar-main [name=keyword], #nav-bar-mobile [name=keyword]').focus(function(evnt) {
        var clicked = $(this);
        menu = clicked.parent().siblings('ul:first');
        if (!menu.length) menu = $(this).siblings('ul:first');
        var is_pageslide = menu.parents('#pageslide').length;
        if (!menu.is(':visible')) {
          effect($('.nav-bar-active').not(menu).not(menu.parents()), true);
          effect(menu);
          if (!is_pageslide) {
            $(document).bind('click.navBar', function(evnt) {
              var target = $(evnt.target);
              if (target.context != menu.context && target.context != clicked.context && !target.parents('ul.nav-bar-active').length) {
                $(window).unbind('resize.navBar').unbind('click.navBar');
                effect(menu, true);
              }
            });
            oldWidth = window.innerWidth;
            $(window).bind('resize.navBar', onResize);
          }
        }
        evnt.stopPropagation();
        return false;
      });

      $('div.nav-bar-narrow-start .nav-bar-submenu-title,li.nav-bar-narrow-start>a').click(function(evnt) {
        var clicked = $(this).parent().siblings('ul:first');
        if (!clicked.length) clicked = $(this).siblings('ul:first');
        var is_pageslide = clicked.parents('#pageslide').length;
        if (clicked.is(':visible')) {
          if (is_pageslide) {
            effect(clicked, true);
          }
          else {
            $(document).click();
          }
        }
        else {
          effect($('.nav-bar-active').not(clicked).not(clicked.parents()), true);
          effect(clicked);
          clicked.find('input[type=text]:first').focus();
          if (!is_pageslide) {
            $(document).bind('click.navBar', function(evnt) {
              if (!$(evnt.target).is('input[type=text]')) {
                $(window).unbind('resize.navBar').unbind('click.navBar');
                effect(clicked, true);
              }
            });
            oldWidth = window.innerWidth;
            $(window).bind('resize.navBar', onResize);
          }
        }
        evnt.stopPropagation();
        return false;
      });

      $('.nav-bar-search~ul select').click(function(evnt) {
        evnt.stopPropagation();
      });
      $('.nav-search-form').submit(function(evnt) {
        if (menu) {
          var url = $(menu).find('.nav-bar-search-type').val();
          var keyword = $(menu).siblings(':input[type=text]').val();
          window.location = url.replace('%keyword%', escape(keyword));
        }
        return false;
      });
      $('.nav-bar-search-type').change(function() {
        // When the user switches search type, if there is already some text in
        // the search box, go do the search immediately.
        if ($(this).val() && $(this).closest('.nav-bar-narrow-start').find(':input[type=text]').val()) {
          $(this).closest('form').submit();
        }
      });
      $('.nav-bar-search-other').change(function() {
        var val = $(this).val();
        if (val) {
          window.location = val;
          $(document).click();
          $(this).val('');
        }
      });

      $(document).bind('touchstart', function(evnt) {
        var o = $(evnt.target);
        if (o.attr('id') != 'pageslide' && o.parents('#pageslide').length == 0 && $('#pageslide').is(':visible') && !$('#pageslide').data('modal')) {
          $.pageslide.close();
          evnt.preventDefault();
          evnt.stopPropagation();
        }
      });

      $(".open-slide").pageslide({iframe: false});
    });
  }
};

})(jQuery);
;
