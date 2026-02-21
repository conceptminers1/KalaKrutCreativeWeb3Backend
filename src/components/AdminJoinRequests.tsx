
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

interface JoinRequest {
    id: number;
    email: string;
    name: string;
    walletAddress: string;
    bio: string;
    location: string;
    musicBrainzId: string;
    status: 'PENDING' | 'APPROVED' | 'DENIED';
}

function AdminJoinRequests() {
    const [requests, setRequests] = useState<JoinRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/join-requests`);
                setRequests(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch join requests.');
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleUpdateRequest = async (id: number, status: 'APPROVED' | 'DENIED') => {
        try {
            await axios.put(`${API_BASE_URL}/api/join-requests/${id}`, { status });
            setRequests(requests.map(req => req.id === id ? { ...req, status } : req));
        } catch (err) {
            setError('Failed to update join request.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="admin-join-requests">
            <h2>Incoming Join Requests</h2>
            {requests.length === 0 ? (
                <p>No pending join requests.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Wallet Address</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(req => (
                            <tr key={req.id}>
                                <td>{req.name}</td>
                                <td>{req.email}</td>
                                <td>{req.walletAddress}</td>
                                <td>{req.status}</td>
                                <td>
                                    {req.status === 'PENDING' && (
                                        <>
                                            <button onClick={() => handleUpdateRequest(req.id, 'APPROVED')}>Approve</button>
                                            <button onClick={() => handleUpdateRequest(req.id, 'DENIED')}>Deny</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminJoinRequests;
