// API requests
const urlForecast = "https://extendsclass.com/api/json-storage/bin/cfbaeae";
const urlCriteria = "https://extendsclass.com/api/json-storage/bin/cbdbfad";

// Document Selectors
const matrixHeader = document.querySelector(".matrix-header");
const matrixContent = document.querySelector(".matrix-content");
const loader = document.querySelector(".loader");

function getDataForMatrix() {
	axios
		.all([
			axios({
				method: "get",
				url: urlForecast,
				onDownloadProgress: function () {
					// loader.innerHTML = "Loading...";
				},
			}),
			axios.get(urlCriteria),
		])
		.then(
			axios.spread(({ data: forecast }, { data: criteria }) => {
				// create matrix header
				buildHeader(forecast, criteria);
				// create matrix contnent
				buildMatrixContent(forecast, criteria);
				loader.classList.toggle("display-none");
				loader.classList.toggle("loader");
			})
		)
		.catch((err) => {
			console.log(err);
		});
}

function buildHeader(forecast, criteria) {
	const title = document.createElement("div");
	title.classList.add("field-name");
	matrixHeader.append(title);
	// map through array to fill dates in the header
	forecast.validPeriod.day.map((day, i) => {
		const firstDiv = document.createElement("div");
		const secondDiv = document.createElement("div");
		const finalDiv = document.createElement("div");
		finalDiv.classList.add("header-item");
		firstDiv.innerText = day;
		secondDiv.innerHTML = forecast.validPeriod.date[i];
		finalDiv.append(firstDiv, secondDiv);
		return matrixHeader.append(finalDiv);
	});
	// map through array to fill criteria header
	criteria.header.map((field) => {
		const firstDiv = document.createElement("div");
		firstDiv.classList.add("criteria-item");
		firstDiv.innerHTML = field.text;
		return matrixHeader.append(firstDiv);
	});
}

function buildMatrixContent(forecast, criteria) {
	forecast.forecast.map((field, i) => {
		const finalDiv = document.createElement("div");
		finalDiv.classList.add("matrix-row");
		const fieldNameDiv = document.createElement("div");
		fieldNameDiv.innerText = field.fullName;
		fieldNameDiv.classList.add("field-name");
		finalDiv.append(fieldNameDiv);
		// map through values and add to matrix
		field.values.map((value) => {
			const valueDiv = document.createElement("div");
			valueDiv.classList.add("forecast-item");
			valueDiv.innerText = value;
			return finalDiv.append(valueDiv);
		});
		// map through criteria values and add to matrix
		criteria.body[i].textArray.map((criteria) => {
			const criteriaDiv = document.createElement("div");
			criteriaDiv.classList.add("criteria-item");
			criteriaDiv.innerText = criteria;
			return finalDiv.append(criteriaDiv);
		});
		return matrixContent.append(finalDiv);
	});
}

getDataForMatrix();