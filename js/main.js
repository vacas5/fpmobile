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

popcorn.showBios = function(e) {
  var $target = $(e.currentTarget),
  anchor = $target.attr('href');

  $('#talentbankIntro').fadeOut('fast', function() {
    $('#talentbankBios').fadeIn('fast');
    // show selected
    var toScroll = $(anchor).offset().top;
    $('html, body').animate({
      scrollTop: toScroll - 40
    }, 300);
  });
}

popcorn.showPress = function(e) {
  $('#pressHero').fadeOut('fast', function() {
    $('#pressMedia').fadeIn('fast');
  })
}

popcorn.createArticles = function(xml) {
  var self = this;
  self.xml = xml;
  $(xml).find('item').each(function(i) {
    var markup = {
      title: $(this).children().eq(0).text(),
      image: $(this).children().eq(7).attr('url'),
      date: $(this).find('pubDate').text(),
      description: $(this).find('description').text()
    }
    markup.dateArray = markup.date.split(' ');

    var slide = '<div class="article_wrapper">'
    + '<a href="#" class="article_image" style="background-image:url(' + markup.image + ');" data-article="' + i + '"></a>'
    + '<h2 class="article_title">' + markup.title + '</h2>'
    + '<h3 class="article_date">' + markup.dateArray[2] + ' ' + markup.dateArray[1] + ', ' + markup.dateArray[3] + '</h3>'
    + '<p class="article_description">' + markup.description + '</p>'
    + '</div>';

    $('#cultureArticleFeed').append(slide);
  })
}

popcorn.showArticle = function(e) {
  var self = this,
  $target = $(e.currentTarget),
  articleIndex = $target.data('article'),
  $article = $(self.xml).find('item').eq(articleIndex),
  title = $article.children().eq(0).text(),
  image = $article.children().eq(7).attr('url'),
  content = $article.children().eq(6).text(),
  link = $article.find('link').text(),
  uriTitle = encodeURIComponent(title);

  var articleMarkup = '<a href="#" class="article_close">&times;</a>'
  + '<div class="article_image"><img src="' + image + '"></div>'
  + '<div class="article_social">'
  + '<a target="_blank" href="http://www.facebook.com/sharer/sharer.php?u=' + link + '" class="facebook"></a>'
  + '<a target="_blank" href="http://twitter.com/home?status=' + uriTitle + '%20' + link + '" class="twitter"></a>'
  + '</div>'
  + '<h2 class="article_title">' + title + '</h2>'
  + '<div class="article_content">' + content + '</div>';

  $('#cultureArticleWrapper').html(articleMarkup);

  $('#cultureArticleFeed').fadeOut('fast', function() {
    $('#cultureArticleWrapper').fadeIn('fast');
    $('html, body').animate({
      scrollTop: 0
    }, 300);
  });
}

popcorn.closeArticle = function() {
  $('#cultureArticleWrapper').fadeOut('fast', function() {
    $('#cultureArticleFeed').fadeIn('fast');
  });
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

$('#talentbankIntro a').click(function(e) {
  e.preventDefault();
  popcorn.showBios(e);
});

$('#pressHero').click(function(e) {
  e.preventDefault();
  popcorn.showPress(e);
});

$('body').on('click', '.article_wrapper > .article_image', function(e) {
  e.preventDefault();
  popcorn.showArticle(e);
});

$('body').on('click', '.article_close', function(e) {
  e.preventDefault();
  popcorn.closeArticle();
});
