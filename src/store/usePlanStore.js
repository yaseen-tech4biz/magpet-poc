import { create } from 'zustand';
import { useToastStore } from './useToastStore';

const TECHNICIANS = [
  { id: 'T1', name: 'Ramesh', fullName: 'Ramesh Sharma', trade: 'Mechanical Specialist', shift: 'A', shiftHours: '06:00–14:00', phone: '+91 98765 00101', avatarBg: 'bg-emerald-700', status: 'Online · At Extrusion Line' },
  { id: 'T2', name: 'Prakash', fullName: 'Prakash Patel', trade: 'Mechanical Maintenance', shift: 'B', shiftHours: '14:00–22:00', phone: '+91 98765 00102', avatarBg: 'bg-blue-700', status: 'Online · Washing Line Bay' },
  { id: 'T3', name: 'Sunil', fullName: 'Sunil Soren', trade: 'Night Shift Lead', shift: 'C', shiftHours: '22:00–06:00', phone: '+91 98765 00103', avatarBg: 'bg-purple-700', status: 'Standby · Handover Complete' },
  { id: 'T4', name: 'Bikash', fullName: 'Bikash Das', trade: 'Electrical & Automation', shift: 'A', shiftHours: '06:00–14:00', phone: '+91 98765 00104', avatarBg: 'bg-amber-700', status: 'Online · Control Room PLC' },
  { id: 'T5', name: 'Joydeep', fullName: 'Joydeep Mukherjee', trade: 'Instrumentation & Sensors', shift: 'B', shiftHours: '14:00–22:00', phone: '+91 98765 00105', avatarBg: 'bg-teal-700', status: 'Online · Calibrating Sensors' },
  { id: 'T6', name: 'Alok', fullName: 'Alok Verma', trade: 'Electrical Systems', shift: 'C', shiftHours: '22:00–06:00', phone: '+91 98765 00106', avatarBg: 'bg-indigo-700', status: 'Standby · Night Electrical' },
  { id: 'T7', name: 'Manoj', fullName: 'Manoj Roy', trade: 'Utilities & Chillers', shift: 'A', shiftHours: '06:00–14:00', phone: '+91 98765 00107', avatarBg: 'bg-cyan-700', status: 'Online · Compressor Room' },
  { id: 'T8', name: 'Debashis', fullName: 'Debashis Paul', trade: 'Utilities & Boilers', shift: 'B', shiftHours: '14:00–22:00', phone: '+91 98765 00108', avatarBg: 'bg-rose-700', status: 'Online · Water Treatment' },
  { id: 'T9', name: 'Sanjay', fullName: 'Sanjay Mishra', trade: 'Hydraulic Systems Lead', shift: 'A', shiftHours: '06:00–14:00', phone: '+91 98765 00109', avatarBg: 'bg-sky-700', status: 'Online · Hydr. Pack Room' },
  { id: 'T10', name: 'Arvind', fullName: 'Arvind Gupta', trade: 'Pneumatics & Valves Specialist', shift: 'B', shiftHours: '14:00–22:00', phone: '+91 98765 00110', avatarBg: 'bg-violet-700', status: 'Online · Valve Manifold #3' },
  { id: 'T11', name: 'Rajesh', fullName: 'Rajesh Kumar', trade: 'Extrusion Line Technician', shift: 'C', shiftHours: '22:00–06:00', phone: '+91 98765 00111', avatarBg: 'bg-orange-700', status: 'Standby · Extruder Die Bay' },
  { id: 'T12', name: 'Deepak', fullName: 'Deepak Sen', trade: 'Preventative Maintenance Inspector', shift: 'A', shiftHours: '06:00–14:00', phone: '+91 98765 00112', avatarBg: 'bg-lime-700', status: 'Online · Inspection Route' }
];

const INITIAL_PLAN = {
  A: [
    { id: 'PA-1', a: 'EX-02', w: 'Gearbox bearing temperature check', why: 'Follow up · last night breakdown', p: 'P1', tech: 'Ramesh', st: 'assigned', holdReason: '' },
    { id: 'PA-2', a: 'WL-01', w: 'Friction washer bearing greasing', why: 'Due by calendar · every 15 d', p: 'P2', tech: 'Prakash', st: 'assigned', holdReason: '' },
    { id: 'PA-3', a: 'DR-01', w: 'Dryer filter inspection', why: 'Due by runtime · 168 h since last', p: 'P3', tech: null, st: 'open', holdReason: '' },
    { id: 'PA-4', a: 'CH-01', w: 'Condenser coil cleaning', why: 'Carried over from yesterday', p: 'P3', tech: 'Prakash', st: 'assigned', holdReason: '' }
  ],
  B: [
    { id: 'PB-1', a: 'EX-01', w: 'Screen changer inspection', why: 'Due by calendar · every 7 d', p: 'P2', tech: 'Bikash', st: 'assigned', holdReason: '' },
    { id: 'PB-2', a: 'SSP-01', w: 'Rotary valve lubrication', why: 'Due by runtime · 502 h since last', p: 'P2', tech: null, st: 'open', holdReason: '' },
    { id: 'PB-3', a: 'CV-02', w: 'Belt tracking adjustment', why: 'Operator report · drifting left', p: 'P3', tech: 'Bikash', st: 'assigned', holdReason: '' }
  ],
  C: [
    { id: 'PC-1', a: 'WL-01', w: 'Float sink tank density check', why: 'Due by calendar · every 3 d', p: 'P2', tech: 'Sunil', st: 'assigned', holdReason: '' },
    { id: 'PC-2', a: 'MS-01', w: 'Metal separator calibration', why: 'Due by calendar · every 30 d', p: 'P3', tech: null, st: 'gap', holdReason: '' }
  ]
};

const getTimeAgo = (minutesAgo) => {
  const d = new Date(Date.now() - minutesAgo * 60000);
  return d.toTimeString().slice(0, 5);
};

const INITIAL_CHATS = {
  Ramesh: [
    {
      id: 'c1',
      from: 'system',
      title: 'MAGPET MAINTENANCE DISPATCH',
      body: 'Good morning Ramesh. Your Shift A schedule is active. Priority 1 task: <b>EX-02 gearbox bearing thermal scan</b>.<br/><span class="text-[10px] text-slate-500 font-mono">Work Order: #WO-2024-0982 · SLA: 45 min</span>',
      time: getTimeAgo(14),
      isUser: false
    },
    {
      id: 'c2',
      from: 'Ramesh',
      title: '',
      body: 'Acknowledged. Heading to extrusion bay with FLIR thermal gun now.',
      time: getTimeAgo(11),
      isUser: true
    }
  ],
  Prakash: [
    {
      id: 'p1',
      from: 'system',
      title: 'MAGPET MAINTENANCE DISPATCH',
      body: 'Task assigned: <b>WL-01 Friction washer bearing greasing</b> (P2). Grease gun NLGI-2 spec.',
      time: getTimeAgo(22),
      isUser: false
    },
    {
      id: 'p2',
      from: 'Prakash',
      title: '',
      body: 'ACK. Greasing lines 1 and 2 friction bearings now. NLGI-2 cartridges stocked.',
      time: getTimeAgo(18),
      isUser: true
    }
  ],
  Sunil: [
    {
      id: 's1',
      from: 'system',
      title: 'SHIFT C HANDOVER SUMMARY',
      body: 'Night shift handoff report: EX-02 trip at 02:40 resolved. Vibration monitoring initiated. Shift output: 38.4 MT.',
      time: getTimeAgo(30),
      isUser: false
    },
    {
      id: 's2',
      from: 'Sunil',
      title: '',
      body: 'Copy that. Temperature holding around 76°C. Log signed off in SAP B1 and handed over to Ramesh.',
      time: getTimeAgo(24),
      isUser: true
    }
  ],
  Bikash: [
    {
      id: 'b1',
      from: 'system',
      title: 'MAGPET MAINTENANCE DISPATCH',
      body: 'Shift A electrical check scheduled for <b>EX-01 screen changer</b> and hydraulic pressure pack.',
      time: getTimeAgo(35),
      isUser: false
    },
    {
      id: 'b2',
      from: 'Bikash',
      title: '',
      body: 'Thermostats verified. Hydraulic pressure steady at 180 bar. Heater band circuits normal.',
      time: getTimeAgo(28),
      isUser: true
    }
  ],
  Joydeep: [
    {
      id: 'j1',
      from: 'system',
      title: 'WORK ORDER ALERT',
      body: 'Work order: <b>DR-02 temperature sensor replacement</b> waiting for RTD probe delivery from stores.',
      time: getTimeAgo(40),
      isUser: false
    },
    {
      id: 'j2',
      from: 'Joydeep',
      title: '',
      body: 'Part requisition PR-992 approved. Waiting for delivery at stores counter.',
      time: getTimeAgo(32),
      isUser: true
    }
  ],
  OpsGroup: [
    {
      id: 'g1',
      from: 'system',
      title: 'PLANT 3 DAILY BRIEFING',
      body: '<b>Kharagpur Unit 3 Shift A Active</b><br/>Target: 125 MT food-grade rPET pellets. Safety reminder: LOTO isolation mandatory before opening friction washer hopper.',
      time: getTimeAgo(55),
      isUser: false
    },
    {
      id: 'g2',
      from: 'Ramesh',
      title: '',
      body: 'Shift A mechanical team present and equipped.',
      time: getTimeAgo(50),
      isUser: true
    },
    {
      id: 'g3',
      from: 'Bikash',
      title: '',
      body: 'Electrical panel safety interlocks inspected. All green.',
      time: getTimeAgo(48),
      isUser: true
    }
  ]
};

export const usePlanStore = create((set, get) => ({
  plan: INITIAL_PLAN,
  technicians: TECHNICIANS,
  activeTechName: 'Ramesh',
  phoneScreen: 'inbox', // 'inbox' (shows all users) or 'chat' (individual user)
  chats: INITIAL_CHATS,
  unreadCounts: { Ramesh: 0, Prakash: 0, Sunil: 0, Bikash: 0, Joydeep: 1, Alok: 0, Manoj: 0, Debashis: 0, OpsGroup: 0 },
  searchTerm: '',

  setSearchTerm: (term) => set({ searchTerm: term }),

  setActiveTechName: (name) => {
    const unreads = { ...get().unreadCounts, [name]: 0 };
    set({ activeTechName: name, phoneScreen: 'chat', unreadCounts: unreads });
  },

  setPhoneScreen: (screen) => set({ phoneScreen: screen }),

  // Full Task Lifecycle Actions
  assignTask: (shift, taskIdx, techName = 'Ramesh') => {
    const currentPlan = JSON.parse(JSON.stringify(get().plan));
    const task = currentPlan[shift][taskIdx];

    task.st = 'ip'; // In Progress
    task.tech = techName;

    const timeStr = new Date().toTimeString().slice(0, 5);

    // Dispatch WhatsApp Notification to Technician
    const sysMsg = {
      id: 'sys-' + Date.now(),
      from: 'system',
      title: 'WORK ORDER DISPATCHED',
      body: `<b>Work Order #${task.id} · ${task.a}</b><br/>${task.w}<ul class="list-disc pl-4 mt-1 text-[11px] text-slate-600"><li>Priority: <b>${task.p}</b></li><li>Trigger: ${task.why}</li><li>SOP: Checklist attached in SAP B1</li></ul>`,
      time: timeStr,
      isUser: false
    };

    const ackMsg = {
      id: 'ack-' + Date.now(),
      from: techName,
      title: '',
      body: `ACK · Work order #${task.id} accepted. Reaching ${task.a} in 5-10 minutes.`,
      time: timeStr,
      isUser: true
    };

    const currentChats = { ...get().chats };
    const techChat = currentChats[techName] || [];
    currentChats[techName] = [...techChat, sysMsg, ackMsg];

    set({
      plan: currentPlan,
      chats: currentChats,
      activeTechName: techName,
      phoneScreen: 'chat'
    });

    useToastStore.getState().addToast({
      title: 'WhatsApp Dispatched',
      message: `Work order #${task.id} dispatched to ${techName} (${task.a})`,
      type: 'whatsapp'
    });
  },

  reassignTask: (shift, taskIdx, newTechName) => {
    const currentPlan = JSON.parse(JSON.stringify(get().plan));
    const task = currentPlan[shift][taskIdx];
    const oldTech = task.tech || 'Unassigned';

    task.tech = newTechName;
    task.st = 'ip';

    const timeStr = new Date().toTimeString().slice(0, 5);
    const msg = {
      id: 'reassign-' + Date.now(),
      from: 'system',
      title: 'TASK REASSIGNED',
      body: `Work Order #${task.id} for <b>${task.a}</b> transferred from ${oldTech} to <b>${newTechName}</b>.`,
      time: timeStr,
      isUser: false
    };

    const currentChats = { ...get().chats };
    const techChat = currentChats[newTechName] || [];
    currentChats[newTechName] = [...techChat, msg];

    set({
      plan: currentPlan,
      chats: currentChats,
      activeTechName: newTechName,
      phoneScreen: 'chat'
    });

    useToastStore.getState().addToast({
      title: 'Task Handover Sent',
      message: `Work Order #${task.id} transferred to ${newTechName}`,
      type: 'whatsapp'
    });
  },

  holdTask: (shift, taskIdx, reason = 'Waiting for spare parts / cooling') => {
    const currentPlan = JSON.parse(JSON.stringify(get().plan));
    const task = currentPlan[shift][taskIdx];

    task.st = 'hold';
    task.holdReason = reason;

    const timeStr = new Date().toTimeString().slice(0, 5);
    const techName = task.tech || 'Ramesh';

    const msg = {
      id: 'hold-' + Date.now(),
      from: 'system',
      title: 'TASK PLACED ON HOLD',
      body: `Work order for <b>${task.a}</b> placed on hold: <i>${reason}</i>. Cost clock paused.`,
      time: timeStr,
      isUser: false
    };

    const currentChats = { ...get().chats };
    const techChat = currentChats[techName] || [];
    currentChats[techName] = [...techChat, msg];

    set({ plan: currentPlan, chats: currentChats });

    useToastStore.getState().addToast({
      title: 'Task Placed on Hold',
      message: `${task.a}: ${reason}`,
      type: 'warning'
    });
  },

  releaseTask: (shift, taskIdx) => {
    const currentPlan = JSON.parse(JSON.stringify(get().plan));
    const task = currentPlan[shift][taskIdx];

    task.st = 'ip';
    task.holdReason = '';

    const timeStr = new Date().toTimeString().slice(0, 5);
    const techName = task.tech || 'Ramesh';

    const msg = {
      id: 'rel-' + Date.now(),
      from: 'system',
      title: 'HOLD RELEASED · RESUMING',
      body: `Hold released for <b>${task.a}</b>. Technician ${techName} resumed active inspection.`,
      time: timeStr,
      isUser: false
    };

    const currentChats = { ...get().chats };
    const techChat = currentChats[techName] || [];
    currentChats[techName] = [...techChat, msg];

    set({ plan: currentPlan, chats: currentChats });

    useToastStore.getState().addToast({
      title: 'Hold Released',
      message: `Inspection resumed on ${task.a}`,
      type: 'info'
    });
  },

  resolveTask: (shift, taskIdx) => {
    const currentPlan = JSON.parse(JSON.stringify(get().plan));
    const task = currentPlan[shift][taskIdx];

    task.st = 'completed';

    const timeStr = new Date().toTimeString().slice(0, 5);
    const techName = task.tech || 'Ramesh';

    const msg = {
      id: 'res-' + Date.now(),
      from: techName,
      title: '',
      body: `✓ Completed inspection on <b>${task.a}</b>. Parameters verified and line safe to run.`,
      time: timeStr,
      isUser: true
    };

    const currentChats = { ...get().chats };
    const techChat = currentChats[techName] || [];
    currentChats[techName] = [...techChat, msg];

    set({ plan: currentPlan, chats: currentChats });

    useToastStore.getState().addToast({
      title: 'Task Completed & Verified',
      message: `${task.a} inspection signed off in SAP B1`,
      type: 'success'
    });
  },

  // Interactive WhatsApp Chat Message Send with Bidirectional Board Sync
  sendUserChatMessage: (techName, text) => {
    if (!text.trim()) return;
    const timeStr = new Date().toTimeString().slice(0, 5);

    const userMsg = {
      id: 'user-' + Date.now(),
      from: techName,
      title: '',
      body: text,
      time: timeStr,
      isUser: true
    };

    const currentChats = { ...get().chats };
    const techChat = currentChats[techName] || [];
    currentChats[techName] = [...techChat, userMsg];

    set({ chats: currentChats });

    // Check if user message triggers task status changes on board
    const lower = text.toLowerCase();
    const currentPlan = JSON.parse(JSON.stringify(get().plan));
    let boardUpdated = false;

    // If message implies completion
    if (lower.includes('complete') || lower.includes('done') || lower.includes('sign off') || lower.includes('finished')) {
      for (const shift of ['A', 'B', 'C']) {
        for (const task of currentPlan[shift]) {
          if (task.tech === techName && task.st === 'ip') {
            task.st = 'completed';
            boardUpdated = true;
            break;
          }
        }
        if (boardUpdated) break;
      }
    }

    // If message implies hold/spare
    if (lower.includes('hold') || lower.includes('spare') || lower.includes('need bearing') || lower.includes('waiting')) {
      for (const shift of ['A', 'B', 'C']) {
        for (const task of currentPlan[shift]) {
          if (task.tech === techName && task.st === 'ip') {
            task.st = 'hold';
            task.holdReason = 'Awaiting spare part from stores';
            boardUpdated = true;
            break;
          }
        }
        if (boardUpdated) break;
      }
    }

    if (boardUpdated) {
      set({ plan: currentPlan });
    }

    // Automated realistic technician/system response
    setTimeout(() => {
      let replyText = 'Roger that. Status updated on the central maintenance dashboard.';
      if (lower.includes('bearing') || lower.includes('temperature') || lower.includes('scan') || lower.includes('78°c')) {
        replyText = 'Thermal scan recorded: <b>78.4°C</b> on EX-02 gearbox bearing housing. Lubrication level within normal range. Monitoring continues.';
      } else if (lower.includes('spare') || lower.includes('part') || lower.includes('hold') || lower.includes('bearing')) {
        replyText = 'Spare requisition confirmed with Central Stores. Issue placed on HOLD in SAP B1 until bearing arrives.';
      } else if (lower.includes('done') || lower.includes('complete') || lower.includes('fixed') || lower.includes('sign')) {
        replyText = 'Excellent. Work order signed off and synchronized with SAP Business One. Shift supervisor notified.';
      } else if (lower.includes('ack') || lower.includes('reach') || lower.includes('site') || lower.includes('en route')) {
        replyText = 'Standing by at the bay. Initiating standard safety isolation protocol.';
      }

      const botReply = {
        id: 'bot-' + Date.now(),
        from: 'system',
        title: 'MAGPET AI COPILOT',
        body: replyText,
        time: new Date().toTimeString().slice(0, 5),
        isUser: false
      };

      const updatedChats = { ...get().chats };
      updatedChats[techName] = [...(updatedChats[techName] || []), botReply];
      set({ chats: updatedChats });
    }, 900);
  },

  // Interactive Media: Send Thermal Photo
  sendPhotoMessage: (techName) => {
    const timeStr = new Date().toTimeString().slice(0, 5);
    const photoMsg = {
      id: 'photo-' + Date.now(),
      from: techName,
      title: '',
      body: `<div class="bg-slate-900 text-white rounded-md p-2 my-1 border border-slate-700">
        <div class="flex items-center justify-between text-[9px] font-mono text-emerald-400 mb-1">
          <span>FLIR E8-XT THERMAL SCAN</span>
          <span>SPOT: 78.4°C</span>
        </div>
        <div class="h-20 bg-gradient-to-tr from-purple-900 via-rose-700 to-amber-400 rounded flex items-center justify-center text-[10px] font-bold tracking-wider text-white shadow-inner">
          [ THERMAL IMAGE · EX-02 HOUSING ]
        </div>
        <div class="text-[9px] text-slate-300 mt-1 font-mono">Max: 81.2°C · Min: 44.1°C · Emissivity: 0.95</div>
      </div>
      <span>Thermal scan completed. Housing within operating threshold.</span>`,
      time: timeStr,
      isUser: true
    };

    const currentChats = { ...get().chats };
    const techChat = currentChats[techName] || [];
    currentChats[techName] = [...techChat, photoMsg];
    set({ chats: currentChats });

    setTimeout(() => {
      const ackMsg = {
        id: 'bot-photo-' + Date.now(),
        from: 'system',
        title: 'AI THERMAL ANALYSIS',
        body: 'Thermal inspection photo ingested. Temperature 78.4°C verified safe (<85°C limit). Attached to SAP B1 equipment log.',
        time: new Date().toTimeString().slice(0, 5),
        isUser: false
      };
      const chatsNow = { ...get().chats };
      chatsNow[techName] = [...(chatsNow[techName] || []), ackMsg];
      set({ chats: chatsNow });
    }, 900);
  },

  // Interactive Media: Send Voice Note
  sendVoiceMessage: (techName) => {
    const timeStr = new Date().toTimeString().slice(0, 5);
    const voiceMsg = {
      id: 'voice-' + Date.now(),
      from: techName,
      title: '',
      body: `<div class="flex items-center gap-2 bg-[#E7FFDB] p-1 rounded">
        <button class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">▶</button>
        <div class="flex-1">
          <div class="h-2 bg-emerald-300 rounded-full w-full flex items-center">
            <div class="h-full bg-emerald-600 rounded-full w-2/5"></div>
          </div>
          <div class="text-[9px] text-slate-500 font-mono mt-0.5">Voice Note · 0:08</div>
        </div>
      </div>
      <div class="text-[10px] text-slate-600 italic mt-1">"Vibration reading normal at 2.4 mm/s RMS. Proceeding to screen changer."</div>`,
      time: timeStr,
      isUser: true
    };

    const currentChats = { ...get().chats };
    const techChat = currentChats[techName] || [];
    currentChats[techName] = [...techChat, voiceMsg];
    set({ chats: currentChats });
  },

  // Reset entire store to demo starting state
  resetToDemo: () => {
    set({
      plan: INITIAL_PLAN,
      activeTechName: 'Ramesh',
      phoneScreen: 'inbox',
      chats: INITIAL_CHATS,
      unreadCounts: { Ramesh: 0, Prakash: 0, Sunil: 0, Bikash: 0, Joydeep: 1, OpsGroup: 0 },
      searchTerm: ''
    });
    useToastStore.getState().addToast({
      title: 'Demo State Reset',
      message: 'Plan board and WhatsApp threads restored to initial clean state',
      type: 'info'
    });
  }
}));
