
console.log('welcome to app.js');


function openNav() {
  document.getElementById('mySidenav').style.width = '250px';
}

function closeNav() {
  document.getElementById('mySidenav').style.width = '0';
}




$(document).ready(function(){
  $('#updatebutton').click(function () {
    console.log('clicked');
    $(this).hide();
    $('.updateForm').toggle();
  });

});
