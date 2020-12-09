const request = new XMLHttpRequest();
const form_submit = document.getElementById('form-submit');
const input_search = document.getElementById('user-entry');
const getResult = document.getElementById('result');
let getStorageSearch = sessionStorage.getItem('search');
let page = 1;

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
    page = 1;
    sessionStorage.setItem('page', page);
    callAPI(userInput);
});

function callAPI(search) {
    const key = '17092181-9b5fa7e4d8fe6a823a3fac2ed';
    request.open('GET', 'https://pixabay.com/api/?key=' + key + '&q="' + search + '"&page=' + page + '&image_type="photo"');
    request.send();
    page++;
    sessionStorage.setItem('page', page);
}


// on button click
function createButton(){
    callAPI(sessionStorage.getItem('search'));
}

// scan API's response
request.onload = function () {
    var data = JSON.parse(this.responseText);
    const dataLength = data.hits.length;
    const alertMsg = document.createElement('p');
    if (this.readyState == XMLHttpRequest.DONE && this.status >= 200 && data.hits.length > 0) {
        for (let i = 0; i < dataLength; i++) {
            createTag(data.hits[i].webformatURL, data.hits[i].tags, data.hits[i].pageURL);
        }
        document.getElementById('loadMore').style.display = 'block';

    } else if (data.hits.length === 0) {
        alertMsg.innerText = 'Toutes les images sont affichées';
        getResult.appendChild(alertMsg);
        document.getElementById('loadMore').style.display = 'none';
    } else {
        alertMsg.innerText = 'Un problème est arrivé';
        getResult.appendChild(alertMsg);
        document.getElementById('loadMore').style.display = 'none';
    }
};


// Create tag
function createTag(img, descr, link) {
    const container = document.createElement('article');
    container.setAttribute('class', 'card');

    const descr_src = document.createElement('span');
    descr_src.innerHTML = descr;

    const img_src = document.createElement('img');
    img_src.src = img;
    img_src.setAttribute('loading', 'eager');
    img_src.setAttribute('alt', descr);

    const link_src = document.createElement('a');
    link_src.setAttribute('href', link);
    link_src.setAttribute('target', '_blank');

    getResult.appendChild(container);
    container.appendChild(img_src);
    container.appendChild(link_src);
    link_src.appendChild(descr_src);
    
}

// get content or previous content on load
(async () => {
    try {
        page = sessionStorage.getItem('page');    
    } catch (error) {
        console.log('no page item')
    }
    
    if (getResult.innerHTML === "") {
        callAPI(getStorageSearch);
        input_search.value = getStorageSearch;
    }

    else{
        getResult.innerHTML = "";
    }
})();
