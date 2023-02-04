const initSDK = new Promise((res) => {
	res(
		CY.loader()
			.licenseKey("2b590f5128c08591fa836ff547149d8ddc24635f850c")
			.addModule(CY.modules().FACE_AGE.name)
			.addModule(CY.modules().FACE_GENDER.name)
			.addModule(CY.modules().FACE_EMOTION.name)
			.addModule(CY.modules().FACE_ATTENTION.name)
			.load()
	);
});

/*
  Oyentes de eventos para la salida de MorphCast SDK
*/

var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //Enero es 0!
var yyyy = today.getFullYear();
today = mm + "/" + dd + "/" + yyyy;

window.addEventListener(CY.modules().FACE_AGE.eventName, (evt) => {
	age_div.innerHTML =
		"LIKELY AGE: " + evt.detail.output.numericAge + " years";
	console.log("AGE:", evt.detail.output.numericAge);
});

window.addEventListener(CY.modules().FACE_GENDER.eventName, (evt) => {
	gen_div.innerHTML = "LIKELY GENDER: " + evt.detail.output.mostConfident;
	console.log("GENDER:", evt.detail.output.mostConfident);
});

window.addEventListener(CY.modules().FACE_EMOTION.eventName, (evt) => {
	emo_div.innerHTML =
		"Dominant Emotion: " + evt.detail.output.dominantEmotion;
	var myDate = new Date()
		.toTimeString()
		.replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
	console.log("Date:", today);
	console.log("Hour:", myDate);
	console.log("Dominant Emotion:", evt.detail.output.dominantEmotion);
	// datos para el histograma
	const emotions = evt.detail.output.emotion;
	const labels = [];
	const data = [];
	console.log("Angry:", evt.detail.output.emotion.Angry);
	console.log("Disgust:", evt.detail.output.emotion.Disgust);
	console.log("Fear:", evt.detail.output.emotion.Fear);
	console.log("Happy:", evt.detail.output.emotion.Happy);
	console.log("Neutral:", evt.detail.output.emotion.Neutral);
	console.log("Sad:", evt.detail.output.emotion.Sad);
	console.log("Surprise:", evt.detail.output.emotion.Surprise);

	Object.keys(emotions).forEach((k) => {
		labels.push(k);
		data.push(parseInt((emotions[k] * 100).toFixed(0)));
	});

	chart.updateOptions({
		labels: labels,
		series: [
			{
				name: "Emotion",
				data: data,
			},
		],
	});
});

window.addEventListener(CY.modules().FACE_ATTENTION.eventName, (evt) => {
	const attention = evt.detail.output.attention;
	console.log("ATTENTION:", evt.detail.output.attention);
	console.log(";");
	const elem = document.getElementById("myBar");
	elem.style.width = attention * 100 + "%";
});

var video = document.querySelector("#videoElement");

if (navigator.mediaDevices.getUserMedia) {
	navigator.mediaDevices
		.getUserMedia({ video: true })
		.then(function (stream) {
			video.srcObject = stream;
		})
		.catch(function (err0r) {
			console.log("Algo salió mal!");
		});
}

/*
  elementos de la pagina
*/

const startButton = document.querySelector("#start_over");

startButton.onclick = () => {
	startButton.style.display = "none";
	initSDK.then(({ start }) => start());
};

const age_div = document.querySelector("#age");
const gen_div = document.querySelector("#gender");
const emo_div = document.querySelector("#emotion");

const options = {
	chart: {
		height: 350,
		width: 500,
		type: "bar",
	},
	colors: ["#7C0098"],
	yaxis: {
		min: 0,
		max: 100,
	},
	series: [],
	title: {
		text: "",
	},
	labels: [],
};
const chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();
