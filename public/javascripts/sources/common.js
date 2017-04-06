$(function() {
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
        responsive: [{
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
                    slidesToScroll: 1,
                    arrows: false
                }
            }
        ]
    };
    let dreamersConfig = {
        dots: false,
        centerMode: true,
        arrows: true,
        infinite: true,
        draggable: true,
        speed: 500,
        slidesToShow: 5,
        focusOnSelect: true,
        variableWidth: true,
        prevArrow: '<svg class="c-arrow c-arrow__prev"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-l"></use></svg>',
        nextArrow: '<svg class="c-arrow c-arrow__next"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-r"></use></svg>',
        responsive: [{
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
                    slidesToShow: 1,
                    

                }
            }
        ]
    }
    let cardsPagesCount = 1;
    const visibleSymbols = 85;
    const cardsrequestCount = 8;
    let isOpen = false;

    $('.lazy').each(function() {
        let src = $(this).attr('data-lazy');
        createImgNode($(this), src);
    })

    function createImgNode(element, src) {
        var img = document.createElement("img");
        img.src = src;
        img.onload = function() {
            element.attr('style', 'background-image: url(' + src + ');');
            element.addClass('visible');
            $('.c-section__header').attr('style', 'bottom: 120px');
        }

    }

    $('.js-menu-button, .c-menu-fixed .c-menu__item').on('click', function() {
        $('html').toggleClass('t-open-menu');
        $('.c-menu-fixed').fadeToggle(200, function() {
            isOpen = !isOpen;
            $('.c-menu-fixed').trigger('toggle', isOpen);
        });
    });

    $('.c-section-container').fullpage({
        scrollOverflow: true,
        navigation: true
    });

    getCards();
    $('.c-bloggers').slick(bloggerConfig);
    $('#more-cards').click(getCards);
    $('#more-condition').click(getCondition);
    $('#condition').click(hideCondition);
    $('.c-dreamers').slick(dreamersConfig);
    $('#condition').hide();


    function getCondition() {
        $('.c-section_condition .c-section__content').css("height", "auto");
        $('#more-condition').hide();
        $('#condition').show();

        $.fn.fullpage.reBuild();

    }


    function hideCondition() {
        $('.c-section_condition .c-section__content').css("height", "90vh");
        $('#more-condition').show();
        $('#condition').hide();

        $.fn.fullpage.reBuild();

    }

    /*$('.c-modal__block').click((event) => {
        event.stopPropagation();
    })*/
    $('.c-modal').on('click', e => {

        if ($(window).width() > 767 && !window.ontouchstart) {
            if($(e.target).closest('.c-modal__block').length > 0 ) return;
            $('body').removeClass('active');
            $.fn.fullpage.setAllowScrolling(true);
        }
    })


    $('.c-modal__close').click(() => {
        $('body').removeClass('active');
    })

    function getCards() {
        $.ajax({
            url: '//admin.msmechta.ru/results/msgirlstest?count=' + cardsrequestCount + '&page=' + (cardsPagesCount - 1),
            type: 'GET'
        }).done((cards) => {
            cardsPagesCount++;
            cards = assignId(cards.posts, cardsArray.length);
            cardsArray = cardsArray.concat(cards);
            if (cards.length > 0) {
                cardsLoader = $('.c-cards-holder').masonry(masonryConfig);
                isMasonryCreated = true;

                let counter = 0, appendTimeout;



                let newCards = cards.map((card) => {
                    let newCard = createCard(card);
                   
                    return newCard;
                });


               /* appendTimeout = setTimeout(() => {
                    if(counter === cards.length) {

                    }
                }, 100)
*/

                cardsLoader.append(newCards).masonry('appended', newCards).masonry('reloadItems');
                
                $.fn.fullpage.reBuild();
                if (cards.length < cardsrequestCount) {
                    $('#more-cards').hide();
                    $.fn.fullpage.setAllowScrolling(true);
                }
            } else {
                if (isMasonryCreated) {
                    cardsLoader.masonry('destroy');
                    isMasonryCreated = false;
                }
            }
        })
    }

    $(document).on('click', '.c-card', clickHandler);


    function clickHandler() {
        console.log('click card event');
        let id = $(this).attr('id');
        for (var index = 0; index < cardsArray.length; index++) {
            if (cardsArray[index].id == id) {
                let currentCard = cardsArray[index];
                let fullBlock = $('.c-modal__content');
                fullBlock.find('.c-modal__name').html(currentCard.name);
                fullBlock.find('.c-modal__image').attr('src', currentCard.image);
                fullBlock.find('.c-modal__full-description').html(currentCard.text);
                $.fn.fullpage.setAllowScrolling(false);
                $('body').addClass('active');
            }
        }
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

        let img = new Image();
        img.src = card.image;
        let width = img.naturalWidth ? img.naturalWidth : 100;
        let height = img.naturalHeight ? img.naturalHeight : 100;
        let dim = width/height;

        if (dim < .9) {
            card.modifer = 'vertical'
        } else if(dim >= 1.15) {
            card.modifer = 'horizontal'
        }  else {
            card.modifer = 'square'
        }
        
       

        return $(
            `<div class='c-card ${card.providerType}' id='${card.id}' data-modifer='${card.modifer}'>` +
            `<div class='c-card__image c-card__image--${card.modifer}'` +
            `style='background-image: url(${card.image});'>` +
            `<div class='c-social__post c-social--${card.providerType}'></div>` +
            `<div class='c-card__image_embedded'></div></div>` +
            `<div class='c-card__about'>` +
            `<div class='c-card__name'>${card.name}</span></div>` +
            `<div class="c-card__description">${reduceText(card.text)}</div></div></div>`
        ).get(0);
    };

    $(window).on('resize', resizeHandler);

    function resizeHandler() {
        if ($(window).width() > 767) {

        } else {
            if (isMasonryCreated) {
                cardsLoader.masonry('reloadItems');
            }
        }
    }
});