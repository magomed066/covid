// Custom Http Module
function customHttp() {
	return {
		get(url, cb) {
			try {
				const xhr = new XMLHttpRequest();
				xhr.open("GET", url);
				xhr.addEventListener("load", () => {
					if (Math.floor(xhr.status / 100) !== 2) {
						cb(`Error. Status code: ${xhr.status}`, xhr);
						return;
					}
					const response = JSON.parse(xhr.responseText);
					cb(null, response);
				});

				xhr.addEventListener("error", () => {
					cb(`Error. Status code: ${xhr.status}`, xhr);
				});

				xhr.send();
			} catch (error) {
				cb(error);
			}
		},
		post(url, body, headers, cb) {
			try {
				const xhr = new XMLHttpRequest();
				xhr.open("POST", url);
				xhr.addEventListener("load", () => {
					if (Math.floor(xhr.status / 100) !== 2) {
						cb(`Error. Status code: ${xhr.status}`, xhr);
						return;
					}
					const response = JSON.parse(xhr.responseText);
					cb(null, response);
				});

				xhr.addEventListener("error", () => {
					cb(`Error. Status code: ${xhr.status}`, xhr);
				});

				if (headers) {
					Object.entries(headers).forEach(([key, value]) => {
						xhr.setRequestHeader(key, value);
					});
				}

				xhr.send(JSON.stringify(body));
			} catch (error) {
				cb(error);
			}
		}
	};
}
// Init http module
const http = customHttp();

const newService = (function () {
	const apiUrl = 'https://covid19.mathdro.id/api';

	return {
		allWorld(cb) {
			http.get(`${apiUrl}`, cb);
		},
		aboutCountry(country, cb) {
			http.get(`${apiUrl}/countries/${country}`, cb);
		}
	};
})();
// UI Elems

const country = document.querySelector('.country');
const confirmed = document.querySelector('.confirmed');
const recovered = document.querySelector('.recovered');
const deaths = document.querySelector('.deaths');
const form = document.querySelector('.search');
const select = document.querySelector('#select');


form.addEventListener('change', (e) => {
	e.preventDefault();
	loadVirus();
})

document.addEventListener('DOMContentLoaded', () => {
	loadVirus();
})

function loadVirus() {

	let selectText = select.value;
	setTimeout(() => {
		country.textContent = `${selectText}`;
	}, 100);

	if (!selectText) {
		newService.allWorld(onGetResponse);
	} else if (selectText === 'Весь мир') {
		newService.allWorld(onGetResponse);
	} else {
		newService.aboutCountry(selectText, onGetResponse);
	}

}

function onGetResponse(err, res) {
	if (err) {
		console.log('Error');
		return;
	}

	setTimeout(() => {
		renderAllWworld(res);
	}, 100);
}

function renderVirus(countries) {
	const listContainer = document.querySelector('.list-container');

	let fragment = '';

	const td = virusTempate(countries);
	fragment += td;

	listContainer.insertAdjacentHTML('afterend', fragment);
}

function renderAllWworld(res) {
	confirmed.textContent = `${res.confirmed.value}`;
	recovered.textContent = `${res.recovered.value}`;
	deaths.textContent = `${res.deaths.value}`;
}

function virusTempate(res) {
	return `
		<tr class="text-right">
			<td class = "country text-left">
			</td> 
			<td class = "confirmed">
				${res.confirmed.value}
			</td> 
			<td class = "recovered" >
			${res.recovered.value}</td>
			<td class = "deaths" >
			${res.deaths.value}</td> 
		</tr>
	`;
}