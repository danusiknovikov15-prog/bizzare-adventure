# 📦 Руководство по созданию предметов

Этот документ объясняет, как правильно создавать предметы в игре (оружие, броня, зелья и т.д.) с автоматической физикой.

---

## 🎯 Основные концепции

### 1. Типы предметов

```
Расходуемые (Consumables):
  - HealthPotion (зелье здоровья)

Оружие (Weapons):
  - Sword (меч, +3 урона)
  - EnemySword (вражеский меч, +9 урона)
  - EliteSword (элитный меч, +19 урона)
  - Slingshot (рогатка, 15 урона дальний бой)

Броня (Armor):
  - Armor (броня, +15 HP)
  - EliteArmor (элитная броня, +30 HP + шипы)
```

### 2. Автоматическая физика предметов

Все предметы наследуются от класса `Entity`, который предоставляет:
- ✅ Автоматическую гравитацию
- ✅ Начальную скорость вверх при дропе (vy = -100)
- ✅ Падение вниз до платформы
- ✅ Плавающую анимацию
- ✅ Эффекты свечения

---

## 📝 Шаг 1: Создание класса предмета

### Базовая структура

```javascript
// EliteSword.js - пример элитного меча
import { Entity } from './Entity.js';

export class EliteSword extends Entity {
    constructor(x, y) {
        // ВАЖНО: Размеры передаём в super()
        super(x, y, 32, 10); // x, y, width, height

        // Физические свойства
        this.vy = -100; // Начальная скорость вверх (выброс)
        this.vx = 0;    // Горизонтальная скорость

        // Свойства оружия
        this.damageBonus = 19; // +19 урона (1 базовый + 19 = 20)
        this.isCollected = false;

        // Визуальные эффекты
        this.glowPhase = 0;      // Для пульсации свечения
        this.rotation = 0;       // Для вращения при падении
        this.sparklePhase = 0;   // Для искр

        console.log('Elite Sword dropped! Damage: 20');
    }

    update(deltaTime) {
        if (this.isCollected) return;

        // Анимации
        this.glowPhase += deltaTime * 4;
        this.sparklePhase += deltaTime * 5;
        this.rotation += deltaTime * 2;

        // Физика (автоматическая гравитация)
        super.update(deltaTime);
    }

    collect() {
        this.isCollected = true;
        console.log('Elite Sword collected!');
    }

    render(ctx) {
        if (this.isCollected) return;

        // Свечение
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#FFD700';

        // Отрисовка меча с вращением
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation);
        ctx.translate(-centerX, -centerY);

        // Визуал меча
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}
```

---

## ⚙️ Как работает физика предметов

### Автоматический выброс при дропе

```javascript
constructor(x, y) {
    super(x, y, width, height);

    // Начальная скорость вверх
    this.vy = -100; // Подбрасывает предмет вверх
    this.vx = 0;    // Не двигается горизонтально
}
```

### Падение под действием гравитации

```javascript
// Physics.js автоматически применяет гравитацию
applyGravity(entity, deltaTime) {
    const gravity = 980;
    entity.vy += gravity * deltaTime; // Ускорение вниз
}
```

### Остановка на платформе

```javascript
// Physics.js останавливает предмет на платформе
// entity.vy = 0
// entity.isGrounded = true
```

---

## 🔧 Шаг 2: Регистрация предмета

### A. Добавление в ItemFactory.js

```javascript
// ItemFactory.js
import { EliteSword } from '../entities/EliteSword.js';

export class ItemFactory {
    constructor() {
        this.itemTypes = {
            'healthPotion': HealthPotion,
            'armor': Armor,
            'sword': Sword,
            'enemySword': EnemySword,
            'slingshot': Slingshot,
            'eliteSword': EliteSword // ← Добавить!
        };
    }

    getCategoryMap() {
        return {
            'healthPotion': 'potions',
            'armor': 'armors',
            'sword': 'swords',
            'enemySword': 'enemySwords',
            'slingshot': 'slingshots',
            'eliteSword': 'eliteSwords' // ← Добавить!
        };
    }
}
```

### B. Добавление категории в EntityManager.js

```javascript
// EntityManager.js
this.categories = {
    enemies: [],
    potions: [],
    armors: [],
    swords: [],
    enemySwords: [],
    slingshots: [],
    eliteSwords: [] // ← Добавить!
};

cleanupAllCollected() {
    const itemCategories = [
        'potions', 'armors', 'swords',
        'enemySwords', 'slingshots',
        'eliteSwords' // ← Добавить!
    ];
    // ...
}
```

### C. Добавление геттеров в LevelManager.js

```javascript
// LevelManager.js
getEliteSwords() {
    return this.entityManager.getEntities('eliteSwords');
}

cleanupCollectedEliteSwords() {
    return this.entityManager.cleanupCollected('eliteSwords');
}
```

---

## 🎁 Шаг 3: Добавление в систему лута

### Настройка дропа в LootSystem.js

```javascript
// LootSystem.js
this.lootTables = {
    'Enemy': [
        { item: 'healthPotion', chance: 0.05 },
        { item: 'sword', chance: 0.10 }
    ],
    'EliteEnemy': [
        { item: 'eliteArmor', chance: 0.50 },  // 50%
        { item: 'eliteSword', chance: 0.05 }   // 5%
    ],
    'Boss': [
        { item: 'armor', chance: 1.0 },        // 100%
        { item: 'eliteSword', chance: 0.10 }   // 10%
    ]
};
```

---

## 💫 Шаг 4: Обработка сбора предмета

### A. Добавление в CombatSystem.js

```javascript
// CombatSystem.js - метод update()
update(player, enemies, potions, armors, swords, enemySwords, slingshots, eliteSwords) {
    // ...

    // Check player collecting elite swords
    if (eliteSwords) {
        for (const eliteSword of eliteSwords) {
            if (eliteSword.isCollected) continue;

            const playerBox = player.getBounds();
            const swordBox = eliteSword.getBounds();

            if (this.boxesOverlap(playerBox, swordBox)) {
                // Player collected elite sword (20 damage)
                eliteSword.collect();
                player.equipEliteSword();
            }
        }
    }
}
```

### B. Обновление main.js

```javascript
// main.js - game loop
const eliteSwords = levelManager.getEliteSwords();

combatSystem.update(
    player, enemies, potions, armors, swords,
    enemySwords, slingshots, eliteSwords // ← Передать!
);

// Cleanup
levelManager.cleanupCollectedEliteSwords();
```

### C. Добавление метода экипировки в Player.js

```javascript
// Player.js
equipEliteSword() {
    this.hasSword = true;
    this.swordDamageBonus = 19; // 1 base + 19 = 20 total
    this.attackDamage = 1 + this.swordDamageBonus;

    console.log(`👑 Elite Sword equipped! Damage: ${this.attackDamage}`);
    return true;
}
```

---

## 🎨 Шаг 5: Добавление в меню Spawn Item

### main.js - Item spawn menu

```javascript
// main.js
const items = [
    { key: '1', name: 'Health Potion', type: 'healthPotion' },
    { key: '2', name: 'Armor', type: 'armor' },
    { key: '3', name: 'Sword', type: 'sword' },
    { key: '4', name: 'Enemy Sword', type: 'enemySword' },
    { key: '5', name: 'Slingshot', type: 'slingshot' },
    { key: '6', name: '⚔️ Elite Armor (30 HP + Thorns)', type: 'eliteArmor' },
    { key: '7', name: '👑 Elite Sword (20 Damage)', type: 'eliteSword' } // ← Добавить!
];
```

---

## ✅ Чек-лист создания нового предмета

### 1. Создание файла класса
- [ ] Создать `NewItem.js` в `/entities/`
- [ ] Импортировать `Entity` базовый класс
- [ ] Определить конструктор с (x, y)
- [ ] Вызвать `super(x, y, width, height)`
- [ ] Установить `vy = -100` для выброса
- [ ] Установить `isCollected = false`
- [ ] Добавить свойства предмета (damage, healthBonus и т.д.)

### 2. Регистрация в системе
- [ ] Импортировать в `ItemFactory.js`
- [ ] Добавить в `itemTypes` объект
- [ ] Добавить в `getCategoryMap()`
- [ ] Добавить категорию в `EntityManager.js`
- [ ] Добавить в `cleanupAllCollected()`

### 3. Интеграция в LevelManager
- [ ] Добавить геттер `getNewItems()`
- [ ] Добавить cleanup метод `cleanupCollectedNewItems()`

### 4. Обработка коллизий
- [ ] Добавить параметр в `CombatSystem.update()`
- [ ] Добавить проверку коллизий в `CombatSystem`
- [ ] Передать предметы из `main.js`
- [ ] Добавить cleanup в `main.js`

### 5. Экипировка (для оружия/брони)
- [ ] Создать метод `equipNewItem()` в `Player.js`
- [ ] Вызвать метод при сборе

### 6. Добавление в меню (опционально)
- [ ] Добавить в spawn menu в `main.js`
- [ ] Обновить номера клавиш (1-7 → 1-8)

---

## 📋 Полный пример: Создание Fast Potion

### 1. Создаём файл `/entities/FastPotion.js`

```javascript
import { Entity } from './Entity.js';

export class FastPotion extends Entity {
    constructor(x, y) {
        super(x, y, 20, 20); // 20x20 пикселей

        // Физика
        this.vy = -100; // Выброс вверх
        this.vx = 0;

        // Свойства
        this.speedBoost = 1.5; // +50% к скорости
        this.duration = 10; // 10 секунд
        this.isCollected = false;

        // Визуал
        this.glowPhase = 0;
        this.floatOffset = 0;

        console.log('Fast Potion created! +50% speed for 10 sec');
    }

    update(deltaTime) {
        if (this.isCollected) return;

        this.glowPhase += deltaTime * 3;
        this.floatOffset += deltaTime * 2;

        super.update(deltaTime);
    }

    collect() {
        this.isCollected = true;
        console.log('Fast Potion collected!');
    }

    render(ctx) {
        if (this.isCollected) return;

        const floatY = Math.sin(this.floatOffset) * 3;

        // Свечение
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00FF00';

        // Флакон (зелёный)
        ctx.fillStyle = '#00FF00';
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2,
            this.y + this.height / 2 + floatY,
            10, 0, Math.PI * 2
        );
        ctx.fill();

        // Метка скорости (стрелки)
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('»', this.x + this.width / 2, this.y + floatY + 5);
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}
```

### 2. Регистрируем в `ItemFactory.js`

```javascript
import { FastPotion } from '../entities/FastPotion.js';

this.itemTypes = {
    // ...
    'fastPotion': FastPotion
};

getCategoryMap() {
    return {
        // ...
        'fastPotion': 'potions' // Используем существующую категорию
    };
}
```

### 3. Добавляем в `CombatSystem.js`

```javascript
// Используем существующую категорию 'potions'
if (potions) {
    for (const potion of potions) {
        if (potion.isCollected) continue;

        const playerBox = player.getBounds();
        const potionBox = potion.getBounds();

        if (this.boxesOverlap(playerBox, potionBox)) {
            potion.collect();

            // Проверяем тип зелья
            if (potion.constructor.name === 'FastPotion') {
                player.applySpeedBoost(potion.speedBoost, potion.duration);
            } else {
                // Обычное зелье - в инвентарь
                player.inventory.addItem('healthPotion', 1);
            }
        }
    }
}
```

### 4. Добавляем метод в `Player.js`

```javascript
// Player.js
applySpeedBoost(multiplier, duration) {
    const originalSpeed = this.moveSpeed;
    this.moveSpeed *= multiplier;

    console.log(`⚡ Speed boost! ${originalSpeed} → ${this.moveSpeed} for ${duration}s`);

    // Сбросить через duration секунд
    setTimeout(() => {
        this.moveSpeed = originalSpeed;
        console.log('Speed boost expired');
    }, duration * 1000);
}
```

### 5. Добавляем в лут

```javascript
// LootSystem.js
'Enemy': [
    { item: 'healthPotion', chance: 0.05 },
    { item: 'fastPotion', chance: 0.02 }, // 2% шанс
    { item: 'sword', chance: 0.10 }
]
```

---

## 🎨 Визуальные эффекты для предметов

### Пульсирующее свечение

```javascript
render(ctx) {
    const glowIntensity = 0.4 + Math.sin(this.glowPhase) * 0.3;
    ctx.globalAlpha = glowIntensity;
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#FFD700';
    // ... рисуем предмет
}
```

### Плавающая анимация

```javascript
update(deltaTime) {
    this.floatOffset += deltaTime * 2;
}

render(ctx) {
    const floatY = Math.sin(this.floatOffset) * 5;
    // Рисуем с offset: y + floatY
}
```

### Вращение при падении

```javascript
update(deltaTime) {
    this.rotation += deltaTime * 2;
}

render(ctx) {
    ctx.translate(centerX, centerY);
    ctx.rotate(this.rotation);
    ctx.translate(-centerX, -centerY);
    // ... рисуем предмет
}
```

### Искры (sparkles)

```javascript
render(ctx) {
    const sparkle1 = Math.sin(this.sparklePhase) > 0.5 ? 1 : 0;
    const sparkle2 = Math.sin(this.sparklePhase + 1) > 0.5 ? 1 : 0;

    if (sparkle1) {
        ctx.fillRect(this.x + 8, this.y + 2, 2, 2);
    }
    if (sparkle2) {
        ctx.fillRect(this.x + 16, this.y + 6, 2, 2);
    }
}
```

---

## ⚠️ Частые ошибки

### 1. Предмет падает сквозь платформы

**Проблема**: Размеры не переданы в `super()`

**Решение**:
```javascript
constructor(x, y) {
    super(x, y, width, height); // ← ОБЯЗАТЕЛЬНО указать width, height!
}
```

### 2. Предмет не выбрасывается при дропе

**Проблема**: Не установлена начальная скорость

**Решение**:
```javascript
constructor(x, y) {
    super(x, y, width, height);
    this.vy = -100; // ← Начальная скорость вверх!
}
```

### 3. Предмет не собирается игроком

**Проблема**: Не добавлен в CombatSystem

**Решение**:
```javascript
// 1. Добавить параметр в update()
update(player, enemies, potions, newItems) { ... }

// 2. Добавить проверку коллизий
if (newItems) {
    for (const item of newItems) {
        // ... проверка коллизий
    }
}

// 3. Передать из main.js
const newItems = levelManager.getNewItems();
combatSystem.update(player, enemies, potions, newItems);
```

### 4. Предмет не регистрируется в системе

**Проблема**: Забыли добавить в ItemFactory или EntityManager

**Решение**:
```javascript
// ItemFactory.js
this.itemTypes = {
    'newItem': NewItem // ← Добавить!
};

// EntityManager.js
this.categories = {
    newItems: [] // ← Добавить!
};
```

---

## 🔍 Отладка

### Полезные команды в консоли

```javascript
// Проверить все зарегистрированные типы предметов
levelManager.itemFactory.itemTypes

// Проверить категории предметов
levelManager.itemFactory.getCategoryMap()

// Проверить все предметы на уровне
levelManager.entityManager.getCounts()

// Проверить конкретную категорию
levelManager.getSwords()
levelManager.getEliteArmors()

// Проверить границы предмета
item.getBounds()

// Проверить физику предмета
item.vy // Должна быть -100 при создании, затем увеличиваться
item.isGrounded // true когда на платформе
```

---

## 📚 Типы предметов и их свойства

### Расходуемые (Consumables)
```javascript
// HealthPotion
- Размер: 16x16
- Эффект: +1 зелье в инвентарь
- Использование: Клавиша E (восстанавливает 20 HP)
- Визуал: Красный флакон с крестом
```

### Оружие (Weapons)
```javascript
// Sword
- Размер: 28x8
- Урон: +3 (итого 4)
- Эффект: player.hasSword = true
- Визуал: Серебряный меч с золотой гардой

// EnemySword
- Размер: 28x8
- Урон: +9 (итого 10)
- Эффект: player.hasSword = true
- Визуал: Тёмный меч с красной гардой

// EliteSword
- Размер: 32x10
- Урон: +19 (итого 20)
- Эффект: player.hasSword = true
- Визуал: Золотой светящийся меч с искрами

// Slingshot
- Размер: 40x32
- Урон: 15 (дальний бой)
- Эффект: player.hasSlingshot = true
- Визуал: Деревянная Y-форма с резинкой
```

### Броня (Armor)
```javascript
// Armor
- Размер: 24x24
- HP: +15
- Эффект: player.hasArmor = true, maxHealth +15
- Визуал: Серебряная кираса с наплечниками

// EliteArmor
- Размер: 28x28
- HP: +30
- Спецэффект: Шипы (1 урон/сек врагам)
- Эффект: player.hasEliteArmor = true, maxHealth +30
- Визуал: Золотая броня с красными шипами
```

---

## 📐 Рекомендуемые размеры

| Тип предмета | Размер (px) | Примечание |
|--------------|-------------|------------|
| Зелья        | 16x16 - 20x20 | Маленькие флаконы |
| Мечи         | 28x8 - 32x10  | Горизонтальные |
| Броня        | 24x24 - 28x28 | Квадратная |
| Рогатка      | 40x32         | Y-форма |
| Щиты         | 24x32         | Вертикальные |

---

## ✨ Итог

**Физика работает автоматически, если:**
1. ✅ Класс наследуется от `Entity`
2. ✅ Размеры переданы в `super(x, y, width, height)`
3. ✅ Установлена начальная скорость `vy = -100`
4. ✅ Реализован метод `getBounds()`

**Предмет корректно интегрирован, если:**
1. ✅ Зарегистрирован в `ItemFactory`
2. ✅ Добавлена категория в `EntityManager`
3. ✅ Добавлены геттеры в `LevelManager`
4. ✅ Обработка коллизий в `CombatSystem`
5. ✅ Cleanup в `main.js`
6. ✅ Метод экипировки в `Player.js` (для оружия/брони)

---

**Последнее обновление:** 29 декабря 2025
**Версия документа:** 1.0
