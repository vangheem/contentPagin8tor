


(function($){
  
  $.fn.contentPagin8tor = function(options){
    
    if(options.split_on === undefined){ options.split_on = 'h1' }
    if(options.previous_text === undefined){ options.previous_text = 'Previous Page' }
    if(options.next_text === undefined){ options.next_text = 'Next Page' }
    if(options.show_numbers === undefined){ options.show_numbers = true }
    if(options.paginator_id === undefined){ options.paginator_id = 'paginator' }
    if(options.indicator_enabled === undefined){ options.indicator_enabled = true }
    if(options.indicator_id === undefined){ options.indicator_id = "paginator-indicator" }
    if(options.indicator_container === undefined){ options.indicator_container = false; }
    if(options.indicator_add_type === undefined){ options.indicator_add_type = "append" }
    if(options.change_effect === undefined){ options.change_effect = "fade" }
    
    return this.each(function(){
      var ele = this;
      var pages = [];
      var page = [];
      var current_page = 0;
      var locked = false;
    
      if(options.indicator_enabled && options.indicator_container){
        var container = $(options.indicator_container);
        container.append('<div id="' + options.indicator_id + '" />');
      }
    
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

      function set_page_number(){
        if(window.location.hash.length > 0 && window.location.hash.substring(0, 7) == '#!page-'){
          current_page = parseInt(window.location.hash.substring(7))-1;
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
        if($(ele).find('#' + options.paginator_id).size() > 0){
          $(ele).find('#' + options.paginator_id).replaceWith($(html));
        }else{
          $(ele).append($(html));
        }
      }
      
      function set_page(){
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
          $(tohide).fadeOut();
          $(tohide).promise().done(function(){
            $(toshow).fadeIn(function(){
              locked = false;
              $(ele).css('height', 'auto');
            });
          });
          
        }else{
          $(tohide).hide();
          $(toshow).show();
        }
      }
      
      function set_indicator(){
        var indicator = $('#' + options.indicator_id);
        var html = 'page (' (current_page+1) + ' of ' + pages.length + ')'; 
      }
      
      function hashchanged(){
        if(locked){
          return setTimeout(hashchanged, 400);
        }
        set_page_number();
        set_paginator();
        set_page();
        if(options.indicator_enabled && options.indicator_container){
          set_indicator();
        }
      }
      
      $(window).hashchange( function(){
        hashchanged();
      });
      $(window).hashchange();
    
    });
    }
  
})(jQuery);