import { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { sanitizeHtml } from '../utils/terminalHelpers.js';

const EMAILJS_SERVICE_ID = 'service_pnzmjs3';
const EMAILJS_TEMPLATE_ID = 'template_ttx132m';
const EMAILJS_PUBLIC_KEY = 'TxdzA0eW_hEQBHkZF';

export function ContactFormDemo({ onExit }) {
  const [step, setStep] = useState('name');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState([]);
  const [errorLine, setErrorLine] = useState('');
  const inputRef = useRef(null);
  
  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  // Make sure focus is retained if user clicks within the component
  const handleClick = () => {
    inputRef.current?.focus();
  };

  const validateEmail = (email) => {
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return re.test(email);
  };

  const handleSubmitFlow = async (e) => {
    e.preventDefault();
    const val = inputValue.trim();
    
    if (step === 'name') {
      if (!val) {
        setErrorLine('Name is required.');
        return;
      }
      setHistory(prev => [...prev, { prompt: 'Name:', value: val }]);
      setFormData(prev => ({ ...prev, name: val }));
      setStep('email');
      setInputValue('');
      setErrorLine('');
    } else if (step === 'email') {
      if (!val || !validateEmail(val)) {
        setErrorLine('Please enter a valid email address.');
        return;
      }
      setHistory(prev => [...prev, { prompt: 'Email:', value: val }]);
      setFormData(prev => ({ ...prev, email: val }));
      setStep('message');
      setInputValue('');
      setErrorLine('');
    } else if (step === 'message') {
      if (!val) {
        setErrorLine('Message cannot be empty.');
        return;
      }
      setHistory(prev => [...prev, { prompt: 'Message:', value: val }]);
      setFormData(prev => ({ ...prev, message: val }));
      setStep('sending');
      setInputValue('');
      setErrorLine('');
      
      // Send via EmailJS
      try {
        const finalName = formData.name;
        const finalEmail = formData.email;
        const finalMessage = val;

        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            from_name: finalName,
            from_email: finalEmail,
            message: finalMessage,
            to_name: 'Rishabh'
          },
          EMAILJS_PUBLIC_KEY
        );
        setStep('success');
      } catch (err) {
        console.error('EmailJS error:', err);
        setStep('error');
      }
      
      setTimeout(() => {
        onExit();
      }, 1800);
    }
  };

  const handleKeyDown = async (e) => {
    e.stopPropagation(); // Prevent terminal window listener from accidentally stealing focus on mobile
    if (e.key === 'c' && e.ctrlKey) {
      onExit();
      return;
    }
  };

  return (
    <div 
      className="shell-demo p-4 rounded bg-stone-900/50 border border-stone-700 mt-2 mb-2 font-mono text-sm shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]" 
      style={{ color: 'var(--color-primary)' }}
      onClick={handleClick}
    >
      <div className="mb-4 font-bold" style={{ color: 'var(--color-accent)' }}>
        --- INITIATING SECURE COMMLINK ---
      </div>
      
      {history.map((h, i) => (
        <div key={i} className="mb-2">
          <span style={{ color: 'var(--color-secondary)' }}>{h.prompt}</span> {sanitizeHtml(h.value)}
        </div>
      ))}
      
      {errorLine && (
        <div className="mb-2" style={{ color: 'var(--color-error, #f87171)' }}>
          {errorLine}
        </div>
      )}
      
      {step === 'sending' && (
        <div className="animate-pulse font-bold" style={{ color: 'var(--color-accent)' }}>
          Transmitting message...
        </div>
      )}
      
      {step === 'success' && (
        <div className="mt-2 font-bold" style={{ color: 'var(--color-success, #4ade80)' }}>
          Message sent successfully! Closing comms...
        </div>
      )}
      
      {step === 'error' && (
        <div className="mt-2 text-red-500 font-bold" style={{ color: 'var(--color-error, #f87171)' }}>
          Transmission failed. Please try again later. Closing comms...
        </div>
      )}

      {(step === 'name' || step === 'email' || step === 'message') && (
        <form onSubmit={handleSubmitFlow} className="flex">
          <span style={{ color: 'var(--color-secondary)' }} className="mr-2 whitespace-nowrap">
            {step === 'name' ? 'Name:' : step === 'email' ? 'Email:' : 'Message:'}
          </span>
          <input
            ref={inputRef}
            type={step === 'email' ? 'email' : 'text'}
            enterKeyHint={step === 'message' ? 'send' : 'next'}
            className="flex-grow bg-transparent border-none outline-none font-mono"
            style={{ color: 'inherit' }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck="false"
          />
        </form>
      )}
      
      {(step === 'name' || step === 'email' || step === 'message') && (
        <div className="text-xs mt-4 opacity-50 select-none">
          Press ENTER to submit. Ctrl+C to abort.
        </div>
      )}
    </div>
  );
}
