(function($){
  
  $.fn.contentPagin8tor = function(options){
    
    if(options.split_on === undefined){ options.split_on = 'h1' }
    if(options.previous_text === undefined){ options.previous_text = 'Previous Page' }
    if(options.next_text === undefined){ options.next_text = 'Next Page' }
    if(options.show_numbers === undefined){ options.show_numbers = true }
    if(options.paginator_id === undefined){ options.paginator_id = 'paginator' }
    if(options.indicator_enabled === undefined){ options.indicator_enabled = false }
    if(options.indicator_id === undefined){ options.indicator_id = "paginator-indicator" }
    if(options.indicator_container === undefined){ options.indicator_container = false; }
    if(options.change_effect === undefined){ options.change_effect = "fade" }
    if(options.single_page_option_available === undefined){ options.single_page_option_available = true }
    if(options.single_page_text === undefined){ options.single_page_text = "Single Page" }
    if(options.fade_in_speed === undefined){ options.fade_in_speed = 400 }
    if(options.fade_out_speed === undefined){ options.fade_out_speed = 400 }
    
    
    return this.each(function(){
      var ele = this;
      var pages = [];
      var page = [];
      var current_page = 0;
      var locked = false;
    
      $(ele).contents().each(function(){
        var text = this;
        if($(text).is(options.split_on)){
          if(page.length > 0){
            pages.push(page);
            page = [];
          }
        }
        // wrap text nodes...
        if(text.nodeType == 3){
          $(text).wrap("<span></span>");
          text = text.parentNode;
        }
        
        page.push(text);
      });
      if(page.length > 0){
        pages.push(page);
      }
      if(options.indicator_enabled){
        var container = $(options.indicator_container);
        if(options.indicator_container == false){
          container = $(ele);
        }
        container.prepend('<div id="' + options.indicator_id + '" />');
      }

      function set_page_number(){
        if(window.location.hash.length > 0 && window.location.hash.substring(0, 7) == '#!page-'){
          current_page = parseInt(window.location.hash.substring(7))-1;
        }else{
          current_page = 0;
        }
      }
      
      function set_paginator(){
        var html = '<ul id="' + options.paginator_id + '">';
        if(current_page > 0){
          html += '<li class="previous page"><a href="#!page-' + (current_page) + '">' + options.previous_text + '</a></li>';
        }
        if(options.show_numbers){
          for(var i=0; i<pages.length; i++){
            var klass = "page";
            if(current_page == i){
              klass = 'current page';
            }
            html += '<li class="' + klass + '"><a href="#!page-' + (i+1) + '">' + (i+1) + '</a></li>';
          }
        }
        var klass = "page";
        if(current_page == pages.length){klass = 'current page';}
        html += '<li class="of">of</li><li class="' + klass + '"><a href="#!page-' + pages.length + '">' + pages.length + '</a></li>';
        
        if(pages.length > (current_page+1)){
          html += '<li class="next page"><a href="#!page-' + (current_page+2) + '">' + options.next_text + '</a></li>';
        }
        if(options.single_page_option_available){
          html += '<li class="single page"><a href="#!page-all">' + options.single_page_text + '</a></li>';
        }
        var pagin = $(html);
        if($(ele).find('#' + options.paginator_id).size() > 0){
          pagin.hide();
          $(ele).find('#' + options.paginator_id).replaceWith(pagin);
          pagin.fadeIn(options.fade_in_speed);
        }else{
          $(ele).append(pagin);
        }
        pagin.find('li.single.page').click(function(){
          $(ele).find('*:hidden').fadeIn(options.fade_in_speed);
          $(ele).find('#' + options.paginator_id).fadeOut(options.fade_out_speed);
          return false;
        });
      }
      
      function set_indicator(){
        if(options.indicator_enabled){
          var indicator = $('#' + options.indicator_id);
          var html = 'page (' + (current_page+1) + ' of ' + pages.length + ')'; 
          $('#' + options.indicator_id).html(html);
        }
      }
      
      function set_page(callback){
        locked = true;
        var tohide = [];
        var toshow = [];
        for(var i=0; i<pages.length; i++){
          if(current_page != i){
            tohide = tohide.concat(pages[i]);
          }else{
            toshow = toshow.concat(pages[i]);
          }
        }
        if(options.change_effect == 'fade'){
          $(ele).css('height', $(ele).height());
          $(tohide).fadeOut(options.fade_out_speed);
          $(tohide).filter(function(){ return this.tagName == 'OBJECT'}).hide();
          $(ele).find('#' + options.paginator_id).fadeOut(options.fade_out_speed);
          $(tohide).promise().done(function(){
            $(toshow).fadeIn(options.fade_in_speed);
            set_paginator();
            set_indicator();
            $(toshow).promise().done(function(){
              $(toshow).filter(function(){ return this.tagName == 'OBJECT'}).show();
              locked = false;
              $(ele).css('height', 'auto');
              if(callback != undefined){
                callback();
              }
            });
          });
          
        }else{
          $(tohide).hide();
          $(toshow).show(function(){
            set_paginator();
            set_indicator();
            if(callback != undefined){
              callback();
            }
          });
        }
      }
      
      function hashchanged(){
        if(locked){
          return setTimeout(hashchanged, 400);
        }
        set_page_number();
        set_page();
      }
      
      $(window).hashchange( function(){
        hashchanged();
      });
      $(window).hashchange();
    
    });
    }
  
})(jQuery);