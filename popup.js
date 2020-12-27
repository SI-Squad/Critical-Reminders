// let changeColor = document.getElementById('changeColor');

// chrome.storage.sync.get('color', function(data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute('value', data.color);
// });

// changeColor.onclick = function(element) {
//     let color = element.target.value;
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         chrome.tabs.executeScript(
//             tabs[0].id,
//             {code: 'document.body.style.backgroundColor = "' + color + '";'});
//     });
//   };

let scrapeButton = document.getElementById('scrape-button');

scrapeButton.onclick = function(element) {
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
    let resultsContainer = document.getElementById('results');
    resultsContainer.textContent = 'No results were found. Go to the Assignments tab or the Quizzes tab to retrieve deadlines';
  }, 3000);
}