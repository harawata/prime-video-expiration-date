
$(function(){
  if ($("#nav-subnav[data-category='instant-video']").length == 0) {
    // Not in Amazon Video category.
    return;
  }

  var cachedAsin;
  var cachedMsg;
  var tooltip = $("<div>")
    .addClass("expirationDate").appendTo(document.body);
  tooltip.showMsg = function(x, y, msg) {
    tooltip.empty().append(msg).css("top", y).css("left", x).show();
  };

  $(document).on({
    mouseenter: function(e) {
      var x = e.pageX - $(document).scrollLeft();
      var y = e.pageY - $(document).scrollTop();
      var asin = $(this).closest("div[data-asin]").attr("data-asin")
      if (asin == cachedAsin) {
        // Avoid spamming the server.
        tooltip.showMsg(x, y, cachedMsg);
        return;
      }
      $.get("https://www.amazon.co.jp/gp/video/hover/" + escape(asin), {
        format: "json",
        refTag: "dv-hover",
        requesterPageType: "Browse"
      }, function(data){
        // Trim tail junk in data.
        var json = data.replace(/[^\]]+$/, "");
        var res = JSON.parse(json);
        var doc = $(res[1]);
        var title = doc.find("h1");
        var expiration = doc.find("span.av-alert-inline-block--warning");
        var newMsg = $('<div>')
          .append(title)
          .append(expiration);
        tooltip.showMsg(x, y, newMsg);
        cachedMsg = newMsg;
        cachedAsin = asin;
      }, "text");
    },
    mouseleave: function() {
      tooltip.hide();
    }
  }, "div[data-asin] a img.s-image");
});
