getArticles();

// Scrape new articles
$("#scrape").on("click", function() {
  $.get("/scrape", function(data) {
    $("#scrape-text").text("Added new articles.");
    $("#scrape-modal").modal("toggle");
  });
});

// Reload after modal close
$(".modal").on('hidden.bs.modal', function () {
  location.reload();
});

// Save articles
$("body").on("click", ".save-button", function() {
  var id = $(this).attr("data-id")
  var saved = $(this).attr("value");
  var data = { saved: saved }
  $.post("/articles/saved/" + id, data, function(data) {
    getArticles();
  });
});

// Get articles
function getArticles() {
  $.get("/articles", function(data) {
    $("#all-articles").empty();
    if (data.length === 0) {
      var panelBody = $("<div>").addClass("panel-body");
      var newDiv = $("<div>").addClass("panel panel-default article-div");
      var summary = $("<h4>").addClass("summary text-center").text("There are no more articles to save.");
      panelBody.append(summary);
      newDiv.append(panelBody);
      $("#all-articles").append(newDiv);
    }
    else {
      data.forEach(function(val) {
        var heading = $("<h4>").addClass("heading panel-heading").text(val.heading);
        var link = $("<a>").attr("href", "http://m.mlb.com" + val.url).html(heading);
        var saveButton = $("<button>").addClass("btn btn-default save-button");
        saveButton.attr("type", "button").attr("data-id", val._id).attr("value", true).html('<i class="fa fa-bookmark-o" aria-hidden="true"></i> Save');
        var summary = $("<p>").addClass("summary").text(val.summary);
        var newDiv = $("<div>").addClass("panel panel-default article-div").attr("id", val._id);
        var panelHeading = $("<div>").addClass("panel-heading");
        var panelBody = $("<div>").addClass("panel-body");
        panelHeading.append(link);
        panelHeading.append(saveButton);
        panelBody.append(summary);
        newDiv.append(panelHeading);
        newDiv.append(panelBody);
        $("#all-articles").append(newDiv);
      });
    }
  });
}