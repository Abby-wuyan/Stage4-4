$('#link-reg').on('click', function() {
    $(".register-box").show();
    $('.login-box').hide();
});
$('#link-login').on('click', function() {
    $(".register-box").hide();
    $('.login-box').show();
})