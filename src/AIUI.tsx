import React, { useState, useRef, useEffect, useCallback } from 'react';
import './AIUI.css'
// Định nghĩa kiểu dữ liệu cho Tin nhắn
interface Message {
    id: number;
    text: string;
    isUser: boolean;
    time: string;
}
// Map các câu trả lời của Bot
const responses: { [key: string]: string } = {
    'tell me a joke': "Why don't scientists trust atoms? Because they make up everything! 😄",
    'what can you do': "I can chat with you, answer questions, tell jokes, and help with various tasks. Just ask me anything!",
    'help me with coding': "I'd be happy to help with coding! What programming language or concept would you like assistance with?",
    'hello': "Hi there! How are you doing today?",
    'hi': "Hello! What can I do for you?",
    'how are you': "I'm doing great, thank you for asking! How about you?",
    'bye': "Goodbye! Have a wonderful day!",
    'thanks': "You're welcome! Feel free to ask if you need anything else.",
    'default': "That's interesting! I'm here to help. Could you tell me more?"
};

// Hàm lấy thời gian hiện tại
const getCurrentTime = (): string => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

// Component con: Hiển thị Tin nhắn
const MessageComponent: React.FC<{ message: Message }> = ({ message }) => (
    <div className={`message ${message.isUser ? 'user' : 'bot'}`} key={message.id}>
        <div className="message-avatar">{message.isUser ? '👤' : '🤖'}</div>
        <div>
            <div className="message-content">{message.text}</div>
            <div className="message-time">{message.time}</div>
        </div>
    </div>
);

// Component chính: UIAI
const UIAI: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { 
            id: 0, 
            text: "Hello! I'm your AI assistant. How can I help you today?", 
            isUser: false, 
            time: "Just now" 
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    // Logic cho Sidebar trên di động
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Ref để cuộn tin nhắn
    const chatMessagesRef = useRef<HTMLDivElement>(null);
    const messageInputRef = useRef<HTMLTextAreaElement>(null);

    // Logic lấy phản hồi của bot
    const getBotResponse = (userMessage: string): string => {
        const msg = userMessage.toLowerCase().trim();
        for (const [key, value] of Object.entries(responses)) {
            if (msg.includes(key)) {
                return value;
            }
        }
        return responses.default;
    };

    // Hàm gửi tin nhắn
    const sendMessage = useCallback((messageToSend: string) => {
        const message = messageToSend.trim();
        if (message === '' || isTyping) return;

        // 1. Thêm tin nhắn người dùng
        setMessages(prev => [
            ...prev,
            { 
                id: Date.now(), 
                text: message, 
                isUser: true, 
                time: getCurrentTime() 
            }
        ]);
        setInputValue(''); // Xóa nội dung input

        // 2. Hiện trạng thái đang gõ
        setIsTyping(true);

        // 3. Giả lập phản hồi của bot sau 1-2 giây
        setTimeout(() => {
            const responseText = getBotResponse(message);
            
            setMessages(prev => [
                ...prev,
                { 
                    id: Date.now() + 1, 
                    text: responseText, 
                    isUser: false, 
                    time: getCurrentTime() 
                }
            ]);
            setIsTyping(false);
        }, 1000 + Math.random() * 1000); 
    }, [isTyping]);

    // Xử lý sự kiện Enter
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(inputValue);
        }
    };
    
    // Xử lý nút Quick Replies
    const handleQuickReply = (replyText: string) => {
        // Cần truyền trực tiếp vào sendMessage vì logic hiện tại của bạn là gửi ngay lập tức
        sendMessage(replyText); 
    };

    // Tự động điều chỉnh chiều cao textarea (Tái tạo logic JS)
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        if (messageInputRef.current) {
            messageInputRef.current.style.height = 'auto';
            messageInputRef.current.style.height = `${Math.min(messageInputRef.current.scrollHeight, 120)}px`;
        }
    };

    // Cuộn tin nhắn tự động khi có tin nhắn mới hoặc trạng thái typing thay đổi
    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [messages, isTyping]);
    
    // Quick Replies
    const quickReplies = ["Tell me a joke", "What can you do?", "Help me with coding"];

    return (
        <div className="main-layout-container">
            
            {/* --- SIDEBAR --- */}
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`} id="sidebar">
                <div className="sidebar-header">
                    <div className="menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        ☰
                    </div>
                    <div className="search-icon">🔍</div>
                </div>

                <div className="sidebar-section-top">
                    <a href="#" className="sidebar-item new-chat">
                        <span className="icon">📝</span>
                        <span className="text">Cuộc trò chuyện mới</span>
                        <span className="action-icon">[ ]</span>
                    </a>
                    <a href="#" className="sidebar-item discover-gem">
                        <span className="icon">💎</span>
                        <span className="text">Khám phá Gem</span>
                    </a>
                </div>

                <div className="sidebar-section">
                    <div className="section-title">Gần đây</div>
                    <div className="recent-chats">
                        {/* Thay thế bằng danh sách trò chuyện thực tế */}
                        <a href="#" className="sidebar-item recent-chat active">
                            <span className="text">  </span>
                        </a>
                        <a href="#" className="sidebar-item recent-chat">
                            <span className="text">  </span>
                        </a>
                        <a href="#" className="sidebar-item recent-chat">
                            <span className="text">  </span>
                        </a>
                    </div>
                </div>

                <div className="sidebar-section-footer">
                    <a href="#" className="sidebar-item footer-item">
                        <span className="icon">⚙️</span>
                        <span className="text">Cài đặt</span>
                    </a>
                </div>
            </div>

            {/* --- CHAT MAIN --- */}
            <div className="chat-main">
                <div className="chat-container">
                    <div className="chat-header">
                        <div className="bot-avatar">🤖</div>
                        <div className="header-info">
                            <div className="bot-name">AI Assistant</div>
                            <div className="bot-status">
                                <span className="status-dot"></span>
                                <span>Online</span>
                            </div>
                        </div>
                        <div className="user-avatar-header">
                            {/* Chú ý: Placeholder image URL có thể cần thay đổi nếu không dùng placeholder.com */}
                            <img src="https://via.placeholder.com/40/FF6347/FFFFFF?text=ME" alt="User Avatar" />
                        </div>
                    </div>

                    <div className="chat-messages" id="chatMessages" ref={chatMessagesRef}>
                        {messages.map(msg => (
                            <MessageComponent key={msg.id} message={msg} />
                        ))}
                        
                        {/* Hiển thị Typing Indicator */}
                        {isTyping && (
                            <div className="typing-indicator" id="typingIndicator">
                                <div className="message-avatar">🤖</div>
                                <div className="typing-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="chat-input-container">
                        <div className="quick-replies" id="quickReplies">
                            {quickReplies.map((reply, index) => (
                                <div 
                                    key={index}
                                    className="quick-reply"
                                    onClick={() => handleQuickReply(reply)}
                                >
                                    {reply}
                                </div>
                            ))}
                        </div>
                        <div className="chat-input-wrapper">
                            <div className="input-field">
                                <textarea 
                                    id="messageInput" 
                                    placeholder="Type your message..." 
                                    rows={1}
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    ref={messageInputRef}
                                    disabled={isTyping}
                                ></textarea>
                            </div>
                            <button 
                                id="sendButton"
                                onClick={() => sendMessage(inputValue)}
                                disabled={isTyping || inputValue.trim() === ''}
                            >
                                ➤
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UIAI;