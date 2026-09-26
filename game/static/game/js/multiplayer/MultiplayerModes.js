// Multiplayer game mode definitions and objective rules.
export const MULTIPLAYER_MODES = {
  coop: { name:'Co-op', icon:'🤝', objective:'Work together and defeat the level.' },
  pvp: { name:'PvP', icon:'⚔️', objective:'Fight the other players.' },
  survival: { name:'Survival', icon:'🧟', objective:'Survive escalating enemy waves.' },
  bossrush: { name:'Boss Rush', icon:'👑', objective:'Defeat bosses as quickly as possible.' },
  race: { name:'Race', icon:'🏁', objective:'Reach the finish first.' },
  kinghill: { name:'King of the Hill', icon:'🏔️', objective:'Hold the hill to score.' },
  capture: { name:'Capture Point', icon:'🚩', objective:'Control the capture point.' },
  escort: { name:'Escort', icon:'🛡️', objective:'Stay together and escort the objective.' },
  treasure: { name:'Treasure Hunt', icon:'💎', objective:'Find treasure around the level.' },
  infection: { name:'Infection', icon:'🦠', objective:'Avoid the infected player and spread the infection.' }
};

export function getMultiplayerMode(mode) {
  return MULTIPLAYER_MODES[mode] || MULTIPLAYER_MODES.coop;
}
