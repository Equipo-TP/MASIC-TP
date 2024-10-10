import React, { useState } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    const newMessages = [...messages, { user: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    // Lógica de respuesta del chatbot
    let botResponse = '';
    if (input.toLowerCase().includes('hola')) {
      botResponse = '¡Hola! ¿En qué te puedo ayudar hoy?';
    } else if (input.toLowerCase().includes('qué puedes hacer')) {
      botResponse = 'Puedo ayudarte con la gestión de usuarios, solicitudes o tarifas.';
    } else if (input.toLowerCase().includes('registrar una solicitud')) {
      botResponse = 'Para registrar una solicitud, ve a la página de "Registrar Solicitud".';
    } else if (input.toLowerCase().includes('gestionar usuarios')) {
      botResponse = 'Dirígete a la sección "Gestionar Usuarios" para editar, eliminar o agregar usuarios.';
    } else if (input.toLowerCase().includes('tarifas')) {
      botResponse = 'Puedes gestionar tarifas desde la opción "Gestionar Tarifas".';
    } else {
      botResponse = 'Lo siento, no entiendo ese mensaje. ¿Podrías intentarlo de nuevo?';
    }

    // Agregar la respuesta del bot
    setMessages([...newMessages, { user: 'bot', text: botResponse }]);
  };

  return (
    <div className="chatbot">
      <div className="chatbox">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.user}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default Chatbot;
