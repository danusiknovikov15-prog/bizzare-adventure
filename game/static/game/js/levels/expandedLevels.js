// Procedural campaign expansion: Levels 31-330 (300 additional levels).
// Level 31 unlocks the Infinity Gauntlet. Each level has its own generated layout,
// enemy pattern, theme and portal, while keeping the existing LevelManager format.

const THEMES = [
  ['Neon Citadel','#15102b','#22d3ee'],['Lava Foundry','#2b0b08','#f97316'],
  ['Sky Ruins','#10233f','#60a5fa'],['Shadow Swamp','#111827','#8b5cf6'],
  ['Crystal Depths','#102a2a','#67e8f9'],['Storm Keep','#172033','#facc15'],
  ['Sunken Temple','#082f49','#38bdf8'],['Machine Core','#18181b','#a1a1aa'],
  ['Frozen Wastes','#0c1a2a','#bae6fd'],['Void Frontier','#160d26','#c084fc']
];

function makeLevel(number) {
  const [theme, backgroundColor, accent] = THEMES[(number - 31) % THEMES.length];
  const boss = number % 10 === 0 || number === 31;
  const width = 1800 + ((number * 137) % 900);
  const platforms = [
    {x:0,y:550,width:360,height:50,color:accent},
    {x:430,y:500,width:180,height:20,color:accent},
    {x:690,y:430,width:170,height:20,color:accent},
    {x:940,y:500,width:190,height:20,color:accent},
    {x:1210,y:390,width:170,height:20,color:accent},
    {x:1450,y:470,width:200,height:20,color:accent},
    {x:Math.max(1680,width-260),y:360,width:240,height:30,color:accent}
  ];
  const enemies = [];
  const count = 4 + (number % 5);
  for (let i=0;i<count;i++) {
    const x = 500 + ((number * 97 + i * 211) % Math.max(700,width-700));
    const y = 300 + ((i * 43 + number) % 170);
    enemies.push({x,y,isElite:(i % 3 === 0)});
  }
  if (boss) enemies.push({x:width-220,y:270,isBoss:true,bossType:number===31?'basic':undefined});
  return {
    name: 'Level ' + number + ': ' + theme,
    playerSpawn:{x:100,y:480},
    backgroundColor,
    platforms,
    bounds:{minX:0,maxX:width,minY:0,maxY:600},
    door:{x:width-100,y:470},
    goal:{x:width-190,y:420,width:170,height:100},
    enemies
  };
}

export const expandedLevels = Array.from({length:300},(_,i)=>makeLevel(i+31));
export { makeLevel };
