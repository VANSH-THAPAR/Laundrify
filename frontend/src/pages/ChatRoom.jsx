// pages/ChatRoom.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { 
  FaPaperPlane, 
  FaComments, 
  FaSearch, 
  FaCheck, 
  FaExclamationTriangle,
  FaSpinner
} from 'react-icons/fa';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// --- Main Component ---
const ChatRoom = () => {
  // --- State Management ---
  const [socket, setSocket] = useState(null);
  
  // Chat State
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  
  // Ticket State
  const [tickets, setTickets] = useState([]);
  const [ticketType, setTicketType] = useState('Lost');
  const [ticketDesc, setTicketDesc] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const chatBottomRef = useRef(null); // For auto-scrolling

  // --- Effects (Connect to Socket & Fetch Tickets) ---
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) return;

    // 1. Fetch all Lost & Found tickets
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`${backendUrl}/tickets`, config);
        setTickets(res.data);
      } catch (err) {
        setError('Failed to load tickets.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();

    // 2. Connect to the Socket.io server
    const newSocket = io(backendUrl, {
      auth: { token } // Send JWT for authentication
    });
    setSocket(newSocket);

    // 3. Listen for incoming messages
    newSocket.on('serverMessage', (messageData) => {
      setChatMessages((prevMessages) => [...prevMessages, messageData]);
    });

    // 4. Handle connection errors
    newSocket.on('connect_error', (err) => {
      console.error(err.message);
      setError('Chat connection failed. Please refresh.');
    });

    // 5. Cleanup on unmount
    return () => {
      newSocket.off('serverMessage');
      newSocket.disconnect();
    };
  }, []);

  // Effect to auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // --- Event Handlers ---
  const handleSendChat = (e) => {
    e.preventDefault();
    if (currentMessage.trim() && socket) {
      socket.emit('clientMessage', currentMessage);
      setCurrentMessage('');
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!ticketDesc.trim()) return;

    try {
      const token = localStorage.getItem('jwt');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const body = { type: ticketType, description: ticketDesc };
      
      const res = await axios.post(`${backendUrl}/tickets`, body, config);
      
      // Add new ticket to the top of the list
      setTickets((prev) => [res.data, ...prev]);
      setTicketDesc(''); // Clear form
    } catch (err) {
      setError('Failed to create ticket.');
    }
  };

  const handleResolveTicket = async (ticketId) => {
    if (!window.confirm('Mark this item as resolved?')) return;
    
    try {
      const token = localStorage.getItem('jwt');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.put(`${backendUrl}/tickets/${ticketId}/resolve`, {}, config);
      
      // Filter out the resolved ticket from the UI
      setTickets((prev) => prev.filter(t => t._id !== ticketId));
    } catch (err) {
      setError('You are not authorized to resolve this ticket.');
    }
  };

  // --- Main Render ---
  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* --- Column 1: Lost & Found --- */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaSearch className="mr-3 text-red-600" />
            Lost & Found
          </h2>

          {/* New Ticket Form */}
          <form onSubmit={handleCreateTicket} className="mb-6 space-y-3">
            <h3 className="font-semibold text-gray-700">Report an Item</h3>
            <select
              value={ticketType}
              onChange={(e) => setTicketType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="Lost">I Lost an Item</option>
              <option value="Found">I Found an Item</option>
            </select>
            <textarea
              value={ticketDesc}
              onChange={(e) => setTicketDesc(e.target.value)}
              placeholder="Describe the item (e.g., 'Red Nike sock', 'Found keys')..."
              className="w-full p-2 border border-gray-300 rounded-lg"
              rows="3"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Create Ticket
            </button>
          </form>

          {/* Ticket List */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {isLoading && <FaSpinner className="animate-spin text-gray-400 mx-auto" />}
            {tickets.length === 0 && !isLoading && (
              <p className="text-gray-500 text-center py-4">No open tickets.</p>
            )}
            {tickets.map(ticket => (
              <TicketCard 
                key={ticket._id} 
                ticket={ticket} 
                onResolve={handleResolveTicket} 
              />
            ))}
          </div>
        </div>

        {/* --- Column 2: Room Chat --- */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl flex flex-col">
          <h2 className="text-2xl font-bold text-gray-800 p-6 border-b flex items-center">
            <FaComments className="mr-3 text-red-600" />
            Room Chat
          </h2>
          
          {/* Chat Window */}
          <div className="flex-grow p-6 space-y-4 overflow-y-auto h-[600px]">
            {chatMessages.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Chat history is not stored. Start a conversation!
              </p>
            )}
            {chatMessages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
            <div ref={chatBottomRef} /> {/* Auto-scroll target */}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChat} className="p-6 border-t bg-gray-50 rounded-b-2xl">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg"
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>

      </div>
      {error && (
        <p className="text-red-500 text-center mt-4 font-semibold">{error}</p>
      )}
    </div>
  );
};

// --- Child Component: TicketCard ---
const TicketCard = ({ ticket, onResolve }) => {
  const isLost = ticket.type === 'Lost';
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex justify-between items-start">
        <span className={`font-semibold text-sm ${isLost ? 'text-red-600' : 'text-green-600'}`}>
          <FaExclamationTriangle className="inline mr-2" />
          {ticket.type.toUpperCase()}:
        </span>
        <button 
          onClick={() => onResolve(ticket._id)}
          className="text-xs text-blue-500 hover:underline"
          title="Mark as Resolved"
        >
          <FaCheck /> Resolve
        </button>
      </div>
      <p className="text-gray-800 my-2">{ticket.description}</p>
      <small className="text-gray-500">
        By {ticket.userName} ({new Date(ticket.createdAt).toLocaleDateString()})
      </small>
    </div>
  );
};

// --- Child Component: ChatMessage ---
const ChatMessage = ({ message }) => {
  // Simple check to see if it's a system message
  const isSystem = message.name === 'System';
  return (
    <div className={`flex ${isSystem ? 'justify-center' : ''}`}>
      {!isSystem ? (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-700">{message.name}</span>
          <div className="bg-red-600 text-white p-3 rounded-lg max-w-md">
            {message.text}
          </div>
          <span className="text-xs text-gray-400 mt-1">
            {new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ) : (
        <div className="text-sm text-gray-500 italic">
          {message.text}
        </div>
      )}
    </div>
  );
};

export default ChatRoom;