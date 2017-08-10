getSavedArticles();

// Get comments
$("body").on("click", ".comment-button", function() {
  var id = $(this).attr("data-id");
  $(".modal-title").text("Comments for Article " + id);
  $("#comment-save").attr("data-id", id);
  $("#comment-text").empty();
  getComments(id);
  $("#comment-modal").modal("toggle");
});

// Save comment
$("#comment-save").on("click", function() {
  var name = $("#comment-name").val();
  var text = $("#comment-textarea").val();
  var id = $(this).attr("data-id");

  var validate = true;
  if (!name) {
    $("#name-validate").show();
    validate = false;
  }
  else if (name) {
    $("#name-validate").hide();
  }
  if (!text) {
    $("#comment-validate").show();
    validate = false;
  }
  else if (text) {
    $("#comment-validate").hide();
  }
  if (validate) {
    var comment = {
      author: name,
      message: text
    }
    $.post("/articles/comment/" + id, comment, function(data) {
      $("#comment-name").val("");
      $("#comment-textarea").val(""); 
    });
    getComments(id);
  }
});

// Delete comment
$("body").on("click", ".delete-comment", function() {
  var id = $(this).parent().attr("data-id");
  var articleId = $(this).closest("#comment-text").attr("data-id");
  $.ajax({
    url: "/articles/comment/" + id,
    type: "DELETE",
    data: {
      id: articleId
    }
  });
  getComments(articleId);
});

// Remove article from saved
$("body").on("click", ".save-button", function() {
  var id = $(this).attr("data-id")
  var saved = $(this).attr("value");
  var data = { saved: saved }
  $.post("/articles/saved/" + id, data, function(data) {
    getSavedArticles();
  });
});

// Get saved articles
function getSavedArticles() {
  $.get("/articles/saved", function(data) {
    $("#saved-articles").empty();
    if (data.length === 0) {
      var panelBody = $("<div>").addClass("panel-body");
      var newDiv = $("<div>").addClass("panel panel-default article-div");
      var summary = $("<h4>").addClass("summary text-center").text("There are no saved articles.");
      panelBody.append(summary);
      newDiv.append(panelBody);
      $("#saved-articles").append(newDiv);
    }
    else {
      data.forEach(function(val) {
        var heading = $("<h4>").addClass("heading panel-heading").text(val.heading);
        var link = $("<a>").attr("href", "http://m.mlb.com" + val.url).html(heading);
        var saveButton = $("<button>").addClass("btn btn-default save-button");
        saveButton.attr("type", "button").attr("data-id", val._id).attr("value", false).text("Remove");
        var commentButton = $("<button>").addClass("btn btn-default comment-button");
        commentButton.attr("type", "button").attr("data-id", val._id).text("Comment");
        var summary = $("<p>").addClass("summary").text(val.summary);
        var newDiv = $("<div>").addClass("panel panel-default article-div").attr("id", val._id);
        var panelHeading = $("<div>").addClass("panel-heading");
        var panelBody = $("<div>").addClass("panel-body");
        panelHeading.append(link);
        panelHeading.append(saveButton);
        panelHeading.append(commentButton);
        panelBody.append(summary);
        newDiv.append(panelHeading);
        newDiv.append(panelBody);
        $("#saved-articles").append(newDiv);
      });
    }
  });
}

// Get comments
function getComments(id) {
  $.get("/articles/" + id, function(data) {
    $("#comment-text").empty();
    if (data.comments.length === 0) {
      var li = $("<li>").addClass("list-group-item text-center").text("There are no comments for this article yet.");
      $("#comment-text").append(li);
    }
    else {
      data.comments.forEach(function(val) {
        $("#comment-text").attr("data-id", id);
        var li = $("<li>").addClass("list-group-item").attr("data-id", val._id);
        var html = "<p class='author'><strong>" + val.author + "</strong> <span id='date'>&nbsp;&nbsp;" + moment(val.createdAt).format("M/D/YYYY h:mma") + "</span></p>";
        var button = '<button type="button" class="close delete-comment" aria-label="Delete"><span aria-hidden="true">&times;</span></button>'
        var message = $("<p>").text(val.message);
        li.append(html);
        li.append(button);
        li.append(message);
        $("#comment-text").append(li);
      });
    }
  });
}