/* eslint-disable no-unused-vars */
'use strict';


function goBack() {
  window.history.back();
}


$(document).ready(function() {
  $('#filterGenre').change(function(){
    if ($(this).val()!='') {
      window.location.href='/home?genre='+$(this).val();
    }
  });
})

$(document).ready(function() {
  $('#orderBy').change(function(){
    if ($(this).val()!='') {
      window.location.href='/collection?orderBy='+$(this).val();
    }
  });

})
