import React, { useState, useEffect } from 'react';
import { getToken, Messaging } from "firebase/messaging";
import { getMessagingInstance } from '../firebase';
import Chatbot from './Chatbot';

interface System {
    id: number;
    name: string;
    url?: string;
    type: string;
    apiType?: string;
    status: string;
    containerId?: string;
}

interface WhatsappSystem {
    id?: string;
    name: string;
    status: string;
}

export default function Dashboard() {
    const [systems, setSystems] = useState<System[]>([
        { id: 1, name: 'Site', url: 'https://www.zap3stor.com.br', type: 'website', status: 'online' },
        { id: 2, name: 'App', url: 'https://webplanet.zap3stor.com.br', type: 'website', status: 'online' },
        { id: 3, name: 'App na Webplanet', url: 'https://zap3stor.webplanet.com.br', type: 'website', status: 'online' },
        { id: 4, name: 'Backend Zap3stor', url: 'https://lhc.webplanet.com.br/dev/restapi/login', type: 'api', apiType: 'login', status: 'online' },
    ]);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [messagingInstance, setMessagingInstance] = useState<Messaging | null>(null);
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
    const [selectedSystem, setSelectedSystem] = useState<System | null>(null);
    const [logs, setLogs] = useState<any>(null);

    const getApiBaseUrl = () => {
        if (typeof window !== 'undefined') {
            const hostname = window.location.hostname;
            if (hostname === 'localhost' || hostname.startsWith('192.168.')) {
                return 'http://192.168.0.42/dev/restapi/docker-api';
            }
        }
        return 'https://lhc.webplanet.com.br/dev/restapi/docker-api';
    };

    const formatLogs = (logData: any) => {
        if (!logData) return <p>No logs available.</p>;

        let logEntries: any[] | null = null;

        if (typeof logData === 'object') {
            logEntries = Array.isArray(logData) ? logData : (logData.logs && Array.isArray(logData.logs) ? logData.logs : null);
        } else if (typeof logData === 'string') {
            try {
                const parsed = JSON.parse(logData);
                logEntries = Array.isArray(parsed) ? parsed : (parsed.logs && Array.isArray(parsed.logs) ? parsed.logs : null);
            } catch (e) {
            }
        }

        if (logEntries) {
            return logEntries.map((entry: any, index: number) => {
                const isQR = /[▄▀█]/.test(entry.message || '');
                return (
                    <div key={index} style={{
                        marginBottom: isQR ? '0' : '8px',
                        borderBottom: isQR ? 'none' : '1px solid #eee',
                        paddingBottom: isQR ? '0' : '4px',
                        lineHeight: isQR ? '1.1' : 'normal',
                        fontSize: isQR ? '0.5em' : '1em'
                    }}>
                        {!isQR && (
                            <div style={{ color: '#666', fontSize: '0.8em', marginBottom: '2px' }}>
                                {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : 'No Timestamp'}
                            </div>
                        )}
                        <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                            {entry.message || JSON.stringify(entry)}
                        </div>
                    </div>
                );
            });
        }

        if (typeof logData === 'string') {
            const lines = logData.split('\n');
            return lines.map((line, index) => {
                if (!line.trim()) return null;
                try {
                    const entry = JSON.parse(line);
                    return (
                        <div key={index} style={{ marginBottom: '8px', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>
                            <div style={{ color: '#666', fontSize: '0.8em', marginBottom: '2px' }}>
                                {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : 'No Timestamp'}
                            </div>
                            <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                                {entry.message || JSON.stringify(entry)}
                            </div>
                        </div>
                    );
                } catch (e2) {
                    return <div key={index} style={{ marginBottom: '4px' }}>{line}</div>;
                }
            });
        }
        
        return <pre>{typeof logData === 'string' ? logData : JSON.stringify(logData, null, 2)}</pre>;
    };

    const handleOpenChat = () => {
        setIsChatOpen(true);
        setUnreadCount(0);
    };

    const fetchLogs = async (system: System) => {
        if (system.apiType === 'status' && system.containerId) {
            try {
                const baseUrl = getApiBaseUrl();
                const response = await fetch(`${baseUrl}/logs/${system.containerId}?qr=true&tail=100`, {
                    headers: {
                        'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setLogs(data);
                }
            } catch (error) {
                console.error("Error fetching logs:", error);
            }
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (selectedSystem && selectedSystem.containerId && selectedSystem.apiType === 'status') {
            fetchLogs(selectedSystem);
            interval = setInterval(() => {
                fetchLogs(selectedSystem);
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [selectedSystem]);

    const handleSystemClick = async (system: System) => {
        if (system.apiType === 'status' && system.containerId) {
            setSelectedSystem(system);
            setLogs('Loading logs...');
        }
    };

    const handleAction = async (action: 'start' | 'stop' | 'restart') => {
        if (!selectedSystem || !selectedSystem.containerId) return;
        try {
            const baseUrl = getApiBaseUrl();
            const response = await fetch(`${baseUrl}/${action}/${selectedSystem.containerId}`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
                }
            });
            
            if (response.ok) {
                alert(`Action ${action} initiated for ${selectedSystem.name}`);
                if (action === 'start' || action === 'restart') {
                    setTimeout(() => {
                        if (selectedSystem) handleSystemClick(selectedSystem);
                    }, 2000);
                }
            } else {
                alert(`Failed to ${action} system`);
            }
        } catch (error) {
            console.error(`Failed to ${action} system:`, error);
            alert(`Failed to ${action} system`);
        }
    };

    const checkApiStatus = async (system: System): Promise<System> => {
        if (system.apiType === 'login') {
            try {
                const baseUrl = getApiBaseUrl().replace('/docker-api', '/login');
                const response = await fetch(baseUrl, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Accept": "application/json",
                    },
                    body: new URLSearchParams({
                        username: 'Suporte',
                        password: 'Webne10',
                        generate_token: 'true',
                        device: 'android',
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
        return system;
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const fetchWhatsappStatus = async () => {
                try {
                    const response = await fetch('https://lhc.webplanet.com.br/dev/restapi/getstatus');
                    const data: WhatsappSystem[] = await response.json();
                    const whatsappSystems = data.map((system: WhatsappSystem, index: number) => ({
                        id: systems.filter(s => s.type !== 'api' || s.apiType !== 'status').length + index + 1,
                        name: system.name,
                        status: system.status.toLowerCase(),
                        type: 'api',
                        apiType: 'status',
                        containerId: system.id || system.name 
                    }));

                    setSystems(prevSystems => {
                        const otherSystems = prevSystems.filter(s => s.apiType !== 'status');
                        const newSystems = [...otherSystems, ...whatsappSystems];
                        return newSystems;
                    });
                } catch (error) {
                    console.error("Failed to fetch Whatsapp status:", error);
                }
            };

            const checkOtherSystemsStatus = async () => {
                const otherSystems = systems.filter(s => s.apiType !== 'status');
                const updatedSystems = await Promise.all(otherSystems.map(async (system) => {
                    let newStatus = system.status;
                    if (system.type === 'api') {
                        const updatedSystem = await checkApiStatus(system);
                        newStatus = updatedSystem.status;
                    } else if (system.url) {
                        try {
                            await fetch(system.url, { mode: 'no-cors' });
                            newStatus = 'online';
                        } catch (error) {
                            newStatus = 'offline';
                        }
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
            }, 10000);

            checkOtherSystemsStatus();
            fetchWhatsappStatus();

            return () => clearInterval(interval);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setMessagingInstance(getMessagingInstance());
            setNotificationPermission(Notification.permission);
        }
    }, []);

    const requestNotificationPermission = async () => {
        try {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);
            if (permission === 'granted' && messagingInstance) {
                console.log('Notification permission granted.');
                const token = await getToken(messagingInstance, { vapidKey: 'BBl7LNK3HeZ1HceXkpr5ZRZr_-V3FieHdCX5k6kHxTmm_JunlnKIX0zoWyYjtux3LtpDtebXU8e6eRdj04HNag8' });
                console.log('FCM Token:', token);
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
                <button
                    onClick={requestNotificationPermission}
                    style={{ marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px' }}
                    title={notificationPermission === 'granted' ? 'Notificações Ativadas' : 'Ativar Notificações'}
                >
                    {notificationPermission === 'granted' ? '🔔' : '🔕'}
                </button>
            </div>
            <div className="system-status-container">
                {systems.map(system => (
                    <div
                        key={system.id}
                        className={`system ${(system.status || "").replace(" ", "-")}`}
                        onClick={() => handleSystemClick(system)}
                    >
                        <h2>{system.name}</h2>
                        <p>Status: {system.status}</p>
                    </div>
                ))}
            </div>

            {selectedSystem && (
                <div className="modal-overlay" onClick={() => setSelectedSystem(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-button" onClick={() => setSelectedSystem(null)}>&times;</button>
                        <h2>{selectedSystem.name} Control</h2>
                        
                        <div className="modal-actions">
                            <button className="action-btn start" onClick={() => handleAction('start')}>Start</button>
                            <button className="action-btn stop" onClick={() => handleAction('stop')}>Stop</button>
                            <button className="action-btn restart" onClick={() => handleAction('restart')}>Restart</button>
                        </div>

                        <h3>Logs</h3>
                        <div className="modal-logs">
                            {/* Render QR Code if available */}
                            {typeof logs === 'object' && logs?.qr_image_b64 && (
                                <div style={{ textAlign: 'center', marginBottom: '1em', padding: '10px', background: '#fff', borderRadius: '8px' }}>
                                    <img
                                        src={`data:image/png;base64,${logs.qr_image_b64}`}
                                        alt="QR Code"
                                        style={{ maxWidth: '250px', display: 'block', margin: '0 auto' }}
                                    />
                                    <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Scan this QR Code</p>
                                </div>
                            )}
                            {formatLogs(logs)}
                        </div>
                    </div>
                </div>
            )}

            <button className="chat-button" onClick={handleOpenChat}>
                {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
                <img src="/HelpIA.png" alt="Chat" />
            </button>
            {isChatOpen && <Chatbot onClose={() => setIsChatOpen(false)} setUnreadCount={setUnreadCount} />}
        </div>
    );
}
