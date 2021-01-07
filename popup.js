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
    if (!resultsContainer.textContent) { 
      resultsContainer.textContent = 'No results were found. Go to the Assignments tab or the Quizzes tab to retrieve deadlines';
    }
  }, 3000);
}

// listening for messages from the scraper.js file
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
  for(index=0; index<response[2]; index++){
    console.log(response[0][index] + " is due on " + response[1][index]);
    var textNode = document.createTextNode(response[0][index] + " is due on " + response[1][index]);
    resultsContainer.appendChild(textNode);
    resultsContainer.appendChild(document.createElement("BR"));

    // things to check for
    // - Missing due date
    // - Missing assignment title

    // things to add
    // - Class title or abbreviation

    // for the future...
    // input value for title - required
    // input value for notes
    // date picker - required 
    // time picker
  }
});