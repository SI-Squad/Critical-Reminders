let scrapeButton = document.getElementById('scrape-button');
let signInButton = document.getElementById('sign_in_button');
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
    console.log(resultsContainer);
    if (!resultsContainer.hasChildNodes()) { 
      resultsContainer.innerHTML = 'No results were found. Go to the Assignments tab or the Quizzes tab to retrieve deadlines';
    }
  }, 3000);
}

// listening for messages from the scraper.js file
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
  if (response[2]) { // If there are any results
    spinner.style.display = 'none';
    const downloadButton = document.getElementById("download-button");
    for(index=0; index<response[2]; index++){
      // make form
      let form = document.createElement("FORM");
      function handleForm(event) { event.preventDefault(); }
      form.addEventListener("submit", handleForm);

      // create title input
      let title = document.createElement("INPUT");
      title.setAttribute("id", "title-" + index.toString());
      title.setAttribute("type", "text");
      title.setAttribute("placeholder", "Title");
      title.required = true;
      title.setAttribute("class", "form-control");
      title.setAttribute("value", response[0][index]);

      // create description input
      let description = document.createElement("INPUT");
      description.setAttribute("id", "description-" + index.toString())
      description.setAttribute("type", "text");
      description.setAttribute("placeholder", "Description");
      description.setAttribute("class", "form-control");

      // create date picker input
      let datePicker = document.createElement("INPUT");
      datePicker.setAttribute("id", "date-" + index.toString())
      datePicker.setAttribute("type", "date");
      if(response[1][index].length > 6){
        let tempDateArray = response[1][index].split(" ");
        let tempDate = tempDateArray[0] + " " + tempDateArray[1] + " " + tempDateArray[2];
        try {
          let longDate = new Date(tempDate);
          let isoDate = longDate.toISOString().substr(0, 10);
          datePicker.setAttribute("value", isoDate);
        } catch (error) {
          const errorsElement = document.getElementById("errors");
          errorsElement.innerHTML = "Couldn't find the due date of some items. Please input them manually"
        }
      }
      datePicker.setAttribute("class", "form-control");
      datePicker.required = true;

      // create time picker input
      let timePicker = document.createElement("INPUT");
      timePicker.setAttribute("id", "time-" + index.toString());
      timePicker.setAttribute("class", "form-control");
      timePicker.setAttribute("type", "time");


      // create submit button input w/ function to add event to calendar
      let submitToCalendar = document.createElement("INPUT");
      submitToCalendar.setAttribute("data-index", index);
      submitToCalendar.setAttribute("type", "submit");
      submitToCalendar.setAttribute("class", "btn btn-success mb-2");
      submitToCalendar.setAttribute("value", "Add this Event");
      submitToCalendar.onclick = (function(e) { // here is where we'd add the functionality to send the event to the calendar
        let dateFormat = datePicker.value.split("-");
        dateFormat = dateFormat[1]+"/"+dateFormat[2]+"/"+dateFormat[0];
        calendar.addEvent(title.value, description.value, "", dateFormat, dateFormat);
        console.log("--- EVENT START ---");
        console.log("Title: " + title.value);
        console.log("Description: " + description.value);
        console.log("Date: " + datePicker.value);
        console.log("Time: " + timePicker.value);
        const titleElement = document.getElementById("title-" + e.toElement.dataset.index.toString());
        const dateElement = document.getElementById("date-" + e.toElement.dataset.index.toString())
        if (titleElement.value && dateElement.value) {
          form.classList.add('horizontalTranslationForm');
          setTimeout(function(){ form.remove(); }, 1000);

          // enable download button if needed
          if (!downloadButton.style.display) {
            downloadButton.style.display = "block";
          }
        }
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
  }
});
