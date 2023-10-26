const endpointUrl = 'http://localhost:8000/scrape';

const urlInput = document.getElementById("url-input");
const resultElement = document.getElementById("result");
const search = document.getElementById("search");

search.addEventListener('click', () => {
 const inputValue = urlInput.value;
 resultElement.textContent = '';

 scrap(inputValue);
}, { capture: true });

function scrap(url){
 const encodedUrl = encodeURIComponent(url);
 const fullApiUrl = `${endpointUrl}?url=${encodedUrl}`;

 fetch(fullApiUrl, { method: 'GET'})
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  })
  .then((data) => {
   const prettyPrinted = JSON.stringify(data, null, 2);
    resultElement.textContent = prettyPrinted;
  })
  .catch((error) => {
    resultElement.textContent = error.message;
  });
}