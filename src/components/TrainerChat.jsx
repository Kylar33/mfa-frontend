import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosPrivate } from '../api/axios';

export function TrainerChat({ userId, trainerId }) {
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const { data: messages } = useQuery({
    queryKey: ['chat-messages', userId, trainerId],
    queryFn: async () => {
      const response = await axiosPrivate.get(`/chat/messages`, {
        params: { userId, trainerId }
      });
      return response.data;
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData) => {
      const response = await axiosPrivate.post('/chat/messages', messageData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['chat-messages']);
      setMessage('');
    }
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessageMutation.mutate({
        content: message,
        userId,
        trainerId
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow h-[600px] flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Chat con Entrenador</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderId === userId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.senderId === userId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p>{msg.content}</p>
              <span className="text-xs opacity-75 mt-1 block">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 p-2"
            placeholder="Escribe un mensaje..."
          />
          <button
            type="submit"
            disabled={sendMessageMutation.isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}