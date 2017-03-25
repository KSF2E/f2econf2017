$(function() {
    $('.issueMore').click(function(event) {
        $(this).children('.fa-angle-up').toggleClass('fa-rotate-180');
        $(this).parent().next().find('.issueTopicIntro').stop().slideToggle();
    });
});
