import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, MessageSquare, Clock, AlertCircle } from 'lucide-react';
import type { Call } from '../types/Call';
import { api } from '../services/api';

const CallDashboard: React.FC = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [newNumber, setNewNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCalls();
  }, []);

  const loadCalls = async () => {
    try {
      const callHistory = await api.getCallHistory();
      setCalls(callHistory);
    } catch (err) {
      setError('Failed to load call history');
    }
  };

  const initiateCall = async (phoneNumber: string) => {
    try {
      setLoading(true);
      setError(null);
      const newCall = await api.initiateCall(phoneNumber);
      setCalls([newCall, ...calls]);
      setNewNumber('');
    } catch (err) {
      setError('Failed to initiate call');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Call['status']) => {
    switch (status) {
      case 'in-progress':
        return 'text-green-500';
      case 'completed':
        return 'text-blue-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">AI Cold Calling Dashboard</h1>
          <div className="text-sm text-gray-500">
            Total Calls: {calls.length}
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <div className="mb-8">
          <div className="flex gap-4">
            <input
              type="tel"
              value={newNumber}
              onChange={(e) => setNewNumber(e.target.value)}
              placeholder="Enter phone number..."
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={() => initiateCall(newNumber)}
              disabled={loading || !newNumber}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                loading || !newNumber
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Phone size={20} />
              <span>{loading ? 'Initiating...' : 'Start Call'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {calls.map((call) => (
            <div key={call.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {call.status === 'in-progress' ? (
                    <Phone className={getStatusColor(call.status)} />
                  ) : call.status === 'completed' ? (
                    <PhoneOff className={getStatusColor(call.status)} />
                  ) : (
                    <Clock className={getStatusColor(call.status)} />
                  )}
                  <span className="font-medium">{call.phoneNumber}</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(call.status)} bg-opacity-10`}>
                    {call.status}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(call.createdAt).toLocaleString()}
                </span>
              </div>
              
              {call.transcript.length > 0 && (
                <div className="mt-4 space-y-2">
                  {call.transcript.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-2 ${
                        message.role === 'ai' ? 'bg-blue-50' : 'bg-gray-50'
                      } p-3 rounded-lg`}
                    >
                      <MessageSquare size={16} className="mt-1" />
                      <div>
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {call.notes && (
                <div className="mt-4 text-sm text-gray-600 border-t pt-4">
                  <strong>Notes:</strong> {call.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CallDashboard;