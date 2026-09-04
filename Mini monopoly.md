# Mini Monopoly — Requirements

## 1. System Overview

### 1.1 Game Name

**Mini Monopoly**

### 1.2 Game Type

* Board Game
* Turn-based
* เล่นผ่าน Terminal / Console
* ผู้เล่นแข่งขันกันบน Board เดียวกัน
* มีผู้เล่นทั้งหมด 4 คน:

  * Human ×1
  * COM Easy ×1
  * COM Normal ×1
  * COM Hard ×1
* ไม่มีการเลือกจำนวนผู้เล่น
* เกมจบเมื่อเหลือผู้เล่นที่ยังไม่ Bankruptcy เพียง 1 คน
* ผู้เล่นคนสุดท้ายที่เหลืออยู่เป็นผู้ชนะ

โครงสร้างนี้สอดคล้องกับ Requirement ตั้งต้นของโปรเจกต์

---

# 2. Player Requirements

ผู้เล่นแต่ละคนต้องมีข้อมูลอย่างน้อย:

* `name`
* `money`
* `position`
* `properties`
* `status`

ระบบต้องสามารถจัดการข้อมูลและสถานะของผู้เล่นระหว่างเกมได้

ผู้เล่นแบ่งเป็น:

```text
Human
COM Easy
COM Normal
COM Hard
```

---

# 3. Board Requirements

## 3.1 Board Size

* Board ปัจจุบันมี **32 ช่อง**
* Board มีลักษณะเป็นวงรอบ
* การเดินสามารถวนจากช่องสุดท้ายกลับมายังช่องแรก

Requirement ตั้งต้นรองรับ Board ขนาด 24–32 ช่อง และระบบปัจจุบันเลือกใช้ 32 ช่อง

## 3.2 Tile Types

Board ต้องรองรับ Tile อย่างน้อย:

* START
* Property
* Chance
* Free Parking
* Jail
* TAX

## 3.3 Current Board Layout

| ช่อง | ประเภท       |
| ---: | ------------ |
|    1 | START        |
|    2 | Property     |
|    3 | Property     |
|    4 | Property     |
|    5 | Property     |
|    6 | Chance       |
|    7 | Property     |
|    8 | Property     |
|    9 | Free Parking |
|   10 | Property     |
|   11 | Property     |
|   12 | Jail         |
|   13 | Property     |
|   14 | Property     |
|   15 | TAX          |
|   16 | Property     |
|   17 | Property     |
|   18 | Chance       |
|   19 | Property     |
|   20 | Property     |
|   21 | Free Parking |
|   22 | Property     |
|   23 | Property     |
|   24 | Chance       |
|   25 | Property     |
|   26 | Property     |
|   27 | TAX          |
|   28 | Property     |
|   29 | Property     |
|   30 | Chance       |
|   31 | Property     |
|   32 | Property     |

Layout ปัจจุบันนี้ตรงกับ Board ที่เก็บไว้ใน Requirement เดิม

---

# 4. Turn Requirements

ในแต่ละ Turn การทำงานหลักเป็น:

```text
Roll Dice
   ↓
Move
   ↓
Resolve Tile
   ↓
Action
   ↓
Next Player
```

Flow นี้เป็นโครงสร้างหลักที่กำหนดไว้ใน Requirement เดิม

ระบบต้องสามารถ:

1. เริ่ม Turn ของผู้เล่นปัจจุบัน
2. ทอยลูกเต๋า
3. เคลื่อนที่ผู้เล่น
4. ตรวจสอบ Tile ที่ Landing
5. ดำเนิน Action ของ Tile
6. ตรวจสอบสถานะของผู้เล่น
7. เปลี่ยนไปยังผู้เล่นคนถัดไป

---

# 5. Dice and Movement Requirements

## 5.1 Dice

* ใช้ลูกเต๋า 1 ลูก
* ผลลัพธ์อยู่ในช่วง 1–6

## 5.2 Movement

* ผู้เล่นเคลื่อนที่ตามผลลูกเต๋า
* Board วนกลับจากช่องสุดท้ายไปช่องแรก
* การเดินผ่าน START ต้องถูกตรวจสอบและจัดการตามกฎของเกม

## 5.3 Dice ×2

ระบบต้องรองรับ Event ที่ทำให้ระยะการเดินเป็นสองเท่าของผลลูกเต๋าเดิม

* ใช้ผลลูกเต๋าเดิม
* ไม่ทอยลูกใหม่

## 5.4 Chance Movement

หาก Chance ทำให้ผู้เล่นเคลื่อนที่:

* การเคลื่อนที่ดังกล่าวเป็นส่วนหนึ่งของ **Turn เดิม**
* ต้องย้ายผู้เล่นไปยังตำแหน่งใหม่
* ต้องตรวจสอบ Tile ปลายทางตามกฎปกติของเกม

---

# 6. Property Requirements

แต่ละ Property ต้องมีข้อมูลอย่างน้อย:

* `name`
* `price`
* `rent`
* `owner`

Requirement เดิมกำหนดข้อมูลพื้นฐานของ Property ไว้ดังกล่าว

ระบบต้องสามารถระบุได้ว่า Property:

```text
ไม่มีเจ้าของ
    หรือ
เป็นของผู้เล่นปัจจุบัน
    หรือ
เป็นของผู้เล่นอื่น
```

---

# 7. Property Purchase Requirements

เมื่อผู้เล่น Landing บน Property ที่ไม่มีเจ้าของ:

```text
Buy?
 ├─ Yes → Purchase
 └─ No
```

เมื่อเลือกซื้อ ระบบต้อง:

* ตรวจสอบเงื่อนไขการซื้อ
* ชำระเงิน
* เปลี่ยน Owner
* เพิ่ม Property ให้กับผู้เล่น
* อัปเดตข้อมูลการซื้อ

รายละเอียดจำนวน Property ที่ถือได้ จำนวนครั้งที่ซื้อ และเงื่อนไขของ AI อยู่ใน **Balance & Simulation**

---

# 8. Property Ownership and Rent

## 8.1 Property ของตัวเอง

เมื่อผู้เล่น:

* เดินผ่าน Property ของตัวเอง
* Landing บน Property ของตัวเอง

ระบบต้องสามารถให้เจ้าของเก็บ Rent ที่สะสมอยู่บน Property ได้

## 8.2 Property ของผู้เล่นอื่น

เมื่อ Landing บน Property ของผู้เล่นอื่น:

ผู้เล่นต้องสามารถเลือก:

```text
Pay Rent
หรือ
Take Over
```

### Pay Rent

* จ่าย Rent
* Action ของ Property สิ้นสุดหลังจากการจ่ายและจัดการ Rent ตามระบบ

### Take Over

เมื่อเลือก Take Over และเข้าเงื่อนไข:

* ไม่ต้องจ่าย Rent
* Property เปลี่ยน Owner มาเป็นผู้เล่นปัจจุบัน
* ผู้เล่นได้รับ Property
* ผู้เล่นได้รับ Rent ที่สะสมอยู่บน Property

## 8.3 Rent Pool

Rent ที่ยังไม่ได้ถูกเก็บจะสะสมอยู่บน Property

เมื่อเจ้าของเก็บ Rent:

```text
Owner
   ↓
Collect Rent
   ↓
Receive Rent Pool
   ↓
Rent Pool = 0
```

รายละเอียดเชิงตัวเลขอยู่ใน **Balance & Simulation**

---

# 9. Take Over Requirements

ระบบต้องรองรับการ Take Over Property ของผู้เล่นอื่น

เมื่อ Take Over สำเร็จ:

* Property เปลี่ยน Owner
* เจ้าของเดิมสูญเสียสิทธิ์ความเป็นเจ้าของ
* ผู้เล่นใหม่ได้รับ Property
* Rent ที่สะสมอยู่บน Property ติดไปกับ Property และถูกส่งให้เจ้าของใหม่

รายละเอียดค่าใช้จ่ายและข้อจำกัดอยู่ใน **Balance & Simulation**

Requirement เดิมกำหนดให้ Take Over ทำให้ Property เปลี่ยนเจ้าของและ Rent ที่สะสมยังอยู่กับ Property

---

# 10. Special Tile Requirements

## 10.1 START

เมื่อผู้เล่นผ่าน START:

* ระบบต้องให้ Reward ตาม Balance Setting

## 10.2 TAX

เมื่อผู้เล่น Landing บน TAX:

* ระบบต้องเรียกใช้การคิด TAX ตาม Balance Setting

## 10.3 Jail

เมื่อผู้เล่น Landing ตรงช่อง Jail:

* ผู้เล่นเข้าสู่ Jail
* สามารถดำเนินการ Bribe หรือ Skip ตามกฎของระดับ AI

การเดินผ่าน Jail โดยไม่ Landing ไม่ทำให้ผู้เล่นติด Jail

## 10.4 Free Parking

เมื่อ Landing บน Free Parking:

* ไม่มี Action พิเศษ

## 10.5 Chance

เมื่อ Landing บน Chance:

* ระบบต้องสุ่ม Chance Event
* Event ถูกดำเนินการภายใน Turn เดิม

Requirement เดิมกำหนด Special Tiles เหล่านี้ไว้

---

# 11. Chance Requirements

เกมต้องมี Chance Event อย่างน้อย **5 รูปแบบ**

Event ที่ระบบปัจจุบันรองรับ ได้แก่:

* เพิ่มเงิน
* ลดเงิน
* เดินหน้า
* ถอยหลัง
* Dice ×2
* Lottery

เมื่อ Chance Event เป็นการเคลื่อนที่:

* เป็นส่วนหนึ่งของ Turn เดิม
* ระบบต้องตรวจสอบ Tile ปลายทางตามกฎปกติ

รายละเอียด Event และ Probability ที่ใช้งานจริงอยู่ใน **Balance & Simulation**

Requirement เดิมกำหนดให้มี Chance อย่างน้อย 5 รูปแบบ

---

# 12. Jail Requirements

Jail ต้องรองรับ Action:

### Bribe

* ผู้เล่นสามารถ Bribe เพื่อออกจาก Jail ตามกฎของเกม

### Skip

* ผู้เล่นสามารถเลือก Skip
* การ Skip ทำให้เสีย Turn ตามกฎของเกม

การตัดสินใจ Bribe / Skip ของ AI แต่ละระดับอยู่ใน **Balance & Simulation**

---

# 13. Sell Property Requirements

ระบบต้องมีความสามารถในการขาย Property

เมื่อผู้เล่นมีเงินไม่พอสำหรับการชำระเงิน:

```text
ต้องจ่าย
   ↓
เงินพอ?
 ├─ Yes → จ่าย
 └─ No
      ↓
Sell Property
      ↓
เงินพอ?
 ├─ Yes → จ่าย
 └─ No → Bankrupt
```

ระบบต้อง:

1. ตรวจสอบว่าเงินไม่เพียงพอ
2. เปิดกระบวนการ Sell Property
3. รับผลจากการขาย Property
4. เพิ่มเงินให้ผู้เล่น
5. ตรวจสอบเงินอีกครั้ง
6. หากยังไม่พอ → Bankruptcy

Requirement เดิมกำหนด Flow นี้ไว้

รายละเอียดราคาขายและกฎการเลือก Property ที่จะขายอยู่ใน **Balance & Simulation**

---

# 14. Sell Property และ Rent Pool

เมื่อ Property ถูกขาย:

* Property ถูกนำออกจากรายการ Property ของผู้ขาย
* Property กลับมาอยู่ในสถานะไม่มีเจ้าของ
* Rent Pool ของ Property นั้นถูกล้าง

---

# 15. Bankruptcy Requirements

หากผู้เล่น Sell Property แล้วและยังมีเงินไม่เพียงพอต่อการชำระเงิน:

> ผู้เล่นจะ Bankruptcy

เมื่อ Bankruptcy:

* ผู้เล่นออกจากเกม
* Property ทั้งหมดของผู้เล่นกลับเป็นไม่มีเจ้าของ
* Rent Pool ที่อยู่บน Property เหล่านั้นถูกล้าง

Requirement เดิมกำหนดการนำผู้เล่นออกจากเกมและการคืน Property หลัง Bankruptcy ไว้

---

# 16. Game End Requirements

ระบบต้องตรวจสอบจำนวนผู้เล่นที่ยังไม่ Bankruptcy หลังจากเหตุการณ์ที่อาจทำให้ผู้เล่นออกจากเกม

เมื่อเหลือผู้เล่นที่ยังไม่ Bankruptcy เพียง **1 คน**:

> เกมสิ้นสุด

ผู้เล่นคนนั้นเป็น:

> **Winner**

---

# 17. AI Requirements

เกมต้องมี AI 3 ระดับ:

```text
Easy
Normal
Hard
```

AI ต้องสามารถตัดสินใจเกี่ยวกับ:

* การซื้อ Property
* การ Take Over
* การจัดการ Jail
* การขาย Property เมื่อเงินไม่พอ

AI แต่ละระดับต้องมีพฤติกรรมแตกต่างกัน

รายละเอียดกฎการตัดสินใจและ Threshold อยู่ใน **Balance & Simulation**

Requirement เดิมกำหนดให้มี AI 3 ระดับ

---

# 18. Game State Requirements

ระบบต้องสามารถจัดการ State ของเกมปัจจุบัน เช่น:

* รายชื่อผู้เล่น
* สถานะของผู้เล่น
* เงินของผู้เล่น
* ตำแหน่งของผู้เล่น
* Property ที่ผู้เล่นถือ
* Owner ของ Property
* Rent Pool
* ผู้เล่นปัจจุบัน
* Turn ปัจจุบัน
* สถานะของเกม

ข้อมูลเหล่านี้ต้องสามารถนำไปบันทึกและสร้างกลับมาเป็นสถานะของเกมได้

---

# 19. Persistence Requirements

ระบบต้องรองรับการ:

* **Save Game**
* **Load Game**

โดยใช้:

> **JSON File**

เมื่อ Load สำเร็จ ระบบต้องสามารถนำ Game State กลับมาและ **เล่นต่อจากสถานะที่บันทึกไว้ได้**

ข้อมูลสำคัญของเกมที่ต้องคงไว้ เช่น:

* Player State
* Property State
* Position
* Money
* Status
* Rent Pool
* Current Turn / Player
* Game State

---

# 20. Input / Output Requirements

## 20.1 Interface

เกมใช้:

> **Console / TUI**

## 20.2 Human Input

Human ต้องสามารถเลือก Action ที่เกมอนุญาต เช่น:

* Buy / ไม่ซื้อ
* Pay Rent / Take Over
* จัดการ Jail
* เลือก Property สำหรับการขาย

## 20.3 Output

ระบบต้องแสดงข้อมูลที่จำเป็นต่อการเล่น เช่น:

* Player ปัจจุบัน
* ผลลูกเต๋า
* Position
* Money
* Property
* Event
* การซื้อ
* Rent
* Take Over
* Sell Property
* Bankruptcy
* Winner

รูปแบบการแสดงผลเป็นส่วนของ UI ไม่ควรผูกเข้ากับ Core Logic

---

# 21. Core Logic Requirements

Core Game Logic ต้องสามารถทำงานโดยไม่ขึ้นกับ Console Input / Output โดยตรง

ตัวอย่างส่วนสำคัญที่ต้องแยกออกจาก I/O:

* Dice / Movement
* Tile Resolution
* Property
* Purchase
* Rent
* Take Over
* Chance
* Jail
* TAX
* Sell Property
* Bankruptcy
* Game End

---

# 22. OOP Requirements

ระบบต้องใช้:

* **Class**
* **Interface**

Class และ Interface ต้องถูกนำมาใช้ในส่วนที่เหมาะสมของระบบตาม Architecture ที่ออกแบบ

---

# 23. Functional Programming Requirements

ระบบต้องมีการใช้:

* **Pure Function**
* **Higher-order Function**

โดยนำไปใช้กับส่วนของ Logic ที่เหมาะสม

---

# 24. Architecture Requirements

ระบบต้อง:

> **แยก Game Logic ออกจาก I/O**

แนวคิด:

```text
Console / TUI
      ↓
Game
      ↓
Core Logic
      ↓
Game State
```

Core Logic ต้องไม่ผูกติดกับ `console.log()` หรือการรับ Input โดยตรง

เป้าหมายคือให้สามารถนำ Core Logic ไปทดสอบแยกจาก Interface ได้

---

# 25. Testing Requirements

ต้องมีการทดสอบ:

> **Core Logic**

การทดสอบใช้:

> **Bun Test**

การทดสอบต้องครอบคลุมการทำงานสำคัญของเกม โดยไม่จำเป็นต้องกำหนด Test Case ทั้งหมดไว้ใน Requirement

---

# 26. Documentation Requirements

โปรเจกต์ต้องมี:

## README

อธิบายอย่างน้อย:

* วิธีติดตั้ง
* วิธี Run
* วิธีเล่น
* กติกาหลัก
* โครงสร้างโปรเจกต์

## Class Diagram

ต้องแสดง:

* Class
* Interface
* ความสัมพันธ์หลักของระบบ

Requirement ด้าน Technical และ Documentation นี้อ้างอิงจากข้อกำหนดเดิมของโปรเจกต์

---

# 27. Separation of Documents

เพื่อป้องกันข้อมูลคนละประเภทปนกัน โปรเจกต์แบ่งเอกสารเป็น:

```text
Mini Monopoly
│
├── Requirements
│   └── สิ่งที่ระบบต้องมีและต้องทำ
│
├── Balance & Simulation
│   └── ตัวเลข Balance, AI Rules,
│       การทดลอง และผล Simulation
│
└── Architecture Specification
    └── โครงสร้าง Class / Interface
        และวิธีการ Implement
```

---

# 3. Current Balance Setting

## 3.1 Starting Money

ผู้เล่นทุกคนเริ่มด้วย:

> **1,000**

---

## 3.2 Property Price

| Tier | Price |
| ---- | ----: |
| T1   |   500 |
| T2   | 1,000 |
| T3   | 1,500 |
| T4   | 2,000 |
| T5   | 2,500 |
| T6   | 3,000 |

---

## 3.3 Rent

Rent กำหนดเป็น:

> **100% ของราคา Property**

| Tier | Property Price |  Rent |
| ---- | -------------: | ----: |
| T1   |            500 |   500 |
| T2   |          1,000 | 1,000 |
| T3   |          1,500 | 1,500 |
| T4   |          2,000 | 2,000 |
| T5   |          2,500 | 2,500 |
| T6   |          3,000 | 3,000 |

---

## 3.4 START

เมื่อผู้เล่นเดินผ่าน START:

> **ได้รับเงิน +150**

---

## 3.5 TAX

เมื่อ Landing บน TAX:

> **จ่าย 30% ของเงินที่มี**

---

## 3.6 Direct Purchase

ข้อจำกัดในการซื้อ Property:

* ถือ Property พร้อมกันได้สูงสุด **5 หลัง**
* ซื้อ Property สำเร็จรวมได้สูงสุด **7 ครั้งต่อเกม**
* การขาย Property **ไม่คืนจำนวนครั้งในการซื้อ**

ตัวอย่าง:

```text
ซื้อ 5 หลัง
→ ถือ 5 หลัง
→ ซื้อสะสม 5 ครั้ง

ขาย 2 หลัง
→ ถือ 3 หลัง
→ ซื้อสะสมยังเป็น 5 ครั้ง

ซื้อเพิ่ม 2 หลัง
→ ถือ 5 หลัง
→ ซื้อสะสมเป็น 7 ครั้ง

หลังจากนั้นไม่สามารถ Direct Purchase เพิ่มได้
```

---

# 4. Take Over Balance

## 4.1 Cost

Take Over มีค่าใช้จ่าย:

> **65% เพิ่มจากราคาของ Property**

หรือ:

> `Property Price × 1.65`

| Tier | Price | Take Over Cost |
| ---- | ----: | -------------: |
| T1   |   500 |            825 |
| T2   | 1,000 |          1,650 |
| T3   | 1,500 |          2,475 |
| T4   | 2,000 |          3,300 |
| T5   | 2,500 |          4,125 |
| T6   | 3,000 |          4,950 |

## 4.2 Limit

> **1 ครั้งต่อผู้เล่นต่อเกม**

## 4.3 Rent Pool

เมื่อ Take Over:

* Owner เปลี่ยนเป็นผู้เล่นใหม่
* Property เดิมยังคงอยู่
* **Rent Pool เดิมยังคงอยู่บน Property**

---

# 5. Sell Property Balance

## 5.1 Sell Value

ผู้เล่นขาย Property ได้:

> **20% ของราคา Property**

| Tier | Price | Sell Value |
| ---- | ----: | ---------: |
| T1   |   500 |        100 |
| T2   | 1,000 |        200 |
| T3   | 1,500 |        300 |
| T4   | 2,000 |        400 |
| T5   | 2,500 |        500 |
| T6   | 3,000 |        600 |

---

## 5.2 Rent Pool เมื่อขาย

เมื่อ Property ถูกขาย:

> **Rent Pool ของ Property นั้นถูกล้างทันที**

ตัวอย่าง:

```text
Property Price = 1,500
Rent Pool = 2,000

Sell Property
↓
ได้เงิน 300
↓
Property ไม่มีเจ้าของ
↓
Rent Pool = 0
```

---

## 5.3 ลำดับการขาย

AI ทุกระดับใช้ลำดับเดียวกัน:

> **Property ราคาถูกที่สุด → Property ที่แพงขึ้น**

ตัวอย่าง:

```text
T1 = 500
T3 = 1,500
T5 = 2,500

ต้องขาย Property

↓
ขาย T1 ก่อน
↓
ยังไม่พอ
↓
ขาย T3
↓
ยังไม่พอ
↓
ขาย T5
```

---

# 6. Chance Balance

Chance มี 6 Event

| Event            | Probability |
| ---------------- | ----------: |
| Move Forward +5  |         20% |
| +100             |         15% |
| -350             |         20% |
| Dice ×2          |         20% |
| Lottery +300     |         10% |
| Move Backward -3 |         15% |
| **รวม**          |    **100%** |

### Event Details

**Move Forward +5**

* ผู้เล่นเคลื่อนที่ไปข้างหน้า 5 ช่อง

**+100**

* เงินเพิ่ม 100

**-350**

* เงินลด 350

**Dice ×2**

* ใช้ผลลูกเต๋าเดิมคูณ 2

**Lottery +300**

* เงินเพิ่ม 300

**Move Backward -3**

* ผู้เล่นเคลื่อนที่ถอยหลัง 3 ช่อง

---

# 7. Jail Balance

Jail อยู่ช่อง **12**

## 7.1 Bribe

> **500**

เมื่อ Bribe สำเร็จ ผู้เล่นออกจาก Jail และเล่นต่อใน Turn เดิม

## 7.2 Skip

ไม่ต้องจ่ายเงิน แต่เสีย 1 Turn

---

## 7.3 Current Jail Rules

### Easy

> Bribe ถ้าเงินหลังจ่าย **> 30%** ของเงินก่อนจ่าย

ไม่เข้าเงื่อนไข → Skip

### Normal

> **Skip**

### Hard

> Bribe ถ้าเงินหลังจ่าย **> 65%** ของเงินก่อนจ่าย

ไม่เข้าเงื่อนไข → Skip

---

# 8. AI Decision Rules

## 8.1 Easy

Easy ใช้กลไกที่เดิมเป็น **Normal**

### Purchase

ซื้อ Property ถ้า:

> เงินหลังซื้อ **> 30% ของเงินก่อนซื้อ**

### Take Over

Take Over ถ้าหลังจ่าย:

> เงิน **≥ 0**

### Jail

Bribe ถ้า:

> เงินหลังจ่าย **> 30% ของเงินก่อนจ่าย**

ไม่เข้าเงื่อนไข → Skip

### Sell Property

ขายเท่าที่จำเป็นจนเงินพอจ่าย

ลำดับ:

> ถูกสุด → แพงขึ้น

---

## 8.2 Normal

Normal ใช้กลไกที่เดิมเป็น **Easy**

### Purchase

ซื้อ Property ถ้า:

> เงินหลังซื้อ **≥ 0**

### Take Over

Take Over ถ้าหลังจ่าย:

> เงิน **≥ 0**

### Jail

> Skip

### Sell Property

ขาย Property จนเงินพอจ่าย

แม้จำเป็นต้องขาย Property ทั้งหมด

ลำดับ:

> ถูกสุด → แพงขึ้น

---

## 8.3 Hard

### Purchase

ซื้อ Property ถ้า:

> เงินหลังซื้อ **≥ 50% ของเงินก่อนซื้อ**

### Take Over

Take Over ถ้าหลังจ่าย:

> เงิน **≥ 0**

### Jail

Bribe ถ้า:

> เงินหลังจ่าย **> 65% ของเงินก่อนจ่าย**

ไม่เข้าเงื่อนไข → Skip

### Sell Property

ขาย Property จนหลังจากจ่ายแล้วยังเหลือเงินสำรอง:

> **30% ของเงินก่อนจ่าย**

ลำดับ:

> ถูกสุด → แพงขึ้น

---

# 9. Bankruptcy Handling

เมื่อต้องจ่ายเงิน:

```text
Payment Required
      ↓
เงินพอหรือไม่?
 ┌────┴────┐
ใช่       ไม่พอ
 ↓          ↓
จ่าย    Sell Property
             ↓
        เงินพอหรือยัง?
         ┌────┴────┐
        พอ        ไม่พอ
         ↓          ↓
        จ่าย    Bankruptcy
```

ถ้าขาย Property แล้วยังไม่สามารถจ่ายได้:

> **Bankrupt**

เมื่อ Bankruptcy:

* ผู้เล่นออกจากเกม
* Property ทั้งหมดกลับเป็นไม่มีเจ้าของ
* Rent Pool ของ Property เหล่านั้นถูกล้าง

---

# 10. Board Balance

Board มีทั้งหมด:

> **32 ช่อง**

Property Distribution:

| Tier    |  จำนวน |
| ------- | -----: |
| T1      |      4 |
| T2      |      4 |
| T3      |      4 |
| T4      |      4 |
| T5      |      4 |
| T6      |      2 |
| **รวม** | **22** |

Board Layout:

```text
1  START
2  Property T1
3  Property T1
4  Property T1
5  Property T1
6  Chance
7  Property T2
8  Property T2
9  Free Parking
10 Property T2
11 Property T2
12 Jail
13 Property T3
14 Property T3
15 TAX
16 Property T3
17 Property T3
18 Chance
19 Property T4
20 Property T4
21 Free Parking
22 Property T4
23 Property T4
24 Chance
25 Property T5
26 Property T5
27 TAX
28 Property T5
29 Property T5
30 Chance
31 Property T6
32 Property T6
```

---

# 11. Movement Balance

* Dice = **1–6**
* Board Wrap = **32 → 1**
* Passing START = **+150**
* Dice ×2 = ใช้ผลลูกเต๋าเดิม ×2
* Jail เกิดเฉพาะเมื่อ Landing ตรงช่อง 12
* การเดินผ่าน Jail ไม่ทำให้ติด Jail

---

# 12. Rent Collection

Rent จะสะสมอยู่บน Property

เมื่อผู้เล่นจ่าย Rent:

```text
Player
   ↓
Pay Rent
   ↓
Property Rent Pool
```

เจ้าของ Property เก็บ Rent เมื่อ:

* เดินผ่าน Property ของตัวเอง
* Landing บน Property ของตัวเอง

เมื่อเก็บ:

```text
Owner Money += Rent Pool
Rent Pool = 0
```

เมื่อ Take Over:

> Rent Pool ยังคงอยู่

เมื่อ Sell Property:

> Rent Pool = 0

---

# 13. Simulation Methodology

## 13.1 Number of Games

มาตรฐานการทดสอบ:

> **100,000 เกมต่อชุด Setting**

เหตุผล:

การใช้จำนวนเกมมากช่วยลดผลกระทบจากความผันผวนของ Random Event และทำให้การเปรียบเทียบ Balance มีความน่าเชื่อถือมากขึ้น

---

## 13.2 Simulation Players

ใช้:

```text
Easy ×1
Normal ×1
Hard ×1
GPT ×1
```

GPT ใช้เป็นคู่เปรียบเทียบในการ Simulation และ **ไม่ใช่ผู้เล่นในเกมจริง**

---

## 13.3 Metrics

เก็บข้อมูล:

* Average Turns
* Median Turns
* 75th Percentile
* 90th Percentile
* 95th Percentile
* 99th Percentile
* Minimum Turns
* Maximum Turns
* % จบ ≤100 Turns
* % จบ ≤150 Turns
* % จบ ≤200 Turns
* จำนวนเกมไม่จบ
* Win Rate ของผู้เล่นแต่ละประเภท

---

# 14. Simulation History

ส่วนนี้เก็บผลการทดลองที่ผ่านมา เพื่อแสดงเหตุผลของการเลือก Balance ปัจจุบัน

---

## Experiment 1 — Original Baseline

Setting เดิม:

* Starting Money = 500
* Property = 500 / 1,050 / 1,650 / 2,400 / 3,500 / 5,000
* Rent = 100 / 250 / 450 / 700 / 1,000 / 1,500
* Take Over = +50%
* Take Over Limit = 3
* Jail Bribe = 400
* Board เดิม

Historical Result:

* Average = **117.89 Turns**
* Median = **103 Turns**
* ≤100 = **48.45%**
* ≤150 = **75.27%**
* ≤200 = **88.85%**
* Minimum = **8**
* Maximum = **887**
* Unfinished = **0**

### Conclusion

ชุดนี้ถูกใช้เป็น Baseline แรกสำหรับการทดลอง Balance

---

## Experiment 2 — Board Position

ทดลองเปลี่ยนตำแหน่ง Property บน Board

ผล Historical:

> **117.89 → 201.43 Turns**

เพิ่มขึ้นประมาณ:

> **70.8%**

### Conclusion

ตำแหน่งของ Property มีผลอย่างมากต่อความยาวเกม

จึงเลือก:

> **Board เดิม**

---

## Experiment 3 — Rent

ทดลอง Rent ในระดับ 50% และ 100%

### Rent 50%

Historical Result:

> **≈190.80 Turns**

### Rent 100%

Historical Result:

> **≈144.71 Turns**

### Conclusion

Rent ที่สูงขึ้นช่วยเร่งการไหลของเงินและการเกิด Bankruptcy

จึงเลือก:

> **Rent = 100%**

---

## Experiment 4 — Property Price

เปลี่ยน Property Price เป็น:

> 500 / 1,000 / 1,500 / 2,000 / 2,500 / 3,000

พร้อม Starting Money:

> **1,000**

Historical Result ที่เคยบันทึก:

> **89.57 Turns**

ผลดังกล่าวถูกใช้เป็น Historical Evidence เท่านั้น เนื่องจากเป็นผลจาก Simulator รุ่นก่อน

---

## Experiment 5 — Sell Property

เพิ่ม:

> **Sell Property = 20% ของราคา Property**

และกำหนด:

* ขายถูกสุดก่อน
* ขายแล้ว Rent Pool หาย
* AI แต่ละระดับใช้เงื่อนไขต่างกัน

Historical Result:

> **≈95.65 Turns**

ผลดังกล่าวเป็น Historical Result จาก Simulator รุ่นก่อน

### Conclusion

Sell Property เพิ่มทางเลือกเมื่อผู้เล่นมีเงินไม่พอ แต่ยังสามารถรักษาความเร็วของเกมให้อยู่ในระดับที่ยอมรับได้

จึงเลือก:

> **Sell Property = 20%**

---

## Experiment 6 — Easy / Normal Reassignment

พบว่าการตั้งชื่อระดับ AI เดิมไม่ได้สอดคล้องกับพฤติกรรมและผล Win Rate ที่เกิดขึ้น

จึงทดลองสลับกลไก:

```text
Easy
→ กลไกเดิมของ Normal

Normal
→ กลไกเดิมของ Easy
```

Hard ไม่เปลี่ยน

### Current Decision

ใช้การสลับนี้เป็น Setting ปัจจุบัน

---

# 15. Current Baseline Simulation

หลังจากกำหนด Current Balance และสลับกลไก Easy / Normal แล้ว มีการทดสอบ:

> **100,000 Games**

## Turn Result

| Metric     |           Result |
| ---------- | ---------------: |
| Average    | **105.32 Turns** |
| Median     |     **96 Turns** |
| 75%        |    **131 Turns** |
| 90%        |    **172 Turns** |
| 95%        |    **202 Turns** |
| 99%        |    **278 Turns** |
| Minimum    |      **8 Turns** |
| Maximum    |    **941 Turns** |
| ≤100 Turns |       **53.72%** |
| ≤150 Turns |       **83.72%** |
| ≤200 Turns |       **94.80%** |
| Unfinished |            **0** |

---

## Win Rate Result

| Player |   Win Rate |
| ------ | ---------: |
| GPT    | **27.39%** |
| Normal | **25.74%** |
| Hard   | **25.23%** |
| Easy   | **21.64%** |

สำหรับ AI ที่เป็นระดับในเกมจริง:

> **Normal > Hard > Easy**

Normal กับ Hard ต่างกัน:

> **0.51 percentage point**

ความแตกต่างนี้มีขนาดเล็ก จึงไม่มีการเปลี่ยน Balance เพิ่มเพียงเพื่อบังคับให้ Hard ต้องชนะ Normal ทุกการทดลอง

---

# 16. Result Analysis

## 16.1 Game Length

Average:

> **105.32 Turns**

อยู่ในเป้าหมาย:

> **100–150 Turns**

ดังนั้นระยะเวลาโดยรวมถือว่าอยู่ในช่วงที่ต้องการ

---

## 16.2 Distribution

มากกว่า:

> **83.72%** ของเกมจบภายใน 150 Turns

และ:

> **94.80%** ของเกมจบภายใน 200 Turns

แสดงว่าเกมส่วนใหญ่ไม่ได้ลากยาวผิดปกติ

---

## 16.3 Completion

จาก:

> **100,000 Games**

มี:

> **0 Unfinished Games**

จึงไม่มีปัญหาที่เกมติดค้างโดยไม่สามารถหาผู้ชนะได้ใน Simulation รอบปัจจุบัน

---

## 16.4 AI Balance

Easy มี Win Rate ต่ำสุด:

> **21.64%**

Normal และ Hard อยู่ใกล้กัน:

> Normal = **25.74%**
> Hard = **25.23%**

ดังนั้นระดับ AI สามารถแยกออกจากกันได้ และ Easy ไม่ได้มี Win Rate สูงผิดปกติเหมือนในบาง Historical Experiment

---

# 17. Historical vs Current Data

เพื่อป้องกันความสับสนระหว่าง Setting หลายเวอร์ชัน:

### Historical Data

ตัวเลขต่อไปนี้เป็นผลจากการทดลอง/Simulator รุ่นก่อน:

* 117.89 Turns
* 201.43 Turns
* 144.71 Turns
* 89.57 Turns
* 95.65 Turns

ใช้เพื่ออธิบาย **พัฒนาการของ Balance** เท่านั้น

### Current Baseline

ตัวเลขที่ใช้เป็น Baseline ปัจจุบันคือ:

> **105.32 Turns / 100,000 Games**

พร้อม:

> **83.72% ≤150 Turns**
> **94.80% ≤200 Turns**
> **0 Unfinished Games**

---

# 18. Final Balance Decision

Current Balance ถูกเลือกเพื่อใช้ในการ Implement เนื่องจากผล Simulation ล่าสุดแสดงว่า:

1. Average = **105.32 Turns**
2. อยู่ในเป้าหมาย **100–150 Turns**
3. 83.72% ของเกมจบภายใน 150 Turns
4. 94.80% ของเกมจบภายใน 200 Turns
5. 0 เกมไม่จบจากการทดสอบ 100,000 เกม
6. Easy มี Win Rate ต่ำสุด
7. Normal และ Hard อยู่ในระดับใกล้เคียงกัน
8. Board เดิมให้ผลดีกว่า Board ที่สลับตำแหน่ง Property ใน Historical Experiment
9. Rent 100% ช่วยทำให้เกมเร็วขึ้น
10. Sell Property ช่วยให้ผู้เล่นมีทางแก้ปัญหาเมื่อเงินไม่พอ
11. Property Price 500–3,000 และ Starting Money 1,000 ทำให้เกมเข้าสู่การแข่งขันได้เร็ว

---

# 19. Current Baseline Summary

### Economy

```text
Starting Money     = 1,000

Property:
T1 = 500
T2 = 1,000
T3 = 1,500
T4 = 2,000
T5 = 2,500
T6 = 3,000

Rent               = 100%
START              = +150
TAX                = 30%

Hold Property      = 5
Purchase Count     = 7

Take Over Cost     = +65%
Take Over Limit    = 1

Sell Property      = 20%
Jail Bribe         = 500
```

### Board

```text
32 Tiles
Original Board Layout
T1 ×4
T2 ×4
T3 ×4
T4 ×4
T5 ×4
T6 ×2
```

### Chance

```text
+5        = 20%
+100      = 15%
-350      = 20%
Dice ×2   = 20%
+300      = 10%
-3        = 15%
```

### AI

```text
Easy
= Former Normal Logic

Normal
= Former Easy Logic

Hard
= Hard Logic
```

### Simulation Baseline

```text
Games                = 100,000
Average              = 105.32 Turns
Median               = 96 Turns
≤150 Turns           = 83.72%
≤200 Turns           = 94.80%
Unfinished           = 0
```

---

# 20. Status

> **Current Balance Baseline: APPROVED FOR IMPLEMENTATION**

