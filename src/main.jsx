import{StrictMode}from'react';
import{createRoot}from'react-dom/client';
import{MotionConfig}from'motion/react';
import App from'./App.jsx';
import'./styles.css';
import'./stabilization.css';
import'./revenue-hotfix.css';
import'./visual-recovery.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
);
