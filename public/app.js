// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<div class='col s12 m6 l6'><div class='card'>" +
      "<div class='card-content'>" + 
      "<h5 data-id='" + data[i]._id + "'>" + data[i].title + "</h3></div>" + 
      "<div class='card-action'><a class='green-text text-darken-3' href='" + data[i].link + "'>Visit!</a><a class='comment green-text text-darken-3' data-id='" + data[i]._id + "'>Comment</a>" +
      "</div></div></div>");

  }
});


// Whenever someone clicks a comment
$(document).on("click", ".comment", function() {
  // Empty the comment from the note section
  $("#comment").empty();
  // Save the id from the comment
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
      $("#comment").append("<input id='titleinput' placeholder='Title' name='title' >");
      // A textarea to add a new comment body
      $("#comment").append("<textarea id='bodyinput' placeholder='Comment' name='body'></textarea>");
      // A button to submit a new comment, with the id of the article saved to it
      $("#comment").append("<button class='waves-effect waves-light btn green lighten-1' data-id='" + data._id + "' id='savecomment'>Save comment</button>");

      // If there's a comment in the article
      if (data.comment) {
        for (let item of data.comment) {
          console.log(item.title);
          console.log(item.body)
          let commentAll = $("<div class='card green darken-3'>");
          let commentCard = $("<div class='card-content white-text'>")
          commentCard.html(`<a class='right btn-floating btn-large waves-effect waves-light red'><i class='material-icons'>clear</i></a><span class='card-title'>Title: ${item.title}</span><p>Comment: ${item.body}<p>`);
          commentAll.append(commentCard);
          $("#comment").append(commentAll);
        }
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

      $.ajax({
        method: "GET",
        url: "/articles/" + thisId
      }).then(function(commentData) {
        if (commentData.comment) {
            console.log(commentData.comment[commentData.comment.length - 1].title);
            console.log(commentData.comment[commentData.comment.length - 1].body)
            let commentAll = $("<div class='card blue-grey darken-1'>");
            let commentCard = $("<div class='card-content white-text'>")
            commentCard.html(`<span class='card-title'>Title: ${commentData.comment[commentData.comment.length - 1].title}</span><p>Comment: ${commentData.comment[commentData.comment.length - 1].body}<p>`);
            commentAll.append(commentCard);
            $("#comment").append(commentAll);
        }
      })
    });

  // Also, remove the values entered in the input and textarea for comment entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
