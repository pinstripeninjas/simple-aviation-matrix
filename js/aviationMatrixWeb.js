// API requests
const urlForecast = "https://api.jsonbin.io/b/5ea86eb34c87c3359a634594";
const urlCriteria = "https://api.jsonbin.io/b/5ea872ac4c87c3359a634763";

// Document Selectors
const matrix = document.querySelector(".matrix");
const matrixHeader = document.querySelector(".matrix-header");
const matrixContent = document.querySelector(".matrix-content");
const loader = document.querySelector(".loader");

// Run everything
getDataForMatrix();

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
				// remove loader and display matrix
				loader.classList.toggle("display-none");
				loader.classList.toggle("loader");
				matrix.classList.toggle("display-none");
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
		firstDiv.classList.add("criteria-header-item");
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
		field.values.map((value, j) => {
			const valueDiv = document.createElement("div");
			valueDiv.classList.add("forecast-item", applyColor(value, field, criteria.body[i], j));
			// check if need to include value based on displayGreen true/false
			if (valueDiv.classList.contains("green") && !field.displayGreen) {
				return finalDiv.append(valueDiv);
			}
			// check if don't need exact value and use logic to display category
			if (!field.exactValue) {
				if (valueDiv.classList.contains("yellow")) {
					valueDiv.innerText = criteria.body[i].textShort[1];
					return finalDiv.append(valueDiv);
				} else {
					valueDiv.innerText = criteria.body[i].textShort[2];
					return finalDiv.append(valueDiv);
				}
			}
			valueDiv.innerText = value;
			return finalDiv.append(valueDiv);
		});
		// map through criteria values and add to matrix
		criteria.body[i].textArray.map((criteriaText, j) => {
			const criteriaDiv = document.createElement("div");
			criteriaDiv.classList.add("criteria-item", criteria.body[i].colorsClass[j]);
			criteriaDiv.innerText = criteriaText;
			return finalDiv.append(criteriaDiv);
		});
		return matrixContent.append(finalDiv);
	});
}

function applyColor(value, field, criteria, j) {
	// check if textbox to apply value comparison
	if (field.dataType === "textbox") {
		// check if variable is sfc wind to remove directional component
		if (field.variable === "maxSfcWind") {
			value = Number(value.slice(2));
		}
		// return color for associated class
		if (value > criteria.yellow) {
			return "red";
		} else if (value > criteria.green) {
			return "yellow";
		} else {
			return "green";
		}
	} else if (field.dataType === "dropdown") {
		if (field.category[j] === 2) {
			return "red";
		} else if (field.category[j] === 1) {
			return "yellow";
		} else {
			return "green";
		}
	}
}
