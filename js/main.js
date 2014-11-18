// scripts

var popcorn = popcorn || {};

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
popcorn.debounce = function (func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

popcorn.scrollHint = function() {
  var heights = {
    doc: {
      height: $(document).height()
    },
    window: {
      height: $(window).height(),
      scroll: $(window).scrollTop()
    }
  }

  if (heights.doc.height > heights.window.height) {
    if (heights.window.scroll == 0) {
      $('.scroll_hint.down').fadeIn('fast');
    } else if ( (heights.window.scroll + heights.window.height) == heights.doc.height ) {
      $('.scroll_hint.up').fadeIn('fast');
    } else {
      $('.scroll_hint').fadeIn('fast');
    }
  }
};

popcorn.toggleMenu = function() {
  var self = this,
    $menu = $('#mainNav'),
    $content = $('#mainContent'),
    $heading = $('#mainHeading');

  if ($menu.is(':hidden')) {
    // set variable to heading text in case they click again
    self.oldHeading = $heading.text();

    $content.fadeOut('fast', function() {
      $('.scroll_hint').hide();
      $heading.text('MENU');
      $menu.fadeIn('fast').removeClass('hidden');
    });
  } else {
    $menu.fadeOut('fast', function() {
      $content.fadeIn('fast');
      $heading.text(self.oldHeading);
    });
  }
};

popcorn.enterHome = function() {
  var self = this;
  $('#homeIntro').fadeOut('slow', function() {
    $('#mainContent').removeClass('home_intro');
    $('#carousel').fadeIn('fast', function() {
      self.scrollHint();
    }).removeClass('hidden');
  });
};

popcorn.toggleAccordion = function(e) {
  var $target = $(e.currentTarget),
  $description = $target.next('.method_description');

  if ($description.is(':hidden')) {
    $description.slideDown('fast', 'linear');
  } else {
    $description.slideUp('fast', 'linear');
  }
};

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
};

popcorn.showPress = function() {
  var self = this;
  $('#pressHero').fadeOut('fast', function() {
    $('#pressMedia').fadeIn('fast');
  });
};

popcorn.createArticles = function(xml) {
  var self = this;
  self.xml = xml;
  $(xml).find('item').each(function(i) {
    var markup = {
      title: $(this).children().eq(0).text(),
      image: $(this).children().eq(7).attr('url'),
      date: $(this).find('pubDate').text(),
      description: $(this).find('description').text()
    };
    markup.dateArray = markup.date.split(' ');
    markup.id = Date.parse(markup.date);

    var slide = '<div id="' + markup.id + '" class="article_wrapper">' +
    '<a href="#" class="article_image" style="background-image:url(' + markup.image + ');" data-article="' + i + '"></a>' +
    '<h2 class="article_title">' + markup.title + '</h2>' +
    '<h3 class="article_date">' + markup.dateArray[2] + ' ' + markup.dateArray[1] + ', ' + markup.dateArray[3] + '</h3>' +
    '<p class="article_description">' + markup.description + '</p>' +
    '</div>';

    $('#cultureArticleFeed').append(slide);
  });

  // send page to the chosen hash after articles are created
  var selectedArticle = window.location.hash;
  if (selectedArticle) {
    // show selected
    var toScroll = $(selectedArticle).offset().top;
    $('html, body').animate({
      scrollTop: toScroll - 40
    }, 300);
  }

  self.scrollHint();
};

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

  var articleMarkup = '<a href="#" class="article_close">&times;</a>' +
  '<div class="article_image"><img src="' + image + '"></div>' +
  '<div class="article_social">' +
  '<a target="_blank" href="http://www.facebook.com/sharer/sharer.php?u=' + link + '" class="facebook"></a>' +
  '<a target="_blank" href="http://twitter.com/home?status=' + uriTitle + '%20' + link + '" class="twitter"></a>' +
  '</div>' +
  '<h2 class="article_title">' + title + '</h2>' +
  '<div class="article_content">' + content + '</div>';

  $('#cultureArticleWrapper').html(articleMarkup);

  $('#cultureArticleFeed').fadeOut('fast', function() {
    $('#cultureArticleWrapper').fadeIn('fast');
    $('html, body').animate({
      scrollTop: 0
    }, 300);
  });
};

popcorn.closeArticle = function() {
  $('#cultureArticleWrapper').fadeOut('fast', function() {
    $('#cultureArticleFeed').fadeIn('fast');
  });
};

// event bindings
$('#toggleMenu').click(function(e) {
  e.preventDefault();
  popcorn.toggleMenu(e);
});

$('#enterHome').click(function(e) {
  e.preventDefault();
  popcorn.enterHome(e);
});

$('#consultingAccordion .slide > a, .accordion_toggle').click(function(e) {
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

$(window).scroll(popcorn.debounce(popcorn.scrollHint, 500));

$(window).scroll(popcorn.debounce(function() {
  $('.scroll_hint').hide();
}, 500, true));

$(document).ready(function() {
  $('.scroll_hint').hide();
  popcorn.scrollHint();
});
