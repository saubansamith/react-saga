import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FETCH_PATIENTS,
  FETCH_APPOINTMENTS,
  FETCH_MEDICAL_RECORDS
} from "../redux/actions";

// Icons 
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const CalendarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>);
const FileIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>);
const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);
const ActivityIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>);

function Dashboard() {

  const dispatch = useDispatch(); // allows thw component to send action to redux

  const patients = useSelector(state => state.patients) || [];
  const appointments = useSelector(state => state.appointments) || [];
  const records = useSelector(state => state.medicalRecords) || [];

  // Helper function to get initials
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2 className="dashboard-title">
          <ActivityIcon />
          MedFlow Dashboard
        </h2>
        <div className="user-profile">
          <div className="list-item-avatar" style={{ margin: 0 }}>DR</div>
        </div>
      </header>

      <div className="action-bar">
        <button className="btn btn-primary" onClick={() => dispatch({ type: FETCH_PATIENTS })}>
          <UserIcon />
          Load Patients
        </button>

        <button className="btn btn-primary" onClick={() => dispatch({ type: FETCH_APPOINTMENTS })}>
          <CalendarIcon />
          Load Appointments
        </button>

        <button className="btn btn-primary" onClick={() => dispatch({ type: FETCH_MEDICAL_RECORDS })}>
          <FileIcon />
          Load Records
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Patients Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <div className="card-icon"><UserIcon /></div>
              Recent Patients
            </h3>
            <button className="btn" style={{ padding: '0.4rem', border: 'none', background: 'transparent', color: 'var(--primary)', boxShadow: 'none' }}>
              <PlusIcon />
            </button>
          </div>
          {patients.length === 0 ? (
            <div className="empty-state">No patients loaded yet. Click 'Load Patients' to populate.</div>
          ) : (
            <ul className="list-container">
              {patients.slice(0, 5).map(p => (
                <li key={p.id} className="list-item">
                  <div className="list-item-avatar">
                    {getInitials(p.name)}
                  </div>
                  <div className="list-item-content">
                    <h4 className="list-item-title">{p.name}</h4>
                    <p className="list-item-subtitle">Patient ID: {p.id}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Appointments Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <div className="card-icon"><CalendarIcon /></div>
              Upcoming Appointments
            </h3>
          </div>
          {appointments.length === 0 ? (
            <div className="empty-state">No appointments loaded yet.</div>
          ) : (
            <ul className="list-container">
              {appointments.slice(0, 5).map(a => (
                <li key={a.id} className="list-item">
                  <div className="list-item-avatar" style={{ background: 'var(--background)', color: 'var(--secondary)' }}>
                    <CalendarIcon />
                  </div>
                  <div className="list-item-content">
                    <h4 className="list-item-title">{a.title}</h4>
                    <p className="list-item-subtitle">Appointment ID: {a.id}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Medical Records Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <div className="card-icon"><FileIcon /></div>
              Recent Records
            </h3>
          </div>
          {records.length === 0 ? (
            <div className="empty-state">No records loaded yet.</div>
          ) : (
            <ul className="list-container">
              {records.slice(0, 5).map(r => (
                <li key={r.id} className="list-item">
                  <div className="list-item-avatar" style={{ background: '#f1f5f9', color: '#64748b' }}>
                    <FileIcon />
                  </div>
                  <div className="list-item-content">
                    <h4 className="list-item-title">{r.name}</h4>
                    <p className="list-item-subtitle">Record ID: {r.id}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;