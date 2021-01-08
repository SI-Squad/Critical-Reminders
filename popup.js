let scrapeButton = document.getElementById('scrape-button');
let resultsContainer = document.getElementById('results');

scrapeButton.onclick = function(element) {
  resultsContainer.textContent = ''; // reset in case of multiple requests
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {file: 'scraper.js'});
  });

  let spinner = document.getElementById('spinner');
  spinner.style.display = 'block';

  // If no results are retrieved in 3 seconds, display message
  setTimeout(function(){ 
    spinner.style.display = 'none';
    if (!resultsContainer.hasChildNodes) { 
      resultsContainer.hasChildNodes = 'No results were found. Go to the Assignments tab or the Quizzes tab to retrieve deadlines';
    }
  }, 3000);
}

// listening for messages from the scraper.js file
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
  for(index=0; index<response[2]; index++){
    console.log(response[0][index] + " is due on " + response[1][index]);
    // var textNode = document.createTextNode(response[0][index] + " is due on " + response[1][index]);
    // resultsContainer.appendChild(textNode);
    // resultsContainer.appendChild(document.createElement("BR"));


    var form = document.createElement("FORM");

    var title = document.createElement("INPUT");
    title.setAttribute("type", "text");
    title.setAttribute("placeholder", "Title");
    title.required;
    title.setAttribute("value", response[0][index]);

    var description = document.createElement("INPUT");
    description.setAttribute("type", "text");
    description.setAttribute("placeholder", "Description");

    var datePicker = document.createElement("INPUT");
    datePicker.setAttribute("type", "date");
    datePicker.required;

    var timePicker = document.createElement("INPUT");
    timePicker.setAttribute("type", "time");

    var submitToCalendar = document.createElement("INPUT");
    submitToCalendar.setAttribute("type", "submit");
    submitToCalendar.setAttribute("value", "Ship to Calendar ->");

    form.appendChild(document.createElement("HR"));
    form.appendChild(title);
    form.appendChild(description);
    form.appendChild(datePicker);
    form.appendChild(timePicker);
    form.appendChild(submitToCalendar);

    resultsContainer.appendChild(form);


  }
});