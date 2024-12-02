import React, { useState } from 'react';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false); // Control de visibilidad
    const [size, setSize] = useState({ width: 300, height: 400 }); // Tamaño dinámico

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { user: 'user', text: input }];
        setMessages(newMessages);
        setInput('');

        try {
            const response = await fetch('http://localhost:8000/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            });
            const data = await response.json();
            setMessages([...newMessages, { user: 'bot', text: data.reply }]);
        } catch (error) {
            setMessages([...newMessages, { user: 'bot', text: 'Hubo un problema al conectar con el servidor.' }]);
        }
    };

    const increaseSize = () => {
        setSize({ width: size.width + 50, height: size.height + 50 });
    };

    const decreaseSize = () => {
        setSize({
            width: size.width > 200 ? size.width - 50 : size.width,
            height: size.height > 200 ? size.height - 50 : size.height,
        });
    };

    const formatMessage = (message) => {
        // Renderizamos mensajes con etiquetas HTML
        return <div dangerouslySetInnerHTML={{ __html: message }} />;
    };

    return (
        <>
            {/* Botón flotante para abrir/cerrar el chatbot */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    bottom: '16px',
                    right: '16px',
                    backgroundColor: '#007BFF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    cursor: 'pointer',
                }}
            >
                💬
            </button>

            {/* Contenedor del chatbot */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '80px',
                        right: '16px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        width: `${size.width}px`,
                        height: `${size.height}px`,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {/* Encabezado con botones de tamaño */}
                    <div
                        style={{
                            backgroundColor: '#f1f1f1',
                            padding: '8px',
                            borderTopLeftRadius: '8px',
                            borderTopRightRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <span style={{ fontWeight: 'bold' }}>Chatbot</span>
                        <div>
                            <button
                                onClick={decreaseSize}
                                style={{
                                    backgroundColor: '#007BFF',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '4px 8px',
                                    marginRight: '4px',
                                    cursor: 'pointer',
                                }}
                            >
                                -
                            </button>
                            <button
                                onClick={increaseSize}
                                style={{
                                    backgroundColor: '#007BFF',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '4px 8px',
                                    cursor: 'pointer',
                                }}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Mensajes */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '8px',
                            borderBottom: '1px solid #ddd',
                        }}
                    >
                        {messages.map((message, index) => (
                            <div key={index} style={{ marginBottom: '8px' }}>
                                <span
                                    style={{
                                        fontWeight: 'bold',
                                        color: message.user === 'bot' ? 'blue' : 'green',
                                    }}
                                >
                                    {message.user === 'bot' ? 'Bot:' : 'Tú:'}
                                </span>{' '}
                                {message.user === 'bot' ? formatMessage(message.text) : message.text}
                            </div>
                        ))}
                    </div>

                    {/* Entrada */}
                    <div style={{ padding: '8px' }}>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Escribe un mensaje..."
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                marginBottom: '8px',
                                resize: 'none',
                            }}
                        />
                        <button
                            onClick={handleSendMessage}
                            style={{
                                backgroundColor: '#007BFF',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '8px 16px',
                                cursor: 'pointer',
                                width: '100%',
                            }}
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
