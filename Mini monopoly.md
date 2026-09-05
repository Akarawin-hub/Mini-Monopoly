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
