jQuery(document).ready(function($) {
    $('th').click(function() {
        if ($(this).hasClass("descending") || $(this).hasClass("ascending")) {
            $(this).toggleClass("ascending descending");
            $(this).find('.sort-button').each(function() {
                $(this).toggleClass('hidden');
            });
        }
        else {
            $('th').each(function() {
                $(this).removeClass();
                $(this).find('.sort-button').each(function() {
                    $(this).removeClass('hidden');
                });
            });
            $(this).addClass("descending");
            $(this).find('.sort-button.fa-caret-up').each(function() {
                $(this).toggleClass('hidden');
            });
        }
    });
});
