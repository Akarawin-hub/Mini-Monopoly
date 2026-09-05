# Mini Monopoly — Current Balance Setting

## 1. Overview

เอกสารนี้กำหนดค่า Setting ปัจจุบันของเกม **Mini Monopoly** ซึ่งใช้เป็น Baseline สำหรับการทดสอบ Balance และ Simulation

Setting ชุดนี้มีเป้าหมายให้เกมมีระยะเวลาการเล่นที่เหมาะสม มีความแตกต่างระหว่าง AI แต่ละระดับ และมีระบบ Economy ที่ทำให้เกิดการซื้อ Property, การจ่าย Rent, การขาย Property และ Take Over อย่างต่อเนื่อง

> **Current Balance Candidate**
>
> Average Game Length = **102.03 Turns**

---

# 2. Economy Setting

## 2.1 Starting Money

```text
Starting Money = 1,000
```

ผู้เล่นทุกคนเริ่มเกมด้วยเงิน **1,000**

เงินเริ่มต้นมีผลโดยตรงต่อความสามารถในการซื้อ Property ช่วงต้นเกม และเป็นตัวกำหนดว่าผู้เล่นสามารถรับความเสี่ยงทางการเงินได้มากเพียงใด

---

# 3. Property Setting

## 3.1 Property Prices

| Tier | Price |
| ---- | ----: |
| T1   |   500 |
| T2   | 1,000 |
| T3   | 1,500 |
| T4   | 2,000 |
| T5   | 2,500 |
| T6   | 3,000 |

Property มีทั้งหมด 6 ระดับ โดยราคาจะเพิ่มขึ้นตาม Tier

```text
T1 = 500
T2 = 1,000
T3 = 1,500
T4 = 2,000
T5 = 2,500
T6 = 3,000
```

---

## 3.2 Rent

```text
Rent = 100% of Property Price
```

ค่า Rent เท่ากับ **100% ของราคาซื้อ Property**

| Tier | Property Price |  Rent |
| ---- | -------------: | ----: |
| T1   |            500 |   500 |
| T2   |          1,000 | 1,000 |
| T3   |          1,500 | 1,500 |
| T4   |          2,000 | 2,000 |
| T5   |          2,500 | 2,500 |
| T6   |          3,000 | 3,000 |

Rent เป็นแหล่งรายได้หลักของผู้ถือครอง Property และเป็นกลไกสำคัญในการทำให้เงินถูกหมุนเวียนระหว่างผู้เล่น

---

# 4. START

```text
START = +150
```

เมื่อผู้เล่นผ่าน START จะได้รับเงิน **150**

ระบบนี้ช่วยเพิ่มเงินเข้าสู่ Economy อย่างต่อเนื่อง และช่วยให้ผู้เล่นสามารถกลับเข้าสู่ตลาด Property ได้หลังจากเสียเงินจาก Rent หรือ TAX

---

# 5. TAX

```text
TAX = 30%
```

TAX กำหนดไว้ที่ **30%**

TAX ทำหน้าที่เป็น Money Sink ของระบบ Economy โดยนำเงินออกจากระบบเมื่อผู้เล่นตกลงบนช่อง TAX

> หมายเหตุ: การกำหนดฐานของ 30% ว่าคำนวณจากค่าใด ต้องอ้างอิง Implementation จริงของเกม

---

# 6. Property Holding

```text
Hold Property = 5
```

ผู้เล่นสามารถถือครอง Property ได้สูงสุด **5 แห่ง**

ข้อจำกัดนี้ช่วยป้องกันการสะสม Property มากเกินไปโดยผู้เล่นคนเดียว และช่วยให้ Property ยังคงมีการหมุนเวียนระหว่างผู้เล่น

---

# 7. Purchase Count

```text
Purchase Count = 7
```

จำนวนการซื้อ Property ที่กำหนดไว้คือ **7**

ค่า Purchase Count ใช้เป็นข้อจำกัดของจำนวนครั้งในการซื้อ Property ตามกติกา Implementation ของเกม

---

# 8. Take Over

## 8.1 Take Over Cost

```text
Take Over Cost = +65%
```

การ Take Over ต้องใช้เงินจำนวน

```text
Property Price × 1.65
```

ตัวอย่าง:

| Tier | Property Price | Take Over Cost |
| ---- | -------------: | -------------: |
| T1   |            500 |            825 |
| T2   |          1,000 |          1,650 |
| T3   |          1,500 |          2,475 |
| T4   |          2,000 |          3,300 |
| T5   |          2,500 |          4,125 |
| T6   |          3,000 |          4,950 |

---

## 8.2 Take Over Limit

```text
Take Over Limit = 1
```

ผู้เล่นแต่ละคนสามารถใช้ Take Over ได้สูงสุด **1 ครั้งต่อเกม**

ข้อจำกัดนี้ลดโอกาสที่ผู้เล่นจะใช้ Take Over ต่อเนื่องเพื่อเร่งการยึดครอง Property ของผู้เล่นอื่น

---

# 9. Sell Property

```text
Sell Property = 20%
```

เมื่อขาย Property ผู้เล่นจะได้รับเงินคืน **20% ของราคาซื้อ Property**

| Tier | Property Price | Sell Value |
| ---- | -------------: | ---------: |
| T1   |            500 |        100 |
| T2   |          1,000 |        200 |
| T3   |          1,500 |        300 |
| T4   |          2,000 |        400 |
| T5   |          2,500 |        500 |
| T6   |          3,000 |        600 |

ระบบ Sell Property ทำหน้าที่เป็นกลไกช่วยเหลือผู้เล่นที่ขาดสภาพคล่อง แต่การขายที่ 20% ทำให้การขาย Property มีต้นทุนสูงและไม่สามารถใช้เพื่อกู้เงินกลับมาได้ทั้งหมด

---

# 10. Jail

## Jail Bribe

```text
Jail Bribe = 500
```

ผู้เล่นสามารถจ่ายเงิน **500** เพื่อใช้กลไก Bribe ตามเงื่อนไขของ AI หรือกติกาเกม

การตัดสินใจว่าจะ Bribe หรือ Skip ขึ้นอยู่กับ AI Logic ของผู้เล่นแต่ละระดับ

---

# 11. Board

## 11.1 Board Size

```text
Board = 32 Tiles
```

เกมใช้กระดานทั้งหมด **32 ช่อง**

---

## 11.2 Property Distribution

| Tier      |  จำนวน |
| --------- | -----: |
| T1        |      4 |
| T2        |      4 |
| T3        |      4 |
| T4        |      4 |
| T5        |      4 |
| T6        |      2 |
| **Total** | **22** |

ดังนั้นมี Property ทั้งหมด **22 ช่อง**

---

## 11.3 Original Board Layout

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

ช่องที่ไม่ใช่ Property ประกอบด้วยช่องระบบ เช่น START, Chance, TAX, Jail และ Free Parking ตาม Original Board Layout

---

# 12. Chance

Chance มีทั้งหมด 6 รูปแบบ

| Chance    | Probability |
| --------- | ----------: |
| +5        |         20% |
| +100      |         15% |
| -350      |         20% |
| Dice ×2   |         20% |
| +300      |         10% |
| -3        |         15% |
| **Total** |    **100%** |

## Chance Effects

### +5

```text
Move +5
Probability = 20%
```

ผู้เล่นเคลื่อนที่เพิ่ม 5 ช่อง

### +100

```text
Money +100
Probability = 15%
```

ผู้เล่นได้รับเงินเพิ่ม 100

### -350

```text
Money -350
Probability = 20%
```

ผู้เล่นเสียเงิน 350

### Dice ×2

```text
Dice ×2
Probability = 20%
```

ผลของลูกเต๋าจะถูกนำไปใช้ตามกลไก Dice ×2 ของเกม

### +300

```text
Money +300
Probability = 10%
```

ผู้เล่นได้รับเงินเพิ่ม 300

### -3

```text
Move -3
Probability = 15%
```

ผู้เล่นเคลื่อนที่ถอยหลัง 3 ช่อง

---

# 13. AI Logic

AI แต่ละระดับใช้ Logic ที่แตกต่างกันในการตัดสินใจซื้อ Property, Take Over, การจัดการเงิน และ Jail

---

## 13.1 Easy AI

### Purchase Property

Easy AI ซื้อ Property เมื่อซื้อแล้วเงินคงเหลือยังมากกว่าหรือเท่ากับ **50% ของเงินก่อนซื้อ**

```text
Money After Purchase ≥ 50% of Money Before Purchase
```

ตัวอย่าง:

```text
Money = 2,000
Property = 1,000

Money After Purchase = 1,000
1,000 ≥ 50% × 2,000

→ Buy
```

---

### Take Over

Easy AI ใช้ Take Over เมื่อหลังจากจ่ายค่า Take Over แล้วเงินคงเหลือยังมากกว่าหรือเท่ากับ **50% ของเงินก่อน Take Over**

```text
Money After Take Over ≥ 50% of Money Before Take Over
```

Easy AI ยังพิจารณา **ความคุ้มค่าของ Property** ก่อนตัดสินใจ Take Over

```text
Take Over Limit = 1
```

---

### Insufficient Money

เมื่อเงินไม่เพียงพอ Easy AI จะ:

1. ขาย Property มูลค่าต่ำก่อน
2. พยายามรักษา Property มูลค่าสูงไว้

---

### Jail

Easy AI สามารถจ่าย:

```text
Bribe = 500
```

เมื่อการจ่าย Bribe ยังอยู่ในระดับที่เหมาะสม

หากไม่คุ้มค่า:

```text
→ Skip
```

---

# 14. Normal AI

## Purchase Property

Normal AI ซื้อ Property เมื่อหลังซื้อยังเหลือเงินอย่างน้อย **30% ของเงินก่อนซื้อ**

```text
Money After Purchase ≥ 30% of Money Before Purchase
```

---

## Take Over

Normal AI ใช้ Take Over เมื่อหลังจากจ่ายค่า Take Over แล้วเงินยังเหลืออย่างน้อย **30%**

```text
Money After Take Over ≥ 30% of Money Before Take Over
```

---

## Insufficient Money

เมื่อเงินไม่เพียงพอ:

```text
Sell lowest-priced Property first
```

Normal AI จะขาย Property ราคาต่ำก่อน

---

## Jail

Normal AI จะ Bribe เมื่อหลังจากจ่าย 500 แล้วเงินยังเหลือมากกว่า **30%**

```text
Money After Bribe > 30%
```

หากไม่ผ่านเงื่อนไข:

```text
→ Skip
```

---

# 15. Hard AI

## Purchase Property

Hard AI ใช้เกณฑ์การซื้อที่ผ่อนคลายที่สุด:

```text
Money - Price ≥ 0
```

กล่าวคือ หากมีเงินเพียงพอที่จะจ่ายราคา Property ก็สามารถซื้อได้

---

## Take Over

Hard AI ใช้ Take Over เมื่อมีเงินเพียงพอสำหรับค่า Take Over:

```text
Money - (Price × 1.65) ≥ 0
```

และมีข้อจำกัด:

```text
Take Over Limit = 1
```

---

## Insufficient Money

เมื่อเงินไม่เพียงพอ:

```text
Sell lowest-priced Property first
```

Hard AI จะขาย Property ราคาต่ำสุดก่อน

---

## Jail

Hard AI:

```text
Skip
```

ไม่จ่าย Jail Bribe

---

# 16. Simulation Baseline

Setting นี้ถูกนำไปทดสอบด้วย Monte Carlo Simulation จำนวน:

```text
Games = 100,000
```

ผล Baseline ที่บันทึกไว้:

| Metric     |           Result |
| ---------- | ---------------: |
| Games      |      **100,000** |
| Average    | **102.03 Turns** |
| Median     |     **96 Turns** |
| ≤150 Turns |       **87.10%** |
| ≤200 Turns |       **96.94%** |
| Unfinished |           **0%** |

---

# 17. Balance Assessment

ผล Simulation แสดงว่า Setting นี้สามารถทำให้เกมส่วนใหญ่จบภายในระยะเวลาที่ค่อนข้างสั้น:

```text
Average = 102.03 Turns
Median  = 96 Turns
```

และ:

```text
87.10% ของเกม
จบภายใน 150 Turns
```

รวมถึง:

```text
96.94% ของเกม
จบภายใน 200 Turns
```

และจาก Simulation ที่บันทึกไว้:

```text
Unfinished = 0%
```

ดังนั้น Setting นี้สามารถใช้เป็น **Current Balance Candidate** สำหรับการทดสอบต่อไปได้

อย่างไรก็ตาม Average Turn เพียงอย่างเดียวไม่เพียงพอที่จะพิสูจน์ว่าเป็น Setting ที่ Balance ที่สุด จำเป็นต้องเปรียบเทียบ Win Rate, Economy, Bankruptcy และความแตกต่างระหว่าง AI เพิ่มเติมก่อนสรุปว่าเป็น **Best Balance** อย่างเป็นทางการ

---

# 18. Current Setting Summary

```text
Starting Money       = 1,000

T1                   = 500
T2                   = 1,000
T3                   = 1,500
T4                   = 2,000
T5                   = 2,500
T6                   = 3,000

Rent                 = 100%
START                = +150
TAX                  = 30%

Hold Property        = 5
Purchase Count       = 7

Take Over Cost       = +65%
Take Over Limit      = 1

Sell Property        = 20%
Jail Bribe           = 500

Board                = 32 Tiles

T1                   = 4
T2                   = 4
T3                   = 4
T4                   = 4
T5                   = 4
T6                   = 2

Chance:
+5                   = 20%
+100                 = 15%
-350                 = 20%
Dice ×2              = 20%
+300                 = 10%
-3                   = 15%

AI Logic:
Easy                 = 50% Reserve Logic
Normal               = 30% Reserve Logic
Hard                 = Affordability Logic

Simulation:
Games                = 100,000
Average              = 102.03 Turns
Median               = 96 Turns
≤150 Turns           = 87.10%
≤200 Turns           = 96.94%
Unfinished           = 0%
```

---

# 19. Status

```text
STATUS = CURRENT BALANCE CANDIDATE
```

Setting นี้เป็น Baseline ปัจจุบันสำหรับการพัฒนาและทดสอบ Balance ของ Mini Monopoly
---
---
---
---
---
---
---
---
---
---
# Mini Monopoly — Detailed Requirements

## 1. ข้อมูลทั่วไปของระบบ

### 1.1 ชื่อระบบ

**Mini Monopoly**

### 1.2 รูปแบบเกม

* Board Game แบบ Turn-based
* เล่นผ่าน Terminal / Console
* Board มีทั้งหมด 32 Tiles
* มีผู้เล่นทั้งหมด 4 คน

  * Human ×1
  * COM Easy ×1
  * COM Normal ×1
  * COM Hard ×1
* ไม่มีการเลือกจำนวนผู้เล่น

### 1.3 เป้าหมายของเกม

ผู้เล่นต้องแข่งขันกันโดย:

* เคลื่อนที่บน Board
* ซื้อ Property
* จ่ายและรับ Rent
* ใช้ระบบ Take Over
* จัดการเงิน
* ใช้ Chance และ Special Tile
* ขาย Property เมื่อเงินไม่พอ
* หลีกเลี่ยง Bankruptcy

เกมดำเนินต่อจนเหลือผู้เล่นที่ไม่ Bankruptcy เพียง 1 คน

ผู้เล่นคนนั้นเป็นผู้ชนะ

---

# 2. Technical Requirements

| หัวข้อ        | ข้อกำหนด                              |
| ------------- | ------------------------------------- |
| Interface     | Console / TUI                         |
| Language      | TypeScript                            |
| Runtime       | Bun                                   |
| OOP           | Class + Interface                     |
| FP            | Pure Function + Higher-order Function |
| Architecture  | แยก Logic ออกจาก I/O                  |
| Testing       | Core Logic                            |
| Persistence   | JSON File                             |
| Documentation | README + Class Diagram                |

### Technology

```text
TypeScript
    │
    ├── Bun Runtime
    ├── Bun Test
    ├── File System / JSON
    └── Standard Library
```

---

# 3. Player Requirements

ผู้เล่นแต่ละคนต้องมีข้อมูลอย่างน้อย:

* `name`
* `money`
* `position`
* `properties`
* `status`

ระบบต้องสามารถติดตาม:

* จำนวนครั้งที่ซื้อ Property
* จำนวน Property ที่ถืออยู่
* จำนวนครั้งที่ใช้ Take Over
* สถานะ Jail
* สถานะ Bankruptcy

ประเภทผู้เล่น:

```text
Human
COM Easy
COM Normal
COM Hard
```

---

# 4. Board Requirements

## 4.1 Board Size

* Board มีทั้งหมด **32 Tiles**
* Board เป็นวงรอบ
* เมื่อเดินผ่าน Tile 32 ให้กลับไป Tile 1

## 4.2 Tile Types

ระบบต้องรองรับ:

* START
* Property
* Chance
* Free Parking
* Jail
* TAX

## 4.3 Board Layout

| Tile | Type         |
| ---: | ------------ |
|    1 | START        |
|    2 | T1           |
|    3 | T1           |
|    4 | T1           |
|    5 | T1           |
|    6 | Chance       |
|    7 | T2           |
|    8 | T2           |
|    9 | Free Parking |
|   10 | T2           |
|   11 | T2           |
|   12 | Jail         |
|   13 | T3           |
|   14 | T3           |
|   15 | TAX          |
|   16 | T3           |
|   17 | T3           |
|   18 | Chance       |
|   19 | T4           |
|   20 | T4           |
|   21 | Free Parking |
|   22 | T4           |
|   23 | T4           |
|   24 | Chance       |
|   25 | T5           |
|   26 | T5           |
|   27 | TAX          |
|   28 | T5           |
|   29 | T5           |
|   30 | Chance       |
|   31 | T6           |
|   32 | T6           |

### Property Distribution

| Tier    |  จำนวน |
| ------- | -----: |
| T1      |      4 |
| T2      |      4 |
| T3      |      4 |
| T4      |      4 |
| T5      |      4 |
| T6      |      2 |
| **รวม** | **22** |

---

# 5. Turn Requirements

แต่ละ Turn มีลำดับหลัก:

```text
Roll Dice
    ↓
Move
    ↓
Resolve Tile
    ↓
Action
    ↓
Check Status
    ↓
Next Player
```

ระบบต้องสามารถ:

1. เริ่ม Turn ของผู้เล่นปัจจุบัน
2. ตรวจสอบสถานะ Jail
3. ทอยลูกเต๋าเมื่อสามารถเล่นได้
4. คำนวณตำแหน่งใหม่
5. ตรวจสอบ Tile
6. ดำเนิน Action
7. ตรวจสอบเงินและ Bankruptcy
8. เปลี่ยนไปยังผู้เล่นถัดไป

---

# 6. Dice and Movement Requirements

## 6.1 Dice

* ใช้ลูกเต๋า 1 ลูก
* ผลลัพธ์อยู่ในช่วง **1–6**

## 6.2 Movement

* ผู้เล่นเคลื่อนที่ตามผลลูกเต๋า
* Board วนจาก Tile 32 กลับ Tile 1
* หากเดินผ่าน START จะได้รับเงินตามกฎ START

## 6.3 Dice ×2

Dice ×2 หมายถึง:

> ผลลูกเต๋าที่ทอยได้ถูกคูณ 2

ตัวอย่าง:

```text
Roll = 4
Movement = 4 × 2
Movement = 8 Tiles
```

ไม่ใช่การทอยลูกเต๋าเพิ่มอีกลูก

---

# 7. Economy Requirements

## 7.1 Starting Money

ผู้เล่นทุกคนเริ่มเกมด้วย:

> **1,000**

## 7.2 Property Price

| Tier | Price |
| ---- | ----: |
| T1   |   500 |
| T2   | 1,000 |
| T3   | 1,500 |
| T4   | 2,000 |
| T5   | 2,500 |
| T6   | 3,000 |

## 7.3 Rent

Rent = **100% ของ Property Price**

| Tier | Price |  Rent |
| ---- | ----: | ----: |
| T1   |   500 |   500 |
| T2   | 1,000 | 1,000 |
| T3   | 1,500 | 1,500 |
| T4   | 2,000 | 2,000 |
| T5   | 2,500 | 2,500 |
| T6   | 3,000 | 3,000 |

## 7.4 START

เมื่อผู้เล่น **เดินผ่าน START**:

> ได้รับเงิน **+150**

## 7.5 TAX

เมื่อผู้เล่น Landing บน TAX:

> จ่าย **30% ของเงินที่มีอยู่ในขณะนั้น**

ตัวอย่าง:

```text
Money = 1,000
TAX = 30%
จ่าย = 300
เหลือ = 700
```

---

# 8. Property Requirements

Property ต้องมีข้อมูลอย่างน้อย:

* `name`
* `price`
* `rent`
* `owner`
* `rentPool`

Property สามารถมีสถานะ:

```text
Unowned
Owned by Current Player
Owned by Other Player
```

---

# 9. Property Purchase Requirements

เมื่อผู้เล่น Landing บน Property ที่ไม่มีเจ้าของ:

ระบบต้องให้ผู้เล่นตัดสินใจว่าจะซื้อหรือไม่

```text
Buy Property?
    ├── Yes → Purchase
    └── No
```

เมื่อซื้อสำเร็จ:

1. ตรวจสอบเงื่อนไขการซื้อ
2. หักเงินตามราคา Property
3. เปลี่ยน Owner
4. เพิ่ม Property ให้ผู้เล่น
5. เพิ่ม Purchase Count

---

# 10. Purchase Count

**Purchase Count = 7**

หมายถึงจำนวนครั้งที่ผู้เล่น **ซื้อ Property โดยตรง**

กฎ:

* ซื้อสำเร็จ 1 ครั้ง → Purchase Count +1
* สูงสุด 7 ครั้งต่อเกม
* ขาย Property แล้ว **Purchase Count ไม่ลด**
* Take Over **ไม่เพิ่ม Purchase Count**

ตัวอย่าง:

```text
Purchase Count = 4
Take Over = 1 ครั้ง

Purchase Count ยังคง = 4
```

ผู้เล่นยังเหลือสิทธิ์ Direct Purchase อีก:

```text
7 - 4 = 3 ครั้ง
```

---

# 11. Hold Property

**Hold Property = 5**

หมายถึงจำนวน Property ที่ผู้เล่นสามารถถือครองพร้อมกันได้สูงสุด

กฎ:

* ถือได้สูงสุด 5 Property
* Purchase Count และ Hold Property เป็นคนละระบบ
* การขาย Property ทำให้จำนวนที่ถืออยู่ลดลง
* Take Over ทำให้ผู้เล่นเดิมเสีย Property
* Take Over ไม่ลด Purchase Count

ตัวอย่าง:

```text
Purchase Count = 4
Hold Property = 5
```

หาก Take Over ทำให้เสีย Property:

```text
Hold = 4
Purchase Count = 4
```

ผู้เล่นสามารถซื้อเพิ่มได้ แต่ซื้อได้เพียง 1 Property เพราะ Hold เหลือพื้นที่เพียง 1 ช่อง

---

# 12. Rent Requirements

เมื่อผู้เล่น Landing บน Property ของผู้เล่นอื่น:

* ต้องจ่าย Rent
* หรือสามารถเลือก Take Over ได้หากเข้าเงื่อนไข

เมื่อผู้เล่นเดินผ่าน Property ของตัวเอง:

* สามารถเก็บ Rent Pool ได้

เมื่อ Landing บน Property ของตัวเอง:

* สามารถเก็บ Rent Pool ได้

---

# 13. Rent Pool Requirements

Rent ที่ผู้เล่นจ่ายจะถูกสะสมไว้บน Property

```text
Player
   ↓
Pay Rent
   ↓
Property Rent Pool
```

เมื่อเจ้าของเก็บ Rent:

```text
Owner Money += Rent Pool
Rent Pool = 0
```

Rent Pool ต้องคงอยู่บน Property จนกว่าจะถูกเก็บหรือถูกล้างตามกฎ

### Take Over

เมื่อ Take Over สำเร็จ:

> Rent Pool เดิมยังคงอยู่บน Property

### Sell Property

เมื่อ Property ถูกขาย:

> Rent Pool = 0

### Bankruptcy

เมื่อผู้เล่น Bankruptcy:

* Property กลับเป็นไม่มีเจ้าของ
* Rent Pool ของ Property เหล่านั้นถูกล้าง

---

# 14. Take Over Requirements

ระบบต้องรองรับการ Take Over Property ของผู้เล่นอื่น

เมื่อ Take Over สำเร็จ:

1. หักค่า Take Over
2. Property เปลี่ยน Owner
3. เจ้าของเดิมสูญเสีย Property
4. ผู้เล่นใหม่ได้รับ Property
5. Rent Pool เดิมยังคงอยู่
6. เพิ่มจำนวน Take Over ที่ใช้ไป

## Take Over Cost

Take Over Cost =

> **Property Price × 1.65**

หรือเพิ่มขึ้น 65% จากราคาปกติ

| Tier | Price | Take Over Cost |
| ---- | ----: | -------------: |
| T1   |   500 |            825 |
| T2   | 1,000 |          1,650 |
| T3   | 1,500 |          2,475 |
| T4   | 2,000 |          3,300 |
| T5   | 2,500 |          4,125 |
| T6   | 3,000 |          4,950 |

## Take Over Limit

ผู้เล่นสามารถ Take Over ได้สูงสุด:

> **1 ครั้งต่อเกม**

Take Over ไม่ถือเป็น Purchase Count

---

# 15. Special Tile Requirements

## 15.1 START

เมื่อเดินผ่าน START:

> Money +150

## 15.2 TAX

เมื่อ Landing บน TAX:

> Money ลดลง 30% ของเงินปัจจุบัน

## 15.3 Free Parking

เมื่อ Landing:

> ไม่มี Action พิเศษ

## 15.4 Jail

Jail อยู่ที่:

> **Tile 12**

ผู้เล่นจะเข้าสู่ Jail เฉพาะเมื่อ:

> Landing ตรง Tile 12

การเดินผ่าน Tile 12 ไม่ทำให้เข้าสู่ Jail

## 15.5 Chance

เมื่อ Landing บน Chance:

* สุ่ม Chance Event
* ดำเนิน Event ทันที
* หาก Event ทำให้เคลื่อนที่ ต้อง Resolve Tile ปลายทางตามกฎของเกม

---

# 16. Chance Requirements

ระบบมี Chance Event 6 รูปแบบ:

| Event            | Probability |
| ---------------- | ----------: |
| Move Forward +5  |         20% |
| +100             |         15% |
| -350             |         20% |
| Dice ×2          |         20% |
| +300             |         10% |
| Move Backward -3 |         15% |
| **รวม**          |    **100%** |

### Event Details

**Move Forward +5**

* เดินหน้า 5 Tiles

**+100**

* Money +100

**-350**

* Money -350

**Dice ×2**

* ผลลูกเต๋าเดิม ×2
* ไม่ทอยลูกใหม่

**+300**

* Money +300

**Move Backward -3**

* ถอยหลัง 3 Tiles

---

# 17. Jail Requirements

Jail = **1 Turn**

## Bribe

ค่า Bribe:

> **500**

เมื่อผู้เล่นเลือก Bribe และจ่ายสำเร็จ:

> **ได้ทอยใน Turn ถัดไป**

Bribe ไม่ทำให้ผู้เล่นได้เล่นต่อใน Turn เดิม

## Stay

เมื่อผู้เล่นเลือก Stay:

> **Turn ถัดไปถูก Skip**

หลังจาก Skip แล้ว ผู้เล่นจึงออกจาก Jail

---

# 18. AI Requirements

ระบบต้องมี AI 3 ระดับ:

```text
Easy
Normal
Hard
```

AI ต้องตัดสินใจเรื่อง:

* Purchase
* Take Over
* Jail
* Sell Property

---

# 19. Easy AI

## Purchase

ซื้อ Property เมื่อ:

> **Money After Purchase ≥ 50% ของ Money Before Purchase**

## Take Over

Take Over ได้เมื่อ **เงื่อนไขทั้ง 2 ข้อเป็นจริง**:

1. `Money After Take Over ≥ 50% ของ Money Before Take Over`
2. `Rent Pool ≥ 30% ของ Property Price`

ตัวอย่าง:

```text
Property Price = 1,000
Rent Pool ≥ 300
```

และหลังจ่าย Take Over ต้องเหลือเงินอย่างน้อย 50% ของเงินก่อนจ่าย

Easy AI ใช้ Take Over ได้สูงสุด:

> **1 ครั้งต่อเกม**

## Jail

Bribe เมื่อ:

> `Money After Bribe ≥ 50% ของ Money Before Bribe`

หากไม่เข้าเงื่อนไข:

> Stay

## Sell Property

เมื่อเงินไม่พอ:

> ขาย Property ราคาต่ำสุดก่อน

และขายเท่าที่จำเป็นเพื่อให้สามารถชำระเงินได้

---

# 20. Normal AI

## Purchase

ซื้อ Property เมื่อ:

> **Money After Purchase ≥ 30% ของ Money Before Purchase**

## Take Over

Take Over เมื่อ:

> **Money After Take Over ≥ 30% ของ Money Before Take Over**

Take Over ได้สูงสุด:

> **1 ครั้งต่อเกม**

## Jail

> **Stay**

ไม่ Bribe

## Sell Property

เมื่อเงินไม่พอ:

> ขาย Property ราคาต่ำสุดก่อน

ขายต่อจนกว่าจะมีเงินเพียงพอสำหรับการชำระเงิน

---

# 21. Hard AI

## Purchase

ซื้อ Property เมื่อ:

> **Money After Purchase ≥ 0**

หมายถึงต้องมีเงินเพียงพอจ่ายราคาเต็ม

## Take Over

Take Over เมื่อ:

> **Money After Take Over ≥ 0**

หรือ:

```text
Money - (Property Price × 1.65) ≥ 0
```

Take Over ได้สูงสุด:

> **1 ครั้งต่อเกม**

## Jail

> **Stay**

ไม่ Bribe

## Sell Property

เมื่อเงินไม่พอ:

> ขาย Property ราคาต่ำสุดก่อน

ขายต่อจนสามารถชำระเงินที่จำเป็นได้

---

# 22. Sell Property Requirements

ระบบต้องรองรับการขาย Property

Sell Value:

> **20% ของ Property Price**

| Tier | Price | Sell Value |
| ---- | ----: | ---------: |
| T1   |   500 |        100 |
| T2   | 1,000 |        200 |
| T3   | 1,500 |        300 |
| T4   | 2,000 |        400 |
| T5   | 2,500 |        500 |
| T6   | 3,000 |        600 |

เมื่อขาย:

1. ได้เงินตาม Sell Value
2. Property ถูกนำออกจากผู้ถือครอง
3. Owner ถูกเปลี่ยนเป็นไม่มีเจ้าของ
4. Rent Pool ถูกล้าง
5. Purchase Count ไม่เปลี่ยน

AI ทุกระดับใช้ลำดับ:

> Property ราคาถูกที่สุด → ราคาแพงขึ้น

---

# 23. Payment and Bankruptcy Requirements

เมื่อผู้เล่นต้องชำระเงิน:

```text
Payment Required
      ↓
Money Enough?
   ├── Yes → Pay
   └── No
        ↓
   Sell Property
        ↓
Money Enough?
   ├── Yes → Pay
   └── No → Bankruptcy
```

ระบบต้อง:

1. ตรวจสอบเงิน
2. หากเงินไม่พอ ตรวจสอบ Property ที่ขายได้
3. ขาย Property ตามกฎ
4. เพิ่มเงิน
5. ตรวจสอบอีกครั้ง
6. หากยังไม่พอ → Bankruptcy

---

# 24. Bankruptcy Requirements

เมื่อผู้เล่นไม่สามารถชำระเงินได้แม้หลังจากขาย Property:

> **ผู้เล่น Bankruptcy**

เมื่อ Bankruptcy:

* ผู้เล่นออกจากเกม
* Property ทั้งหมดกลับเป็นไม่มีเจ้าของ
* Rent Pool ของ Property เหล่านั้นถูกล้าง

หลังจากนั้นระบบตรวจสอบจำนวนผู้เล่นที่ยังไม่ Bankruptcy

หากเหลือ 1 คน:

> เกมจบทันที

---

# 25. Game End Requirements

เกมจบเมื่อ:

> เหลือผู้เล่นที่ไม่ Bankruptcy เพียง 1 คน

ผู้เล่นคนนั้นเป็น:

> **Winner**

ไม่มีระบบ Ranking

---

# 26. Game State Requirements

ระบบต้องสามารถเก็บ:

* Players
* Current Player
* Player Position
* Player Money
* Player Properties
* Property Owner
* Property Rent
* Property Rent Pool
* Purchase Count
* Hold Property
* Take Over Count
* Jail Status
* Player Status
* Game Status
* Current Turn

---

# 27. Persistence Requirements

ระบบต้องรองรับการบันทึก Game State ลง:

> **JSON File**

ข้อมูลต้องสามารถนำกลับมาใช้สร้าง Game State ได้

อย่างน้อยต้องรองรับ:

* Player
* Property
* Board
* Game State
* Turn State

File System ต้องแยกออกจาก Core Game Logic

---

# 28. Input / Output Requirements

## Input

Human ต้องสามารถเลือก Action ที่อนุญาต เช่น:

* Buy / No Buy
* Take Over / Pay Rent
* Bribe / Stay
* Sell Property

## Output

ระบบต้องแสดง:

* Current Player
* Position
* Dice Result
* Money
* Properties
* Chance Event
* Rent
* Purchase
* Take Over
* Sell
* Jail
* Bankruptcy
* Winner

---

# 29. Core Logic Requirements

Core Logic ต้องทำงานได้โดยไม่พึ่ง Console Input / Output โดยตรง

Logic ที่ต้องสามารถทดสอบแยกได้:

* Dice
* Movement
* Board Wrap
* START
* Property Purchase
* Purchase Count
* Hold Property
* Rent
* Rent Pool
* Take Over
* Chance
* TAX
* Jail
* Sell Property
* Payment
* Bankruptcy
* Game End
* AI Decision

---

# 30. OOP Requirements

ระบบต้องใช้:

* Class
* Interface

Class ใช้แทน Entity หรือ Component ที่มี State และ Behavior

Interface ใช้กำหนดโครงสร้างร่วมของส่วนที่มีพฤติกรรมเดียวกัน เช่น AI

---

# 31. Functional Programming Requirements

ระบบต้องมี:

* Pure Function
* Higher-order Function

ตัวอย่าง Pure Function:

```text
calculateNewPosition()
calculateTax()
calculateSellValue()
calculateTakeOverCost()
calculateRent()
```

Pure Function ไม่ควรแก้ไข State ภายนอกโดยตรง

---

# 32. Architecture Requirements

ต้องแยก:

```text
Console / TUI
      ↓
Game
      ↓
Core Logic
      ↓
Game State
```

Core Logic ไม่ควรขึ้นกับ:

* `console.log()`
* Console Input
* รูปแบบหน้าจอ

เพื่อให้สามารถนำ Core Logic ไป Test ได้โดยตรง

---

# 33. Testing Requirements

ต้องมี Unit Test สำหรับ Core Logic โดยใช้:

> **Bun Test**

อย่างน้อยต้องทดสอบ:

### Movement

* Dice 1–6
* Board Wrap
* ผ่าน START
* Dice ×2
* Move Forward
* Move Backward

### Property

* Purchase
* Purchase Count
* Hold Property
* Owner
* Purchase Limit
* Hold Limit

### Rent

* Pay Rent
* Rent Pool เพิ่ม
* Collect Rent
* Rent Pool Reset

### Take Over

* Cost
* Money Threshold
* Rent Pool Threshold ของ Easy AI
* Take Over Limit
* Owner Change
* Hold Property Change
* Rent Pool คงอยู่

### Chance

* ทุก Event
* Probability
* Money Change
* Movement Change
* Destination Tile Resolution

### Jail

* Landing Jail
* Bribe
* Stay
* Bribe → Turn ถัดไปได้ทอย
* Stay → Turn ถัดไปถูก Skip
* AI Decision

### Sell

* Sell Value
* Property Removal
* Rent Pool Reset
* Purchase Count ไม่ลด

### Bankruptcy

* เงินไม่พอ
* Sell ก่อน Bankruptcy
* Property Release
* Rent Pool Reset
* Game End

### AI

* Easy Purchase
* Easy Take Over
* Easy Jail
* Normal Purchase
* Normal Take Over
* Normal Jail
* Hard Purchase
* Hard Take Over
* Hard Jail
* Sell Priority

---

# 34. Documentation Requirements

ต้องมี:

## README

อธิบายอย่างน้อย:

* วิธีติดตั้ง
* วิธี Run
* วิธีเล่น
* กติกาหลัก
* AI
* โครงสร้างโปรเจกต์

## Class Diagram

ต้องแสดง:

* Class
* Interface
* ความสัมพันธ์ระหว่าง Class
* ส่วนสำคัญของ Game Logic

---

# 35. Current Balance Summary

## Economy

```text
Starting Money     = 1,000

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

## Board

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

## Chance

```text
+5        = 20%
+100      = 15%
-350      = 20%
Dice ×2   = 20%
+300      = 10%
-3        = 15%
```

## Jail

```text
Bribe = 500

Bribe → Turn ถัดไปได้ทอย
Stay  → Turn ถัดไปถูก Skip
```

## AI

```text
Easy
Purchase:
Money After Purchase ≥ 50%

Take Over:
Money After Take Over ≥ 50%
AND
Rent Pool ≥ 30% ของ Property Price

Jail:
Money After Bribe ≥ 50%
Otherwise Stay


Normal
Purchase:
Money After Purchase ≥ 30%

Take Over:
Money After Take Over ≥ 30%

Jail:
Stay


Hard
Purchase:
Money After Purchase ≥ 0

Take Over:
Money After Take Over ≥ 0

Jail:
Stay
```

---

# 36. Requirement Priority

หากเกิดความขัดแย้งระหว่างข้อมูล:

1. **Current Logic / Current Setting**
2. Detailed Requirements
3. Historical Balance / Simulation

Historical Simulation ไม่สามารถเปลี่ยนกฎปัจจุบันได้

---

# 37. Final Status

> **Mini Monopoly Detailed Requirements — CURRENT**

สถานะ:

> **READY FOR IMPLEMENTATION**

กฎสำคัญที่ถูกล็อกล่าสุด:

* Jail Bribe → Turn ถัดไปได้ทอย
* Jail Stay → Turn ถัดไปถูก Skip
* Easy Take Over ต้องผ่านทั้ง Money Threshold และ Rent Pool Threshold
* Easy Take Over: `Money After ≥ 50%`
* Easy Take Over: `Rent Pool ≥ 30% ของ Property Price`
* Purchase Count = 7 ครั้ง และ Take Over ไม่เพิ่ม Count
* Hold Property = 5 หลัง
* Take Over Limit = 1 ครั้งต่อเกม
* Rent = 100%
* TAX = 30% ของเงินปัจจุบัน
* Dice ×2 = ผลเต๋าเดิม ×2
* Sell Property = 20%
