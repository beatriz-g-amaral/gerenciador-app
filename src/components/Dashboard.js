import React, { useState, useEffect } from 'react';
import { getToken } from "firebase/messaging";
import { messaging } from '../firebase';
import './Dashboard.css';

const Dashboard = () => {
    const [systems, setSystems] = useState([
        { id: 1, name: 'Site', url: 'http://www.zap3stor.com.br', type: 'website', status: 'online' },
        { id: 2, name: 'App', url: 'http://webplanet.zap3stor.com.br', type: 'website', status: 'online' },
        { id: 3, name: 'App na Webplanet', url: 'http://zap3stor.webplanet.com.br', type: 'website', status: 'online' },
        { id: 4, name: 'Backend Zap3stor', url: 'http://lhc.webplanet.com.br/dev/restapi/login', type: 'api', apiType: 'login', status: 'online' },
    ]);

    const checkApiStatus = async (system) => {
        if (system.apiType === 'login') {
            try {
                const response = await fetch(system.url, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Accept": "application/json",
                    },
                    body: new URLSearchParams({
                        username: 'Suporte',
                        password: 'Webne10',
                        generate_token: 'true',
                        device: 'web',
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.error) {
                        return { ...system, status: 'offline' };
                    }
                    return { ...system, status: 'online' };
                } else {
                    return { ...system, status: 'offline' };
                }
            } catch (error) {
                return { ...system, status: 'offline' };
            }
        }
    };

    useEffect(() => {
        const fetchWhatsappStatus = async () => {
            try {
                const response = await fetch('http://lhc.webplanet.com.br/dev/restapi/getstatus');
                const data = await response.json();
                const whatsappSystems = data.map((system, index) => ({
                    id: systems.filter(s => s.type !== 'api' || s.apiType !== 'status').length + index + 1,
                    name: system.name,
                    status: system.status.toLowerCase(),
                    type: 'api',
                    apiType: 'status'
                }));

                setSystems(prevSystems => {
                    const otherSystems = prevSystems.filter(s => s.apiType !== 'status');
                    const newSystems = [...otherSystems, ...whatsappSystems];

                    newSystems.forEach(newSystem => {
                        const oldSystem = prevSystems.find(s => s.name === newSystem.name);
                        if (oldSystem && oldSystem.status !== newSystem.status && newSystem.status === 'offline') {
                            new Notification('System Offline', {
                                body: `${newSystem.name} is currently offline.`,
                                icon: '/Logo.png'
                            });
                        }
                    });

                    return newSystems;
                });
            } catch (error) {
                console.error("Failed to fetch Whatsapp status:", error);
            }
        };

        const checkOtherSystemsStatus = async () => {
            const otherSystems = systems.filter(s => s.apiType !== 'status');
            const updatedSystems = await Promise.all(otherSystems.map(async (system) => {
                let newStatus;
                if (system.type === 'api') {
                    newStatus = (await checkApiStatus(system)).status;
                } else {
                    try {
                        await fetch(system.url, { mode: 'no-cors' });
                        newStatus = 'online';
                    } catch (error) {
                        newStatus = 'offline';
                    }
                }

                if (system.status !== newStatus && newStatus === 'offline') {
                    new Notification('System Offline', {
                        body: `${system.name} is currently offline.`,
                        icon: '/Logo.png'
                    });
                }
                
                return { ...system, status: newStatus };
            }));
            
            setSystems(prevSystems => {
                const whatsappSystems = prevSystems.filter(s => s.apiType === 'status');
                return [...updatedSystems, ...whatsappSystems];
            });
        };

        const interval = setInterval(() => {
            checkOtherSystemsStatus();
            fetchWhatsappStatus();
        }, 5000);

        checkOtherSystemsStatus();
        fetchWhatsappStatus();

        return () => clearInterval(interval);
    }, [systems]);

    const requestNotificationPermission = async () => {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('Notification permission granted.');
                const token = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' });
                console.log('FCM Token:', token);
                // TODO: Send this token to your server
            } else {
                console.log('Unable to get permission to notify.');
            }
        } catch (error) {
            console.error('An error occurred while requesting permission:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="header">
                <img src="/Logo.png" alt="Logo" className="logo" />
                <h1>Sistemas Dashboard</h1>
            </div>
            <button onClick={requestNotificationPermission}>Ativar Notificações</button>
            <div className="system-status-container">
                {systems.map(system => (
                    <div key={system.id} className={`system ${system.status}`}>
                        <h2>{system.name}</h2>
                        <p>Status: {system.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
