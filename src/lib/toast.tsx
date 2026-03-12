import { toast, ToastContainer as ReactToastifyContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ToastProvider = () => {
  return (
    <ReactToastifyContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

export const notify = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast.info(message),
  warning: (message: string) => toast.warn(message),
  pushNotification: (title: string, body?: string) => toast.info(
    <div>
      <strong className="block text-sm">{title}</strong>
      {body && <p className="text-xs mt-1">{body}</p>}
    </div>,
    {
      icon: false // Optional: you could customize icons for FCM
    }
  )
};
