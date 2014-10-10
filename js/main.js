// scripts
var popcorn = popcorn || {};

popcorn.toggleMenu = function(e) {
  var self = this,
  $target = $(e.currentTarget);
  $menu = $('#mainNav'),
  $content = $('#mainContent'),
  $heading = $('#mainHeading');

  if ($menu.is(':hidden')) {
    // set variable to heading text in case they click again
    self.oldHeading = $heading.text();

    $content.fadeOut('fast', function() {
      $heading.text('MENU');
      $menu.fadeIn('fast').removeClass('hidden');
    });
  } else {
    $menu.fadeOut('fast', function() {
      $content.fadeIn('fast');
      $heading.text(self.oldHeading);
    });
  }
}

popcorn.enterHome = function(e) {
  $('#enterHome, #fullSiteLink').fadeOut('slow', function() {
    $('#mainContent').removeClass('home_intro');
    $('#carousel').fadeIn('fast').removeClass('hidden');
  });
}

popcorn.toggleAccordion = function(e) {
  var $target = $(e.currentTarget),
  $description = $target.next('.method_description');

  if ($description.is(':hidden')) {
    $description.slideDown('fast', 'linear');
  } else {
    $description.slideUp('fast', 'linear');
  }
}

// event bindings
$('#toggleMenu').click(function(e) {
  e.preventDefault();
  popcorn.toggleMenu(e);
});

$('#enterHome').click(function(e) {
  e.preventDefault();
  popcorn.enterHome(e);
});

$('#consultingAccordion .slide > a').click(function(e) {
  e.preventDefault();
  popcorn.toggleAccordion(e);
});
