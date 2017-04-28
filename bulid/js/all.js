$(function() {
    $('.issueMore').click(function(event) {
        $(this).children('.fa-angle-up').toggleClass('fa-rotate-180');
        $(this).parent().next().find('.issueTopicIntro').stop().slideToggle();
    });

    $('.detailplace_tab>li').click(function(event) {
        var tabContent = $(this).children().attr('data-tab');
    	$(this).addClass('is-active').siblings().removeClass('is-active');
        $("."+tabContent).removeClass('hide').siblings().addClass('hide');
    });

    // Tracking
    $('.track-AddToWishlist').on('click', function(){
        fbq('track', 'AddToWishlist');
    })
});
