"use strict";$(function(){function e(){$.ajax({url:"http://10.66.80.80:3000/cards",type:"GET"}).done(function(e){if(l++,e=r(e,t.length),t=t.concat(e),e.length>0){c=$(".c-cards-holder").masonry(n),i=!0;var o=e.map(function(e){return s(e)});c.append(o).masonry("appended",o).masonry("reloadItems")}else i&&(c.masonry("destroy"),i=!1)})}function o(e){return e.length>g&&(e=e.substring(0,g)+" ..."),e}function r(e,o){return e.map(function(e,r){return e.id="card-"+(o+r+1),e})}function s(e){var r=e.imgHeight/e.imgWidth;return $("<div class='c-card' id='"+e.id+"'><div class='c-card__image'"+("style='background-image: url("+e.img+");'>")+"<div class='c-card__image_embedded'"+("style='padding-top: "+(r?100*r+"%":"100%")+";'></div></div>")+"<div class='c-card__about'>"+("<div class='c-card__name'>"+e.name+' <span class="c-card__last-name">'+e.lastName+"</span></div>")+('<div class="c-card__description">'+o(e.description)+"</div></div></div>")).get(0)}var i=!1,c=void 0,t=[],n={itemSelector:".c-card",columnWidth:".c-card__sizer",percentPosition:!0},a={dots:!0,arrows:!0,infinite:!1,vertical:!1,speed:800,slidesToShow:4,slidesToScroll:4,appendArrows:$(".c-bloggers").parents(".c-section__content"),nextArrow:'<div class="slick-next slick-arrow c-bloggers__arrow c-bloggers__next"></div>',prevArrow:'<div class="slick-prev slick-arrow c-bloggers__arrow c-bloggers__prev"></div>',dotsClass:"slick-dots c-bloggers__dots"},d={dots:!1,centerMode:!1,arrows:!0,infinite:!1,speed:500,slidesToShow:5,appendArrows:$(".c-dreamers").parents(".c-section__content"),nextArrow:'<div class="slick-next slick-arrow c-bloggers__arrow c-bloggers__next"></div>',prevArrow:'<div class="slick-prev slick-arrow c-bloggers__arrow c-bloggers__prev"></div>'},l=1,g=85;$("body").addClass("hidden-footer"),$("body").addClass("hidden-footer").animate({scrollTop:$(".c-header").height()},500),$(".c-bloggers").slick(a),e(),$("#more-cards").click(e),$(".c-dreamers").slick(d);var p=$(".c-section-container").find(".c-section"),_=void 0;_=$(window).scrollTop()>0?1:0,$(window).on("mousewheel DOMMouseScroll MozMousePixelScroll",function(e){var o=parseInt(e.originalEvent.wheelDelta||-e.originalEvent.detail)>=0;if(o)0==p.eq(_).find(".c-section__box").position().top&&(e.preventDefault(),_>0&&$(window).animate({scrollTop:p.eq(_-1).offset().top},500));else{var r=p.eq(_),s=r.find(".c-section__box");s.position().top==r.height()-s.height()&&(e.preventDefault(),_<p.length&&(console.log(p.eq(_+1).offset().top),$("body").animate({scrollTop:p.eq(_).offset().top},500),_++))}})});
//# sourceMappingURL=../javascripts/common.js.map
