'use client';

import { useState } from 'react';


export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    // Simulate API call – replace with your actual newsletter service
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Newsletter signup:', email);
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="flex-1 px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-black"
        required
        disabled={status === 'loading'}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition disabled:opacity-50"
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  );
}