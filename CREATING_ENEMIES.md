# 📚 Руководство по созданию врагов

Этот документ объясняет, как правильно создавать врагов в игре с автоматической физикой (гравитация, коллизии с платформами).

---

## 🎯 Основные концепции

### 1. Иерархия классов

```
Entity (базовый класс)
  ↓
Enemy (обычный враг)
  ↓
EliteEnemy (элитный враг)
  ↓
Boss (босс)
```

### 2. Автоматическая физика

Все враги наследуются от класса `Entity`, который предоставляет:
- ✅ Автоматическую гравитацию
- ✅ Коллизии с платформами
- ✅ Движение (vx, vy)
- ✅ getBounds() для определения границ

---

## 📝 Шаг 1: Создание класса врага

### Базовая структура

```javascript
// EliteEnemy.js - пример элитного врага
import { Enemy } from './Enemy.js';

export class EliteEnemy extends Enemy {
    constructor(x, y) {
        // ВАЖНО: вызываем конструктор родителя
        super(x, y);

        // Переопределяем размеры (опционально)
        this.width = 56;  // Ширина
        this.height = 70; // Высота

        // Переопределяем характеристики
        this.maxHealth = 50;
        this.health = this.maxHealth;
        this.damage = 10;

        // Визуал
        this.color = '#FFD700'; // Золотой цвет

        console.log('Elite Enemy spawned!');
    }

    // Метод update наследуется автоматически!
    // Физика работает автоматически!
}
```

---

## ⚙️ Как работает физика

### Автоматическая гравитация и движение

Класс `Entity` предоставляет метод `update()`:

```javascript
// Entity.js (базовый класс)
update(deltaTime) {
    if (!this.isStatic) {
        // Применяем скорость к позиции
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
    }
}
```

### Гравитация применяется в Physics.js

```javascript
// Physics.js - автоматически применяет гравитацию
applyGravity(entity, deltaTime) {
    const gravity = 980; // 980 пикселей/сек²
    entity.vy += gravity * deltaTime;
}
```

### Коллизии с платформами

```javascript
// Physics.js - автоматически проверяет коллизии
checkPlatformCollisions(entity, platforms) {
    // Проверяет пересечение с платформами
    // Останавливает падение при приземлении
    // Устанавливает entity.isGrounded = true
}
```

---

## 🔧 Шаг 2: Добавление врага в игру

### A. Регистрация в LevelManager.js

```javascript
// LevelManager.js
import { EliteEnemy } from '../entities/EliteEnemy.js';

// В методе loadLevel():
if (enemyData.isElite) {
    enemy = new EliteEnemy(enemyData.x, enemyData.y);
    console.log('👑 ELITE ENEMY SPAWNED!');
}
```

### B. Добавление в уровень

```javascript
// level5.js
export const level5 = {
    name: 'Level 5: Elite Arena',
    playerSpawn: { x: 100, y: 300 },

    platforms: [
        { x: 0, y: 550, width: 1200, height: 50 } // Земля
    ],

    enemies: [
        { x: 350, y: 350, isElite: true },  // Элитный враг
        { x: 750, y: 350, isElite: true }
    ]
};
```

### C. Добавление типа в фильтр (ВАЖНО!)

```javascript
// LevelManager.js - метод getEnemies()
getEnemies() {
    return this.entityManager.getEntities('enemies').filter(entity => {
        const enemyType = entity.constructor.name;
        return entity &&
               (enemyType === 'Enemy' ||
                enemyType === 'Boss' ||
                enemyType === 'EliteEnemy') && // ← Добавить новый тип!
               typeof entity.isAlive !== 'undefined';
    });
}
```

---

## 🎨 Шаг 3: Настройка визуала

### Переопределение метода render()

```javascript
render(ctx) {
    // Вызываем родительский метод для базовой отрисовки
    super.render(ctx);

    // Добавляем дополнительные элементы
    if (this.isAlive) {
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.strokeText('ELITE', this.x + this.width / 2, this.y - 20);
        ctx.fillText('ELITE', this.x + this.width / 2, this.y - 20);
    }
}
```

---

## 🎁 Шаг 4: Настройка лута

### Добавление в LootSystem.js

```javascript
// LootSystem.js
this.lootTables = {
    'EliteEnemy': [
        { item: 'eliteArmor', chance: 0.50 },  // 50% шанс
        { item: 'eliteSword', chance: 0.05 }   // 5% шанс
    ]
};
```

---

## ✅ Чек-лист создания нового врага

### 1. Создание файла класса
- [ ] Создать `NewEnemy.js` в `/entities/`
- [ ] Импортировать базовый класс (`Enemy` или `Entity`)
- [ ] Определить конструктор с параметрами (x, y)
- [ ] Вызвать `super(x, y)` в конструкторе
- [ ] Установить характеристики (health, damage, size)

### 2. Интеграция в систему
- [ ] Импортировать в `LevelManager.js`
- [ ] Добавить проверку типа в `loadLevel()`
- [ ] Добавить тип в `getEnemies()` фильтр
- [ ] Добавить лут-таблицу в `LootSystem.js`

### 3. Добавление в уровень
- [ ] Создать/обновить файл уровня
- [ ] Добавить врагов в массив `enemies`
- [ ] Установить флаг типа (`isElite: true`, `isBoss: true`)

### 4. Тестирование
- [ ] Враг появляется на уровне
- [ ] Враг падает до платформы (гравитация работает)
- [ ] Враг не проваливается сквозь платформы
- [ ] Враг может получать урон
- [ ] Враг может атаковать игрока
- [ ] Лут дропается при смерти

---

## ⚠️ Частые ошибки

### 1. Враг не появляется

**Проблема**: Враг не добавлен в фильтр `getEnemies()`

**Решение**:
```javascript
// LevelManager.js:148-156
getEnemies() {
    return this.entityManager.getEntities('enemies').filter(entity => {
        const enemyType = entity.constructor.name;
        return entity &&
               (enemyType === 'Enemy' ||
                enemyType === 'Boss' ||
                enemyType === 'YourNewEnemy') && // ← Добавить!
               typeof entity.isAlive !== 'undefined';
    });
}
```

### 2. Враг проваливается сквозь платформы

**Проблема**: Не вызван `super(x, y)` или размеры undefined

**Решение**:
```javascript
constructor(x, y) {
    super(x, y); // ← ОБЯЗАТЕЛЬНО!

    // Установить размеры сразу после super()
    this.width = 56;
    this.height = 70;
}
```

### 3. Враг не двигается

**Проблема**: Не наследуется метод `update()` или не установлены AI свойства

**Решение**:
```javascript
// Убедитесь что вызывается super.update()
update(deltaTime) {
    if (!this.isAlive) return;
    super.update(deltaTime); // ← Вызывает физику!
}
```

### 4. Враг не получает урон

**Проблема**: Не переопределён `getBounds()` или размеры некорректные

**Решение**:
```javascript
// Явно переопределить getBounds()
getBounds() {
    return {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        left: this.x,
        right: this.x + this.width,
        top: this.y,
        bottom: this.y + this.height
    };
}
```

---

## 📋 Полный пример: Создание нового врага

### 1. Создаём файл `/entities/FastEnemy.js`

```javascript
import { Enemy } from './Enemy.js';

export class FastEnemy extends Enemy {
    constructor(x, y) {
        super(x, y);

        // Характеристики
        this.maxHealth = 10;
        this.health = this.maxHealth;
        this.damage = 2;

        // Размеры
        this.width = 40;
        this.height = 50;

        // Быстрее обычного врага
        this.moveSpeed = 150; // Обычный: 80

        // Визуал
        this.color = '#FF4500'; // Оранжевый

        console.log('Fast Enemy spawned!');
    }

    render(ctx) {
        super.render(ctx);

        // Добавляем метку "FAST"
        if (this.isAlive) {
            ctx.fillStyle = '#FF4500';
            ctx.font = 'bold 8px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('FAST', this.x + this.width / 2, this.y - 15);
        }
    }
}
```

### 2. Регистрируем в `LevelManager.js`

```javascript
import { FastEnemy } from '../entities/FastEnemy.js';

// В loadLevel():
} else if (enemyData.isFast) {
    enemy = new FastEnemy(enemyData.x, enemyData.y);
    console.log('⚡ FAST ENEMY SPAWNED!');
}

// В getEnemies():
return entity &&
       (enemyType === 'Enemy' ||
        enemyType === 'Boss' ||
        enemyType === 'EliteEnemy' ||
        enemyType === 'FastEnemy') && // ← Добавили!
       typeof entity.isAlive !== 'undefined';
```

### 3. Добавляем в уровень

```javascript
// level6.js
export const level6 = {
    name: 'Level 6: Speed Challenge',
    playerSpawn: { x: 100, y: 300 },

    platforms: [
        { x: 0, y: 550, width: 1200, height: 50 }
    ],

    enemies: [
        { x: 300, y: 400, isFast: true },
        { x: 600, y: 400, isFast: true },
        { x: 900, y: 400, isFast: true }
    ]
};
```

### 4. Добавляем лут

```javascript
// LootSystem.js
'FastEnemy': [
    { item: 'healthPotion', chance: 0.10 },
    { item: 'sword', chance: 0.15 }
]
```

---

## 🔍 Отладка

### Полезные команды в консоли

```javascript
// Проверить всех врагов на уровне
levelManager.getEnemies()

// Проверить количество живых врагов
levelManager.getEnemies().filter(e => e.isAlive).length

// Проверить типы врагов
levelManager.getEnemies().map(e => e.constructor.name)

// Проверить границы врага
enemy.getBounds()
```

---

## 📚 Дополнительные ресурсы

### Файлы для изучения:
- `Entity.js` - базовый класс, физика
- `Enemy.js` - обычный враг, AI
- `EliteEnemy.js` - пример наследования
- `Boss.js` - сложный пример с projectiles
- `Physics.js` - система физики
- `LevelManager.js` - загрузка уровней

### Ключевые методы:
- `update(deltaTime)` - обновление каждый кадр
- `render(ctx)` - отрисовка
- `takeDamage(amount)` - получение урона
- `getBounds()` - границы для коллизий
- `canAttack()` - проверка атаки
- `attack()` - выполнение атаки

---

## ✨ Итог

**Физика работает автоматически, если:**
1. ✅ Класс наследуется от `Entity` или `Enemy`
2. ✅ Вызван `super(x, y)` в конструкторе
3. ✅ Установлены корректные `width` и `height`
4. ✅ Вызывается `super.update(deltaTime)` в update()
5. ✅ Враг добавлен через `entityManager.addEntity()`

**Враг не провалится сквозь платформы, потому что:**
- Physics.js автоматически применяет гравитацию
- Physics.js автоматически проверяет коллизии с платформами
- При столкновении с платформой сверху: vy = 0, isGrounded = true

---

**Последнее обновление:** 29 декабря 2025
**Версия документа:** 1.0
