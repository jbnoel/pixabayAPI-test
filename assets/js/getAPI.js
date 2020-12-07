const request = new XMLHttpRequest();
const form_submit = document.getElementById('form-submit');
const input_search = document.getElementById('user-entry');
const getResult = document.getElementById('result');
const getStorage = sessionStorage.getItem('search');

input_search.addEventListener('change', function () {
    let content_search = input_search.value;
    if (content_search == '') {
        form_submit.setAttribute('disabled', 'true');
    }
    else {
        form_submit.removeAttribute('disabled');
    }
})


// clean resultList, storage & call API
form_submit.addEventListener('click', function (e) {
    e.preventDefault();
    getResult.innerHTML = "";
    const userInput = input_search.value;
    sessionStorage.setItem('search', userInput);
    callAPI(userInput);
});

function callAPI(search) {
    const key = '17092181-9b5fa7e4d8fe6a823a3fac2ed';
    request.open('GET', 'https://pixabay.com/api/?key=' + key + '&q="' + search + '"');
    request.send();
}

// scan API's response
request.onload = function () {
    var data = JSON.parse(this.responseText);
    const dataLength = data.hits.length;
    if (this.readyState == XMLHttpRequest.DONE && data.total > 0) {
        for (let i = 0; i < dataLength; i++) {
            createTag(data.hits[i].webformatURL, data.hits[i].tags, data.hits[i].pageURL);
        }
    } else if (data.total === 0) {
        getResult.innerText = data.total + " image";
    } else {
        getResult.innerText = "error";
    }
};

// Create tag
function createTag(img, descr, link) {
    const container = document.createElement('article');
    container.setAttribute('class', 'card')

    const img_src = document.createElement('img');
    img_src.src = img;

    const descr_src = document.createElement('p');
    descr_src.innerHTML = descr;

    const link_src = document.createElement('a');
    link_src.setAttribute('href', link);
    link_src.innerText = 'lien';

    getResult.appendChild(container);
    container.appendChild(img_src);
    container.appendChild(descr_src);
    descr_src.appendChild(link_src);
}

// Set input value to previous search
(async () => {
    if (getResult.innerHTML === "") {
        callAPI(getStorage);
        input_search.value = getStorage;
    }
})();