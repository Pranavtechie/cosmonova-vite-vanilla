const viz = new Spacekit.Simulation(document.getElementById("main-container"), {
	basePath: "https://typpo.github.io/spacekit/src",
});

// Create a background using Yale Bright Star Catalog data.
viz.createStars();

// Create our first object - the sun - using a preset space object.
viz.createObject("sun", Spacekit.SpaceObjectPresets.SUN);

// // Then add some planets
// viz.createObject("mercury", Spacekit.SpaceObjectPresets.MERCURY);
// viz.createObject("venus", Spacekit.SpaceObjectPresets.VENUS);
// viz.createObject("earth", Spacekit.SpaceObjectPresets.EARTH);
// viz.createObject("mars", Spacekit.SpaceObjectPresets.MARS);
// viz.createObject("jupiter", Spacekit.SpaceObjectPresets.JUPITER);
// viz.createObject("saturn", Spacekit.SpaceObjectPresets.SATURN);
// viz.createObject("uranus", Spacekit.SpaceObjectPresets.URANUS);
// viz.createObject("neptune", Spacekit.SpaceObjectPresets.NEPTUNE);

// const roadster = viz.createObject("spaceman", {
// 	labelText: "Tesla Roadster",
// 	ephem: new Spacekit.Ephem(
// 		{
// 			// These parameters define orbit shape.
// 			a: 1.324870564730606,
// 			e: 2.557785995665682e-1,
// 			i: 1.07755072280486,

// 			// These parameters define the orientation of the orbit.
// 			om: 3.170946964325638e2,
// 			w: 1.774865822248395e2,
// 			ma: 1.764302192487955e2,

// 			// Where the object is in its orbit.
// 			epoch: 2458426.5,
// 		},
// 		"deg"
// 	),
// });
