import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SUBMIT_PATIENT_FORM } from "../redux/actions";

const ActivityIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>);
const WifiIcon = ({ isOnline }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isOnline ? "#10b981" : "#ef4444"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {isOnline ? (
            <><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></>
        ) : (
            <><line x1="1" y1="1" x2="23" y2="23"></line><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></>
        )}
    </svg>
);

function PatientForm() {
    const dispatch = useDispatch();
    const isOnline = useSelector(state => state.isOnline);
    const queueLength = useSelector(state => state.offlineQueue.length);

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        disease: '',
        doctorAssigned: '',
        behaviour: 'Normal'
    });

    const [notification, setNotification] = useState(null);

    const showNotification = (msg, type) => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.age) {
            showNotification("Name and Age are required", "error");
            return;
        }

        const payload = { ...formData, id: Date.now() };
        dispatch({ type: SUBMIT_PATIENT_FORM, payload });

        if (isOnline) {
            showNotification("Form submitted successfully", "success");
        } else {
            showNotification("Offline mode: Form queued for later", "warning");
        }

        // Reset form
        setFormData({ name: '', age: '', disease: '', doctorAssigned: '', behaviour: 'Normal' });
    };

    return (
        <div className="card feature-card form-container">
            <div className="card-header">
                <h3 className="card-title">
                    <div className="card-icon"><ActivityIcon /></div>
                    Patient Registration
                </h3>
                <div className="network-status" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <WifiIcon isOnline={isOnline} />
                    <span style={{ color: isOnline ? 'var(--primary)' : 'var(--danger)', fontWeight: 'bold' }}>
                        {isOnline ? "Online" : "Offline"}
                    </span>
                </div>
            </div>

            <p className="feature-desc">Submits to API when online. When offline, saves to Redux queue and auto-syncs upon reconnection.</p>

            {queueLength > 0 && (
                <div className="alert alert-warning">
                    <strong>{queueLength}</strong> record(s) queued for offline submission.
                </div>
            )}

            {notification && (
                <div className={`notification notification-${notification.type}`}>
                    {notification.msg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="patient-form">
                <div className="form-group">
                    <label>Patient Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Age *</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="e.g. 45"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Disease</label>
                    <input
                        type="text"
                        name="disease"
                        value={formData.disease}
                        onChange={handleChange}
                        placeholder="e.g. Diabetes"
                    />
                </div>

                <div className="form-group">
                    <label>Doctor Assigned</label>
                    <input
                        type="text"
                        name="doctorAssigned"
                        value={formData.doctorAssigned}
                        onChange={handleChange}
                        placeholder="e.g. Dr. Smith"
                    />
                </div>

                <div className="form-group">
                    <label>Behaviour</label>
                    <select name="behaviour" value={formData.behaviour} onChange={handleChange}>
                        <option value="Normal">Normal</option>
                        <option value="Critical">Critical</option>
                        <option value="Stable">Stable</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-primary submit-btn">
                    Register Patient
                </button>
            </form>
        </div>
    );
}

export default PatientForm;
