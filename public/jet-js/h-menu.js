var MOBILE_FLAG = false;
$(function () {
    var animation = false,
        duration = 400;
    $('.h-menu__list_smaller .h-menu__item:not(.h-menu__item_active)').hover(function () {
        if (MOBILE_FLAG)  {return;}
        var $this = $(this);
        var height = $this.height();
        animation = true;
        $('.h-menu__link_colored', $this).css('bottom', '100%');
        $('.h-menu__link_colored', $this).stop().animate({
            'bottom': 0
        }, duration, 'easeOutCubic');
        $('.h-menu__link', $this).stop().animate({
            'bottom': '-' + height + 'px'
        }, duration*1.2, 'easeOutCubic', function () {
            animation = false;
        });
    }, function () {
        if (MOBILE_FLAG)  {return;}
        var $this = $(this);
        var height = $this.height();
        animation = true;
        $('.h-menu__link', $this).css('bottom', height + 'px');
        $('.h-menu__link', $this).stop().animate({
            'bottom': 0
        }, duration, 'easeOutCubic');
        $('.h-menu__link_colored', $this).stop().animate({
            'bottom': '-100%'
        }, duration*1.2, 'easeOutCubic', function () {
            animation = false;
        });
    });
    
    $('.header__mob-menu-btn').on('touchstart click', function(e){
        e.preventDefault();
        $('html, body').toggleClass('popup-html');
        $('.h-menu').slideToggle();
    });
    
    $(window).on('resize', function() {
        MOBILE_FLAG = ($(window).width() <= 1023);
    }).trigger('resize');

});