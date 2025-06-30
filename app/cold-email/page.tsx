'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { getRunner } from 'langbase';

const initialFormData = {
  recipientName: 'Neo',
  recipientTitle: '',
  recipientCompany: '',
  senderName: '',
  senderTitle: '',
  senderCompany: '',
  purpose: '',
  valueProposition: '',
  personalization: '',
};

export default function ColdEmailGeneratorPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedEmail('');
    setError('');

    const prompt = `
      Write a professional and compelling cold email based on the following details:
      - Recipient Name: ${formData.recipientName}
      - Recipient Title: ${formData.recipientTitle}
      - Recipient Company: ${formData.recipientCompany}
      - Sender Name: ${formData.senderName}
      - Sender Title: ${formData.senderTitle}
      - Sender Company: ${formData.senderCompany}
      - Purpose of Email: ${formData.purpose}
      - Key Value Proposition: ${formData.valueProposition}
      - Personalization Point: ${formData.personalization}
    `;

    try {
      const response = await fetch('/langbase/pipe/run-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const runner = getRunner(response.body);

      runner.on('content', (content) => {
        setGeneratedEmail(prev => prev + content);
      });

      runner.on('error', (err) => {
        setError(`Stream error: ${err.message}`);
        setIsLoading(false);
      });

      runner.on('end', () => {
        setIsLoading(false);
      });

    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-neutral-900 text-white font-geist overflow-x-hidden antialiased selection:bg-indigo-600/30">
      {/* Header */}
      <header className="relative z-10">
        <nav className="flex lg:px-10 pt-4 pr-6 pb-4 pl-6 items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <span className="text-base font-semibold tracking-tight">ColdReach</span>
            <span className="text-base font-semibold tracking-tight text-indigo-400">AI</span>
          </a>
          <div className="flex items-center gap-3">
            <img src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=1080&q=80" alt="Your avatar" className="w-9 h-9 ring-2 ring-neutral-800 object-cover rounded-full" />
          </div>
        </nav>
        <div className="h-px bg-white/10"></div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-3xl pt-14 lg:pt-20 px-6 lg:px-10 text-center space-y-6 mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight font-bricolage">
          Craft perfect cold emails, instantly.
        </h1>
        <p className="text-neutral-400 text-base md:text-lg leading-relaxed">
          Fill in the details below and let our AI-powered pipe generate a personalized, professional cold email designed to get replies.
        </p>
      </section>

      {/* Main Content */}
      <main id="main" className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-lg ring-1 ring-white/10 rounded-3xl p-6 flex flex-col gap-6">
          <h2 className="text-xl font-semibold tracking-tight text-white font-bricolage">Email Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Recipient Name" name="recipientName" value={formData.recipientName} onChange={handleChange} placeholder="e.g., Sarah Johnson" />
            <InputField label="Recipient Title" name="recipientTitle" value={formData.recipientTitle} onChange={handleChange} placeholder="e.g., CTO" />
            <InputField label="Recipient Company" name="recipientCompany" value={formData.recipientCompany} onChange={handleChange} placeholder="e.g., TechStart Inc." />
            <InputField label="Your Name" name="senderName" value={formData.senderName} onChange={handleChange} placeholder="e.g., John Smith" />
            <InputField label="Your Title" name="senderTitle" value={formData.senderTitle} onChange={handleChange} placeholder="e.g., Head of Sales" />
            <InputField label="Your Company" name="senderCompany" value={formData.senderCompany} onChange={handleChange} placeholder="e.g., CloudSync Solutions" />
          </div>

          <InputField label="Purpose of Email" name="purpose" value={formData.purpose} onChange={handleChange} placeholder="e.g., Introduce our project management SaaS" />
          <InputField label="Key Value Proposition" name="valueProposition" value={formData.valueProposition} onChange={handleChange} placeholder="e.g., 40% faster project delivery" />
          <InputField label="Personalization Point" name="personalization" value={formData.personalization} onChange={handleChange} placeholder="e.g., I saw you recently raised Series A" />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed transition focus-visible:ring-2 ring-offset-2 ring-indigo-500"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate Email'}
          </button>
        </form>

        {/* Output Area */}
        <section className="bg-white/5 backdrop-blur-lg ring-1 ring-white/10 rounded-3xl p-6 flex flex-col">
          <h2 className="text-xl font-semibold tracking-tight text-white font-bricolage mb-4">Generated Email</h2>
          <div className="flex-grow bg-neutral-900/50 rounded-2xl p-4 overflow-y-auto">
            {isLoading && !generatedEmail && (
              <div className="flex items-center justify-center h-full text-neutral-400">
                <Loader2 className="w-8 h-8 animate-spin mr-4" />
                Generating your email...
              </div>
            )}
            {error && <div className="text-red-400 whitespace-pre-wrap">{error}</div>}
            {generatedEmail && <pre className="text-sm text-neutral-200 whitespace-pre-wrap font-geist">{generatedEmail}</pre>}
            {!isLoading && !generatedEmail && !error && (
              <div className="flex items-center justify-center h-full text-neutral-500">
                Your generated email will appear here.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

interface InputFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
}

const InputField = ({ label, name, value, onChange, placeholder }: InputFieldProps) => (
  <div>
    <label className="block text-sm font-medium text-neutral-300 mb-1.5">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:outline-none transition"
    />
  </div>
); 