jQuery(document).ready(function($) {
    $("#closeTicket").change(function() {
        if($("#closeTicket").is(':checked'))
          $("#type").show();
        else
          $("#type").hide();
    });
});
