$(function() {
    let isMasonryCreated = false;
    let cardsLoader;
    let cardsArray = [];
    let masonryConfig = {
        itemSelector: '.c-card',
        columnWidth: '.c-card__sizer',
        percentPosition: true,
        // gutter: '.c-card__gutter'
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
        appendArrows: $('.c-bloggers-wrapper').parents('.c-section__content'),
        nextArrow: '<div class="slick-next slick-arrow c-bloggers-wrapper__arrow c-bloggers-wrapper__next"></div>',
        prevArrow: '<div class="slick-prev slick-arrow c-bloggers-wrapper__arrow c-bloggers-wrapper__prev"></div>',
        dotsClass: 'slick-dots c-bloggers-wrapper__dots'
    }
    let cardsPagesCount = 1;

    const visibleSymbols = 85;

    // $('body').addClass('hidden-footer');
    $('body').addClass('hidden-footer').animate({
        scrollTop: $('.c-header').height()
    }, 500);

    $('.c-section-container').slick(slickConfig);
    $('.c-bloggers-wrapper').slick(bloggerConfig);
    getCards();
    $('#more-cards').click(getCards);

    // let previousWindowOffset = $(window).offset().top;
    // console.log(previousWindowOffset);

    $(window).on('mousewheel DOMMouseScroll MozMousePixelScroll', (event) => {
        let container = $('.c-section-container');
        let currentSlide = $('.c-section.slick-active');
        let currentContent = currentSlide.find('.c-section__content');
        let isScrolledUp = parseInt(event.originalEvent.wheelDelta || -event.originalEvent.detail) >= 0;
        let heightDelta = Math.floor(currentContent.height() - currentSlide.height());
        let topOffset = currentSlide.offset().top - $(document).scrollTop();
        if (isScrolledUp) {
            if (currentSlide.index() > 0) {
                if (currentContent.offset().top == $('.c-header').height()) {
                    event.preventDefault();
                    let currentSlideIdx = container.slick('slickCurrentSlide');
                    container.slick('slickGoTo', currentSlideIdx - 1);
                }
                if (currentSlide.index() == $('.c-section').length - 1) {
                    if (topOffset == $('.c-footer').height() * -1) {
                        $('body').animate({
                            scrollTop: $(document).scrollTop() - $('.c-footer').height()
                        }, 500);
                    }
                }
            } else {
                if (currentSlide.find('.c-section__box').scrollTop() <= 0) {
                        event.preventDefault();
                        $('body').animate({
                            scrollTop: 0
                        }, 500);
                    }
            }
        } else {
            if (topOffset > 0) {
                event.preventDefault();
                $('body').animate({
                    scrollTop: $('.c-header').height()
                }, 500);
                return;
            }
            if (heightDelta <= currentSlide.find('.c-section__box').scrollTop() || heightDelta < 0) {
                if (currentSlide.index() < $('.c-section').length) {
                    let currentSlideIdx = container.slick('slickCurrentSlide');
                    container.slick('slickGoTo', currentSlideIdx + 1);
                }
            } else {
                if (currentSlide.index() == $('.c-section').length - 1) {
                    console.log($('.c-footer').offset().top - $(window).scrollTop());
                    // if (heightDelta - 1 <= currentSlide.find('.c-section__box').scrollTop()) {
                    //     if (currentSlide.offset().top == $('.c-header').height()) {
                    //         event.preventDefault();
                    //         $('body').animate({
                    //             scrollTop: $(document).scrollTop() + $('.c-footer').height()
                    //         }, 500);
                    //     }
                    // }
                };
            }
        }
        setBorders($('.c-section.slick-active'));
    });

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
});