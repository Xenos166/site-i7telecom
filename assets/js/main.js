$(function () {
  "use strict";

  //===== Prealoder

  $(window).on("load", function (event) {
    $(".preloader").delay(100).fadeOut(100);
  });

  //===== Sticky

  $(window).on("scroll", function (event) {
    var scroll = $(window).scrollTop();
    if (scroll < 20) {
      $(".header_navbar").removeClass("sticky");
      $(".header_navbar img").attr("src", "assets/images/logo.png");
    } else {
      $(".header_navbar").addClass("sticky");
      $(".header_navbar img").attr("src", "assets/images/logo.png");
    }
  });

  //===== Section Menu Active

  var scrollLink = $(".page-scroll");
  // Active link switching
  $(window).scroll(function () {
    var scrollbarLocation = $(this).scrollTop();

    scrollLink.each(function () {
      var sectionOffset = $(this.hash).offset().top - 73;

      if (sectionOffset <= scrollbarLocation) {
        $(this).parent().addClass("active");
        $(this).parent().siblings().removeClass("active");
      }
    });
  });

  //===== close navbar-collapse when a  clicked

  $(".navbar-nav a").on("click", function () {
    $(".navbar-collapse").removeClass("show");
  });

  $(".navbar-toggler").on("click", function () {
    $(this).toggleClass("active");
  });

  $(".navbar-nav a").on("click", function () {
    $(".navbar-toggler").removeClass("active");
  });

  //===== Back to top

  // Show or hide the sticky footer button
  $(window).on("scroll", function (event) {
    if ($(this).scrollTop() > 600) {
      $(".back-to-top").fadeIn(200);
    } else {
      $(".back-to-top").fadeOut(200);
    }
  });

  //Animate the scroll to yop
  $(".back-to-top").on("click", function (event) {
    event.preventDefault();

    $("html, body").animate(
      {
        scrollTop: 0,
      },
      1500,
    );
  });

  //===== Counter animation

  function animateCounter() {
    $('.features_title').each(function() {
      var $this = $(this);
      var target = $this.data('target');
      if (target && !$this.hasClass('animated')) {
        $this.addClass('animated');
        var count = 0;
        var increment = target / 100;
        var timer = setInterval(function() {
          count += increment;
          if (count >= target) {
            count = target;
            clearInterval(timer);
          }
          if (target % 1 !== 0) {
            $this.text(count.toFixed(1) + '%');
          } else {
            $this.text(Math.floor(count) + '+');
          }
        }, 30);
      }
    });

    $('.pricing_title').each(function() {
      var $this = $(this);
      var target = $this.data('target');
      if (target && !$this.hasClass('animated')) {
        $this.addClass('animated');
        var count = 0;
        var increment = target / 100;
        var timer = setInterval(function() {
          count += increment;
          if (count >= target) {
            count = target;
            clearInterval(timer);
          }
          $this.text(Math.floor(count) + ' Mbps');
        }, 30);
      }
    });

    $('.price').each(function() {
      var $this = $(this);
      var target = $this.data('target');
      if (target && !$this.hasClass('animated')) {
        $this.addClass('animated');
        var count = 0;
        var increment = target / 100;
        var timer = setInterval(function() {
          count += increment;
          if (count >= target) {
            count = target;
            clearInterval(timer);
          }
          $this.text('R$ ' + count.toFixed(2).replace('.', ',') + '/mês');
        }, 30);
      }
    });
  }

  // Trigger counter when section is in view
  $(window).on('scroll', function() {
    var scrollTop = $(window).scrollTop();
    var windowHeight = $(window).height();

    // For features
    var elementOffset = $('.single_features').offset();
    if (elementOffset) {
      var distance = (elementOffset.top - scrollTop);
      if (distance < windowHeight - 100) {
        animateCounter();
      }
    }

    // For pricing
    var pricingOffset = $('.single_pricing').offset();
    if (pricingOffset) {
      var pricingDistance = (pricingOffset.top - scrollTop);
      if (pricingDistance < windowHeight - 100) {
        animateCounter();
      }
    }

    // Re-animate WOW elements when they come back into view
    $('.wow').each(function() {
      var $this = $(this);
      var elementTop = $this.offset().top;
      var elementBottom = elementTop + $this.outerHeight();
      var windowBottom = scrollTop + windowHeight;

      if (elementBottom < scrollTop || elementTop > windowBottom) {
        // Element is out of view, remove animated class to allow re-animation
        $this.removeClass('animated');
      }
    });
  });

  //=====
});
