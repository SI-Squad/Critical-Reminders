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

    // make form
    let form = document.createElement("FORM");
    function handleForm(event) { event.preventDefault(); }
    form.addEventListener("submit", handleForm);

    // create title input
    let title = document.createElement("INPUT");
    title.setAttribute("type", "text");
    title.setAttribute("placeholder", "Title");
    title.required = true;
    title.setAttribute("class", "form-control");
    title.setAttribute("value", response[0][index]);

    // create description input
    let description = document.createElement("INPUT");
    description.setAttribute("type", "text");
    description.setAttribute("placeholder", "Description");
    description.setAttribute("class", "form-control");

    // create date picker input
    let datePicker = document.createElement("INPUT");
    datePicker.setAttribute("type", "date");
    if(response[1][index].length > 6){
      let tempDateArray = response[1][index].split(" ");
      let tempDate = tempDateArray[0] + " " + tempDateArray[1] + " " + tempDateArray[2];
      let longDate = new Date(tempDate);
      let isoDate = longDate.toISOString().substr(0, 10);
      datePicker.setAttribute("value", isoDate);
    }
    datePicker.setAttribute("class", "form-control");
    datePicker.required = true;

    // create time picker input
    let timePicker = document.createElement("INPUT");
    timePicker.setAttribute("class", "form-control");
    timePicker.setAttribute("type", "time");

    // create submit button input w/ function to add event to calendar
    let submitToCalendar = document.createElement("INPUT");
    submitToCalendar.setAttribute("type", "submit");
    submitToCalendar.setAttribute("class", "btn btn-primary mb-2");
    submitToCalendar.setAttribute("value", "Add to Google Calendar");
    submitToCalendar.onclick = (function(element) { // here is where we'd add the functionality to send the event to the calendar
      console.log("--- EVENT START ---");
      console.log("Title: " + title.value);
      console.log("Description: " + description.value);
      console.log("Date: " + datePicker.value);
      console.log("Time: " + timePicker.value);
      form.classList.add('horizontalTranslationForm');
      setTimeout(function(){ form.remove(); }, 1500);
    });


    // attach the inputs to the form
    form.appendChild(document.createElement("HR"));
    form.appendChild(title);
    form.appendChild(description);
    form.appendChild(datePicker);
    form.appendChild(timePicker);
    form.appendChild(document.createElement("BR"));
    form.appendChild(submitToCalendar);

    // attach the form to the container
    resultsContainer.appendChild(form);
  }
});