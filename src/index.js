/*
 * LightningChartJS example that showcases visualization of large XY scatter chart.
 */
// Import LightningChartJS
const lcjs = require('@lightningchart/lcjs')

// Extract required parts from LightningChartJS.
const { lightningChart, PointShape, emptyLine, ColorCSS, SolidLine, SolidFill, Themes } = lcjs

// Create chart and series.
const chart = lightningChart({
            resourcesBaseUrl: new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'resources/',
        })
    .ChartXY({
        theme: Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined,
    })
    .setTitle('')

// Create point series for visualizing scatter points.
const pointSeries = chart.addPointLineAreaSeries({ dataPattern: null }).setStrokeStyle(emptyLine).setPointSize(1).setName('Scatter series')

// Visualize confidence ellipse with polygon series.
// Note, routine for calculation of confidence ellipse coordinates from scatter data set is not currently included in LightningChart JS!
const polygonSeries = chart.addPolygonSeries().setCursorEnabled(false).setMouseInteractions(false)

// Fetch example data from JSON asset.
fetch(
    new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'examples/assets/0016/data-largeScatterChartXY.json',
)
    .then((r) => r.json())
    .then((data) => {
        const { scatterPoints, confidenceEllipsePolygonCoords } = data
        chart.setTitle(`Scatter chart (${(data.scatterPoints.length / 10 ** 6).toFixed(1)} million points) + confidence Ellipse`)

        // Add data to series.
        pointSeries.add(scatterPoints)
        polygonSeries
            .add(confidenceEllipsePolygonCoords)
            .setFillStyle(new SolidFill({ color: ColorCSS('gray').setA(30) }))
            .setStrokeStyle(
                new SolidLine({
                    thickness: 1,
                    fillStyle: new SolidFill({ color: ColorCSS('white') }),
                }),
            )
    })

// Example of separating data cursor from LCJS rendering. This can enable smooth cursor interactions even over extremely heavy series, such as massive point clouds
// Essentially the idea is to:
//  - disable any functionality that results in chart re-rendering in normal auto cursor interactions (highlighting on hover basically)
//  - set cursor mode to show pointed data point, instead of finding nearest data point
//  - use custom cursor to display cursor in some other way that doesn't require chart to re-render
pointSeries.setHighlightOnHover(false)
chart.setCursorMode('show-pointed').setCustomCursor((_, hit, hits, mouseLocation) => {
    if (hit) {
        customResultTable.style.opacity = '1.0'
        customResultTable.style.left = `${mouseLocation.clientX}px`
        customResultTable.style.top = `${mouseLocation.clientY}px`
        customResultTable.innerHTML = `${hit.series.getName()}<br/>X: ${hit.axisX.formatValue(hit.x)}<br/>Y: ${hit.axisY.formatValue(
            hit.y,
        )}`
    } else {
        customResultTable.style.opacity = '0.0'
    }
})

const theme = chart.getTheme()
const customResultTable = document.createElement('div')
document.body.append(customResultTable)
customResultTable.style.position = 'absolute'
customResultTable.style.pointerEvents = 'none'
customResultTable.style.transition = 'opacity 0.5s'
customResultTable.style.backgroundColor = theme.isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)'
customResultTable.style.color = theme.isDark ? 'rgba(255,255,255)' : 'rgba(0,0,0)'
customResultTable.style.fontFamily = 'Segoe UI'
customResultTable.style.fontSize = '14px'
customResultTable.style.padding = '5px'
customResultTable.style.borderRadius = '3px'
customResultTable.style.boxSizing = 'border-box'
customResultTable.style.transform = 'translateY(-100%)'
