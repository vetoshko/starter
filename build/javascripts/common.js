"use strict";$(function(){function e(e,i){var o=document.createElement("img");o.src=i,o.onload=function(){e.attr("style","background-image: url("+i+");"),e.addClass("visible"),$(".c-section__header").attr("style","bottom: 120px")}}function i(){$(".c-section_condition .c-section__content").css("height","auto"),$("#more-condition").hide(),$("#condition").show(),$.fn.fullpage.reBuild()}function o(){$(".c-section_condition .c-section__content").css("height","80vh"),$("#more-condition").show(),$("#condition").hide(),$.fn.fullpage.reBuild()}function n(){$.ajax({url:"//admin.msmechta.ru/results/msgirlstest?count="+v+"&page="+(h-1),type:"GET"}).done(function(e){if(h++,e=r(e.posts,g.length),g=g.concat(e),e.length>0){d=$(".c-cards-holder").masonry(m),l=!0;var i=e.map(function(e){var i=c(e);return i});d.append(i).masonry("appended",i).masonry("reloadItems"),i.forEach(function(e){$(e).click(t)}),$.fn.fullpage.reBuild(),e.length<v&&$("#more-cards").hide()}else l&&(d.masonry("destroy"),l=!1)})}function t(){for(var e=$(this).attr("id"),i=0;i<g.length;i++)if(g[i].id==e){var o=g[i],n=$(".c-modal__content");n.find(".c-modal__name").html(o.name),n.find(".c-modal__image").attr("src",o.image),n.find(".c-modal__full-description").html(o.text),$(".c-modal").addClass("active")}}function s(e){return e.length>f&&(e=e.substring(0,f)+" ..."),e}function r(e,i){return e.map(function(e,o){return e.id="card-"+(i+o+1),e})}function c(e){var i=e.imgHeight/e.imgWidth;return $("<div class='c-card "+e.providerType+"' id='"+e.id+"'><div class='c-card__image'"+("style='background-image: url("+e.image+");'>")+"<div class='c-card__image_embedded'"+("style='padding-top: "+(i?100*i+"%":"100%")+";'></div></div>")+"<div class='c-card__about'>"+("<div class='c-card__name'>"+e.name+"</span></div>")+('<div class="c-card__description">'+s(e.text)+"</div></div></div>")).get(0)}function a(){$(window).width()>767||l&&d.masonry("reloadItems")}var l=!1,d=void 0,g=[],m={itemSelector:".c-card",columnWidth:".c-card__sizer",percentPosition:!0},u={dots:!0,arrows:!0,infinite:!1,vertical:!1,speed:800,slidesToShow:4,slidesToScroll:4,prevArrow:'<svg class="c-arrow c-arrow__prev"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-l"></use></svg>',nextArrow:'<svg class="c-arrow c-arrow__next"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-r"></use></svg>',dotsClass:"slick-dots c-bloggers__dots",responsive:[{breakpoint:992,settings:{slidesToShow:3,slidesToScroll:3}},{breakpoint:767,settings:{slidesToShow:2,slidesToScroll:2}},{breakpoint:480,settings:{slidesToShow:1,slidesToScroll:1}}]},w={dots:!1,centerMode:!0,arrows:!0,infinite:!0,draggable:!0,speed:500,slidesToShow:5,focusOnSelect:!0,variableWidth:!0,prevArrow:'<svg class="c-arrow c-arrow__prev"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-l"></use></svg>',nextArrow:'<svg class="c-arrow c-arrow__next"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-r"></use></svg>',responsive:[{breakpoint:992,settings:{slidesToShow:3}},{breakpoint:767,settings:{slidesToShow:2}},{breakpoint:480,settings:{slidesToShow:1}}]},h=1,f=85,v=8,p=!1;$(".lazy").each(function(){var i=$(this).attr("data-lazy");e($(this),i)}),$(".js-menu-button").on("click",function(){$("html").toggleClass("t-open-menu"),$(".c-menu-fixed").fadeToggle(200,function(){p=!p,$(".c-menu-fixed").trigger("toggle",p)})}),$(".c-section-container").fullpage({scrollOverflow:!0,navigation:!0}),n(),$(".c-bloggers").slick(u),$("#more-cards").click(n),$("#more-condition").click(i),$("#condition").click(o),$(".c-dreamers").slick(w),$("#condition").hide(),$(".c-modal__block").click(function(e){e.stopPropagation()}),$(".c-modal").click(function(){$(window).width()>767&&$(".c-modal").removeClass("active")}),$(".c-modal__close").click(function(){$(".c-modal").removeClass("active")}),$(window).on("resize",a)});
//# sourceMappingURL=../javascripts/common.js.map
