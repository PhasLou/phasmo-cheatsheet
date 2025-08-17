// ---------- Data ----------
const EVIDENCE = [
  "EMF Level 5",
  "Spirit Box",
  "Ghost Writing",
  "Freezing Temps",
  "D.O.T.S",
  "Ghost Orbs",
  "Fingerprints (UV)"
];

const GHOSTS = [
  {name:"Spirit",ev:["EMF Level 5","Spirit Box","Ghost Writing"],notes:["Smudge prevents hunts ~3 mins (longest)."]},
  {name:"Wraith",ev:["EMF Level 5","Spirit Box","D.O.T.S"],notes:["Will never step in or disturb salt; no UV footprints.","Can teleport to players (EMF 2, sometimes 5)."]},
  {name:"Phantom",ev:["Spirit Box","Fingerprints (UV)","D.O.T.S"],notes:["Photo makes ghost model disappear.","Slow blink during hunts."]},
  {name:"Poltergeist",ev:["Spirit Box","Fingerprints (UV)","Ghost Writing"],notes:["Can throw multiple objects at once (polter burst)."]},
  {name:"Banshee",ev:["Fingerprints (UV)","Ghost Orbs","D.O.T.S"],notes:["Targets one player.","Unique parabolic scream."]},
  {name:"Jinn",ev:["EMF Level 5","Fingerprints (UV)","Freezing Temps"],notes:["Will not turn the fuse box OFF directly (can overload via power).","Faster with line of sight when far while power ON."]},
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

// ---------- Speeds (m/s) & LoS rules ----------
const SPEEDS = {
  Standard: { base: 1.70, losCap: 2.80, los: true, notes: ['Accelerates under line of sight toward ~2.8 m/s.'] },

  Spirit:      { base: 1.70, losCap: 2.80, los: true },
  Wraith:      { base: 1.70, losCap: 2.80, los: true, notes:['Teleport events don’t change hunt speed.'] },
  Phantom:     { base: 1.70, losCap: 2.80, los: true },
  Poltergeist: { base: 1.70, losCap: 2.80, los: true },
  Banshee:     { base: 1.70, losCap: 2.80, los: true },
  Mare:        { base: 1.70, losCap: 2.80, los: true },
  Shade:       { base: 1.70, losCap: 2.80, los: true },
  Yurei:       { base: 1.70, losCap: 2.80, los: true },
  Oni:         { base: 1.70, losCap: 2.80, los: true },
  Yokai:       { base: 1.70, losCap: 2.80, los: true },
  Goryo:       { base: 1.70, losCap: 2.80, los: true },
  Myling:      { base: 1.70, losCap: 2.80, los: true },
  Onryo:       { base: 1.70, losCap: 2.80, los: true },
  Obake:       { base: 1.70, losCap: 2.80, los: true },
  "The Mimic": { base: 1.70, losCap: 2.80, los: true, notes:['Speed can vary if mimicking (e.g., Raiju/Hantu/Deogen behavior).'] },

  Jinn:   { base: 1.70, losCap: 2.80, los: true,
            fixed: [{speed: 2.50, when: '≥3 m, breaker ON, and line of sight'}],
            notes: ['2.5 m/s when it sees you at range with power ON; otherwise standard LoS accel.'] },

  Raiju:  { base: 1.70, losCap: 2.80, los: true,
            fixed: [{speed: 2.50, when: 'near ACTIVE electronics'}],
            notes: ['When boosted by electronics it runs at ~2.5 m/s (acts like a fixed fast speed).'] },

  Revenant: { base: 1.00, los: false,
              fixed: [{speed: 3.00, when: 'when it has line of sight / knows your location'}],
              notes: ['Very slow (~1.0) if it has no LoS; instantly speeds to ~3.0 when it sees you, then decelerates after losing LoS.'] },

  Deogen: { range: [0.40, 3.00], los: false,
            notes: ['~3.0 m/s at range; slows to ~0.4 m/s within ~2–3 m. LoS acceleration does not apply.'] },

  Hantu:  { range: [1.40, 2.70], los: false,
            notes: ['Faster in colder areas; slower when warm. No LoS acceleration. Cannot turn breaker ON.'] },

  Moroi:  { range: [1.50, 3.71], los: true,
            notes: ['Speed scales with your sanity (faster as sanity drops). LoS can still add acceleration on top of current base.'] },

  Thaye:  { range: [1.00, 2.75], los: false,
            notes: ['Starts ~2.75 m/s unaged; slows as it ages down toward ~1.0 m/s. No LoS acceleration.'] },

  "The Twins": { pair: [{label:'Main', speed:1.50}, {label:'Decoy', speed:1.90}], los: true,
                 notes: ['Two hunt speeds: main ~1.5 m/s, decoy ~1.9 m/s. Each still gains standard LoS acceleration.'] },
};

const BEHAVIOURS = {
  exclude: [
    {id:'airballSeen',label:'Airball ghost event observed',ghosts:['Oni'],tip:'Oni cannot perform airball events.'},
    {id:'lightsOn',label:'Ghost turned a light ON',ghosts:['Mare'],tip:'Mare will never turn lights on.'},
    {id:'breakerOff',label:'Ghost turned fuse box OFF',ghosts:['Jinn'],tip:'Jinn cannot directly turn the fuse box off.'},
    {id:'breakerOn',label:'Ghost turned fuse box ON',ghosts:['Hantu'],tip:'Hantu will not turn the fuse box on.'},
    {id:'saltStep',label:'Salt pile disturbed (footprints/UV)',ghosts:['Wraith'],tip:'Wraith never steps in or disturbs salt.'},
    {id:'dotsNakedEye',label:'DOTS seen with naked eye',ghosts:['Goryo'],tip:'Goryo DOTS are only visible on camera.'},
    {id:'phantomPhotoHasModel',label:'Ghost model visible in a photo',ghosts:['Phantom'],tip:'Phantom becomes invisible in photos; visible model rules it out.'},
  ],
  require: [
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

const DIFFICULTY = {
  Amateur:{evVisible:3,strictNoDefault:true,notes:'3 evidences visible. Longer setup, higher sanity.'},
  Intermediate:{evVisible:3,strictNoDefault:true,notes:'3 evidences visible. Standard sanity drain.'},
  Professional:{evVisible:3,strictNoDefault:true,notes:'3 evidences visible. Faster hunts; no setup timer.'},
  Nightmare:{evVisible:2,strictNoDefault:false,notes:'2 evidences visible. Ghost hides 1 — rely on behaviour.'},
  Insanity:{evVisible:1,strictNoDefault:false,notes:'1 evidence visible. Behaviour checks are critical.'},
};

const MODE_TIPS = {
  Amateur:['Keep lights on to preserve sanity; use pills late.','Always place a video cam early for Orbs and DOTS checks.'],
  Intermediate:['Thermo + EMF sweep to lock the room before spending time on SB/DOTS.','Use a photo cam during events for extra cash + Phantom test.'],
  Professional:['No setup timer: get two hiding spots first, then evidence.','Track the fuse box early; it matters for Jinn/Hantu tests.'],
  Nightmare:['Only 2 evidences show. Lean on behaviour (smudge timers, speed patterns, unique tells).','Remember: Wraith cannot disturb salt at all; any salt step rules it out.'],
  Insanity:['Only 1 evidence shows. Prioritise unique tells (Banshee scream, Obake prints, Goryo camera-only DOTS).','Carry lighter + smudge; time Spirit cooldown when safe.'],
};

const SMART_TIPS = [
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

// ---------- State & helpers ----------
const state = {
  yes:new Set(), no:new Set(), exclude:new Set(), require:new Set(),
  strictNo:false, showRemoved:false, difficulty:'Professional',
  filterLoS:false,
  strictNoManual:false // NEW: remember if user manually changed it
};
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const $make = (t,p={}) => Object.assign(document.createElement(t),p);

function buildChips(){
  const yesWrap = $('#evidence-yes'), noWrap = $('#evidence-no');
  EVIDENCE.forEach(ev=>{
    yesWrap.appendChild(chip(ev,'ev-yes'));
    noWrap.appendChild(chip(ev,'ev-no'));
  });
  const exWrap = $('#behaviour-exclude'); BEHAVIOURS.exclude.forEach(b=>exWrap.appendChild(behChip(b,'exclude')));
  const reqWrap = $('#behaviour-require'); BEHAVIOURS.require.forEach(b=>reqWrap.appendChild(behChip(b,'require')));
  // Inject Reorder button into the toolbar
  const tb = document.getElementById('toolbar');
  if(tb && !document.getElementById('reorderToggle')){
    const btn = document.createElement('button');
    btn.id='reorderToggle'; btn.className='btn'; btn.textContent='Reorder filters';
    btn.title = 'Toggle arrow buttons to reorder';
    btn.addEventListener('click', toggleReorderMode);
    tb.appendChild(btn);
  }
}
function chip(label,kind){
  const c=$make('label',{className:'chip',title:label});
  const input=$make('input',{type:'checkbox'});
  input.addEventListener('change',()=>{
    const tgt=(kind==='ev-yes')?state.yes:state.no;
    input.checked ? tgt.add(label) : tgt.delete(label);
    persist(); render();
  });
  c.append(input,$make('span',{textContent:label}));
  return c;
}
function behChip(b,type){
  const c=$make('label',{className:'chip',title:b.tip}); c.dataset.type=type;
  const input=$make('input',{type:'checkbox'});
  input.addEventListener('change',()=>{
    const tgt=(type==='exclude')?state.exclude:state.require;
    input.checked ? tgt.add(b.id) : tgt.delete(b.id);
    persist(); render();
  });
  c.append(input,$make('span',{innerHTML:`<strong>${b.label}</strong>`}));
  return c;
}

// Movement predicate (for LoS filter)
function ghostHasLoSAccel(name){
  const d = SPEEDS[name] || SPEEDS.Standard;
  if (d.los === true) return true;
  if (d.fixed && d.fixed.some(f => /line of sight/i.test(f.when || ''))) return true; // Revenant/Jinn clause
  return false;
}

function filterGhosts(){
  const reasons=new Map();
  // Intersect selected "require" hard tells
  const reqSets = Array.from(state.require).map(id => BEHAVIOURS.require.find(x=>x.id===id)?.ghosts || []);
  let requiredPool = null;
  if(reqSets.length){
    requiredPool = new Set(reqSets[0]);
    for(let i=1;i<reqSets.length;i++){
      requiredPool = new Set([...requiredPool].filter(g=>reqSets[i].includes(g)));
    }
  }
  const out=[], eliminated=[];
  GHOSTS.forEach(g=>{
    const why=[];
    if(requiredPool && !requiredPool.has(g.name)) why.push('Does not match selected hard tell(s)');
    // Observed evidence must be present (allow Mimic fake Orbs)
    const hasAllYes = Array.from(state.yes).every(ev => g.ev.includes(ev) || (g.name==='The Mimic' && ev==='Ghost Orbs'));
    if(!hasAllYes){
      const miss = Array.from(state.yes).filter(ev => !(g.ev.includes(ev) || (g.name==='The Mimic' && ev==='Ghost Orbs')));
      if(miss.length) why.push('Missing observed evidence: ' + miss.join(', '));
    }
    // Ruled-out evidence (strict off for Nightmare/Insanity)
    if(state.strictNo){
      const bad = Array.from(state.no).filter(ev => g.ev.includes(ev) && !(g.name==='The Mimic' && ev==='Ghost Orbs'));
      if(bad.length) why.push('Requires ruled-out evidence: ' + bad.join(', '));
    }
    // Behaviour-based rule-outs
    BEHAVIOURS.exclude.forEach(b=>{
      if(state.exclude.has(b.id) && b.ghosts.includes(g.name)) why.push('Ruled out by behavior: ' + b.label);
    });
    // Movement filter (LoS accel only)
    if(state.filterLoS && !ghostHasLoSAccel(g.name)){
      why.push('Filtered out: no LoS speed increase');
    }

    if(why.length){ reasons.set(g.name,why); eliminated.push(g); } else { out.push(g); }
  });
  return {kept:out, removed:eliminated, reasons};
}

function metaRow(g){
  const wrap=$make('div',{className:'meta'});
  g.ev.forEach(e=>{
    const s=$make('span',{className:'ev',textContent:e});
    s.setAttribute('data-cat','e'); wrap.appendChild(s);
  });
  if(g.name==='The Mimic'){
    const s2=$make('span',{className:'ev',textContent:'+ Ghost Orbs (fake)'}); s2.setAttribute('data-cat','n'); wrap.appendChild(s2);
  }
  return wrap;
}

function render(){
  const {kept,removed,reasons}=filterGhosts();
  $('#count').textContent = kept.length;

  // Ghost grid
  const grid = $('#grid'); grid.innerHTML='';
  (kept.length?kept:GHOSTS).forEach(g=>{
    const card=$make('div',{className:'ghost clickable'});
    card.addEventListener('click',()=>showGhost(g.name));
    card.append(
      $make('h4',{textContent:g.name}),
      metaRow(g),
      $make('div',{className:'note',innerHTML:g.notes.map(n=>`• ${n}`).join('<br>')})
    );
    grid.appendChild(card);
  });

  // Eliminated list (optional)
  const removedBox=$('#removedBox'); removedBox.hidden=!state.showRemoved;
  const list=$('#removedList'); list.innerHTML='';
  if(state.showRemoved){
    removed.forEach(g=>{
      const r=$make('div',{className:'reason clickable'});
      r.addEventListener('click',()=>showGhost(g.name));
      r.innerHTML = `<strong>${g.name}</strong><br>${(reasons.get(g.name)||[]).map(s=>'— '+s).join('<br>')}`;
      list.appendChild(r);
    });
  }

  // Tips + thresholds
  updateSmartTips(kept.length?kept:GHOSTS);

  // Strategy generator (≤5)
  const btn=$('#planBtn');
  if(kept.length>0 && kept.length<=5){
    btn.disabled=false; btn.title='Generate strategies for the remaining ghosts';
  } else {
    btn.disabled=true; btn.title='Add filters until 5 or fewer ghosts remain';
    $('#planPanel').hidden=true; $('#plansOut').innerHTML='';
  }

  persist();
}

function updateSmartTips(kept){
  const list=$('#tipsList'); const meta=$('#tipsMeta'); list.innerHTML='';
  const mode = state.difficulty, modeCfg = DIFFICULTY[mode];

  updateThresholds(kept);

  meta.innerHTML = `— <span class="banner">${mode}: ${modeCfg.notes}</span>`;
  (MODE_TIPS[mode]||[]).slice(0,2).forEach(t=>{
    const li=document.createElement('li'); li.textContent=t; list.appendChild(li);
  });

  if(!kept.length) return;

  const keptNames = new Set(kept.map(g=>g.name));
  const filtered = SMART_TIPS.filter(t => (t.modes?.includes('All') || t.modes?.includes(mode)));
  const scored = filtered.map(t=>({tip:t,overlap:t.targets.filter(x=>keptNames.has(x))}))
                         .filter(x=>x.overlap.length>0)
                         .sort((a,b)=>b.overlap.length-a.overlap.length)
                         .slice(0,6);

  scored.forEach(({tip,overlap})=>{
    const li=document.createElement('li');
    li.innerHTML = `${tip.text} <span class="pill">Targets: ${overlap.join(', ')}</span>`;
    if(tip.hook){
      const btn=document.createElement('button');
      btn.className='btn'; btn.style.marginLeft='8px'; btn.textContent='Mark observed';
      btn.addEventListener('click',()=>{
        if(tip.hook.type==='require') state.require.add(tip.hook.id);
        if(tip.hook.type==='exclude') state.exclude.add(tip.hook.id);
        render();
      });
      li.appendChild(btn);
    }
    list.appendChild(li);
  });
}

// ---------- Strategy Planner (offline) ----------
const GHOST_PLAN_TEMPLATES = {
  Spirit:[
    'Smudge the ghost room and start a timer. If no hunt for ~3:00, strongly consider Spirit.',
    'Repeat later to confirm cooldown behavior.'
  ],
  Wraith:[
    'Lay 2–3 salt lines at doorways/paths; sweep with UV. Any disturbance/footprints rules out Wraith.',
    'Watch for teleport EMF: random spike near a player away from room.'
  ],
  Phantom:[
    'During an appearance, take a photo. If the model vanishes in the photo, it\'s Phantom.',
    'Note slower blink during hunts.'
  ],
  Poltergeist:[
    'Bait a pile of small items and provoke. A multi-object throw burst indicates Poltergeist.',
    'Frequent throws even at high sanity support it.'
  ],
  Banshee:[
    'Use a parabolic mic; listen for the unique high-pitched scream.',
    'In multiplayer, watch if it prefers one target.'
  ],
  Jinn:[
    'Keep breaker ON. If it turns the fuse box OFF directly, rule out Jinn.',
    'Speed check at range with LoS while power ON.'
  ],
  Mare:[
    'Toggle a room light. If the ghost turns a light ON, rule out Mare.',
    'Work in darkness to see if events/hunts ramp up.'
  ],
  Revenant:[
    'Speed test: very slow with no LoS; extremely fast when it sees you.',
    'Break LoS and listen for dramatic speed change.'
  ],
  Shade:[
    'Be near the room: fewer events and later hunts suggest Shade.',
    'Compare activity rate to other candidates.'
  ],
  Demon:[
    'Expect early hunts; smudge hunt-block window is shorter than normal.',
    'Use crucifixes to gauge early hunt attempts.'
  ],
  Yurei:[
    'Look for the strong sanity drain door slam event.',
    'Smudge the room to lock it briefly; observe reduced wandering.'
  ],
  Oni:[
    'No airball events. Seeing an airball rules out Oni.',
    'Often more visible during events.'
  ],
  Yokai:[
    'Provoke by talking; talk-triggered hunts at higher sanity suggest Yokai.',
    'During hunts, talk close — reduced hearing radius is a tell.'
  ],
  Hantu:[
    'With power off/cold rooms, note frosty breath and faster movement in cold areas.',
    'Hantu will not turn the breaker ON.'
  ],
  Goryo:[
    'Place DOTS and watch via video for 1–2 minutes. DOTS only on camera indicates Goryo.',
    'Goryo rarely strays far from its room.'
  ],
  Myling:[
    'During hunts, footsteps are much quieter than other sounds; compare on parabolic.',
    'High parabolic activity outside hunts.'
  ],
  Onryo:[
    'Set 2–3 candles in the room. A hunt immediately after a blow-out suggests Onryo.',
    'Candles can delay hunts — watch blow-out/hunt sequence.'
  ],
  'The Twins':[
    'Look for two interaction spots around the same time.',
    'Speed variance across hunts can indicate Twins.'
  ],
  Raiju:[
    'Cluster active electronics near you; if it sprints near electronics, consider Raiju.',
    'Lowered hunt threshold: test items on vs off.'
  ],
  Obake:[
    'Inspect fingerprints closely for 6-finger/odd prints; prints may fade faster or not appear.',
    'Track print variations across doors/switches.'
  ],
  'The Mimic':[
    'Remember it always shows (fake) Orbs in addition to its 3 evidences.',
    'It can copy others’ behaviours — verify evidence combos carefully.'
  ],
  Moroi:[
    'Spirit Box/parabolic responses can “curse” you (faster sanity drain).',
    'Smudge blindness lasts longer once it hunts.'
  ],
  Deogen:[
    'Distinct Spirit Box heavy breathing.',
    'Very fast at range, slows to a crawl when near.'
  ],
  Thaye:[
    'Very active and fast early; slows with time. Check Ouija “age” now and later.',
    'Compare activity trend over ~10 minutes.'
  ],
};

function generateLocalPlans(kept){
  const plans=[];
  const diffs=[];
  kept.forEach(g=>{
    const t=(GHOST_PLAN_TEMPLATES[g.name]||[]);
    if(t[0]) diffs.push({ghost:g.name,step:t[0]});
  });
  const seen=new Set();
  const combined=diffs.filter(x=>{ if(seen.has(x.step)) return false; seen.add(x.step); return true; });
  plans.push({
    title:`Quick differentials for ${kept.length} ghosts`,
    steps:combined.map((x,i)=>`${i+1}. ${x.step} (targets ${x.ghost})`)
  });
  kept.forEach(g=>{
    const steps=(GHOST_PLAN_TEMPLATES[g.name]||[]).slice(0,5);
    if(steps.length) plans.push({title:`Confirm / rule ${g.name}`,steps:steps.map((s,i)=>`${i+1}. ${s}`)});
  });
  return plans;
}
function renderPlans(plans){
  const wrap=$('#plansOut'); wrap.innerHTML='';
  plans.forEach(p=>{
    const card=document.createElement('div');
    card.style.border='1px solid var(--border)';
    card.style.background='#0f1722';
    card.style.borderRadius='10px';
    card.style.padding='10px 12px';
    const h=document.createElement('div');
    h.style.fontWeight='600'; h.style.marginBottom='6px'; h.textContent=p.title;
    const ul=document.createElement('ul'); ul.style.margin='0'; ul.style.paddingLeft='18px';
    p.steps.forEach(s=>{ const li=document.createElement('li'); li.textContent=s; ul.appendChild(li); });
    card.append(h,ul); wrap.appendChild(card);
  });
  $('#planPanel').hidden = plans.length===0;
}

// ---------- Hunt Thresholds ----------
const HUNT_TRAITS = {
  Demon:["Hunts at ~70% sanity (early hunter).","Smudge hunt block ~60s (shorter)."],
  Mare:["~60% in darkness / ~40% in lit room.","Prefers dark; won’t turn lights ON."],
  Yokai:["Up to ~80% if players are talking nearby.","Reduced hearing during hunts."],
  Raiju:["~65% near ACTIVE electronics.","Moves faster near electronics."],
  Thaye:["Ages from 75% ↓ 15% (about -6% per age).","Activity & speed reduce as it ages."],
  Shade:["Late hunter: ~35% threshold.","Reluctant to hunt with players in the room."],
  Deogen:["Fixed low threshold: ~40%.","Very fast at range; crawls when close."],
  Onryo:["~60% normally; ~40% near a flame.","Candle/flame blows can trigger hunts."],
  Spirit:["Standard ~50% threshold.","Smudge hunt block ~3:00 (Spirit test)."],
  Hantu:["Standard ~50% threshold.","Faster in cold; cannot turn breaker ON."],
  Revenant:["Standard ~50% threshold.","Very slow off-LoS, very fast on-LoS."],
  Banshee:["Standard ~50% threshold.","Targets a single player (scream tell)."],
  Goryo:["Standard ~50% threshold.","Camera-only DOTS tell."],
  Jinn:["Standard ~50% threshold.","Faster at range with LoS while power ON."],
  Poltergeist:["Standard ~50% threshold.","Multi-object throw bursts."],
  Phantom:["Standard ~50% threshold.","Invisible in photos; slow blink hunts."],
  Wraith:["Standard ~50% threshold.","Never steps in salt; teleport EMF."],
  Myling:["Standard ~50% threshold.","Quieter footsteps during hunts."],
  Yurei:["Standard ~50% threshold.","Strong sanity drain door slam event."],
  Oni:["Standard ~50% threshold.","No airball events; more visible."],
  "The Twins":["Standard ~50% threshold.","Dual interactions; varied hunt speed."],
  Obake:["Standard ~50% threshold.","6-finger/odd prints; fast-fading."],
  "The Mimic":["Standard ~50% threshold (plus fake Orbs).","Can copy other behaviours (threshold varies)."],
  Moroi:["Standard ~50% threshold (effective earlier when cursed).","Box/parabolic curse speeds sanity drain."]
};
function updateThresholds(kept){
  const rows=$('#thresholdRows'); rows.innerHTML='';
  if(!kept.length){
    const d=document.createElement('div'); d.className='row';
    d.innerHTML='<div class="left">No candidates</div><div class="right">Add or clear filters to see hunt guidance.</div>';
    rows.appendChild(d); return;
  }
  kept.slice(0,12).forEach(g=>{
    const r=document.createElement('div'); r.className='row clickable'; r.title='Click for ghost details';
    r.addEventListener('click',()=>showGhost(g.name));
    const left=document.createElement('div'); left.className='left'; left.textContent=g.name;
    const right=document.createElement('div'); right.className='right';
    const traits=HUNT_TRAITS[g.name]||['Standard ~50% hunt threshold.'];
    right.innerHTML = traits.map(t=>`<span class="pill-b">${t}</span>`).join(' ');
    r.append(left,right); rows.appendChild(r);
  });
}

// ---------- Smudge Timer ----------
let smudgeT=null, smudgeStartAt=0, smudgeDur=90;
const fmt = s => { const m=Math.floor(s/60), ss=Math.max(0,Math.floor(s%60)); return `${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`; };
function pickPreset(){
  const val=$('#smudgePreset').value;
  if(val==='custom'){ $('#smudgeCustom').style.display='inline-block'; return null; }
  $('#smudgeCustom').style.display='none'; return Number(val);
}
function updateSmudgeUI(remaining){
  $('#smudgeTime').textContent=fmt(remaining);
  const pct=Math.max(0,Math.min(100,100-(remaining/smudgeDur)*100));
  $('#smudgeBar').style.width = pct + '%';
}
function startSmudge(){
  const preset=pickPreset();
  smudgeDur = preset ?? Number($('#smudgeCustom').value||90);
  smudgeStartAt=Date.now();
  $('#smudgeStart').disabled=true; $('#smudgeStop').disabled=false;
  tickSmudge();
}
function stopSmudge(){
  if(smudgeT){ cancelAnimationFrame(smudgeT); smudgeT=null; }
  $('#smudgeStart').disabled=false; $('#smudgeStop').disabled=true;
}
function resetSmudge(){ stopSmudge(); updateSmudgeUI(smudgeDur); }
function tickSmudge(){
  const elapsed=(Date.now()-smudgeStartAt)/1000;
  const remaining=Math.max(0,smudgeDur-elapsed);
  updateSmudgeUI(remaining);
  if(remaining<=0){
    stopSmudge();
    flash('⏱️ Smudge window complete. If a hunt starts soon after, it is likely NOT a Spirit.');
    return;
  }
  smudgeT=requestAnimationFrame(tickSmudge);
}
$('#smudgePreset').addEventListener('change',()=>{ const p=pickPreset(); if(p!=null){ smudgeDur=p; updateSmudgeUI(smudgeDur); } });
$('#smudgeStart').addEventListener('click',startSmudge);
$('#smudgeStop').addEventListener('click',stopSmudge);
$('#smudgeReset').addEventListener('click',resetSmudge);
updateSmudgeUI(smudgeDur);

// ---------- Ghost Modal & Details ----------
const GHOST_EXTRA = {
  Spirit:["Smudge prevents hunts for ~3:00 (longest).","Standard speed; no unique hunt sound."],
  Wraith:["Never steps in salt; no UV footprints.","Can teleport to a player causing remote EMF."],
  Phantom:["Disappears in photos (model vanishes).","Slower blink rate during hunts."],
  Poltergeist:["Can throw multiple objects at once (burst).","More frequent throwing behaviour."],
  Banshee:["Targets a single player; parabolic 'scream' sound.","Often paths toward its target."],
  Jinn:["Faster when far with LoS and power ON.","Cannot directly turn the fuse box OFF (can overload)."],
  Mare:["Prefers darkness; won’t turn lights ON.","Higher hunt chance in the dark."],
  Revenant:["Very slow off-LoS; extremely fast on-LoS.","Distinct speed change when it sees you."],
  Shade:["Shy ghost; fewer events with nearby players.","Reluctant to hunt with players in same room."],
  Demon:["Earliest hunter; short smudge protection (~60s).","Can attempt hunts aggressively."],
  Yurei:["Door slam sanity drain event.","Smudging room can lock it briefly."],
  Oni:["No airball events.","More visible during events; higher activity near players."],
  Yokai:["Talking can trigger hunts; reduced hearing while hunting.","Must be close to hear you during hunts."],
  Hantu:["Faster in cold; visible frosty breath during hunts in cold.","Will not turn the breaker ON."],
  Goryo:["DOTS only visible on camera; rarely roams far.","Best tested with cam watching DOTS."],
  Myling:["Quieter footsteps vs other sounds during hunt.","Active on parabolic outside hunts."],
  Onryo:["Flame mechanics: blow-outs can trigger hunts; candles can delay.","Track blow-out → hunt sequence."],
  "The Twins":["Two interaction spots; varied hunt speeds.","EMF in two places can occur."],
  Raiju:["Faster near active electronics; lower hunt threshold near electronics.","Disable devices to test speed change."],
  Obake:["6-finger/odd fingerprints; prints may fade fast or be missing.","Check multiple surfaces for variation."],
  "The Mimic":["Always shows fake Orbs plus its 3 evidences.","Can copy behaviours of others (incl. parabolic screams, etc.)."],
  Moroi:["Spirit Box/parabolic can 'curse' you → faster sanity drain.","Longer smudge blindness after it starts hunting."],
  Deogen:["Very fast at range, slows to a crawl when close.","Distinct heavy-breathing Spirit Box."],
  Thaye:["Starts fast/active then ages to slow/inactive.","Ouija 'age' decreases over time."]
};

function speedSummaryFor(name){
  const d = SPEEDS[name] || SPEEDS.Standard;
  const parts = [];
  if(d.pair){
    const p = d.pair.map(x => `${x.label}: ${x.speed.toFixed(2)} m/s`).join(' | ');
    parts.push(`Dual speeds — ${p}`);
    if(d.los) parts.push(`LoS accel applies (up to ~${(SPEEDS.Standard.losCap).toFixed(2)} m/s).`);
  } else if(d.range){
    parts.push(`Speed range: ${d.range[0].toFixed(2)}–${d.range[1].toFixed(2)} m/s.`);
  } else {
    parts.push(`Base: ${d.base.toFixed(2)} m/s${d.losCap?` → up to ~${d.losCap.toFixed(2)} m/s (LoS)`:''}.`);
  }
  if(d.fixed && d.fixed.length){
    d.fixed.forEach(f => parts.push(`Fixed ${f.speed.toFixed(2)} m/s ${f.when?`(${f.when})`:''}.`));
  }
  if(d.los === false && !d.range && !d.fixed){
    parts.push(`No LoS acceleration.`);
  }
  if(d.notes?.length) parts.push(...d.notes);
  return parts;
}

function showGhost(name){
  const modal=$('#ghostModal'); const t=$('#gm-title'); const evBox=$('#gm-ev'); const th=$('#gm-th');
  const traits=$('#gm-traits'); const plan=$('#gm-plan');

  const g=GHOSTS.find(x=>x.name===name); if(!g) return;
  t.textContent=g.name;

  // Evidence tags
  evBox.innerHTML='';
  g.ev.forEach(e=> evBox.appendChild($make('span',{className:'tag',textContent:e})));
  if(g.name==='The Mimic'){ evBox.appendChild($make('span',{className:'tag',textContent:'+ Ghost Orbs (fake)'})); }

  // Threshold chips
  const thArr=HUNT_TRAITS[g.name]||['Standard ~50% hunt threshold.'];
  th.innerHTML=thArr.map(x=>`<span class="pill-b">${x}</span>`).join(' ');

  // Traits list
  traits.innerHTML='';
  (GHOST_EXTRA[g.name]||g.notes||[]).forEach(x=>{
    const li=document.createElement('li'); li.textContent=x; traits.appendChild(li);
  });

  // Plan list
  plan.innerHTML='';
  (GHOST_PLAN_TEMPLATES[g.name]||[]).forEach(x=>{
    const li=document.createElement('li'); li.textContent=x; plan.appendChild(li);
  });

  // Speed & LoS section
  let speedSec = document.getElementById('gm-speed-sec');
  if(!speedSec){
    speedSec = document.createElement('div');
    speedSec.className = 'gm-sec';
    speedSec.id = 'gm-speed-sec';
    const h = document.createElement('h4'); h.textContent = 'Speed & LoS';
    const ul = document.createElement('ul'); ul.id = 'gm-speed'; ul.style.margin='0'; ul.style.paddingLeft='18px';
    speedSec.append(h,ul);
    modal.querySelector('.gm-body').prepend(speedSec);
  }
  const ul = document.getElementById('gm-speed');
  ul.innerHTML = '';
  speedSummaryFor(g.name).forEach(line=>{
    const li=document.createElement('li'); li.textContent=line; ul.appendChild(li);
  });

  if(typeof modal.showModal==='function'){ modal.showModal(); }
  else { modal.setAttribute('open',''); }
}
$('#gm-close').addEventListener('click',()=>{
  const modal=$('#ghostModal');
  if(typeof modal.close==='function'){ modal.close(); }
  else { modal.removeAttribute('open'); }
});

// ---------- Persistence & UI wiring ----------
function persist(){
  const obj={
    yes:[...state.yes], no:[...state.no],
    exclude:[...state.exclude], require:[...state.require],
    strictNo:state.strictNo, showRemoved:state.showRemoved,
    difficulty:state.difficulty, filterLoS:state.filterLoS,
    strictNoManual:state.strictNoManual
  };
  localStorage.setItem('phasmo-filter-v1',JSON.stringify(obj));
}
function restore(){
  try{
    const raw=localStorage.getItem('phasmo-filter-v1'); if(!raw) return;
    const o=JSON.parse(raw);
    state.yes=new Set(o.yes||[]);
    state.no=new Set(o.no||[]);
    state.exclude=new Set(o.exclude||[]);
    state.require=new Set(o.require||[]);
    state.strictNo=!!o.strictNo;
    state.showRemoved=!!o.showRemoved;
    state.difficulty=o.difficulty||'Professional';
    state.filterLoS=!!o.filterLoS;
    state.strictNoManual=!!o.strictNoManual;
    $('#difficulty').value=state.difficulty;
    const cb=document.getElementById('filterLoS'); if(cb) cb.checked=state.filterLoS;
  }catch{}
  // hydrate chips
  $$('#evidence-yes .chip input').forEach((inp,i)=>{ const label=EVIDENCE[i]; inp.checked=state.yes.has(label); });
  $$('#evidence-no .chip input').forEach((inp,i)=>{ const label=EVIDENCE[i]; inp.checked=state.no.has(label); });
  $$('#behaviour-exclude .chip input').forEach((inp,i)=>{ const id=BEHAVIOURS.exclude[i].id; inp.checked=state.exclude.has(id); });
  $$('#behaviour-require .chip input').forEach((inp,i)=>{ const id=BEHAVIOURS.require[i].id; inp.checked=state.require.has(id); });
  $('#strictNo').checked=state.strictNo;
}
function restoreFromHash(){
  if(!location.hash) return false;
  try{
    const o=JSON.parse(decodeURIComponent(atob(location.hash.slice(1))));
    state.yes=new Set(o.y||[]);
    state.no=new Set(o.n||[]);
    state.exclude=new Set(o.x||[]);
    state.require=new Set(o.r||[]);
    state.strictNo=!!o.sn;
    state.difficulty=o.d||'Professional';
    state.filterLoS=!!o.l;
    $('#difficulty').value=state.difficulty;
    const cb=document.getElementById('filterLoS'); if(cb) cb.checked=state.filterLoS;
    return true;
  }catch{
    return false;
  }
}
function flash(msg){
  const b=document.createElement('div');
  b.textContent=msg;
  b.style.position='fixed';
  b.style.left='50%';
  b.style.bottom='20px';
  b.style.transform='translateX(-50%)';
  b.style.background='#0f1722';
  b.style.border='1px solid var(--border)';
  b.style.padding='8px 12px';
  b.style.borderRadius='8px';
  b.style.boxShadow='0 6px 20px rgba(0,0,0,.35)';
  document.body.appendChild(b);
  setTimeout(()=>b.remove(),3000);
}

// Event listeners
$('#difficulty').addEventListener('change',e=>{
  state.difficulty=e.target.value;
  const cfg=DIFFICULTY[state.difficulty];
  if(!state.strictNoManual){ // only auto-change if user hasn't manually set it
    state.strictNo = cfg.strictNoDefault;
    $('#strictNo').checked = state.strictNo;
  }
  persist(); render();
});
$('#compactToggle').addEventListener('change',e=>{
  document.body.classList.toggle('compact',e.target.checked);
});
$('#collapseAll').addEventListener('change',e=>{
  $$('#filtersRoot details.group').forEach(d=> d.open=!e.target.checked );
});
$('#strictNo').addEventListener('change',e=>{
  state.strictNo=e.target.checked;
  state.strictNoManual = true; // remember user intent
  persist(); render();
});
$('#showRemoved').addEventListener('change',e=>{
  state.showRemoved=e.target.checked; persist(); render();
});
$('#reset').addEventListener('click',()=>{
  state.yes.clear(); state.no.clear(); state.exclude.clear(); state.require.clear();
  const cfg=DIFFICULTY[state.difficulty];
  state.strictNo=cfg.strictNoDefault; state.strictNoManual=false;
  $('#strictNo').checked=state.strictNo;
  $$('#filtersRoot .chip input').forEach(i=>i.checked=false);
  persist(); render();
});
$('#copy').addEventListener('click',()=>{
  const {kept}=filterGhosts();
  const txt=kept.map(g=>g.name).join(', ');
  navigator.clipboard.writeText(txt).then(()=>flash('Copied remaining ghosts'));
});
$('#share').addEventListener('click',()=>{
  const obj={y:[...state.yes],n:[...state.no],x:[...state.exclude],r:[...state.require],sn:state.strictNo,d:state.difficulty,l:state.filterLoS};
  const s=btoa(encodeURIComponent(JSON.stringify(obj)));
  location.hash=s;
  navigator.clipboard.writeText(location.href).then(()=>flash('Shareable link copied'));
});
$('#planBtn').addEventListener('click',()=>{
  const {kept}=filterGhosts();
  const plans=generateLocalPlans(kept);
  renderPlans(plans);
  document.getElementById('planPanel').hidden = false;
  document.getElementById('planPanel').scrollIntoView({behavior:'smooth',block:'start'});
});
// LoS filter checkbox
const losCb = document.getElementById('filterLoS');
if(losCb){
  losCb.addEventListener('change',(e)=>{
    state.filterLoS = e.target.checked;
    persist(); render();
  });
}

// ---------- Reorder mode (arrow buttons) + load/save order ----------
const ORDER_KEY = 'phasmo-filter-order-v1';

function getFilterGroups(){ return Array.from(document.querySelectorAll('#filtersRoot details.group')); }

function saveOrder(){
  const ids = getFilterGroups().map(el=>el.id).filter(Boolean);
  localStorage.setItem(ORDER_KEY, JSON.stringify(ids));
}
function loadOrder(){
  try{
    const raw = localStorage.getItem(ORDER_KEY);
    if(!raw) return;
    const ids = JSON.parse(raw);
    const root = document.getElementById('filtersRoot');
    ids.forEach(id=>{ const el = document.getElementById(id); if(el) root.appendChild(el); });
  }catch{}
}
function ensureGroupIds(){
  getFilterGroups().forEach((g,i)=>{ if(!g.id) g.id = 'group-' + i; });
}
let reorderMode = false;
function toggleReorderMode(){
  reorderMode = !reorderMode;
  const btn = document.getElementById('reorderToggle');
  if(btn) btn.textContent = reorderMode ? 'Done reordering' : 'Reorder filters';
  getFilterGroups().forEach(g=>{
    const sum = g.querySelector('summary');
    if(!sum) return;
    let box = sum.querySelector('.reorder-box');
    if(reorderMode){
      if(!box){
        box = document.createElement('span');
        box.className='reorder-box';
        box.style.marginLeft='auto';
        const up = document.createElement('button');
        const down = document.createElement('button');
        up.textContent='▲'; down.textContent='▼';
        [up,down].forEach(b=>{
          b.className='btn';
          b.style.padding='2px 6px';
          b.style.fontSize='.75rem';
          b.style.marginLeft='6px';
        });
        up.addEventListener('click',(e)=>{ e.stopPropagation(); moveGroup(g,-1); });
        down.addEventListener('click',(e)=>{ e.stopPropagation(); moveGroup(g, 1); });
        box.append(up,down);
        sum.appendChild(box);
      }
    } else {
      box?.remove();
    }
  });
}
function moveGroup(g,dir){
  const root = document.getElementById('filtersRoot');
  const groups = getFilterGroups();
  const i = groups.indexOf(g);
  if(i<0) return;
  const j = i + dir;
  if(j<0 || j>=groups.length) return;
  if(dir<0) root.insertBefore(g, groups[j]);
  else root.insertBefore(groups[j], g);
  saveOrder();
}

// ---------- Init ----------
buildChips();
ensureGroupIds();
loadOrder();
const loadedFromHash = restoreFromHash();
if(!loadedFromHash){ restore(); }
if(!localStorage.getItem('phasmo-filter-v1') && !loadedFromHash){
  const cfg = DIFFICULTY[state.difficulty];
  state.strictNo = cfg.strictNoDefault;
}
$('#strictNo').checked = state.strictNo;
render();
// ---------- Site Banner ----------
(function(){
  const banner = document.getElementById('siteBanner');
  const closeBtn = document.getElementById('bannerClose');

  if (!banner || !closeBtn) return;

  // Close button hides banner for current session
  closeBtn.addEventListener('click', () => {
    banner.style.display = 'none';
  });
})();

