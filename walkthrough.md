# 🏗️ แผนผังการทำงานทั้งหมด — Claw-Empire

---

## 1️⃣ ภาพรวมระบบ

```mermaid
graph TB
    USER["👤 ผู้ใช้งาน"] --> LOGIN["🔐 หน้าล็อกอิน"]
    LOGIN --> APP["📱 แอปหลัก"]
    APP --> FE["🖥️ หน้าเว็บ<br/>surge.sh"]
    APP --> BE["⚙️ เซิร์ฟเวอร์<br/>Railway"]
    BE --> AI["🤖 AI หลายตัว<br/>Gemini / OpenAI / Claude"]
    FE --> DB["☁️ Supabase<br/>เก็บข้อมูล + ล็อกอิน"]
```

---

## 2️⃣ ขั้นตอนการล็อกอิน

```mermaid
graph LR
    A["เปิดเว็บ"] --> B["ใส่อีเมล + รหัส"]
    B --> C["Supabase ตรวจสอบ"]
    C -->|"ผ่าน ✅"| D["เข้าหน้า Dashboard"]
    C -->|"ไม่ผ่าน ❌"| E["แจ้งเตือนผิดพลาด"]
    D --> F["ดึงข้อมูลจาก Cloud"]
    F --> G["พร้อมใช้งาน!"]
```

---

## 3️⃣ เมนูทั้งหมด (11 แท็บ)

```mermaid
graph TB
    subgraph "📌 หลัก"
        T1["📊 Dashboard<br/>สรุปภาพรวม"]
        T2["🏠 Office View<br/>ออฟฟิศจำลอง"]
        T3["📋 Kanban Board<br/>กระดานงาน"]
        T4["👥 Agents<br/>พนักงาน AI 8 คน"]
    end
    subgraph "📝 คอนเทนต์"
        T5["📝 Content Studio<br/>ทีมคอนเทนต์ 10 คน"]
    end
    subgraph "💼 ทำงาน"
        T6["💬 Chat<br/>คุยกับ AI 6 ตัว"]
        T7["⭐ Skills<br/>คลังทักษะ 600+"]
        T8["🤝 Meetings<br/>ห้องประชุม"]
        T9["📧 Messenger<br/>ส่งข้อความ"]
    end
    subgraph "📈 ระบบ"
        T10["📈 Reports<br/>รายงาน"]
        T11["⚙️ Settings<br/>ตั้งค่า"]
    end
```

---

## 4️⃣ การเก็บข้อมูล

```mermaid
graph LR
    A["ผู้ใช้ทำอะไรบนเว็บ"] --> B["Store.js<br/>จัดการข้อมูล"]
    B --> C["💾 localStorage<br/>เก็บในเครื่อง"]
    B --> D["☁️ Supabase<br/>เก็บบน Cloud"]
    D --> E["เปิดเครื่องอื่น<br/>ข้อมูลยังอยู่!"]
```

**ข้อมูลที่เก็บ:**
- พนักงาน AI 8 คน (เลเวล, XP, อารมณ์)
- งานบน Kanban (สถานะ, ลำดับความสำคัญ)
- คอนเทนต์ทั้งหมด (ไอเดีย → โพสต์แล้ว)
- เหรียญ, XP, ชื่อเสียง
- ประวัติแชท
- การตั้งค่า (ธีม, ภาษา)

---

## 5️⃣ ระบบ AI แชท

```mermaid
graph TB
    A["💬 พิมพ์ข้อความ"] --> B["เลือก AI ที่จะคุย"]
    B --> C{"ส่งหา AI ตัวแรก"}
    C -->|"ตอบได้ ✅"| D["แสดงคำตอบ"]
    C -->|"พัง ❌"| E["ลอง AI ตัวถัดไป"]
    E -->|"ตอบได้ ✅"| D
    D --> F["🔊 กดฟังเสียงได้"]
```

**AI 6 ตัวที่ใช้ได้:**

| ตัว | ชื่อ | ใช้ทำอะไร |
|-----|------|----------|
| 🌟 | **Gemini** | หลัก — ใช้ทุกอย่าง |
| 🟢 | **OpenAI** | สำรอง — ผ่านเซิร์ฟเวอร์ |
| 🟣 | **Claude** | สำรอง — ผ่านเซิร์ฟเวอร์ |
| 🟠 | **NVIDIA** | สำรอง — Llama |
| 🔵 | **DeepSeek** | สำรอง — เชื่อมตรง |
| 🌙 | **Kimi** | สำรอง — เชื่อมตรง |

---

## 6️⃣ Content Studio — ทีมคอนเทนต์ AI

```mermaid
graph TB
    subgraph "🎬 ปุ่มบนหัวเว็บ (7 ปุ่ม)"
        B1["📋 Daily Workflow<br/>ตารางงานวันนี้"]
        B2["🔄 Pipeline Board<br/>บอร์ดสถานะงาน"]
        B3["📅 Calendar<br/>ปฏิทินคอนเทนต์"]
        B4["📋 Templates<br/>แม่แบบ 15 อัน"]
        B5["👁️ Preview<br/>ดูตัวอย่าง 4 แพลตฟอร์ม"]
        B6["➕ New Content<br/>สร้างงานใหม่"]
        B7["📊 Weekly Report<br/>รายงานสัปดาห์"]
    end
```

```mermaid
graph TB
    subgraph "🤖 พลัง AI (8 ปุ่ม)"
        A0["🚀 Auto Content<br/>สร้างอัตโนมัติ 5 ขั้นตอน"]
        A1["🔍 Scan Trends<br/>หาเทรนด์ร้อน"]
        A2["🧠 Audience Insight<br/>วิเคราะห์กลุ่มเป้าหมาย"]
        A3["✍️ Write Post<br/>เขียนโพสต์"]
        A4["🎣 Generate Hooks<br/>สร้างพาดหัว"]
        A5["🎨 Visual Brief<br/>ไอเดียภาพ"]
        A6["🎬 Video Script<br/>สคริปต์วิดีโอ"]
        A7["📊 AI Analysis<br/>วิเคราะห์คอนเทนต์"]
    end
```

---

## 7️⃣ Auto Content — ระบบสร้างคอนเทนต์อัตโนมัติ

```mermaid
graph LR
    S1["1️⃣ Trend Hunter<br/>หาเทรนด์"] --> S2["2️⃣ Audience Planner<br/>วิเคราะห์คนดู"]
    S2 --> S3["3️⃣ Content Writer<br/>เขียนเนื้อหา"]
    S3 --> S4["4️⃣ Hook Specialist<br/>สร้างพาดหัว"]
    S4 --> S5["5️⃣ Video Producer<br/>สคริปต์วิดีโอ"]
    S5 --> DONE["✅ เสร็จ!<br/>ได้คอนเทนต์ครบ"]
```

> กด **🚀 Auto Content** ครั้งเดียว → AI 5 ตัวทำงานต่อเนื่อง → ได้ผลลัพธ์ครบทุกขั้นตอน

---

## 8️⃣ Pipeline — สถานะคอนเทนต์

```mermaid
graph LR
    P1["💡 Idea<br/>ไอเดีย"] --> P2["📝 Draft<br/>ร่าง"]
    P2 --> P3["🎣 Hook<br/>พาดหัว"]
    P3 --> P4["🎨 Visual<br/>งานกราฟิก"]
    P4 --> P5["📅 Scheduled<br/>ตั้งเวลาโพสต์"]
    P5 --> P6["✅ Posted<br/>โพสต์แล้ว!"]
```

---

## 9️⃣ ระบบเกม (Gamification)

```mermaid
graph TB
    LOOP["⏱ ทุก 10 วินาที"] --> A["พนักงานทำงาน<br/>+XP อัตโนมัติ"]
    A --> B["ได้เหรียญ 💰"]
    A --> C["เลเวลขึ้น ⬆️"]
    A --> D["อีเวนต์สุ่ม 🎲"]
    D --> D1["🏆 รางวัลบริษัท +500 XP"]
    D --> D2["💻 งาน Hackathon +200 XP"]
    D --> D3["🐛 บั๊คร้าย -อารมณ์"]
    D --> D4["🎉 เที่ยวทีม +อารมณ์"]
    B --> E["ซื้ออัพเกรด 🛒"]
    C --> F["ปลดล็อคทักษะใหม่ ⭐"]
```

---

## 🔟 ทีมพนักงาน Content (10 ตำแหน่ง)

| # | ตำแหน่ง | หน้าที่ | เวลาทำงาน |
|---|---------|--------|-----------|
| 1 | **Chief Content Strategist** | วางแผนใหญ่ ตั้งเป้าหมาย | 10:00 |
| 2 | **Trend Hunter** | ส่องเทรนด์ จับประเด็นร้อน | 09:00 |
| 3 | **Audience Insight Planner** | วิเคราะห์กลุ่มเป้าหมาย | 09:30 |
| 4 | **Content Writer** | เขียนโพสต์ บทความ สคริปต์ | 10:30 |
| 5 | **Hook & Copy Specialist** | สร้างพาดหัว CTA | 11:00 |
| 6 | **Visual Designer** | ทำกราฟิก Thumbnail | 11:30 |
| 7 | **Video Script Producer** | เขียน/ตัดต่อวิดีโอ | 13:00 |
| 8 | **Content Calendar Manager** | จัดตารางโพสต์ | ทั้งวัน |
| 9 | **Publisher** | กดโพสต์ตามเวลา | 17:00 |
| 10 | **Publisher (รอบดึก)** | กดโพสต์รอบดึก | 20:00 |

---

## 📁 สรุปไฟล์ทั้งหมด

```mermaid
graph TB
    subgraph "📄 หน้าเว็บ"
        H1["login.html — หน้าล็อกอิน"]
        H2["index.html — หน้าหลัก"]
        H3["styles.css — ดีไซน์"]
    end
    subgraph "📜 ไฟล์ JS (19 ไฟล์)"
        J1["data.js — ข้อมูลตั้งต้น"]
        J2["store.js — จัดการข้อมูล"]
        J3["app.js — ควบคุมแท็บ"]
        J4["chat.js — ระบบแชท AI"]
        J5["content-studio.js — สตูดิโอ"]
        J6["gameplay.js — ระบบเกม"]
        J7["อื่นๆ อีก 13 ไฟล์"]
    end
    subgraph "⚙️ เซิร์ฟเวอร์"
        S1["server.js — API Proxy"]
    end

    H2 --> J1
    H2 --> J3
    J3 --> J4
    J3 --> J5
    J4 --> S1
```
