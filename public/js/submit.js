jQuery(document).ready(function($) {
  $('form').submit(function(e) {
    // confirm passwords match
    if ($('#pw').val() != $('#pw_confirm').val()) {
      $('#pw_confirm').addClass('invalid');
      $('#pw_feedback').text('Passwords don\'t match.');
      return false;
    } else {
      $('#pw_confirm').removeClass('invalid');
      $('#pw_feedback').text('');
    }

    e.preventDefault();

    // async form submit
    $.ajax({
      url: $(this).attr('action'),
      type: 'POST',
      data: $(this).serialize(),
      success: function(res) {
        $('#current').removeClass('invalid');
        $('#login_feedback').text('');
        location.href = '/';
      },
      error: function(err) {
        $('#current').addClass('invalid');
        $('#login_feedback').text(err.responseText);
      }
    });
    return false;
  })
});
