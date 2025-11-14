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
    'kể chuyện cười': "Tại sao các nhà khoa học không tin vào nguyên tử? Vì chúng tạo ra mọi thứ mà! 😄",
    'bạn có thể làm gì': "Mình có thể trò chuyện, trả lời câu hỏi, kể chuyện cười, và giúp bạn với nhiều công việc khác. Hãy hỏi mình bất cứ điều gì nhé!",
    'giúp tôi lập trình': "Rất sẵn lòng! Bạn muốn mình giúp về ngôn ngữ lập trình hay khái niệm nào?",
    'xin chào': "Chào bạn! Hôm nay bạn thế nào?",
    'chào': "Chào bạn! Mình là BDU.CM BOT, bạn cần hỗ trợ gì không?",
    'bạn khỏe không': "Mình ổn lắm, cảm ơn bạn! Còn bạn thì sao?",
    'tạm biệt': "Tạm biệt nhé! Chúc bạn một ngày thật tuyệt vời!",
    'cảm ơn': "Không có gì đâu! Nếu bạn cần thêm gì, cứ nói với mình nhé.",
    'default': "Thật thú vị đó! Bạn có thể nói rõ hơn được không?"
};

// Hàm lấy thời gian hiện tại
const getCurrentTime = (): string => {
    const now = new Date();
    return now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
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

// Component chính: BDU.CM BOT
const UIAI: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { 
            id: 0, 
            text: "Xin chào! Mình là BDU.CM BOT. Mình có thể giúp gì cho bạn hôm nay?", 
            isUser: false, 
            time: "Vừa xong" 
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const chatMessagesRef = useRef<HTMLDivElement>(null);
    const messageInputRef = useRef<HTMLTextAreaElement>(null);

    // Lấy phản hồi từ bot
    const getBotResponse = (userMessage: string): string => {
        const msg = userMessage.toLowerCase().trim();
        for (const [key, value] of Object.entries(responses)) {
            if (msg.includes(key)) {
                return value;
            }
        }
        return responses.default;
    };

    // Gửi tin nhắn
    const sendMessage = useCallback((messageToSend: string) => {
        const message = messageToSend.trim();
        if (message === '' || isTyping) return;

        setMessages(prev => [
            ...prev,
            { 
                id: Date.now(), 
                text: message, 
                isUser: true, 
                time: getCurrentTime() 
            }
        ]);
        setInputValue('');

        setIsTyping(true);

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

    // Enter để gửi
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(inputValue);
        }
    };

    // Quick Reply
    const handleQuickReply = (replyText: string) => {
        sendMessage(replyText); 
    };

    // Tự động thay đổi chiều cao textarea
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        if (messageInputRef.current) {
            messageInputRef.current.style.height = 'auto';
            messageInputRef.current.style.height = `${Math.min(messageInputRef.current.scrollHeight, 120)}px`;
        }
    };

    // Tự động cuộn khi có tin nhắn mới
    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [messages, isTyping]);
    
    const quickReplies = ["Kể chuyện cười", "Bạn có thể làm gì?", "Giúp tôi lập trình"];

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
                        <span className="text">Khám phá nội dung</span>
                    </a>
                </div>

                <div className="sidebar-section">
                    <div className="section-title">Gần đây</div>
                    <div className="recent-chats">
                        <a href="#" className="sidebar-item recent-chat active">
                            <span className="text">  </span>
                        </a>
                        <a href="#" className="sidebar-item recent-chat">
                            <span className="text">  </span>
                        </a>
                        <a href="#" className="sidebar-item recent-chat">
                            <span className="text">  </span>
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
                            <div className="bot-name">BDU.CM BOT</div>
                            <div className="bot-status">
                                <span className="status-dot"></span>
                                <span>Đang hoạt động</span>
                            </div>
                        </div>
                        <div className="user-avatar-header">
                            <img src="https://via.placeholder.com/40/0078D7/FFFFFF?text=BDU-er" alt="User Avatar" />
                        </div>
                    </div>

                    <div className="chat-messages" id="chatMessages" ref={chatMessagesRef}>
                        {messages.map(msg => (
                            <MessageComponent key={msg.id} message={msg} />
                        ))}
                        
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
                                    placeholder="Nhập tin nhắn của bạn..." 
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
