"use strict";$(function(){function e(e,s){var i=document.createElement("img");i.src=s,i.onload=function(){e.attr("style","background-image: url("+s+");"),e.addClass("visible"),$(".c-section__header").attr("style","bottom: 120px")}}function s(){$.ajax({url:"//admin.msmechta.ru/results/msgirlstest?count="+v+"&page="+(u-1),type:"GET"}).done(function(e){if(u++,e=r(e.posts,l.length),l=l.concat(e),e.length>0){c=$(".c-cards-holder").masonry(d),a=!0;var s=e.map(function(e){var s=t(e);return s});c.append(s).masonry("appended",s).masonry("reloadItems"),s.forEach(function(e){$(e).click(i)}),$.fn.fullpage.reBuild(),e.length<v&&$("#more-cards").hide()}else a&&(c.masonry("destroy"),a=!1)})}function i(){for(var e=$(this).attr("id"),s=0;s<l.length;s++)if(l[s].id==e){var i=l[s],o=$(".c-modal__content");o.find(".c-modal__name").html(i.name),o.find(".c-modal__image").attr("src",i.image),o.find(".c-modal__full-description").html(i.text),$(".c-modal").addClass("active")}}function o(e){return e.length>w&&(e=e.substring(0,w)+" ..."),e}function r(e,s){return e.map(function(e,i){return e.id="card-"+(s+i+1),e})}function t(e){var s=e.imgHeight/e.imgWidth;return $("<div class='c-card "+e.providerType+"' id='"+e.id+"'><div class='c-card__image'"+("style='background-image: url("+e.image+");'>")+"<div class='c-card__image_embedded'"+("style='padding-top: "+(s?100*s+"%":"100%")+";'></div></div>")+"<div class='c-card__about'>"+("<div class='c-card__name'>"+e.name+"</span></div>")+('<div class="c-card__description">'+o(e.text)+"</div></div></div>")).get(0)}function n(){$(window).width()>767||a&&c.masonry("reloadItems")}var a=!1,c=void 0,l=[],d={itemSelector:".c-card",columnWidth:".c-card__sizer",percentPosition:!0},g={dots:!0,arrows:!0,infinite:!1,vertical:!1,speed:800,slidesToShow:4,slidesToScroll:4,prevArrow:'<svg class="c-arrow c-arrow__prev"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-l"></use></svg>',nextArrow:'<svg class="c-arrow c-arrow__next"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-r"></use></svg>',dotsClass:"slick-dots c-bloggers__dots",responsive:[{breakpoint:992,settings:{slidesToShow:3,slidesToScroll:3}},{breakpoint:767,settings:{slidesToShow:2,slidesToScroll:2}},{breakpoint:480,settings:{slidesToShow:1,slidesToScroll:1}}]},m={dots:!1,centerMode:!0,arrows:!0,infinite:!0,draggable:!0,speed:500,slidesToShow:5,focusOnSelect:!0,variableWidth:!0,prevArrow:'<svg class="c-arrow c-arrow__prev"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-l"></use></svg>',nextArrow:'<svg class="c-arrow c-arrow__next"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-r"></use></svg>',responsive:[{breakpoint:992,settings:{slidesToShow:3}},{breakpoint:767,settings:{slidesToShow:2}},{breakpoint:480,settings:{slidesToShow:1}}]},u=1,w=85,v=8,f=!1;$(".lazy").each(function(){var s=$(this).attr("data-lazy");e($(this),s)}),$(".js-menu-button").on("click",function(){$("html").toggleClass("t-open-menu"),$(".c-menu-fixed").fadeToggle(200,function(){f=!f,$(".c-menu-fixed").trigger("toggle",f)})}),$(".c-section-container").fullpage({scrollOverflow:!0,navigation:!0}),s(),$(".c-bloggers").slick(g),$("#more-cards").click(s),$(".c-dreamers").slick(m),$(".c-modal__block").click(function(e){e.stopPropagation()}),$(".c-modal").click(function(){$(window).width()>767&&$(".c-modal").removeClass("active")}),$(".c-modal__close").click(function(){$(".c-modal").removeClass("active")}),$(window).on("resize",n)});
//# sourceMappingURL=../javascripts/common.js.map
