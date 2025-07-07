import { useAuthStore } from '../store/useAuthStore.js';
import { Navigate } from 'react-router-dom';
import GeminiChat from '../components/GeminiChat';

const AIChatPage = () => {
  const { authUser } = useAuthStore();

  if (!authUser) {
    return <Navigate to="/login" />;
  }

  return <GeminiChat />;
};

export default AIChatPage; 