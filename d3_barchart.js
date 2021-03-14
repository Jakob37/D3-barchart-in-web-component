class Barchart extends HTMLElement {

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    const plotDiv = document.createElement('span');
    plotDiv.setAttribute('id', 'my_dataviz');
    shadowRoot.appendChild(plotDiv);
  }

  connectedCallback() {

    const margin = {top: 0, right: 10, bottom: 50, left: 50};
    const width = 200 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(this.shadowRoot).select("#my_dataviz")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // Parse the Data
    // d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv", function(data) {

    const { max, data } = this._generateData();

    const x = this._buildX(svg, data, width, height);
    const y = this._buildY(svg, height, max);

    this._buildBars(svg, data, x, y, height);

    const renderPoint = this.shadowRoot.getElementById('my_dataviz')

    let ticks = d3.select(renderPoint).selectAll('.tick text');
    ticks.each(function(_, i) {
      if (i % 5 !== 0) {
        d3.select(this).remove();
      }
    });
  }

  _getEntry(name, value) {
    return {Country: name, Value: value};
  }

  _generateData() {

    let max = 0;
    let data = [];
    for (let i = 0; i < 96; i++) {
      const newVal = 10000 * Math.random();
      if (newVal > max) {
        max = newVal;
      }
      data.push(this._getEntry(`s${i}`, `${newVal}`));
    }
    return {
      max, data
    };
  }

  _buildX(svg, data, width, height) {
    var x = d3.scaleBand()
      .range([ 0, width ])
      .domain(data.map(function(d) { return d.Country; }))
      .padding(0.2);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,10)rotate(-90)")
        .style("text-anchor", "end");
    return x;
  }

  _buildY(svg, height, max) {
    var y = d3.scaleLinear()
      .domain([0, max])
      .range([ height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));
    return y;
  }

  _buildBars(svg, data, x, y, height) {
    svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.Country); })
      .attr("y", function(d) { return y(d.Value); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.Value); })
      .attr("fill", "#69b3a2")
  }
}

customElements.define('my-barchart', Barchart);
