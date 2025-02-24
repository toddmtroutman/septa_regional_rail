class SEPTARegionalRailCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: 'open'});
    }
  
    setConfig(config) {
      this.config = config;
      this.station = config.station || "30th St";
      this.numResults = config.numResults || 5;
    }
  
    connectedCallback() {
      this.render();
      this.loadData();
    }
  
    async loadData() {
      const response = await fetch(`https://www3.septa.org/api/Arrivals/index.php?station=${this.station}&results=${this.numResults}`);
      const data = await response.json();
      const trains = data["*"][0]["Northbound"]; // You can display Southbound or both
      this.renderData(trains);
    }
  
    renderData(trains) {
      const table = document.createElement("table");
      table.innerHTML = `
        <thead>
          <tr>
            <th>Direction</th>
            <th>Train ID</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Status</th>
            <th>Scheduled Time</th>
          </tr>
        </thead>
        <tbody>
          ${trains.map(train => `
            <tr>
              <td>${train.direction}</td>
              <td>${train.train_id}</td>
              <td>${train.origin}</td>
              <td>${train.destination}</td>
              <td>${train.status}</td>
              <td>${train.sched_time}</td>
            </tr>
          `).join('')}
        </tbody>
      `;
      this.shadowRoot.appendChild(table);
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 10px;
            text-align: center;
            border: 1px solid #ddd;
          }
          th {
            background-color: #f4f4f4;
          }
        </style>
        <div>
          <h2>SEPTA Regional Rail: ${this.station}</h2>
          <p>Loading data...</p>
        </div>
      `;
    }
  }
  
  customElements.define('septa-regional-rail-card', SEPTARegionalRailCard);
  