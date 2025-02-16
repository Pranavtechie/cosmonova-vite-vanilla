import {
	Viewer,
	Ion,
	Cartesian3,
	SampledPositionProperty,
	Color,
	ClockRange,
	JulianDate,
	Math as CesiumMath,
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import * as satellite from "satellite.js";

Ion.defaultAccessToken =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNzkzOGM1OS02YzlkLTQ5ZjEtYTM1Yi01YjdjNGFhNjBiNjAiLCJpZCI6Mjc2MjI5LCJpYXQiOjE3Mzk2MTk1NzB9.tuZe5TGfhDCXLkSS8rmZYIwP0d8eUEAKmVbQzWDokNw";

// Initialize the Cesium viewer
const viewer = new Viewer("wrapper");

// Constants
const earthRadius = 6371000; // Earth's radius in meters
const orbitAltitude = 500000; // 500 km in meters
const orbitRadius = earthRadius + orbitAltitude;

// Calculate orbital period using Kepler's laws
// μ is Earth's gravitational parameter (m³/s²)
const μ = 3.986004418e14;
const orbitalPeriod = 2 * Math.PI * Math.sqrt(Math.pow(orbitRadius, 3) / μ);

// Create an array of positions for the orbit
const positions = [];
const samplesNum = 360;
for (let i = 0; i < samplesNum; i++) {
	const angle = (i / samplesNum) * 2 * Math.PI;
	const position = new Cartesian3(
		orbitRadius * Math.cos(angle),
		orbitRadius * Math.sin(angle),
		0
	);
	positions.push(position);
}

// Add the orbit path
viewer.entities.add({
	name: "Orbit Path",
	polyline: {
		positions: positions,
		width: 2,
		material: Color.BLUE,
	},
});

// Add the satellite entity
const sat = viewer.entities.add({
	name: "Satellite",
	position: new SampledPositionProperty(),
	point: {
		pixelSize: 10,
		color: Color.RED,
	},
});

// Set up satellite animation
const startTime = JulianDate.fromDate(new Date());
const endTime = JulianDate.addSeconds(
	startTime,
	orbitalPeriod,
	new JulianDate()
);

viewer.clock.startTime = startTime;
viewer.clock.stopTime = endTime;
viewer.clock.currentTime = startTime;
viewer.clock.clockRange = ClockRange.LOOP_STOP;
viewer.clock.multiplier = 10; // Speed up animation

// Calculate satellite position at each time step
const satellitePosition = sat.position;
for (let i = 0; i <= samplesNum; i++) {
	const time = JulianDate.addSeconds(
		startTime,
		(i / samplesNum) * orbitalPeriod,
		new JulianDate()
	);
	const angle = (i / samplesNum) * 2 * Math.PI;
	const position = new Cartesian3(
		orbitRadius * Math.cos(angle),
		orbitRadius * Math.sin(angle),
		0
	);
	satellitePosition.addSample(time, position);
}

// Set initial camera view
viewer.camera.flyTo({
	destination: Cartesian3.fromDegrees(0, 0, orbitRadius * 2),
	orientation: {
		heading: 0,
		pitch: -CesiumMath.PI_OVER_TWO,
		roll: 0,
	},
});

viewer.clock.shouldAnimate = true;

function createSatelliteOrbit(viewer, tleLine1, tleLine2) {
	// Parse the TLE data
	const satrec = satellite.twoline2satrec(tleLine1, tleLine2);
	if (!satrec) {
		throw new Error("Error parsing TLE data");
	}

	// Calculate orbital period (in minutes)
	const orbitalPeriod = (24 * 60) / satrec.no; // no is revolutions per day
	const periodInSeconds = orbitalPeriod * 60;

	// Create arrays for position calculations
	const positions = [];
	const samplesNum = 120; // Reduced number of samples for cleaner visualization

	// Set up time window for visualization
	const startTime = JulianDate.fromDate(new Date());
	const endTime = JulianDate.addSeconds(
		startTime,
		periodInSeconds,
		new JulianDate()
	);

	// Calculate positions for orbit path
	for (let i = 0; i < samplesNum; i++) {
		const timeSinceStart = (i / samplesNum) * periodInSeconds;
		const date = new Date(JulianDate.toDate(startTime));
		date.setSeconds(date.getSeconds() + timeSinceStart);

		// Get position from satellite.js
		const positionAndVelocity = satellite.propagate(satrec, date);
		const gmst = satellite.gstime(date);
		const satPosition = satellite.eciToEcf(
			positionAndVelocity.position,
			gmst
		);

		// Convert to Cesium Cartesian3
		const cartesian = new Cartesian3(
			satPosition.x * 1000,
			satPosition.y * 1000,
			satPosition.z * 1000
		);
		positions.push(cartesian);
	}

	// Add single orbit path
	viewer.entities.add({
		name: "ISS Orbit Path",
		polyline: {
			positions: positions,
			width: 2,
			material: Color.RED,
			arcType: Cesium.ArcType.NONE, // Use straight lines between points
		},
	});

	// Create ISS entity
	const issEntity = viewer.entities.add({
		name: "ISS",
		position: new SampledPositionProperty(),
		point: {
			pixelSize: 15,
			color: Color.RED,
		},
	});

	// Set up animation
	viewer.clock.startTime = startTime;
	viewer.clock.stopTime = endTime;
	viewer.clock.currentTime = startTime;
	viewer.clock.clockRange = ClockRange.LOOP_STOP;
	viewer.clock.multiplier = 1;

	// Calculate satellite positions for animation
	const issPosition = issEntity.position;
	for (let i = 0; i <= samplesNum; i++) {
		const time = JulianDate.addSeconds(
			startTime,
			(i / samplesNum) * periodInSeconds,
			new JulianDate()
		);

		const date = new Date(JulianDate.toDate(time));
		const positionAndVelocity = satellite.propagate(satrec, date);
		const gmst = satellite.gstime(date);
		const satPosition = satellite.eciToEcf(
			positionAndVelocity.position,
			gmst
		);

		const cartesian = new Cartesian3(
			satPosition.x * 1000,
			satPosition.y * 1000,
			satPosition.z * 1000
		);

		issPosition.addSample(time, cartesian);
	}

	// Adjust camera view
	viewer.camera.flyTo({
		destination: Cartesian3.fromDegrees(0, 0, 25000000),
		orientation: {
			heading: 0,
			pitch: -CesiumMath.PI_OVER_TWO,
			roll: 0,
		},
	});

	return issEntity;
}

// ISS orbit (red)
const tleLine1 =
	"1 25544U 98067A   25046.92811457  .00015329  00000+0  27452-3 0  9996";
const tleLine2 =
	"2 25544  51.6387 187.6089 0004148 321.8517 184.3797 15.50154024496358";
const issEntity = createSatelliteOrbit(viewer, tleLine1, tleLine2);
viewer.clock.shouldAnimate = true;
