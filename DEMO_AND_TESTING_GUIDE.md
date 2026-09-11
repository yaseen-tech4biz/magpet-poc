# Magpet Operations Intelligence — Complete Demonstration & Testing Guide

A step-by-step master guide for demonstrating and testing the **Magpet Operations Intelligence POC** end-to-end. Built specifically for executive presentations (e.g. to Devendra Surana and the leadership team of Magnum Group / Magpet).

---

## 1. Executive Context & Narrative

### The Strategic Pitch:
- **Magpet Scale**: 40+ years, 5 manufacturing plants, 45,000 MTPA rPET resin, 50,000 MTPA PET processing.
- **The Operational Problem**: SAP Business One records transactions, purchase orders, and financial history, but plant managers lack real-time visibility into machine trips, maintenance bottlenecks, technician dispatches, and mold cavity drifts before they cost tens of lakhs in downtime and scrap.
- **The Solution**: **Magpet Operations Intelligence** sits alongside SAP B1 as an intelligent operational cockpit connecting maintenance execution (Module A: Kharagpur) and quality control (Module B: Hooghly) directly to bottom-line financial impact.

---

## 2. The 7 Planted Stories (S1 – S7) in the Demo Data

Every screen contains deliberate, realistic operational patterns planted on top of deterministic synthetic data:

| Story ID | Plant / Asset | Phenomenon | Key Takeaway for Magpet Leadership |
|---|---|---|---|
| **S1** | **EX-02** (Extruder) | 6 breakdowns in 90 days, all gearbox. MTTR rising from 2.5h to 5.0h. Tripped last night (02:40 to 06:10, 3.5h). | Progressive gearbox bearing wear, not random faults. Flagged under repeat failure rule. |
| **S2** | **WL-01** (Washing Line) | 7 bearing failures, **5 of 7 occurring exclusively in Shift C (night)**. | Operational practice issue (night lubrication/flushing deviation), not a machine defect. |
| **S3** | **Utilities Assets** | Overall PM compliance 62%. Worst performers: CH-01 (41%), AC-01 (45%), ETP-01 (48%). | Utilities are neglected until they cause a catastrophic line halt. |
| **S4** | **WhatsApp Dispatch** | Shift technicians (Ramesh, Prakash, Sunil) dispatched via simulated WhatsApp Business API. | Immediate closed-loop communication without paperwork delays; instant ACK. |
| **S5** | **Hooghly Plant-wide** | Rejection rate creeping upwards from 1.7% to 2.1% over 3 weeks. | Monthly rejection bill rising to ~₹55–65 Lakhs (~₹7 Crore annualized). |
| **S6** | **Shift C Black Specks** | Night shift black specks at 2.9% vs 1.8% day shifts across all Husky injection machines. | Points at resin drying, dehumidification, and material handling at night. |
| **S7** | **Cavities 41 & 42 (H-03)** | 72-cavity mold where cavities 41 & 42 drift +0.02g/day above the 26.00g target. | Hot runner manifold tip overheating, driving weight variation rejects on H-03. |

---

## 3. End-to-End Demonstration Script (Step-by-Step)

### Step 1: Executive Landing Screen (`/`)
1. **Show Branding**: Point out the authentic Magpet logo and deep navy `#143a72` brand colors sourced from `magnumgroup.in`.
2. **Present Company Capacity**: Highlight the 45,000 MTPA rPET resin and 50,000 MTPA PET processing figures.
3. **Present Plant Selector**:
   - Show the two plant cards: **Kharagpur Unit 3 (rPET Resin)** and **Hooghly Unit 1 (PET Preforms)**.
   - Click **"Open Maintenance Copilot →"** to enter Module A.

---

### Step 2: Kharagpur rPET Cockpit (`/rpet`)
1. **Hero Incident Banner**:
   - Point to the red incident banner: *"EX-02 tripped last night · Gearbox bearing over temperature"*.
   - Emphasize the live rupee calculation: **3.5 hours held back ₹1.6 L of resin throughput**.
2. **Live SCADA Telemetry**:
   - Point out the top green beacon: *"Live SCADA Telemetry Stream"*.
   - Watch the **Line rate now** KPI subtly fluctuating in real time (e.g. 5.38 t/h to 5.42 t/h) against the 5.5 t/h target.
3. **Live Open Jobs & Ticking Cost Clock**:
   - Point to the **Open Jobs** list. Note that **WL-01** is a critical asset with a cost clock ticking in real time as the repair proceeds.
4. **PM Compliance 90-Day Dial**:
   - Point to the animated 62% dial gauge and the worst-performing utility assets: Chiller (41%), Compressor (45%), ETP pumps (48%).

---

### Step 3: Daily Plan & Real-Time Multi-User WhatsApp Dispatch (`/rpet/plan`)
1. **3-Shift Maintenance Board**:
   - Show Shift A (06:00–14:00), Shift B (14:00–22:00), and Shift C (22:00–06:00).
   - Point out priority pills (P1 red, P2 amber, P3 slate), trigger reasons, and technician assignments.
2. **Multi-Technician WhatsApp Business Interface (iPhone Mockup)**:
   - **All Technicians View (Inbox)**:
     - Shows all 5 plant technicians: **Ramesh Sharma** (Senior Mechanical · Shift A), **Prakash Patel** (Mechanical Maintenance · Shift B), **Sunil Soren** (Night Shift Lead · Shift C), **Bikash Das** (Electrical & Automation · Shift A), **Joydeep Mukherjee** (Instrumentation & Sensors · Shift B), plus the **Plant 3 Ops Broadcast Group**.
     - Show search filter and Shift tabs (`All`, `Shift A`, `Shift B`, `Shift C`) to filter technicians.
   - **Click any technician to enter their chat**:
     - Instant transition into their personalized WhatsApp message thread.
     - Notice the prominent `< All (5)` back button to return to the inbox at any time.
     - Switch between technicians with 1-click using the switcher pills above the phone.
3. **Interactive Closed-Loop Work Order Dispatch**:
   - On the Shift A board, click **"Dispatch →"** on task **PA-1 (EX-02 Gearbox bearing check)**.
   - Watch the task card switch to **In Progress** (`ip`).
   - Notice the phone automatically navigates to **Ramesh**'s chat, pops a toast, and displays the formal SAP work order dispatch template.
4. **Rich Technician Interaction**:
   - Click **"📷 FLIR Scan"**: Simulates Ramesh capturing and sending a real-time FLIR thermal scan (78.4°C) into WhatsApp. The AI Copilot ingests it within 900ms and attaches it to the SAP equipment log!
   - Click **"🎤 Voice Note"**: Sends a realistic 8-second audio note with playback waveform.
   - Click **"⚠️ Hold · Need spare bearing"**: Puts the task on hold on the board and notifies stores for replacement parts.
   - Click **"✅ Work completed · Sign off SAP"**: Resolves the work order, signs it off in SAP B1, and marks the task as **✓ Done** on the Shift board!
5. **Transfer / Reassignment**:
   - Click **"Transfer"** on any task to reassign it (e.g. from Ramesh to Prakash).
   - Notice Prakash instantly receives a WhatsApp handover notification.

---

### Step 3.5: The 1-Click Demo Flight Deck (Floating at Bottom-Right)
- Available on every single page via the floating **"⚡ 1-Click Demo Flight Deck"** button.
- Run complete automated demonstration sequences without typing:
  1. **Run WhatsApp Multi-User Flow**: Dispatches task, sends FLIR photo, transfers to Shift B, and completes in SAP B1.
  2. **Simulate Incident & Cost Clock**: Injects EX-02 breakdown on Kanban, ticks cost clock every 2s, moves to repair and resolution.
  3. **Inspect Cavities 41-42 Drift**: Jumps to 72-cavity matrix, highlights drift, creates mold servicing work order.
  4. **Update Financial Assumptions**: Live recalculation of all figures across plants.
  5. **Launch AI Copilot**: Runs intelligent natural language diagnostic queries.
  6. **Reset Demo State**: 1-click restore to clean starting state.
   - Point out the red dashed card: `MS-01` has a gap alert: *"No technician available"*.
2. **Interactive WhatsApp Dispatch (The "Wow" Moment)**:
   - On the right, show the **iPhone simulator** running WhatsApp Business API.
   - On task `DR-01` (Dryer filter inspection, currently Unassigned), click **"Assign"**.
   - Select a technician (e.g. **Ramesh** or **Prakash**) from the modal.
   - **Watch the real-time reaction**:
     1. The task card immediately turns blue / in-progress.
     2. A formal Work Order dispatch notification automatically pops up in the iPhone WhatsApp chat stream.
     3. Ramesh automatically sends back an instant acknowledgment: *"ACK · Work order accepted. Reaching in 5-10 minutes"*.
3. **Task Lifecycle Actions**:
   - Click **"Hold"** on an in-progress task: Enter a reason (e.g. *"Waiting for replacement filter cartridge"*). The card updates to "ON HOLD" and posts a pause notice to WhatsApp.
   - Click **"Resume"** to release the hold.
   - Click **"✓ Done"** to sign off the work order in SAP B1.
4. **Interactive Two-Way WhatsApp Chat**:
   - Select another technician from the top dropdown in the phone (e.g., **Prakash** or **Sunil**).
   - Click one of the quick action reply chips (e.g., *"Thermal scan 78°C · normal"* or *"Need spare bearing from store"*), or type a custom message in the input field and press Enter.
   - Notice the AI maintenance copilot automatically responds within 1.2 seconds with realistic technical advice!

---

### Step 4: Breakdown Kanban Board (`/rpet/breakdowns`)
1. **4 Operational Lanes**: `ASSIGNED`, `IN PROGRESS`, `WAITING SPARE`, `RESOLVED TODAY`.
2. **Interactive Incident Management**:
   - Click **"Start Repair →"** on any assigned card to move it into `IN PROGRESS`.
   - Click **"Wait Spare"** on an active job to move it into `WAITING SPARE` with a custom hold reason.
   - Click **"Parts Received · Resume →"** to return it to active repair.
   - Click **"✓ Resolve"**: The job moves to `RESOLVED TODAY`, calculates total completed downtime, and locks the final financial cost.
3. **Report New Breakdown Live**:
   - Click **"+ Report New Breakdown"** in the top right.
   - Select an asset (e.g. `EX-02`), enter a description, choose Priority `P1`, and click **"Log Breakdown"**.
   - Watch the new card appear immediately with an active cost clock ticking, and the Open Jobs counter on the dashboard increment!

---

### Step 5: Reliability & Pareto Analysis (`/rpet/reliability`)
1. **Downtime Pareto Chart**:
   - Watch the horizontal bars animate into view.
   - Point out that **EX-02 (34.5 h)** and **WL-01 (21.0 h)** account for the vast majority of all plant downtime.
2. **Repeat Failure Rule**:
   - Explain the 3+ same-cause in 30 days rule:
     - **EX-02 Gearbox**: 6 events, MTTR escalating from 2.5h to 5.0h.
     - **WL-01 Friction Washer**: 7 events, 5 in Shift C.
3. **MTBF & MTTR Diagnostics Table**:
   - Show the asset-by-asset mean time between failures and repair times.

---

### Step 6: Ask (`/rpet/ask`)
1. **Clickable Plant Suggestion Chips**:
   - Click *"Which machine cost us the most downtime this quarter?"* -> Displays EX-02 with 34.5 hours and calculated rupee impact.
   - Click *"Which shift has the most washing line breakdowns?"* -> Displays Shift C with 5 of 7 failures.
   - Click *"Why does EX-02 keep failing?"* -> Diagnoses the progressive bearing wear.
2. **Dynamic Natural Language Querying**:
   - Type `"EX-02"` in the search bar and press Enter.
   - Notice the engine dynamically searches the 90-day synthetic database (`breakdowns.json`) and renders the matching incident logs, total hours, and financial loss!
   - Try searching for `"Sunil"`, `"bearing"`, or `"washing line"`.

---

### Step 7: Hooghly Quality Intelligence (`/preform`)
1. **Rejection Rate Trend**:
   - Show the 4 KPI cards: 104.2 t output today, **2.1% rejection rate** (up from 1.7% three weeks ago), and the **Rejection bill MTD** (~₹55.7 Lakhs, run-rate ₹6.7 Crore/yr).
   - Point out the 60-day trend line with the green 1.5%–1.8% target tolerance band showing the 3-week drift.
2. **Quality Alerts & SAP Feed**:
   - Point out the 3 active alerts (H-03 cavity weight drift, Shift C black specks 1.6×, plant rejection creep).
   - Click **"Open shift view →"** or navigate to `/preform/machine`.

---

### Step 8: Machine H-03 Defect Analysis (`/preform/machine`)
1. **Machine Selector**:
   - Point out the machine selector dropdown at the top: switch between **Husky H-01**, **H-02**, **H-03**, **H-04**, and **ABS S-01**.
   - Select **H-03**: The 8-week defect chart animates.
2. **The Defect Signature**:
   - Point to the purple segments (**Weight variation**): it has tripled from 20 to 62 defects/week over the 8 weeks.
3. **Shift Comparison**:
   - Point to the right-hand bar chart: Shift C is at **2.9%** (1.6× higher than day shifts).
   - Explain the root cause: overnight resin dehumidification and dryer regeneration cycles.
   - Click the button: **"Open Cavity Map (H-03 Hot Runner Diagnosis) →"**.

---

### Step 9: 72-Cavity Heat Matrix (`/preform/cavity`)
1. **The 72-Cavity Matrix**:
   - Point out the 12×6 matrix representing the 72-cavity Husky mold.
   - Most cavities are green (within ±0.15g) or amber (±0.15g to 0.25g).
   - Point directly to **Cavities 41 and 42** glowing in bright red (heavy &gt; +0.25g).
2. **Interactive Cavity Drilldown**:
   - Click on **Cavity 1**: The 21-day curve on the right animates, staying safely within the 26.00g target band.
   - Click on **Cavity 41**: The curve immediately draws an upward trajectory (+0.02g per day drift).
   - Show the diagnostic alert: *"Hot runner anomaly identified: Manifold Zone 3 Tip overheating"*.
3. **Action Button**:
   - Click **"Flag for Mold Servicing"**: Demonstrates closed-loop resolution by generating work order `#MO-4109` for the upcoming toolroom changeover.

---

### Step 10: Live Money Assumptions & Recomputing (`/settings`)
1. **The Financial Engine (The Executive Climax)**:
   - Explain to leadership: *"Every single rupee figure in this platform is dynamically computed from your operational assumptions."*
   - Change **Resin Price** from `85` to `95` ₹/kg.
   - Change **rPET Line Rate** from `5.5` to `6.0` t/h.
   - **Watch the Impact Table at the bottom immediately recalculate every figure** (stoppage cost, last night's trip, rejection bill).
   - Navigate back to `/rpet` or `/preform`: Notice that the hero incident, KPI cards, breakdown clocks, and rejection bills across the entire app have all updated to reflect the new financial inputs!
2. **Branding Adaptation**:
   - Show the logo dropzone and accent color picker.

---

## 4. Verification Checklist for Dry Runs

- [x] Application loads at `http://localhost:5174/` (clean URL routing, no `#`).
- [x] Page starts cleanly at the top (`Y: 0`) without unwanted autoscrolling.
- [x] Daily plan task cards allow Assigning, Reassigning, Holding, and Resolving.
- [x] WhatsApp phone mock receives automatic dispatch logs, allows two-way messaging, and technician switching.
- [x] Breakdown board allows moving jobs across lanes and logging new incidents.
- [x] Framer Motion animations trace lines, expand bars, and count up percentages smoothly.
- [x] Cavity map allows clicking any cavity to view its 21-day drift and flagging mold work orders.
- [x] Changing settings recomputes all currency values across the entire application.
