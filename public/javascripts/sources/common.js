$(function () {
    let isMasonryCreated = false;
    let cardsLoader;
    let cardsArray = [];
    let masonryConfig = {
        itemSelector: '.c-card',
        columnWidth: '.c-card__sizer',
        percentPosition: true
    };
    let bloggerConfig = {
        dots: true,
        arrows: true,
        infinite: false,
        vertical: false,
        speed: 800,
        slidesToShow: 4,
        slidesToScroll: 4,
        prevArrow: '<svg class="c-arrow c-arrow__prev"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-l"></use></svg>',
        nextArrow: '<svg class="c-arrow c-arrow__next"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-r"></use></svg>',
        dotsClass: 'slick-dots c-bloggers__dots',
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }, {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };
    
    let dreamersConfig = {
        dots: false,
        centerMode: false,
        arrows: true,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        prevArrow: '<svg class="c-arrow c-arrow__prev"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-l"></use></svg>',
        nextArrow: '<svg class="c-arrow c-arrow__next"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-r"></use></svg>',
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2
                }
            }, {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    }
    let cardsPagesCount = 1;

    const visibleSymbols = 85;

    $('.c-section-container').fullpage({
        scrollOverflow: true,
        navigation: true
    });

    getCards();
    $('.c-bloggers').slick(bloggerConfig);
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
                $.fn.fullpage.reBuild();
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

    $(window).on('resize', resizeHandler);

    function resizeHandler() {
        if ($(window).width() > 767) {

        } else {
            if (isMasonryCreated) {
                console.log('reload masonry');
                cardsLoader.masonry('reloadItems');
            }
        }
    }
});
