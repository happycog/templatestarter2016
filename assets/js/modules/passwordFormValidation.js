function passwordFormValidation() {

  $("#data-password-form").submit(function(event) {

    event.preventDefault();
    $.post( "http://shopify-fed-test.herokuapp.com/emails.json", { email: $("#forgot-password-email").val()}).done(function( data ) {
        console.log("test");
        $("[data-password-form-field]").append('<p class="form-error-state--valid">You&rsquo;re email has been sucessfully submitted</p>')
    }).fail(function(data) {
      $("[data-password-form-field]").append('<p class="form-error form-error-state--invalid">This is an error message</p>')

    })

  });

  $("#forgot-password-email").focus( function(){
    $(".form-error").remove();
  });
}
