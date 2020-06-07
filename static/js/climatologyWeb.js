// JSON API location
const urlKTUS = "https://api.jsonbin.io/b/5ea1fc202940c704e1dd7991";
const urlKFHU = "https://extendsclass.com/api/json-storage/bin/cedffee";

const climatologyChart = document.getElementById("climatologyChart");
const chartDiv = document.querySelector(".chart");
const loader = document.querySelector(".loader");
const btns = document.querySelector("#btns");
const btnList = [
	{
		site: "KTUS",
		url: urlKTUS,
	},
	{
		site: "KFHU",
		url: urlKFHU,
	},
];

const colors = ["#E81D11", "#FF931F", "#333", "#6EAF3D"];
let labels = [];
let datasetLabels = [];
let datasetByLabel = {};

getData(btnList[0]);
makeBtns();

function getData(siteInfo) {
	loader.classList.remove("display-none");
	chartDiv.classList.add("display-none");
	axios
		.get(siteInfo.url)
		.then(({ data: climatology }) => {
			labels = climatology.labels;
			datasetLabels = climatology.datasetLabels;
			datasetByLabel = climatology.datasetByLabel;
		})
		.then(() => {
			loader.classList.add("display-none");
			chartDiv.classList.remove("display-none");
			let myLineChart = new Chart(climatologyChart, {
				type: "line",
				data: {
					labels: labels,
					datasets: buildDataset(),
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					title: {
						display: true,
						text: `Density Altitude By Month - ${siteInfo.site}`,
						fontSize: 20,
					},
				},
			});
		});
}

function buildDataset() {
	const datasets = [];
	for (let i = 0; i < datasetLabels.length; i++) {
		const datasetObject = {};
		datasetObject.label = datasetLabels[i].toUpperCase();
		datasetObject.data = datasetByLabel[datasetLabels[i]];
		datasetObject.borderColor = colors[i];
		datasetObject.backgroundColor = "rgba(0,0,0,0)";
		datasetObject.lineTension = 0.3;
		datasets.push(datasetObject);
	}
	return datasets;
}

function makeBtns() {
	for (let btn of btnList) {
		const newBtn = document.createElement("button");
		newBtn.addEventListener("click", () => selectClimoSite(btn));
		newBtn.innerText = btn.site;
		if (btn.site === "KTUS") {
			newBtn.classList.add("active");
		}
		btns.append(newBtn);
	}
}

function selectClimoSite(siteInfo) {
	getData(siteInfo);
}
