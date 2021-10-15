/*
 * LightningChartJS example that showcases visualization of large XY scatter chart.
 */
// Import LightningChartJS
const lcjs = require("@arction/lcjs");

// Extract required parts from LightningChartJS.
const { lightningChart, PointShape, ColorCSS, SolidLine, SolidFill, Themes } =
  lcjs;

// Create chart and series.
const chart = lightningChart()
  .ChartXY({
    // theme: Themes.darkGold
  })
  .setTitle("");

// Create point series for visualizing scatter points.
const pointSeries = chart
  .addPointSeries({ pointShape: PointShape.Square })
  .setPointSize(1)
  .setMouseInteractions(false)
  // NOTE: This disables data cursor from interacting with this series.
  // Data cursor does not perform well with scatter charts in millions of data points range.
  .setCursorEnabled(false)
  .setName("Scatter series");

// Visualize confidence ellipse with polygon series.
// Note, routine for calculation of confidence ellipse coordinates from scatter data set is not currently included in LightningChart JS!
const polygonSeries = chart
  .addPolygonSeries()
  .setMouseInteractions(false)
  .setCursorEnabled(false);

// Fetch example data from JSON asset.
fetch(
  document.head.baseURI +
    "examples/assets/lcjs_example_0016_largeScatterChartXY-data-largeScatterChartXY.json"
)
  .then((r) => r.json())
  .then((data) => {
    console.log(data)
    const { scatterPoints, confidenceEllipsePolygonCoords } = data;
    chart.setTitle(`Scatter chart (${(data.scatterPoints.length / 10 ** 6).toFixed(
      1,
  )} million points) + confidence Ellipse`)

    // Add data to series.
    pointSeries.add(scatterPoints);
    polygonSeries
      .add(confidenceEllipsePolygonCoords)
      .setFillStyle(new SolidFill({ color: ColorCSS("gray").setA(30) }))
      .setStrokeStyle(
        new SolidLine({
          thickness: 1,
          fillStyle: new SolidFill({ color: ColorCSS("white") }),
        })
      );
  });
