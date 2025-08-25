/* =========================
   Phasmophobia — script.js
   ========================= */

/* ---------- Data ---------- */
const EVIDENCE=["EMF Level 5","Spirit Box","Ghost Writing","Freezing Temps","D.O.T.S","Ghost Orbs","Fingerprints (UV)"];

const GHOSTS=[
  {name:"Spirit",ev:["EMF Level 5","Spirit Box","Ghost Writing"],notes:["Smudge prevents hunts ~3 mins (longest)."]},
  {name:"Wraith",ev:["EMF Level 5","Spirit Box","D.O.T.S"],notes:["Will never step in or disturb salt; no UV footprints.","Can teleport to players (EMF 2, sometimes 5)."]},
  {name:"Phantom",ev:["Spirit Box","Fingerprints (UV)","D.O.T.S"],notes:["Photo makes ghost model disappear.","Slow blink during hunts."]},
  {name:"Poltergeist",ev:["Spirit Box","Fingerprints (UV)","Ghost Writing"],notes:["Can throw multiple objects at once (polter burst)."]},
  {name:"Banshee",ev:["Fingerprints (UV)","Ghost Orbs","D.O.T.S"],notes:["Targets one player.","Unique parabolic scream."]},
  {name:"Jinn",ev:["EMF Level 5","Fingerprints (UV)","Freezing Temps"],notes:["Will not turn the fuse box OFF directly (can overload).","Faster with line of sight when far while power ON."]},
  {name:"Mare",ev:["Spirit Box","Ghost Orbs","Ghost Writing"],notes:["Prefers darkness; higher hunt chance with lights off.","Will not turn lights ON."]},
  {name:"Revenant",ev:["Ghost Orbs","Ghost Writing","Freezing Temps"],notes:["Very slow with no LoS; extremely fast when it sees you."]},
  {name:"Shade",ev:["EMF Level 5","Ghost Writing","Freezing Temps"],notes:["Shy: fewer events with people nearby; reluctant to hunt with players in room."]},
  {name:"Demon",ev:["Fingerprints (UV)","Ghost Writing","Freezing Temps"],notes:["Can hunt very early; shorter smudge cooldown."]},
  {name:"Yurei",ev:["Ghost Orbs","D.O.T.S","Freezing Temps"],notes:["Stronger sanity drain door event; smudging room can lock it briefly."]},
  {name:"Oni",ev:["EMF Level 5","D.O.T.S","Freezing Temps"],notes:["No airball events.","More visible during events."]},
  {name:"Yokai",ev:["Spirit Box","Ghost Orbs","D.O.T.S"],notes:["Talking can trigger hunts; reduced hearing during hunts."]},
  {name:"Hantu",ev:["Fingerprints (UV)","Ghost Orbs","Freezing Temps"],notes:["Faster in cold; frosty breath during hunts in cold/with breaker off.","Cannot turn fuse box ON."]},
  {name:"Goryo",ev:["EMF Level 5","Fingerprints (UV)","D.O.T.S"],notes:["DOTS only on camera; rarely far from room."]},
  {name:"Myling",ev:["EMF Level 5","Fingerprints (UV)","Ghost Writing"],notes:["Very quiet footsteps during hunt; active on parabolic."]},
  {name:"Onryo",ev:["Spirit Box","Ghost Orbs","Freezing Temps"],notes:["Candle/flame blow-out can trigger hunts."]},
  {name:"The Twins",ev:["EMF Level 5","Spirit Box","Freezing Temps"],notes:["Two spots interacting; different hunt speeds."]},
  {name:"Raiju",ev:["EMF Level 5","Ghost Orbs","D.O.T.S"],notes:["Faster near active electronics; lower hunt threshold around electronics."]},
  {name:"Obake",ev:["EMF Level 5","Ghost Orbs","Fingerprints (UV)"],notes:["6-finger/odd prints; prints fade quickly; sometimes no prints."]},
  {name:"The Mimic",ev:["Spirit Box","Freezing Temps","Fingerprints (UV)"],notes:["ALWAYS shows Ghost Orbs as extra evidence.","Can imitate other ghosts' behaviors."]},
  {name:"Moroi",ev:["Spirit Box","Ghost Writing","Freezing Temps"],notes:["Box/parabolic can curse you → faster sanity drain; longer smudge blind once hunting."]},
  {name:"Deogen",ev:["Spirit Box","Ghost Writing","D.O.T.S"],notes:["Heavy breathing SB; very slow when near you; fast at range."]},
  {name:"Thaye",ev:["Ghost Orbs","Ghost Writing","D.O.T.S"],notes:["Starts very fast/active; ages to become slow/inactive; Ouija age changes."]},
];

// Detailed Ghost Info (on-site)
const GHOST_DETAILS = {
  "Spirit": {
    "threshold": "Normal (50%)",
    "traits": [
      "No unique hunt modifiers",
      "Smudge blocks hunts ~180s (longest)"
    ],
    "abilities": [
      "None distinct compared to other ghosts"
    ],
    "tests": [
      "Smudge the ghost room; if hunts resume <180s, not Spirit"
    ],
    "strategy": [
      "Use 3:00 smudge timer to rule out others",
      "Collect EMF 5, Spirit Box, Writing"
    ]
  },
  "Wraith": {
    "threshold": "Normal (50%)",
    "traits": [
      "Never leaves UV footprints in salt",
      "Can teleport to a player (EMF 2–5)"
    ],
    "abilities": [
      "Teleport ability may cause sudden EMF far from room"
    ],
    "tests": [
      "Salt + UV: no footprints after stepping = Wraith",
      "Watch for teleport EMF spikes away from room"
    ],
    "strategy": [
      "Use salt traps to confirm",
      "Track sudden EMF away from room"
    ]
  },
  "Phantom": {
    "threshold": "Normal (50%)",
    "traits": [
      "Photo during event makes model disappear",
      "Slower blink rate in hunts"
    ],
    "abilities": [
      "Photo doesn’t end event; only hides model"
    ],
    "tests": [
      "Photo mid-appearance: vanish = Phantom",
      "Compare hunt blink cadence vs Oni"
    ],
    "strategy": [
      "Keep a camera ready",
      "Use blink cadence as a tell"
    ]
  },
  "Poltergeist": {
    "threshold": "Normal (50%)",
    "traits": [
      "Throws multiple objects at once (burst)",
      "More frequent/stronger throws"
    ],
    "abilities": [
      "Burst can drain sanity more"
    ],
    "tests": [
      "Pile items; look for multi-throw bursts",
      "Track EMF 3 on throw chains"
    ],
    "strategy": [
      "Bait with object piles",
      "Stay near objects to gather throws"
    ]
  },
  "Banshee": {
    "threshold": "Normal (50%)",
    "traits": [
      "Targets a single player",
      "Unique paramic ‘scream’"
    ],
    "abilities": [
      "Prefers singing events; target locked"
    ],
    "tests": [
      "Listen for scream on paramic",
      "Rotate who stays in room to test targeting"
    ],
    "strategy": [
      "Swap presence to manipulate target",
      "If not target, you’re safer during hunts"
    ]
  },
  "Jinn": {
    "threshold": "Normal (50%)",
    "traits": [
      "Faster when far if breaker ON",
      "Cannot turn breaker off directly"
    ],
    "abilities": [
      "Ability EMF spikes near power"
    ],
    "tests": [
      "Chase with breaker ON vs OFF to see speed change"
    ],
    "strategy": [
      "Kill breaker to remove speed-up",
      "Use long hallway to observe"
    ]
  },
  "Mare": {
    "threshold": "Earlier in dark (~60%)",
    "traits": [
      "Prefers lights off",
      "Less likely to turn lights on"
    ],
    "abilities": [
      "Darkness early hunts"
    ],
    "tests": [
      "Toggle lights; Mare turns off quickly",
      "Keep room lit to delay hunts"
    ],
    "strategy": [
      "Control lighting to manage threshold",
      "Force switch interactions for tells"
    ]
  },
  "Revenant": {
    "threshold": "Normal (50%)",
    "traits": [
      "Very fast when chasing; very slow when not",
      "Sharp speed phase change"
    ],
    "abilities": [
      "Patrol slow when no LoS"
    ],
    "tests": [
      "Break LoS: if speed drops sharply → Rev"
    ],
    "strategy": [
      "Use corners to drop LoS",
      "Smudge to reset pressure"
    ]
  },
  "Shade": {
    "threshold": "Normal (low activity ~35–50%)",
    "traits": [
      "Very shy near players",
      "Unlikely to hunt if someone is in room"
    ],
    "abilities": [
      "Prefers interactions when alone"
    ],
    "tests": [
      "Low activity at low sanity → Shade",
      "Leave room to force writing or events"
    ],
    "strategy": [
      "Give it space for evidence",
      "Expect slower confirmations"
    ]
  },
  "Demon": {
    "threshold": "Earlier (~70%)",
    "traits": [
      "Shorter smudge block (~120s)",
      "Can chain early hunts"
    ],
    "abilities": [
      "Very early hunt attempts"
    ],
    "tests": [
      "Smudge timing: <180s but ~120s → Demon"
    ],
    "strategy": [
      "Stay smudge-ready",
      "Use pills conservatively"
    ]
  },
  "Yurei": {
    "threshold": "Normal (50%)",
    "traits": [
      "Strong sanity drain door slam",
      "Less wandering when smudged in room"
    ],
    "abilities": [
      "Big sanity drain event"
    ],
    "tests": [
      "Watch team sanity after door slam",
      "Smudge room; observe reduced wandering"
    ],
    "strategy": [
      "Track sanity deltas",
      "Smudge room during testing"
    ]
  },
  "Oni": {
    "threshold": "Normal (50%)",
    "traits": [
      "More visible; fast blink",
      "Cannot do airball event"
    ],
    "abilities": [
      "Prefers visible models"
    ],
    "tests": [
      "If airball occurs → not Oni",
      "Use blink rate to separate from Phantom"
    ],
    "strategy": [
      "Push events for observation",
      "Time blink cadence"
    ]
  },
  "Yokai": {
    "threshold": "Normal (50%) / earlier near talking",
    "traits": [
      "Reduced hearing while hunting",
      "Talking near it can trigger early hunts"
    ],
    "abilities": [
      "Voice proximity affects hunts"
    ],
    "tests": [
      "Talk near ghost to provoke",
      "Hide close and whisper — may not hear"
    ],
    "strategy": [
      "Be careful using voice chat",
      "Use close hides in a pinch"
    ]
  },
  "Hantu": {
    "threshold": "Normal (50%)",
    "traits": [
      "Faster in cold; slower in warm",
      "Breath puffs in cold during hunt"
    ],
    "abilities": [
      "Temperature-based speed"
    ],
    "tests": [
      "Warm house (breaker ON) to slow it",
      "Compare speeds in different rooms"
    ],
    "strategy": [
      "Heat building to weaken",
      "Map cold zones with thermo"
    ]
  },
  "Goryo": {
    "threshold": "Normal (50%)",
    "traits": [
      "DOTS on camera more than to players",
      "Roams less from room"
    ],
    "abilities": [
      "DOTS often cam-only"
    ],
    "tests": [
      "Place camera; observe DOTS remotely",
      "If only cam-DOTS → Goryo likely"
    ],
    "strategy": [
      "Aim cam at ghost room",
      "Combine with motion sensors"
    ]
  },
  "Myling": {
    "threshold": "Normal (50%)",
    "traits": [
      "Quieter footsteps at distance",
      "More paramic sounds"
    ],
    "abilities": [
      "Footsteps audible later than others"
    ],
    "tests": [
      "Compare step audibility vs distance",
      "Use paramic for frequent noises"
    ],
    "strategy": [
      "Test at range during hunt",
      "Balance distance to survive"
    ]
  },
  "Onryo": {
    "threshold": "Earlier with flame extinguish",
    "traits": [
      "Extinguished flame can trigger hunt",
      "Fears fire (candles delay hunts)"
    ],
    "abilities": [
      "Hunt roll after flame goes out"
    ],
    "tests": [
      "Place candles; track extinguish → hunt",
      "Pull candles to provoke early hunt"
    ],
    "strategy": [
      "Use candles for safety",
      "Control flame timing to identify"
    ]
  },
  "The Twins": {
    "threshold": "Normal (50%)",
    "traits": [
      "Two speeds: decoy faster, main slower",
      "Interactions in two places"
    ],
    "abilities": [
      "Decoy can mislead room location"
    ],
    "tests": [
      "Track two interaction spots",
      "Compare step speeds"
    ],
    "strategy": [
      "Cover both spots with sensors",
      "Use EMF timing + footsteps"
    ]
  },
  "Raiju": {
    "threshold": "Early near electronics (~65%)",
    "traits": [
      "Faster near active electronics",
      "Can drain/affect nearby gear"
    ],
    "abilities": [
      "Electronics radius speed buff"
    ],
    "tests": [
      "Begin hunt with gear ON vs OFF",
      "Observe speed difference"
    ],
    "strategy": [
      "Power down gear during hunts",
      "Bait with electronics to confirm"
    ]
  },
  "Obake": {
    "threshold": "Normal (50%)",
    "traits": [
      "Rare 6-finger UV handprint",
      "Fingerprints fade faster"
    ],
    "abilities": [
      "Odd hand shapes; faster decay"
    ],
    "tests": [
      "Look for 6-finger prints",
      "Time fingerprint lifetime"
    ],
    "strategy": [
      "Photo/UV every print quickly",
      "Re-check surfaces soon"
    ]
  },
  "The Mimic": {
    "threshold": "Varies (mimics target)",
    "traits": [
      "Copies behavior & speed",
      "Always has extra Ghost Orbs"
    ],
    "abilities": [
      "Can flip between archetypes"
    ],
    "tests": [
      "Confirm orbs even if not expected",
      "Watch for sudden behavior shifts"
    ],
    "strategy": [
      "Keep Mimic in mind late",
      "Don’t overfit on one behavior"
    ]
  },
  "Moroi": {
    "threshold": "Lower with curse (sanity-scaled)",
    "traits": [
      "Speed increases as sanity drops",
      "Curses via Box/Paramic; pills remove curse only"
    ],
    "abilities": [
      "LoS acceleration cap present"
    ],
    "tests": [
      "Delay Box/Paramic early",
      "Use pills after confirming curse"
    ],
    "strategy": [
      "Manage sanity tightly",
      "Fight in lit areas when possible"
    ]
  },
  "Deogen": {
    "threshold": "Normal (40–50%)",
    "traits": [
      "Fast at range, crawls up close",
      "Always knows your location"
    ],
    "abilities": [
      "Cannot be hidden from"
    ],
    "tests": [
      "Do not hide — let it slow near you",
      "Loop around furniture"
    ],
    "strategy": [
      "Loop; smudge to reposition",
      "Avoid long straight lines"
    ]
  },
  "Thaye": {
    "threshold": "Normal (rises as it ages)",
    "traits": [
      "Starts fast/active; weakens over time",
      "Ages faster with players nearby"
    ],
    "abilities": [
      "Behavior/evidence shift with time"
    ],
    "tests": [
      "Stay near room to age faster",
      "Compare early vs late speeds"
    ],
    "strategy": [
      "Prolong near-room presence",
      "Re-test behaviors later"
    ]
  }
};


/* Speeds */
// ---------- Ghost Speeds (m/s) ----------
const SPEEDS = {
  // Fallback reference (used only if a name is missing)
  Standard: { base: 1.70, changesSpeed: false },

  // “Standard” ghosts (always 1.7 m/s)
  Spirit:      { base: 1.70, changesSpeed: false },
  Wraith:      { base: 1.70, changesSpeed: false },
  Phantom:     { base: 1.70, changesSpeed: false },
  Poltergeist: { base: 1.70, changesSpeed: false },
  Banshee:     { base: 1.70, changesSpeed: false },
  Mare:        { base: 1.70, changesSpeed: false },
  Shade:       { base: 1.70, changesSpeed: false },
  Yurei:       { base: 1.70, changesSpeed: false },
  Oni:         { base: 1.70, changesSpeed: false },
  Yokai:       { base: 1.70, changesSpeed: false },
  Goryo:       { base: 1.70, changesSpeed: false },
  Myling:      { base: 1.70, changesSpeed: false },
  Onryo:       { base: 1.70, changesSpeed: false },
  Obake:       { base: 1.70, changesSpeed: false },
  "The Mimic": {
    base: 1.70,
    changesSpeed: true, // can mimic any ghost, so treat as variable
    notes: ["Can mimic other ghosts, so speed may vary."]
  },

  // Specials
  Jinn: {
    base: 1.70,
    changesSpeed: true,
    fixed: [{ speed: 2.50, when: "≥3 m, breaker ON, and line of sight" }],
    notes: ["Faster at range with breaker ON and LoS."]
  },

  Revenant: {
    base: 1.00,
    changesSpeed: true,
    fixed: [{ speed: 3.00, when: "when it has line of sight / knows your location" }],
    notes: ["Very slow without LoS; spikes to ~3.0 m/s when it sees you."]
  },

  Hantu: {
    range: [1.40, 2.70],
    changesSpeed: true,
    notes: ["Speed depends on room temperature; no LoS acceleration."]
  },

  Raiju: {
    base: 1.70,
    changesSpeed: true,
    fixed: [{ speed: 2.50, when: "near ACTIVE electronics" }],
    notes: ["Much faster near active electronics placed by players."]
  },

  Moroi: {
    range: [1.50, 2.25], // scales with cursed sanity
    changesSpeed: true,
    losCap: 3.71,
    notes: ["Base speed scales with sanity; can reach ~3.71 m/s at low sanity + LoS."]
  },

  Deogen: {
    range: [0.40, 3.00],
    changesSpeed: true,
    notes: ["Very fast at range; slows to ~0.4 m/s when close. Always has LoS."]
  },

  Thaye: {
    range: [1.00, 2.75], // ages from ~2.75 down toward ~1.0
    changesSpeed: true,
    notes: ["Starts fast; slows as it ages."]
  },

  "The Twins": {
    pair: [
      { label: "Main",  speed: 1.50 },
      { label: "Decoy", speed: 1.90 }
    ],
    changesSpeed: true,
    notes: ["Two hunt speeds: main (~1.5) and decoy (~1.9)."]
  }
};

/* Human-readable speed summary from SPEEDS */
function formatSpeedSummary(name){
  const d = (typeof SPEEDS!=='undefined' && SPEEDS && SPEEDS[name]) || (typeof SPEEDS!=='undefined' && SPEEDS && SPEEDS.Standard);
  if (!d) return '';
  const parts = [];
  if (Array.isArray(d.range) && d.range.length === 2) parts.push(`Speed varies ${d.range[0]}–${d.range[1]} m/s`);
  if (typeof d.base === 'number' && (!d.range || !d.range.length)) parts.push(`Base ~${d.base} m/s`);
  if (Array.isArray(d.fixed) && d.fixed.length) parts.push('Fixed states: ' + d.fixed.map(f => `${f.label||'state'} ${f.speed} m/s`).join(', '));
  if (Array.isArray(d.pair) && d.pair.length) parts.push('Variants: ' + d.pair.map(f => `${f.label||'variant'} ${f.speed} m/s`).join(', '));
  if (typeof d.losCap === 'number') parts.push(`LoS acceleration up to ~${d.losCap} m/s`);
  return parts.join(' • ');
}






/* Behaviours */
const BEHAVIOURS={
  exclude:[
    {id:'airballSeen',label:'Airball ghost event observed',ghosts:['Oni'],tip:'Oni cannot perform airball events.'},
    {id:'lightsOn',label:'Ghost turned a light ON',ghosts:['Mare'],tip:'Mare will never turn lights on.'},
    {id:'breakerOff',label:'Ghost turned fuse box OFF',ghosts:['Jinn'],tip:'Jinn cannot directly turn the fuse box off.'},
    {id:'breakerOn',label:'Ghost turned fuse box ON',ghosts:['Hantu'],tip:'Hantu will not turn the fuse box on.'},
    {id:'saltStep',label:'Salt pile disturbed (footprints/UV)',ghosts:['Wraith'],tip:'Wraith never steps in or disturbs salt.'},
    {id:'dotsNakedEye',label:'DOTS seen with naked eye',ghosts:['Goryo'],tip:'Goryo DOTS are only visible on camera.'},
    {id:'phantomPhotoHasModel',label:'Ghost model visible in a photo',ghosts:['Phantom'],tip:'Phantom becomes invisible in photos; visible model rules it out.'},
  ],
  require:[
    {id:'goryoCamDots',label:'DOTS only visible on video (not in person)',ghosts:['Goryo'],mimicable:false,tip:'Unique to Goryo.'},
    {id:'onryoCandle',label:'Hunt right after a flame blew out',ghosts:['Onryo','The Mimic'],tip:'Onryo mechanic; Mimic can copy.'},
    {id:'obakeSixFinger',label:'6-finger / odd UV fingerprints',ghosts:['Obake','The Mimic'],tip:'Obake tell; Mimic can copy.'},
    {id:'bansheeScream',label:'Banshee scream on parabolic',ghosts:['Banshee','The Mimic'],tip:'Unique sound; Mimic can copy.'},
    {id:'phantomPhotoVanish',label:'Ghost vanished in photo',ghosts:['Phantom','The Mimic'],tip:'Phantom tell; Mimic can copy.'},
    {id:'deogenNearSlow',label:'Very slow when near you (Deogen)',ghosts:['Deogen','The Mimic'],tip:'Deo speed pattern; Mimic can copy.'},
    {id:'revenantSpeed',label:'Slow until LoS, then very fast (Revenant)',ghosts:['Revenant','The Mimic'],tip:'Revenant speed pattern; Mimic can copy.'},
    {id:'twinsDouble',label:'Two interactions at once',ghosts:['The Twins','The Mimic'],tip:'Twins behavior; Mimic can copy.'},
    {id:'polterBurst',label:'Multi-object throw burst',ghosts:['Poltergeist','The Mimic'],tip:'Poltergeist tell; Mimic can copy.'},
    {id:'raijuElec',label:'Much faster near electronics',ghosts:['Raiju','The Mimic'],tip:'Raiju speed; Mimic can copy.'},
    {id:'mylingQuiet',label:'Very quiet hunt footsteps',ghosts:['Myling','The Mimic'],tip:'Myling hunt audio; Mimic can copy.'},
    {id:'hantuBreath',label:'Frosty breath visible during hunt',ghosts:['Hantu','The Mimic'],tip:'Hantu breath tell; Mimic can copy.'},
    {id:'yokaiTalk',label:'Hunt triggered by talking / poor hearing',ghosts:['Yokai','The Mimic'],tip:'Yokai talk/hearing; Mimic can copy.'},
    {id:'spirit3min',label:'After smudge, no hunts for ~3 minutes',ghosts:['Spirit','The Mimic'],tip:'Spirit smudge cooldown; Mimic can copy.'},
    {id:'thayeAging',label:'Ouija “Age” decreases',ghosts:['Thaye'],mimicable:false,tip:'Thaye only.'},
  ]
};

/* Difficulty */
const DIFFICULTY={
  Amateur:{evVisible:3,strictNoDefault:true,notes:'3 evidences visible. Longer setup, higher sanity.'},
  Intermediate:{evVisible:3,strictNoDefault:true,notes:'3 evidences visible. Standard sanity drain.'},
  Professional:{evVisible:3,strictNoDefault:true,notes:'3 evidences visible. Faster hunts; no setup timer.'},
  Nightmare:{evVisible:2,strictNoDefault:false,notes:'2 evidences visible. Ghost hides 1 — rely on behaviour.'},
  Insanity:{evVisible:1,strictNoDefault:false,notes:'1 evidence visible. Behaviour checks are critical.'},
};

/* Mode tips */
const MODE_TIPS={
  Amateur:['Keep lights on to preserve sanity; use pills late.','Always place a video cam early for Orbs and DOTS checks.'],
  Intermediate:['Thermo + EMF sweep to lock the room before spending time on SB/DOTS.','Use a photo cam during events for extra cash + Phantom test.'],
  Professional:['No setup timer: get two hiding spots first, then evidence.','Track the fuse box early; it matters for Jinn/Hantu tests.'],
  Nightmare:['Only 2 evidences show. Lean on behaviour (smudge timers, speed patterns, unique tells).','Remember: Wraith cannot disturb salt at all; any salt step rules it out.'],
  Insanity:['Only 1 evidence shows. Prioritise unique tells (Banshee scream, Obake prints, Goryo camera-only DOTS).','Carry lighter + smudge; time Spirit cooldown when safe.'],
};

/* Smart tips (with hooks) */
const SMART_TIPS=[
  {id:'tip_goryo',text:"Watch DOTS via video for 1–2 min. If only on camera → Goryo.",targets:['Goryo'],modes:['Professional','Nightmare','Insanity'],hook:{type:'require',id:'goryoCamDots'}},
  {id:'tip_wraith',text:"Lay salt lines. Any disturbed salt/UV footprints rules out Wraith.",targets:['Wraith'],modes:['All'],hook:{type:'exclude',id:'saltStep'}},
  {id:'tip_mare',text:"Toggle a room light. If the ghost turns a light ON, rule out Mare.",targets:['Mare'],modes:['All'],hook:{type:'exclude',id:'lightsOn'}},
  {id:'tip_jinn',text:"If it turns the fuse box OFF directly, rule out Jinn.",targets:['Jinn'],modes:['All'],hook:{type:'exclude',id:'breakerOff'}},
  {id:'tip_hantu',text:"Look for frosty breath/speed in cold areas (breaker off) → Hantu.",targets:['Hantu'],modes:['Professional','Nightmare','Insanity'],hook:{type:'require',id:'hantuBreath'}},
  {id:'tip_phantom',text:"Photo during event → if model vanishes in photo → Phantom.",targets:['Phantom'],modes:['All'],hook:{type:'require',id:'phantomPhotoVanish'}},
  {id:'tip_banshee',text:"Parabolic for the unique scream → Banshee.",targets:['Banshee'],modes:['Professional','Nightmare','Insanity'],hook:{type:'require',id:'bansheeScream'}},
  {id:'tip_obake',text:"Check for 6-finger/odd prints or fast-fading prints → Obake.",targets:['Obake'],modes:['Professional','Nightmare','Insanity'],hook:{type:'require',id:'obakeSixFinger'}},
  {id:'tip_polter',text:"Pile test: multi-object throw burst → Poltergeist.",targets:['Poltergeist'],modes:['All'],hook:{type:'require',id:'polterBurst'}},
  {id:'tip_twins',text:"Two spots interacting or differing hunt speeds → Twins.",targets:['The Twins'],modes:['All'],hook:{type:'require',id:'twinsDouble'}},
  {id:'tip_raiju',text:"Enable electronics; sprinting near electronics → Raiju.",targets:['Raiju'],modes:['Professional','Nightmare','Insanity'],hook:{type:'require',id:'raijuElec'}},
  {id:'tip_myling',text:"Very quiet footsteps vs other sounds in hunt → Myling.",targets:['Myling'],modes:['Professional','Nightmare','Insanity'],hook:{type:'require',id:'mylingQuiet'}},
  {id:'tip_onryo',text:"Hunt right after candle blow-out → Onryo.",targets:['Onryo'],modes:['All'],hook:{type:'require',id:'onryoCandle'}},
  {id:'tip_spirit',text:"Smudge → if ~3:00 of safety, consider Spirit.",targets:['Spirit'],modes:['Professional','Nightmare','Insanity'],hook:{type:'require',id:'spirit3min'}},
  {id:'tip_revenant',text:"Very slow off-LoS, blazingly fast on-LoS → Revenant.",targets:['Revenant'],modes:['All'],hook:{type:'require',id:'revenantSpeed'}},
  {id:'tip_deogen',text:"Fast at range, crawls when close → Deogen.",targets:['Deogen'],modes:['Professional','Nightmare','Insanity'],hook:{type:'require',id:'deogenNearSlow'}},
  {id:'tip_thaye',text:"Ouija age decreases and ghost slows over time → Thaye.",targets:['Thaye'],modes:['Professional','Nightmare','Insanity'],hook:{type:'require',id:'thayeAging'}},
  {id:'tip_yokai',text:"Talk near it; talk-triggered hunt + poor hearing in hunt → Yokai.",targets:['Yokai'],modes:['All'],hook:{type:'require',id:'yokaiTalk'}},
];

/* ---------- State & helpers ---------- */
const state = {
  yes: new Set(),
  no: new Set(),
  exclude: new Set(),
  require: new Set(),
  strictNo: false,
  filterSpeedChange: false,
  filterLoS: false,
  showRemoved: false,
  difficulty: 'Professional',
  dismissed: new Set(),
};


const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
const $make=(t,p={})=>Object.assign(document.createElement(t),p);

// Returns true if a ghost can change speed under any condition (LoS, temp, sanity, range, twin speeds, etc.)
function ghostHasSpeedChange(name){
  const d = SPEEDS[name];
  if(!d) return false;

  // Range (e.g., Hantu, Moroi, Deogen, Thaye) → has speed variance
  if (Array.isArray(d.range) && d.range.length === 2 && d.range[1] > d.range[0]) return true;

  // Two distinct fixed speeds (e.g., Twins)
  if (Array.isArray(d.pair) && d.pair.length >= 2) {
    const first = d.pair[0]?.speed;
    if (d.pair.some(p => p.speed !== first)) return true;
  }

  // LoS-style cap or special faster state (e.g., Jinn 2.5, Revenant 3.0, Raiju 2.5)
  if (typeof d.losCap === 'number' && typeof d.base === 'number' && d.losCap > d.base) return true;

  // Otherwise: no known speed change
  return false;
}


/* Toast (bright) */
function toastWithUndo(msg,undoFn){
  const box=document.createElement('div');
  Object.assign(box.style,{
    position:'fixed',left:'50%',bottom:'24px',transform:'translateX(-50%)',
    background:'#ffcc00',border:'2px solid #d4a017',color:'#222',
    padding:'10px 14px',fontWeight:'bold',fontSize:'14px',borderRadius:'8px',
    boxShadow:'0 6px 20px rgba(0,0,0,.35)',display:'flex',alignItems:'center',gap:'12px',zIndex:'2000'
  });
  const span=document.createElement('span'); span.textContent=msg;
  const undo=document.createElement('button'); undo.className='btn'; undo.textContent='Undo';
  Object.assign(undo.style,{background:'#222',color:'#fff',padding:'4px 10px',borderRadius:'4px'});
  undo.addEventListener('click',()=>{ try{undoFn?.()}finally{ box.remove(); }});
  box.append(span,undo); document.body.appendChild(box);
  setTimeout(()=>box.remove(),5000);
}
function flash(msg){ const b=document.createElement('div'); b.textContent=msg; Object.assign(b.style,{position:'fixed',left:'50%',bottom:'20px',transform:'translateX(-50%)',background:'#0f1722',border:'1px solid var(--border)',padding:'8px 12px',borderRadius:'8px',boxShadow:'0 6px 20px rgba(0,0,0,.35)',zIndex:2000}); document.body.appendChild(b); setTimeout(()=>b.remove(),3000); }

/* Build chips */
function buildChips(){
  const yesWrap=$('#evidence-yes'), noWrap=$('#evidence-no'), exWrap=$('#behaviour-exclude'), reqWrap=$('#behaviour-require');
  if(yesWrap && yesWrap.childElementCount===0) EVIDENCE.forEach(ev=> yesWrap.appendChild(chip(ev,'ev-yes')));
  if(noWrap && noWrap.childElementCount===0) EVIDENCE.forEach(ev=> noWrap.appendChild(chip(ev,'ev-no')));
  if(exWrap && exWrap.childElementCount===0) BEHAVIOURS.exclude.forEach(b=> exWrap.appendChild(behChip(b,'exclude')));
  if(reqWrap && reqWrap.childElementCount===0) BEHAVIOURS.require.forEach(b=> reqWrap.appendChild(behChip(b,'require')));
}
function chip(label,kind){
  const c=$make('label',{className:'chip',title:label}); const input=$make('input',{type:'checkbox'});
  input.addEventListener('change',()=>{ const tgt=(kind==='ev-yes')?state.yes:state.no; input.checked?tgt.add(label):tgt.delete(label); persist(); render(); });
  c.append(input,$make('span',{textContent:label})); return c;
}
function behChip(b,type){
  const c=$make('label',{className:'chip',title:b.tip}); const input=$make('input',{type:'checkbox'});
  input.addEventListener('change',()=>{ const tgt=(type==='exclude')?state.exclude:state.require; input.checked?tgt.add(b.id):tgt.delete(b.id); persist(); render(); });
  c.append(input,$make('span',{innerHTML:`<strong>${b.label}</strong>`})); return c;
}

/* LOS predicate */
function ghostHasLoSAccel(name){
  const d=SPEEDS[name]||SPEEDS.Standard;
  if(d.los===true) return true;
  if(d.fixed && d.fixed.some(f=>/line of sight/i.test(f.when||''))) return true;
  return false;
}

/* Filtering */
// Save if the box is ticked or not
let filterSpeedChange = false;

// Find the checkbox in the HTML
const speedChangeCheckbox = document.getElementById("filterSpeedChange");

// Watch for user clicking it
speedChangeCheckbox.addEventListener("change", () => {
  filterSpeedChange = speedChangeCheckbox.checked;
  renderGhosts(); // refresh the ghost list
});



function filterGhosts(){
  const reasons = new Map();

  // Build "require" pool (intersection of selected require sets)
  const reqSets = Array.from(state.require).map(id => {
    const item = BEHAVIOURS.require.find(x => x.id === id);
    return item && item.ghosts ? item.ghosts : [];
  });
  let requiredPool = null;
  if (reqSets.length) {
    requiredPool = new Set(reqSets[0]);
    for (let i = 1; i < reqSets.length; i++) {
      requiredPool = new Set([...requiredPool].filter(g => reqSets[i].includes(g)));
    }
  }

  const kept = [], eliminated = [];
  for (const g of GHOSTS){
    const why = [];

    // Require behaviors
    if (requiredPool && !requiredPool.has(g.name)) {
      why.push('Does not match selected hard tell(s)');
    }

    // Evidence YES must be present (Mimic exception for Orbs)
    const hasAllYes = Array.from(state.yes).every(ev =>
      g.ev.includes(ev) || (g.name === 'The Mimic' && ev === 'Ghost Orbs')
    );
    if (!hasAllYes) {
      const miss = Array.from(state.yes).filter(ev => !(g.ev.includes(ev) || (g.name === 'The Mimic' && ev === 'Ghost Orbs')));
      if (miss.length) why.push('Missing observed evidence: ' + miss.join(', '));
    }

    // Evidence NO (only if strictNo)
    if (state.strictNo) {
      const bad = Array.from(state.no).filter(ev => g.ev.includes(ev) && !(g.name==='The Mimic' && ev==='Ghost Orbs'));
      if (bad.length) why.push('Requires ruled-out evidence: ' + bad.join(', '));
    }

    // Exclude behaviours
    for (const b of BEHAVIOURS.exclude){
      if (state.exclude.has(b.id) && b.ghosts.includes(g.name)) {
        why.push('Ruled out by behavior: ' + b.label);
      }
    }

    // Speed-change filter
    if (state.filterSpeedChange && !ghostHasSpeedChange(g.name)) {
      why.push('Filtered out: no conditional speed change');
    }

    if (why.length) {
      eliminated.push(g);
      reasons.set(g.name, why);
    } else {
      kept.push(g);
    }
  }

  return { kept, removed: eliminated, reasons };
}

/* Grid & cards */
function metaRow(g){
  const wrap=$make('div',{className:'meta'}); g.ev.forEach(e=>{ const s=$make('span',{className:'ev',textContent:e}); s.setAttribute('data-cat','e'); wrap.appendChild(s); });
  if(g.name==='The Mimic'){ const s2=$make('span',{className:'ev',textContent:'+ Ghost Orbs (fake)'}); s2.setAttribute('data-cat','n'); wrap.appendChild(s2); }
  return wrap;
}

/* Plans */
const GHOST_PLAN_TEMPLATES={Spirit:['Smudge the ghost room and start a timer. If no hunt for ~3:00, strongly consider Spirit.','Repeat later to confirm cooldown behavior.'],Wraith:['Lay 2–3 salt lines at doorways/paths; sweep with UV. Any disturbance/footprints rules out Wraith.','Watch for teleport EMF: random spike near a player away from room.'],Phantom:['During an appearance, take a photo. If the model vanishes in the photo, it\'s Phantom.','Note slower blink during hunts.'],Poltergeist:['Bait a pile of small items and provoke. A multi-object throw burst indicates Poltergeist.','Frequent throws even at high sanity support it.'],Banshee:['Use a parabolic mic; listen for the unique high-pitched scream.','In multiplayer, watch if it prefers one target.'],Jinn:['Keep breaker ON. If it turns the fuse box OFF directly, rule out Jinn.','Speed check at range with LoS while power ON.'],Mare:['Toggle a room light. If the ghost turns a light ON, rule out Mare.','Work in darkness to see if events/hunts ramp up.'],Revenant:['Speed test: very slow with no LoS; extremely fast when it sees you.','Break LoS and listen for dramatic speed change.'],Shade:['Be near the room: fewer events and later hunts suggest Shade.','Compare activity rate to other candidates.'],Demon:['Expect early hunts; smudge hunt-block window is shorter than normal.','Use crucifixes to gauge early hunt attempts.'],Yurei:['Look for the strong sanity drain door slam event.','Smudge the room to lock it briefly; observe reduced wandering.'],Oni:['No airball events. Seeing an airball rules out Oni.','Often more visible during events.'],Yokai:['Provoke by talking; talk-triggered hunts at higher sanity suggest Yokai.','During hunts, talk close — reduced hearing radius is a tell.'],Hantu:['With power off/cold rooms, note frosty breath and faster movement in cold areas.','Hantu will not turn the breaker ON.'],Goryo:['Place DOTS and watch via video for 1–2 minutes. DOTS only on camera indicates Goryo.','Goryo rarely strays far from its room.'],Myling:['During hunts, footsteps are much quieter than other sounds; compare on parabolic.','High parabolic activity outside hunts.'],Onryo:['Set 2–3 candles in the room. A hunt immediately after a blow-out suggests Onryo.','Candles can delay hunts — watch blow-out/hunt sequence.'],'The Twins':['Look for two interaction spots around the same time.','Speed variance across hunts can indicate Twins.'],Raiju:['Cluster active electronics near you; if it sprints near electronics, consider Raiju.','Lowered hunt threshold: test items on vs off.'],Obake:['Inspect fingerprints closely for 6-finger/odd prints; prints may fade faster or not appear.','Track print variations across doors/switches.'],'The Mimic':['Remember it always shows (fake) Orbs in addition to its 3 evidences.','It can copy others’ behaviours — verify evidence combos carefully.'],Moroi:['Spirit Box/parabolic responses can “curse” you (faster sanity drain).','Smudge blindness lasts longer once it hunts.'],Deogen:['Distinct Spirit Box heavy breathing.','Very fast at range, slows to a crawl when near.'],Thaye:['Very active and fast early; slows with time. Check Ouija “age” now and later.','Compare activity trend over ~10 minutes.']};
function generateLocalPlans(kept){ const plans=[]; const diffs=[]; kept.forEach(g=>{ const t=(GHOST_PLAN_TEMPLATES[g.name]||[]); if(t[0]) diffs.push({ghost:g.name,step:t[0]}); }); const seen=new Set(); const combined=diffs.filter(x=>{ if(seen.has(x.step)) return false; seen.add(x.step); return true; }); plans.push({title:`Quick differentials for ${kept.length} ghosts`,steps:combined.map((x,i)=>`${i+1}. ${x.step} (targets ${x.ghost})`)}); kept.forEach(g=>{ const steps=(GHOST_PLAN_TEMPLATES[g.name]||[]).slice(0,5); if(steps.length) plans.push({title:`Confirm / rule ${g.name}`,steps:steps.map((s,i)=>`${i+1}. ${s}`)}); }); return plans; }
function renderPlans(plans){ const wrap=$('#plansOut'); if(!wrap) return; wrap.innerHTML=''; plans.forEach(p=>{ const card=document.createElement('div'); card.style.border='1px solid var(--border)'; card.style.background='#0f1722'; card.style.borderRadius='10px'; card.style.padding='10px 12px'; const h=document.createElement('div'); h.style.fontWeight='600'; h.style.marginBottom='6px'; h.textContent=p.title; const ul=document.createElement('ul'); ul.style.margin='0'; ul.style.paddingLeft='18px'; p.steps.forEach(s=>{ const li=document.createElement('li'); li.textContent=s; ul.appendChild(li); }); card.append(h,ul); wrap.appendChild(card); }); const panel=$('#planPanel'); if(panel) panel.hidden=plans.length===0; }

/* Hunt thresholds */
const HUNT_TRAITS={Demon:["Hunts at ~70% sanity (early hunter).","Smudge hunt block ~60s (shorter)."],Mare:["~60% in darkness / ~40% in lit room.","Prefers dark; won’t turn lights ON."],Yokai:["Up to ~80% if players are talking nearby.","Reduced hearing during hunts."],Raiju:["~65% near ACTIVE electronics.","Moves faster near electronics."],Thaye:["Ages from 75% ↓ 15% (about -6% per age).","Activity & speed reduce as it ages."],Shade:["Late hunter: ~35% threshold.","Reluctant to hunt with players in the room."],Deogen:["Fixed low threshold: ~40%.","Very fast at range; crawls when close."],Onryo:["~60% normally; ~40% near a flame.","Candle/flame blows can trigger hunts."],Spirit:["Standard ~50% threshold.","Smudge hunt block ~3:00 (Spirit test)."],Hantu:["Standard ~50% threshold.","Faster in cold; cannot turn breaker ON."],Revenant:["Standard ~50% threshold.","Very slow off-LoS, very fast on-LoS."],Banshee:["Standard ~50% threshold.","Targets a single player (scream tell)."],Goryo:["Standard ~50% threshold.","Camera-only DOTS tell."],Jinn:["Standard ~50% threshold.","Faster at range with LoS while power ON."],Poltergeist:["Standard ~50% threshold.","Multi-object throw bursts."],Phantom:["Standard ~50% threshold.","Invisible in photos; slow blink hunts."],Wraith:["Standard ~50% threshold.","Never steps in salt; teleport EMF."],Myling:["Standard ~50% threshold.","Quieter footsteps during hunts."],Yurei:["Standard ~50% threshold.","Strong sanity drain door slam event."],Oni:["Standard ~50% threshold.","No airball events; more visible."],"The Twins":["Standard ~50% threshold.","Dual interactions; varied hunt speed."],Obake:["Standard ~50% threshold.","6-finger/odd prints; fast-fading."],"The Mimic":["Standard ~50% threshold (plus fake Orbs).","Can copy other behaviours (threshold varies)."],Moroi:["Standard ~50% threshold (effective earlier when cursed).","Box/parabolic curse speeds sanity drain."]};
function updateThresholds(kept){ const rows=$('#thresholdRows'); if(!rows) return; rows.innerHTML=''; if(!kept.length){ const d=document.createElement('div'); d.className='row'; d.innerHTML='<div class="left">No candidates</div><div class="right">Add or clear filters to see hunt guidance.</div>'; rows.appendChild(d); return; } kept.slice(0,12).forEach(g=>{ const r=document.createElement('div'); r.className='row clickable'; r.title='Click for ghost details'; r.addEventListener('click',()=>showGhost(g.name)); const left=document.createElement('div'); left.className='left'; left.textContent=g.name; const right=document.createElement('div'); right.className='right'; const traits=HUNT_TRAITS[g.name]||['Standard ~50% hunt threshold.']; right.innerHTML=traits.map(t=>`<span class="pill-b">${t}</span>`).join(' '); r.append(left,right); rows.appendChild(r); }); }

/* Tips */
function isHookActive(hook){ if(!hook) return false; if(hook.type==='require') return state.require.has(hook.id); if(hook.type==='exclude') return state.exclude.has(hook.id); return false; }
function applyHook(hook,active){ if(hook?.type==='require'){ active?state.require.add(hook.id):state.require.delete(hook.id);} else if(hook?.type==='exclude'){ active?state.exclude.add(hook.id):state.exclude.delete(hook.id);} }
function updateSmartTips(kept){
  const list=$('#tipsList'); const meta=$('#tipsMeta'); if(list) list.innerHTML='';
  const mode=state.difficulty, cfg=DIFFICULTY[mode]||DIFFICULTY.Professional;
  updateThresholds(kept);
  if(meta) meta.innerHTML=`— <span class="banner">${mode}: ${cfg.notes}</span>`;
  const tipBox=$('#tipsList'); if(!tipBox) return;
  (MODE_TIPS[mode]||[]).slice(0,2).forEach(t=>{ const li=document.createElement('li'); li.textContent=t; tipBox.appendChild(li); });
  if(!kept.length) return;
  const keptNames=new Set(kept.map(g=>g.name));
  const filtered=SMART_TIPS.filter(t=> (t.modes?.includes('All')||t.modes?.includes(mode)) );
  const scored=filtered.map(t=>({tip:t,overlap:t.targets.filter(x=>keptNames.has(x))})).filter(x=>x.overlap.length>0).sort((a,b)=>b.overlap.length-a.overlap.length).slice(0,6);
  scored.forEach(({tip,overlap})=>{
    const li=document.createElement('li');
    li.innerHTML=`${tip.text} <span class="pill">Targets: ${overlap.join(', ')}</span>`;
    if(tip.hook){
      const btn=document.createElement('button'); btn.className='btn'; btn.style.marginLeft='8px';
      const setLabel=()=> btn.textContent = isHookActive(tip.hook)?'Unmark':'Mark observed';
      setLabel();
      btn.addEventListener('click',()=>{
        const was=isHookActive(tip.hook);
        applyHook(tip.hook,!was); persist(); render();
        toastWithUndo(was?'Unmarked.':'Marked observed.',()=>{ applyHook(tip.hook,was); persist(); render(); });
      });
      li.appendChild(btn);
    }
    tipBox.appendChild(li);
  });
}

/* Render */

// injected: polished X-button styles (light pill)
(function ensureDismissStylesLite(){
  if (document.getElementById('dismissStylesLite')) return;
  const st = document.createElement('style'); st.id='dismissStylesLite';
  st.textContent = `
  .ghost, .ghost.clickable{ position:relative; }
  .ghost-dismiss{
    position:absolute; top:8px; right:8px;
    width:22px; height:22px;
    display:grid; place-items:center;
    padding:0; border:0; border-radius:6px;
    background: rgba(255,255,255,0.10);
    cursor:pointer; transition:background .15s ease, transform .06s ease;
  }
  .ghost-dismiss:hover{ background: rgba(255,255,255,0.25); }
  .ghost-dismiss:active{ transform: translateY(1px); }
  .ghost-dismiss svg{ pointer-events:none; opacity:.9; }
  .ghost.is-dismissed{ opacity:.38; filter:grayscale(.6); }
  `;
  document.head.appendChild(st);
})();

// Visual helper: ensure dimming works even if CSS doesn't match
function applyDismissVisual(card, on){
  if (!card) return;
  card.classList.toggle('is-dismissed', !!on);
  card.style.opacity = on ? '0.35' : '';
  card.style.filter  = on ? 'grayscale(0.6)' : '';
}
function render(){
  const {kept,removed,reasons}=filterGhosts();

  const count=$('#count');
  if(count) count.textContent=kept.length;

  const grid=$('#grid');
  if(grid){
    grid.innerHTML='';
    const solvedName = kept.length===1 ? kept[0].name : null;

    (kept.length?kept:GHOSTS).forEach(g=>{
      const card=$make('div',{className:'card ghost clickable'});
      card.addEventListener('click',()=>showGhost(g.name));
	  
	  
      // mark-off button (×)
let isOff = state.dismissed.has(g.name);
if (isOff) card.classList.add('is-dismissed');
const xbtn = $make('button',{className:'ghost-dismiss', title: isOff ? 'Unmark' : 'Mark off'});
xbtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7A1 1 0 0 0 5.7 7.1L10.6 12l-4.9 4.9a1 1 0 1 0 1.4 1.4L12 13.4l4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4z"></path></svg>`;

      xbtn.dataset.name = g.name;
      xbtn.addEventListener('click',(e)=>{ e.stopPropagation(); const nm=e.currentTarget.dataset.name; if(state.dismissed.has(nm)) state.dismissed.delete(nm); else state.dismissed.add(nm); try{persist&&persist();}catch{} applyDismissVisual(card, state.dismissed.has(nm)); });
      card.appendChild(xbtn);

      // Build pieces in order
      const h   = $make('h4',{textContent:g.name});
      const meta= metaRow(g);
      const note= $make('div',{className:'note',innerHTML:g.notes.map(n=>`• ${n}`).join('<br>')});

      // Optional solved banner (rename from "prompt" -> "solvedBanner")
      let solvedBanner=null;
      if(g.name===solvedName){
        card.classList.add('solved');
        solvedBanner = $make('div',{className:'solvedPrompt'});
        const dot = $make('span',{className:'pulse'});
        const txt = $make('span',{innerHTML:'✅ Candidate found — <u>click to double-check evidence</u>'});
        solvedBanner.append(dot,txt);
      }

      // Ensure banner is placed AFTER the evidence row to avoid overlap
      if(solvedBanner){
        card.append(h, meta, solvedBanner, note);
      }else{
        card.append(h, meta, note);
      }

      grid.appendChild(card);
    });

    const btn=$('#planBtn');
    if(btn){
      if(kept.length>0 && kept.length<=5){
        btn.disabled=false; btn.title='Generate strategies for the remaining ghosts';
      }else{
        btn.disabled=true; btn.title='Add filters until 5 or fewer ghosts remain';
        const panel=$('#planPanel'); if(panel) panel.hidden=true;
        const out=$('#plansOut'); if(out) out.innerHTML='';
      }
    }
  }

  // Eliminated list
  const removedBox=$('#removedBox');
  if(removedBox){
    removedBox.hidden=!state.showRemoved;
    const list=$('#removedList');
    if(list){
      list.innerHTML='';
      if(state.showRemoved){
        removed.forEach(g=>{
          const r=$make('div',{className:'reason clickable'});
          r.addEventListener('click',()=>showGhost(g.name));
          r.innerHTML=`<strong>${g.name}</strong><br>${(reasons.get(g.name)||[]).map(s=>'— '+s).join('<br>')}`;
          list.appendChild(r);
        });
      }
    }
  }

  updateSmartTips(kept.length?kept:GHOSTS);
  persist();
}



/* Smudge timer */
let smudgeT=null, smudgeStartAt=0, smudgeDur=90;
const fmt=s=>{const m=Math.floor(s/60),ss=Math.max(0,Math.floor(s%60));return `${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`};
function pickPreset(){ const el=$('#smudgePreset'); if(!el) return 90; const val=el.value; if(val==='custom'){ const c=$('#smudgeCustom'); if(c) c.style.display='inline-block'; return null; } const c=$('#smudgeCustom'); if(c) c.style.display='none'; return Number(val); }
function updateSmudgeUI(remaining){ const t=$('#smudgeTime'); if(t) t.textContent=fmt(remaining); const bar=$('#smudgeBar'); if(bar){ const pct=Math.max(0,Math.min(100,100-(remaining/smudgeDur)*100)); bar.style.width=pct+'%'; } }
function startSmudge(){ const p=pickPreset(); smudgeDur=p ?? Number(($('#smudgeCustom')?.value)||90); smudgeStartAt=Date.now(); $('#smudgeStart')?.setAttribute('disabled',''); $('#smudgeStop')?.removeAttribute('disabled'); tickSmudge(); }
function stopSmudge(){ if(smudgeT){ cancelAnimationFrame(smudgeT); smudgeT=null; } $('#smudgeStart')?.removeAttribute('disabled'); $('#smudgeStop')?.setAttribute('disabled',''); }
function resetSmudge(){ stopSmudge(); updateSmudgeUI(smudgeDur); }
function tickSmudge(){ const elapsed=(Date.now()-smudgeStartAt)/1000; const remaining=Math.max(0,smudgeDur-elapsed); updateSmudgeUI(remaining); if(remaining<=0){ stopSmudge(); flash('⏱️ Smudge window complete. If a hunt starts soon after, it is likely NOT a Spirit.'); return; } smudgeT=requestAnimationFrame(tickSmudge); }

/* Ghost modal data blocks */
const GHOST_EXTRA={Spirit:["Smudge prevents hunts for ~3:00 (longest).","Standard speed; no unique hunt sound."],Wraith:["Never steps in salt; no UV footprints.","Can teleport to a player causing remote EMF."],Phantom:["Disappears in photos (model vanishes).","Slower blink rate during hunts."],Poltergeist:["Can throw multiple objects at once (burst).","More frequent throwing behaviour."],Banshee:["Targets a single player; parabolic 'scream' sound.","Often paths toward its target."],Jinn:["Faster when far with LoS and power ON.","Cannot directly turn the fuse box OFF (can overload)."],Mare:["Prefers darkness; won’t turn lights ON.","Higher hunt chance in the dark."],Revenant:["Very slow off-LoS; extremely fast on-LoS.","Distinct speed change when it sees you."],Shade:["Shy ghost; fewer events with nearby players.","Reluctant to hunt with players in same room."],Demon:["Earliest hunter; short smudge protection (~60s).","Can attempt hunts aggressively."],Yurei:["Door slam sanity drain event.","Smudging room can lock it briefly."],Oni:["No airball events.","More visible during events; higher activity near players."],Yokai:["Talking can trigger hunts; reduced hearing while hunting.","Must be close to hear you during hunts."],Hantu:["Faster in cold; visible frosty breath during hunts in cold.","Will not turn the breaker ON."],Goryo:["DOTS only visible on camera; rarely roams far.","Best tested with cam watching DOTS."],Myling:["Quieter footsteps vs other sounds during hunt.","Active on parabolic outside hunts."],Onryo:["Flame mechanics: blow-outs can trigger hunts; candles can delay.","Track blow-out → hunt sequence."],"The Twins":["Two interaction spots; varied hunt speeds.","EMF in two places can occur."],Raiju:["Faster near active electronics; lower hunt threshold near electronics.","Disable devices to test speed change."],Obake:["6-finger/odd fingerprints; prints may fade fast or be missing.","Check multiple surfaces for variation."],"The Mimic":["Always shows fake Orbs plus its 3 evidences.","Can copy behaviours of others."],Moroi:["Spirit Box/parabolic can 'curse' you → faster sanity drain.","Longer smudge blindness after it starts hunting."],Deogen:["Very fast at range, slows to a crawl when close.","Distinct heavy-breathing Spirit Box."],Thaye:["Starts fast/active then ages to slow/inactive.","Ouija 'age' decreases over time."]};
function speedSummaryFor(name) {
  const d = SPEEDS[name] || SPEEDS.Standard;
  const parts = [];

  if (d.pair) {
    const p = d.pair.map(x => `${x.label}: ${x.speed.toFixed(2)} m/s`).join(' | ');
    parts.push(`Dual speeds — ${p}`);
    if (d.los) parts.push(`Gains speed with line of sight (keep breaking LoS).`);
  } else if (d.range) {
    parts.push(`Speed range: ${d.range[0].toFixed(2)}–${d.range[1].toFixed(2)} m/s.`);
    if (d.los) parts.push(`Can increase further when it maintains line of sight.`);
  } else {
    parts.push(`Base: ${d.base.toFixed(2)} m/s.`);
    if (d.los && d.losCap) {
      parts.push(`Can accelerate under line of sight up to ~${d.losCap.toFixed(2)} m/s.`);
    }
  }

  if (d.fixed && d.fixed.length) {
    d.fixed.forEach(f =>
      parts.push(`Fixed ${f.speed.toFixed(2)} m/s ${f.when ? `(${f.when})` : ''}.`)
    );
  }

  if (d.los === false && !d.range && !d.fixed) {
    parts.push(`No line-of-sight acceleration.`);
  }

  if (d.notes?.length) parts.push(...d.notes);

  return parts;
}


/* Modal spacing adjuster */
function adjustModalSpacing(){
  const head=$('#ghostModal .gm-head'), title=$('#gm-title'), evBox=$('#gm-ev'), body=$('#ghostModal .gm-body');
  if(!head||!title||!evBox||!body) return;
  const sameLine=Math.abs(evBox.getBoundingClientRect().top - title.getBoundingClientRect().top) < 8;
  head.style.paddingBottom = sameLine ? '22px' : '12px';
  body.style.paddingTop = '16px';
}

/* Modal show */
function showGhost(name){
  const g = GHOSTS.find(x => x.name === name);
  if (!g) return;
  const modal = document.getElementById('ghostModal');
  const title = document.getElementById('gm-title');
  const evBox = document.getElementById('gm-ev');
  const th = document.getElementById('gm-th');
  const traits = document.getElementById('gm-traits');
  const plan = document.getElementById('gm-plan');

  title.textContent = g.name;
  evBox.innerHTML = g.ev.map(e => `<span class="ev">${e}</span>`).join('');

  const d = (typeof GHOST_DETAILS!=='undefined' && GHOST_DETAILS[g.name]) || null;
  if (d){
    const speed = formatSpeedSummary(g.name);
    th.innerHTML = `<div class="muted">${d.threshold}${speed? ' • '+speed : ''}</div>`;
    const abil = (d.abilities||[]).map(t => `<li>${t}</li>`).join('');
    const tests = (d.tests||[]).map(t => `<li>${t}</li>`).join('');
    traits.innerHTML = d.traits.map(t => `<li>${t}</li>`).join('')
      + (abil ? `<li><strong>Abilities:</strong><ul>${abil}</ul></li>` : '')
      + (tests ? `<li><strong>Field tests:</strong><ul>${tests}</ul></li>` : '');
    plan.innerHTML = (d.strategy||[]).map(s => `<li>${s}</li>`).join('');
  } else {
    th.innerHTML = `<div class="muted">Details coming soon</div>`;
    traits.innerHTML = "";
    plan.innerHTML = "";
  }

  if (modal && typeof modal.showModal === 'function') modal.showModal();
  else if (modal) modal.setAttribute('open','');
}
$('#gm-close')?.addEventListener('click',()=>{ const modal=$('#ghostModal'); if(typeof modal?.close==='function'){ modal.close(); } else { modal?.removeAttribute('open'); } });

/* Persistence & UI */
function persist(){
  const obj = {
    yes:[...state.yes], no:[...state.no],
    exclude:[...state.exclude], require:[...state.require],
    strictNo:state.strictNo, showRemoved:state.showRemoved,
    difficulty:state.difficulty,
      dismissed:[...state.dismissed],
    dismissed:[...state.dismissed],
    filterSpeedChange: state.filterSpeedChange,  // NEW
    compact: !!document.getElementById('compactToggle')?.checked,
    collapse: !!document.getElementById('collapseAll')?.checked
  };
  localStorage.setItem('phasmo-filter-v1', JSON.stringify(obj));
}
function restore(){
  try{
    const raw = localStorage.getItem('phasmo-filter-v1'); if(!raw) return;
    const o = JSON.parse(raw);
    state.yes = new Set(o.yes||[]);
    state.no = new Set(o.no||[]);
    state.exclude = new Set(o.exclude||[]);
    state.require = new Set(o.require||[]);
    state.strictNo = !!o.strictNo;
    state.showRemoved = !!o.showRemoved;
    state.difficulty = o.difficulty || 'Professional';
    state.dismissed = new Set(o.dismissed || []);

    // Migrate old flag if present
    state.filterSpeedChange = ('filterSpeedChange' in o)
      ? !!o.filterSpeedChange
      : !!o.filterLoS;

    $('#difficulty').value = state.difficulty;
    const cb = document.getElementById('filterSpeedChange');
    if (cb) cb.checked = state.filterSpeedChange;
    try{
      const cpt = document.getElementById('compactToggle');
      const col = document.getElementById('collapseAll');
      if (cpt) { cpt.checked = !!o.compact; document.body.classList.toggle('compact', !!o.compact); }
      if (col) { col.checked = !!o.collapse; document.querySelectorAll('#filtersRoot details.group').forEach(d=> d.open = !o.collapse); }
    }catch{}

  }catch{}
  // hydrate chips (unchanged) ...
}

function restoreFromHash(){
  if(!location.hash) return false;
  try{
    const o = JSON.parse(decodeURIComponent(atob(location.hash.slice(1))));
    state.yes = new Set(o.y||[]);
    state.no = new Set(o.n||[]);
    state.exclude = new Set(o.x||[]);
    state.require = new Set(o.r||[]);
    state.strictNo = !!o.sn;
    state.showRemoved = !!o.sr;
    state.difficulty = o.d || 'Professional';

    // New key `sc`; fall back to old `l`
    state.filterSpeedChange = ('sc' in o) ? !!o.sc : !!o.l;

    $('#difficulty').value = state.difficulty;
    const cb = document.getElementById('filterSpeedChange');
    if (cb) cb.checked = state.filterSpeedChange;
    try{
      const cpt = document.getElementById('compactToggle');
      const col = document.getElementById('collapseAll');
      if (cpt) { cpt.checked = !!o.compact; document.body.classList.toggle('compact', !!o.compact); }
      if (col) { col.checked = !!o.collapse; document.querySelectorAll('#filtersRoot details.group').forEach(d=> d.open = !o.collapse); }
    }catch{}

    return true;
  }catch{
    return false;
  }
}



/* Events */
$('#difficulty')?.addEventListener('change',e=>{ state.difficulty=e.target.value; const cfg=DIFFICULTY[state.difficulty]; const strict=$('#strictNo'); if(strict){ strict.checked=state.strictNo=cfg.strictNoDefault; } persist(); render(); });
$('#compactToggle')?.addEventListener('change',e=>{ document.body.classList.toggle('compact',e.target.checked); persist(); });
$('#collapseAll')?.addEventListener('change',e=>{ $$('#filtersRoot details.group').forEach(d=> d.open=!e.target.checked ); persist(); });
$('#strictNo')?.addEventListener('change',e=>{ state.strictNo=e.target.checked; persist(); render(); });
$('#showRemoved')?.addEventListener('change',e=>{ state.showRemoved=e.target.checked; persist(); render(); });
$('#reset')?.addEventListener('click',()=>{ state.yes.clear(); state.no.clear(); state.exclude.clear(); state.require.clear(); const cfg=DIFFICULTY[state.difficulty]; state.strictNo=cfg.strictNoDefault; const strict=$('#strictNo'); if(strict) strict.checked=state.strictNo; $$('#filtersRoot .chip input').forEach(i=>i.checked=false); persist(); render(); });
$('#copy')?.addEventListener('click',()=>{ const {kept}=filterGhosts(); const txt=kept.map(g=>g.name).join(', '); navigator.clipboard.writeText(txt).then(()=>flash('Copied remaining ghosts')); });
$('#share').addEventListener('click',()=>{
  const obj = {
    y:[...state.yes], n:[...state.no], x:[...state.exclude], r:[...state.require],
    sn:state.strictNo, sr:state.showRemoved,
    d:state.difficulty, sc:state.filterSpeedChange,
    ct: !!document.getElementById('compactToggle')?.checked,
    ca: !!document.getElementById('collapseAll')?.checked
  };
  const s = btoa(encodeURIComponent(JSON.stringify(obj)));
  location.hash = s;
  navigator.clipboard.writeText(location.href).then(()=>flash('Shareable link copied'));
});

$('#planBtn')?.addEventListener('click',()=>{ const {kept}=filterGhosts(); const plans=generateLocalPlans(kept); renderPlans(plans); const panel=$('#planPanel'); if(panel){ panel.hidden=false; panel.scrollIntoView({behavior:'smooth',block:'start'}); } });

/* Speed-change filter checkbox */
$('#filterSpeedChange')?.addEventListener('change',e=>{ state.filterSpeedChange=e.target.checked; persist(); render(); });

/* Smudge controls */
$('#smudgePreset')?.addEventListener('change',()=>{ const p=pickPreset(); if(p!=null){ smudgeDur=p; updateSmudgeUI(smudgeDur); } });
$('#smudgeStart')?.addEventListener('click',startSmudge);
$('#smudgeStop')?.addEventListener('click',stopSmudge);
$('#smudgeReset')?.addEventListener('click',resetSmudge);
updateSmudgeUI(smudgeDur);

/* Hard Reset button (in filters .btn-row) */
(function injectHardReset(){
  const row=document.querySelector('.btn-row'); if(!row || document.getElementById('hardResetBtn')) return;
  const btn=document.createElement('button'); btn.id='hardResetBtn'; btn.className='btn danger'; btn.title='Clear ALL saved data & reload'; btn.textContent='Reset ALL';
  btn.addEventListener('click',()=>{ if(!confirm('Reset ALL settings and saved data? This will clear local storage and share links.')) return;
    try{ localStorage.removeItem('phasmo-filter-v1'); localStorage.removeItem('phasmo-filter-order-v1'); for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(k && /^phasmo-/.test(k)){ localStorage.removeItem(k); i--; } } }catch{}
    if(location.hash){ history.replaceState(null,'',location.pathname+location.search); }
    location.reload();
  });
  row.appendChild(btn);
})();

/* Init */
buildChips();
const loadedFromHash=restoreFromHash(); if(!loadedFromHash){ restore(); }
if(!localStorage.getItem('phasmo-filter-v1') && !loadedFromHash){ const cfg=DIFFICULTY[state.difficulty]; state.strictNo=cfg.strictNoDefault; }
const strict=$('#strictNo'); if(strict) strict.checked=state.strictNo;
render();

document.addEventListener('DOMContentLoaded', () => {
  // Delegated handler for ghost-dismiss so it survives re-renders
  const __grid = document.getElementById('grid');
  if (__grid && !__grid.__dismissBound){
    __grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.ghost-dismiss');
      if (!btn) return;
      e.stopPropagation();
      const name = btn.dataset.name || btn.getAttribute('data-name');
      if (!name || !window.state || !state.dismissed) return;
      if (state.dismissed.has(name)) state.dismissed.delete(name);
      else state.dismissed.add(name);
      try { persist && persist(); } catch {}
      try { render && render(); } catch {}
    }, true);
    __grid.__dismissBound = true;
  }

});


// Ensure every ghost card has a dismiss button after render
(function ensureDismissButtonsSetup(){
  function addButtons(){
    const cards = document.querySelectorAll('.ghost');
    cards.forEach(card => {
      if (card.querySelector('.ghost-dismiss')) return;
      const name = card.getAttribute('data-name') || (card.querySelector('.head h4')?.textContent || '').trim();
      if (!name) return;
      const btn = document.createElement('button');
      btn.className = 'ghost-dismiss';
      btn.dataset.name = name;
      const marked = (window.state && state.dismissed && state.dismissed.has(name));
      btn.setAttribute('aria-label', marked ? 'Unmark' : 'Mark off');
      btn.setAttribute('title', marked ? 'Unmark' : 'Mark off');
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7A1 1 0 0 0 5.7 7.1L10.6 12l-4.9 4.9a1 1 0 1 0 1.4 1.4L12 13.4l4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4z"></path></svg>';
      card.prepend(btn);
      if (marked) card.classList.add('is-dismissed');
    });
  }

  if (typeof window.render === 'function' && !window.__renderWrappedForDismiss){
    const __orig = window.render;
    window.render = function(){
      const out = __orig.apply(this, arguments);
      try { requestAnimationFrame(addButtons); } catch { addButtons(); }
      return out;
    };
    window.__renderWrappedForDismiss = true;
    try { addButtons(); } catch {}
  }

  const grid = document.getElementById('grid');
  if (grid && !grid.__dismissObserver){
    const mo = new MutationObserver(() => { addButtons(); });
    mo.observe(grid, { childList: true, subtree: true });
    grid.__dismissObserver = mo;
  }
})();



/* ======================================================
   Patch: Robust "mark off (X)" toggle that always works
   - Adds a top-right X button to every ghost card (.ghost)
   - Clicking toggles a persistent .is-dismissed class
   - Works across renders/filters without touching your logic
   ====================================================== */
(function(){
  if (window.__dismissPatched) return;
  window.__dismissPatched = true;

  // 1) Ensure state and state.dismissed exist
  try { window.state = window.state || {}; } catch(e){ window.state = {}; }
  if (!(state.dismissed instanceof Set)) state.dismissed = new Set(Array.isArray(state.dismissed) ? state.dismissed : []);

  // 2) Style injector (safe to run multiple times)
  function ensureDismissStylesLite(){
    if (document.getElementById('dismissStylesLite')) return;
    const st = document.createElement('style'); st.id='dismissStylesLite';
    st.textContent = `
      .ghost, .ghost.clickable{ position:relative; }
      .ghost-dismiss{
        position:absolute; top:8px; right:8px;
        width:22px; height:22px;
        display:grid; place-items:center;
        padding:0; border:0; border-radius:6px;
        background: rgba(255,255,255,0.10);
        cursor:pointer; transition:background .15s ease, transform .06s ease;
      }
      .ghost-dismiss:hover{ background: rgba(255,255,255,0.25); }
      .ghost-dismiss:active{ transform: translateY(1px); }
      .ghost-dismiss svg{ pointer-events:none; opacity:.9; }
      .ghost.is-dismissed{ opacity:.38; filter:grayscale(.6); }
    `;
    document.head.appendChild(st);
  }

  const X_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7A1 1 0 0 0 5.7 7.1L10.6 12l-4.9 4.9a1 1 0 1 0 1.4 1.4L12 13.4l4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4z"></path></svg>';

  // 3) Persistence helpers (augment existing persist/restore if present)
  const _persist  = typeof window.persist  === 'function' ? window.persist  : null;
  const _restore  = typeof window.restore  === 'function' ? window.restore  : null;
  const STORAGE_KEY = 'phasmo-filter-v1';

  function saveDismissed(){
    try{
      // Call original persist (so you don't lose other fields)
      if (_persist) _persist();
      // Merge dismissed into the same object
      const raw = localStorage.getItem(STORAGE_KEY);
      const o = raw ? JSON.parse(raw) : {};
      o.dismissed = Array.from(state.dismissed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(o));
    }catch(e){ /* no-op */ }
  }

  function loadDismissed(){
    try{
      if (_restore) _restore(); // let original restore its stuff first
    }catch(e){ /* ignore */ }
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const o = JSON.parse(raw);
      if (o && Array.isArray(o.dismissed)) state.dismissed = new Set(o.dismissed);
    }catch(e){ /* ignore */ }
  }

  // 4) Toggle + apply
  function applyDismiss(card, on){
    if (!card) return;
    card.classList.toggle('is-dismissed', !!on);
  }

  function toggleByName(name, card){
    if (!name) return;
    if (state.dismissed.has(name)) state.dismissed.delete(name);
    else state.dismissed.add(name);
    applyDismiss(card, state.dismissed.has(name));
    saveDismissed();
  }

  // 5) Ensure every card has a button, and classes match state
  function ensureButtons(){
    ensureDismissStylesLite();
    const grid = document.getElementById('grid');
    if (!grid) return;

    const cards = grid.querySelectorAll('.ghost');
    cards.forEach(card => {
      const name = (card.querySelector('h4')?.textContent || '').trim();
      if (!name) return;

      // Add / update button
      let btn = card.querySelector('.ghost-dismiss');
      if (!btn){
        btn = document.createElement('button');
        btn.className = 'ghost-dismiss';
        btn.title = state.dismissed.has(name) ? 'Unmark' : 'Mark off';
        btn.innerHTML = X_SVG;
        btn.dataset.name = name;
        btn.addEventListener('click', (e)=>{ e.stopPropagation(); toggleByName(name, card); });
        card.appendChild(btn);
      }else{
        btn.dataset.name = name;
      }

      // Apply current state
      applyDismiss(card, state.dismissed.has(name));
    });
  }

  // 6) Patch render() to run our ensureButtons() after every render
  const _render = typeof window.render === 'function' ? window.render : null;
  if (_render){
    window.render = function(){
      const out = _render.apply(this, arguments);
      try { ensureButtons(); } catch(e){}
      return out;
    };
  } else {
    // If render is not ready yet, run once after DOMContentLoaded and then periodically
    document.addEventListener('DOMContentLoaded', ensureButtons);
    const iv = setInterval(() => {
      try{ ensureButtons(); if (document.getElementById('grid')?.children?.length) clearInterval(iv); }catch{}
    }, 250);
  }

  // 7) Setup a single delegated handler just in case
  document.addEventListener('click', function(e){
    const btn = e.target.closest?.('.ghost-dismiss');
    if (!btn) return;
    e.stopPropagation();
    const grid = document.getElementById('grid');
    const card = btn.closest('.ghost');
    const name = btn.dataset.name || (card?.querySelector('h4')?.textContent || '').trim();
    toggleByName(name, card);
  }, true);

  // 8) Restore on load
  try { loadDismissed(); } catch(e){}
})();


// --- Top banner close (no persistence) ---
document.addEventListener('DOMContentLoaded', () => {
  const banner = document.getElementById('siteBanner');
  const btn = document.getElementById('bannerClose');
  if (btn && banner && !btn.__bound) {
    btn.addEventListener('click', () => {
      banner.style.display = 'none';
    });
    btn.__bound = true;
  }
});



/* ======================================================
   Patch 2: Share + Restore checkbox states, and default groups
   - Ensures share links carry: ct (compact), ca (collapse all),
     sr (show removed), sc (speed change), sn (strict no), d (difficulty)
   - Applies those states on restoreFromHash
   - At startup, only opens the "Observed Evidence" group
   ====================================================== */
(function(){
  // Helper: read current checkbox states safely
  function _readCheckboxes(){
    const el = (id)=> document.getElementById(id);
    return {
      ct: !!el('compactToggle')?.checked,
      ca: !!el('collapseAll')?.checked,
      sr: !!el('showRemoved')?.checked,
      sc: !!el('filterSpeedChange')?.checked,
      sn: !!el('strictNo')?.checked,
      d:  (document.getElementById('difficulty')?.value || (window.state?.difficulty) || 'Professional')
    };
  }

  // Helper: apply checkbox states to UI
  function _applyCheckboxes(o){
    try{
      const setChk = (id, val, cb)=>{
        const el = document.getElementById(id);
        if (!el) return;
        el.checked = !!val;
        if (typeof cb === 'function') cb(!!val);
      };
      setChk('compactToggle', o.ct, (v)=> document.body.classList.toggle('compact', v));
      setChk('collapseAll', o.ca, (v)=> {
        document.querySelectorAll('#filtersRoot details.group').forEach(d => d.open = !v);
      });
      setChk('showRemoved', o.sr, (v)=>{
        if (window.state) state.showRemoved = !!v;
      });
      setChk('filterSpeedChange', o.sc, (v)=>{
        if (window.state) state.filterSpeedChange = !!v;
      });
      setChk('strictNo', o.sn, (v)=>{
        if (window.state) state.strictNo = !!v;
      });
      const dif = document.getElementById('difficulty');
      if (dif && o.d) dif.value = o.d;
      if (window.state && o.d) state.difficulty = o.d;
      if (typeof window.persist === 'function') try{ persist(); }catch{}
      if (typeof window.render === 'function') try{ render(); }catch{}
    }catch{}
  }

  function _parseHash(){
    try{
      const h = location.hash?.slice(1);
      if (!h) return null;
      let obj = null;
      // Try base64 JSON
      try{ obj = JSON.parse(atob(decodeURIComponent(h))); }catch{}
      // Try plain JSON
      if (!obj) try{ obj = JSON.parse(decodeURIComponent(h)); }catch{}
      return obj || null;
    }catch{ return null; }
  }

  // Patch share button to include checkbox flags
  function _patchShare(){
    const btn = document.getElementById('share');
    if (!btn || btn.__sharePatched2) return;
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      // Build object from existing state if possible
      const base = {
        y: Array.from(window.state?.yes || []),
        n: Array.from(window.state?.no || []),
        x: Array.from(window.state?.exclude || []),
        r: Array.from(window.state?.require || []),
        d: (window.state?.difficulty) || document.getElementById('difficulty')?.value || 'Professional',
        sn: !!(window.state?.strictNo),
        sr: !!(window.state?.showRemoved),
        sc: !!(window.state?.filterSpeedChange)
      };
      const c = _readCheckboxes();
      base.ct = !!c.ct;
      base.ca = !!c.ca;
      base.sr = !!c.sr; // ensure sync with UI
      base.sc = !!c.sc;
      base.sn = !!c.sn;
      base.d  = c.d || base.d;

      const hash = encodeURIComponent(btoa(JSON.stringify(base)));
      const url = location.origin + location.pathname + '#' + hash;
      try{
        navigator.clipboard.writeText(url);
        btn.textContent = 'Link copied!';
        setTimeout(()=>{ btn.textContent = 'Share'; }, 1500);
      }catch{
        // Fallback: update address bar
        location.hash = hash;
      }
    });
    btn.__sharePatched2 = true;
  }

  // Patch restoreFromHash to also apply checkbox flags
  (function patchRestore(){
    const _orig = window.restoreFromHash;
    window.restoreFromHash = function(){
      let ok = false;
      if (typeof _orig === 'function'){
        try { ok = !!_orig.apply(this, arguments); } catch { ok = false; }
      }
      // Regardless of return, try to apply our flags if present
      const o = _parseHash();
      if (o){
        const flags = {
          ct: !!o.ct, ca: !!o.ca, sr: !!o.sr, sc: !!o.sc, sn: !!o.sn, d: o.d
        };
        _applyCheckboxes(flags);
        ok = true;
      }
      return ok;
    };
  })();

  // Open only "Observed Evidence" group on first load (if no hash dictates otherwise)
  document.addEventListener('DOMContentLoaded', ()=>{
    try{
      const o = _parseHash();
      // Only force open state if hash is absent or doesn't include collapse flag
      const force = !(o && ('ca' in o));
      const groups = document.querySelectorAll('#filtersRoot details.group');
      if (groups && groups.length){
        groups.forEach(d => d.open = false);
        // Find group whose text mentions "Observed Evidence"
        let target = null;
        groups.forEach(d => {
          const txt = (d.querySelector('summary, h3, .groupTitle')?.textContent || '').toLowerCase();
          if (txt.includes('observed evidence')) target = d;
        });
        if (!target) target = groups[0]; // fallback
        if (force && target) target.open = true;
      }
    }catch{}
    _patchShare();
  });

  // Also run when the UI rebuilds
  const _render = window.render;
  if (typeof _render === 'function'){
    window.render = function(){
      const out = _render.apply(this, arguments);
      try { _patchShare(); } catch {}
      return out;
    };
  }
})();
