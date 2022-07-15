const { fromEvent, async, debounceTime } = require("rxjs");

let element = document.querySelector(".search-container input");
let currentQueryState = "";

function createCountryCard(countryJson) {
    let results = document.querySelector('.results');
    
    if (countryJson.eroare === "nu s-a gasit resursa cautata") {
        let errorMsg = document.createElement('p');
        errorMsg.innerText = "nu s-a gasit resursa cautata";
        results.append(errorMsg);
        return;
    }

    let container = document.createElement('div');
    container.classList.add('countryContainer');
    let paragraph = document.createElement('p');
    let img = document.createElement('img');

    img.src = countryJson.flags.png;
    paragraph.innerText = JSON.stringify(countryJson.name.common);
    
    container.append(img);
    container.append(paragraph);

    results.append(container);
}

function clearPreviousResults() {
    let results = document.querySelector(".results");
    results.innerHTML = "";
}

let observer = {
    next: async event => {
        let query = event.target.value;
        
        const url = `https://restcountries.com/v3.1/name/${query}`;

        if (query !== currentQueryState) {
            clearPreviousResults();

            currentQueryState = query;

            if (currentQueryState === "") {
                return;
            }

            let queryResult = await fetch(url);
            let queryResultJson = await queryResult.json();
            console.log(queryResultJson);
            if (queryResultJson.message !== "Page Not Found" && queryResultJson.message !== "Not Found") {
                queryResultJson.forEach(country => {
                    createCountryCard(country);
                })
            } else {
                createCountryCard({
                    eroare: "nu s-a gasit resursa cautata"
                })
            }
        }
    }
}

let obs = fromEvent(element, "input")
    .pipe(debounceTime(500))
    .subscribe(observer)