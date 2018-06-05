 
 // GIPHY API key
 const API_KEY = "odMc1jufuWOhI5KTz3DPDDppqago4sts";
    
 // array of strings with interesting topics
 var topics = ["cat", "mouse", "bird", "ferret", "weasel", "bear"];

 // display gifs when already generated topic button is clicked
 function displayGifs() {
     // grab topic from data-topic property value from the button
     var topic = $(this).attr("data-topic");

     // construct a queryURL using the gif topic name
     var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
     topic + "&api_key=" + API_KEY + "&limit=10";

     // perform an AJAX request with the queryURL
     $.ajax({
         url: queryURL,
         method: "GET"
     }).then(function(response) {

         console.log(queryURL);
         console.log(response);

         // store data from request in results variable 
         var results = response.data;
         
         // loop through each result item
         for (var i = 0; i < results.length; i++) {
             // render each gif and supporting components in a materialize card
             renderCard(results[i]);
         }
     });
 }

 function renderCard(result) {

     // create and storing a div tag
     var topicResultDiv = $("<div>");
     
     // create and store an image tag with class gif and properties 
     // .. src, data-still and still link, data-animate and animated link, 
     // ..data-state starting at "still"
     var topicImage = $("<img>").attr("src", result.images.fixed_height.url);

     topicImage.addClass("gif")
         .attr("data-state", "still")
         .attr("data-still", result.images.fixed_height_still.url)
         .attr("src", topicImage.attr("data-still"))
         .attr("data-animate", result.images.fixed_height.url);

     // create a paragraph tag with the result item's rating
     var p = $("<p>").text("Rating: " + result.rating);
     p.addClass("rating");

     // create card in div
     topicResultDiv.html("<div class='col s12 m12 l6'><div class='card gif-card'><div class='card-image'>" + topicImage.prop('outerHTML') + "</div><div class='card-content'>" + p.prop('outerHTML') + "</div><div class='card-action'><a href=" + result.images.fixed_height.url + ">Source</a></div></div></div>");

     // prepending the topicResultDiv to the HTML page in the "gifs-appear-here" div
     $("#gifs-appear-here").prepend(topicResultDiv);
     
 }

 function toggleGif() {

     // get data-state attribute value 
     var state = $(this).attr("data-state");

     // If the clicked image's state is still, update its src attribute to what its data-animate value is.
     // then, set the image's data-state to animate, else set src to the data-still value
     if (state === "still") {
         $(this).attr("src", $(this).attr("data-animate"));
         $(this).attr("data-state", "animate");
     } else {
         $(this).attr("src", $(this).attr("data-still"));
         $(this).attr("data-state", "still");
     }
 }

 // Function for displaying gif topic button
 function renderButtons() {

     // Delete the gif topic buttons before adding new ones 
     // (necessary otherwise we will have repeat buttons)
     $("#buttons-view").empty();

     // Loop through the array of topics
     for (var i = 0; i < topics.length; i++) {
         
         // dynamically generate buttons for each movie in the array
         var topicBtn = $("<button>");
         // add a class to our button
         topicBtn.addClass("gif-topic waves-effect waves-light btn-large");
         // add data-attribute
         topicBtn.attr("data-topic", topics[i]);    
         // provide the initial button text
         topicBtn.text(topics[i]);
         // add the button to the html
         $("#buttons-view").append(topicBtn);
     }
 }

 // function handles events to add button
 $("#add-topic").on("click", function(event) {
     // Prevent the button default behavior when clicked (which is submitting a form)
     event.preventDefault();

     // grab input from the textbox
     var topic = $("#topic-input").val().trim();

     // check if empty and already exist
     if (topic == "") {
        
        alert("Please enter a topic into the text box");
     } else if (topics.indexOf(topic) != -1) {
        // remove text from input
        $("#topic-input").val('');
        
        alert("Topic already exists. Please enter a new topic")
     } else {
        // remove text from input after topic retrieved
        $("#topic-input").val('');

        // add the topic from the textbox to our array
        topics.push(topic);

        // call renderButton which adds buttons for each topic
        renderButtons();
     }
 });

 // function triggered when dynamically added button is clicked
 // adding the event listener to the document because it will work for dynamically gernerated elements
 $(document).on("click", ".gif-topic", displayGifs);

 // function triggered when image clicked, toggles still and animated image on gif click
 $(document).on("click", ".gif", toggleGif);

 // Call the renderButton function to display the intial buttons
 renderButtons();