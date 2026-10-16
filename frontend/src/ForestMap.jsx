import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  Crosshair,
  Globe2,
  Leaf,
  MapPin,
  Navigation,
  Satellite,
  TreePine,
} from "lucide-react";

import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "./ForestMap.css";

const ALERTS = [
  {
    id: 1,
    name: "Western Ghats Forest Zone",
    city: "Maharashtra, India",
    lat: 19.076,
    lng: 73.55,
    level: "Low",
    color: "#22a45a",
    area: "18.6 ha",
    change: "1.8%",
    source: "Satellite",
  },
  {
    id: 2,
    name: "Central India Forest Zone",
    city: "Madhya Pradesh, India",
    lat: 22.8,
    lng: 78.6,
    level: "Moderate",
    color: "#f2b233",
    area: "24.3 ha",
    change: "4.9%",
    source: "Satellite",
  },
  {
    id: 3,
    name: "Northeast Forest Zone",
    city: "Assam, India",
    lat: 26.2,
    lng: 92.9,
    level: "High",
    color: "#f47c20",
    area: "31.8 ha",
    change: "8.2%",
    source: "Drone",
  },
  {
    id: 4,
    name: "Amazon Basin",
    city: "Brazil",
    lat: -3.2,
    lng: -60.1,
    level: "Critical",
    color: "#e54848",
    area: "31.4 ha",
    change: "12.7%",
    source: "Satellite",
  },
  {
    id: 5,
    name: "Congo Forest Zone",
    city: "Democratic Republic of Congo",
    lat: 0.3,
    lng: 23.6,
    level: "High",
    color: "#f47c20",
    area: "27.1 ha",
    change: "7.6%",
    source: "Satellite",
  },
  {
    id: 6,
    name: "Borneo Forest Zone",
    city: "Indonesia",
    lat: 0.8,
    lng: 114.2,
    level: "Moderate",
    color: "#f2b233",
    area: "21.9 ha",
    change: "5.4%",
    source: "Drone",
  },
  {
    id: 7,
    name: "Western Australia Forest",
    city: "Australia",
    lat: -31.9,
    lng: 116.1,
    level: "Low",
    color: "#22a45a",
    area: "16.2 ha",
    change: "1.2%",
    source: "Ground Camera",
  },
  {
    id: 8,
    name: "European Forest Zone",
    city: "Central Europe",
    lat: 50.8,
    lng: 15.2,
    level: "Low",
    color: "#22a45a",
    area: "20.4 ha",
    change: "1.5%",
    source: "Satellite",
  },
];

const WORLD_CENTER = [20, 10];
const WORLD_ZOOM = 2;
const INDIA_CENTER = [22.5, 79];
const INDIA_ZOOM = 5;

function MapController({ view, gpsPosition }) {
  const map = useMap();

  if (view === "world") {
    map.setView(WORLD_CENTER, WORLD_ZOOM);
  }

  if (view === "india") {
    map.setView(INDIA_CENTER, INDIA_ZOOM);
  }

  if (gpsPosition) {
    map.setView(gpsPosition, 10);
  }

  return null;
}

function getSeverityClass(level) {
  return level.toLowerCase().replace(" ", "-");
}

function ForestMap() {
  const [view, setView] = useState("world");
  const [filter, setFilter] = useState("All");
  const [gpsPosition, setGpsPosition] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const filteredAlerts = useMemo(() => {
    if (filter === "All") {
      return ALERTS;
    }

    return ALERTS.filter((alert) => alert.level === filter);
  }, [filter]);

  const handleGPS = () => {
    if (!navigator.geolocation) {
      alert("GPS is not supported by this browser.");
      return;
    }

    setGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = [
          position.coords.latitude,
          position.coords.longitude,
        ];

        setGpsPosition(coordinates);
        setView("gps");
        setGpsLoading(false);
      },
      () => {
        setGpsLoading(false);
        alert(
          "GPS permission was not granted. Please allow location access in your browser."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const changeFilter = (value) => {
    setFilter(value);
    setSelectedAlert(null);
  };

  return (
    <div className="forest-map-page">
      {/* HEADER */}
      <header className="forest-map-header">
        <button
          className="back-dashboard-btn"
          onClick={() => {
            window.location.href = "/dashboard";
          }}
        >
          <ArrowLeft size={18} />
          Dashboard
        </button>

        <div className="forest-map-brand">
          <div className="forest-map-brand-icon">
            <TreePine size={22} />
          </div>

          <div>
            <strong>FORESTIQ</strong>
            <span>FOREST CHANGE MAP</span>
          </div>
        </div>

        <div className="monitoring-live">
          <span></span>
          Monitoring Active
        </div>
      </header>

      {/* INTRO */}
      <main className="forest-map-content">
        <section className="map-intro">
          <div>
            <span className="map-kicker">
              <Globe2 size={15} />
              GEOGRAPHIC FOREST INTELLIGENCE
            </span>

            <h1>
              See the forest.
              <br />
              <span>Understand change.</span>
            </h1>

            <p>
              Explore monitored forest regions across the world and India,
              with geographic alert markers and imagery-source information.
            </p>
          </div>

          <div className="map-intro-badge">
            <Satellite size={18} />
            Live geographic monitoring
          </div>
        </section>

        {/* MAP TOOLBAR */}
        <section className="map-toolbar">
          <div className="region-selector">
            <div className="region-icon">
              <MapPin size={17} />
            </div>

            <div>
              <small>MONITORING REGION</small>
              <strong>
                {view === "india" ? "India" : "World"}
                <ChevronDown size={14} />
              </strong>
            </div>
          </div>

          <div className="view-buttons">
            <button
              className={view === "world" ? "view-btn active" : "view-btn"}
              onClick={() => {
                setView("world");
                setGpsPosition(null);
              }}
            >
              <Globe2 size={16} />
              World View
            </button>

            <button
              className={view === "india" ? "view-btn active" : "view-btn"}
              onClick={() => {
                setView("india");
                setGpsPosition(null);
              }}
            >
              <MapPin size={16} />
              India View
            </button>

            <button
              className="gps-btn"
              onClick={handleGPS}
              disabled={gpsLoading}
            >
              <Crosshair size={16} />
              {gpsLoading ? "Locating..." : "My GPS"}
            </button>
          </div>
        </section>

        {/* ALERT FILTERS */}
        <section className="alert-controls">
          <div className="alert-title">
            <AlertTriangle size={17} />
            Alert layers
          </div>

          <div className="alert-filter-buttons">
            {["All", "Critical", "High", "Moderate", "Low"].map(
              (level) => (
                <button
                  key={level}
                  className={
                    filter === level
                      ? `alert-filter active ${getSeverityClass(level)}`
                      : `alert-filter ${getSeverityClass(level)}`
                  }
                  onClick={() => changeFilter(level)}
                >
                  {level !== "All" && (
                    <span className="filter-dot"></span>
                  )}
                  {level === "All" ? "All Alerts" : level}
                </button>
              )
            )}
          </div>

          <div className="alert-count-summary">
            <strong>{filteredAlerts.length}</strong>
            <span>visible zones</span>
          </div>
        </section>

        {/* MAP + SIDE PANEL */}
        <section className="map-layout">
          <div className="real-map-card">
            <MapContainer
              center={WORLD_CENTER}
              zoom={WORLD_ZOOM}
              minZoom={2}
              maxZoom={18}
              scrollWheelZoom={true}
              className="leaflet-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapController
                view={view}
                gpsPosition={gpsPosition}
              />

              {filteredAlerts.map((alert) => (
                <CircleMarker
                  key={alert.id}
                  center={[alert.lat, alert.lng]}
                  radius={selectedAlert?.id === alert.id ? 13 : 9}
                  pathOptions={{
                    color: "#ffffff",
                    weight: 4,
                    fillColor: alert.color,
                    fillOpacity: 0.95,
                  }}
                  eventHandlers={{
                    click: () => setSelectedAlert(alert),
                  }}
                >
                  <Popup>
                    <div className="map-popup">
                      <div
                        className="popup-severity"
                        style={{ color: alert.color }}
                      >
                        {alert.level} alert
                      </div>

                      <strong>{alert.name}</strong>
                      <span>{alert.city}</span>

                      <div className="popup-details">
                        <div>
                          <small>Change</small>
                          <b>{alert.change}</b>
                        </div>

                        <div>
                          <small>Area</small>
                          <b>{alert.area}</b>
                        </div>
                      </div>

                      <small>
                        GPS: {alert.lat.toFixed(4)},{" "}
                        {alert.lng.toFixed(4)}
                      </small>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

              {gpsPosition && (
                <CircleMarker
                  center={gpsPosition}
                  radius={10}
                  pathOptions={{
                    color: "#ffffff",
                    weight: 4,
                    fillColor: "#1677ff",
                    fillOpacity: 1,
                  }}
                >
                  <Popup>
                    <strong>Your GPS Location</strong>
                    <br />
                    {gpsPosition[0].toFixed(5)},{" "}
                    {gpsPosition[1].toFixed(5)}
                  </Popup>
                </CircleMarker>
              )}
            </MapContainer>

            {/* MAP OVERLAY */}
            <div className="map-layer-badge">
              <span></span>
              Forest alert layer
            </div>

            <div className="map-coordinates">
              <Navigation size={14} />
              {selectedAlert
                ? `${selectedAlert.lat.toFixed(
                    4
                  )}, ${selectedAlert.lng.toFixed(4)}`
                : "Select a marker"}
            </div>

            <div className="map-source">
              © OpenStreetMap
            </div>
          </div>

          {/* SIDE PANEL */}
          <aside className="map-side-panel">
            <div className="side-panel-header">
              <div>
                <span className="side-kicker">
                  <Leaf size={16} />
                  SELECTED ZONE
                </span>

                <h2>
                  {selectedAlert
                    ? selectedAlert.name
                    : "Forest Monitoring"}
                </h2>
              </div>
            </div>

            {selectedAlert ? (
              <>
                <div
                  className={`selected-severity ${getSeverityClass(
                    selectedAlert.level
                  )}`}
                >
                  <span></span>
                  {selectedAlert.level} alert
                </div>

                <div className="selected-location">
                  <MapPin size={16} />
                  {selectedAlert.city}
                </div>

                <div className="selected-main-stat">
                  <span>Monitored area</span>
                  <strong>{selectedAlert.area}</strong>
                </div>

                <div className="detail-row">
                  <span>Detected change</span>
                  <strong>{selectedAlert.change}</strong>
                </div>

                <div className="detail-row">
                  <span>Imagery source</span>
                  <strong>{selectedAlert.source}</strong>
                </div>

                <div className="detail-row">
                  <span>AI monitoring</span>
                  <strong>Active</strong>
                </div>

                <div className="detail-row">
                  <span>GPS coordinates</span>
                  <strong>
                    {selectedAlert.lat.toFixed(4)},{" "}
                    {selectedAlert.lng.toFixed(4)}
                  </strong>
                </div>

                <button
                  className="change-analysis-btn"
                  onClick={() => {
                    window.location.href =
                      "/dashboard/change-detection";
                  }}
                >
                  <Activity size={17} />
                  Open Change Analysis
                </button>
              </>
            ) : (
              <div className="empty-selection">
                <div className="empty-icon">
                  <MapPin size={25} />
                </div>

                <h3>Select a map alert</h3>

                <p>
                  Click any colored marker on the map to view its
                  forest condition, change percentage, imagery source
                  and GPS coordinates.
                </p>
              </div>
            )}

            {/* LEGEND */}
            <div className="map-legend-panel">
              <h3>Alert legend</h3>

              <div>
                <span className="legend-dot critical"></span>
                <span>Critical</span>
              </div>

              <div>
                <span className="legend-dot high"></span>
                <span>High</span>
              </div>

              <div>
                <span className="legend-dot moderate"></span>
                <span>Moderate</span>
              </div>

              <div>
                <span className="legend-dot low"></span>
                <span>Low / Healthy</span>
              </div>

              <div>
                <span className="legend-dot gps"></span>
                <span>Your GPS</span>
              </div>
            </div>
          </aside>
        </section>

        {/* BOTTOM STATS */}
        <section className="map-stat-grid">
          <div>
            <span className="stat-icon green">
              <TreePine size={18} />
            </span>
            <div>
              <small>LOW / HEALTHY</small>
              <strong>
                {ALERTS.filter((a) => a.level === "Low").length}
              </strong>
              <span>monitored zones</span>
            </div>
          </div>

          <div>
            <span className="stat-icon yellow">
              <Activity size={18} />
            </span>
            <div>
              <small>MODERATE</small>
              <strong>
                {ALERTS.filter((a) => a.level === "Moderate").length}
              </strong>
              <span>requiring observation</span>
            </div>
          </div>

          <div>
            <span className="stat-icon orange">
              <AlertTriangle size={18} />
            </span>
            <div>
              <small>HIGH</small>
              <strong>
                {ALERTS.filter((a) => a.level === "High").length}
              </strong>
              <span>requiring attention</span>
            </div>
          </div>

          <div>
            <span className="stat-icon red">
              <AlertTriangle size={18} />
            </span>
            <div>
              <small>CRITICAL</small>
              <strong>
                {ALERTS.filter((a) => a.level === "Critical").length}
              </strong>
              <span>priority monitoring</span>
            </div>
          </div>
        </section>

        <div className="research-map-note">
          <strong>Research prototype:</strong> colored alert locations are
          demonstration monitoring points for the application UI. They should
          be replaced with validated model outputs and geospatial datasets in
          the final research pipeline.
        </div>
      </main>
    </div>
  );
}

export default ForestMap;