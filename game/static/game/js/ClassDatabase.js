// === CLASS DATABASE - 100 New Classes with Daily Shop Rotation ===

// SVG Icon Generator for classes
function generateClassIcon(c1, c2, border, sym) {
    const S = {
        sword: '<path d="M50 15 L53 18 L53 58 L57 62 L43 62 L47 58 L47 18Z" fill="rgba(255,255,255,0.85)"/><rect x="40" y="62" width="20" height="5" rx="2" fill="rgba(255,255,255,0.9)"/><rect x="47" y="67" width="6" height="8" rx="1" fill="rgba(255,255,255,0.7)"/>',
        shield: '<path d="M30 28 L50 22 L70 28 L70 55 L50 72 L30 55Z" fill="rgba(255,255,255,0.15)" stroke="#fff" stroke-width="2"/><path d="M50 28 L50 65M37 40 L63 40" stroke="#fff" stroke-width="1.5"/>',
        staff: '<line x1="50" y1="75" x2="50" y2="28" stroke="#fff" stroke-width="3"/><circle cx="50" cy="22" r="10" fill="rgba(255,255,255,0.2)" stroke="#fff" stroke-width="2"/><circle cx="50" cy="22" r="4" fill="rgba(255,255,255,0.6)"/>',
        bow: '<path d="M62 22 Q38 50 62 78" fill="none" stroke="#fff" stroke-width="2.5"/><line x1="62" y1="22" x2="62" y2="78" stroke="#fff" stroke-width="1.5"/><line x1="62" y1="50" x2="38" y2="38" stroke="#fff" stroke-width="2"/><polygon points="38,38 34,35 37,42" fill="#fff"/>',
        axe: '<line x1="50" y1="25" x2="50" y2="78" stroke="#fff" stroke-width="3"/><path d="M50 25 L30 42 L38 48 L50 38Z" fill="rgba(255,255,255,0.8)" stroke="#fff" stroke-width="1.5"/>',
        fist: '<path d="M35 50 Q35 30 50 28 Q65 30 65 50 L65 58 Q65 68 50 68 Q35 68 35 58Z" fill="rgba(255,255,255,0.2)" stroke="#fff" stroke-width="2.5"/><line x1="42" y1="36" x2="42" y2="54" stroke="#fff" stroke-width="2"/><line x1="50" y1="34" x2="50" y2="54" stroke="#fff" stroke-width="2"/><line x1="58" y1="36" x2="58" y2="54" stroke="#fff" stroke-width="2"/>',
        skull: '<ellipse cx="50" cy="40" rx="18" ry="20" fill="rgba(255,255,255,0.12)" stroke="#fff" stroke-width="2"/><circle cx="43" cy="36" r="5" fill="rgba(0,0,0,0.5)" stroke="#fff" stroke-width="1.5"/><circle cx="57" cy="36" r="5" fill="rgba(0,0,0,0.5)" stroke="#fff" stroke-width="1.5"/><path d="M42 52 L46 50 L50 52 L54 50 L58 52" stroke="#fff" stroke-width="1.5" fill="none"/>',
        crown: '<path d="M28 58 L34 32 L42 48 L50 28 L58 48 L66 32 L72 58Z" fill="rgba(255,255,255,0.25)" stroke="#fff" stroke-width="2"/><rect x="28" y="58" width="44" height="7" rx="2" fill="rgba(255,255,255,0.35)" stroke="#fff" stroke-width="1.5"/>',
        star: '<path d="M50 18 L57 38 L78 38 L61 52 L68 72 L50 60 L32 72 L39 52 L22 38 L43 38Z" fill="rgba(255,255,255,0.2)" stroke="#fff" stroke-width="2"/>',
        flame: '<path d="M50 18 Q62 32 58 45 Q68 35 60 58 Q72 42 55 72 L50 75 L45 72 Q28 42 40 58 Q32 35 42 45 Q38 32 50 18Z" fill="rgba(255,255,255,0.2)" stroke="#fff" stroke-width="2"/>',
        ice: '<line x1="50" y1="18" x2="50" y2="78" stroke="#fff" stroke-width="2"/><line x1="22" y1="34" x2="78" y2="62" stroke="#fff" stroke-width="2"/><line x1="22" y1="62" x2="78" y2="34" stroke="#fff" stroke-width="2"/><circle cx="50" cy="48" r="6" fill="rgba(255,255,255,0.3)"/>',
        lightning: '<path d="M58 15 L38 48 L50 48 L40 85 L68 42 L53 42Z" fill="rgba(255,255,255,0.3)" stroke="#fff" stroke-width="2"/>',
        moon: '<path d="M58 18 A28 28 0 1 0 58 78 A20 20 0 1 1 58 18Z" fill="rgba(255,255,255,0.2)" stroke="#fff" stroke-width="2"/>',
        dagger: '<path d="M50 15 L56 52 L50 58 L44 52Z" fill="rgba(255,255,255,0.8)"/><rect x="43" y="58" width="14" height="4" rx="1" fill="rgba(255,255,255,0.9)"/><rect x="47" y="62" width="6" height="10" rx="1" fill="rgba(255,255,255,0.6)"/>',
        holy: '<rect x="45" y="20" width="10" height="50" rx="2" fill="rgba(255,255,255,0.25)" stroke="#fff" stroke-width="2"/><rect x="32" y="32" width="36" height="10" rx="2" fill="rgba(255,255,255,0.25)" stroke="#fff" stroke-width="2"/>',
        dragon: '<path d="M32 68 Q30 32 50 18 Q70 32 68 68" fill="rgba(255,255,255,0.1)" stroke="#fff" stroke-width="2"/><circle cx="42" cy="40" r="4" fill="#fff"/><circle cx="58" cy="40" r="4" fill="#fff"/><path d="M44 55 Q50 62 56 55" stroke="#fff" stroke-width="2" fill="none"/><path d="M32 32 L22 20" stroke="#fff" stroke-width="2"/><path d="M68 32 L78 20" stroke="#fff" stroke-width="2"/>',
        spiral: '<path d="M50 30 Q64 30 64 44 Q64 60 44 60 Q28 60 28 40 Q28 20 56 20 Q76 20 76 48 Q76 72 46 72" fill="none" stroke="#fff" stroke-width="2.5"/>',
        potion: '<rect x="42" y="20" width="16" height="8" rx="3" fill="rgba(255,255,255,0.4)" stroke="#fff" stroke-width="1.5"/><path d="M42 28 L35 50 Q33 72 50 72 Q67 72 65 50 L58 28" fill="rgba(255,255,255,0.15)" stroke="#fff" stroke-width="2"/>',
        wing: '<path d="M50 58 Q28 40 18 18 Q34 34 50 28 Q66 34 82 18 Q72 40 50 58Z" fill="rgba(255,255,255,0.2)" stroke="#fff" stroke-width="2"/>',
        scythe: '<path d="M62 18 Q30 22 26 52 Q28 36 48 30" fill="rgba(255,255,255,0.2)" stroke="#fff" stroke-width="2.5"/><line x1="48" y1="30" x2="58" y2="78" stroke="#fff" stroke-width="2.5"/>',
    };
    const id = 'ci' + (Math.random() * 1e9 | 0);
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>
        </linearGradient></defs>
        <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="url(#${id})" stroke="${border}" stroke-width="3"/>
        ${S[sym] || S.star}
    </svg>`;
}

// All 100 new classes
// Format: [id, name, rarity, price, subtitle, color1, color2, border, symbol, shopWeight]
const ALL_NEW_CLASSES_RAW = [
    // ========== COMMON (30) - Shop Weight 10 ==========
    ['class_knight','Knight','common',800,'Loyal defender!','#6a6a7a','#4a4a5a','#888','sword',10],
    ['class_guard','Guard','common',600,'Hold the line!','#5a6a7a','#3a4a5a','#789','shield',10],
    ['class_squire','Squire','common',500,'Training hard!','#8a7a6a','#6a5a4a','#987','sword',10],
    ['class_soldier','Soldier','common',700,'Duty calls!','#5a6a4a','#3a4a2a','#686','sword',10],
    ['class_militia','Militia','common',500,'For the people!','#4a5a3a','#2a3a1a','#575','axe',10],
    ['class_blacksmith','Blacksmith','common',900,'Forge master!','#8a5a2a','#6a3a0a','#a73','axe',10],
    ['class_miner','Miner','common',700,'Deep digger!','#7a6a5a','#5a4a3a','#876','axe',10],
    ['class_lumberjack','Lumberjack','common',800,'Timber!','#4a7a3a','#2a5a1a','#5a3','axe',10],
    ['class_farmer','Farmer','common',500,'Harvest time!','#8a7a4a','#6a5a2a','#985','staff',10],
    ['class_fisher','Fisher','common',600,'Reel it in!','#4a6a8a','#2a4a6a','#579','staff',10],
    ['class_scout','Scout','common',700,'Eyes ahead!','#6a8a5a','#4a6a3a','#7a5','dagger',10],
    ['class_hunter','Hunter','common',800,'Track prey!','#5a6a3a','#3a4a1a','#685','bow',10],
    ['class_nomad','Nomad','common',600,'Wandering soul!','#9a8a6a','#7a6a4a','#a97','dagger',10],
    ['class_explorer','Explorer','common',700,'New horizons!','#3a7a7a','#1a5a5a','#4aa','star',10],
    ['class_wanderer','Wanderer','common',500,'Free spirit!','#7a5a8a','#5a3a6a','#86a','staff',10],
    ['class_baker_c','Baker','common',600,'Fresh bread!','#aa7a3a','#885a1a','#b84','flame',10],
    ['class_bard','Bard','common',800,'Music magic!','#7a4a9a','#5a2a7a','#95b','star',10],
    ['class_thief','Thief','common',900,'Quick hands!','#3a3a4a','#1a1a2a','#555','dagger',10],
    ['class_merchant','Merchant','common',700,'Good deals!','#9a8a3a','#7a6a1a','#ba5','star',10],
    ['class_herbalist','Herbalist','common',600,'Nature heals!','#3a8a4a','#1a6a2a','#4a5','potion',10],
    ['class_apprentice','Apprentice','common',500,'Learning fast!','#5a7aaa','#3a5a8a','#68b','staff',10],
    ['class_novice','Novice','common',500,'Just starting!','#6a8aba','#4a6a9a','#79c','staff',10],
    ['class_recruit','Recruit','common',500,'Ready to serve!','#6a7a5a','#4a5a3a','#686','sword',10],
    ['class_trainee','Trainee','common',600,'Getting better!','#8a8a8a','#6a6a6a','#999','sword',10],
    ['class_cadet','Cadet','common',700,'Academy pride!','#3a4a6a','#1a2a4a','#458','shield',10],
    ['class_sailor','Sailor','common',800,'Sea legs!','#3a5a9a','#1a3a7a','#46a','star',10],
    ['class_cobbler','Cobbler','common',500,'Fine boots!','#7a5a3a','#5a3a1a','#864','fist',10],
    ['class_shepherd','Shepherd','common',600,'Flock keeper!','#7aaa7a','#5a8a5a','#8b8','staff',10],
    ['class_messenger','Messenger','common',700,'Swift feet!','#aaaa5a','#8a8a3a','#bb6','lightning',10],
    ['class_tinkerer','Tinkerer','common',800,'Clever hands!','#9a6a3a','#7a4a1a','#a74','star',10],

    // ========== RARE (25) - Shop Weight 7 ==========
    ['class_samurai','Samurai','rare',2000,'Way of the sword!','#aa2a2a','#7a0a0a','#d44','sword',7],
    ['class_viking','Viking','rare',1800,'Valhalla awaits!','#2a3a6a','#0a1a4a','#34a','axe',7],
    ['class_gladiator','Gladiator','rare',2000,'Arena champion!','#aa5a2a','#8a3a0a','#c64','sword',7],
    ['class_ronin','Ronin','rare',2200,'Masterless blade!','#6a1a1a','#4a0a0a','#a33','sword',7],
    ['class_duelist','Duelist','rare',1800,'En garde!','#8a8aaa','#6a6a8a','#aac','dagger',7],
    ['class_fire_mage','Fire Mage','rare',2500,'Burn baby burn!','#cc4a0a','#aa2a00','#e62','flame',7],
    ['class_ice_mage','Ice Mage','rare',2500,'Freeze solid!','#4a8acc','#2a6aaa','#5ae','ice',7],
    ['class_alchemist','Alchemist','rare',2000,'Mix and match!','#6a3a8a','#4a1a6a','#84a','potion',7],
    ['class_druid','Druid','rare',2200,'Nature power!','#1a8a3a','#0a6a1a','#2b4','staff',7],
    ['class_shaman','Shaman','rare',2000,'Spirit guide!','#4a7a6a','#2a5a4a','#5a7','skull',7],
    ['class_berserker','Berserker','rare',2500,'RAGE!','#bb1a1a','#8a0000','#e22','axe',7],
    ['class_monk','Monk','rare',1800,'Inner peace!','#ba8a3a','#9a6a1a','#ca5','fist',7],
    ['class_pirate','Pirate','rare',2000,'Ahoy matey!','#2a5a5a','#0a3a3a','#3aa','sword',7],
    ['class_mercenary','Mercenary','rare',2200,'Coin warrior!','#5a5a6a','#3a3a4a','#778','sword',7],
    ['class_marauder','Marauder','rare',2500,'Pillage time!','#8a2a2a','#6a0a0a','#b33','axe',7],
    ['class_paladin','Paladin','rare',2500,'Holy knight!','#baa040','#9a8020','#cb5','holy',7],
    ['class_crusader','Crusader','rare',2200,'Deus vult!','#7a7aaa','#5a5a8a','#99c','holy',7],
    ['class_templar','Templar','rare',2000,'Sacred oath!','#aaaaaa','#8a8a8a','#ccc','shield',7],
    ['class_cleric','Cleric','rare',1800,'Blessed light!','#aaaadd','#8a8abb','#bbf','holy',7],
    ['class_priest','Priest','rare',1500,'Divine grace!','#ddddaa','#bbbb88','#eec','holy',7],
    ['class_shadow_dancer','Shadow Dancer','rare',2500,'Dark moves!','#4a2a6a','#2a0a4a','#63a','moon',7],
    ['class_wind_runner','Wind Runner','rare',2200,'Fast as wind!','#3aaacc','#1a8aaa','#4ce','wing',7],
    ['class_acrobat','Acrobat','rare',1800,'Flip and dodge!','#aa4aaa','#8a2a8a','#c5c','star',7],
    ['class_ranger','Ranger','rare',2000,'Forest shadow!','#2a6a2a','#0a4a0a','#3a3','bow',7],
    ['class_swashbuckler','Swashbuckler','rare',2200,'Dashing blade!','#2a7a7a','#0a5a5a','#3aa','dagger',7],

    // ========== EPIC (20) - Shop Weight 4 ==========
    ['class_necromancer','Necromancer','epic',4500,'Raise the dead!','#4a1a5a','#2a0040','#72a','skull',4],
    ['class_vampire','Vampire','epic',5000,'Blood thirst!','#6a0a1a','#400008','#a12','skull',4],
    ['class_shadow_assassin','Shadow Assassin','epic',5500,'Silent death!','#1a1a2a','#000010','#424','dagger',4],
    ['class_dark_sorcerer','Dark Sorcerer','epic',4000,'Dark arts!','#3a1a5a','#200040','#62a','staff',4],
    ['class_soul_reaper','Soul Reaper','epic',5500,'Harvest souls!','#3a3a3a','#1a1a1a','#666','scythe',4],
    ['class_dragon_knight','Dragon Knight','epic',5000,'Dragon bond!','#aa3a1a','#882a08','#c42','dragon',4],
    ['class_wyvern_rider','Wyvern Rider','epic',4500,'Sky warrior!','#3a7a3a','#1a5a1a','#4a4','dragon',4],
    ['class_storm_caller','Storm Caller','epic',5000,'Call lightning!','#2a4aaa','#0a2a88','#36c','lightning',4],
    ['class_thunder_warrior','Thunder Warrior','epic',4500,'Thunder smash!','#aa8a2a','#886a08','#ca4','lightning',4],
    ['class_archmage','Archmage','epic',5500,'Supreme magic!','#1a2a7a','#000858','#23a','staff',4],
    ['class_battle_mage','Battle Mage','epic',4500,'War wizard!','#6a2a5a','#4a0a3a','#83a','staff',4],
    ['class_enchanter','Enchanter','epic',4000,'Buff master!','#aa5aaa','#883a88','#c6c','star',4],
    ['class_blade_master','Blade Master','epic',5500,'Perfect cuts!','#7a8aaa','#5a6a88','#9ac','sword',4],
    ['class_war_chief','War Chief','epic',5000,'Lead charge!','#8a3a1a','#6a1a08','#a42','axe',4],
    ['class_phantom','Phantom','epic',4500,'Ghost strike!','#4a4a6a','#2a2a4a','#668','moon',4],
    ['class_void_walker','Void Walker','epic',5000,'Between worlds!','#3a1a4a','#1a0030','#52a','spiral',4],
    ['class_blood_warrior','Blood Warrior','epic',5500,'Blood power!','#7a0a0a','#500000','#b11','sword',4],
    ['class_frost_lord','Frost Lord','epic',4500,'Winter wrath!','#3a6aaa','#1a4a88','#48c','ice',4],
    ['class_spirit_walker','Spirit Walker','epic',4000,'Spirit realm!','#4aaa6a','#2a8848','#5b7','spiral',4],
    ['class_titan','Titan','epic',5500,'Unstoppable!','#8a7a3a','#6a5a1a','#a85','fist',4],

    // ========== LEGENDARY (15) - Shop Weight 2 ==========
    ['class_dragon_lord','Dragon Lord','legendary',9000,'Supreme dragon!','#aa6a0a','#884800','#c80','dragon',2],
    ['class_death_knight','Death Knight','legendary',8000,'Death rides!','#2a1a2a','#100010','#424','skull',2],
    ['class_archangel','Archangel','legendary',10000,'Heaven sent!','#eeeecc','#ccccaa','#ffd700','wing',2],
    ['class_demon_king','Demon King','legendary',11000,'Hell unleashed!','#8a0a0a','#600000','#f00','flame',2],
    ['class_shadow_lord','Shadow Lord','legendary',9000,'Darkness reigns!','#1a0a2a','#000018','#408','moon',2],
    ['class_elemental_master','Elemental Master','legendary',10000,'All elements!','#4a6a8a','#2a4a6a','#ffd700','star',2],
    ['class_god_of_war','God of War','legendary',11000,'Total carnage!','#aa2a0a','#880800','#ffd700','axe',2],
    ['class_immortal','Immortal','legendary',9000,'Cannot die!','#aaaaaa','#888888','#ffd700','shield',2],
    ['class_chaos_knight','Chaos Knight','legendary',10000,'Pure chaos!','#7a1a4a','#5a0030','#ffd700','sword',2],
    ['class_void_emperor','Void Emperor','legendary',11000,'Void consumes!','#2a0a3a','#100020','#ffd700','spiral',2],
    ['class_ancient_dragon','Ancient Dragon','legendary',12000,'Ancient power!','#5a7a2a','#3a5a0a','#ffd700','dragon',2],
    ['class_celestial','Celestial','legendary',10000,'Star power!','#ccccee','#aaaabb','#ffd700','star',2],
    ['class_doom_bringer','Doom Bringer','legendary',11000,'Doom awaits!','#3a0a0a','#200000','#ffd700','scythe',2],
    ['class_time_lord','Time Lord','legendary',9000,'Time bends!','#2a4a8a','#0a2a6a','#ffd700','spiral',2],
    ['class_astral_knight','Astral Knight','legendary',10000,'Cosmic blade!','#1a2a5a','#000838','#ffd700','sword',2],

    // ========== MYTHIC (10) - Shop Weight 1 ==========
    ['class_cosmic_titan','Cosmic Titan','mythic',20000,'Universe power!','#2a0a4a','#100030','#ff0044','star',1],
    ['class_infinity_knight','Infinity Knight','mythic',18000,'Infinite power!','#4a2a0a','#301800','#ff0044','sword',1],
    ['class_shadow_emperor','Shadow Emperor','mythic',22000,'Ultimate dark!','#0a0a1a','#000008','#ff0044','skull',1],
    ['class_one_punch','One Punch Hero','mythic',25000,'ONE PUUUNCH!','#cc8800','#aa6600','#ff0044','fist',1],
    ['class_reality_breaker','Reality Breaker','mythic',25000,'Break reality!','#3a1a6a','#200848','#ff0044','spiral',1],
    ['class_eternal_warlord','Eternal Warlord','mythic',20000,'Eternal rage!','#6a0a0a','#480000','#ff0044','crown',1],
    ['class_soul_slayer','Soul Slayer','mythic',18000,'Slay all souls!','#4a0a3a','#300028','#ff0044','scythe',1],
    ['class_war_god','War God','mythic',22000,'God of battle!','#8a2a0a','#601800','#ff0044','axe',1],
    ['class_infinity_mage','Infinity Mage','mythic',20000,'Infinite spells!','#1a1a5a','#000840','#ff0044','staff',1],
    ['class_dimension_lord','Dimension Lord','mythic',25000,'All dimensions!','#0a2a4a','#001830','#ff0044','spiral',1],
];

// Parse raw data into objects
const ALL_NEW_CLASSES = ALL_NEW_CLASSES_RAW.map(c => ({
    id: c[0], name: c[1], rarity: c[2], price: c[3], subtitle: c[4],
    c1: c[5], c2: c[6], border: c[7], symbol: c[8], shopWeight: c[9]
}));

// Convert to shop-ready items with generated icons
function getNewClassShopItems() {
    return ALL_NEW_CLASSES.map(c => ({
        id: c.id,
        icon: generateClassIcon(c.c1, c.c2, c.border, c.symbol),
        rarity: c.rarity,
        name: c.name,
        price: c.price,
        isClass: true,
        subtitle: c.subtitle,
        shopWeight: c.shopWeight
    }));
}

// Daily shop rotation - selects classes based on date seed
function getDailyShopClasses(count) {
    const allItems = getNewClassShopItems();
    const d = new Date();
    let seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();

    function rng() {
        seed = (seed * 16807 + 12345) % 2147483647;
        return seed / 2147483647;
    }
    // Warm up RNG
    for (let i = 0; i < 10; i++) rng();

    const pool = [...allItems];
    const selected = [];

    for (let i = 0; i < count && pool.length > 0; i++) {
        const totalW = pool.reduce((s, c) => s + c.shopWeight, 0);
        let r = rng() * totalW;
        for (let j = 0; j < pool.length; j++) {
            r -= pool[j].shopWeight;
            if (r <= 0) {
                selected.push(pool.splice(j, 1)[0]);
                break;
            }
        }
    }
    return selected;
}

// Get ALL classes as shop items (for "Browse All" view)
function getAllClassShopItems() {
    return getNewClassShopItems();
}

// === GAMEPLAY STATS for each class ===
// Stats: dmg = damage multiplier, spd = speed multiplier, jump = jump multiplier,
//        hp = health bonus (flat), atkSpd = attack speed multiplier,
//        weapon = weapon name (or null), weaponDmg = weapon damage
const CLASS_STATS = {
    // COMMON - small bonuses
    class_knight:       { dmg: 1.10, spd: 1.0,  jump: 1.0,  hp: 15, atkSpd: 1.0,  weapon: 'ironSword', weaponDmg: 4 },
    class_guard:        { dmg: 1.0,  spd: 1.0,  jump: 1.0,  hp: 25, atkSpd: 1.0,  weapon: 'guardShield', weaponDmg: 3 },
    class_squire:       { dmg: 1.08, spd: 1.0,  jump: 1.0,  hp: 10, atkSpd: 1.05, weapon: null, weaponDmg: 0 },
    class_soldier:      { dmg: 1.12, spd: 1.0,  jump: 1.0,  hp: 10, atkSpd: 1.0,  weapon: 'spear', weaponDmg: 5 },
    class_militia:      { dmg: 1.10, spd: 1.05, jump: 1.0,  hp: 0,  atkSpd: 1.0,  weapon: 'hatchet', weaponDmg: 4 },
    class_blacksmith:   { dmg: 1.15, spd: 1.0,  jump: 1.0,  hp: 5,  atkSpd: 1.0,  weapon: 'warHammer', weaponDmg: 6 },
    class_miner:        { dmg: 1.10, spd: 1.0,  jump: 1.0,  hp: 15, atkSpd: 1.0,  weapon: 'pickaxe', weaponDmg: 4 },
    class_lumberjack:   { dmg: 1.15, spd: 1.0,  jump: 1.0,  hp: 0,  atkSpd: 1.0,  weapon: 'woodAxe', weaponDmg: 5 },
    class_farmer:       { dmg: 1.0,  spd: 1.10, jump: 1.0,  hp: 10, atkSpd: 1.0,  weapon: 'pitchfork', weaponDmg: 3 },
    class_fisher:       { dmg: 1.0,  spd: 1.05, jump: 1.0,  hp: 15, atkSpd: 1.0,  weapon: 'fishRod', weaponDmg: 2 },
    class_scout:        { dmg: 1.0,  spd: 1.20, jump: 1.05, hp: 0,  atkSpd: 1.0,  weapon: 'scoutKnife', weaponDmg: 3 },
    class_hunter:       { dmg: 1.12, spd: 1.10, jump: 1.0,  hp: 0,  atkSpd: 1.0,  weapon: 'huntingBow', weaponDmg: 5 },
    class_nomad:        { dmg: 1.0,  spd: 1.15, jump: 1.05, hp: 5,  atkSpd: 1.0,  weapon: null, weaponDmg: 0 },
    class_explorer:     { dmg: 1.0,  spd: 1.10, jump: 1.10, hp: 5,  atkSpd: 1.0,  weapon: null, weaponDmg: 0 },
    class_wanderer:     { dmg: 1.0,  spd: 1.12, jump: 1.0,  hp: 5,  atkSpd: 1.0,  weapon: 'walkingStaff', weaponDmg: 2 },
    class_baker_c:      { dmg: 1.0,  spd: 1.0,  jump: 1.0,  hp: 20, atkSpd: 1.05, weapon: 'rollingPin', weaponDmg: 3 },
    class_bard:         { dmg: 1.05, spd: 1.05, jump: 1.05, hp: 5,  atkSpd: 1.05, weapon: 'lute', weaponDmg: 2 },
    class_thief:        { dmg: 1.05, spd: 1.18, jump: 1.0,  hp: 0,  atkSpd: 1.10, weapon: 'thiefDagger', weaponDmg: 4 },
    class_merchant:     { dmg: 1.0,  spd: 1.0,  jump: 1.0,  hp: 10, atkSpd: 1.0,  weapon: 'coinBag', weaponDmg: 2 },
    class_herbalist:    { dmg: 1.0,  spd: 1.0,  jump: 1.0,  hp: 25, atkSpd: 1.0,  weapon: null, weaponDmg: 0 },
    class_apprentice:   { dmg: 1.08, spd: 1.08, jump: 1.0,  hp: 5,  atkSpd: 1.0,  weapon: 'wand', weaponDmg: 3 },
    class_novice:       { dmg: 1.05, spd: 1.05, jump: 1.05, hp: 5,  atkSpd: 1.05, weapon: null, weaponDmg: 0 },
    class_recruit:      { dmg: 1.05, spd: 1.0,  jump: 1.0,  hp: 15, atkSpd: 1.0,  weapon: null, weaponDmg: 0 },
    class_trainee:      { dmg: 1.08, spd: 1.0,  jump: 1.0,  hp: 10, atkSpd: 1.0,  weapon: 'trainingStick', weaponDmg: 2 },
    class_cadet:        { dmg: 1.10, spd: 1.0,  jump: 1.0,  hp: 10, atkSpd: 1.0,  weapon: 'cadetShield', weaponDmg: 3 },
    class_sailor:       { dmg: 1.0,  spd: 1.05, jump: 1.15, hp: 10, atkSpd: 1.0,  weapon: 'anchor', weaponDmg: 4 },
    class_cobbler:      { dmg: 1.0,  spd: 1.10, jump: 1.0,  hp: 5,  atkSpd: 1.0,  weapon: null, weaponDmg: 0 },
    class_shepherd:     { dmg: 1.0,  spd: 1.0,  jump: 1.0,  hp: 20, atkSpd: 1.0,  weapon: 'crook', weaponDmg: 2 },
    class_messenger:    { dmg: 1.0,  spd: 1.25, jump: 1.05, hp: 0,  atkSpd: 1.0,  weapon: null, weaponDmg: 0 },
    class_tinkerer:     { dmg: 1.05, spd: 1.0,  jump: 1.0,  hp: 5,  atkSpd: 1.12, weapon: 'wrench', weaponDmg: 3 },

    // RARE - moderate bonuses
    class_samurai:      { dmg: 1.20, spd: 1.05, jump: 1.0,  hp: 5,  atkSpd: 1.10, weapon: 'katana', weaponDmg: 7 },
    class_viking:       { dmg: 1.15, spd: 1.0,  jump: 1.0,  hp: 20, atkSpd: 1.05, weapon: 'battleAxe', weaponDmg: 7 },
    class_gladiator:    { dmg: 1.15, spd: 1.0,  jump: 1.0,  hp: 10, atkSpd: 1.10, weapon: 'gladius', weaponDmg: 6 },
    class_ronin:        { dmg: 1.18, spd: 1.10, jump: 1.0,  hp: 0,  atkSpd: 1.05, weapon: 'roninsWord', weaponDmg: 7 },
    class_duelist:      { dmg: 1.10, spd: 1.05, jump: 1.0,  hp: 0,  atkSpd: 1.20, weapon: 'rapier', weaponDmg: 5 },
    class_fire_mage:    { dmg: 1.20, spd: 1.0,  jump: 1.0,  hp: 5,  atkSpd: 1.05, weapon: 'fireStaff', weaponDmg: 6 },
    class_ice_mage:     { dmg: 1.20, spd: 1.0,  jump: 1.0,  hp: 5,  atkSpd: 1.05, weapon: 'iceStaff', weaponDmg: 6 },
    class_alchemist:    { dmg: 1.10, spd: 1.0,  jump: 1.0,  hp: 20, atkSpd: 1.0,  weapon: 'acidFlask', weaponDmg: 5 },
    class_druid:        { dmg: 1.05, spd: 1.15, jump: 1.05, hp: 20, atkSpd: 1.0,  weapon: 'natureScepter', weaponDmg: 4 },
    class_shaman:       { dmg: 1.12, spd: 1.0,  jump: 1.0,  hp: 15, atkSpd: 1.05, weapon: 'totem', weaponDmg: 5 },
    class_berserker:    { dmg: 1.30, spd: 1.05, jump: 1.0,  hp: -10, atkSpd: 1.15, weapon: 'warAxe', weaponDmg: 8 },
    class_monk:         { dmg: 1.05, spd: 1.10, jump: 1.10, hp: 15, atkSpd: 1.15, weapon: 'boStaff', weaponDmg: 4 },
    class_pirate:       { dmg: 1.12, spd: 1.15, jump: 1.0,  hp: 5,  atkSpd: 1.0,  weapon: 'cutlass', weaponDmg: 6 },
    class_mercenary:    { dmg: 1.15, spd: 1.05, jump: 1.0,  hp: 10, atkSpd: 1.05, weapon: 'mercBlade', weaponDmg: 6 },
    class_marauder:     { dmg: 1.15, spd: 1.0,  jump: 1.0,  hp: 5,  atkSpd: 1.20, weapon: 'spikedAxe', weaponDmg: 7 },
    class_paladin:      { dmg: 1.10, spd: 1.0,  jump: 1.0,  hp: 25, atkSpd: 1.0,  weapon: 'holySword', weaponDmg: 6 },
    class_crusader:     { dmg: 1.12, spd: 1.0,  jump: 1.0,  hp: 20, atkSpd: 1.0,  weapon: 'crusaderMace', weaponDmg: 6 },
    class_templar:      { dmg: 1.10, spd: 1.0,  jump: 1.0,  hp: 15, atkSpd: 1.0,  weapon: 'templarShield', weaponDmg: 5 },
    class_cleric:       { dmg: 1.0,  spd: 1.0,  jump: 1.0,  hp: 30, atkSpd: 1.0,  weapon: 'holyMace', weaponDmg: 3 },
    class_priest:       { dmg: 1.0,  spd: 1.0,  jump: 1.0,  hp: 25, atkSpd: 1.0,  weapon: 'divineScepter', weaponDmg: 3 },
    class_shadow_dancer: { dmg: 1.10, spd: 1.20, jump: 1.0,  hp: 0,  atkSpd: 1.10, weapon: 'shadowBlade', weaponDmg: 5 },
    class_wind_runner:  { dmg: 1.0,  spd: 1.25, jump: 1.15, hp: 0,  atkSpd: 1.0,  weapon: 'windBow', weaponDmg: 4 },
    class_acrobat:      { dmg: 1.0,  spd: 1.15, jump: 1.20, hp: 0,  atkSpd: 1.10, weapon: null, weaponDmg: 0 },
    class_ranger:       { dmg: 1.15, spd: 1.15, jump: 1.0,  hp: 0,  atkSpd: 1.0,  weapon: 'rangerBow', weaponDmg: 6 },
    class_swashbuckler: { dmg: 1.15, spd: 1.15, jump: 1.0,  hp: 0,  atkSpd: 1.05, weapon: 'rapierSword', weaponDmg: 5 },

    // EPIC - significant bonuses
    class_necromancer:  { dmg: 1.25, spd: 1.0,  jump: 1.0,  hp: 10, atkSpd: 1.10, weapon: 'deathStaff', weaponDmg: 8 },
    class_vampire:      { dmg: 1.15, spd: 1.10, jump: 1.10, hp: 0,  atkSpd: 1.15, weapon: 'vampireFangs', weaponDmg: 7, lifesteal: 0.10 },
    class_shadow_assassin: { dmg: 1.20, spd: 1.30, jump: 1.0,  hp: -5, atkSpd: 1.15, weapon: 'shadowDagger', weaponDmg: 8 },
    class_dark_sorcerer: { dmg: 1.25, spd: 1.0,  jump: 1.0,  hp: 5,  atkSpd: 1.10, weapon: 'darkStaff', weaponDmg: 7 },
    class_soul_reaper:  { dmg: 1.30, spd: 1.05, jump: 1.0,  hp: 0,  atkSpd: 1.05, weapon: 'soulScythe', weaponDmg: 10 },
    class_dragon_knight: { dmg: 1.20, spd: 1.0,  jump: 1.0,  hp: 20, atkSpd: 1.05, weapon: 'dragonSword', weaponDmg: 8 },
    class_wyvern_rider: { dmg: 1.15, spd: 1.20, jump: 1.15, hp: 10, atkSpd: 1.0,  weapon: 'wyvernLance', weaponDmg: 7 },
    class_storm_caller: { dmg: 1.25, spd: 1.0,  jump: 1.0,  hp: 10, atkSpd: 1.10, weapon: 'stormStaff', weaponDmg: 8 },
    class_thunder_warrior: { dmg: 1.20, spd: 1.10, jump: 1.0,  hp: 10, atkSpd: 1.10, weapon: 'thunderHammer', weaponDmg: 8 },
    class_archmage:     { dmg: 1.30, spd: 1.0,  jump: 1.0,  hp: 10, atkSpd: 1.10, weapon: 'arcaneStaff', weaponDmg: 9 },
    class_battle_mage:  { dmg: 1.20, spd: 1.0,  jump: 1.0,  hp: 20, atkSpd: 1.10, weapon: 'warStaff', weaponDmg: 7 },
    class_enchanter:    { dmg: 1.15, spd: 1.15, jump: 1.05, hp: 15, atkSpd: 1.15, weapon: 'enchantWand', weaponDmg: 5 },
    class_blade_master: { dmg: 1.15, spd: 1.05, jump: 1.0,  hp: 5,  atkSpd: 1.25, weapon: 'twinBlades', weaponDmg: 8 },
    class_war_chief:    { dmg: 1.20, spd: 1.0,  jump: 1.0,  hp: 10, atkSpd: 1.15, weapon: 'chiefAxe', weaponDmg: 8 },
    class_phantom:      { dmg: 1.10, spd: 1.30, jump: 1.10, hp: 0,  atkSpd: 1.10, weapon: 'phantomBlade', weaponDmg: 6 },
    class_void_walker:  { dmg: 1.15, spd: 1.25, jump: 1.0,  hp: 5,  atkSpd: 1.05, weapon: 'voidOrb', weaponDmg: 7 },
    class_blood_warrior: { dmg: 1.25, spd: 1.0,  jump: 1.0,  hp: 10, atkSpd: 1.05, weapon: 'bloodSword', weaponDmg: 9, lifesteal: 0.05 },
    class_frost_lord:   { dmg: 1.25, spd: 1.0,  jump: 1.0,  hp: 10, atkSpd: 1.0,  weapon: 'frostStaff', weaponDmg: 8 },
    class_spirit_walker: { dmg: 1.05, spd: 1.25, jump: 1.15, hp: 10, atkSpd: 1.05, weapon: 'spiritLantern', weaponDmg: 5 },
    class_titan:        { dmg: 1.10, spd: 0.95, jump: 1.0,  hp: 50, atkSpd: 1.0,  weapon: 'titanFist', weaponDmg: 9 },

    // LEGENDARY - large bonuses
    class_dragon_lord:  { dmg: 1.35, spd: 1.0,  jump: 1.10, hp: 25, atkSpd: 1.10, weapon: 'dragonFang', weaponDmg: 12 },
    class_death_knight: { dmg: 1.30, spd: 1.0,  jump: 1.0,  hp: 25, atkSpd: 1.10, weapon: 'deathBlade', weaponDmg: 11, lifesteal: 0.08 },
    class_archangel:    { dmg: 1.25, spd: 1.25, jump: 1.25, hp: 25, atkSpd: 1.25, weapon: 'divineSword', weaponDmg: 10 },
    class_demon_king:   { dmg: 1.40, spd: 1.15, jump: 1.0,  hp: 10, atkSpd: 1.10, weapon: 'demonTrident', weaponDmg: 13 },
    class_shadow_lord:  { dmg: 1.30, spd: 1.30, jump: 1.0,  hp: 5,  atkSpd: 1.10, weapon: 'shadowScythe', weaponDmg: 11 },
    class_elemental_master: { dmg: 1.35, spd: 1.10, jump: 1.05, hp: 15, atkSpd: 1.10, weapon: 'elementalOrb', weaponDmg: 10 },
    class_god_of_war:   { dmg: 1.40, spd: 1.0,  jump: 1.0,  hp: 15, atkSpd: 1.20, weapon: 'warGodAxe', weaponDmg: 14 },
    class_immortal:     { dmg: 1.10, spd: 1.0,  jump: 1.0,  hp: 60, atkSpd: 1.0,  weapon: 'immortalShield', weaponDmg: 8 },
    class_chaos_knight: { dmg: 1.35, spd: 1.10, jump: 1.0,  hp: 15, atkSpd: 1.10, weapon: 'chaosBlade', weaponDmg: 12 },
    class_void_emperor: { dmg: 1.35, spd: 1.25, jump: 1.0,  hp: 10, atkSpd: 1.10, weapon: 'voidScepter', weaponDmg: 11 },
    class_ancient_dragon: { dmg: 1.25, spd: 1.0,  jump: 1.10, hp: 50, atkSpd: 1.05, weapon: 'ancientClaw', weaponDmg: 11 },
    class_celestial:    { dmg: 1.30, spd: 1.30, jump: 1.30, hp: 30, atkSpd: 1.10, weapon: 'celestialBow', weaponDmg: 10 },
    class_doom_bringer: { dmg: 1.45, spd: 1.0,  jump: 1.0,  hp: 5,  atkSpd: 1.10, weapon: 'doomScythe', weaponDmg: 15 },
    class_time_lord:    { dmg: 1.15, spd: 1.25, jump: 1.0,  hp: 15, atkSpd: 1.25, weapon: 'chronoStaff', weaponDmg: 8 },
    class_astral_knight: { dmg: 1.30, spd: 1.10, jump: 1.10, hp: 20, atkSpd: 1.10, weapon: 'astralBlade', weaponDmg: 11 },

    // MYTHIC - massive bonuses
    class_cosmic_titan: { dmg: 1.40, spd: 1.0,  jump: 1.10, hp: 60, atkSpd: 1.10, weapon: 'cosmicFist', weaponDmg: 16 },
    class_infinity_knight: { dmg: 1.40, spd: 1.40, jump: 1.30, hp: 20, atkSpd: 1.15, weapon: 'infinityBlade', weaponDmg: 14 },
    class_shadow_emperor: { dmg: 1.60, spd: 1.20, jump: 1.0,  hp: 10, atkSpd: 1.15, weapon: 'emperorScythe', weaponDmg: 18 },
    class_one_punch:    { dmg: 2.00, spd: 1.20, jump: 1.0,  hp: 0,  atkSpd: 1.0,  weapon: 'onePunchFist', weaponDmg: 25 },
    class_reality_breaker: { dmg: 1.50, spd: 1.10, jump: 1.10, hp: 30, atkSpd: 1.10, weapon: 'realityOrb', weaponDmg: 16 },
    class_eternal_warlord: { dmg: 1.45, spd: 1.0,  jump: 1.0,  hp: 40, atkSpd: 1.15, weapon: 'eternalAxe', weaponDmg: 16 },
    class_soul_slayer:  { dmg: 1.50, spd: 1.25, jump: 1.0,  hp: 10, atkSpd: 1.15, weapon: 'soulScytheM', weaponDmg: 17, lifesteal: 0.12 },
    class_war_god:      { dmg: 1.60, spd: 1.0,  jump: 1.0,  hp: 30, atkSpd: 1.20, weapon: 'godSlayer', weaponDmg: 20 },
    class_infinity_mage: { dmg: 1.55, spd: 1.0,  jump: 1.0,  hp: 20, atkSpd: 1.20, weapon: 'infinityStaff', weaponDmg: 15 },
    class_dimension_lord: { dmg: 1.50, spd: 1.40, jump: 1.20, hp: 15, atkSpd: 1.15, weapon: 'dimensionRift', weaponDmg: 16 },
};

// Get all class IDs (for admin panel)
function getAllClassIds() {
    return ALL_NEW_CLASSES.map(c => c.id);
}
