$(function() {
    $(document).on('scroll', function(e){
        var topOffset = $(window).scrollTop(),
            notAnimated = true,
            $grayBlock = $('.gray-block_tat'),
            blockOffset = $grayBlock.length>0?$grayBlock.offset().top - $(window).height()+200:0;
        if (topOffset>(blockOffset)&&notAnimated) {
            notAnimated = false;
            $('.gray-block__rocket').addClass('gray-block__rocket_animate_yes');
        }
    });
});