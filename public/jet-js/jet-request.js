$(function() {
    $(document).on('scroll', function(e){
        var topOffset = $(window).scrollTop(),
            notAnimated = true,
            $grayBlock = $('.jet-request'),
            blockOffset = $grayBlock.length>0?$grayBlock.offset().top - $(window).height()+200:0;
        if (topOffset>(blockOffset)&&notAnimated) {
            notAnimated = false;
            $('.jet-request__rocket').addClass('jet-request__rocket--is-animated');
        }
    });
});