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