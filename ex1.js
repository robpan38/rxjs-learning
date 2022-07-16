import { ajax } from 'rxjs/ajax';

const { fromEvent, async, debounceTime, map, distinctUntilChanged, tap, switchMap, catchError, of, filter } = require("rxjs");

let element = document.querySelector(".search-container input");
const url = `https://restcountries.com/v3.1/name/`;

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

let obs = fromEvent(element, "input")
    .pipe(
        debounceTime(500),
        map(event => event.target.value),
        distinctUntilChanged(),
        tap(clearPreviousResults),
        filter(query => query !== ""),
        switchMap(query => {
            return ajax.getJSON(`${url}${query}`)
        }),
        catchError((err, caught) => {
            if (err) {
                createCountryCard({
                    eroare: "nu s-a gasit resursa cautata"
                })
            }
            return caught;
        })
    )
    .subscribe({
        next: (jsonArray) => {
            jsonArray.forEach(json => {
                createCountryCard(json);
            })
        }
    })