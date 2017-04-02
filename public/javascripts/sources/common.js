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

    $('.c-section-container').fullpage({
        scrollOverflow: true,
        navigation: true
    });
    $('.c-bloggers').slick(bloggerConfig);
    getCards();
    $('#more-cards').click(getCards);
    $('.c-dreamers').slick(dreamersConfig);


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
