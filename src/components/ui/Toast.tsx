interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
}

export function Toast({ message, type, isVisible, onClose }: ToastProps) {
  if (!isVisible) return null;

  const bgColor = {
    success: 'bg-green-100 border-green-300 text-green-800',
    error: 'bg-red-100 border-red-300 text-red-800',
    info: 'bg-blue-100 border-blue-300 text-blue-800',
  }[type];

  const icon = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
  }[type];

  return (
    <div className='fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom duration-300'>
      <div
        className={`${bgColor} border rounded-lg px-4 py-3 shadow-lg flex items-center space-x-2 max-w-sm`}
      >
        <span className='text-lg'>{icon}</span>
        <span className='font-medium'>{message}</span>
        <button
          onClick={onClose}
          className='ml-2 text-lg hover:opacity-70 transition-opacity'
        >
          ×
        </button>
      </div>
    </div>
  );
}
