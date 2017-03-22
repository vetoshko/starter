$(function () {
    let isMasonryCreated = false;
    let cardsLoader;
    let cardsArray = [];
    let masonryConfig = {
        itemSelector: '.c-card',
        columnWidth: '.c-card__sizer',
        percentPosition: true,
        gutter: '.c-card__gutter'
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
    let cardsPagesCount = 1;

    $('body').animate({
        scrollTop: $('.c-header').height()
    }, 500);
    
    $('.c-section-container').slick(slickConfig);
    getCards();
    $('#more-cards').click(getCards);

    $(window).on('mousewheel DOMMouseScroll MozMousePixelScroll', (event) => {
        let container = $('.c-section-container');
        let currentSlide = $(event.target).parents('.c-section');
        let currentContent = currentSlide.find('.c-section__content');
        let isScrolledUp = parseInt(event.originalEvent.wheelDelta || -event.originalEvent.detail) >= 0;
        if (isScrolledUp) {
            if (currentSlide.find('.c-section__content').scrollTop() == 0) {
                if (currentSlide.index() > 0) {
                    let currentSlideIdx = container.slick('slickCurrentSlide');
                    container.slick('slickGoTo', currentSlideIdx - 1);
                }
            }
        } else {
            let heightDelta = Math.floor(currentContent.height() - currentSlide.height());
            let topOffset = currentSlide.offset().top - $(document).scrollTop();
            if (topOffset > 0) {
                currentSlide.addClass('prevent-scroll');
            } else {
                currentSlide.removeClass('prevent-scroll');
                if (heightDelta <= currentSlide.find('.c-section__box').scrollTop() || heightDelta < 0) {
                    if (currentSlide.index() < $('.c-section').length) {
                        let currentSlideIdx = container.slick('slickCurrentSlide');
                        container.slick('slickGoTo', currentSlideIdx + 1);
                    }
                }
            }
        }
    });

    function getCards() {
        $.ajax({
            url: 'http://10.66.80.80:3000/cards',
            type: 'GET'
        }).done((cards) => {
            
            cardsPagesCount++;
            cards = assignId(cards, cardsArray.length);
            cardsArray = cardsArray.concat(cards);
            if (cards.length > 0) {
                cardsLoader = $('.c-cards-holder').masonry(masonryConfig);
                isMasonryCreated = true;
                let newCards =  cards.map((card) => {
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
            `<div 
class='c-card__image_embedded'` +
            `style='padding-top: ${heightCoefficient ? 100 * heightCoefficient + '%' : '100%'};'></div></div>` +
            `<div class='c-card__description'>` +
            `<div class='c-card__name'>${card.name}</div></div></div>`
        ).get(0);
    };
});
