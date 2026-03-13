import React, { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./redux/store";
import PatientList from "./components/PatientList";
import PatientForm from "./components/PatientForm";
import PatientDetails from "./components/PatientDetails";
import { FETCH_PATIENT_DETAILS, SET_NETWORK_STATUS, SYNC_OFFLINE_QUEUE } from "./redux/actions";
import "./App.css";

/* ── SVG Icons ─────────────────────────────────────────────────── */
const HeartPulseIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);
const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect>
    <rect x="3" y="14" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect>
  </svg>
);
const FormIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line>
    <line x1="9" y1="15" x2="15" y2="15"></line>
  </svg>
);
const WifiIcon = ({ isOnline }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isOnline ? "#10b981" : "#ef4444"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {isOnline ? (
      <><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><circle cx="12" cy="20" r="1" fill="currentColor"></circle></>
    ) : (
      <><line x1="1" y1="1" x2="23" y2="23"></line><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><circle cx="12" cy="20" r="1" fill="currentColor"></circle></>
    )}
  </svg>
);

/* ── Main App Content (inside Provider) ────────────────────────── */
function AppContent() {
  const dispatch = useDispatch();
  const isOnline = useSelector(state => state.isOnline); // Reads internet status from Redux store.
  const queueLength = useSelector(state => state.offlineQueue.length); // Reads offline queue size.
  const [activeTab, setActiveTab] = useState("dashboard");

  /* Online / Offline listeners */
  useEffect(() => {
    const handleOnline = () => {
      dispatch({ type: SET_NETWORK_STATUS, payload: true });
      dispatch({ type: SYNC_OFFLINE_QUEUE }); // Send queued offline data to server
    };
    const handleOffline = () => {
      dispatch({ type: SET_NETWORK_STATUS, payload: false });
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [dispatch]);

  const handlePatientSelect = (id) => {
    dispatch({ type: FETCH_PATIENT_DETAILS, payload: id });
  };

  return (
    <div className="app-container">
      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon"><HeartPulseIcon /></div>
          <div>
            <h2>MedFlow</h2>
            <span className="logo-subtitle">Hospital Dashboard</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-label">MENU</span>
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <span className="nav-icon"><DashboardIcon /></span>
            <span>Doctor Dashboard</span>
          </button>
          <button className={`nav-item ${activeTab === 'registration' ? 'active' : ''}`} onClick={() => setActiveTab('registration')}>
            <span className="nav-icon"><FormIcon /></span>
            <span>Patient Registration</span>
            {queueLength > 0 && <span className="sidebar-badge">{queueLength}</span>}
          </button>
        </nav>

        {/* Network Status Indicator */}
        <div className="sidebar-footer">
          <div className={`network-pill ${isOnline ? 'online' : 'offline'}`}>
            <WifiIcon isOnline={isOnline} />
            <span>{isOnline ? "Connected" : "Offline"}</span>
          </div>
        </div>
      </aside>

      {/* ── Main Area ────────────────────────────────────────── */}
      <main className="main-content">
        <header className="main-header">
          <div>
            <h1>{activeTab === 'dashboard' ? 'Patient Overview' : 'New Patient Registration'}</h1>
            <p className="header-subtitle">
              {activeTab === 'dashboard'
                ? 'Manage and review patient records efficiently'
                : 'Register a new patient into the system'}
            </p>
          </div>
          <div className="user-profile">
            <div className="user-info">
              <span className="user-name">Dr. Smith</span>
              <span className="user-role">Cardiologist</span>
            </div>
            <div className="profile-avatar-small">DS</div>
          </div>
        </header>

        {/* Stats bar (on dashboard only) */}
        {activeTab === 'dashboard' && <StatsBar />}

        <div className="content-area">
          {activeTab === 'dashboard' ? (
            <div className="dashboard-grid">
              <PatientList onPatientSelect={handlePatientSelect} />
              <PatientDetails />
            </div>
          ) : (
            <div className="dashboard-grid single-column">
              <PatientForm />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ── Stats Bar Component ───────────────────────────────────────── */
function StatsBar() {
  const patients = useSelector(state => state.patients);
  const queue = useSelector(state => state.offlineQueue);
  const isOnline = useSelector(state => state.isOnline);

  const stats = [
    { label: "Total Patients", value: patients.length, color: "#0ea5e9", bg: "#e0f2fe" },
    { label: "Queued Offline", value: queue.length, color: "#f59e0b", bg: "#fef3c7" },
    { label: "Network Status", value: isOnline ? "Online" : "Offline", color: isOnline ? "#10b981" : "#ef4444", bg: isOnline ? "#d1fae5" : "#fee2e2" },
    { label: "Per Page", value: "1 / 10", color: "#8b5cf6", bg: "#ede9fe" },
  ];

  return (
    <div className="stats-bar">
      {stats.map((s, i) => (
        <div className="stat-card" key={i}>
          <div className="stat-dot" style={{ background: s.color }}></div>
          <div>
            <span className="stat-value" style={{ color: s.color }}>{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
/* ── Root App with Provider ────────────────────────────────────── */
function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
