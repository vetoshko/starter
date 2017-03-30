$(function () {
    let isMasonryCreated = false;
    let cardsLoader;
    let cardsArray = [];
    let masonryConfig = {
        itemSelector: '.c-card',
        columnWidth: '.c-card__sizer',
        percentPosition: true
    };
    let slickConfig = {
        dots: false,
        arrows: false,
        infinite: false,
        vertical: false,
        speed: 800,
        fade: true,
        cssEase: 'linear'
    };
    let bloggerConfig = {
        dots: true,
        // centerMode: true,
        arrows: true,
        infinite: false,
        vertical: false,
        speed: 800,
        slidesToShow: 4,
        slidesToScroll: 4,
        appendArrows: $('.c-bloggers').parents('.c-section__content'),
        nextArrow: '<div class="slick-next slick-arrow c-bloggers__arrow c-bloggers__next"></div>',
        prevArrow: '<div class="slick-prev slick-arrow c-bloggers__arrow c-bloggers__prev"></div>',
        dotsClass: 'slick-dots c-bloggers__dots'
    }
    let dreamersConfig = {
        dots: false,
        centerMode: false,
        arrows: true,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        appendArrows: $('.c-dreamers').parents('.c-section__content'),
        nextArrow: '<div class="slick-next slick-arrow c-bloggers__arrow c-bloggers__next"></div>',
        prevArrow: '<div class="slick-prev slick-arrow c-bloggers__arrow c-bloggers__prev"></div>'
    }
    let cardsPagesCount = 1;

    const visibleSymbols = 85;
    // $('body').addClass('hidden-footer');
    let isAnimated = true;
    $('html, body').animate({
        scrollTop: $('.c-header').height()
    }, 500, () => {
        isAnimated = false;
    });

    // $('.c-section-container').slick(slickConfig);
    $('.c-bloggers').slick(bloggerConfig);
    getCards();
    $('#more-cards').click(getCards);
    $('.c-dreamers').slick(dreamersConfig);

    let sections = $('.c-section-container').find('.c-section');
    let currentSection;
    if ($(window).scrollTop() > 0) {
        currentSection = 0;
    } else {
        currentSection = -1;
    }

    $(window).on('mousewheel DOMMouseScroll MozMousePixelScroll', (event) => {
        let isScrolledUp = parseInt(event.originalEvent.wheelDelta || -event.originalEvent.detail) >= 0;
        if (isScrolledUp) {
            if (sections.eq(currentSection).find('.c-section__content').position().top == 0) {
                event.preventDefault();
                if (currentSection > 0 && currentSection <= sections.length) {
                    if (!isAnimated) {
                        isAnimated = true;
                        $('html, body').animate({
                            scrollTop: sections.eq(currentSection - 1).offset().top
                        }, 500, () => {
                            isAnimated = false;
                        });
                        currentSection--;
                    }
                } else {
                    if (!isAnimated) {
                        isAnimated = true;
                        $('html, body').animate({
                            scrollTop: $('.c-section-container').prev().offset().top
                        }, 500, () => {
                            isAnimated = false;
                        });
                        currentSection--;
                    }
                }
            }
        } else {
            let section = sections.eq(currentSection);
            let content = section.find('.c-section__content');

            if (content.position().top <= section.height() - content.height()) {
                event.preventDefault();
                if (currentSection < sections.length - 1) {
                    if (!isAnimated) {
                        isAnimated = true;
                        $('html, body').animate({
                            scrollTop: sections.eq(currentSection + 1).offset().top
                        }, 500, () => {
                            isAnimated = false;
                        });
                        currentSection++;
                    }
                } else {
                    if (currentSection == sections.length - 1) {
                        if (!isAnimated) {
                            isAnimated = true;
                            console.log($('.c-section-container').next().offset().top);
                            $('html, body').animate({
                                scrollTop: $('.c-section-container').next().offset().top
                            }, 500, () => {
                                isAnimated = false;
                            });
                            currentSection++;
                        }
                    }
                }
            } else {
                if (currentSection == -1) {
                    if (!isAnimated) {
                        isAnimated = true;
                        $('html, body').animate({
                            scrollTop: sections.eq(0).offset().top
                        }, 500, () => {
                            isAnimated = false;
                        });
                        currentSection++;
                    }
                }
            }
        }
    });


// $(window).on('mousewheel DOMMouseScroll MozMousePixelScroll', (event) => {
//     let container = $('.c-section-container');
//     let currentSlide = $('.c-section.slick-active');
//     let currentContent = currentSlide.find('.c-section__content');
//     let isScrolledUp = parseInt(event.originalEvent.wheelDelta || -event.originalEvent.detail) >= 0;
//     let heightDelta = Math.floor(currentContent.height() - currentSlide.height());
//     let topOffset = currentSlide.offset().top - $(document).scrollTop();

//     if (isScrolledUp) {
//         console.log('scrolled up');
//         if (currentSlide.index() > 0) {
//             console.log('not 1 slide');
//             console.log(currentContent.offset().top);
//             console.log($('.c-header').height());
//             if (currentContent.offset().top == $('.c-header').height()) {
//                 event.preventDefault();
//                 let currentSlideIdx = container.slick('slickCurrentSlide');
//                 container.slick('slickGoTo', currentSlideIdx - 1);
//             }
//             if (currentSlide.index() == $('.c-section').length - 1) {
//                 console.log('last slide');
//                 if (topOffset == $('.c-footer').height() * -1) {
//                     console.log('hide footer');
//                     $('body').animate({
//                         scrollTop: $(document).scrollTop() - $('.c-footer').height()
//                     }, 500);
//                 }
//             }
//         } else {
//             console.log('1 slide');
//             if (currentSlide.find('.c-section__box').scrollTop() <= 0) {
//                     event.preventDefault();
//                     $('body').animate({
//                         scrollTop: 0
//                     }, 500);
//                 }
//         }
//     } else {
//         console.log('scrolled down');
//         console.log(topOffset);
//         if (topOffset > 0) {
//             event.preventDefault();
//             $('body').animate({
//                 scrollTop: $('.c-header').height()
//             }, 500);
//             return;
//         }
//         if (heightDelta <= currentSlide.find('.c-section__box').scrollTop() || heightDelta < 0) {
//             if (currentSlide.index() < $('.c-section').length - 1) {
//                 let currentSlideIdx = container.slick('slickCurrentSlide');
//                 container.slick('slickGoTo', currentSlideIdx + 1);
//             } else {
//                 console.log('footer in da house');
//                 event.preventDefault();
//                 $('body').animate({
//                     scrollTop: $('.c-footer').offset().top + $('.c-footer').height()
//                 }, 500);
//             }
//         } else {
//             if (currentSlide.index() == $('.c-section').length - 1) {
//                 console.log($('.c-footer').offset().top - $(window).scrollTop());
//                 if (heightDelta - 1 <= currentSlide.find('.c-section__box').scrollTop()) {
//                     if (currentSlide.offset().top == $('.c-header').height()) {
//                         event.preventDefault();
//                         $('body').animate({
//                             scrollTop: $(document).scrollTop() + $('.c-footer').height()
//                         }, 500);
//                     }
//                 }
//             };
//         }
//     }
//     setBorders($('.c-section.slick-active'));
// });

function getCards() {
    $.ajax({
        url: 'http://127.0.0.1:3000/cards',
        type: 'GET'
    }).done((cards) => {
        cardsPagesCount++;
        cards = assignId(cards, cardsArray.length);
        cardsArray = cardsArray.concat(cards);
        if (cards.length > 0) {
            cardsLoader = $('.c-cards-holder').masonry(masonryConfig);
            isMasonryCreated = true;
            let newCards = cards.map((card) => {
                return createCard(card);
            });
            cardsLoader.append(newCards).masonry('appended', newCards).masonry('reloadItems');
        } else {
            if (isMasonryCreated) {
                cardsLoader.masonry('destroy');
                isMasonryCreated = false;
            }
        }
    })
}

function reduceText(string) {
    if (string.length > visibleSymbols) {
        string = string.substring(0, visibleSymbols) + ' ...';
    }
    return string;
}

function isHeaderVisible(currentSlide, topOffset) {
    return currentSlide.index() == 0 && topOffset == $('.c-header').height();
}

function isFooterVisible(currentSlide, topOffset) {
    return currentSlide.index() == $('.c-section').length - 1 && (-1 * topOffset) == $('.c-footer').height();
}

function setBorders(currentSlide) {
    let body = $('body');
    if (currentSlide.index() > 0) {
        // body.addClass('hidden-header');
        body.addClass('hidden-footer');
        if (currentSlide.index() == $('.c-section').length - 1) {
            body.removeClass('hidden-footer');
        }
    } else {
        body.addClass('hidden-footer');
        // body.removeClass('hidden-header');
    }
}

function assignId(cards, lastIndex) {
    return cards.map((card, index) => {
        card.id = 'card-' + (lastIndex + index + 1);
        return card;
    })
}

function createCard(card) {
    let heightCoefficient = card.imgHeight / card.imgWidth;
    return $(
        `<div class='c-card' id='${card.id}'>` +
        `<div class='c-card__image'` +
        `style='background-image: url(${card.img});'>` +
        `<div class='c-card__image_embedded'` +
        `style='padding-top: ${heightCoefficient ? 100 * heightCoefficient + '%' : '100%'};'></div></div>` +
        `<div class='c-card__about'>` +
        `<div class='c-card__name'>${card.name} <span class="c-card__last-name">${card.lastName}</span></div>` +
        `<div class="c-card__description">${reduceText(card.description)}</div></div></div>`
    ).get(0);
};
})
;
