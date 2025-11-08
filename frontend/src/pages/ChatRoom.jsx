// pages/ChatRoom.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { 
  FaComments, 
  FaSearch, 
  FaExclamationTriangle,
  FaTshirt,
  FaSpinner,
  FaPaperPlane,
  FaCamera,
  FaUpload,
  FaTimes,
  FaCheck
} from 'react-icons/fa';
import Webcam from 'react-webcam';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// --- Helper function to convert webcam base64 to a File ---
const dataURLtoFile = (dataurl, filename) => {
  let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
}

// ==========================================
// --- 1. Main ChatRoom Page Component ---
// ==========================================
const ChatRoom = () => {
  const [activeTab, setActiveTab] = useState('Chat'); // 'Chat', 'Lost', 'Found'
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null); // For the modal

  const [socket, setSocket] = useState(null);
  
  // Fetch tickets
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) return;

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
  }, []);

  // Connect to Socket.io
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) return;
    
    const newSocket = io(backendUrl, { auth: { token } });
    setSocket(newSocket);

    newSocket.on('connect_error', (err) => {
      console.error(err.message);
      setError('Chat connection failed. Please refresh.');
    });

    return () => newSocket.disconnect();
  }, []);

  // Filter tickets for tabs
  const lostTickets = useMemo(() => tickets.filter(t => t.type === 'Lost'), [tickets]);
  const foundTickets = useMemo(() => tickets.filter(t => t.type === 'Found'), [tickets]);

  // Add a new ticket to the list (called from form)
  const addTicket = (newTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
  };

  // Remove a ticket from the list (called when resolved)
  const removeTicket = (ticketId) => {
    setTickets((prev) => prev.filter(t => t._id !== ticketId));
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* --- Tab Navigation --- */}
        <div className="bg-white shadow-md rounded-b-lg flex">
          <TabButton 
            icon={<FaComments />} 
            label="Room Chat" 
            isActive={activeTab === 'Chat'}
            onClick={() => setActiveTab('Chat')}
          />
          <TabButton 
            icon={<FaSearch />} 
            label="Lost Laundry" 
            isActive={activeTab === 'Lost'}
            onClick={() => setActiveTab('Lost')}
          />
          <TabButton 
            icon={<FaExclamationTriangle />} 
            label="Found Laundry" 
            isActive={activeTab === 'Found'}
            onClick={() => setActiveTab('Found')}
          />
        </div>

        {/* --- Tab Content --- */}
        <div className="p-4 md:p-8">
          {activeTab === 'Chat' && <ChatTab socket={socket} />}
          {activeTab === 'Lost' && 
            <TicketTab 
              type="Lost" 
              tickets={lostTickets} 
              onTicketCreated={addTicket}
              onTicketClick={setSelectedTicket}
            />
          }
          {activeTab === 'Found' && 
            <TicketTab 
              type="Found" 
              tickets={foundTickets} 
              onTicketCreated={addTicket}
              onTicketClick={setSelectedTicket}
            />
          }
        </div>
      </div>

      {/* --- Ticket Modal --- */}
      {selectedTicket && (
        <TicketModal 
          ticket={selectedTicket} 
          onClose={() => setSelectedTicket(null)} 
          onResolve={removeTicket}
        />
      )}
    </div>
  );
};

// ==========================================
// --- 2. TabButton Component ---
// ==========================================
const TabButton = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-3 p-4 font-semibold text-sm md:text-base border-b-4 transition ${
      isActive 
      ? 'border-red-600 text-red-600' 
      : 'border-transparent text-gray-500 hover:text-gray-800'
    }`}
  >
    {icon} <span>{label}</span>
  </button>
);

// ==========================================
// --- 3. ChatTab Component ---
// ==========================================
const ChatTab = ({ socket }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (!socket) return;
    
    socket.on('serverMessage', (messageData) => {
      setMessages((prev) => [...prev, messageData]);
    });

    return () => socket.off('serverMessage');
  }, [socket]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (currentMessage.trim() && socket) {
      socket.emit('clientMessage', currentMessage);
      setCurrentMessage('');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl flex flex-col h-[75vh]">
      {/* Chat Window */}
      <div className="flex-grow p-6 space-y-4 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            Chat history is not stored. Start a conversation!
          </p>
        )}
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        <div ref={chatBottomRef} />
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSendChat} className="p-6 border-t bg-gray-50 rounded-b-2xl">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-3 border border-gray-300 rounded-lg"
          />
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg">
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
};

// ==========================================
// --- 4. TicketTab (Lost/Found) Component ---
// ==========================================
const TicketTab = ({ type, tickets, onTicketCreated, onTicketClick }) => {
  return (
    <div>
      <TicketForm type={type} onTicketCreated={onTicketCreated} />
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Open {type} Items
        </h2>
        {tickets.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No open {type.toLowerCase()} tickets.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tickets.map(ticket => (
              <TicketCard 
                key={ticket._id} 
                ticket={ticket} 
                onClick={() => onTicketClick(ticket)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// --- 5. TicketForm (for Lost/Found) ---
// ==========================================
const TicketForm = ({ type, onTicketCreated }) => {
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showWebcam, setShowWebcam] = useState(false);
  
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setShowWebcam(false); // Hide webcam if file is chosen
    }
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImagePreview(imageSrc);
    setImageFile(dataURLtoFile(imageSrc, 'webcam-capture.jpg'));
    setShowWebcam(false); // Hide webcam after capture
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = ''; // Reset file input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !imageFile) {
      setError('Description and image are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('type', type);
    formData.append('description', description);
    formData.append('image', imageFile);

    try {
      const token = localStorage.getItem('jwt');
      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };
      
      const res = await axios.post(`${backendUrl}/tickets`, formData, config);
      
      onTicketCreated(res.data); // Add to list
      // Reset form
      setDescription('');
      clearImage();

    } catch (err) {
      console.error(err);
      setError('Failed to create ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Report a{type === 'Lost' ? ' Lost' : ' Found'} Item
      </h2>
      
      {/* --- Image Preview / Webcam --- */}
      <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4 relative">
        {imagePreview ? (
          <>
            <img src={imagePreview} alt="Preview" className="h-full w-full object-contain rounded-lg" />
            <button 
              type="button" 
              onClick={clearImage}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow-lg"
            >
              <FaTimes />
            </button>
          </>
        ) : showWebcam ? (
          <div className="w-full h-full relative">
            <Webcam 
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover rounded-lg"
            />
            <button 
              type="button" 
              onClick={handleCapture}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-red-600 text-white rounded-full p-3 shadow-lg"
            >
              <FaCamera />
            </button>
            <button 
              type="button" 
              onClick={() => setShowWebcam(false)}
              className="absolute top-2 right-2 bg-gray-700 text-white rounded-full p-1 shadow-lg"
            >
              <FaTimes />
            </button>
          </div>
        ) : (
          <FaTshirt className="text-gray-300" size={60} />
        )}
      </div>

      {/* --- Image Buttons --- */}
      {!imagePreview && !showWebcam && (
        <div className="flex gap-4 mb-4">
          <button 
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
          >
            <FaUpload /> Upload
          </button>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          
          {type === 'Found' && (
            <button 
              type="button"
              onClick={() => setShowWebcam(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 rounded-lg"
            >
              <FaCamera /> Use Camera
            </button>
          )}
        </div>
      )}

      {/* --- Description & Submit --- */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={`Description (e.g., 'Red Nike sock, size 9, left foot')...`}
        className="w-full p-2 border border-gray-300 rounded-lg"
        rows="3"
      ></textarea>
      
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition mt-4 disabled:bg-gray-400"
      >
        {isSubmitting ? (
          <FaSpinner className="animate-spin mx-auto" />
        ) : (
          `Submit ${type} Item`
        )}
      </button>
    </form>
  );
};

// ==========================================
// --- 6. TicketCard (for Gallery) ---
// ==========================================
const TicketCard = ({ ticket, onClick }) => (
  <button onClick={onClick} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
    <img src={ticket.imageUrl} alt={ticket.description} className="h-40 w-full object-cover" />
    <div className="p-3 text-left">
      <p className="text-sm text-gray-700 truncate">{ticket.description}</p>
      <small className="text-gray-500">By {ticket.userName}</small>
    </div>
  </button>
);

// ==========================================
// --- 7. TicketModal (Popup) ---
// ==========================================
const TicketModal = ({ ticket, onClose, onResolve }) => {
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState(null);

  const handleResolve = async () => {
    if (!window.confirm('Are you sure this item has been resolved?')) return;
    
    setIsResolving(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('jwt');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${backendUrl}/tickets/${ticket._id}/resolve`, {}, config);
      
      onResolve(ticket._id); // Remove from parent list
      onClose(); // Close modal
      
    } catch (err) {
      console.error(err);
      setError('You are not authorized to resolve this ticket.');
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className={`text-lg font-bold ${ticket.type === 'Lost' ? 'text-red-600' : 'text-green-600'}`}>
            {ticket.type} Item Details
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><FaTimes size={20} /></button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <img src={ticket.imageUrl} alt={ticket.description} className="w-full max-h-[60vh] object-contain rounded-lg bg-gray-100" />
          <p className="text-gray-800 my-4 text-lg">{ticket.description}</p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li><strong>Reported by:</strong> {ticket.userName}</li>
            <li><strong>Room:</strong> {ticket.roomId}</li>
            <li><strong>Date:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 rounded-b-lg text-right">
          {error && <p className="text-red-500 text-sm text-left mb-2">{error}</p>}
          <button 
            onClick={handleResolve}
            disabled={isResolving}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-gray-400"
          >
            {isResolving ? <FaSpinner className="animate-spin" /> : <><FaCheck className="inline mr-2" /> Mark as Resolved</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// --- 8. ChatMessage (Small Fix) ---
// ==========================================
const ChatMessage = ({ message }) => {
  const isSystem = message.name === 'System';
  // TODO: Get current user's name from context/token to check if message is from "me"
  const isMe = false; // This logic needs to be added if you want "my" messages on the right

  return (
    <div className={`flex ${isSystem ? 'justify-center' : (isMe ? 'justify-end' : 'justify-start')}`}>
      {!isSystem ? (
        <div className="flex flex-col">
          <span className={`text-sm font-semibold ${isMe ? 'text-right' : 'text-gray-700'}`}>
            {isMe ? "You" : message.name}
          </span>
          <div className={`${isMe ? 'bg-blue-500' : 'bg-red-600'} text-white p-3 rounded-lg max-w-md`}>
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