$(function () {
    $('.popup-show').on('click', function (event) {
        event.stopPropagation();
        showAndHidePopup(false, true);

    });

    $('.popup-close').on('click', function (event) {
        event.stopPropagation();
        showAndHidePopup(true);
    });

    $('.popup__wrp').on('click', function (event) {

        if ($(event.target).closest('.popup__content').length === 0 &&
            $(event.target).closest('.popup__thank-content').length === 0 &&
            $(event.target).closest('.popup__subscr-content').length === 0) {
            showAndHidePopup(true);
        }

    });
    $(document).on('keyup', function (e) {
        if (e.keyCode === 27) {
            showAndHidePopup(true);
        }
    });

    $('.popup__form').on('submit', function() {
        var form = $(this);
        var formData = new FormData(form[0]);

        if ($('[name="Feedback[name]"]', form).val() && ($('[name="Feedback[phone]"]', form).val() || $('[name="Feedback[email]"]', form).val())) {
            $.ajax({
                url: form.attr('action'),
                type: 'POST',
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                success: function(res) {
                    $('.popup-error').hide();
                    $('.popup__content').hide();
                    $('.popup__thank-content').addClass('show');
                    
                    ga('send', 'event', 'lead', 'sent', 'promo');
                    yaCounter4480927.reachGoal('LEAD_SENT_PROMO');
                }
            });
            
        }
        else {
            $('.popup-error').fadeIn(300);
            $('[name="Feedback[name]"]', form).trigger('focus');
        }

        return false;
    });
    $('.subscript__form').on('submit', function() {
        var form = $(this);
        var formData = new FormData(form[0]);

        if ($('[name="Feedback[email]"]', form).val()) {
            $.ajax({
                url: form.attr('action'),
                type: 'POST',
                data: formData,
                cache: false,
                contentType: false,
                processData: false
            });
            $('.subscript__email').removeClass('error');
            $('.subscript__error').hide();
            showAndHidePopup(false, false);
        } else {
            $('.subscript__email').addClass('error');
            $('.subscript__error').show();
        }

        return false;
    });

    // $('.subscript__form').on('submit', function () {
    //     if ($('[name="subscript"]').val()) {
    //         $('.subscript__email').removeClass('error');
    //         $('.subscript__error').hide();
    //         showAndHidePopup(false, false);
    //     } else {
    //         $('.subscript__email').addClass('error');
    //         $('.subscript__error').show();
    //     }
    //     return false;
    // });

    function showAndHidePopup(close, request) {
        var $popupWindow = $('.popup__content');
        $('.popup__wrp').toggleClass('show');

        if (close) {
            $('[name="phone"]').val('');
            $('[name="mail"]').val('');
            $('.popup-error').hide();
            $popupWindow.hide();
            $('.popup__subscr-content').hide();
            $('.popup__thank-content').removeClass('show');
            return true;
        }

        if (request) {
            $popupWindow.show();
        } else {
            $('.popup__subscr-content').show();
        }
    }
});