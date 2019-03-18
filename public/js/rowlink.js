jQuery(document).ready(function($) {
    $(".reportsRow").click(function() {
        window.location = $(this).data("href");
    });
});
