// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<div class='col s12 m6 l6'><div class='card'>" +
      "<div class='card-content'>" + 
      "<h5 data-id='" + data[i]._id + "'>" + data[i].title + "</h3></div>" + 
      "<div class='card-action'><a href='" + data[i].link + "'>Visit!</a><a class='comment' data-id='" + data[i]._id + "'>Comment</a>" +
      "</div></div></div>");

  }
});


// Whenever someone clicks a p tag
$(document).on("click", ".comment", function() {
  // Empty the comment from the note section
  $("#comment").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#comment").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#comment").append("<input id='titleinput' name='title' >");
      // A textarea to add a new comment body
      $("#comment").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new comment, with the id of the article saved to it
      $("#comment").append("<button data-id='" + data._id + "' id='savecomment'>Save comment</button>");

      // If there's a comment in the article
      if (data.comment) {
        // Place the title of the comment in the title input
        $("#titleinput").val(data.comment[0].title);
        // Place the body of the comment in the body textarea
        $("#bodyinput").val(data.comment[0].body);
      }
    });
});

// When you click the savecomment button
$(document).on("click", "#savecomment", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the comment, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from comment textarea
      body: $("#bodyinput").val() 
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the comments section
      $("#comment").empty();
    });

  // Also, remove the values entered in the input and textarea for comment entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
