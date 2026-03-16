import React from "react";
import { useSelector } from "react-redux";

const FileIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>);

function PatientDetails() {
    const details = useSelector(state => state.patientDetails);
    const loading = useSelector(state => state.loading);

    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <div className="card feature-card details-container">
            <div className="card-header">
                <h3 className="card-title">
                    <div className="card-icon"><FileIcon /></div>
                    Patient Details
                </h3>
            </div>

            <p className="feature-desc">When rapidly switching patients, <code>takeLatest</code> cancels previous API requests to save bandwidth and prevent race conditions.</p>

            {loading ? (
                <div className="details-skeleton">
                    <div className="skeleton-avatar"></div>
                    <div className="skeleton-lines">
                        <div className="skeleton-line" style={{ width: '60%' }}></div>
                        <div className="skeleton-line" style={{ width: '80%' }}></div>
                        <div className="skeleton-line" style={{ width: '40%' }}></div>
                    </div>
                </div>
            ) : !details ? (
                <div className="empty-state">
                    Select a patient from the list to view details.
                </div>
            ) : (
                <div className="patient-profile">
                    <div className="profile-header">
                        <div className="profile-avatar large">
                            {getInitials(details.name)}
                        </div>
                        <div>
                            <h2 className="profile-name">{details.name}</h2>
                            <span className="badge badge-success">Active</span>
                        </div>
                    </div>

                    <div className="profile-info-grid">
                        <div className="info-item">
                            <span className="info-label">Email</span>
                            <span className="info-value">{details.email}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Phone</span>
                            <span className="info-value">{details.phone}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Website</span>
                            <span className="info-value">{details.website}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Company</span>
                            <span className="info-value">{details.company?.name}</span>
                        </div>
                        <div className="info-item full-width">
                            <span className="info-label">Address</span>
                            <span className="info-value">
                                {details.address?.street}, {details.address?.city}, {details.address?.zipcode}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PatientDetails;