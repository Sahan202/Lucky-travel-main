import { FormEvent, useEffect, useRef, useState } from 'react';
import { Bot, CalendarDays, Check, ExternalLink, LoaderCircle, MessageCircle, Send, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
type Language = 'English' | 'Sinhala' | 'Tamil';
type Recommendation = { id: string; name: string; price: string; duration: string };
type Message = { role: 'user' | 'assistant'; content: string; recommendations?: Recommendation[]; whatsappUrl?: string; requestedField?: string | null };
type BookingStatus = 'pending' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';

const welcomes: Record<Language, string> = {
  English: 'Ayubowan! I can find packages, answer Sri Lanka travel questions, and help with bookings.',
  Sinhala: 'ආයුබෝවන්! Packages සොයන්න, ශ්‍රී ලංකා සංචාරක තොරතුරු ලබාගන්න සහ booking එකක් කරන්න මට පුළුවන්.',
  Tamil: 'வணக்கம்! பயணத் தொகுப்புகளை தேடவும், இலங்கை பயண தகவல்களை பெறவும், booking செய்யவும் உதவுகிறேன்.'
};

const calendarCopy: Record<Language, { title: string; hint: string; button: string }> = {
  English: { title: 'Choose your travel date', hint: 'Select your preferred departure date', button: 'Confirm travel date' },
  Sinhala: { title: 'ඔබගේ ගමන් දිනය තෝරන්න', hint: 'ඔබ කැමති පිටත්වීමේ දිනය තෝරන්න', button: 'ගමන් දිනය තහවුරු කරන්න' },
  Tamil: { title: 'உங்கள் பயணத் தேதியைத் தேர்ந்தெடுக்கவும்', hint: 'நீங்கள் விரும்பும் புறப்படும் தேதியைத் தேர்ந்தெடுக்கவும்', button: 'பயணத் தேதியை உறுதிப்படுத்தவும்' }
};

const statusCopy: Record<Language, Record<BookingStatus, (destination: string) => string>> = {
  English: {
    pending: destination => `Your ${destination || 'travel'} booking request has been received. Our team will review it shortly.`,
    contacted: destination => `Our travel team has started following up on your ${destination || 'travel'} booking request. Please check your phone or WhatsApp.`,
    confirmed: destination => `Great news! Your ${destination || 'travel'} booking has been confirmed by Lucky Travel.`,
    completed: destination => `Your ${destination || 'travel'} booking has been marked as completed. Thank you for choosing Lucky Travel!`,
    cancelled: destination => `Your ${destination || 'travel'} booking has been cancelled. Contact us if you would like to make a new arrangement.`
  },
  Sinhala: {
    pending: destination => `ඔබගේ ${destination || 'සංචාර'} booking request එක ලැබී ඇත. අපගේ team එක ඉක්මනින් එය පරීක්ෂා කරනු ඇත.`,
    contacted: destination => `ඔබගේ ${destination || 'සංචාර'} booking request එක ගැන අපගේ travel team එක කටයුතු ආරම්භ කර ඇත. Phone හෝ WhatsApp පරීක්ෂා කරන්න.`,
    confirmed: destination => `සුභ ආරංචියක්! ඔබගේ ${destination || 'සංචාර'} booking එක Lucky Travel විසින් තහවුරු කර ඇත.`,
    completed: destination => `ඔබගේ ${destination || 'සංචාර'} booking එක completed ලෙස සටහන් කර ඇත. Lucky Travel තෝරාගැනීම ගැන ස්තුතියි!`,
    cancelled: destination => `ඔබගේ ${destination || 'සංචාර'} booking එක අවලංගු කර ඇත. අලුත් arrangement එකක් සඳහා අපව සම්බන්ධ කරගන්න.`
  },
  Tamil: {
    pending: destination => `உங்கள் ${destination || 'பயண'} booking கோரிக்கை பெறப்பட்டது. எங்கள் குழு விரைவில் அதைப் பரிசீலிக்கும்.`,
    contacted: destination => `உங்கள் ${destination || 'பயண'} booking கோரிக்கையை எங்கள் பயணக் குழு கவனிக்கத் தொடங்கியுள்ளது. Phone அல்லது WhatsApp-ஐ பார்க்கவும்.`,
    confirmed: destination => `நல்ல செய்தி! உங்கள் ${destination || 'பயண'} booking Lucky Travel மூலம் உறுதிப்படுத்தப்பட்டது.`,
    completed: destination => `உங்கள் ${destination || 'பயண'} booking completed எனக் குறிக்கப்பட்டுள்ளது. Lucky Travel-ஐ தேர்ந்தெடுத்ததற்கு நன்றி!`,
    cancelled: destination => `உங்கள் ${destination || 'பயண'} booking ரத்து செய்யப்பட்டது. புதிய ஏற்பாட்டிற்கு எங்களைத் தொடர்புகொள்ளவும்.`
  }
};

export default function AIChatbot() {
  const [sessionId] = useState(() => {
    const stored = localStorage.getItem('luckyTravelChatSession');
    if (stored) return stored;
    const created = crypto.randomUUID();
    localStorage.setItem('luckyTravelChatSession', created);
    return created;
  });
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('English');
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: welcomes.English }]);
  const [input, setInput] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const latestMessage = messages[messages.length - 1];
  const isDateRequested = latestMessage?.role === 'assistant' && latestMessage.requestedField === 'travelDate';

  useEffect(() => {
    if (!isDateRequested) setSelectedDate('');
  }, [isDateRequested]);

  useEffect(() => {
    if (!open) return;
    let active = true;
    const storageKey = `luckyTravelBookingStatus:${sessionId}`;
    const visibleStatuses: BookingStatus[] = ['pending', 'contacted', 'confirmed', 'completed', 'cancelled'];

    const checkBookingStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/api/ai/booking-status/${encodeURIComponent(sessionId)}`);
        if (!response.ok || !active) return;
        const data = await response.json();
        if (!data.found || !visibleStatuses.includes(data.status)) return;

        const updateKey = `${data.status}:${data.statusUpdatedAt || ''}`;
        if (localStorage.getItem(storageKey) === updateKey) return;
        localStorage.setItem(storageKey, updateKey);
        const status = data.status as BookingStatus;
        setMessages(previous => [...previous, { role: 'assistant', content: statusCopy[language][status](data.destination || '') }]);
      } catch {
        // A temporary status check failure should not interrupt the chat.
      }
    };

    void checkBookingStatus();
    const interval = window.setInterval(checkBookingStatus, 12000);
    return () => { active = false; window.clearInterval(interval); };
  }, [open, sessionId, language]);
  const changeLanguage = (next: Language) => {
    setLanguage(next);
    setMessages([{ role: 'assistant', content: welcomes[next] }]);
  };

  const sendText = async (rawText: string) => {
    const text = rawText.trim();
    if (!text || loading) return;
    const userMessage: Message = { role: 'user', content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: text, language, history: messages.map(({ role, content }) => ({ role, content })) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      const dateQuestion = `${data.reply || ''} ${data.nextQuestion || ''}`;
      const requestedField = data.requestedField || (/travel date|ගමන් දිනය|பயணத் தேதி/i.test(dateQuestion) ? 'travelDate' : null);
      const content = requestedField === 'travelDate'
        ? (data.reply || data.nextQuestion)
        : [data.reply, data.nextQuestion].filter(Boolean).join('\n\n');
      setMessages(previous => [...previous, { role: 'assistant', content, recommendations: data.recommendations || [], whatsappUrl: data.needsHuman ? data.whatsappUrl : undefined, requestedField }]);
    } catch {
      setMessages(previous => [...previous, { role: 'assistant', content: 'Sorry, I could not connect right now. Please use WhatsApp to contact our team.', whatsappUrl: 'https://wa.me/94741105548' }]);
    } finally { setLoading(false); }
  };

  const send = (event: FormEvent) => {
    event.preventDefault();
    void sendText(input);
  };

  const confirmDate = () => {
    if (!selectedDate) return;
    const date = selectedDate;
    setSelectedDate('');
    void sendText(`My travel date is ${date}`);
  };

  return <>
    <button onClick={() => setOpen(true)} aria-label="Open AI travel assistant" className={`fixed bottom-6 left-6 z-[70] flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 p-4 font-semibold text-white shadow-2xl transition hover:scale-105 ${open ? 'pointer-events-none scale-75 opacity-0' : ''}`}>
      <MessageCircle size={25} /><span className="hidden sm:inline">AI Travel Assistant</span>
    </button>
    {open && <div className="fixed bottom-4 left-4 right-4 z-[80] flex h-[min(680px,calc(100vh-2rem))] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:left-6 sm:right-auto sm:w-[400px] dark:border-slate-700 dark:bg-slate-900">
      <div className="bg-gradient-to-r from-slate-950 to-blue-950 p-4 text-white"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="rounded-full bg-cyan-400/20 p-2 text-cyan-300"><Bot size={22} /></span><div><p className="font-bold">Lucky AI Assistant</p><p className="text-xs text-cyan-200">Online · Travel help</p></div></div><button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-white/10"><X size={20} /></button></div>
        <div className="mt-3 flex gap-2">{(['English', 'Sinhala', 'Tamil'] as Language[]).map(item => <button key={item} onClick={() => changeLanguage(item)} className={`rounded-full px-3 py-1 text-xs ${language === item ? 'bg-cyan-400 text-slate-950' : 'bg-white/10 text-white'}`}>{item}</button>)}</div>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4 dark:bg-slate-950">{messages.map((message, index) => <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm ${message.role === 'user' ? 'rounded-br-md bg-blue-600 text-white' : 'rounded-bl-md bg-white text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200'}`}><p className="whitespace-pre-line">{message.content}</p>
        {message.recommendations && message.recommendations.length > 0 && <div className="mt-3 space-y-2">{message.recommendations.map(item => <a href={`/tour/${item.id}`} key={item.id} className="block rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-700"><p className="font-bold">{item.name}</p><p className="mt-1 text-xs text-cyan-600 dark:text-cyan-300">{item.duration} · {item.price}</p></a>)}</div>}
        {message.whatsappUrl && <a href={message.whatsappUrl} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-green-500 px-3 py-2 font-semibold text-white">Continue on WhatsApp <ExternalLink size={14} /></a>}
        {message.requestedField === 'travelDate' && index === messages.length - 1 && <div className="mt-4 overflow-hidden rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-blue-50 shadow-sm dark:border-cyan-800/70 dark:from-cyan-950/60 dark:via-slate-900 dark:to-blue-950/60"><div className="flex items-center gap-3 border-b border-cyan-100 p-3.5 dark:border-cyan-900/60"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-md"><CalendarDays size={20} /></span><div><p className="font-bold text-slate-900 dark:text-white">{calendarCopy[language].title}</p><p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{calendarCopy[language].hint}</p></div></div><div className="p-3.5"><div className="relative flex w-full items-center rounded-xl border border-slate-200 bg-white px-3 shadow-sm transition hover:border-cyan-400 dark:border-slate-700 dark:bg-slate-800"><CalendarDays size={17} className="pointer-events-none text-cyan-600 dark:text-cyan-300" /><input ref={dateInputRef} type="date" min={new Date().toISOString().split('T')[0]} value={selectedDate} onChange={event => setSelectedDate(event.target.value)} aria-label={calendarCopy[language].title} className="w-full cursor-pointer bg-transparent px-3 py-3 text-sm font-semibold text-slate-800 outline-none dark:text-white [color-scheme:light] dark:[color-scheme:dark]" /></div><button type="button" disabled={!selectedDate || loading} onClick={confirmDate} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"><Check size={17} />{calendarCopy[language].button}</button></div></div>}
      </div></div>)}{loading && <div className="flex items-center gap-2 text-sm text-slate-500"><LoaderCircle className="animate-spin" size={17} /> Assistant is typing...</div>}<div ref={endRef} /></div>
      <div className="border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"><div className="mb-2 flex gap-2 overflow-x-auto pb-1">{['Packages below $500', 'Wildlife tours', 'I want to book'].map(prompt => <button key={prompt} onClick={() => setInput(prompt)} className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{prompt}</button>)}</div><form onSubmit={send} className="flex gap-2"><input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about your Sri Lanka trip..." className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" /><button disabled={loading || !input.trim()} className="rounded-xl bg-blue-600 p-3 text-white disabled:opacity-50"><Send size={19} /></button></form></div>
    </div>}
  </>;
}
