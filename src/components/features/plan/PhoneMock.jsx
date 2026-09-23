import React, { useEffect, useRef, useState } from 'react';
import { usePlanStore } from '../../../store/usePlanStore';

export const PhoneMock = ({ onClose }) => {
  const {
    technicians,
    activeTechName,
    setActiveTechName,
    phoneScreen,
    setPhoneScreen,
    chats,
    unreadCounts,
    sendUserChatMessage,
    sendPhotoMessage,
    sendVoiceMessage
  } = usePlanStore();

  const [inputText, setInputText] = useState('');
  const [inboxFilter, setInboxFilter] = useState('ALL'); // 'ALL', 'A', 'B', 'C'
  const [searchQuery, setSearchQuery] = useState('');
  const [callModal, setCallModal] = useState(null); // 'audio', 'video' or null
  const chatContainerRef = useRef(null);

  // Live real-time clock for mobile phone status bar
  const [realTime, setRealTime] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  });

  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      setRealTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeChat = chats[activeTechName] || [];
  const currentTech = technicians.find((t) => t.name === activeTechName) || {
    name: 'OpsGroup',
    fullName: 'Magpet Unit 3 Ops Broadcast',
    trade: 'Plant Broadcast Channel',
    shift: 'A/B/C',
    avatarBg: 'bg-indigo-700',
    status: '5 Members · Kharagpur Operations'
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [activeChat, phoneScreen]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    sendUserChatMessage(activeTechName, inputText);
    setInputText('');
  };

  const quickReplies = [
    { label: 'ACK · Reaching bay', text: 'ACK · Work order accepted. Reaching bay in 5-10 min.' },
    { label: 'Thermal scan 78°C · Normal', text: 'Thermal scan reading 78.4°C on housing. Within safe threshold.' },
    { label: 'Hold · Need spare', text: 'Work order on hold · Need replacement bearing from stores.' },
    { label: 'Work completed · Sign off', text: 'Work completed and verified. Ready for SAP B1 sign-off.' }
  ];

  // Filter technicians based on shift filter and search query
  const filteredTechs = technicians.filter((tech) => {
    const matchesFilter = inboxFilter === 'ALL' || tech.shift === inboxFilter;
    const matchesSearch =
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.trade.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="relative mx-auto select-none w-[275px]">
      {/* iPhone Outer Chassis / Titanium Frame (Optimal 275px x 570px Flagship Proportions) */}
      <div className="relative w-[275px] h-[570px] bg-slate-950 rounded-[42px] p-2 shadow-2xl ring-1 ring-slate-800 border-[2.5px] border-slate-700/90 mx-auto">
        
        {/* Hardware Silent / Volume Buttons (Left side) */}
        <div className="absolute -left-[3.5px] top-[75px] w-[2.5px] h-5 bg-slate-700 rounded-l-xs" />
        <div className="absolute -left-[3.5px] top-[105px] w-[2.5px] h-9 bg-slate-700 rounded-l-xs" />
        <div className="absolute -left-[3.5px] top-[122px] w-[2.5px] h-9 bg-slate-700 rounded-l-xs" />

        {/* Hardware Power Button (Right side) */}
        <div className="absolute -right-[3.5px] top-[100px] w-[2.5px] h-10 bg-slate-700 rounded-r-xs" />

        {/* Screen Bezel & OLED Display */}
        <div className="relative w-full h-full bg-[#111b21] rounded-[34px] overflow-hidden flex flex-col border border-slate-900 shadow-inner">
          
          {/* iOS Status Bar with Live Real Time Clock */}
          <div className="h-6 bg-[#075E54] dark:bg-[#1f2c34] text-white dark:text-[#8696a0] px-4 flex items-center justify-between z-30 pt-0.5 shrink-0 transition-colors">
            <span className="text-[10px] font-semibold tracking-tight font-mono">{realTime}</span>

            {/* Dynamic Island */}
            <div className="w-16 h-3 bg-black rounded-full flex items-center justify-end px-1.5 gap-1 shadow-xs">
              <span className="w-1 h-1 rounded-full bg-slate-900 border border-slate-800 inline-block" />
              <span className="w-0.5 h-0.5 rounded-full bg-[#075e54]/80 dark:bg-[#00a884]/80 inline-block" />
            </div>

            {/* Signal & Battery Icons */}
            <div className="flex items-center gap-1 text-[9px]">
              <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                <path d="M2 17h3v4H2v-4zm5-4h3v8H7v-8zm5-4h3v12h-3V9zm5-5h3v17h-3V4z"/>
              </svg>
              <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4z"/>
              </svg>
              <div className="w-3.5 h-1.5 border border-white/80 dark:border-slate-400 rounded-2xs p-0.5 flex items-center">
                <div className="h-full w-full bg-white dark:bg-slate-300 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* ================= VIEW 1: WHATSAPP CHATS INBOX LIST ================= */}
          {phoneScreen === 'inbox' ? (
            <div className="flex-1 flex flex-col bg-white dark:bg-[#111b21] overflow-hidden transition-colors">
              
              {/* WhatsApp Business Top Bar */}
              <div className="bg-[#075E54] dark:bg-[#1f2c34] text-white dark:text-[#e9edef] px-3 py-2 flex items-center justify-between shadow-xs shrink-0 border-b border-transparent dark:border-[#222d34] transition-colors">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs tracking-tight">
                    WhatsApp Business
                  </span>
                  <span className="text-[8.5px] bg-emerald-600 dark:bg-[#00a884] px-1 py-0.2 rounded text-white dark:text-[#111b21] font-mono font-bold">
                    Unit 3
                  </span>
                </div>
                <span className="text-[9px] bg-white/20 dark:bg-white/10 px-1.5 py-0.2 rounded font-mono text-white dark:text-[#8696a0]">
                  8 Techs
                </span>
              </div>

              {/* Search Bar */}
              <div className="bg-[#075E54] dark:bg-[#1f2c34] px-2.5 pb-2 shrink-0 transition-colors">
                <div className="relative flex items-center bg-white/10 dark:bg-[#111b21] rounded-md px-2 py-1 text-white dark:text-[#e9edef] border border-transparent dark:border-[#222d34]">
                  <svg className="w-3 h-3 mr-1 text-white/60 dark:text-[#8696a0] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search technician or trade..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-[10px] text-white dark:text-[#e9edef] placeholder-white/60 dark:placeholder-[#8696a0] focus:outline-hidden"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-white/60 dark:text-[#8696a0] text-xs px-1 cursor-pointer hover:text-white dark:hover:text-[#e9edef]"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Shift Filter Tabs */}
              <div className="bg-slate-100 dark:bg-[#111b21] px-2 py-1 flex items-center gap-1 text-[9px] font-bold border-b border-slate-200 dark:border-[#222d34] shrink-0 transition-colors">
                {['ALL', 'A', 'B', 'C'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setInboxFilter(f)}
                    className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                      inboxFilter === f
                        ? 'bg-[#075E54] dark:bg-[#00a884] text-white dark:text-[#111b21] font-bold'
                        : 'bg-white dark:bg-[#202c33] text-slate-600 dark:text-[#8696a0] border border-slate-200 dark:border-[#2a3942] hover:bg-slate-50 dark:hover:bg-[#2a3942] dark:hover:text-[#e9edef]'
                    }`}
                  >
                    {f === 'ALL' ? 'All (5)' : `Shift ${f}`}
                  </button>
                ))}
              </div>

              {/* Technician & Group Conversations List (Spacious 400px+ height) */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-[#222d34] bg-white dark:bg-[#111b21] transition-colors">
                
                {/* Fixed Group: Magpet Ops Broadcast */}
                {inboxFilter === 'ALL' && !searchQuery && (
                  <div
                    onClick={() => setActiveTechName('OpsGroup')}
                    className="p-2.5 hover:bg-indigo-50/60 dark:hover:bg-[#202c33] transition-colors cursor-pointer flex items-center gap-2 bg-slate-50/50 dark:bg-[#182229]/60"
                  >
                    <div className="relative shrink-0">
                      <div className="w-8 h-8 rounded-full bg-indigo-700 dark:bg-indigo-600 text-white font-mono font-bold flex items-center justify-center text-[10px] shadow-2xs">
                        OPS
                      </div>
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-[#111b21]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between">
                        <span className="font-bold text-[11px] text-indigo-950 dark:text-[#e9edef] truncate">
                          Plant 3 Ops Broadcast
                        </span>
                        <span className="font-mono text-[8.5px] text-slate-400 dark:text-[#8696a0]">
                          {chats.OpsGroup?.[chats.OpsGroup.length - 1]?.time || realTime}
                        </span>
                      </div>
                      <div className="text-[9.5px] text-slate-500 dark:text-[#8696a0] truncate mt-0.5">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Target:</span> 125 MT rPET pellets
                      </div>
                    </div>
                  </div>
                )}

                {/* Individual Technicians */}
                {filteredTechs.map((tech) => {
                  const techMessages = chats[tech.name] || [];
                  const lastMsg = techMessages[techMessages.length - 1];
                  const unread = unreadCounts[tech.name] || 0;

                  return (
                    <div
                      key={tech.id}
                      onClick={() => setActiveTechName(tech.name)}
                      className="p-2.5 hover:bg-slate-50 dark:hover:bg-[#202c33] transition-colors cursor-pointer flex items-center gap-2 group"
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className={`w-8 h-8 rounded-full ${tech.avatarBg} text-white font-bold flex items-center justify-center text-xs shadow-2xs`}>
                          {tech.name[0]}
                        </div>
                        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-[#111b21]" />
                      </div>

                      {/* Contact & Message Preview */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between">
                          <span className="font-bold text-[11px] text-slate-900 dark:text-[#e9edef] truncate group-hover:text-[#075E54] dark:group-hover:text-[#00a884] transition-colors">
                            {tech.fullName}
                          </span>
                          <span className="font-mono text-[8.5px] text-slate-400 dark:text-[#8696a0]">
                            {lastMsg?.time || realTime}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-[9px] leading-tight mt-0.5">
                          <span className="bg-slate-100 dark:bg-[#202c33] text-slate-600 dark:text-[#8696a0] px-1 py-0.2 rounded font-mono text-[8px] border border-transparent dark:border-[#2a3942]">
                            Shift {tech.shift}
                          </span>
                          <span className="text-slate-400 dark:text-[#8696a0]">·</span>
                          <span className="text-slate-500 dark:text-[#8696a0] truncate">{tech.trade}</span>
                        </div>

                        <div className="flex items-center justify-between mt-1">
                          <p className="text-[10px] text-slate-500 dark:text-[#8696a0] truncate pr-1 flex items-center gap-1">
                            <span className="text-blue-500 dark:text-[#53bdeb] font-bold text-[9px]">✓✓</span>
                            <span>{lastMsg ? lastMsg.body.replace(/<[^>]*>?/gm, '').slice(0, 26) + '...' : 'Schedule active'}</span>
                          </p>
                          {unread > 0 ? (
                            <span className="bg-emerald-600 dark:bg-[#00a884] text-white dark:text-[#111b21] font-bold text-[8.5px] w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 shadow-2xs">
                              {unread}
                            </span>
                          ) : (
                            <span className="text-[8.5px] text-emerald-600 dark:text-[#00a884] font-semibold group-hover:translate-x-0.5 transition-transform">
                              Chat
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredTechs.length === 0 && (
                  <div className="p-8 text-center text-slate-400 dark:text-[#8696a0] text-xs">
                    No technicians found matching criteria.
                  </div>
                )}
              </div>

              {/* Bottom Info */}
              <div className="p-2 bg-slate-50 dark:bg-[#182229] border-t border-slate-200 dark:border-[#222d34] text-center shrink-0 transition-colors">
                <span className="text-[9.5px] text-slate-500 dark:text-[#8696a0] font-medium">
                  Tap any technician to open live chat simulation
                </span>
              </div>
            </div>
          ) : (
            /* ================= VIEW 2: INDIVIDUAL TECHNICIAN CHAT ================= */
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* WhatsApp Chat Top Header */}
              <div className="bg-[#075E54] dark:bg-[#1f2c34] text-white dark:text-[#e9edef] px-2 py-1.5 flex items-center justify-between shadow-xs z-20 shrink-0 border-b border-transparent dark:border-[#222d34] transition-colors">
                <div className="flex items-center gap-1.5 min-w-0">
                  
                  {/* Back to All Chats Button */}
                  <button
                    onClick={() => setPhoneScreen('inbox')}
                    className="flex items-center gap-0.5 text-white dark:text-[#e9edef] bg-white/15 dark:bg-[#2a3942] hover:bg-white/25 dark:hover:bg-[#374248] px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors shrink-0"
                    title="Back to All Technicians"
                  >
                    <span>‹</span>
                    <span>All</span>
                  </button>
                  
                  {/* Contact Avatar */}
                  <div className="relative shrink-0">
                    <div className={`w-6 h-6 rounded-full ${currentTech.avatarBg} border border-white/20 flex items-center justify-center font-bold text-[10px] text-white shadow-2xs`}>
                      {currentTech.name[0]}
                    </div>
                    <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-emerald-400 border border-[#075E54] dark:border-[#1f2c34]" />
                  </div>

                  {/* Name & Subtitle */}
                  <div className="min-w-0">
                    <div className="font-bold text-[10.5px] truncate leading-tight flex items-center gap-1 text-white dark:text-[#e9edef]">
                      <span>{currentTech.name}</span>
                      <span className="text-[8.5px] font-normal text-emerald-200 dark:text-[#8696a0] font-mono">({currentTech.shift})</span>
                    </div>
                    <div className="text-[8px] text-emerald-200 dark:text-[#8696a0] truncate leading-tight flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-300 dark:bg-[#00a884] inline-block animate-pulse" />
                      <span>{currentTech.status || 'Online'}</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Call & Action Buttons */}
                <div className="flex items-center gap-1 text-white/90 dark:text-[#8696a0] shrink-0">
                  <button
                    onClick={() => setCallModal('audio')}
                    className="p-1 hover:bg-white/10 dark:hover:bg-[#2a3942] rounded cursor-pointer transition-colors hover:text-white dark:hover:text-[#e9edef]"
                    title="Simulate Voice Call"
                  >
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.44-5.15-3.75-6.59-6.59l1.97-1.57c.28-.28.36-.67.25-1.02A11.36 11.36 0 018.57 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.62c0-.55-.45-1-.99-1z"/>
                    </svg>
                  </button>

                  <button
                    onClick={() => setCallModal('video')}
                    className="p-1 hover:bg-white/10 dark:hover:bg-[#2a3942] rounded cursor-pointer transition-colors hover:text-white dark:hover:text-[#e9edef]"
                    title="Simulate Video Inspection"
                  >
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Interactive Quick Reply Action Chips Bar */}
              <div className="bg-[#E2D9CE] dark:bg-[#182229] px-1.5 py-1 flex items-center gap-1 overflow-x-auto border-b border-slate-300/60 dark:border-[#222d34] shrink-0 no-scrollbar transition-colors">
                {quickReplies.map((qr, i) => (
                  <button
                    key={i}
                    onClick={() => sendUserChatMessage(activeTechName, qr.text)}
                    className="whitespace-nowrap bg-white dark:bg-[#202c33] hover:bg-slate-50 dark:hover:bg-[#2a3942] text-[8.5px] font-medium text-slate-800 dark:text-[#e9edef] px-2 py-0.5 rounded-full border border-slate-300 dark:border-[#2a3942] shadow-2xs cursor-pointer shrink-0 transition-colors"
                  >
                    {qr.label}
                  </button>
                ))}
              </div>

              {/* WhatsApp Chat Messages Stream (Spacious 340px+ scrollable area) */}
              <div
                ref={chatContainerRef}
                className="flex-1 min-h-0 whatsapp-chat-bg overflow-y-auto p-2.5 space-y-2 relative transition-colors"
              >
                {/* Timestamp Banner */}
                <div className="flex justify-center my-0.5">
                  <span className="bg-white/90 dark:bg-[#182229]/90 backdrop-blur-2xs text-[8px] font-mono text-slate-500 dark:text-[#8696a0] uppercase px-2 py-0.2 rounded-full shadow-2xs border border-transparent dark:border-[#222d34]">
                    Today · Shift {currentTech.shift} · SAP Sync
                  </span>
                </div>

                {activeChat.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-lg px-2.5 py-1.5 text-[10.5px] shadow-2xs relative ${
                        msg.isUser
                          ? 'bg-[#E7FFDB] dark:bg-[#005c4b] text-slate-800 dark:text-[#e9edef] rounded-tr-xs'
                          : 'bg-white dark:bg-[#202c33] text-slate-800 dark:text-[#e9edef] rounded-tl-xs border border-slate-200/50 dark:border-[#2a3942]/60'
                      }`}
                    >
                      {msg.title && (
                        <div className="font-mono text-[8.5px] font-bold text-emerald-800 dark:text-[#00a884] tracking-wider mb-0.5 uppercase pb-0.5 border-b border-emerald-100 dark:border-[#2a3942]">
                          {msg.title}
                        </div>
                      )}

                      <div
                        className="text-[10px] leading-relaxed text-slate-800 dark:text-[#e9edef]"
                        dangerouslySetInnerHTML={{ __html: msg.body }}
                      />

                      <div className="flex items-center justify-end gap-1 mt-0.5 text-[8px] text-slate-400 dark:text-[#8696a0] font-mono">
                        <span>{msg.time}</span>
                        {msg.isUser && (
                          <span className="text-blue-500 dark:text-[#53bdeb] font-bold">✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rich Media Action Bar: Photo & Voice note simulator */}
              <div className="bg-[#F0F2F5] dark:bg-[#182229] px-2 py-1 flex items-center justify-between border-t border-slate-200 dark:border-[#222d34] text-[9.5px] transition-colors">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => sendPhotoMessage(activeTechName)}
                    className="flex items-center gap-1 text-slate-700 dark:text-[#e9edef] bg-white dark:bg-[#202c33] hover:bg-slate-100 dark:hover:bg-[#2a3942] px-1.5 py-0.5 rounded border border-slate-300 dark:border-[#2a3942] shadow-2xs cursor-pointer font-medium text-[9px] transition-colors"
                    title="Simulate sending a FLIR Thermal Imaging Photo"
                  >
                    <svg className="w-3 h-3 text-slate-600 dark:text-[#8696a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>FLIR Scan</span>
                  </button>

                  <button
                    onClick={() => sendVoiceMessage(activeTechName)}
                    className="flex items-center gap-1 text-slate-700 dark:text-[#e9edef] bg-white dark:bg-[#202c33] hover:bg-slate-100 dark:hover:bg-[#2a3942] px-1.5 py-0.5 rounded border border-slate-300 dark:border-[#2a3942] shadow-2xs cursor-pointer font-medium text-[9px] transition-colors"
                    title="Simulate sending a Voice Note"
                  >
                    <svg className="w-3 h-3 text-slate-600 dark:text-[#8696a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    <span>Voice Note</span>
                  </button>
                </div>

                <span className="text-[8.5px] font-mono text-slate-400 dark:text-[#8696a0]">
                  2-Way Live
                </span>
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSend}
                className="bg-[#F0F2F5] dark:bg-[#182229] p-1.5 flex items-center gap-1 border-t border-slate-200/80 dark:border-[#222d34] shrink-0 transition-colors"
              >
                <div className="flex-1 bg-white dark:bg-[#2a3942] rounded-full px-2.5 py-1 flex items-center gap-1 border border-slate-300/80 dark:border-[#374248] shadow-2xs transition-colors">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message or ACK..."
                    className="flex-1 bg-transparent text-[10.5px] text-slate-900 dark:text-[#e9edef] placeholder-slate-400 dark:placeholder-[#8696a0] focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    inputText.trim()
                      ? 'bg-[#00A884] hover:bg-[#008f6f] text-white shadow-xs scale-105'
                      : 'bg-slate-300 dark:bg-[#2a3942] text-slate-400 dark:text-[#8696a0] cursor-not-allowed'
                  }`}
                  title="Send Message"
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </button>
              </form>

            </div>
          )}

          {/* Simulated Call Modal */}
          {callModal && (
            <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-between p-4 text-white text-center">
              <div className="mt-4 space-y-1.5">
                <div className={`w-12 h-12 rounded-full ${currentTech.avatarBg} mx-auto flex items-center justify-center text-lg font-bold shadow-lg ring-2 ring-emerald-500/50`}>
                  {currentTech.name[0]}
                </div>
                <div className="font-bold text-xs">{currentTech.fullName}</div>
                <div className="text-[10px] text-emerald-400 font-mono animate-pulse">
                  {callModal === 'video' ? 'Simulating Live Video Inspection...' : 'Simulating Radio Call (Unit 3)...'}
                </div>
              </div>

              <div className="w-full bg-slate-900/80 rounded-lg p-2 border border-slate-800 text-[10px] text-slate-300 space-y-0.5 font-mono">
                <div>Channel: <b>Kharagpur Unit 3 Tech Ops</b></div>
                <div>Extrusion Bay 2 · Line EX-02</div>
                <div className="text-emerald-400">Duplex audio active</div>
              </div>

              <button
                onClick={() => setCallModal(null)}
                className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg cursor-pointer transition-transform hover:scale-105 mb-2 text-sm font-bold"
                title="End Call"
              >
                ✕
              </button>
            </div>
          )}

          {/* iOS Home Bar Indicator */}
          <div className="h-3.5 bg-white/95 dark:bg-[#111b21] flex items-center justify-center shrink-0 transition-colors">
            <div className="w-20 h-1 bg-slate-400 dark:bg-[#8696a0]/40 rounded-full" />
          </div>

        </div>
      </div>

      {/* Spec F-A3 Required Honest Disclaimer Label */}
      <div className="mt-2.5 text-center">
        <span className="inline-block text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 px-2.5 py-1 rounded-md">
          Simulated. The pilot uses the WhatsApp Business API.
        </span>
      </div>
    </div>
  );
};
