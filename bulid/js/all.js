$(function() {
    $('.issueMore').click(function(event) {
        $(this).children('.fa-angle-up').toggleClass('fa-rotate-180');
        $(this).parent().next().find('.issueTopicIntro').stop().slideToggle();
    });

    $('.detailplace_tab>li').click(function(event) {
    	$(this).toggleClass('is-active').siblings().toggleClass('is-active');
    	$('.detailplace_info').children().toggleClass('hide');
    });
});
