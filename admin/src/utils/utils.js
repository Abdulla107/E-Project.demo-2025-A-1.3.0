import io from 'socket.io-client'

export const socket = io('https://e-project-demo-2025-a-1-3-0-serve.onrender.com', {
  withCredentials: true, // cors 
})

export const overrideStyle = {
  display: 'flex',
  margin: '0 auto',
  height: '24px',
  justifyContent: 'center',
  alignItems: 'center'
};
