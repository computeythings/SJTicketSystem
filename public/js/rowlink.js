jQuery(document).ready(function($) {
    $(".reports-row").click(function() {
        window.location = $(this).data("href");
    });
});
