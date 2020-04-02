/* eslint-disable no-unused-vars */
'use strict';


function goBack() {
  window.history.back();
}

function showHideToggle() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

if(typeof $ !== 'undefined'){
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
}

