/* eslint-disable no-unused-vars */
'use strict';


function goBack() {
  window.history.back();
}




$(document).ready(function() {
  $('#orderBy').change(function(){
    if ($(this).val()!='') {
      window.location.href='/collection?orderBy='+$(this).val();
    }
  });
});


// if(response=="duplicate") alert('You have already saved that title!');
