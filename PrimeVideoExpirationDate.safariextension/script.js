
$(function(){
  if ($("#nav-subnav[data-category='instant-video']").length == 0) {
    // Not in Amazon Video category.
    return;
  }

  var cachedAsin;
  var cachedMsg;
  var tooltip = $("<div>")
    .addClass("expirationDate").appendTo(document.body);

  $(document).on({
    mouseenter: function(e) {
      var x = e.pageX - $(document).scrollLeft();
      var y = e.pageY - $(document).scrollTop();
      // Maybe faster than looking for .parents("li[data-asin]") ?
      var asin = $(this).parent().attr("href").replace(/^.*\/dp\/(.*)\/.*$/g, "$1");
      if (asin == cachedAsin) {
        // Avoid spamming the server.
        tooltip.html(cachedMsg).css("top", y).css("left", x).show();
        return;
      }
      $.getJSON("https://www.amazon.co.jp/gp/video/beard", {
        "ASIN": asin,
        "json": 1
      }, function(data){
        var newMsg = "";
        if(data.orangeBar) {
          newMsg = data.title + data.orangeBar;
          tooltip.html(newMsg).css("top", y).css("left", x).show();
        }
        cachedMsg = newMsg;
        cachedAsin = asin;
      });
    },
    mouseleave: function() {
      tooltip.hide();
    }
  }, "a > img[alt='商品の詳細']");
});
