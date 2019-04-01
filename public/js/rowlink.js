jQuery(document).ready(function($) {
    $(".tickets-row").click(function() {
        window.location = $(this).data("href");
    });
});
