import React from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { FiLogIn } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './App.css';

// --- 1. Global Styles ---
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f0f2f5;
  }
  #root {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
`;

// --- 2. Animations ---
const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`;

// --- 3. Styled Components ---
const LoginContainer = styled.div`
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease-in-out;
  width: 90%;
  max-width: 380px;

  &:hover {
    box-shadow: 0 15px 45px rgba(0, 0, 0, 0.15);
  }
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const LoginButton = styled.button`
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  outline: none;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.4);

  &:hover {
    box-shadow: 0 6px 20px rgba(0, 123, 255, 0.6);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
    background: linear-gradient(135deg, #0056b3 0%, #007bff 100%);
  }

  & span {
    z-index: 1;
  }
`;

const RippleEffect = styled.span`
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  width: 100px;
  height: 100px;
  background-color: rgba(255, 255, 255, 0.5);
  animation: ${ripple} 0.6s linear;
  pointer-events: none;
`;

// --- 4. Component React ---
const LoginScreen: React.FC = () => {
  const [ripplePos, setRipplePos] = React.useState<{ x: number; y: number } | null>(null);
  const navigate = useNavigate(); // Hook điều hướng

  const handleLoginClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // 1. Hiệu ứng ripple
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    setRipplePos({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
    setTimeout(() => setRipplePos(null), 600);

    // 2. Giả lập đăng nhập, sau đó chuyển hướng sang AIUI
    console.log('Đang đăng nhập...');
    setTimeout(() => {
      navigate('/aiui');
    }, 700);
  };

  return (
    <>
      <GlobalStyle />
      <LoginContainer>
        <Title>Đăng nhập</Title>
        <LoginButton onClick={handleLoginClick}>
          <FiLogIn size={20} />
          <span>ĐĂNG NHẬP</span>
          {ripplePos && (
            <RippleEffect
              style={{
                top: ripplePos.y - 50,
                left: ripplePos.x - 50,
              }}
              key={Date.now()}
            />
          )}
        </LoginButton>
      </LoginContainer>
    </>
  );
};

export default LoginScreen;
