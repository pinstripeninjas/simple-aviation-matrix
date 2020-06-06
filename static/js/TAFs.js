// URL locations
const proxyUrl = "https://cors-anywhere.herokuapp.com/";
const targetUrl = "https://www.aviationweather.gov/cgi-bin/json/TafJSON.php?bbox=-112,31,-109,33";
const discussionUrl = "https://api.weather.gov/products/types/AFD/locations/TWC";

const allTAFs = document.querySelector("#TAFs");
const discussion = document.querySelector("#discussion");
const loader = document.querySelector(".loader");
const changeGroup = ["BECMG", "TEMPO", "FM", "PROB"];

getTAFs();
getDiscussion();

function hideLoader() {
	loader.classList.add("display-none");
}

function getTAFs() {
	fetch(proxyUrl + targetUrl)
		.then((res) => res.json())
		.then((data) => {
			outputTAFs(data.features);
			hideLoader();
		})
		.catch((e) => {
			console.log(e);
		});
}

function outputTAFs(data) {
	data.map((site) => {
		if (site.properties.id !== "KDMA") {
			const cardTAF = document.createElement("div");
			cardTAF.classList.add("cardTAF");
			const header = document.createElement("h2");
			const adjustedTAF = adjustAlignment(site.properties.rawTAF);
			header.innerText = site.properties.site;
			cardTAF.append(header);
			for (let i = 0; i < adjustedTAF.length; i++) {
				const body = document.createElement("p");
				body.innerText = adjustedTAF[i].join(" ");
				if (i > 0) {
					body.classList.add("indent");
				}
				cardTAF.append(body);
			}
			allTAFs.append(cardTAF);
		}
	});
}

function adjustAlignment(rawTAF) {
	const splitArray = rawTAF.split(" ");
	const finalArray = [];
	let sliceIndex = 0;
	// loop through array and check if contains changeGroup keywords
	for (let i = 0; i < splitArray.length; i++) {
		// loop through changeGroup to see if this index includes a keyword
		for (let change of changeGroup) {
			const check = splitArray[i].includes(change);
			if (check) {
				const tempArray = splitArray.slice(sliceIndex, i);
				finalArray.push(tempArray);
				sliceIndex = i;
			}
		}
	}
	// Since no more changeGroup, must add final TAF line
	finalArray.push(splitArray.slice(sliceIndex, splitArray.length));
	return finalArray;
}

async function getDiscussion() {
	const res = await fetch(discussionUrl);
	const data = await res.json();
	const res2 = await fetch(data["@graph"][0]["@id"]);
	const data2 = await res2.json();
	const header = document.createElement("h2");
	const body = document.createElement("p");
	header.innerText = "Aviation Discussion";
	body.innerText = data2.productText;
	discussion.append(header, body);
}

getDiscussion();
