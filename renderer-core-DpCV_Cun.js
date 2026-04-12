import{r as m}from"./vendor-react-DXoTT26f.js";const wn={name:"Abyss",formula:`
    float p = t * 6.28318 + cycle * 0.8;
    float glow = pow(0.5 + 0.5 * sin(p + 1.1), 3.0);
    return vec3(
      0.00 + 0.04 * glow,
      0.02 + 0.28 * glow,
      0.06 + 0.55 * glow
    );
  `,metadata:{description:"Deep-ocean palette with low baseline luminance and cool highlights.",moodTags:["calm","deep","moody"],bestFor:["deep-zoom","low-fatigue","geometry-first"],contrastProfile:"balanced",cycleBehavior:"smooth",mathProfile:"nonlinear-glow",infoSnippet:"Abyss keeps noise low and rewards deep zoom patience.",messages:[{id:"p-abyss",text:"Abyss is less saturated; it helps track shape before color drama.",tone:"neutral",always:!1,conditions:{paletteName:"Abyss"}},{id:"p-abyss-deep",text:"At deep zoom, Abyss can reveal subtle boundary gradients hidden by hotter palettes.",tone:"tip",always:!1,conditions:{paletteName:"Abyss",minMagnification:5e5}}]}},zn=Object.freeze(Object.defineProperty({__proto__:null,abyss:wn},Symbol.toStringTag,{value:"Module"})),En={name:"Aurora",formula:`
    float p = t * 6.28318 + cycle * 1.4;
    return vec3(
      0.25 + 0.25 * sin(p + 0.4) + 0.20 * sin(p * 2.1),
      0.45 + 0.35 * sin(p * 0.9 + 1.2),
      0.55 + 0.35 * cos(p + 2.1)
    );
  `,metadata:{description:"Cool-to-teal spectral blend with soft atmospheric transitions.",moodTags:["aurora","smooth","ethereal"],bestFor:["low-fatigue","animation","deep-zoom"],contrastProfile:"balanced",cycleBehavior:"smooth",mathProfile:"harmonic",infoSnippet:"Aurora favors smooth gradients and reduced visual harshness.",messages:[{id:"p-aurora",text:"Aurora keeps gradients silky and helps track broad shape flow.",tone:"neutral",always:!1,conditions:{paletteName:"Aurora"}}]}},Mn=Object.freeze(Object.defineProperty({__proto__:null,aurora:En},Symbol.toStringTag,{value:"Module"})),An={name:"Bone",formula:`
    float q = fract(t + cycle * 0.02);
    vec3 c0 = vec3(0.030, 0.025, 0.020);
    vec3 c1 = vec3(0.220, 0.190, 0.150);
    vec3 c2 = vec3(0.620, 0.560, 0.470);
    vec3 c3 = vec3(0.920, 0.890, 0.800);
    vec3 c4 = vec3(0.180, 0.180, 0.190);

    if      (q < 0.20) return mix(c0, c1, q / 0.20);
    else if (q < 0.48) return mix(c1, c2, (q - 0.20) / 0.28);
    else if (q < 0.78) return mix(c2, c3, (q - 0.48) / 0.30);
    else               return mix(c3, c4, (q - 0.78) / 0.22);
  `,metadata:{description:"Muted earthy grayscale with warm bone highlights.",moodTags:["muted","vintage","low-saturation"],bestFor:["geometry-first","low-fatigue"],contrastProfile:"balanced",cycleBehavior:"smooth",mathProfile:"piecewise",infoSnippet:"Bone reduces color noise and emphasizes geometric contour first.",messages:[{id:"p-bone",text:"Bone is useful when you want structure without heavy color distraction.",tone:"tip",always:!1,conditions:{paletteName:"Bone"}}]}},Rn=Object.freeze(Object.defineProperty({__proto__:null,bone:An},Symbol.toStringTag,{value:"Module"})),Pn={name:"Bruise",formula:`
    float q = fract(t + cycle * 0.03);
    vec3 c0 = vec3(0.090, 0.020, 0.140);
    vec3 c1 = vec3(0.180, 0.070, 0.330);
    vec3 c2 = vec3(0.070, 0.120, 0.340);
    vec3 c3 = vec3(0.580, 0.540, 0.180);
    vec3 c4 = vec3(0.040, 0.020, 0.060);

    if      (q < 0.25) return mix(c0, c1, q / 0.25);
    else if (q < 0.50) return mix(c1, c2, (q - 0.25) / 0.25);
    else if (q < 0.78) return mix(c2, c3, (q - 0.50) / 0.28);
    else               return mix(c3, c4, (q - 0.78) / 0.22);
  `,metadata:{description:"Purple-blue palette with bruised gold accents and deep shadows.",moodTags:["moody","dramatic","noir"],bestFor:["boundary-tracking","high-energy","contour-separation"],contrastProfile:"high",cycleBehavior:"punchy",mathProfile:"piecewise",infoSnippet:"Bruise creates strong color drama without washing out dark interiors.",messages:[{id:"p-bruise",text:"Bruise is cinematic and high-drama; good for edge-rich regions.",tone:"highlight",always:!1,conditions:{paletteName:"Bruise"}}]}},Cn=Object.freeze(Object.defineProperty({__proto__:null,bruise:Pn},Symbol.toStringTag,{value:"Module"})),In={name:"Cosmic",formula:`
    return vec3(
        0.5 + 0.5 * cos(3.0 + t + cycle * 0.5),
        0.5 + 0.5 * cos(3.0 + t * 0.7 + cycle * 0.3),
        0.5 + 0.5 * cos(3.0 + t * 0.5 + cycle * 0.2)
    );
  `,metadata:{description:"Warm plasma glow with cool highlights over dark interiors.",moodTags:["cinematic","high-contrast","classic"],bestFor:["boundary-tracking","contour-separation","animation"],contrastProfile:"high",cycleBehavior:"smooth",mathProfile:"harmonic",renderHints:{byColorizer:{statistical:{autoIterations:!1,maxIterations:50,statScale:.2}}},infoSnippet:"Cosmic emphasizes boundary glow and keeps stable interiors visually anchored.",messages:[{id:"p-cosmic-core",text:"Cosmic emphasizes glow edges and keeps interior sets dark and readable.",tone:"highlight",always:!1,conditions:{paletteName:"Cosmic"}},{id:"p-cosmic-cycle",text:"Cosmic cycling is smooth; slower rates help preserve shape perception.",tone:"note",always:!1,conditions:{paletteName:"Cosmic",paletteCycling:!0}}]}},Fn=Object.freeze(Object.defineProperty({__proto__:null,cosmic:In},Symbol.toStringTag,{value:"Module"})),Ln={name:"Ember",formula:`
    float p = t;
    vec3 c0 = vec3(0.010, 0.000, 0.000);
    vec3 c1 = vec3(0.180, 0.000, 0.000);
    vec3 c2 = vec3(0.600, 0.080, 0.000);
    vec3 c3 = vec3(1.000, 0.420, 0.060);
    vec3 c4 = vec3(1.000, 0.900, 0.350);

    float q = fract(p + cycle * 0.05);
    if      (q < 0.22) return mix(c0, c1, q / 0.22);
    else if (q < 0.50) return mix(c1, c2, (q - 0.22) / 0.28);
    else if (q < 0.78) return mix(c2, c3, (q - 0.50) / 0.28);
    else               return mix(c3, c4, (q - 0.78) / 0.22);
  `,metadata:{description:"Smoldering heat-map with warm highlights and dark embers.",moodTags:["warm","smoldering","dramatic"],bestFor:["contour-separation","boundary-tracking","high-energy"],contrastProfile:"high",cycleBehavior:"punchy",mathProfile:"piecewise",infoSnippet:"Ember favors warm contrast and reveals band layering clearly.",messages:[{id:"p-ember",text:"Ember emphasizes warm band transitions and works well on folded maps.",tone:"highlight",always:!1,conditions:{paletteName:"Ember"}},{id:"p-ember-cycle",text:"At high cycle speed, Ember can appear strobing in dense edge fields.",tone:"note",always:!1,conditions:{paletteName:"Ember",paletteCycling:!0}}]}},Bn=Object.freeze(Object.defineProperty({__proto__:null,ember:Ln},Symbol.toStringTag,{value:"Module"})),Un={name:"Fire",formula:`
    return vec3(
        0.5 + 0.5 * cos(t * 0.8 + cycle),
        0.5 + 0.5 * cos(1.0 + t * 0.6 + cycle * 0.8),
        0.5 + 0.5 * cos(2.0 + t * 0.4 + cycle * 0.6)
    );
  `,metadata:{description:"Hot gradient tuned for strong thermal contrast.",moodTags:["fiery","dramatic","high-energy"],bestFor:["boundary-tracking","high-energy","contour-separation"],contrastProfile:"high",cycleBehavior:"punchy",mathProfile:"harmonic",infoSnippet:"Fire makes escape bands feel energetic and emphasizes ridge transitions.",messages:[{id:"p-fire",text:"Fire palette boosts contour contrast; ideal for ridge-heavy fractals.",tone:"highlight",always:!1,conditions:{paletteName:"Fire"}},{id:"p-fire-cycle",text:"Fire cycling can feel aggressive at high speed; reduce speed for readability.",tone:"note",always:!1,conditions:{paletteName:"Fire",paletteCycling:!0}}]}},Dn=Object.freeze(Object.defineProperty({__proto__:null,fire:Un},Symbol.toStringTag,{value:"Module"})),kn={name:"Firefly",formula:`
    float p = t * 6.28318 + cycle * 1.1;
    float g = pow(0.5 + 0.5 * sin(p + 0.7), 2.5);
    return vec3(
      0.02 + 0.18 * g,
      0.08 + 0.55 * g,
      0.01 + 0.10 * sin(p * 0.6 + 2.0)
    );
  `,metadata:{description:"Dark forest tones with bright bioluminescent green highlights.",moodTags:["night","organic","bioluminescent"],bestFor:["deep-zoom","animation","low-fatigue"],contrastProfile:"balanced",cycleBehavior:"smooth",mathProfile:"nonlinear-glow",infoSnippet:"Firefly gives a dark canvas with selective luminous accents.",messages:[{id:"p-firefly",text:"Firefly keeps most regions dark while making active bands glow.",tone:"highlight",always:!1,conditions:{paletteName:"Firefly"}},{id:"p-firefly-cycle",text:"Slow cycle rates preserve the natural glow effect in Firefly.",tone:"note",always:!1,conditions:{paletteName:"Firefly",paletteCycling:!0}}]}},Nn=Object.freeze(Object.defineProperty({__proto__:null,firefly:kn},Symbol.toStringTag,{value:"Module"})),On={name:"Gold",formula:`
    float sn = max(t, 0.000001);
    float q = fract(pow(sn, 0.35) * 0.15 + cycle * 0.02);
    vec3 c0 = vec3(0.000, 0.027, 0.392);
    vec3 c1 = vec3(0.125, 0.420, 0.796);
    vec3 c2 = vec3(0.929, 1.000, 1.000);
    vec3 c3 = vec3(1.000, 0.667, 0.000);
    vec3 c4 = vec3(0.000, 0.008, 0.000);

    if      (q < 0.1600) return mix(c0, c1, q / 0.1600);
    else if (q < 0.4200) return mix(c1, c2, (q - 0.1600) / 0.2600);
    else if (q < 0.6425) return mix(c2, c3, (q - 0.4200) / 0.2225);
    else if (q < 0.8575) return mix(c3, c4, (q - 0.6425) / 0.2150);
    else                 return mix(c4, c0, (q - 0.8575) / 0.1425);
  `,metadata:{description:"Warm metallic gold palette with amber-to-bronze transitions.",moodTags:["warm","metallic","classic"],bestFor:["boundary-tracking","contour-separation","animation"],contrastProfile:"high",cycleBehavior:"smooth",mathProfile:"piecewise",infoSnippet:"Gold accentuates warm contour halos while keeping interiors dark.",messages:[{id:"p-gold",text:"Gold highlights boundary halos and gives a classic warm fractint-style look.",tone:"highlight",always:!1,conditions:{paletteName:"Gold"}}]}},$n=Object.freeze(Object.defineProperty({__proto__:null,gold:On},Symbol.toStringTag,{value:"Module"})),Xn={name:"Ice",formula:`
    float p = t * 6.28318 + cycle * 0.7;
    float s = 0.5 + 0.5 * sin(p);
    return vec3(
      0.70 + 0.20 * s,
      0.85 + 0.12 * sin(p + 0.8),
      0.95 + 0.05 * cos(p + 1.8)
    );
  `,metadata:{description:"Glacial blue-white palette with clean, crisp luminance.",moodTags:["cool","clean","crisp"],bestFor:["geometry-first","low-fatigue","deep-zoom"],contrastProfile:"balanced",cycleBehavior:"smooth",mathProfile:"harmonic",infoSnippet:"Ice is high clarity and gentle enough for long inspection sessions.",messages:[{id:"p-ice",text:"Ice keeps edges crisp while avoiding heavy saturation.",tone:"neutral",always:!1,conditions:{paletteName:"Ice"}}]}},jn=Object.freeze(Object.defineProperty({__proto__:null,ice:Xn},Symbol.toStringTag,{value:"Module"})),qn={name:"Neon",formula:`
    float p = t * 5.0 + cycle * 3.0;
    return vec3(
        abs(sin(p)),
        abs(cos(p * 0.5)),
        abs(sin(p * 0.2))
    );
  `,metadata:{description:"Vivid high-saturation palette for aggressive contour contrast.",moodTags:["neon","electric","bold"],bestFor:["high-energy","animation","boundary-tracking"],contrastProfile:"high",cycleBehavior:"high-contrast",mathProfile:"high-frequency",infoSnippet:"Neon is intentionally loud; best when you want structure to pop immediately.",messages:[{id:"p-neon",text:"Neon makes boundaries pop, but can hide subtle gradients in smooth regions.",tone:"highlight",always:!1,conditions:{paletteName:"Neon"}},{id:"p-neon-cycle",text:"Neon + cycling can become intense quickly; consider lowering cycle speed.",tone:"warn",always:!1,conditions:{paletteName:"Neon",paletteCycling:!0}}]}},Gn=Object.freeze(Object.defineProperty({__proto__:null,neon:qn},Symbol.toStringTag,{value:"Module"})),Wn={name:"Plasma",formula:`
    float p = t * 2.0 + cycle * 2.0;
    return vec3(
        0.5 + 0.5 * sin(p),
        0.5 + 0.5 * sin(p + 2.094),
        0.5 + 0.5 * sin(p + 4.188)
    );
  `,metadata:{description:"Classic rainbow plasma for maximal contour visibility.",moodTags:["rainbow","classic","retro"],bestFor:["contour-separation","high-energy","animation"],contrastProfile:"high",cycleBehavior:"high-contrast",mathProfile:"high-frequency",infoSnippet:"Plasma is intentionally vivid and can expose contour spacing quickly.",messages:[{id:"p-plasma",text:"Plasma strongly separates contour bands, useful for spotting iteration gradients.",tone:"highlight",always:!1,conditions:{paletteName:"Plasma"}},{id:"p-plasma-cycle",text:"Fast cycling in Plasma can feel strobing; reduce speed for structure analysis.",tone:"warn",always:!1,conditions:{paletteName:"Plasma",paletteCycling:!0}}]}},Vn=Object.freeze(Object.defineProperty({__proto__:null,plasma:Wn},Symbol.toStringTag,{value:"Module"})),Hn={name:"Silver",formula:`
    float v = 0.5 + 0.5 * cos(t + cycle);
    return vec3(v, v, v * 1.1);
  `,metadata:{description:"Monochrome silver gradient emphasizing shape over hue.",moodTags:["monochrome","technical","minimal"],bestFor:["geometry-first","low-fatigue","deep-zoom"],contrastProfile:"balanced",cycleBehavior:"smooth",mathProfile:"monochrome",infoSnippet:"Silver is ideal when you want to focus on geometry and not color bias.",messages:[{id:"p-silver",text:"Silver removes most hue cues, making boundary geometry easier to judge.",tone:"tip",always:!1,conditions:{paletteName:"Silver"}}]}},Zn=Object.freeze(Object.defineProperty({__proto__:null,silver:Hn},Symbol.toStringTag,{value:"Module"})),Yn={name:"Toxic",formula:`
    float p = t * 6.28318 + cycle * 2.5;
    return vec3(
      0.30 + 0.25 * sin(p * 1.2 + 2.0),
      0.65 + 0.35 * sin(p + 0.2),
      0.02 + 0.12 * cos(p * 0.8)
    );
  `,metadata:{description:"Acid green palette with dark undertones and strong edge punch.",moodTags:["toxic","acid","high-energy"],bestFor:["high-energy","boundary-tracking","contour-separation"],contrastProfile:"high",cycleBehavior:"punchy",mathProfile:"high-frequency",infoSnippet:"Toxic is aggressive and can quickly reveal thin branch boundaries.",messages:[{id:"p-toxic",text:"Toxic makes active boundaries glow hard against dark interiors.",tone:"highlight",always:!1,conditions:{paletteName:"Toxic"}},{id:"p-toxic-cycle",text:"Toxic cycling can get visually intense; slower speeds improve readability.",tone:"warn",always:!1,conditions:{paletteName:"Toxic",paletteCycling:!0}}]}},Kn=Object.freeze(Object.defineProperty({__proto__:null,toxic:Yn},Symbol.toStringTag,{value:"Module"})),Jn={name:"Verdigris",formula:`
    float q = fract(t + cycle * 0.04);
    vec3 c0 = vec3(0.020, 0.040, 0.030);
    vec3 c1 = vec3(0.090, 0.220, 0.160);
    vec3 c2 = vec3(0.200, 0.520, 0.420);
    vec3 c3 = vec3(0.700, 0.860, 0.720);
    vec3 c4 = vec3(0.180, 0.120, 0.050);

    if      (q < 0.25) return mix(c0, c1, q / 0.25);
    else if (q < 0.55) return mix(c1, c2, (q - 0.25) / 0.30);
    else if (q < 0.82) return mix(c2, c3, (q - 0.55) / 0.27);
    else               return mix(c3, c4, (q - 0.82) / 0.18);
  `,metadata:{description:"Copper-green oxidation palette with earthy transitions.",moodTags:["organic","earthy","aged-metal"],bestFor:["low-fatigue","geometry-first","deep-zoom"],contrastProfile:"balanced",cycleBehavior:"smooth",mathProfile:"piecewise",infoSnippet:"Verdigris gives natural-looking gradients that stay readable over long sessions.",messages:[{id:"p-verdigris",text:"Verdigris is great for long viewing sessions with lower visual fatigue.",tone:"neutral",always:!1,conditions:{paletteName:"Verdigris"}}]}},Qn=Object.freeze(Object.defineProperty({__proto__:null,verdigris:Jn},Symbol.toStringTag,{value:"Module"})),ei=new Set(["neutral","tip","note","warn","highlight"]),Ho=new Set(["harmonic","piecewise","monochrome","nonlinear-glow","high-frequency"]),Zo=new Set(["boundary-tracking","deep-zoom","low-fatigue","animation","geometry-first","high-energy","contour-separation"]),ti=new Set(["cross","circle","box","gaussian-lattice"]),ri=new Set(["smooth","post-escape","orbit-trap","final-z","binary-decomposition","statistical","lyapunov"]),Jr=e=>Array.isArray(e)&&e.every(t=>typeof t=="string"),L=e=>typeof e=="number"&&Number.isFinite(e),Yo=(e,t)=>{if(e===void 0)return[];if(!e||typeof e!="object"||Array.isArray(e))return[`${t} should be an object.`];const r=[];return e.autoIterations!==void 0&&typeof e.autoIterations!="boolean"&&r.push(`${t}.autoIterations should be a boolean.`),e.maxIterations!==void 0&&(!L(e.maxIterations)||e.maxIterations<=0)&&r.push(`${t}.maxIterations should be a positive number.`),e.postEscapeSteps!==void 0&&(!L(e.postEscapeSteps)||e.postEscapeSteps<0)&&r.push(`${t}.postEscapeSteps should be a non-negative number.`),e.orbitTrapShape!==void 0&&!ti.has(e.orbitTrapShape)&&r.push(`${t}.orbitTrapShape "${String(e.orbitTrapShape)}" is invalid.`),e.orbitTrapScale!==void 0&&(!L(e.orbitTrapScale)||e.orbitTrapScale<=0)&&r.push(`${t}.orbitTrapScale should be a positive number.`),e.finalZMix!==void 0&&(!L(e.finalZMix)||e.finalZMix<0||e.finalZMix>1)&&r.push(`${t}.finalZMix should be within [0, 1].`),e.statScale!==void 0&&(!L(e.statScale)||e.statScale<0)&&r.push(`${t}.statScale should be a non-negative number.`),r},Ua=(e,t)=>{if(e===void 0)return[];if(!Array.isArray(e))return[`${t}.messages should be an array.`];const r=[],o=new Set;return e.forEach((a,l)=>{const i=`${t}.messages[${l}]`;if(!a||typeof a!="object"){r.push(`${i} should be an object.`);return}typeof a.id!="string"||a.id.trim()===""?r.push(`${i}.id should be a non-empty string.`):o.has(a.id)?r.push(`${i}.id "${a.id}" is duplicated.`):o.add(a.id),(typeof a.text!="string"||a.text.trim()==="")&&r.push(`${i}.text should be a non-empty string.`),a.tone!==void 0&&!ei.has(a.tone)&&r.push(`${i}.tone "${String(a.tone)}" is invalid.`),a.always!==void 0&&typeof a.always!="boolean"&&r.push(`${i}.always should be a boolean when provided.`);const n=a.conditions;if(n===void 0)return;if(!n||typeof n!="object"){r.push(`${i}.conditions should be an object when provided.`);return}n.minMagnification!==void 0&&!L(n.minMagnification)&&r.push(`${i}.conditions.minMagnification should be a number.`),n.maxMagnification!==void 0&&!L(n.maxMagnification)&&r.push(`${i}.conditions.maxMagnification should be a number.`),L(n.minMagnification)&&L(n.maxMagnification)&&n.minMagnification>n.maxMagnification&&r.push(`${i}.conditions minMagnification > maxMagnification.`),n.minZoomDepth!==void 0&&!L(n.minZoomDepth)&&r.push(`${i}.conditions.minZoomDepth should be a number.`),n.maxZoomDepth!==void 0&&!L(n.maxZoomDepth)&&r.push(`${i}.conditions.maxZoomDepth should be a number.`),L(n.minZoomDepth)&&L(n.maxZoomDepth)&&n.minZoomDepth>n.maxZoomDepth&&r.push(`${i}.conditions minZoomDepth > maxZoomDepth.`),n.paletteCycling!==void 0&&typeof n.paletteCycling!="boolean"&&r.push(`${i}.conditions.paletteCycling should be a boolean.`),n.minIterations!==void 0&&!L(n.minIterations)&&r.push(`${i}.conditions.minIterations should be a number.`),n.maxIterations!==void 0&&!L(n.maxIterations)&&r.push(`${i}.conditions.maxIterations should be a number.`),L(n.minIterations)&&L(n.maxIterations)&&n.minIterations>n.maxIterations&&r.push(`${i}.conditions minIterations > maxIterations.`);const p=(h,d)=>{h!==void 0&&typeof h!="string"&&(Jr(h)||r.push(`${i}.conditions.${d} should be a string or string[].`))};p(n.precisionMode,"precisionMode"),p(n.paletteName,"paletteName"),p(n.fractalName,"fractalName")}),r},oi=e=>{const t=e.metadata;if(t===void 0)return[];if(!t||typeof t!="object")return["metadata should be an object."];const r=[],o=(n,p)=>{n!==void 0&&typeof n!="string"&&r.push(`${p} should be a string.`)},a=(n,p)=>{n!==void 0&&typeof n!="boolean"&&r.push(`${p} should be a boolean.`)},l=(n,p)=>{n!==void 0&&!Jr(n)&&r.push(`${p} should be a string array.`)};if(o(t.summary,"metadata.summary"),o(t.history,"metadata.history"),o(t.equationLabel,"metadata.equationLabel"),o(t.equationNotes,"metadata.equationNotes"),o(t.description,"metadata.description"),l(t.tips,"metadata.tips"),l(t.recommendedZooms,"metadata.recommendedZooms"),l(t.discoveries,"metadata.discoveries"),l(t.poiHints,"metadata.poiHints"),a(t.supportsDoublePrecision,"metadata.supportsDoublePrecision"),a(t.supportsJuliaSeed,"metadata.supportsJuliaSeed"),a(t.supportsOrbitTrap,"metadata.supportsOrbitTrap"),a(t.expensive,"metadata.expensive"),a(t.experimental,"metadata.experimental"),t.autoIterationDefault!==void 0){const n=t.autoIterationDefault;!n||typeof n!="object"?r.push("metadata.autoIterationDefault should be an object."):(n.enabled!==void 0&&typeof n.enabled!="boolean"&&r.push("metadata.autoIterationDefault.enabled should be a boolean."),n.profile!==void 0&&n.profile!=="conservative"&&n.profile!=="balanced"&&n.profile!=="custom"&&r.push("metadata.autoIterationDefault.profile should be conservative, balanced, or custom."),n.profile==="custom"&&t.autoIterationCurve===void 0&&r.push("metadata.autoIterationDefault.profile is custom but metadata.autoIterationCurve is missing."))}if(t.autoIterationCurve!==void 0){const n=t.autoIterationCurve;!n||typeof n!="object"?r.push("metadata.autoIterationCurve should be an object."):((!L(n.min)||n.min<=0)&&r.push("metadata.autoIterationCurve.min should be a positive number."),(!L(n.max)||n.max<=0)&&r.push("metadata.autoIterationCurve.max should be a positive number."),(!L(n.base)||n.base<=0)&&r.push("metadata.autoIterationCurve.base should be a positive number."),(!L(n.slope)||n.slope<0)&&r.push("metadata.autoIterationCurve.slope should be a non-negative number."),L(n.min)&&L(n.max)&&n.min>n.max&&r.push("metadata.autoIterationCurve.min should be <= metadata.autoIterationCurve.max."),n.gamma!==void 0&&(!L(n.gamma)||n.gamma<=0)&&r.push("metadata.autoIterationCurve.gamma should be a positive number when provided."),o(n.label,"metadata.autoIterationCurve.label"),o(n.description,"metadata.autoIterationCurve.description"))}if(t.autoIterationProfileOverrides!==void 0){const n=t.autoIterationProfileOverrides;if(!n||typeof n!="object")r.push("metadata.autoIterationProfileOverrides should be an object.");else{const p=(h,d)=>{if(h===void 0)return;if(!h||typeof h!="object"){r.push(`${d} should be an object when provided.`);return}const v=h,g=(u,y)=>{if(v[u]===void 0)return;if(!L(v[u])){r.push(`${d}.${u} should be a number.`);return}const x=v[u];y&&x<=0&&r.push(`${d}.${u} should be > 0.`),!y&&x<0&&r.push(`${d}.${u} should be >= 0.`)};g("min",!0),g("max",!0),g("base",!0),g("slope",!1),g("gamma",!0),L(v.min)&&L(v.max)&&v.min>v.max&&r.push(`${d}.min should be <= ${d}.max.`)};p(n.conservative,"metadata.autoIterationProfileOverrides.conservative"),p(n.balanced,"metadata.autoIterationProfileOverrides.balanced")}}t.safeDefaultIterations!==void 0&&(!L(t.safeDefaultIterations)||t.safeDefaultIterations<=0)&&r.push("metadata.safeDefaultIterations should be a positive number.");const i=t.infoPanel;return i!==void 0&&(!i||typeof i!="object"?r.push("metadata.infoPanel should be an object."):(o(i.overview,"metadata.infoPanel.overview"),o(i.boundary,"metadata.infoPanel.boundary"),o(i.deep,"metadata.infoPanel.deep"),o(i.ultradeep,"metadata.infoPanel.ultradeep"),l(i.trivia,"metadata.infoPanel.trivia"),r.push(...Ua(i.messages,"metadata.infoPanel")))),r},ai=e=>{const t=e.metadata;if(t===void 0)return[];if(!t||typeof t!="object")return["metadata should be an object."];const r=[],o=(l,i)=>{l!==void 0&&typeof l!="string"&&r.push(`${i} should be a string.`)},a=(l,i)=>{l!==void 0&&!Jr(l)&&r.push(`${i} should be a string array.`)};return o(t.description,"metadata.description"),a(t.moodTags,"metadata.moodTags"),a(t.bestFor,"metadata.bestFor"),o(t.contrastProfile,"metadata.contrastProfile"),o(t.cycleBehavior,"metadata.cycleBehavior"),o(t.mathProfile,"metadata.mathProfile"),o(t.infoSnippet,"metadata.infoSnippet"),t.renderHints!==void 0&&(!t.renderHints||typeof t.renderHints!="object"||Array.isArray(t.renderHints)?r.push("metadata.renderHints should be an object."):(r.push(...Yo(t.renderHints.default,"metadata.renderHints.default")),t.renderHints.byColorizer!==void 0&&(!t.renderHints.byColorizer||typeof t.renderHints.byColorizer!="object"||Array.isArray(t.renderHints.byColorizer)?r.push("metadata.renderHints.byColorizer should be an object."):Object.entries(t.renderHints.byColorizer).forEach(([l,i])=>{ri.has(l)||r.push(`metadata.renderHints.byColorizer key "${l}" is not a known colorizer mode.`),r.push(...Yo(i,`metadata.renderHints.byColorizer.${l}`))})))),t.mathProfile!==void 0&&!Ho.has(t.mathProfile)&&r.push(`metadata.mathProfile "${t.mathProfile}" is not in the canonical set (${Array.from(Ho).join(", ")}).`),Array.isArray(t.bestFor)&&t.bestFor.forEach((l,i)=>{Zo.has(l)||r.push(`metadata.bestFor[${i}] "${l}" is not in the canonical set (${Array.from(Zo).join(", ")}).`)}),r.push(...Ua(t.messages,"metadata")),r},ni=Object.assign({"../palettes/abyss.ts":zn,"../palettes/aurora.ts":Mn,"../palettes/bone.ts":Rn,"../palettes/bruise.ts":Cn,"../palettes/cosmic.ts":Fn,"../palettes/ember.ts":Bn,"../palettes/fire.ts":Dn,"../palettes/forest-firefly.ts":Nn,"../palettes/gold.ts":$n,"../palettes/ice.ts":jn,"../palettes/neon.ts":Gn,"../palettes/plasma.ts":Vn,"../palettes/silver.ts":Zn,"../palettes/toxic.ts":Kn,"../palettes/verdigris.ts":Qn}),yt={},ii=[],si=new Set,Hr=new Set;let Da=0;const ka=e=>{if(typeof e!="object"||e===null)return!1;const t=e;return typeof t.name=="string"&&typeof t.formula=="string"},li=e=>{const t=e.trim();return t.length>0?t:"Palette"},ci=e=>{let t=2,r=`${e} ${t}`;for(;yt[r];)t+=1,r=`${e} ${t}`;return r},Na=(e,t)=>{const r=ai(e);return r.forEach(o=>{console.warn(`[Palette metadata] ${e.name} (${t}): ${o}`)}),r},ui=()=>{Da+=1,Hr.forEach(e=>e())};Object.entries(ni).sort(([e],[t])=>e.localeCompare(t)).forEach(([e,t])=>{var a,l;if(e.endsWith("index.ts"))return;const r=Object.values(t).find(ka);if(!r)return;if(yt[r.name]){console.warn(`Duplicate palette name "${r.name}" in ${e}; keeping the first definition.`);return}const o=Na(r,e);ii.push({name:r.name,path:e,hasMetadata:!!r.metadata,messageCount:((l=(a=r.metadata)==null?void 0:a.messages)==null?void 0:l.length)??0,warnings:o}),yt[r.name]=r});const Qr=new Proxy(yt,{get(e,t){if(typeof t=="string"&&!isNaN(Number(t))){const r=Number(t),o=Object.keys(e);return e[o[r]]}return e[t]}}),fi=()=>Object.keys(yt),Vl=(e,t)=>{if(!ka(e))throw new Error("Invalid palette definition. Expected name/formula fields.");const r=li((t==null?void 0:t.preferredName)??e.name),o=!!(t!=null&&t.overwriteExisting),a=yt[r]&&!o?ci(r):r,l={...e,name:a,formula:e.formula.trim()};return Na(l,"runtime"),yt[l.name]=l,si.add(l.name),ui(),l},mi=e=>(Hr.add(e),()=>{Hr.delete(e)}),Ko=()=>Da,Hl=e=>{if(e===void 0)return Jo;const t=Qr[e];return t?t.name:Jo},Jo="Cosmic",di={name:"Barnsley I",category:"Experimental",formula:`
    float sx = z.x >= 0.0 ? 1.0 : -1.0;
    float ax = z.x - sx;

    x = ax * c.x - z.y * c.y;
    y = ax * c.y + z.y * c.x;
    z = vec2(x, y);
  `,initialCenter:{x:0,y:0},initialZoom:4,initialPalette:0,metadata:{summary:"Sign-split dynamics produce abrupt branch turns and folded wisps.",equationLabel:"z(n+1) = (z - sign(Re(z))) * c",equationNotes:"Piecewise sign handling creates directional discontinuities.",experimental:!0,infoPanel:{messages:[{id:"b1-core",text:"Barnsley I responds strongly to sign flips across the vertical axis.",tone:"tip",always:!0},{id:"b1-iter-window",text:"Moderate iteration windows often preserve branch shape better than maxed-out fills.",tone:"note",always:!1,conditions:{minIterations:250,maxIterations:1200}}]}}},pi=Object.freeze(Object.defineProperty({__proto__:null,barnsley1:di},Symbol.toStringTag,{value:"Module"})),bi={name:"Buffalo",category:"Symmetry",formula:`
    x = abs(z.x * z.x - z.y * z.y) + c.x;
    y = abs(2.0 * z.x * z.y) + c.y;
    z = vec2(x, y);
  `,initialCenter:{x:-.5,y:0},initialZoom:3,metadata:{summary:"Absolute-value folding on both axes yields dense horn-like branching.",equationLabel:"z(n+1) = (|Re(z^2)| + i|Im(z^2)|) + c",equationNotes:"Double absolute folding amplifies mirrored ridge structures.",infoPanel:{messages:[{id:"buff-core",text:"Buffalo ridges repeat in mirrored bursts; inspect horn tips for nested copies.",tone:"tip",always:!0},{id:"buff-deep",text:"Deep regions can alternate between smooth basins and sudden serrated walls.",tone:"highlight",always:!1,conditions:{minMagnification:8e5}}]}}},_i=Object.freeze(Object.defineProperty({__proto__:null,buffalo:bi},Symbol.toStringTag,{value:"Module"})),hi={name:"Burning Ship",category:"Symmetry",formula:`
    x = (z.x * z.x - z.y * z.y) + c.x;
    y = abs(2.0 * z.x * z.y) + c.y;
    z = vec2(x, y);
    z = abs(z);
  `,initialCenter:{x:-1.75,y:-.02},initialZoom:.1,initialPalette:"Fire",metadata:{summary:"Absolute-value folding creates jagged ridges and ship-like silhouettes.",equationLabel:"z(n+1) = (|Re(z)| + i|Im(z)|)^2 + c",equationNotes:"The fold before squaring is what produces the sharp ridge geometry.",infoPanel:{messages:[{id:"bs-ridges",text:"Burning Ship rewards vertical scans: ridges and bays repeat with hard-edged symmetry.",tone:"tip",always:!0},{id:"bs-low",text:"Low magnification shows large hull-like forms before filament detail emerges.",tone:"neutral",always:!1,conditions:{maxMagnification:250}},{id:"bs-high",text:"At high magnification, tiny ridges can dominate before smooth gradients return.",tone:"highlight",always:!1,conditions:{minMagnification:2e5}},{id:"bs-precision",text:"Precision-assisted modes reduce staircase artifacts in narrow ridge corridors.",tone:"note",always:!1,conditions:{precisionMode:["DF64","PTB"]}},{id:"bs-iter-window",text:"If ridge contrast is muddy, back iterations down into a midrange window.",tone:"note",always:!1,conditions:{minIterations:350,maxIterations:1500}}]},poiHints:["Explore near -1.7443359375 - 0.017451171875i for iconic ship ridges.","Try -1.755 + -0.03i for jagged bay structures.","Scan vertical seams around x=-1.76 for repeating flame-like peaks."]}},xi=Object.freeze(Object.defineProperty({__proto__:null,burningShip:hi},Symbol.toStringTag,{value:"Module"})),yi={name:"Celtic",category:"Symmetry",formula:`
    x = abs(z.x * z.x - z.y * z.y) + c.x;
    y = (2.0 * z.x * z.y) + c.y;
    z = vec2(x, y);
  `,initialCenter:{x:-.5,y:0},initialZoom:3,metadata:{summary:"Celtic folding keeps one component signed and one absolute, creating braided seams.",equationLabel:"z(n+1) = (|Re(z^2)| + iIm(z^2)) + c",equationNotes:"Partial folding introduces asymmetry compared with Buffalo and Burning Ship.",infoPanel:{messages:[{id:"celtic-core",text:"Celtic boundaries often look braided; pan along seam lines to find repeating knots.",tone:"tip",always:!0},{id:"celtic-mid",text:"Middle magnification is a sweet spot for knot-like motifs before dense noise appears.",tone:"neutral",always:!1,conditions:{minMagnification:100,maxMagnification:2e5}}]}}},vi=Object.freeze(Object.defineProperty({__proto__:null,celtic:yi},Symbol.toStringTag,{value:"Module"})),gi={name:"Split Square",category:"Experimental",formula:`
    float sx = z.x >= 0.0 ? 1.0 : -1.0;
    float sy = z.y >= 0.0 ? 1.0 : -1.0;

    float ax = z.x * z.x - z.y * z.y;
    float ay = 2.0 * abs(z.x) * abs(z.y);

    x = ax + c.x + 0.25 * sx;
    y = ay + c.y + 0.25 * sy;
    z = vec2(x, y);
  `,initialCenter:{x:0,y:0},initialZoom:3,initialPalette:0,metadata:{summary:"Quadrant-aware offsets split similar regions into offset branch families.",equationLabel:"z(n+1) = split(z^2) + c + offset(sign(z))",equationNotes:"Small sign-based offsets introduce grid-like branch separations.",experimental:!0,infoPanel:{messages:[{id:"split-core",text:"Split Square reacts to quadrant changes; crossing axes can re-route filaments abruptly.",tone:"tip",always:!0},{id:"split-iter",text:"If colors fill too quickly, reduce iterations to recover the split-branch silhouette.",tone:"note",always:!1,conditions:{minIterations:800}}]}}},Ti=Object.freeze(Object.defineProperty({__proto__:null,splitSquare:gi},Symbol.toStringTag,{value:"Module"})),Si={name:"Cubic",category:"Power",formula:`
    x = z.x * (z.x * z.x - 3.0 * z.y * z.y) + c.x;
    y = z.y * (3.0 * z.x * z.x - z.y * z.y) + c.y;
    z = vec2(x, y);
  `,initialCenter:{x:0,y:0},initialZoom:3,metadata:{summary:"Third-order power maps produce three-way rotational branch patterns.",equationLabel:"z(n+1) = z(n)^3 + c",equationNotes:"Cubic power introduces tri-lobed rotational structure.",infoPanel:{messages:[{id:"cubic-core",text:"Cubic mode often reveals tri-symmetric petals around major hubs.",tone:"tip",always:!0},{id:"cubic-precision",text:"Precision upgrades help keep thin cubic filaments coherent at deep zoom.",tone:"note",always:!1,conditions:{precisionMode:["DF64","PTB"]}}]}}},wi=Object.freeze(Object.defineProperty({__proto__:null,cubic:Si},Symbol.toStringTag,{value:"Module"})),zi=e=>{const t=[];let r=0;const o=(a,l)=>t.push({type:a,value:l});for(;r<e.length;){const a=e[r];if(/\s/.test(a)){r+=1;continue}if(/[0-9.]/.test(a)){const l=r;let i=a===".";for(r+=1;r<e.length;){const n=e[r];if(/[0-9]/.test(n)){r+=1;continue}if(n==="."&&!i){i=!0,r+=1;continue}if((n==="e"||n==="E")&&r+1<e.length){const p=e[r+1];if(p==="+"||p==="-"||/[0-9]/.test(p)){for(r+=2;r<e.length&&/[0-9]/.test(e[r]);)r+=1;continue}}break}o("number",e.slice(l,r));continue}if(/[A-Za-z_]/.test(a)){const l=r;for(r+=1;r<e.length&&/[A-Za-z0-9_.]/.test(e[r]);)r+=1;o("ident",e.slice(l,r));continue}if(a==="+"||a==="-"||a==="*"||a==="/"){o("op",a),r+=1;continue}if(a==="("||a===")"){o("paren",a),r+=1;continue}if(a===","){o("comma",a),r+=1;continue}throw new Error(`Unsupported token "${a}"`)}return o("eof",""),t};class Ei{constructor(t){this.pos=0,this.tokens=zi(t)}peek(){return this.tokens[this.pos]}advance(){const t=this.tokens[this.pos];return this.pos+=1,t}match(t,r){const o=this.peek();return o.type!==t||r!==void 0&&o.value!==r?!1:(this.pos+=1,!0)}expect(t,r){const o=this.peek();if(o.type!==t||r!==void 0&&o.value!==r){const a=r!==void 0?`${t}("${r}")`:t;throw new Error(`Expected ${a}, got ${o.type}("${o.value}")`)}return this.advance()}parseExpression(){const t=this.parseAddSub();if(this.peek().type!=="eof")throw new Error(`Unexpected trailing token "${this.peek().value}"`);return t}parseAddSub(){let t=this.parseMulDiv();for(;this.peek().type==="op"&&(this.peek().value==="+"||this.peek().value==="-");){const r=this.advance().value,o=this.parseMulDiv();t={kind:"binary",op:r,left:t,right:o}}return t}parseMulDiv(){let t=this.parseUnary();for(;this.peek().type==="op"&&(this.peek().value==="*"||this.peek().value==="/");){const r=this.advance().value,o=this.parseUnary();t={kind:"binary",op:r,left:t,right:o}}return t}parseUnary(){if(this.peek().type==="op"&&(this.peek().value==="+"||this.peek().value==="-")){const t=this.advance().value,r=this.parseUnary();return{kind:"unary",op:t,arg:r}}return this.parsePrimary()}parsePrimary(){const t=this.peek();if(t.type==="number")return this.advance(),{kind:"number",value:t.value};if(t.type==="ident"){if(this.advance(),this.match("paren","(")){const r=[];if(!this.match("paren",")")){do r.push(this.parseAddSub());while(this.match("comma"));this.expect("paren",")")}return{kind:"call",name:t.value,args:r}}return{kind:"ident",value:t.value}}if(this.match("paren","(")){const r=this.parseAddSub();return this.expect("paren",")"),r}throw new Error(`Unexpected token ${t.type}("${t.value}")`)}}const Mi=e=>e.replace(/\/\/.*$/gm,"").replace(/\r/g,"").trim(),jt=e=>{if(e.kind==="number")return`df_set(${e.value})`;if(e.kind==="ident")return e.value==="z.x"?"zx":e.value==="z.y"?"zy":e.value==="c.x"?"cx":e.value==="c.y"?"cy":e.value==="x"?"x":e.value==="y"?"y":e.value;if(e.kind==="unary"){const t=jt(e.arg);return e.op==="+"?t:`df_neg(${t})`}if(e.kind==="binary"){const t=jt(e.left),r=jt(e.right);return e.op==="+"?`df_add(${t}, ${r})`:e.op==="-"?`df_sub(${t}, ${r})`:e.op==="*"?`df_mul(${t}, ${r})`:`df_div(${t}, ${r})`}if(e.kind==="call"){if(e.name==="abs"&&e.args.length===1)return`df_abs(${jt(e.args[0])})`;throw new Error(`Unsupported function "${e.name}"`)}throw new Error("Unsupported expression node")},Qo=e=>{const r=new Ei(e).parseExpression();return jt(r)},Ai=e=>e.split(";").map(t=>t.trim()).filter(Boolean),Oa=e=>{const t=Mi(e);if(!t)return{dfFormula:null,reason:"Formula is empty."};if(/[?:]/.test(t))return{dfFormula:null,reason:"Ternary operators are not supported yet."};if(/\bif\s*\(/.test(t))return{dfFormula:null,reason:"Conditional blocks are not supported yet."};if(/\bvec2\s+\w+\s*=/.test(t))return{dfFormula:null,reason:"Local vec2 declarations are not supported yet."};if(/\b(dot|length|atan|pow|exp|sin|cos)\s*\(/.test(t))return{dfFormula:null,reason:"Transcendental/vector intrinsics are not supported yet."};const r=Ai(t),o=[],a=new Set;let l=!1;for(const i of r){const n=i.match(/^float\s+([A-Za-z_]\w*)\s*=\s*(.+)$/);if(n){const[,g,u]=n,y=Qo(u);a.has(g)?o.push(`${g} = ${y};`):(o.push(`vec2 ${g} = ${y};`),a.add(g));continue}const p=i.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/);if(!p)return{dfFormula:null,reason:`Unsupported statement "${i}".`};const[,h,d]=p;if(h==="z"){if(/^vec2\s*\(\s*x\s*,\s*y\s*\)$/.test(d)){o.push("zx = x;"),o.push("zy = y;"),l=!0;continue}if(/^abs\s*\(\s*z\s*\)$/.test(d)){o.push("zx = df_abs(zx);"),o.push("zy = df_abs(zy);"),l=!0;continue}return{dfFormula:null,reason:`Unsupported z assignment "${d}".`}}const v=Qo(d);a.has(h)?o.push(`${h} = ${v};`):(o.push(`vec2 ${h} = ${v};`),a.add(h))}return l?{dfFormula:o.map(i=>`    ${i}`).join(`
`)}:{dfFormula:null,reason:"No z assignment found."}},Ri=Object.freeze(Object.defineProperty({__proto__:null,autoGenerateDfFormula:Oa},Symbol.toStringTag,{value:"Module"})),Pi={name:"Expbrot",category:"Transcendental",formula:`
    float ex = exp(z.x);
    x = ex * cos(z.y) + c.x;
    y = ex * sin(z.y) + c.y;
    z = vec2(x, y);
  `,initialCenter:{x:-1,y:0},initialZoom:2.5,initialPalette:0,metadata:{summary:"Exponential growth and trigonometric phase create rapid regime changes.",equationLabel:"z(n+1) = exp(z(n)) + c",equationNotes:"Magnitude growth can become abrupt due to exp(Re(z)).",expensive:!0,infoPanel:{messages:[{id:"exp-core",text:"Expbrot can jump quickly between calm and explosive zones.",tone:"tip",always:!0},{id:"exp-iter-window",text:"For readability, keep iterations moderate unless you are chasing tiny fold bands.",tone:"note",always:!1,conditions:{minIterations:400,maxIterations:1400}}]}}},Ci=Object.freeze(Object.defineProperty({__proto__:null,expbrot:Pi},Symbol.toStringTag,{value:"Module"})),Ii={name:"Feather",category:"Rational",formula:`
    float z2r = z.x * z.x - z.y * z.y;
    float z2i = 2.0 * z.x * z.y;

    float z3r = z.x * z2r - z.y * z2i;
    float z3i = z.x * z2i + z.y * z2r;

    float dr = 1.0 + z2r;
    float di = z2i;
    float denom = dr * dr + di * di + 1e-12;

    x = (z3r * dr + z3i * di) / denom + c.x;
    y = (z3i * dr - z3r * di) / denom + c.y;
    z = vec2(x, y);
  `,initialCenter:{x:0,y:0},initialZoom:3,initialPalette:0,metadata:{summary:"Rational cubic-over-quadratic structure generates feathery curls and sweeps.",equationLabel:"z(n+1) = z(n)^3 / (1 + z(n)^2) + c",equationNotes:"The denominator damps growth and creates layered filament flow.",infoPanel:{messages:[{id:"feather-core",text:"Feather tends to form layered curls; follow one strand to locate repeating fans.",tone:"tip",always:!0},{id:"feather-deep",text:"At deep zoom, feather structures can appear soft until a thin seam is crossed.",tone:"highlight",always:!1,conditions:{minMagnification:6e5}}]}}},Fi=Object.freeze(Object.defineProperty({__proto__:null,feather:Ii},Symbol.toStringTag,{value:"Module"})),Li={name:"Inverse",category:"Standard",fixedIterations:50,escapeRadiusSquared:256,formula:`
    // Original inverse-square recurrence with soft pole regularization.
    float zx2 = z.x * z.x;
    float zy2 = z.y * z.y;
    float d = zx2 + zy2 + 1e-16;
    float invx = z.x / d;
    float invy = -z.y / d;
    float invx2 = invx * invx;
    float invy2 = invy * invy;
    x = (invx2 - invy2) + c.x;
    y = (2.0 * invx * invy) + c.y;
    z = vec2(x, y);
  `,df_formula:`
    vec2 zx2 = df_mul(zx, zx);
    vec2 zy2 = df_mul(zy, zy);
    vec2 d = df_add(df_add(zx2, zy2), df_set(1e-16));
    vec2 invx = df_div(zx, d);
    vec2 invy = df_neg(df_div(zy, d));
    vec2 invx2 = df_mul(invx, invx);
    vec2 invy2 = df_mul(invy, invy);
    vec2 invxy = df_mul(invx, invy);
    zx = df_add(df_sub(invx2, invy2), cx);
    zy = df_add(df_add(invxy, invxy), cy);
  `,initialCenter:{x:0,y:0},initialZoom:3,metadata:{summary:"Inversion before squaring emphasizes outer-plane dynamics and pole behavior.",equationLabel:"z(n+1) = (1 / z(n))^2 + c",equationNotes:"Original inverse-square map with soft near-origin denominator regularization.",infoPanel:{messages:[{id:"inv-core",text:"Inverse mode accentuates behavior near poles; tiny pans can radically alter motifs.",tone:"tip",always:!0},{id:"inv-precision",text:"Precision upgrades help preserve narrow pole-adjacent structures.",tone:"note",always:!1,conditions:{precisionMode:["DF64","PTB"]}}]}}},Bi=Object.freeze(Object.defineProperty({__proto__:null,inverse:Li},Symbol.toStringTag,{value:"Module"})),Ui={name:"Julia Set",category:"Standard",isJulia:!0,formula:`
    x = (z.x * z.x - z.y * z.y) + c.x;
    y = (2.0 * z.x * z.y) + c.y;
    z = vec2(x, y);
  `,df_formula:`
    vec2 x2 = df_mul(zx, zx);
    vec2 y2 = df_mul(zy, zy);
    vec2 xy = df_mul(zx, zy);
    zx = df_add(df_sub(x2, y2), cx);
    zy = df_add(df_add(xy, xy), cy);
  `,initialCenter:{x:0,y:0},initialZoom:3,initialPalette:1,metadata:{summary:"Julia topology is controlled by the seed; tiny seed shifts can reorganize the whole scene.",equationLabel:"z(n+1) = z(n)^2 + c (fixed c)",equationNotes:"Unlike Mandelbrot exploration, c stays fixed and z starts from pixel position.",safeDefaultIterations:50,autoIterationDefault:{enabled:!0,profile:"conservative"},autoIterationProfileOverrides:{conservative:{gamma:.85}},infoPanel:{messages:[{id:"j-seed",text:"Julia structure is seed-driven. Try subtle seed changes to watch topology jump.",tone:"tip",always:!0},{id:"j-mid",text:"Mid magnification often reveals dust fields and disconnected islands.",tone:"neutral",always:!1,conditions:{minMagnification:80,maxMagnification:5e4}},{id:"j-deep",text:"Deep Julia zooms can appear smooth until a boundary is crossed; keep panning slowly.",tone:"highlight",always:!1,conditions:{minMagnification:5e5}},{id:"j-cycle",text:"Cycling can exaggerate contour bands in Julia dust regions.",tone:"note",always:!1,conditions:{paletteCycling:!0}},{id:"j-precision",text:"Precision-assisted modes preserve thin Julia seams during very deep zoom.",tone:"note",always:!1,conditions:{precisionMode:["DF64","PTB"]}},{id:"j-iter-window",text:"A moderate iteration window usually keeps Julia voids visible.",tone:"note",always:!1,conditions:{minIterations:200,maxIterations:1200}}]},poiHints:["For classic dendrites, try c around -0.8 + 0.156i.","For dust-heavy sets, try c around 0.285 + 0.01i.","For pinched spirals, try c around -0.7269 + 0.1889i."]}},Di=Object.freeze(Object.defineProperty({__proto__:null,julia:Ui},Symbol.toStringTag,{value:"Module"})),ki={name:"Lambda",category:"Rational",initZFromPosition:!0,formula:`
    float oneMinusX = 1.0 - z.x;
    float oneMinusY = -z.y;
    float rx = z.x * oneMinusX - z.y * oneMinusY;
    float ry = z.x * oneMinusY + z.y * oneMinusX;

    x = c.x * rx - c.y * ry;
    y = c.x * ry + c.y * rx;
    z = vec2(x, y);
  `,initialCenter:{x:0,y:0},initialZoom:2.8,initialPalette:0,metadata:{summary:"Rational dynamics create sudden pockets of stability around chaotic folds.",equationLabel:"z(n+1) = c * z(n) * (1 - z(n))",equationNotes:"Complex logistic-style map with dense transitions between basin behavior.",experimental:!0,infoPanel:{messages:[{id:"l-core",text:"Lambda can jump from smooth basins to noisy seams with small coordinate changes.",tone:"tip",always:!0},{id:"l-overview",text:"Start broad, then pick edge pockets where dark regions touch bright turbulence.",tone:"neutral",always:!1,conditions:{maxMagnification:1e3}},{id:"l-precision",text:"Higher precision helps preserve thin transition bands in rational maps.",tone:"note",always:!1,conditions:{precisionMode:["DF64","PTB"]}},{id:"l-iter-window",text:"Moderate iterations often show basin structure more clearly than max depth.",tone:"note",always:!1,conditions:{minIterations:220,maxIterations:1100}}]},poiHints:["Probe edges where dark pockets touch bright bands around the default center.","Pan in tiny steps near basin boundaries; Lambda can flip behavior abruptly.","Use slower palette cycling while tracing transition seams."]}},Ni=Object.freeze(Object.defineProperty({__proto__:null,lambda:ki},Symbol.toStringTag,{value:"Module"})),Oi={name:"Magnet I",category:"Rational",formula:`
    float z2r = z.x * z.x - z.y * z.y;
    float z2i = 2.0 * z.x * z.y;

    float nr = z2r + c.x - 1.0;
    float ni = z2i + c.y;

    float dr = 2.0 * z.x + c.x - 2.0;
    float di = 2.0 * z.y + c.y;

    float denom = dr * dr + di * di + 1e-12;

    float qr = (nr * dr + ni * di) / denom;
    float qi = (ni * dr - nr * di) / denom;

    x = qr * qr - qi * qi;
    y = 2.0 * qr * qi;
    z = vec2(x, y);
  `,initialCenter:{x:.5,y:0},initialZoom:3,initialPalette:0,metadata:{summary:"Magnet maps use rational quotients that create magnetic basin captures.",equationLabel:"z(n+1) = ((z^2 + c - 1) / (2z + c - 2))^2",equationNotes:"Quotient dynamics can produce abrupt attraction and release regions.",infoPanel:{messages:[{id:"mag-core",text:"Magnet I often forms pocket basins around sharp transition walls.",tone:"tip",always:!0},{id:"mag-iter",text:"Higher iterations can overfill basin interiors; reduce steps to re-expose separatrices.",tone:"note",always:!1,conditions:{minIterations:900}}]}}},$i=Object.freeze(Object.defineProperty({__proto__:null,magnet1:Oi},Symbol.toStringTag,{value:"Module"})),Xi={name:"Mandelbrot",category:"Standard",formula:`
    x = (z.x * z.x - z.y * z.y) + c.x;
    y = (2.0 * z.x * z.y) + c.y;
    z = vec2(x, y);
  `,df_formula:`
    vec2 x2 = df_mul(zx, zx);
    vec2 y2 = df_mul(zy, zy);
    vec2 xy = df_mul(zx, zy);
    zx = df_add(df_sub(x2, y2), cx);
    zy = df_add(df_add(xy, xy), cy);
  `,initialCenter:{x:-.5,y:0},initialZoom:3,initialPalette:"Cosmic",metadata:{summary:"Mini-brots often appear near filament junctions and antenna-like chains.",equationLabel:"z(n+1) = z(n)^2 + c",equationNotes:"Classic quadratic escape-time system in the complex plane.",autoIterationCurve:{min:55,max:1e3,base:100,slope:44,gamma:.7,label:"Classic Void",description:"A softer ramp that preserves black interiors longer while zooming."},infoPanel:{overview:"You are viewing global structure. Large bulbs and primary lobes dominate.",boundary:"Boundary dynamics are emerging. Increase iterations gradually to avoid washing out black regions.",deep:"This zone is rich in repeats. Look for mini-structures along spiral shelves and narrow necks.",ultradeep:"At ultradeep zoom, precision and reference quality dominate visual coherence.",trivia:["The Mandelbrot set is connected, but its boundary is infinitely detailed.","Many Julia sets can be understood by choosing points from the Mandelbrot set."],messages:[{id:"m-core-tip",text:"Mini-brots cluster around filament junctions. Hunt branch points, then zoom.",tone:"tip",always:!0},{id:"m-overview",text:"At low magnification, major bulbs define the structure more than micro-detail.",tone:"neutral",always:!1,conditions:{maxMagnification:120}},{id:"m-deep",text:"Deep zone: track thin necks and spiral shelves for self-similar repeats.",tone:"highlight",always:!1,conditions:{minMagnification:1e6}},{id:"m-precision",text:"Higher precision mode is active; tiny coordinate moves can shift visible structure.",tone:"note",always:!1,conditions:{precisionMode:["DF64","PTB"]}},{id:"m-cycling",text:"Palette cycling is enabled. Pause cycling if motion hides boundary shape.",tone:"note",always:!1,conditions:{paletteCycling:!0}},{id:"m-iter-window",text:`This iteration window favors dark interiors while retaining edge texture.
 Wildly varying appearances from different palletes may be apparent.
Try setting iterations to 350-400 and soom in/out at different spots
for a different way of looking at this fractal.`,tone:"note",always:!1,conditions:{minIterations:250,maxIterations:1400}}]},poiHints:["Try the Seahorse Valley near -0.75 + 0.1i.","Try Elephant Valley around 0.28 + 0.01i.","Try the Needle near -1.25066 + 0.02012i.","Try Mini-brot Valley near -1.768778 + 0.001738i."]}},ji=Object.freeze(Object.defineProperty({__proto__:null,mandelbrot:Xi},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */const Lr=`
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,Br=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,$a=`
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_camera_rotation;
uniform vec2 u_pan;
uniform float u_cycle_phase;
uniform vec3 u_light_position;
uniform vec3 u_light_color;
uniform vec3 u_background_color;
uniform float u_background_intensity;
uniform float u_lighting;
uniform float u_zoom;
uniform float u_focal_length;
uniform float u_depth;
uniform float u_wind;
uniform float u_fog_strength;
uniform float u_mist_strength;
uniform float u_tank_enabled;
uniform vec3 u_tank_half_extents;
uniform float u_tank_refraction_strength;
uniform float u_tank_haze_strength;
uniform float u_tank_shell_strength;
uniform float u_ray_surface_epsilon;
uniform float u_ray_error_tolerance;
uniform float u_ray_step_scale;
uniform float u_ray_max_distance;

#define MAX_BULBS 4
#define PALETTE_SAMPLE_CAP 32
uniform int u_bulb_count;
uniform mat3 u_bulb_rotation_matrix[MAX_BULBS];
uniform mat3 u_bulb_inverse_rotation_matrix[MAX_BULBS];
uniform vec3 u_bulb_position[MAX_BULBS];
uniform float u_bulb_scale[MAX_BULBS];
uniform float u_bulb_color_style[MAX_BULBS];
uniform int u_bulb_surface_shader_mode[MAX_BULBS];
uniform int u_bulb_material_mode[MAX_BULBS];
uniform float u_bulb_material_intensity[MAX_BULBS];
uniform float u_bulb_orbit_trap_mix[MAX_BULBS];
uniform float u_bulb_orbit_trap_ao_strength[MAX_BULBS];
uniform float u_bulb_color_vividness[MAX_BULBS];
uniform float u_bulb_color_band_density[MAX_BULBS];
uniform float u_bulb_color_warm_cool_bias[MAX_BULBS];
uniform int u_bulb_color_space[MAX_BULBS];
uniform int u_bulb_transfer_fn[MAX_BULBS];
uniform int u_bulb_lch_chroma_coupling[MAX_BULBS];
uniform vec3 u_bulb_color[MAX_BULBS];
uniform float u_bulb_quality_hint[MAX_BULBS];
uniform int u_scene_iterations[MAX_BULBS];
uniform int u_scene_max_steps[MAX_BULBS];
uniform float u_bulb_power[MAX_BULBS];
uniform float u_bulb_bailout_radius[MAX_BULBS];
uniform int u_bulb_trig_mode[MAX_BULBS];
uniform int u_bulb_trig_term_x[MAX_BULBS];
uniform int u_bulb_trig_term_y[MAX_BULBS];
uniform int u_bulb_trig_term_z[MAX_BULBS];
uniform int u_palette_sample_count;
uniform vec3 u_palette_samples[PALETTE_SAMPLE_CAP];

#define MAX_STEPS_CAP 1024
#define ITERATIONS_CAP 128
const vec3 TANK_WATER_TINT = vec3(0.04, 0.24, 0.30);
const vec3 TANK_SHELL_TINT = vec3(0.12, 0.44, 0.52);
const float TANK_REFRACTION_INDEX = 1.33;
// Keep background stable unless/until we expose an intentional starfield control.
const float BACKGROUND_STARFIELD_STRENGTH = 0.0;

float hash(vec3 p) {
  p = fract(p * vec3(123.34, 456.21, 789.18));
  p += dot(p, p.yzx + 19.19);
  return fract((p.x + p.y) * p.z);
}

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float linearToSrgbChannel(float c) {
  if (c <= 0.0031308) return 12.92 * c;
  return (1.055 * pow(max(c, 0.0), 1.0 / 2.4)) - 0.055;
}

vec3 linearToSrgb(vec3 color) {
  return vec3(
    linearToSrgbChannel(color.r),
    linearToSrgbChannel(color.g),
    linearToSrgbChannel(color.b)
  );
}

vec3 hsvToRgb(vec3 hsv) {
  vec3 p = abs(fract(hsv.xxx + vec3(0.0, 2.0 / 3.0, 1.0 / 3.0)) * 6.0 - 3.0);
  vec3 rgb = clamp(p - 1.0, 0.0, 1.0);
  return hsv.z * mix(vec3(1.0), rgb, hsv.y);
}

float labInvF(float t) {
  float delta = 6.0 / 29.0;
  if (t > delta) return t * t * t;
  return 3.0 * delta * delta * (t - (4.0 / 29.0));
}

vec3 lchToLinearRgb(float lStar, float chroma, float hueDegrees) {
  float hue = radians(hueDegrees);
  float a = chroma * cos(hue);
  float b = chroma * sin(hue);

  float fy = (lStar + 16.0) / 116.0;
  float fx = fy + (a / 500.0);
  float fz = fy - (b / 200.0);

  float x = 0.95047 * labInvF(fx);
  float y = 1.00000 * labInvF(fy);
  float z = 1.08883 * labInvF(fz);

  return vec3(
    (3.2406 * x) + (-1.5372 * y) + (-0.4986 * z),
    (-0.9689 * x) + (1.8758 * y) + (0.0415 * z),
    (0.0557 * x) + (-0.2040 * y) + (1.0570 * z)
  );
}

vec3 applySceneColorSpace(vec3 sourceColor, float signal, int colorSpace, int lchChromaCoupling) {
  if (colorSpace == 1) {
    vec3 hsv = vec3(
      fract(sourceColor.r),
      clamp(sourceColor.g, 0.0, 1.0),
      clamp(sourceColor.b, 0.0, 1.0)
    );
    return hsvToRgb(hsv);
  }

  if (colorSpace == 2) {
    float s = clamp(signal, 0.0, 1.0);
    float v = 1.0 - pow(cos(3.141592653589793 * s), 2.0);
    float lStar = 75.0 - (75.0 * v);
    float chromaDirect = 28.0 + (75.0 - (75.0 * v));
    float chromaInverse = 28.0 + (75.0 * v);
    float chroma = (lchChromaCoupling == 1) ? chromaInverse : chromaDirect;
    float hueBase = mod(pow(360.0 * s, 1.5), 360.0);
    float hueOffset = 360.0 * fract(
      sourceColor.r
      + (sourceColor.g * 0.5)
      + (sourceColor.b * 0.25)
    );
    float hue = mod(hueBase + hueOffset, 360.0);
    return lchToLinearRgb(lStar, chroma, hue);
  }

  return sourceColor;
}

vec3 sampleScenePalette(float t) {
  int sampleCount = u_palette_sample_count;
  if (sampleCount <= 0) return vec3(0.5);
  if (sampleCount == 1) return clamp(u_palette_samples[0], 0.0, 1.0);

  float wrapped = fract(t);
  float scaled = wrapped * float(sampleCount - 1);
  vec3 sampled = clamp(u_palette_samples[0], 0.0, 1.0);

  for (int i = 0; i < (PALETTE_SAMPLE_CAP - 1); i++) {
    if (i >= (sampleCount - 1)) break;
    float left = float(i);
    float right = float(i + 1);
    if (scaled >= left && scaled <= right) {
      float localT = clamp((scaled - left) / max(right - left, 1e-5), 0.0, 1.0);
      sampled = mix(u_palette_samples[i], u_palette_samples[i + 1], localT);
      break;
    }
  }

  return clamp(sampled, 0.0, 1.0);
}

float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(
      mix(hash(i + vec3(0, 0, 0)), hash(i + vec3(1, 0, 0)), f.x),
      mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x),
      f.y
    ),
    mix(
      mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
      mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x),
      f.y
    ),
    f.z
  );
}

float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  vec3 shift = vec3(100.0);
  // 3 octaves keeps the motion readable while shaving cost on older GPUs.
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p = p * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

mat2 rot(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

vec3 rotateByYawPitch(vec3 v, vec2 rotation) {
  v.yz *= rot(rotation.y);
  v.xz *= rot(rotation.x);
  return v;
}

int sanitizeBulbCount() {
  if (u_bulb_count < 0) return 0;
  if (u_bulb_count > MAX_BULBS) return MAX_BULBS;
  return u_bulb_count;
}

int clampSceneIterations(int sceneIterations) {
  if (sceneIterations < 4) return 4;
  if (sceneIterations > ITERATIONS_CAP) return ITERATIONS_CAP;
  return sceneIterations;
}

int clampSceneMaxSteps(int sceneMaxSteps) {
  if (sceneMaxSteps < 64) return 64;
  if (sceneMaxSteps > MAX_STEPS_CAP) return MAX_STEPS_CAP;
  return sceneMaxSteps;
}

int sanitizeTrigMode(int trigMode) {
  if (trigMode == 1) return 1;
  return 0;
}

int sanitizeTrigTerm(int trigTerm) {
  if (trigTerm < 0) return 0;
  if (trigTerm > 7) return 7;
  return trigTerm;
}

float evalTrigTerm(int trigTerm, float theta, float phi) {
  int term = sanitizeTrigTerm(trigTerm);
  if (term == 0) return cos(phi);
  if (term == 1) return -cos(phi);
  if (term == 2) return cos(theta);
  if (term == 3) return -cos(theta);
  if (term == 4) return sin(phi);
  if (term == 5) return -sin(phi);
  if (term == 6) return sin(theta);
  return -sin(theta);
}

bool intersectTankBox(
  vec3 ro,
  vec3 rd,
  out float tEnter,
  out float tExit,
  out vec3 enterNormal
) {
  vec3 safeHalfExtents = max(u_tank_half_extents, vec3(0.1));
  vec3 boxMin = -safeHalfExtents;
  vec3 boxMax = safeHalfExtents;
  vec3 safeRd = vec3(
    (abs(rd.x) < 1e-5) ? (rd.x < 0.0 ? -1e-5 : 1e-5) : rd.x,
    (abs(rd.y) < 1e-5) ? (rd.y < 0.0 ? -1e-5 : 1e-5) : rd.y,
    (abs(rd.z) < 1e-5) ? (rd.z < 0.0 ? -1e-5 : 1e-5) : rd.z
  );
  vec3 invRd = 1.0 / safeRd;
  vec3 t0 = (boxMin - ro) * invRd;
  vec3 t1 = (boxMax - ro) * invRd;
  vec3 tMin = min(t0, t1);
  vec3 tMax = max(t0, t1);

  tEnter = max(max(tMin.x, tMin.y), tMin.z);
  tExit = min(min(tMax.x, tMax.y), tMax.z);
  if (tExit < max(tEnter, 0.0)) {
    enterNormal = vec3(0.0);
    return false;
  }

  if (tMin.x > tMin.y && tMin.x > tMin.z) {
    enterNormal = vec3(-sign(safeRd.x), 0.0, 0.0);
  } else if (tMin.y > tMin.z) {
    enterNormal = vec3(0.0, -sign(safeRd.y), 0.0);
  } else {
    enterNormal = vec3(0.0, 0.0, -sign(safeRd.z));
  }
  return true;
}

float mandelbulb(
  vec3 p,
  float power,
  float bailoutRadius,
  int trigMode,
  int trigTermX,
  int trigTermY,
  int trigTermZ,
  int sceneIterations,
  bool useOrbitTraps,
  out float orbit,
  out vec3 planeTrap,
  out float originTrap
) {
  float safePowerMagnitude = max(abs(power), 0.25);
  float signedPower = power < 0.0 ? -safePowerMagnitude : safePowerMagnitude;
  float safeBailout = max(abs(bailoutRadius), 1.05);
  vec3 z = p;
  float dr = 1.0;
  float r = 0.0;
  orbit = 1e10;
  planeTrap = vec3(1e10);
  originTrap = 1e10;

  for (int i = 0; i < ITERATIONS_CAP; i++) {
    if (i >= sceneIterations) break;
    r = length(z);
    if (r > safeBailout) break;
    orbit = min(orbit, r);
    if (useOrbitTraps) {
      planeTrap = min(planeTrap, abs(z));
      originTrap = min(originTrap, r);
    }
    float theta = acos(z.z / max(r, 1e-8));
    float phi = atan(z.y, z.x);
    dr = pow(max(r, 1e-8), safePowerMagnitude - 1.0) * safePowerMagnitude * dr + 1.0;
    float zr = pow(max(r, 1e-8), safePowerMagnitude);
    if (signedPower < 0.0) {
      zr = 1.0 / max(zr, 1e-8);
    }
    theta = theta * signedPower;
    phi = phi * signedPower;
    vec3 direction;
    if (sanitizeTrigMode(trigMode) == 1) {
      direction = vec3(
        evalTrigTerm(trigTermX, theta, phi),
        evalTrigTerm(trigTermY, theta, phi),
        evalTrigTerm(trigTermZ, theta, phi)
      );
      float directionLength = length(direction);
      direction = directionLength > 1e-6
        ? (direction / directionLength)
        : vec3(0.0, 0.0, 1.0);
    } else {
      direction = vec3(
        sin(theta) * cos(phi),
        sin(phi) * sin(theta),
        cos(theta)
      );
    }
    z = zr * direction;
    z += p;
  }

  return 0.5 * log(max(r, 1e-8)) * r / max(dr, 1e-8);
}

float mapBulb(vec3 pWorld, int bulbIndex, out float orbit, out vec3 planeTrap, out float originTrap) {
  float bulbScale = max(u_bulb_scale[bulbIndex], 0.05);
  vec3 pLocal = (u_bulb_inverse_rotation_matrix[bulbIndex] * (pWorld - u_bulb_position[bulbIndex])) / bulbScale;
  int sceneIterations = clampSceneIterations(u_scene_iterations[bulbIndex]);
  bool useOrbitTraps = (u_bulb_surface_shader_mode[bulbIndex] != 0);
  float bulbPower = u_bulb_power[bulbIndex];
  float bulbBailoutRadius = max(1.05, abs(u_bulb_bailout_radius[bulbIndex]));
  int bulbTrigMode = sanitizeTrigMode(u_bulb_trig_mode[bulbIndex]);
  int bulbTrigTermX = sanitizeTrigTerm(u_bulb_trig_term_x[bulbIndex]);
  int bulbTrigTermY = sanitizeTrigTerm(u_bulb_trig_term_y[bulbIndex]);
  int bulbTrigTermZ = sanitizeTrigTerm(u_bulb_trig_term_z[bulbIndex]);
  return mandelbulb(
    pLocal,
    bulbPower,
    bulbBailoutRadius,
    bulbTrigMode,
    bulbTrigTermX,
    bulbTrigTermY,
    bulbTrigTermZ,
    sceneIterations,
    useOrbitTraps,
    orbit,
    planeTrap,
    originTrap
  ) * bulbScale;
}

float mapScene(vec3 pWorld, out float orbit, out vec3 planeTrap, out float originTrap, out int objectId) {
  int bulbCount = sanitizeBulbCount();
  float bestDistance = 1e10;
  orbit = 0.0;
  planeTrap = vec3(1e10);
  originTrap = 1e10;
  objectId = 0;

  for (int i = 0; i < MAX_BULBS; i++) {
    if (i >= bulbCount) break;
    float bulbOrbit = 0.0;
    vec3 bulbPlaneTrap = vec3(1e10);
    float bulbOriginTrap = 1e10;
    float bulbDistance = mapBulb(pWorld, i, bulbOrbit, bulbPlaneTrap, bulbOriginTrap);
    if (bulbDistance < bestDistance) {
      bestDistance = bulbDistance;
      orbit = bulbOrbit;
      planeTrap = bulbPlaneTrap;
      originTrap = bulbOriginTrap;
      objectId = i;
    }
  }

  return bestDistance;
}

float mapSimple(vec3 pWorld) {
  float o;
  vec3 planeTrap;
  float originTrap;
  int objectId;
  return mapScene(pWorld, o, planeTrap, originTrap, objectId);
}

vec3 getNormal(vec3 pWorld) {
  vec2 e = vec2(0.001, 0.0);
  return normalize(vec3(
    mapSimple(pWorld + e.xyy) - mapSimple(pWorld - e.xyy),
    mapSimple(pWorld + e.yxy) - mapSimple(pWorld - e.yxy),
    mapSimple(pWorld + e.yyx) - mapSimple(pWorld - e.yyx)
  ));
}

float calcAO(vec3 pWorld, vec3 nWorld) {
  float occ = 0.0;
  float sca = 1.0;
  for (int i = 0; i < 5; i++) {
    float hr = 0.01 + 0.12 * float(i) / 4.0;
    float d = mapSimple(pWorld + nWorld * hr);
    occ += -(d - hr) * sca;
    sca *= 0.95;
  }
  return clamp(1.0 - 3.0 * occ, 0.0, 1.0);
}

float softShadow(vec3 roWorld, vec3 rdWorld, float mint, float tmax) {
  float res = 1.0;
  float t = mint;
  for (int i = 0; i < 18; i++) {
    float h = mapSimple(roWorld + rdWorld * t);
    res = min(res, 16.0 * h / t);
    t += clamp(h, 0.01, 0.3);
    if (h < 0.001 || t > tmax) break;
  }
  return clamp(res, 0.0, 1.0);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
  vec2 screenUV = gl_FragCoord.xy / u_resolution.xy;
  float pixelSize = 1.0 / max(u_resolution.x * 3.0, 1.0);
  float raySurfaceEpsilon = clamp(u_ray_surface_epsilon, 0.00001, 0.01);
  float rayErrorTolerance = clamp(u_ray_error_tolerance, 0.03, 2.0);
  float rayStepScale = clamp(u_ray_step_scale, 0.2, 1.8);
  float rayMaxDistance = clamp(u_ray_max_distance, 2.0, 120.0);
  float focalLength = clamp(u_focal_length, 0.25, 6.0);
  int bulbCount = sanitizeBulbCount();
  bool hasBulbs = bulbCount > 0;
  int primarySceneMaxSteps = hasBulbs ? clampSceneMaxSteps(u_scene_max_steps[0]) : 64;

  uv += u_pan;

  vec3 sceneRo = vec3(0.0, 0.0, u_depth);
  vec3 sceneRd = normalize(vec3(uv, u_zoom * focalLength));

  sceneRo = rotateByYawPitch(sceneRo, u_camera_rotation);
  sceneRd = normalize(rotateByYawPitch(sceneRd, u_camera_rotation));

  vec3 ro = sceneRo;
  vec3 rd = sceneRd;
  bool tankEnabled = (u_tank_enabled > 0.5);
  float tankRefractionStrength = clamp(u_tank_refraction_strength, 0.0, 1.0);
  float tankHazeStrength = clamp(u_tank_haze_strength, 0.0, 2.5);
  float tankShellStrength = clamp(u_tank_shell_strength, 0.0, 1.0);
  bool rayInsideTank = false;
  float tankPathLength = 0.0;
  vec3 tankEntryNormal = vec3(0.0);
  if (tankEnabled) {
    float tankEntryT = 0.0;
    float tankExitT = 0.0;
    vec3 entryNormal = vec3(0.0);
    if (intersectTankBox(sceneRo, sceneRd, tankEntryT, tankExitT, entryNormal)) {
      float clampedEntryT = max(tankEntryT, 0.0);
      tankPathLength = max(0.0, tankExitT - clampedEntryT);
      tankEntryNormal = entryNormal;
      rayInsideTank = tankPathLength > 0.0;
      vec3 shellPoint = sceneRo + (sceneRd * clampedEntryT);
      vec3 refracted = refract(sceneRd, entryNormal, 1.0 / TANK_REFRACTION_INDEX);
      if (dot(refracted, refracted) < 1e-6) {
        refracted = sceneRd;
      }
      rd = normalize(mix(sceneRd, refracted, tankRefractionStrength));
      ro = shellPoint + (rd * max(0.0002, raySurfaceEpsilon * 3.0));
    }
  }

  float distToCenter = length(screenUV - vec2(0.5));
  vec3 backgroundBase = clamp(u_background_color, vec3(0.0), vec3(1.0))
    * clamp(u_background_intensity, 0.0, 2.5);
  vec3 bgColor = mix(backgroundBase, vec3(0.0), smoothstep(0.2, 0.8, distToCenter));

  float stars = 0.0;
  if (BACKGROUND_STARFIELD_STRENGTH > 0.0) {
    for (float i = 1.0; i <= 3.0; i++) {
      vec2 starUV = uv * (i * 150.0);
      starUV += vec2(u_time * 0.02 * i, u_time * 0.01);
      float h = hash12(floor(starUV));
      if (h > 0.995) {
        float m = sin(u_time * 2.0 + h * 6.28) * 0.5 + 0.5;
        stars += pow(h, 10.0) * m * (1.0 / i);
      }
    }
  }
  vec3 starTint = mix(vec3(0.8, 0.9, 1.0), clamp(backgroundBase + vec3(0.45), 0.0, 2.0), 0.25);
  vec3 color = bgColor + (stars * starTint * BACKGROUND_STARFIELD_STRENGTH);

  float t = 0.0;
  float orbit = 0.0;
  vec3 planeTrap = vec3(1e10);
  float originTrap = 1e10;
  float finalOrbit = 0.0;
  vec3 finalPlaneTrap = vec3(1e10);
  float finalOriginTrap = 1e10;
  float glow = 0.0;
  float fogDensity = 0.0;
  float bestError = 1e9;
  float bestT = 0.0;
  float bestOrbit = 0.0;
  vec3 bestPlaneTrap = vec3(1e10);
  float bestOriginTrap = 1e10;
  int rayObjectId = 0;
  int finalObjectId = 0;
  int bestObjectId = 0;
  float overshoot = 0.0;
  float prevD = 1000.0;
  float colorSignal = 0.5;
  bool surfaceHit = false;
  bool hit = false;

  if (hasBulbs) {
    for (int i = 0; i < MAX_STEPS_CAP; i++) {
      if (i >= primarySceneMaxSteps) break;
      vec3 pWorld = ro + rd * t;
      float d = mapScene(pWorld, orbit, planeTrap, originTrap, rayObjectId);
      float error = d / max(t, 0.001);

      if (error < bestError) {
        bestError = error;
        bestT = t;
        bestOrbit = orbit;
        bestObjectId = rayObjectId;
        bestPlaneTrap = planeTrap;
        bestOriginTrap = originTrap;
      }

      if (t < 5.0) {
        float warp = noise(pWorld * 0.5 + u_time * 0.2 * u_wind);
        float n = fbm(pWorld * 2.4 + warp + u_time * 0.35 * u_wind);
        fogDensity += n * exp(-d * 6.0) * 0.025 * u_fog_strength;
      }

      glow += 0.01 / (0.01 + d * d);

      if (d < raySurfaceEpsilon) {
        surfaceHit = true;
        finalOrbit = orbit;
        finalObjectId = rayObjectId;
        finalPlaneTrap = planeTrap;
        finalOriginTrap = originTrap;
        break;
      }
      if (error < pixelSize * rayErrorTolerance || t > rayMaxDistance) break;

      float stepSize = d;
      if (d > overshoot) {
        overshoot = 0.4 * d * d / max(prevD, 1e-4);
        stepSize = d + overshoot;
        prevD = d;
      } else {
        overshoot = 0.0;
        prevD = 1000.0;
        stepSize = d * 0.75;
      }
      t += clamp(stepSize * rayStepScale, raySurfaceEpsilon * 0.5, 0.75);
    }

    if (surfaceHit) {
      hit = true;
    } else if (bestError < pixelSize * 1.25 && bestT > 0.0) {
      hit = true;
      t = bestT;
      finalOrbit = bestOrbit;
      finalObjectId = bestObjectId;
      finalPlaneTrap = bestPlaneTrap;
      finalOriginTrap = bestOriginTrap;
    }
  }

  int shadedBulbIndex = 0;
  if (hit && finalObjectId >= 0 && finalObjectId < bulbCount) {
    shadedBulbIndex = finalObjectId;
  }
  vec3 haloColor = hasBulbs ? u_bulb_color[shadedBulbIndex] : vec3(0.0);
  float colorStyle = hasBulbs ? clamp(u_bulb_color_style[shadedBulbIndex], 0.0, 1.0) : 0.0;
  float vividness = hasBulbs ? clamp(u_bulb_color_vividness[shadedBulbIndex], 0.0, 2.25) : 0.9;
  float bandDensity = hasBulbs ? clamp(u_bulb_color_band_density[shadedBulbIndex], 0.5, 2.5) : 1.0;
  float warmCoolBias = hasBulbs ? clamp(u_bulb_color_warm_cool_bias[shadedBulbIndex], 0.0, 1.0) : 0.5;
  color += haloColor * glow * 0.015;
  color += haloColor * fogDensity * 0.4;

  if (hit) {
    vec3 pWorld = ro + rd * t;
    mat3 bulbInverseRotationMatrix = u_bulb_inverse_rotation_matrix[shadedBulbIndex];
    vec3 bulbPosition = u_bulb_position[shadedBulbIndex];
    float bulbScale = max(u_bulb_scale[shadedBulbIndex], 0.05);
    vec3 pObject = (bulbInverseRotationMatrix * (pWorld - bulbPosition)) / bulbScale;
    vec3 nWorld = getNormal(pWorld);
    vec3 nObject = normalize(bulbInverseRotationMatrix * nWorld);
    vec3 lightDir = normalize(u_light_position - pWorld);
    int surfaceShaderMode = u_bulb_surface_shader_mode[shadedBulbIndex];
    bool useOrbitTraps = (surfaceShaderMode != 0);

    float qualityHint = clamp(u_bulb_quality_hint[shadedBulbIndex], 0.0, 1.0);
    float lowQualityMix = smoothstep(0.28, 0.62, qualityHint);
    float ao = 1.0;
    float shadow = 1.0;
    if (qualityHint > 0.28) {
      ao = calcAO(pWorld, nWorld);
      shadow = softShadow(pWorld, lightDir, 0.02, 2.5);
      ao = mix(1.0, ao, lowQualityMix);
      shadow = mix(1.0, shadow, lowQualityMix);
    }

    float orbitTone = pow(clamp(finalOrbit, 0.0, 1.0), 0.55);
    colorSignal = orbitTone;
    float phase = u_cycle_phase;
    float bulbPowerMagnitude = max(abs(u_bulb_power[shadedBulbIndex]), 0.25);
    float powerBandScale = clamp(pow(bulbPowerMagnitude / 8.0, 0.6), 0.45, 2.4);
    float contour = fract(orbitTone * (14.0 * bandDensity * powerBandScale) + t * 0.08 + phase * 0.35);
    float ridgeMix = smoothstep(0.18, 0.82, contour);
    float fineRidge = 0.5 + 0.5 * cos(6.28318 * (orbitTone * (28.0 * bandDensity * powerBandScale) + t * 0.16 + phase));
    float paletteCoord = (
      orbitTone * (0.9 + (0.35 * powerBandScale))
      + (contour * 0.18)
      + (phase * 0.03)
    );
    vec3 paletteBand = sampleScenePalette(paletteCoord);
    vec3 paletteAccent = sampleScenePalette(paletteCoord + 0.12 + (0.08 * fineRidge));
    vec3 contourInk = mix(paletteAccent, vec3(0.98, 0.92, 0.82), pow(fineRidge, 6.0) * 0.25);
    vec3 vividBase = mix(paletteBand, contourInk, 0.35 * ridgeMix);
    vividBase = mix(vividBase, paletteAccent, 0.18 + (0.22 * pow(fineRidge, 4.0)));
    float vividLuma = dot(vividBase, vec3(0.299, 0.587, 0.114));
    float vividSat = 1.15 + (0.65 * vividness);
    vividBase = clamp(mix(vec3(vividLuma), vividBase, vividSat), 0.0, 1.0);

    vec3 themeShadow = vec3(0.10, 0.12, 0.16);
    vec3 themeLight = vec3(0.96, 0.93, 0.88);
    vec3 themeBase = mix(themeShadow, themeLight, clamp(pow(orbitTone, 0.45), 0.0, 1.0));
    vec3 subtlePalette = sampleScenePalette((orbitTone * 0.35) + (phase * 0.015));
    themeBase *= mix(vec3(1.0), clamp(subtlePalette + vec3(0.2), 0.0, 1.4), 0.18);
    themeBase *= mix(vec3(1.0), clamp(haloColor * 1.35 + vec3(0.05), 0.0, 1.0), 0.82);
    themeBase *= mix(vec3(0.82, 0.94, 1.00), vec3(1.08, 0.96, 0.86), warmCoolBias);
    themeBase = clamp(themeBase, 0.0, 1.0);

    vec3 baseColor = mix(themeBase, vividBase, colorStyle);
    float trapMix = clamp(u_bulb_orbit_trap_mix[shadedBulbIndex], 0.0, 1.5);
    float trapAoStrength = clamp(u_bulb_orbit_trap_ao_strength[shadedBulbIndex], 0.0, 2.5);
    vec3 trapSignal = clamp(
      exp(-clamp(finalPlaneTrap, vec3(0.0), vec3(3.0)) * (2.1 + bandDensity * 0.5)),
      0.0,
      1.0
    );
    float trapWeight = max(dot(trapSignal, vec3(1.0)), 1e-4);
    vec3 trapWeights = trapSignal / trapWeight;

    vec3 trapXColor = clamp(mix(vec3(0.95, 0.40, 0.25), haloColor * vec3(1.35, 0.82, 0.70), 0.60), 0.0, 1.0);
    vec3 trapYColor = clamp(mix(vec3(0.22, 0.72, 0.95), haloColor.yzx * vec3(0.78, 1.25, 1.12), 0.60), 0.0, 1.0);
    vec3 trapZColor = clamp(mix(vec3(0.96, 0.88, 0.32), haloColor.zxy * vec3(1.08, 0.92, 1.28), 0.60), 0.0, 1.0);
    vec3 trapPaletteColor =
      (trapWeights.x * trapXColor) +
      (trapWeights.y * trapYColor) +
      (trapWeights.z * trapZColor);
    float trapRidge = pow(clamp(max(max(trapSignal.x, trapSignal.y), trapSignal.z), 0.0, 1.0), 3.0);
    trapPaletteColor = mix(trapPaletteColor, vec3(0.98, 0.94, 0.82), trapRidge * 0.22);

    vec3 orbitBaseColor = mix(baseColor, trapPaletteColor, min(trapMix, 1.0));
    if (trapMix > 1.0) {
      orbitBaseColor = mix(orbitBaseColor, trapPaletteColor * 1.12, trapMix - 1.0);
    }
    orbitBaseColor = clamp(orbitBaseColor, 0.0, 1.0);

    float originTrapNorm = smoothstep(0.0, 0.85, clamp(finalOriginTrap, 0.0, 1.5));
    float trapAoMask = mix(
      1.0,
      clamp(0.30 + 0.70 * originTrapNorm, 0.0, 1.0),
      trapAoStrength / 2.5
    );

    bool useOrbitTrapPalette = (surfaceShaderMode != 0);
    bool orbitTrapUnlit = (surfaceShaderMode == 2);
    vec3 shadedBaseColor = useOrbitTrapPalette ? orbitBaseColor : baseColor;
    if (useOrbitTrapPalette) {
      colorSignal = clamp(dot(trapWeights, vec3(0.18, 0.54, 0.84)), 0.0, 1.0);
    }

    float diff = max(dot(nWorld, lightDir), 0.0);
    vec3 viewDir = normalize(ro - pWorld);
    vec3 reflectDir = reflect(-lightDir, nWorld);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 10.0);
    float sky = 0.6 + 0.4 * max(dot(nWorld, vec3(0.0, 1.0, 0.0)), 0.0);
    float back = max(0.3 + 0.7 * dot(normalize(vec3(-lightDir.x, -1.0, -lightDir.z)), nWorld), 0.0);

    vec3 lightTint = clamp(u_light_color, vec3(0.0), vec3(2.0));
    vec3 sunColor = vec3(1.64, 1.27, 0.99) * lightTint;
    vec3 skyColor = mix(vec3(0.6, 1.2, 1.0), haloColor * 1.3, 0.25) * mix(vec3(1.0), lightTint, 0.35);
    vec3 lin = 4.2 * sunColor * diff * shadow;
    lin += 0.8 * back * sunColor;
    lin += 0.6 * sky * skyColor * shadow;
    lin += 3.0 * spec * shadow;

    if (orbitTrapUnlit) {
      vec3 unlit = shadedBaseColor;
      unlit *= mix(0.25 + 0.75 * ao, trapAoMask, 0.65);
      unlit *= (0.55 + 0.45 * trapRidge);
      color = unlit * mix(0.65, 1.35, clamp(u_lighting, 0.0, 2.5) / 2.5);
      color += vec3(0.04, 0.06, 0.10) * (1.0 - ao) * 0.20;
    } else {
      color = lin * shadedBaseColor * (0.30 + 0.70 * ao * trapAoMask) * u_lighting;
      color += vec3(0.06, 0.09, 0.17) * (1.0 - ao) * 0.18;

      float rim = pow(1.0 - max(dot(nWorld, -rd), 0.0), 3.0);
      float rimStrength = useOrbitTrapPalette ? 0.42 : 0.35;
      color += mix(vec3(0.95, 0.75, 0.48), haloColor, 0.45) * rim * rimStrength * u_lighting;
      color += vec3(0.1, 0.3, 0.4) * (1.0 - ao) * 0.2 * u_lighting;
      if (useOrbitTrapPalette) {
        color += trapPaletteColor * trapRidge * 0.08 * u_lighting;
      }
    }

    int materialMode = u_bulb_material_mode[shadedBulbIndex];
    float materialIntensity = clamp(u_bulb_material_intensity[shadedBulbIndex], 0.0, 2.5);
    float materialBlend = clamp(materialIntensity / 2.5, 0.0, 1.0);
    float rimMaterial = pow(1.0 - max(dot(nWorld, -rd), 0.0), 3.0);

    if (materialMode == 1) {
      vec3 reflectView = reflect(-viewDir, nWorld);
      float skyMix = smoothstep(-0.35, 0.65, reflectView.y);
      vec3 env = mix(vec3(0.06, 0.07, 0.09), vec3(0.52, 0.74, 1.08), skyMix);
      float horizon = exp(-12.0 * abs(reflectView.y));
      env += vec3(0.95, 0.85, 0.72) * horizon * 0.15;
      vec3 sunRefDir = normalize(vec3(0.35, 0.42, -0.84));
      float glint = pow(max(dot(reflectView, sunRefDir), 0.0), 120.0) * (0.7 + 2.2 * materialBlend);
      vec3 chromeTint = mix(vec3(0.88, 0.90, 0.94), clamp(haloColor + vec3(0.35), 0.0, 1.0), 0.18);
      vec3 chrome = env * chromeTint + vec3(glint);
      chrome = mix(chrome, shadedBaseColor * 0.35, 0.25);
      color = mix(color, chrome, 0.45 + 0.50 * materialBlend);
      color += chromeTint * rimMaterial * (0.08 + 0.20 * materialBlend);
    } else if (materialMode == 2) {
      vec3 flamePos = pObject * (4.5 + bandDensity * 1.6);
      flamePos += vec3(0.0, u_time * (0.9 + u_wind * 0.35), 0.0);
      float flameNoise = fbm(flamePos + vec3(0.0, t * 0.2, 0.0));
      float heatSeed = useOrbitTrapPalette ? trapRidge : smoothstep(0.2, 0.85, fineRidge);
      float heat = clamp(0.22 + 0.58 * flameNoise + 0.25 * heatSeed + 0.28 * rimMaterial, 0.0, 1.0);
      vec3 ember = mix(vec3(0.95, 0.12, 0.03), vec3(1.05, 0.78, 0.16), smoothstep(0.18, 0.95, heat));
      vec3 whiteHot = vec3(1.20, 1.02, 0.78) * pow(max(heat - 0.7, 0.0), 2.0) * 3.2;
      vec3 emissive = ember * (0.30 + 1.55 * heat) + whiteHot;
      emissive *= (0.35 + 1.25 * materialBlend);
      color = color * (0.72 - 0.28 * materialBlend) + emissive;
      color += haloColor * rimMaterial * (0.10 + 0.32 * materialBlend);
    }
  }

  float mist = 0.0;
  vec3 mpos1 = vec3(uv * 4.5, u_time * 0.08 * u_wind);
  mpos1.x -= u_time * 0.8 * u_wind;
  float m1 = fbm(mpos1);
  mist += smoothstep(0.45, 0.85, m1) * 0.08 * u_mist_strength;

  vec3 mpos2 = vec3(uv * 9.0, u_time * 0.045 * u_wind);
  mpos2.x -= u_time * 0.4 * u_wind;
  float m2 = fbm(mpos2);
  mist += smoothstep(0.5, 0.92, m2) * 0.05 * u_mist_strength;

  vec3 mistColor = haloColor * mist;
  color += mistColor;
  if (hit) {
    color += mistColor * 0.5;
  }

  float fogAmount = clamp((t - 1.0) / (rayMaxDistance - 1.0), 0.0, 1.0);
  if (!hit) {
    colorSignal = fogAmount;
  }
  vec3 finalFogColor = mix(vec3(0.01, 0.02, 0.03), backgroundBase * 0.35, 0.6);
  float fogMix = hit ? (fogAmount * mix(0.72, 0.48, colorStyle)) : fogAmount;
  color = mix(color, finalFogColor, fogMix);
  float aerialMix = (1.0 - exp(-0.001 * t * t)) * (hit ? mix(0.65, 0.45, colorStyle) : 1.0);
  color = mix(color, bgColor, aerialMix);

  if (rayInsideTank) {
    float traveledInWater = hit ? clamp(t, 0.0, tankPathLength) : tankPathLength;
    float waterAttenuation = 1.0 - exp(-traveledInWater * (0.14 + (0.65 * tankHazeStrength)));
    float shellFresnel = pow(1.0 - clamp(abs(dot(sceneRd, tankEntryNormal)), 0.0, 1.0), 2.4);
    float edgeBoost = smoothstep(0.22, 0.9, distToCenter);
    float shellGlow = tankShellStrength * (0.08 + (0.22 * shellFresnel) + (0.14 * edgeBoost));
    color = mix(color, TANK_WATER_TINT, clamp(waterAttenuation * 0.78, 0.0, 1.0));
    color += TANK_SHELL_TINT * shellGlow;
  }

  color = pow(clamp(color, 0.0, 1.0), vec3(0.45));
  color = color * 0.6 + 0.4 * color * color * (3.0 - 2.0 * color);
  float luma = dot(color, vec3(0.299, 0.587, 0.114));
  float saturationAmount = mix(1.15, 1.55 + (0.45 * vividness), colorStyle);
  color = clamp(color * saturationAmount - vec3(luma) * (saturationAmount - 1.0), 0.0, 1.0);
  float maxC = max(color.r, max(color.g, color.b));
  float minC = min(color.r, min(color.g, color.b));
  float sat = maxC - minC;
  float vibrance = mix(0.15, 0.35 + (0.22 * vividness), colorStyle) * (1.0 - sat);
  color = clamp(color + (color - vec3(luma)) * vibrance, 0.0, 1.0);
  float vignette = 0.5 + 0.5 * pow(16.0 * screenUV.x * screenUV.y * (1.0 - screenUV.x) * (1.0 - screenUV.y), 0.7);
  color *= vignette;
  if (hit) {
    color = applySceneColorSpace(
      color,
      colorSignal,
      u_bulb_color_space[shadedBulbIndex],
      u_bulb_lch_chroma_coupling[shadedBulbIndex]
    );
  }
  color = clamp(color, 0.0, 1.0);
  if (hit && u_bulb_transfer_fn[shadedBulbIndex] == 1) {
    color = linearToSrgb(color);
  }

  gl_FragColor = vec4(color, 1.0);
}
`,qi=$a,Gi=`#version 300 es
precision highp float;
out vec4 fragColor;
${$a.replace("precision highp float;","").replace(/gl_FragColor/g,"fragColor")}
`;/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */const Wi={cyan:[0,.8,1],orange:[1,.4,0],purple:[.7,.2,1],lime:[.6,1,0]},Y={speed:.04,lighting:1,zoom:2.2,yaw:33*(Math.PI/180),pitch:-17*(Math.PI/180),depth:0,wind:.25,colorMode:"cyan"},ur=64,nr=[10,32,54],Vi=8,Hi=128,je=e=>Math.max(0,Math.min(1,e)),dt=new Map,pt=new Map;let _t=null;const cr=e=>{let t=2166136261;for(let l=0;l<e.length;l+=1)t^=e.charCodeAt(l),t=Math.imul(t,16777619);const r=(t>>>16&255)/255,o=(t>>>8&255)/255,a=(t&255)/255;return[.2+r*.7,.2+o*.7,.2+a*.7]},Zi=()=>{if(typeof document>"u")return null;const e=document.createElement("canvas");e.width=ur,e.height=1;const t=e.getContext("webgl",{alpha:!1,antialias:!1,depth:!1,stencil:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1});if(!t)return null;const r=t.createShader(t.VERTEX_SHADER);if(!r)return null;if(t.shaderSource(r,`
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `),t.compileShader(r),!t.getShaderParameter(r,t.COMPILE_STATUS))return t.deleteShader(r),null;const o=t.createBuffer();return o?(t.bindBuffer(t.ARRAY_BUFFER,o),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),t.STATIC_DRAW),{canvas:e,gl:t,quadBuffer:o,vertexShader:r}):(t.deleteShader(r),null)},Xa=()=>(_t&&!_t.gl.isContextLost()||(_t=Zi()),_t),ja=(e,t)=>{const r=e.createShader(e.FRAGMENT_SHADER);return r?(e.shaderSource(r,`
      precision highp float;
      uniform float u_sample_count;
      vec3 testPalette(float t, float cycle) {
        ${t}
      }
      void main() {
        float denom = max(u_sample_count - 1.0, 1.0);
        float t = clamp((gl_FragCoord.x - 0.5) / denom, 0.0, 1.0);
        vec3 color = clamp(testPalette(t, 0.0), 0.0, 1.0);
        gl_FragColor = vec4(color, 1.0);
      }
    `),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},Yi=e=>{const t=[];let r=Number.POSITIVE_INFINITY,o=Number.NEGATIVE_INFINITY;for(let v=0;v<ur;v+=1){const g=v*4,u=e[g]/255,y=e[g+1]/255,x=e[g+2]/255;t.push([u,y,x]),r=Math.min(r,u,y,x),o=Math.max(o,u,y,x)}const a=o-r,l=Number.isFinite(a)&&a>1e-6?t.map(([v,g,u])=>[je((v-r)/a),je((g-r)/a),je((u-r)/a)]):t;let i=0,n=0,p=0;for(const v of nr){const[g,u,y]=l[Math.min(v,l.length-1)];i+=g,n+=u,p+=y}i/=nr.length,n/=nr.length,p/=nr.length;const h=.2126*i+.7152*n+.0722*p,d=1.15;return[je(h+(i-h)*d),je(h+(n-h)*d),je(h+(p-h)*d)]},Ki=(e,t,r)=>{var g,u,y;const o=`${t}:${e??""}`,a=dt.get(o);if(a)return a;if(!e){(g=r==null?void 0:r.onFallback)==null||g.call(r,"no-formula");const x=cr(t);return dt.set(o,x),x}const l=Xa();if(!l){(u=r==null?void 0:r.onFallback)==null||u.call(r,"context-unavailable");const x=cr(t);return dt.set(o,x),x}const{canvas:i,gl:n,quadBuffer:p,vertexShader:h}=l;let d=null,v=null;try{if((i.width!==ur||i.height!==1)&&(i.width=ur,i.height=1),d=ja(n,e),!d)throw new Error("fragment shader compile failed");if(v=n.createProgram(),!v)throw new Error("program allocation failed");if(n.attachShader(v,h),n.attachShader(v,d),n.linkProgram(v),!n.getProgramParameter(v,n.LINK_STATUS))throw new Error(n.getProgramInfoLog(v)??"program link failed");n.viewport(0,0,i.width,i.height),n.disable(n.BLEND),n.disable(n.DEPTH_TEST),n.useProgram(v),n.bindBuffer(n.ARRAY_BUFFER,p);const x=n.getAttribLocation(v,"position");if(x<0)throw new Error("position attrib missing");n.enableVertexAttribArray(x),n.vertexAttribPointer(x,2,n.FLOAT,!1,0,0);const B=n.getUniformLocation(v,"u_sample_count");n.uniform1f(B,i.width),n.drawArrays(n.TRIANGLES,0,6);const P=new Uint8Array(i.width*4);n.readPixels(0,0,i.width,1,n.RGBA,n.UNSIGNED_BYTE,P);const R=Yi(P);return dt.size>256&&dt.clear(),dt.set(o,R),R}catch{(y=r==null?void 0:r.onFallback)==null||y.call(r,"sample-failed");const x=cr(t);return dt.set(o,x),x}finally{v&&n.deleteProgram(v),d&&n.deleteShader(d),n.isContextLost()&&(_t=null)}},Ji=(e,t)=>{const r=cr(e),o=new Float32Array(t*3),a=Math.max(1,t-1);for(let l=0;l<t;l+=1){const i=l/a;o[l*3+0]=je(r[0]*(.55+.75*i)+.08*(1-i)),o[l*3+1]=je(r[1]*(.65+.55*(1-i))+.05*i),o[l*3+2]=je(r[2]*(.5+.8*Math.sin(i*Math.PI))+.12*i)}return o},Qi=(e,t,r,o)=>{const a=Math.max(Vi,Math.min(Hi,Math.round(r))),l=`${t}:${e??""}:${a}`,i=pt.get(l);if(i)return i;const n=x=>{var P;(P=o==null?void 0:o.onFallback)==null||P.call(o,x);const B=Ji(t,a);return pt.size>192&&pt.clear(),pt.set(l,B),B};if(!e)return n("no-formula");const p=Xa();if(!p)return n("context-unavailable");const{canvas:h,gl:d,quadBuffer:v,vertexShader:g}=p;let u=null,y=null;try{if((h.width!==a||h.height!==1)&&(h.width=a,h.height=1),u=ja(d,e),!u)throw new Error("fragment shader compile failed");if(y=d.createProgram(),!y)throw new Error("program allocation failed");if(d.attachShader(y,g),d.attachShader(y,u),d.linkProgram(y),!d.getProgramParameter(y,d.LINK_STATUS))throw new Error(d.getProgramInfoLog(y)??"program link failed");d.viewport(0,0,h.width,h.height),d.disable(d.BLEND),d.disable(d.DEPTH_TEST),d.useProgram(y),d.bindBuffer(d.ARRAY_BUFFER,v);const x=d.getAttribLocation(y,"position");if(x<0)throw new Error("position attrib missing");d.enableVertexAttribArray(x),d.vertexAttribPointer(x,2,d.FLOAT,!1,0,0);const B=d.getUniformLocation(y,"u_sample_count");d.uniform1f(B,h.width),d.drawArrays(d.TRIANGLES,0,6);const P=new Uint8Array(h.width*4);d.readPixels(0,0,h.width,1,d.RGBA,d.UNSIGNED_BYTE,P);const R=new Float32Array(a*3);for(let w=0;w<a;w+=1){const Z=w*4,N=w*3;R[N+0]=P[Z]/255,R[N+1]=P[Z+1]/255,R[N+2]=P[Z+2]/255}return pt.size>192&&pt.clear(),pt.set(l,R),R}catch{return n("sample-failed")}finally{y&&d.deleteProgram(y),u&&d.deleteShader(u),d.isContextLost()&&(_t=null)}},es={name:"Mandelbulb",category:"Volumetric",renderMode:"scene-raymarch",sceneConfig:{sceneId:"mandelbulb",defaults:{zoom:Y.zoom,yaw:Y.yaw,pitch:Y.pitch,depth:Y.depth,speed:Y.speed,lighting:Y.lighting,wind:Y.wind,color:Wi[Y.colorMode]}},formula:`
    x = z.x + c.x;
    y = z.y + c.y;
    z = vec2(x, y);
  `,initialCenter:{x:0,y:0},initialZoom:Y.zoom,initialPalette:"Abyss",fixedIterations:192,metadata:{summary:"3D Mandelbulb rendered via signed-distance raymarching.",equationLabel:"DE(z) for Mandelbulb power 8 (raymarched)",equationNotes:"Rendered in a scene pipeline instead of the 2D escape-time formula pipeline.",expensive:!0,experimental:!0,supportsDoublePrecision:!1,supportsPerturbation:!1,supportsOrbitTrap:!1,infoPanel:{overview:"Mandelbulb runs through the scene renderer with camera yaw/pitch + volumetric effects.",boundary:"Pan to rotate the camera. Mouse wheel changes camera focal zoom.",deep:"Detail level is controlled by scene raymarch parameters (currently fixed for stability).",trivia:["Mandelbulb is a 3D analog inspired by Mandelbrot-style iteration in spherical coordinates.","This implementation keeps escape-time and scene pipelines separate for future designer/export work."]}}},ts=Object.freeze(Object.defineProperty({__proto__:null,mandelbulb:es},Symbol.toStringTag,{value:"Module"})),rs={name:"Power Phi",category:"Power",formula:`
    float p = 1.61803398;
    float r = length(z);
    float theta = atan(z.y, z.x);
    float rp = pow(r, p);
    z = vec2(rp * cos(p * theta), rp * sin(p * theta)) + c;
  `,initialCenter:{x:0,y:0},initialZoom:3,metadata:{summary:"Irrational exponent phi creates non-integer rotational growth patterns.",equationLabel:"z(n+1) = z(n)^phi + c",equationNotes:"Polar exponentiation with an irrational power distorts periodic symmetry.",experimental:!0,infoPanel:{messages:[{id:"phi-core",text:"Power Phi can create off-axis spirals that drift compared with integer powers.",tone:"tip",always:!0}]}}},os=Object.freeze(Object.defineProperty({__proto__:null,powerPhi:rs},Symbol.toStringTag,{value:"Module"})),as={name:"Power Pi",category:"Power",formula:`
    float p = 3.14159265;
    float r = length(z);
    float theta = atan(z.y, z.x);
    float rp = pow(r, p);
    z = vec2(rp * cos(p * theta), rp * sin(p * theta)) + c;
  `,initialCenter:{x:0,y:0},initialZoom:3,metadata:{summary:"Pi-power mapping creates dense angular wrapping and high-frequency branching.",equationLabel:"z(n+1) = z(n)^pi + c",equationNotes:"Large non-integer exponent amplifies angular phase effects.",experimental:!0,infoPanel:{messages:[{id:"pi-core",text:"Power Pi tends to produce aggressive angular banding around major hubs.",tone:"tip",always:!0}]}}},ns=Object.freeze(Object.defineProperty({__proto__:null,powerPi:as},Symbol.toStringTag,{value:"Module"})),is={name:"Power Tau",category:"Power",formula:`
    float p = 6.28318530;
    float r = length(z);
    float theta = atan(z.y, z.x);
    float rp = pow(r, p);
    z = vec2(rp * cos(p * theta), rp * sin(p * theta)) + c;
  `,initialCenter:{x:0,y:0},initialZoom:3,metadata:{summary:"Tau-power mapping emphasizes full-turn phase effects and tight radial separation.",equationLabel:"z(n+1) = z(n)^tau + c",equationNotes:"Exponent near 2pi introduces very sharp angular sensitivity.",experimental:!0,infoPanel:{messages:[{id:"tau-core",text:"Power Tau can look sparse until a radial seam is crossed, then detail spikes.",tone:"tip",always:!0}]}}},ss=Object.freeze(Object.defineProperty({__proto__:null,powerTau:is},Symbol.toStringTag,{value:"Module"})),ls={name:"Quartic",category:"Power",formula:`
    float x2 = z.x * z.x;
    float y2 = z.y * z.y;
    x = (x2 * x2 - 6.0 * x2 * y2 + y2 * y2) + c.x;
    y = (4.0 * z.x * z.y * (x2 - y2)) + c.y;
    z = vec2(x, y);
  `,initialCenter:{x:0,y:0},initialZoom:3,metadata:{summary:"Fourth-order recurrence expands branch density with fourfold rotational influence.",equationLabel:"z(n+1) = z(n)^4 + c",equationNotes:"Quartic maps can fill quickly, so iteration control is especially important.",infoPanel:{messages:[{id:"quartic-core",text:"Quartic patterns often reveal four-armed structures around central basins.",tone:"tip",always:!0},{id:"quartic-iter",text:"If voids disappear too early, lower iterations to restore shape readability.",tone:"note",always:!1,conditions:{minIterations:700}}]}}},cs=Object.freeze(Object.defineProperty({__proto__:null,quartic:ls},Symbol.toStringTag,{value:"Module"})),us={name:"Reciprocal Mandel-ish",category:"Transcendental",formula:`
    float z2r = z.x * z.x - z.y * z.y;
    float z2i = 2.0 * z.x * z.y;
    float denom = (z2r * z2r + z2i * z2i) + 1e-12;
    x = (z2r / denom) + c.x;
    y = (-z2i / denom) + c.y;
    z = vec2(x, y);
  `,initialCenter:{x:-1,y:0},initialZoom:2.5,initialPalette:0,metadata:{summary:"Reciprocal squaring inverts growth and creates unusual halo-like domains.",equationLabel:"z(n+1) = 1 / z(n)^2 + c",equationNotes:"Reciprocal transforms emphasize outer regions and singular neighborhoods.",experimental:!0,infoPanel:{messages:[{id:"recip-core",text:"Reciprocal maps reward slow panning near halos where inversion transitions occur.",tone:"tip",always:!0},{id:"recip-deep",text:"Deep reciprocal zooms may look simple until tiny inversion seams become visible.",tone:"highlight",always:!1,conditions:{minMagnification:4e5}}]}}},fs=Object.freeze(Object.defineProperty({__proto__:null,reciprocalMandelIsh:us},Symbol.toStringTag,{value:"Module"})),ms={name:"Tricorn",category:"Symmetry",formula:`
    x = (z.x * z.x - z.y * z.y) + c.x;
    y = (-2.0 * z.x * z.y) + c.y;
    z = vec2(x, y);
  `,initialCenter:{x:-.5,y:0},initialZoom:3,metadata:{summary:"Conjugation flips orientation and creates mirrored asymmetries.",equationLabel:"z(n+1) = conj(z(n))^2 + c",equationNotes:"The sign inversion on the imaginary term drives tricorn symmetry.",infoPanel:{messages:[{id:"t-core",text:"Tricorn highlights mirrored asymmetry; compare left/right lobes while zooming.",tone:"tip",always:!0},{id:"t-mid",text:'At medium magnification, branching motifs often fork into mirrored "antennae."',tone:"neutral",always:!1,conditions:{minMagnification:120,maxMagnification:8e4}},{id:"t-deep",text:"Deep tricorn regions can look sparse until you cross a branch seam.",tone:"highlight",always:!1,conditions:{minMagnification:1e6}},{id:"t-iter-window",text:"Try midrange iterations to keep mirrored branch silhouettes readable.",tone:"note",always:!1,conditions:{minIterations:250,maxIterations:1300}}]},poiHints:["Start near -0.5 + 0i, then pan to branch forks to find mirrored asymmetries.","Look around -0.1 + 0.75i for spiky mirrored motifs.","Explore near -0.3 - 0.5i for dense anti-holomorphic branches."]}},ds=Object.freeze(Object.defineProperty({__proto__:null,tricorn:ms},Symbol.toStringTag,{value:"Module"})),ps="Creatures",ea="KNIFE_DESIGNER_DRAFT:",Zl={name:"Creature",seedStructure:"polynomial",juliaMode:!1,power:2,gain:1,twist:0,mirror:!1,sharpen:0,wobble:0,pulse:0},Lt=(e,t,r)=>Math.max(t,Math.min(r,e)),fr=e=>({name:(e.name||"Creature").trim()||"Creature",seedStructure:e.seedStructure,juliaMode:!!e.juliaMode,power:Math.round(Lt(e.power,2,6)),gain:Number(Lt(e.gain,.2,3).toFixed(2)),twist:Number(Lt(e.twist,0,1).toFixed(2)),mirror:!!e.mirror,sharpen:Number(Lt(e.sharpen,0,1).toFixed(2)),wobble:Number(Lt(e.wobble,0,1).toFixed(2)),pulse:Number(Lt(e.pulse,0,1).toFixed(2))}),bs=e=>{const t=e.indexOf(ea);if(t<0)return null;const r=t+ea.length,o=e.indexOf(`
`,r),a=e.slice(r,o>=0?o:void 0).trim();if(!a)return null;try{const l=JSON.parse(decodeURIComponent(a));return fr(l)}catch{return null}},qa=e=>!e.juliaMode&&e.seedStructure==="polynomial"&&e.power===2&&Math.abs(e.gain-1)<1e-9&&e.twist===0&&!e.mirror&&e.sharpen===0&&e.wobble===0&&e.pulse===0,_s=e=>{const t=e.gain.toFixed(3),r=(e.twist*Math.PI).toFixed(6);if(e.seedStructure==="rational")return`
      float zx2 = z.x * z.x;
      float zy2 = z.y * z.y;
      float denom = 1.0 + (${t}) * (zx2 + zy2);
      float bx = (zx2 - zy2) / max(0.0001, denom);
      float by = (2.0 * z.x * z.y) / max(0.0001, denom);
      x = bx + c.x;
      y = by + c.y;
    `;if(e.seedStructure==="transcendental")return`
      float ex = exp(clamp(z.x * ${t}, -8.0, 8.0));
      float phase = z.y + ${r};
      x = ex * cos(phase) + c.x;
      y = ex * sin(phase) + c.y;
    `;if(e.seedStructure==="abs-folded")return`
      vec2 za = abs(z);
      float bx = (za.x * za.x - za.y * za.y) * ${t};
      float by = (2.0 * za.x * za.y) * ${t};
      x = bx + c.x;
      y = by + c.y;
    `;const o=["float px = z.x;","float py = z.y;"];for(let a=1;a<e.power;a+=1)o.push(`float tx${a} = (px * z.x) - (py * z.y);`),o.push(`float ty${a} = (px * z.y) + (py * z.x);`),o.push(`px = tx${a};`),o.push(`py = ty${a};`);return o.push(`x = (px * ${t}) + c.x;`),o.push(`y = (py * ${t}) + c.y;`),`
    ${o.join(`
    `)}
  `},hs=e=>{const t=[];if(e.twist>0){const r=(e.twist*Math.PI).toFixed(6);t.push(`
      float rot = ${r};
      float tx = (x * cos(rot)) - (y * sin(rot));
      float ty = (x * sin(rot)) + (y * cos(rot));
      x = tx;
      y = ty;
    `)}if(e.mirror&&t.push(`
      x = abs(x);
    `),e.sharpen>0){const r=(1+e.sharpen*.6).toFixed(3);t.push(`
      x = sign(x) * pow(abs(x), ${r});
      y = sign(y) * pow(abs(y), ${r});
    `)}if(e.wobble>0){const r=(e.wobble*.22).toFixed(3);t.push(`
      x += ${r} * sin((3.0 * z.y) + (2.0 * c.x));
      y += ${r} * cos((3.0 * z.x) + (2.0 * c.y));
    `)}if(e.pulse>0){const r=(e.pulse*.16).toFixed(3);t.push(`
      x += ${r} * sin(u_time + (4.0 * c.x));
      y += ${r} * cos((u_time * 0.7) + (4.0 * c.y));
    `)}return t.push(`
      z = vec2(x, y);
`),e.seedStructure==="abs-folded"&&t.push(`
      z = abs(z);
`),t.join(`
`)},Yl=e=>{const t=fr(e),r=`
    ${_s(t)}
    ${hs(t)}
  `;return{name:t.name,category:ps,formula:r,initialCenter:{x:-.5,y:0},initialZoom:2.8,initialPalette:"Cosmic",isJulia:t.juliaMode,metadata:{summary:"A user-designed creature compiled from the safe formula builder.",equationLabel:t.juliaMode?"Designer Julia Creature":"Designer Creature",equationNotes:t.juliaMode?"Generated from structured controls with fixed Julia seed mode.":"Generated from structured controls (no arbitrary shader text).",experimental:!0,supportsPerturbation:qa(t),designerDraft:t,infoPanel:{messages:[{id:"designer-creature",text:"This fractal was generated in Design Mode.",tone:"highlight",always:!0}]}}}},Kl=e=>{const t=fr(e),r=t.seedStructure==="polynomial"?`(${t.gain.toFixed(2)}) * z^${t.power}`:t.seedStructure==="rational"?`(z^2)/(1 + ${t.gain.toFixed(2)}|z|^2)`:t.seedStructure==="transcendental"?`exp(${t.gain.toFixed(2)} * Re(z)) * e^{i(Im(z)+${(t.twist*Math.PI).toFixed(2)})}`:`${t.gain.toFixed(2)} * (|Re(z)| + i|Im(z)|)^2`,o=[];t.twist>0&&o.push(`rotate(${(t.twist*180).toFixed(0)}°)`),t.mirror&&o.push("mirror-x"),t.sharpen>0&&o.push(`sharpen(${t.sharpen.toFixed(2)})`),t.wobble>0&&o.push(`wobble(${t.wobble.toFixed(2)})`),t.pulse>0&&o.push(`pulse(${t.pulse.toFixed(2)})`);const a=o.length?` |> ${o.join(" |> ")}`:"",l=t.juliaMode?"c_fixed":"c";return`z(n+1) = (${r} + ${l})${a}`},Jl=e=>{const t=fr(e),r=[{label:`seed:${t.seedStructure}`},{label:`mode:${t.juliaMode?"julia-fixed-c":"mandelbrot-pixel-c"}`},{label:`power:${t.power}`},{label:`gain:${t.gain.toFixed(2)}`}];return t.twist>0&&r.push({label:`twist:${t.twist.toFixed(2)}`}),t.mirror&&r.push({label:"mirror:true"}),t.sharpen>0&&r.push({label:`sharpen:${t.sharpen.toFixed(2)}`}),t.wobble>0&&r.push({label:`wobble:${t.wobble.toFixed(2)}`}),t.pulse>0&&r.push({label:`pulse:${t.pulse.toFixed(2)}`}),{label:"z(n+1)",children:[{label:"+",children:[{label:"transform(z)",children:r},{label:"c"}]}]}},xs=Object.assign({"../fractals/barnsley-1.ts":pi,"../fractals/buffalo.ts":_i,"../fractals/burningShip.ts":xi,"../fractals/celtic.ts":vi,"../fractals/collatz-ish.ts":Ti,"../fractals/cubic.ts":wi,"../fractals/dfFormulaGenerator.ts":Ri,"../fractals/exponential.ts":Ci,"../fractals/feaather.ts":Fi,"../fractals/inverse.ts":Bi,"../fractals/julia.ts":Di,"../fractals/lambda.ts":Ni,"../fractals/magnet-type1.ts":$i,"../fractals/mandelbrot.ts":ji,"../fractals/mandelbulb.ts":ts,"../fractals/powerPhi.ts":os,"../fractals/powerPi.ts":ns,"../fractals/powerTau.ts":ss,"../fractals/quartic.ts":cs,"../fractals/reciprocal-mandel-ish.ts":fs,"../fractals/tricorn.ts":ds}),rt={},ys=[],vs=new Set,Zr=new Set;let Ga=0;const Wa=e=>{if(typeof e!="object"||e===null)return!1;const t=e;return typeof t.name=="string"&&typeof t.category=="string"&&typeof t.formula=="string"},gs=e=>{const t=e.trim();return t.length>0?t:"Creature"},Ts=e=>{let t=2,r=`${e} ${t}`;for(;rt[r];)t+=1,r=`${e} ${t}`;return r},Va=(e,t)=>{if(e.df_formula)return e;const r=Oa(e.formula);return r.dfFormula?{...e,df_formula:r.dfFormula}:(r.reason,e)},Ha=(e,t)=>{const r=oi(e);return r.forEach(o=>{console.warn(`[Fractal metadata] ${e.name} (${t}): ${o}`)}),r},Ss=()=>{Ga+=1,Zr.forEach(e=>e())},ws=e=>e.replace(/\/\/.*$/gm,"").replace(/\s+/g,"").trim()==="x=(z.x*z.x-z.y*z.y)+c.x;y=(2.0*z.x*z.y)+c.y;z=vec2(x,y);",zs=e=>{if(e.name==="Mandelbrot")return!0;const t=bs(e.formula);return t?qa(t):ws(e.formula)};Object.entries(xs).sort(([e],[t])=>e.localeCompare(t)).forEach(([e,t])=>{var l,i,n;if(e.endsWith("index.ts"))return;const r=Object.values(t).find(Wa);if(!r)return;if(rt[r.name]){console.warn(`Duplicate fractal name "${r.name}" in ${e}; keeping the first definition.`);return}const o=Va(r),a=Ha(o,e);ys.push({name:o.name,path:e,hasMetadata:!!o.metadata,messageCount:((n=(i=(l=o.metadata)==null?void 0:l.infoPanel)==null?void 0:i.messages)==null?void 0:n.length)??0,warnings:a}),rt[o.name]=o});const ht=new Proxy(rt,{get(e,t){if(typeof t=="string"&&!isNaN(Number(t))){const r=Number(t),o=Object.keys(e);return e[o[r]]}return e[t]}}),Ql=()=>Object.keys(rt),ec=(e,t)=>{if(!Wa(e))throw new Error("Invalid fractal definition. Expected name/category/formula fields.");const r=gs((t==null?void 0:t.preferredName)??e.name),o=!!(t!=null&&t.overwriteExisting);let a=r;rt[a]&&!o&&(a=Ts(r));const i=e.category.trim().length>0?e.category:"Creatures",n=Va({...e,name:a,category:i}),p={...n.metadata??{},supportsPerturbation:zs(n)},h={...n,metadata:p};return Ha(h,"runtime"),rt[h.name]=h,vs.add(h.name),Ss(),h},tc=e=>(Zr.add(e),()=>{Zr.delete(e)}),rc=()=>Ga,oc=()=>{const e={};return Object.values(rt).forEach(t=>{e[t.category]||(e[t.category]=[]),e[t.category].push(t.name)}),Object.entries(e).map(([t,r])=>({name:t,variants:r.map(o=>({name:o}))}))},ac="Mandelbrot",ta=[[0,0],[.2,0],[-.2,0],[0,.2],[0,-.2],[.35,.35],[-.35,.35],[.35,-.35],[-.35,-.35],[.5,0],[-.5,0],[0,.5],[0,-.5]],Ur={key:"",length:0,stable:!1,refX:0,refY:0},ra=e=>{const t=Math.fround(e),r=e-t;return[t,r]},oa=(e,t,r)=>{const o=new Float32Array(r*4);let a=0,l=0;for(let i=0;i<r;i+=1){const n=a*a-l*l+e,p=2*a*l+t;a=n,l=p;const[h,d]=ra(a),[v,g]=ra(l);if(o[i*4]=h,o[i*4+1]=d,o[i*4+2]=v,o[i*4+3]=g,!Number.isFinite(a)||!Number.isFinite(l))return{data:o,length:i+1,stable:!1};if(a*a+l*l>16)return{data:o,length:i+1,stable:!1}}return{data:o,length:r,stable:!0}},Es=(e,t,r)=>{let o={refX:e.x,refY:e.y,orbit:oa(e.x,e.y,r)},a=o.orbit.stable?r+o.orbit.length:o.orbit.length;for(let l=1;l<ta.length;l+=1){const[i,n]=ta[l],p=e.x+i*t,h=e.y+n*t,d=oa(p,h,r),v=d.stable?r+d.length:d.length;v>a&&(o={refX:p,refY:h,orbit:d},a=v)}return o},Ms=({gl:e,orbitTexture:t,center:r,zoom:o,renderIterations:a,orbitCache:l})=>{const i=`${r.x}:${r.y}:${o}:${a}`;let n=l;if(l.key!==i){const h=Es(r,o,a),d=h.orbit;n={key:i,length:d.length,stable:d.stable,refX:h.refX,refY:h.refY},e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t),e.texImage2D(e.TEXTURE_2D,0,e.RGBA32F,Math.max(1,d.length),1,0,e.RGBA,e.FLOAT,d.data)}const p=n.length>=8;return{orbitCache:n,perturbationReady:p,refOffsetX:p?r.x-n.refX:0,refOffsetY:p?r.y-n.refY:0}},Yr=`
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`,Kr=`#version 300 es
  in vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`,As=({fractalNames:e,paletteNames:t,useWebGL2:r,forceDouble:o,allowPerturbation:a})=>{const l=e.map((u,y)=>{const x=ht[u];return x?{index:y,formula:x.formula}:null}).filter(u=>u!==null).map((u,y)=>`${y===0?"if":"else if"} (u_fractal_type == ${u.index}) {
        ${u.formula}
      }`).join(`
`),i=e.map((u,y)=>{const x=ht[u];return x!=null&&x.df_formula?{index:y,formula:x.df_formula}:null}).filter(u=>u!==null).map((u,y)=>`${y===0?"if":"else if"} (u_fractal_type == ${u.index}) {
        ${u.formula}
      }`).join(`
`),n=t.map((u,y)=>{const x=Qr[u];return x?{index:y,formula:x.formula}:null}).filter(u=>u!==null).map((u,y)=>`${y===0?"if":"else if"} (u_palette_type == ${u.index}) {
        ${u.formula}
      }`).join(`
`),p=e.map((u,y)=>{const x=ht[u];if(!x||x.escapeRadiusSquared===void 0)return null;const B=Number.isFinite(x.escapeRadiusSquared)?x.escapeRadiusSquared:16;return{index:y,value:B}}).filter(u=>u!==null).map((u,y)=>`${y===0?"if":"else if"} (u_fractal_type == ${u.index}) {
        bailout = ${u.value.toFixed(1)};
      }`).join(`
`),h=e.map((u,y)=>{const x=ht[u];return x?x.isJulia?`
          if (u_fractal_type == ${y}) {
            z = pos;
            c = u_julia_c;
          }
        `:x.initZFromPosition?`
          if (u_fractal_type == ${y}) {
            z = pos;
            c = pos;
          }
        `:`
        if (u_fractal_type == ${y}) {
          z = vec2(0.0);
          c = pos;
        }
      `:""}).join(`
`),d=e.map((u,y)=>{const x=ht[u];return x?x.isJulia?`
          if (u_fractal_type == ${y}) {
            zx = posx;
            zy = posy;
            cx = u_julia_cx;
            cy = u_julia_cy;
          }
        `:x.initZFromPosition?`
          if (u_fractal_type == ${y}) {
            zx = posx;
            zy = posy;
            cx = posx;
            cy = posy;
          }
        `:`
        if (u_fractal_type == ${y}) {
          zx = vec2(0.0);
          zy = vec2(0.0);
          cx = posx;
          cy = posy;
        }
      `:""}).join(`
`);return`${r?`#version 300 es
precision highp float;
out vec4 fragColor;`:"precision highp float;"}
  uniform vec2 u_resolution;
  uniform vec2 u_center;
  uniform float u_zoom;
  uniform int u_max_iterations;
  uniform int u_palette_type;
  uniform int u_fractal_type;
  uniform int u_colorizer_mode;
  uniform int u_color_space;
  uniform int u_transfer_fn;
  uniform int u_lch_chroma_coupling;
  uniform int u_orbit_trap_shape;
  uniform vec2 u_julia_c;
  uniform float u_time;
  uniform float u_cycle_phase;
  uniform float u_post_escape_steps;
  uniform float u_orbit_trap_scale;
  uniform float u_finalz_mix;
  uniform float u_stat_scale;
  uniform vec3 u_background_color;
  uniform float u_background_intensity;

  // Emulated double precision uniforms
  uniform vec2 u_center_x;
  uniform vec2 u_center_y;
  uniform vec2 u_zoom_val;
  uniform vec2 u_julia_cx;
  uniform vec2 u_julia_cy;
  ${a?`
  uniform bool u_use_perturbation;
  uniform sampler2D u_orbit_texture;
  uniform int u_orbit_length;
  uniform vec2 u_ref_offset_x;
  uniform vec2 u_ref_offset_y;
  `:""}

  vec2 quick_two_sum(float a, float b) {
    float s = a + b;
    return vec2(s, b - (s - a));
  }

  vec2 two_sum(float a, float b) {
    float s = a + b;
    float bb = s - a;
    float err = (a - (s - bb)) + (b - bb);
    return vec2(s, err);
  }

  vec2 split(float a) {
    const float splitter = 4097.0;
    float t = splitter * a;
    float hi = t - (t - a);
    float lo = a - hi;
    return vec2(hi, lo);
  }

  vec2 two_prod(float a, float b) {
    float p = a * b;
    vec2 sa = split(a);
    vec2 sb = split(b);
    float err = ((sa.x * sb.x - p) + sa.x * sb.y + sa.y * sb.x) + sa.y * sb.y;
    return vec2(p, err);
  }

  vec2 df_renorm(float hi, float lo) {
    float s = hi + lo;
    float e = lo - (s - hi);
    return vec2(s, e);
  }

  vec2 df_add(vec2 a, vec2 b) {
    vec2 s = two_sum(a.x, b.x);
    float t = a.y + b.y;
    vec2 e = two_sum(s.y, t);
    vec2 r = quick_two_sum(s.x, e.x);
    return df_renorm(r.x, r.y + e.y);
  }

  vec2 df_sub(vec2 a, vec2 b) {
    return df_add(a, vec2(-b.x, -b.y));
  }

  vec2 df_mul(vec2 a, vec2 b) {
    vec2 p = two_prod(a.x, b.x);
    float cross = (a.x * b.y) + (a.y * b.x);
    vec2 s = two_sum(p.y, cross);
    vec2 r = quick_two_sum(p.x, s.x);
    return df_renorm(r.x, r.y + s.y + (a.y * b.y));
  }

  vec2 df_set(float a) {
    return vec2(a, 0.0);
  }

  vec2 df_neg(vec2 a) {
    return vec2(-a.x, -a.y);
  }

  vec2 df_abs(vec2 a) {
    return a.x < 0.0 ? df_neg(a) : a;
  }

  vec2 df_div(vec2 a, vec2 b) {
    float bx = abs(b.x) < 1e-30 ? (b.x < 0.0 ? -1e-30 : 1e-30) : b.x;
    float q1 = a.x / bx;
    vec2 q = vec2(q1, 0.0);
    vec2 r = df_sub(a, df_mul(q, b));
    float q2 = (r.x + r.y) / bx;
    return df_add(q, vec2(q2, 0.0));
  }

  float orbitTrapDistance(vec2 z) {
    float scale = max(u_orbit_trap_scale, 1e-6);
    if (u_orbit_trap_shape == 1) {
      return abs(length(z) - scale) / scale;
    }
    if (u_orbit_trap_shape == 2) {
      return abs(max(abs(z.x), abs(z.y)) - scale) / scale;
    }
    if (u_orbit_trap_shape == 3) {
      vec2 lattice = z / scale;
      vec2 nearest = floor(lattice + vec2(0.5));
      return length(lattice - nearest);
    }
    return min(abs(z.x), abs(z.y)) / scale;
  }

  float linearToSrgbChannel(float c) {
    if (c <= 0.0031308) return 12.92 * c;
    return (1.055 * pow(max(c, 0.0), 1.0 / 2.4)) - 0.055;
  }

  vec3 linearToSrgb(vec3 color) {
    return vec3(
      linearToSrgbChannel(color.r),
      linearToSrgbChannel(color.g),
      linearToSrgbChannel(color.b)
    );
  }

  vec3 hsvToRgb(vec3 hsv) {
    vec3 p = abs(fract(hsv.xxx + vec3(0.0, 2.0 / 3.0, 1.0 / 3.0)) * 6.0 - 3.0);
    vec3 rgb = clamp(p - 1.0, 0.0, 1.0);
    return hsv.z * mix(vec3(1.0), rgb, hsv.y);
  }

  float labInvF(float t) {
    float delta = 6.0 / 29.0;
    if (t > delta) return t * t * t;
    return 3.0 * delta * delta * (t - (4.0 / 29.0));
  }

  vec3 lchToLinearRgb(float lStar, float chroma, float hueDegrees) {
    float hue = radians(hueDegrees);
    float a = chroma * cos(hue);
    float b = chroma * sin(hue);

    float fy = (lStar + 16.0) / 116.0;
    float fx = fy + (a / 500.0);
    float fz = fy - (b / 200.0);

    float x = 0.95047 * labInvF(fx);
    float y = 1.00000 * labInvF(fy);
    float z = 1.08883 * labInvF(fz);

    return vec3(
      (3.2406 * x) + (-1.5372 * y) + (-0.4986 * z),
      (-0.9689 * x) + (1.8758 * y) + (0.0415 * z),
      (0.0557 * x) + (-0.2040 * y) + (1.0570 * z)
    );
  }

  vec3 applyColorSpace(vec3 paletteColor, float colorIteration, float maxIterations) {
    if (colorIteration >= maxIterations) return vec3(0.0);

    if (u_color_space == 1) {
      vec3 hsv = vec3(
        fract(paletteColor.r),
        clamp(paletteColor.g, 0.0, 1.0),
        clamp(paletteColor.b, 0.0, 1.0)
      );
      return hsvToRgb(hsv);
    }

    if (u_color_space == 2) {
      float s = clamp(colorIteration / max(maxIterations, 1.0), 0.0, 1.0);
      float v = 1.0 - pow(cos(3.141592653589793 * s), 2.0);
      float lStar = 75.0 - (75.0 * v);
      float chromaDirect = 28.0 + (75.0 - (75.0 * v));
      float chromaInverse = 28.0 + (75.0 * v);
      float chroma = (u_lch_chroma_coupling == 1) ? chromaInverse : chromaDirect;
      float hueBase = mod(pow(360.0 * s, 1.5), 360.0);
      float hueOffset = 360.0 * fract(
        paletteColor.r
        + (paletteColor.g * 0.5)
        + (paletteColor.b * 0.25)
      );
      float hue = mod(hueBase + hueOffset, 360.0);
      return lchToLinearRgb(lStar, chroma, hue);
    }

    return paletteColor;
  }

  vec3 getColor(float color_iteration, float max_iterations) {
    if (color_iteration >= max_iterations) return vec3(0.0, 0.0, 0.0);

    float zoomDepth = max(0.0, log2(max(1.0, 1.0 / max(u_zoom, 1e-18))));
    float deepMix = smoothstep(9.0, 20.0, zoomDepth);
    float tLegacy = color_iteration * 0.1;
    float tDeep = log2(color_iteration + 1.0) * 6.0;
    float t = mix(tLegacy, tDeep, deepMix);
    float jitter = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453123) - 0.5;
    t += jitter * (0.04 * deepMix);
    float cycle = u_cycle_phase;

    ${n}
    else {
      return vec3(0.5, 0.5, 0.5);
    }
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    float iteration = 0.0;
    float max_i = float(u_max_iterations);
    float bailout = 16.0;
    float finalZX = 0.0;
    float finalZY = 0.0;
    float minTrapDistance = 1e20;
    float sumZ = 0.0;
    float sumZ2 = 0.0;
    float lyapunov = 0.0;
    ${p}

    ${a?`
    if (u_use_perturbation) {
      vec2 dcx = df_add(u_ref_offset_x, df_mul(u_zoom_val, vec2(uv.x, 0.0)));
      vec2 dcy = df_add(u_ref_offset_y, df_mul(u_zoom_val, vec2(uv.y, 0.0)));
      vec2 dzx = vec2(0.0);
      vec2 dzy = vec2(0.0);
      vec2 zrefxPrev = vec2(0.0);
      vec2 zrefyPrev = vec2(0.0);
      vec2 zxCur = vec2(0.0);
      vec2 zyCur = vec2(0.0);
      float zxh = 0.0;
      float zyh = 0.0;

      for (int i = 0; i < 200000; i++) {
        if (float(i) >= max_i || i >= u_orbit_length) break;

        vec2 dzx2 = df_mul(dzx, dzx);
        vec2 dzy2 = df_mul(dzy, dzy);
        vec2 dzxy = df_mul(dzx, dzy);

        vec2 zref_dzx = df_mul(zrefxPrev, dzx);
        vec2 zref_dzy = df_mul(zrefxPrev, dzy);
        vec2 zrefy_dzx = df_mul(zrefyPrev, dzx);
        vec2 zrefy_dzy = df_mul(zrefyPrev, dzy);

        vec2 twoZrefDzx = df_add(
          df_sub(zref_dzx, zrefy_dzy),
          df_sub(zref_dzx, zrefy_dzy)
        );
        vec2 twoZrefDzy = df_add(
          df_add(zref_dzy, zrefy_dzx),
          df_add(zref_dzy, zrefy_dzx)
        );

        dzx = df_add(df_add(df_sub(dzx2, dzy2), twoZrefDzx), dcx);
        dzy = df_add(df_add(df_add(dzxy, dzxy), twoZrefDzy), dcy);

        vec4 refPacked = texelFetch(u_orbit_texture, ivec2(i, 0), 0);
        vec2 zrefx = refPacked.rg;
        vec2 zrefy = refPacked.ba;

        zxCur = df_add(zrefx, dzx);
        zyCur = df_add(zrefy, dzy);
        zxh = zxCur.x;
        zyh = zyCur.x;
        finalZX = zxh;
        finalZY = zyh;
        minTrapDistance = min(minTrapDistance, orbitTrapDistance(vec2(zxh, zyh)));
        float mag = length(vec2(zxh, zyh));
        sumZ += mag;
        sumZ2 += mag * mag;
        lyapunov += log(max(2.0 * mag, 1e-12));
        zrefxPrev = zrefx;
        zrefyPrev = zrefy;

        if ((zxh * zxh + zyh * zyh) > bailout) break;
        iteration += 1.0;
      }

      if (iteration < max_i && iteration >= float(u_orbit_length)) {
        vec2 cx = df_add(u_center_x, df_mul(u_zoom_val, vec2(uv.x, 0.0)));
        vec2 cy = df_add(u_center_y, df_mul(u_zoom_val, vec2(uv.y, 0.0)));
        for (int j = 0; j < 200000; j++) {
          if (iteration >= max_i) break;
          vec2 x2 = df_mul(zxCur, zxCur);
          vec2 y2 = df_mul(zyCur, zyCur);
          vec2 xy = df_mul(zxCur, zyCur);
          zxCur = df_add(df_sub(x2, y2), cx);
          zyCur = df_add(df_add(xy, xy), cy);
          zxh = zxCur.x;
          zyh = zyCur.x;
          finalZX = zxh;
          finalZY = zyh;
          minTrapDistance = min(minTrapDistance, orbitTrapDistance(vec2(zxh, zyh)));
          float mag = length(vec2(zxh, zyh));
          sumZ += mag;
          sumZ2 += mag * mag;
          lyapunov += log(max(2.0 * mag, 1e-12));

          if ((zxh * zxh + zyh * zyh) > bailout) break;
          iteration += 1.0;
        }
      }

      if (iteration < max_i) {
        float zn = length(vec2(zxh, zyh));
        if (zn > 1.0) {
          float nu = log(log(zn) / log(2.0)) / log(2.0);
          iteration = iteration + 1.0 - nu;
        }
      }
    } else if (${o?"true":"false"}) {
    `:`
    if (${o?"true":"false"}) {
    `}
      vec2 posx = df_add(u_center_x, df_mul(u_zoom_val, vec2(uv.x, 0.0)));
      vec2 posy = df_add(u_center_y, df_mul(u_zoom_val, vec2(uv.y, 0.0)));
      vec2 zx = vec2(0.0);
      vec2 zy = vec2(0.0);
      vec2 cx = posx;
      vec2 cy = posy;

      ${d}

      for (int i = 0; i < 200000; i++) {
        if (float(i) >= max_i) break;

        ${i}
        else {
          vec2 x2 = df_mul(zx, zx);
          vec2 y2 = df_mul(zy, zy);
          vec2 xy = df_mul(zx, zy);
          zx = df_add(df_sub(x2, y2), cx);
          zy = df_add(df_add(xy, xy), cy);
        }

        finalZX = zx.x;
        finalZY = zy.x;
        minTrapDistance = min(minTrapDistance, orbitTrapDistance(vec2(finalZX, finalZY)));
        float mag = length(vec2(finalZX, finalZY));
        sumZ += mag;
        sumZ2 += mag * mag;
        lyapunov += log(max(2.0 * mag, 1e-12));

        if (df_add(df_mul(zx, zx), df_mul(zy, zy)).x > bailout) break;
        iteration += 1.0;
      }

      if (iteration < max_i) {
        float zn = length(vec2(zx.x, zy.x));
        if (zn > 1.0) {
          float nu = log(log(zn) / log(2.0)) / log(2.0);
          iteration = iteration + 1.0 - nu;
        }
      }
    } else {
      vec2 pos = u_center + uv * u_zoom;
      vec2 z = vec2(0.0);
      vec2 c = pos;

      ${h}

      for (int i = 0; i < 200000; i++) {
        if (float(i) >= max_i) break;
        float x;
        float y;

        ${l}
        else {
          x = (z.x * z.x - z.y * z.y) + c.x;
          y = (2.0 * z.x * z.y) + c.y;
          z = vec2(x, y);
        }

        finalZX = z.x;
        finalZY = z.y;
        minTrapDistance = min(minTrapDistance, orbitTrapDistance(vec2(finalZX, finalZY)));
        float mag = length(z);
        sumZ += mag;
        sumZ2 += mag * mag;
        lyapunov += log(max(2.0 * mag, 1e-12));

        if (dot(z, z) > bailout) break;
        iteration += 1.0;
      }

      if (iteration < max_i) {
        float zn = length(z);
        float nu = log(log(zn) / log(2.0)) / log(2.0);
        iteration = iteration + 1.0 - nu;
      }
    }

    float colorIteration = iteration;
    if (iteration >= max_i) {
      colorIteration = max_i;
    } else if (u_colorizer_mode == 1) {
      colorIteration = min(max_i - 1.0, iteration + max(0.0, u_post_escape_steps));
    } else if (u_colorizer_mode == 2) {
      float trapDist = max(minTrapDistance, 1e-9);
      float trapBands = fract(-log2(trapDist) * 0.45 + (iteration / max_i) * 0.35);
      colorIteration = clamp(trapBands * (max_i - 1.0), 0.0, max_i - 1.0);
    } else if (u_colorizer_mode == 3) {
      float angleNorm = fract((atan(finalZY, finalZX) + 3.141592653589793) / 6.283185307179586);
      float magNorm = fract(log2(max(1e-12, length(vec2(finalZX, finalZY))) + 1.0) * 0.5);
      float mixFactor = clamp(u_finalz_mix, 0.0, 1.0);
      float finalSignal = mix(angleNorm, magNorm, mixFactor);
      colorIteration = clamp(finalSignal * (max_i - 1.0), 0.0, max_i - 1.0);
    } else if (u_colorizer_mode == 4) {
      float binaryGrid = ((finalZX > 0.0) == (finalZY > 0.0)) ? 1.0 : 0.5;
      colorIteration = binaryGrid * (max_i - 1.0);
    } else if (u_colorizer_mode == 5) {
      float sampleCount = max(iteration, 1.0);
      float mean = sumZ / sampleCount;
      float variance = max(0.0, (sumZ2 / sampleCount) - (mean * mean));
      float stdDev = sqrt(variance);
      float statBands = fract(stdDev * max(u_stat_scale, 0.0));
      colorIteration = clamp(statBands * (max_i - 1.0), 0.0, max_i - 1.0);
    } else if (u_colorizer_mode == 6) {
      float sampleCount = max(iteration, 1.0);
      float avgLyapunov = lyapunov / sampleCount;
      float lyapunovNorm = 1.0 / (1.0 + exp(-avgLyapunov * 1.3));
      colorIteration = clamp(lyapunovNorm * (max_i - 1.0), 0.0, max_i - 1.0);
    }

    bool isBackground = iteration >= max_i;
    vec3 backgroundColor = clamp(u_background_color, vec3(0.0), vec3(1.0))
      * clamp(u_background_intensity, 0.0, 2.5);
    vec3 finalColor = backgroundColor;

    if (!isBackground) {
      vec3 baseColor = getColor(colorIteration, max_i);
      finalColor = applyColorSpace(baseColor, colorIteration, max_i);
      finalColor = clamp(finalColor, 0.0, 1.0);
      if (u_transfer_fn == 1) {
        finalColor = linearToSrgb(finalColor);
      }
    }

    ${r?"fragColor":"gl_FragColor"} = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
  }
`},aa=(e,t,r,o)=>{const a=e.createShader(t);if(!a){const l=t===e.VERTEX_SHADER?"vertex":"fragment";return o==null||o("warn",`WebGL could not allocate ${l} shader.`),null}if(e.shaderSource(a,r),e.compileShader(a),!e.getShaderParameter(a,e.COMPILE_STATUS)){const l=t===e.VERTEX_SHADER?"vertex":"fragment",i=e.getShaderInfoLog(a)??"Unknown shader compile failure.";return console.error("Shader compile error:",i),o==null||o("warn",`WebGL ${l} shader compile error: ${i}`),e.deleteShader(a),null}return a},Rs=({canvas:e,createFragmentSource:t,onDiagnostic:r})=>{const o={antialias:!0,preserveDrawingBuffer:!0},a=e.getContext("webgl2",o),l=a?null:e.getContext("webgl",o),i=a??l;if(!i)return r==null||r("warn","WebGL context acquisition failed."),null;const n=a?"webgl2":"webgl1",p=n==="webgl2",h=p?Kr:Yr,d=t(p),v=aa(i,i.VERTEX_SHADER,h,r),g=aa(i,i.FRAGMENT_SHADER,d,r);if(!v||!g)return v&&i.deleteShader(v),g&&i.deleteShader(g),null;const u=i.createProgram();if(!u)return r==null||r("warn","WebGL could not allocate program."),i.deleteShader(v),i.deleteShader(g),null;if(i.attachShader(u,v),i.attachShader(u,g),i.linkProgram(u),!i.getProgramParameter(u,i.LINK_STATUS)){const w=i.getProgramInfoLog(u)??"Unknown program link failure.";return console.error("Program link error:",w),r==null||r("warn",`WebGL program link error: ${w}`),i.deleteShader(v),i.deleteShader(g),i.deleteProgram(u),null}i.useProgram(u);const y=new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),x=i.createBuffer();if(!x)return r==null||r("warn","WebGL could not allocate fullscreen quad buffer."),i.deleteShader(v),i.deleteShader(g),i.deleteProgram(u),null;i.bindBuffer(i.ARRAY_BUFFER,x),i.bufferData(i.ARRAY_BUFFER,y,i.STATIC_DRAW);const B=i.getAttribLocation(u,"position");if(B<0)return r==null||r("warn","WebGL program is missing required `position` attribute."),i.deleteBuffer(x),i.deleteShader(v),i.deleteShader(g),i.deleteProgram(u),null;i.enableVertexAttribArray(B),i.vertexAttribPointer(B,2,i.FLOAT,!1,0,0);let P=null;if(p){const w=i;P=w.createTexture(),P&&(w.activeTexture(w.TEXTURE0),w.bindTexture(w.TEXTURE_2D,P),w.texParameteri(w.TEXTURE_2D,w.TEXTURE_MIN_FILTER,w.NEAREST),w.texParameteri(w.TEXTURE_2D,w.TEXTURE_MAG_FILTER,w.NEAREST),w.texParameteri(w.TEXTURE_2D,w.TEXTURE_WRAP_S,w.CLAMP_TO_EDGE),w.texParameteri(w.TEXTURE_2D,w.TEXTURE_WRAP_T,w.CLAMP_TO_EDGE))}return{backend:n,gl:i,program:u,orbitTexture:P,dispose:()=>{i.deleteBuffer(x),P&&(i.deleteTexture(P),P=null),i.deleteShader(v),i.deleteShader(g),i.deleteProgram(u)}}},Ps=900,Cs=.6,Is=.7,Fs=1400,eo=5,Ls=4,Bs=2**-23,Us=2**-44,Ds=8,ks=12,Ns=12,Os=18,$s=1.6,Xs=1.6,Dr={conservative:{min:50,max:1e3,base:100,slope:30,gamma:.9},balanced:{min:100,max:2e3,base:140,slope:70}},js=(e,t)=>{const r=Math.max(1,t);return 2*Math.max(e,1e-30)/r},na=(e,t,r)=>Math.max(1,Math.abs(e),Math.abs(t))*r,qs={contextLostCount:0,contextRestoredCount:0,contextAcquireFailures:0,paletteFallbackCount:0},bt=e=>{const t=Math.fround(e),r=e-t;return[t,r]},Gs=e=>!e||!Number.isFinite(e.min)||e.min<=0||!Number.isFinite(e.max)||e.max<=0||!Number.isFinite(e.base)||e.base<=0||!Number.isFinite(e.slope)||e.slope<0||e.min>e.max||e.gamma!==void 0&&(!Number.isFinite(e.gamma)||e.gamma<=0)?null:{min:e.min,max:e.max,base:e.base,slope:e.slope,gamma:e.gamma},Ws=e=>!(!Number.isFinite(e.min)||e.min<=0||!Number.isFinite(e.max)||e.max<=0||!Number.isFinite(e.base)||e.base<=0||!Number.isFinite(e.slope)||e.slope<0||e.min>e.max||e.gamma!==void 0&&(!Number.isFinite(e.gamma)||e.gamma<=0)),Vs=e=>{if(!e)return null;const t={};if(e.min!==void 0){if(!Number.isFinite(e.min)||e.min<=0)return null;t.min=e.min}if(e.max!==void 0){if(!Number.isFinite(e.max)||e.max<=0)return null;t.max=e.max}if(e.base!==void 0){if(!Number.isFinite(e.base)||e.base<=0)return null;t.base=e.base}if(e.slope!==void 0){if(!Number.isFinite(e.slope)||e.slope<0)return null;t.slope=e.slope}if(e.gamma!==void 0){if(!Number.isFinite(e.gamma)||e.gamma<=0)return null;t.gamma=e.gamma}return t.min!==void 0&&t.max!==void 0&&t.min>t.max?null:t},Hs=(e,t)=>{if(!t)return e;const r={...e,...t};return Ws(r)?r:e},Zs=(e,t)=>{const r=Math.max(0,Math.log2(1/Math.max(e,1e-30))),o=t.gamma??1,a=o===1?r:Math.pow(r,o),l=Math.floor(t.base+a*t.slope);return Math.min(t.max,Math.max(t.min,l))},Ys=(e,t)=>({resolution:e.getUniformLocation(t,"u_resolution"),center:e.getUniformLocation(t,"u_center"),zoom:e.getUniformLocation(t,"u_zoom"),maxIterations:e.getUniformLocation(t,"u_max_iterations"),paletteType:e.getUniformLocation(t,"u_palette_type"),fractalType:e.getUniformLocation(t,"u_fractal_type"),colorizerMode:e.getUniformLocation(t,"u_colorizer_mode"),colorSpace:e.getUniformLocation(t,"u_color_space"),transferFn:e.getUniformLocation(t,"u_transfer_fn"),lchChromaCoupling:e.getUniformLocation(t,"u_lch_chroma_coupling"),postEscapeSteps:e.getUniformLocation(t,"u_post_escape_steps"),orbitTrapShape:e.getUniformLocation(t,"u_orbit_trap_shape"),orbitTrapScale:e.getUniformLocation(t,"u_orbit_trap_scale"),finalZMix:e.getUniformLocation(t,"u_finalz_mix"),statScale:e.getUniformLocation(t,"u_stat_scale"),juliaC:e.getUniformLocation(t,"u_julia_c"),time:e.getUniformLocation(t,"u_time"),cyclePhase:e.getUniformLocation(t,"u_cycle_phase"),centerX:e.getUniformLocation(t,"u_center_x"),centerY:e.getUniformLocation(t,"u_center_y"),zoomVal:e.getUniformLocation(t,"u_zoom_val"),juliaCX:e.getUniformLocation(t,"u_julia_cx"),juliaCY:e.getUniformLocation(t,"u_julia_cy"),usePerturbation:e.getUniformLocation(t,"u_use_perturbation"),orbitTexture:e.getUniformLocation(t,"u_orbit_texture"),orbitLength:e.getUniformLocation(t,"u_orbit_length"),refOffsetX:e.getUniformLocation(t,"u_ref_offset_x"),refOffsetY:e.getUniformLocation(t,"u_ref_offset_y"),backgroundColor:e.getUniformLocation(t,"u_background_color"),backgroundIntensity:e.getUniformLocation(t,"u_background_intensity")}),ia=(e,t,r)=>{const o=e.createShader(t);return o?(e.shaderSource(o,r),e.compileShader(o),e.getShaderParameter(o,e.COMPILE_STATUS)?o:(console.error("Shader compile error:",e.getShaderInfoLog(o)),e.deleteShader(o),null)):null},sa=(e,t,r)=>{const o=ia(e,e.VERTEX_SHADER,t),a=ia(e,e.FRAGMENT_SHADER,r);if(!o||!a)return o&&e.deleteShader(o),a&&e.deleteShader(a),null;const l=e.createProgram();return l?(e.attachShader(l,o),e.attachShader(l,a),e.linkProgram(l),e.deleteShader(o),e.deleteShader(a),e.getProgramParameter(l,e.LINK_STATUS)?l:(console.error("Program link error:",e.getProgramInfoLog(l)),e.deleteProgram(l),null)):(e.deleteShader(o),e.deleteShader(a),null)},Ks=`
precision highp float;
uniform vec2 u_resolution;
uniform sampler2D u_source;
uniform float u_strength;
uniform int u_radius;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 texel = 1.0 / u_resolution;
  vec4 center = texture2D(u_source, uv);
  vec3 sum = vec3(0.0);
  vec3 minV = vec3(1.0);
  vec3 maxV = vec3(0.0);
  float count = 0.0;

  const int MAX_RADIUS = ${eo};
  for (int y = -MAX_RADIUS; y <= MAX_RADIUS; y++) {
    for (int x = -MAX_RADIUS; x <= MAX_RADIUS; x++) {
      if (abs(x) > u_radius || abs(y) > u_radius) continue;
      if ((x * x) + (y * y) > (u_radius * u_radius)) continue;
      vec2 sampleUV = clamp(uv + vec2(float(x), float(y)) * texel, vec2(0.0), vec2(1.0));
      vec3 sampleRGB = texture2D(u_source, sampleUV).rgb;
      sum += sampleRGB;
      minV = min(minV, sampleRGB);
      maxV = max(maxV, sampleRGB);
      count += 1.0;
    }
  }

  vec3 filtered = center.rgb;
  if (count > 2.0) {
    filtered = (sum - minV - maxV) / max(count - 2.0, 1.0);
  }
  vec3 mixed = mix(center.rgb, filtered, clamp(u_strength, 0.0, 1.0));
  gl_FragColor = vec4(mixed, center.a);
}
`,Js=`
precision highp float;
uniform vec2 u_resolution;
uniform sampler2D u_source;
uniform float u_strength;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 texel = 1.0 / u_resolution;
  vec4 center = texture2D(u_source, uv);
  vec3 cN = texture2D(u_source, clamp(uv + vec2(0.0, texel.y), vec2(0.0), vec2(1.0))).rgb;
  vec3 cS = texture2D(u_source, clamp(uv - vec2(0.0, texel.y), vec2(0.0), vec2(1.0))).rgb;
  vec3 cE = texture2D(u_source, clamp(uv + vec2(texel.x, 0.0), vec2(0.0), vec2(1.0))).rgb;
  vec3 cW = texture2D(u_source, clamp(uv - vec2(texel.x, 0.0), vec2(0.0), vec2(1.0))).rgb;

  vec3 sum = center.rgb + cN + cS + cE + cW;
  vec3 minV = min(center.rgb, min(cN, min(cS, min(cE, cW))));
  vec3 maxV = max(center.rgb, max(cN, max(cS, max(cE, cW))));
  vec3 filtered = (sum - minV - maxV) / 3.0;
  vec3 mixed = mix(center.rgb, filtered, clamp(u_strength, 0.0, 1.0));
  gl_FragColor = vec4(mixed, center.a);
}
`,Qs=`#version 300 es
precision highp float;
uniform vec2 u_resolution;
uniform sampler2D u_source;
uniform float u_strength;
uniform int u_radius;
out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 texel = 1.0 / u_resolution;
  vec4 center = texture(u_source, uv);
  vec3 sum = vec3(0.0);
  vec3 minV = vec3(1.0);
  vec3 maxV = vec3(0.0);
  float count = 0.0;

  const int MAX_RADIUS = ${eo};
  for (int y = -MAX_RADIUS; y <= MAX_RADIUS; y++) {
    for (int x = -MAX_RADIUS; x <= MAX_RADIUS; x++) {
      if (abs(x) > u_radius || abs(y) > u_radius) continue;
      if ((x * x) + (y * y) > (u_radius * u_radius)) continue;
      vec2 sampleUV = clamp(uv + vec2(float(x), float(y)) * texel, vec2(0.0), vec2(1.0));
      vec3 sampleRGB = texture(u_source, sampleUV).rgb;
      sum += sampleRGB;
      minV = min(minV, sampleRGB);
      maxV = max(maxV, sampleRGB);
      count += 1.0;
    }
  }

  vec3 filtered = center.rgb;
  if (count > 2.0) {
    filtered = (sum - minV - maxV) / max(count - 2.0, 1.0);
  }
  vec3 mixed = mix(center.rgb, filtered, clamp(u_strength, 0.0, 1.0));
  fragColor = vec4(mixed, center.a);
}
`,el=`#version 300 es
precision highp float;
uniform vec2 u_resolution;
uniform sampler2D u_source;
uniform float u_strength;
out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 texel = 1.0 / u_resolution;
  vec4 center = texture(u_source, uv);
  vec3 cN = texture(u_source, clamp(uv + vec2(0.0, texel.y), vec2(0.0), vec2(1.0))).rgb;
  vec3 cS = texture(u_source, clamp(uv - vec2(0.0, texel.y), vec2(0.0), vec2(1.0))).rgb;
  vec3 cE = texture(u_source, clamp(uv + vec2(texel.x, 0.0), vec2(0.0), vec2(1.0))).rgb;
  vec3 cW = texture(u_source, clamp(uv - vec2(texel.x, 0.0), vec2(0.0), vec2(1.0))).rgb;

  vec3 sum = center.rgb + cN + cS + cE + cW;
  vec3 minV = min(center.rgb, min(cN, min(cS, min(cE, cW))));
  vec3 maxV = max(center.rgb, max(cN, max(cS, max(cE, cW))));
  vec3 filtered = (sum - minV - maxV) / 3.0;
  vec3 mixed = mix(center.rgb, filtered, clamp(u_strength, 0.0, 1.0));
  fragColor = vec4(mixed, center.a);
}
`,la=(e,t,r)=>{const o=e.getAttribLocation(t,"position");o<0||(e.bindBuffer(e.ARRAY_BUFFER,r),e.enableVertexAttribArray(o),e.vertexAttribPointer(o,2,e.FLOAT,!1,0,0))},ca=(e,t,r,o)=>{e.bindTexture(e.TEXTURE_2D,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,r,o,0,e.RGBA,e.UNSIGNED_BYTE,null)},nc=({enabled:e,canvasRef:t,fractalNames:r,center:o,zoom:a,maxIterations:l,autoIterations:i,autoIterationProfile:n,overrideFractalIterationLock:p=!1,colorizerMode:h,colorSpaceMode:d,transferFunction:v,lchChromaCoupling:g,postEscapeSteps:u,orbitTrapShape:y,orbitTrapScale:x,finalZMix:B,statScale:P,paletteName:R,fractalName:w,juliaC:Z,cycleSpeed:N,sceneBackgroundColor:K,sceneBackgroundIntensity:te,resolutionScale:ie,isInteracting:q,isPreviewRender:ot,filterEnabled:qe,filterStrength:Ge,filterRadius:We,filterPasses:Re,appendDebug:ge})=>{var Pt,Zt,Yt,$t;const Te=m.useRef(null),Pe=m.useRef(null),Ve=m.useRef(null),re=m.useRef(null),se=m.useRef(null),ue=m.useRef({width:0,height:0}),Se=m.useRef(()=>{}),at=m.useRef({startTime:performance.now(),count:0,totalMs:0,lastMs:0}),Ce=m.useRef(null),Ie=m.useRef({...Ur}),nt=m.useRef(null),[pe,He]=m.useState("none"),[Ut,Dt]=m.useState({rendersPerSecond:0,lastRenderMs:0,avgRenderMs:0}),[vt,gt]=m.useState(!1),[Tt,it]=m.useState(!1),st=m.useRef(0),we=m.useRef(0),Fe=m.useRef(Z),St=m.useMemo(()=>qs,[]),kt=m.useMemo(()=>r.indexOf(w),[r,w]),le=m.useCallback((b,c)=>{ge==null||ge(b,`[renderer] ${c}`)},[ge]),Wt=m.useSyncExternalStore(mi,Ko,Ko),be=m.useMemo(()=>fi(),[Wt]),Ze=m.useMemo(()=>be.indexOf(R),[be,R]);m.useEffect(()=>{if(Ze>=0){nt.current=null;return}const b=`Active palette "${R}" is not present in renderer palette list (count=${be.length}).`;nt.current!==b&&(nt.current=b,le("warn",b))},[le,Ze,R,be.length]);const O=ht[w],Ye=O==null?void 0:O.fixedIterations,Nt=Gs((Pt=O==null?void 0:O.metadata)==null?void 0:Pt.autoIterationCurve),Le=n==="custom"?null:n,wt=Le===null?null:Vs((Yt=(Zt=O==null?void 0:O.metadata)==null?void 0:Zt.autoIterationProfileOverrides)==null?void 0:Yt[Le]),zt=Le===null?null:Hs(Dr[Le],wt),Et=n==="custom"?Nt??Dr.balanced:zt??Dr[n],ce=i?Zs(a,Et):l,J=Ye!==void 0&&!p?Math.max(1,Math.floor(Ye)):ce,lt=Math.max(0,Math.log10(1/Math.max(a,1e-18))),Ot=N>0?Math.max(.18,1/(1+Math.max(0,lt-3)*.42)):1,Mt=N>0?Math.max(Fs,Math.floor(2600-Math.max(0,lt-4)*160)):J,Ke=N>0?Math.max(Is,1-Math.max(0,lt-4)*.04):1,Je=N*Ot,ze=ot?Math.min(J,Ps):Math.min(J,Mt),Be=ot?Math.max(.5,ie*Cs):Math.max(.5,ie*Ke),Qe=m.useRef(Be),Ue=typeof window<"u"?window.innerHeight:1080,_e=js(a,Ue),Vt=na(o.x,o.y,Bs),At=na(o.x,o.y,Us),Ee=_e/Math.max(Vt,1e-30),Rt=_e/Math.max(At,1e-30),oe=!!(O!=null&&O.df_formula),$=(w==="Mandelbrot"||!!(($t=O==null?void 0:O.metadata)!=null&&$t.supportsPerturbation))&&pe==="webgl2",fe=$&&Tt,Me=oe&&vt,De=e&&qe,Ht=fe?"PTB":Me?"DF64":"F32",mr=fe?a<1e-18:Me?Rt<Xs:Ee<$s;m.useEffect(()=>{if(!oe){gt(!1);return}gt(b=>b?Ee<ks:Ee<Ds)},[oe,Ee]),m.useEffect(()=>{if(!$){it(!1);return}it(b=>b?Ee<Os:Ee<Ns)},[$,Ee]),m.useEffect(()=>{Fe.current=Z},[Z]),m.useEffect(()=>{Qe.current=Be,e&&(!q||De)&&Se.current()},[e,Be,q,De]);const he=m.useCallback(b=>{const c=se.current;c&&(b.deleteFramebuffer(c.fbA),b.deleteFramebuffer(c.fbB),b.deleteTexture(c.texA),b.deleteTexture(c.texB),b.deleteProgram(c.genericProgram.program),b.deleteProgram(c.radius1Program.program),se.current=null,ue.current={width:0,height:0})},[]),ct=m.useCallback((b,c,U)=>{const T=typeof WebGL2RenderingContext<"u"&&b instanceof WebGL2RenderingContext;let D=se.current;if(!D){const z=sa(b,T?Kr:Yr,T?Qs:Ks),F=sa(b,T?Kr:Yr,T?el:Js);if(!z||!F)return z&&b.deleteProgram(z),F&&b.deleteProgram(F),null;const Q=b.createTexture(),xe=b.createTexture(),X=b.createFramebuffer(),et=b.createFramebuffer();if(!Q||!xe||!X||!et)return Q&&b.deleteTexture(Q),xe&&b.deleteTexture(xe),X&&b.deleteFramebuffer(X),et&&b.deleteFramebuffer(et),b.deleteProgram(z),b.deleteProgram(F),null;D={genericProgram:{program:z,uniforms:{resolution:b.getUniformLocation(z,"u_resolution"),sourceTexture:b.getUniformLocation(z,"u_source"),strength:b.getUniformLocation(z,"u_strength"),radius:b.getUniformLocation(z,"u_radius")}},radius1Program:{program:F,uniforms:{resolution:b.getUniformLocation(F,"u_resolution"),sourceTexture:b.getUniformLocation(F,"u_source"),strength:b.getUniformLocation(F,"u_strength"),radius:null}},texA:Q,texB:xe,fbA:X,fbB:et},se.current=D}const M=ue.current;if(M.width!==c||M.height!==U){ca(b,D.texA,c,U),ca(b,D.texB,c,U),b.bindFramebuffer(b.FRAMEBUFFER,D.fbA),b.framebufferTexture2D(b.FRAMEBUFFER,b.COLOR_ATTACHMENT0,b.TEXTURE_2D,D.texA,0);const z=b.checkFramebufferStatus(b.FRAMEBUFFER);b.bindFramebuffer(b.FRAMEBUFFER,D.fbB),b.framebufferTexture2D(b.FRAMEBUFFER,b.COLOR_ATTACHMENT0,b.TEXTURE_2D,D.texB,0);const F=b.checkFramebufferStatus(b.FRAMEBUFFER);if(b.bindFramebuffer(b.FRAMEBUFFER,null),z!==b.FRAMEBUFFER_COMPLETE||F!==b.FRAMEBUFFER_COMPLETE)return he(b),null;ue.current={width:c,height:U}}return D},[he]),ut=m.useCallback(()=>{if(!e)return;const b=performance.now(),c=Te.current,U=Pe.current,T=Ve.current,D=re.current;if(!(!c||!U||!T||!D))try{const M=Fe.current,z=c.canvas,F=Math.max(1,Math.floor(window.innerWidth*Qe.current)),Q=Math.max(1,Math.floor(window.innerHeight*Qe.current));(z.width!==F||z.height!==Q)&&(z.width=F,z.height=Q);const xe=ae=>{c.bindFramebuffer(c.FRAMEBUFFER,ae),c.viewport(0,0,F,Q),c.useProgram(U),la(c,U,D),c.activeTexture(c.TEXTURE0),c.bindTexture(c.TEXTURE_2D,null),c.uniform2f(T.resolution,F,Q),c.uniform2f(T.center,o.x,o.y),c.uniform1f(T.zoom,a),c.uniform1i(T.maxIterations,ze),c.uniform1i(T.paletteType,Ze),c.uniform1i(T.fractalType,kt);const ee=h==="post-escape"?1:h==="orbit-trap"?2:h==="final-z"?3:h==="binary-decomposition"?4:h==="statistical"?5:h==="lyapunov"?6:0;c.uniform1i(T.colorizerMode,ee);const me=d==="hsv"?1:d==="lch"?2:0;c.uniform1i(T.colorSpace,me),c.uniform1i(T.transferFn,v==="srgb"?1:0),c.uniform1i(T.lchChromaCoupling,g==="inverse"?1:0),c.uniform1f(T.postEscapeSteps,u),c.uniform1i(T.orbitTrapShape,y==="circle"?1:y==="box"?2:y==="gaussian-lattice"?3:0),c.uniform1f(T.orbitTrapScale,x),c.uniform1f(T.finalZMix,B),c.uniform1f(T.statScale,P),c.uniform2f(T.juliaC,M.x,M.y),c.uniform1f(T.time,st.current),c.uniform1f(T.cyclePhase,we.current),c.uniform2fv(T.centerX,bt(o.x)),c.uniform2fv(T.centerY,bt(o.y)),c.uniform2fv(T.zoomVal,bt(a)),c.uniform2fv(T.juliaCX,bt(M.x)),c.uniform2fv(T.juliaCY,bt(M.y));let H=!1,ne=0,Kt=0;if($&&fe&&Ce.current&&T.usePerturbation&&T.orbitTexture&&T.orbitLength&&pe==="webgl2"){const ke=Ms({gl:c,orbitTexture:Ce.current,center:o,zoom:a,renderIterations:ze,orbitCache:Ie.current});if(Ie.current=ke.orbitCache,H=ke.perturbationReady,ne=ke.refOffsetX,Kt=ke.refOffsetY,H){const Ne=c;Ne.activeTexture(Ne.TEXTURE0),Ne.bindTexture(Ne.TEXTURE_2D,Ce.current),c.uniform1i(T.orbitTexture,0),c.uniform1i(T.orbitLength,Ie.current.length)}}T.refOffsetX&&c.uniform2fv(T.refOffsetX,bt(ne)),T.refOffsetY&&c.uniform2fv(T.refOffsetY,bt(Kt)),T.usePerturbation&&c.uniform1i(T.usePerturbation,H?1:0),T.orbitLength&&!H&&c.uniform1i(T.orbitLength,0),T.backgroundColor&&c.uniform3f(T.backgroundColor,Math.max(0,Math.min(1,K.r)),Math.max(0,Math.min(1,K.g)),Math.max(0,Math.min(1,K.b))),T.backgroundIntensity&&c.uniform1f(T.backgroundIntensity,Math.max(0,Math.min(2.5,te))),c.drawArrays(c.TRIANGLES,0,6)};if(!qe){xe(null);return}const X=ct(c,F,Q);if(!X){xe(null);return}xe(X.fbA);const et=Number.isFinite(Ge)?Ge:.7,br=Number.isFinite(We)?We:1,_r=Number.isFinite(Re)?Re:1,s=Math.max(0,Math.min(1,et)),E=Math.max(1,Math.min(eo,Math.floor(br))),f=Math.max(1,Math.min(Ls,Math.floor(_r)));let j=X.texA,C=X.texB,G=X.fbB;const k=E===1?X.radius1Program:X.genericProgram,V=c.getParameter(c.MAX_COMBINED_TEXTURE_IMAGE_UNITS)>1?1:0,ye=c.TEXTURE0+V;c.useProgram(k.program),la(c,k.program,D),c.uniform2f(k.uniforms.resolution,F,Q),c.uniform1f(k.uniforms.strength,s),k.uniforms.radius&&c.uniform1i(k.uniforms.radius,E),c.uniform1i(k.uniforms.sourceTexture,V);for(let ae=0;ae<f;ae+=1){const ee=ae===f-1;if(c.bindFramebuffer(c.FRAMEBUFFER,ee?null:G),c.viewport(0,0,F,Q),c.activeTexture(ye),c.bindTexture(c.TEXTURE_2D,j),c.drawArrays(c.TRIANGLES,0,6),!ee){const me=C;C=j,j=me,G=G===X.fbA?X.fbB:X.fbA}}c.activeTexture(c.TEXTURE0),c.bindFramebuffer(c.FRAMEBUFFER,null)}catch(M){const z=M instanceof Error?M.message:String(M);le("warn",`Render pass failed for fractal="${w}" palette="${R}": ${z}`)}finally{const M=performance.now()-b,z=at.current;z.count+=1,z.totalMs+=M,z.lastMs=M}},[e,o,a,ze,Ze,kt,h,d,v,g,u,y,x,B,P,K.r,K.g,K.b,te,Je,Me,$,fe,pe,qe,Ge,We,Re,ct,w,le,R]);m.useEffect(()=>{const b=window.setInterval(()=>{const c=performance.now(),U=at.current,T=c-U.startTime;if(T<=0)return;const D=T/1e3,M={rendersPerSecond:U.count/D,lastRenderMs:U.lastMs,avgRenderMs:U.count>0?U.totalMs/U.count:0};U.startTime=c,U.count=0,U.totalMs=0,Dt(M)},500);return()=>{window.clearInterval(b)}},[]),m.useEffect(()=>{Se.current=ut},[ut]),m.useEffect(()=>{if(!e||N<=0)return;let b,c=performance.now();const U=T=>{const D=(T-c)/1e3;c=T,st.current+=D,we.current+=D*Je;const M=ht[w];if(M!=null&&M.isJulia){const z=Fe.current;Fe.current={x:z.x+Math.sin(T*5e-4)*1e-4,y:z.y+Math.cos(T*3e-4)*1e-4}}try{(!q||De)&&Se.current()}catch(z){console.error("Animation render error:",z);const F=z instanceof Error?z.message:String(z);le("warn",`Animation loop render error: ${F}`)}finally{b=requestAnimationFrame(U)}};return b=requestAnimationFrame(U),()=>cancelAnimationFrame(b)},[e,N,Je,w,q,le,De]);const dr=m.useCallback(b=>{e&&(!Number.isFinite(b)||b===0||(we.current+=b,q||Se.current()))},[e,q]),pr=m.useCallback(()=>{e&&we.current!==0&&(we.current=0,q||Se.current())},[e,q]);return m.useEffect(()=>{if(!e){He("none");return}const b=t.current;if(!b)return;const c=Rs({canvas:b,createFragmentSource:M=>As({fractalNames:r,paletteNames:be,useWebGL2:M,forceDouble:Me&&oe,allowPerturbation:M}),onDiagnostic:(M,z)=>{le(M==="warn"?"warn":"info",z)}});if(!c){le("warn",`WebGL program init failed for fractal="${w}" palette="${R}". Renderer stayed offline; check diagnostics in debug console.`),He("none");return}le("state",`WebGL program initialized (${c.backend}) with ${r.length} fractals and ${be.length} palettes.`),He(c.backend),Te.current=c.gl,Pe.current=c.program,Ve.current=Ys(c.gl,c.program);const U=new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),T=c.gl.createBuffer();if(!T){le("warn","WebGL could not allocate renderer quad buffer after program init."),c.dispose(),He("none"),Te.current=null,Pe.current=null,Ve.current=null;return}c.gl.bindBuffer(c.gl.ARRAY_BUFFER,T),c.gl.bufferData(c.gl.ARRAY_BUFFER,U,c.gl.STATIC_DRAW),re.current=T,Ie.current={...Ur},Ce.current=c.orbitTexture;const D=()=>{Se.current()};return window.addEventListener("resize",D),D(),()=>{window.removeEventListener("resize",D),re.current&&(c.gl.deleteBuffer(re.current),re.current=null),he(c.gl),c.dispose(),Ce.current=null,Ie.current={...Ur},Ve.current=null,Pe.current===c.program&&(Pe.current=null),Te.current===c.gl&&(Te.current=null)}},[e,t,r,be,Me,oe,he,w,le,R]),m.useEffect(()=>{e&&(!q||De)&&ut()},[e,ut,q,De]),{effectiveIterations:J,isAtPrecisionLimit:mr,isDoubleActive:Me,precisionMode:Ht,rendererBackend:pe,rendererDiagnostics:St,rendererStats:Ut,render:ut,nudgeCyclePhase:dr,resetCyclePhase:pr}},tl=.005,rl=8,ol=.25,al=6,nl=.6,il=3.5,sl=-24,ll=-.45,ua=-2.6,ir=(e,t,r)=>Math.max(t,Math.min(r,e)),Za=({zoom:e,sceneDepth:t,sceneInvertZoom:r,sceneFocalLength:o})=>{const a=ir(e,tl,rl),l=ir(o,ol,al),i=r?ua/a:ua*a,n=ir(i+t,sl,ll),p=ir(1/Math.sqrt(a),nl,il);return{rawZoom:a,sceneZoom:p,focalLength:l,depthFromZoom:i,finalDepth:n}},fa=.67,cl=52,ul=24,fl=.18,Ya=1.38,Ka=.04,kr=1.2,Nr=8,ml=.08,dl=4,pl=2.399963229728653,Ae=(e,t,r)=>Math.max(t,Math.min(r,e)),Or=(e,t,r)=>e+(t-e)*r,bl=(e,t)=>{const r=Math.max(1,e),o=Math.max(1,t),a=Math.max(220,r-cl-ul*2),l=Ae(a*fa,180,a),i=Ae(o*fa,180,o);return{width:l,height:i,usableWidth:a}},_l=({viewportWidth:e,viewportHeight:t,zoom:r,sceneDepth:o,sceneInvertZoom:a,sceneFocalLength:l})=>{const i=bl(e,t),n=Za({zoom:r,sceneDepth:o,sceneInvertZoom:a,sceneFocalLength:l}),p=n.sceneZoom,h=n.focalLength,d=n.finalDepth,g=Math.max(.45,Math.abs(d))/(Math.max(1,t)*p*h),u={x:Ae(i.width*g*.5,kr,Nr),y:Ae(i.height*g*.5,kr,Nr),z:Ae(i.width*g*.5,kr,Nr)},y=Math.min(u.x,u.y,u.z),B=Ae(u.x*2*fl,.12,y*2*.88)*.5,P=Ae(B/Ya,ml,dl);return{viewport:i,halfExtents:u,targetBulbScale:P,targetBulbRadius:B}},ma=(e,t,r)=>{const o=Math.max(0,r.x-t),a=Math.max(0,r.y-t),l=Math.max(0,r.z-t);return{x:Ae(e.x,-o,o),y:Ae(e.y,-a,a),z:Ae(e.z,-l,l)}},$r=(e,t,r)=>{let o=0;for(const a of r){const l=e.x-a.x,i=e.y-a.y,n=e.z-a.z,p=Math.hypot(l,i,n),h=t+a.radius+Ka;o+=Math.max(0,h-p)}return o},ic=(e,t,r=Ka)=>{const o=e.x-t.x,a=e.y-t.y,l=e.z-t.z,i=e.radius+t.radius+r;return o*o+a*a+l*l<i*i},sc=({preferredPosition:e,halfExtents:t,radius:r,existingSpheres:o,seed:a=0})=>{const l=ma(e??{x:0,y:0,z:0},r,t),i=$r(l,r,o);if(i<=0)return l;const n=Math.max(0,t.x-r),p=Math.max(0,t.y-r),h=Math.max(0,t.z-r),d=Math.min(n,h),v=p>1e-4?[-.62*p,0,.62*p]:[0];let g=l,u=i;const y=44;for(let R=0;R<y;R+=1){const w=(R+1)/y,Z=d*Math.sqrt(w);for(let N=0;N<v.length;N+=1){const K=R*pl+a*.77+N*.41,te=ma({x:Math.cos(K)*Z,y:v[N],z:Math.sin(K)*Z},r,t),ie=$r(te,r,o);if(ie<=0)return te;if(ie<u)u=ie,g=te;else if(Math.abs(ie-u)<=1e-6){const q=Math.hypot(g.x,g.y,g.z);Math.hypot(te.x,te.y,te.z)<q&&(g=te)}}}if(u<=0)return g;const x=5,B=p>1e-4?3:1,P=5;for(let R=0;R<x;R+=1){const w=Or(-n,n,R/Math.max(1,x-1));for(let Z=0;Z<B;Z+=1){const N=B===1?0:Or(-p,p,Z/Math.max(1,B-1));for(let K=0;K<P;K+=1){const te=Or(-h,h,K/Math.max(1,P-1)),ie={x:w,y:N,z:te},q=$r(ie,r,o);q<u&&(u=q,g=ie)}}}return g},to=[{id:"cos-phi",code:0,label:"cos(phi)",token:"COS(PHI)"},{id:"neg-cos-phi",code:1,label:"-cos(phi)",token:"NEGATIVE COS(PHI)"},{id:"cos-theta",code:2,label:"cos(theta)",token:"COS(THETA)"},{id:"neg-cos-theta",code:3,label:"-cos(theta)",token:"NEGATIVE COS(THETA)"},{id:"sin-phi",code:4,label:"sin(phi)",token:"SIN(PHI)"},{id:"neg-sin-phi",code:5,label:"-sin(phi)",token:"NEGATIVE SIN(PHI)"},{id:"sin-theta",code:6,label:"sin(theta)",token:"SIN(THETA)"},{id:"neg-sin-theta",code:7,label:"-sin(theta)",token:"NEGATIVE SIN(THETA)"}],Ja="classic",hl="cos-phi",xl="sin-phi",yl="cos-theta",vl="cos-phi",qt=new Map(to.map(e=>[e.id,e]));new Map(to.map(e=>[e.code,e]));const gl=e=>e==="classic"||e==="custom",Tl=e=>typeof e=="string"&&qt.has(e),lc=(e,t=Ja)=>gl(e)?e:t,cc=(e,t=vl)=>Tl(e)?e:t,da=e=>e==="custom"?1:0,Bt=e=>{var t;return((t=qt.get(e))==null?void 0:t.code)??0},Sl=(e,t,r)=>{var i,n,p;const o=((i=qt.get(e))==null?void 0:i.token)??"COS(PHI)",a=((n=qt.get(t))==null?void 0:n.token)??"COS(PHI)",l=((p=qt.get(r))==null?void 0:p.token)??"COS(PHI)";return`${o} ${a} ${l}`},wl=()=>{const e=[],t=to.map(o=>o.id);let r=0;for(const o of t)for(const a of t)for(const l of t)r+=1,e.push({id:`trig-${String(r).padStart(3,"0")}`,index:r-1,label:`Preset ${r}`,phrase:Sl(o,a,l),x:o,y:a,z:l});return e},uc=wl(),I=4,Xr=32,jr=4,qr=128,pa=64,ba=1024,zl=-16,El=16,Gr=.25,_a=1.25,ha=64,ro=5,Ml=4,xa=2.8,tt=.32,sr=4e-4,Al=84,Rl=680,Pl=.45,ya=90,Cl=180,Il=()=>({contextLostCount:0,contextRestoredCount:0,contextAcquireFailures:0,paletteFallbackCount:0}),va=()=>({enabled:!1,qualityFactor:1,projectedDiameterPx:0,offCenterRatio:0,throttleMs:0,effectiveIterations:0,effectiveMaxSteps:0,effectiveRaySurfaceEpsilon:0,effectiveRayErrorTolerance:0,effectiveRayStepScale:0}),S=(e,t,r)=>Math.max(t,Math.min(r,e)),$e=(e,t,r)=>Math.max(t,Math.min(r,Math.floor(e))),Xe=(e,t,r)=>e+(t-e)*r,ga=(e,t,r)=>{if(e===t)return r<e?0:1;const o=S((r-e)/(t-e),0,1);return o*o*(3-2*o)},Ta=e=>{const t=S(e,zl,El);return Math.abs(t)<Gr?t<0?-Gr:Gr:t},Sa=(e,t)=>{const r=new Array(9).fill(0);for(let o=0;o<3;o+=1)for(let a=0;a<3;a+=1)r[o*3+a]=e[0+a]*t[o*3+0]+e[3+a]*t[o*3+1]+e[6+a]*t[o*3+2];return r},wa=e=>[e[0],e[3],e[6],e[1],e[4],e[7],e[2],e[5],e[8]],Fl=[1,0,0,0,1,0,0,0,1],za=e=>e==="classic"?0:e==="orbit-unlit"?2:1,Ea=e=>e==="chrome"?1:e==="flame"?2:0,Ma=e=>e==="hsv"?1:e==="lch"?2:0,Aa=e=>e==="srgb"?1:0,Ra=e=>e==="inverse"?1:0,Pa=(e,t)=>{if(!e||e.length<9)return t;const r=e.slice(0,9);return r.some(o=>!Number.isFinite(o))?t:r},Ll=(e,t)=>e?Array.isArray(e)?e.length<3||e.some(r=>!Number.isFinite(r))?t:[e[0],e[1],e[2]]:Number.isFinite(e.r)&&Number.isFinite(e.g)&&Number.isFinite(e.b)?[e.r,e.g,e.b]:t:t,Bl=e=>Math.hypot(e[0],e[1],e[2]),xt=e=>{const t=Bl(e);return t<1e-8?[0,0,0]:[e[0]/t,e[1]/t,e[2]/t]},Ul=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],Ca=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],Dl=(e,t)=>[e[0]*t,e[1]*t,e[2]*t],kl=(e,t)=>[e[0]-t[0],e[1]-t[1],e[2]-t[2]],Ia=(e,t)=>{const r=xt(e),[o,a,l]=r,i=Math.cos(t),n=Math.sin(t),p=1-i;return[p*o*o+i,p*o*a+n*l,p*o*l-n*a,p*o*a-n*l,p*a*a+i,p*a*l+n*o,p*o*l+n*a,p*a*l-n*o,p*l*l+i]},Wr=e=>{const t=xt([e[0],e[1],e[2]]);let r=[e[3],e[4],e[5]];r=kl(r,Dl(t,Ul(t,r))),r=xt(r);const o=xt(Ca(t,r)),a=xt(Ca(o,t));return[t[0],t[1],t[2],a[0],a[1],a[2],o[0],o[1],o[2]]},Gt=(e,t,r)=>{const o=Math.cos(r),a=Math.sin(r),l=o*e[1]-a*e[2],i=a*e[1]+o*e[2],n=Math.cos(t),p=Math.sin(t),h=n*e[0]-p*i,d=p*e[0]+n*i;return[h,l,d]},lr=(e,t)=>{const r=Gt([1,0,0],e,t),o=Gt([0,1,0],e,t),a=Gt([0,0,1],e,t);return[r[0],r[1],r[2],o[0],o[1],o[2],a[0],a[1],a[2]]},Nl=`
precision highp float;
uniform vec2 u_resolution;
uniform sampler2D u_source;
uniform float u_strength;
uniform int u_radius;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 texel = 1.0 / u_resolution;
  vec4 center = texture2D(u_source, uv);
  vec3 sum = vec3(0.0);
  vec3 minV = vec3(1.0);
  vec3 maxV = vec3(0.0);
  float count = 0.0;

  const int MAX_RADIUS = ${ro};
  for (int y = -MAX_RADIUS; y <= MAX_RADIUS; y++) {
    for (int x = -MAX_RADIUS; x <= MAX_RADIUS; x++) {
      if (abs(x) > u_radius || abs(y) > u_radius) continue;
      if ((x * x) + (y * y) > (u_radius * u_radius)) continue;
      vec2 sampleUV = clamp(uv + vec2(float(x), float(y)) * texel, vec2(0.0), vec2(1.0));
      vec3 sampleRGB = texture2D(u_source, sampleUV).rgb;
      sum += sampleRGB;
      minV = min(minV, sampleRGB);
      maxV = max(maxV, sampleRGB);
      count += 1.0;
    }
  }

  vec3 filtered = center.rgb;
  if (count > 2.0) {
    filtered = (sum - minV - maxV) / max(count - 2.0, 1.0);
  }
  vec3 mixed = mix(center.rgb, filtered, clamp(u_strength, 0.0, 1.0));
  gl_FragColor = vec4(mixed, center.a);
}
`,Ol=`
precision highp float;
uniform vec2 u_resolution;
uniform sampler2D u_source;
uniform float u_strength;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 texel = 1.0 / u_resolution;
  vec4 center = texture2D(u_source, uv);
  vec3 cN = texture2D(u_source, clamp(uv + vec2(0.0, texel.y), vec2(0.0), vec2(1.0))).rgb;
  vec3 cS = texture2D(u_source, clamp(uv - vec2(0.0, texel.y), vec2(0.0), vec2(1.0))).rgb;
  vec3 cE = texture2D(u_source, clamp(uv + vec2(texel.x, 0.0), vec2(0.0), vec2(1.0))).rgb;
  vec3 cW = texture2D(u_source, clamp(uv - vec2(texel.x, 0.0), vec2(0.0), vec2(1.0))).rgb;

  vec3 sum = center.rgb + cN + cS + cE + cW;
  vec3 minV = min(center.rgb, min(cN, min(cS, min(cE, cW))));
  vec3 maxV = max(center.rgb, max(cN, max(cS, max(cE, cW))));
  vec3 filtered = (sum - minV - maxV) / 3.0;
  vec3 mixed = mix(center.rgb, filtered, clamp(u_strength, 0.0, 1.0));
  gl_FragColor = vec4(mixed, center.a);
}
`,$l=`#version 300 es
precision highp float;
uniform vec2 u_resolution;
uniform sampler2D u_source;
uniform float u_strength;
uniform int u_radius;
out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 texel = 1.0 / u_resolution;
  vec4 center = texture(u_source, uv);
  vec3 sum = vec3(0.0);
  vec3 minV = vec3(1.0);
  vec3 maxV = vec3(0.0);
  float count = 0.0;

  const int MAX_RADIUS = ${ro};
  for (int y = -MAX_RADIUS; y <= MAX_RADIUS; y++) {
    for (int x = -MAX_RADIUS; x <= MAX_RADIUS; x++) {
      if (abs(x) > u_radius || abs(y) > u_radius) continue;
      if ((x * x) + (y * y) > (u_radius * u_radius)) continue;
      vec2 sampleUV = clamp(uv + vec2(float(x), float(y)) * texel, vec2(0.0), vec2(1.0));
      vec3 sampleRGB = texture(u_source, sampleUV).rgb;
      sum += sampleRGB;
      minV = min(minV, sampleRGB);
      maxV = max(maxV, sampleRGB);
      count += 1.0;
    }
  }

  vec3 filtered = center.rgb;
  if (count > 2.0) {
    filtered = (sum - minV - maxV) / max(count - 2.0, 1.0);
  }
  vec3 mixed = mix(center.rgb, filtered, clamp(u_strength, 0.0, 1.0));
  fragColor = vec4(mixed, center.a);
}
`,Xl=`#version 300 es
precision highp float;
uniform vec2 u_resolution;
uniform sampler2D u_source;
uniform float u_strength;
out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 texel = 1.0 / u_resolution;
  vec4 center = texture(u_source, uv);
  vec3 cN = texture(u_source, clamp(uv + vec2(0.0, texel.y), vec2(0.0), vec2(1.0))).rgb;
  vec3 cS = texture(u_source, clamp(uv - vec2(0.0, texel.y), vec2(0.0), vec2(1.0))).rgb;
  vec3 cE = texture(u_source, clamp(uv + vec2(texel.x, 0.0), vec2(0.0), vec2(1.0))).rgb;
  vec3 cW = texture(u_source, clamp(uv - vec2(texel.x, 0.0), vec2(0.0), vec2(1.0))).rgb;

  vec3 sum = center.rgb + cN + cS + cE + cW;
  vec3 minV = min(center.rgb, min(cN, min(cS, min(cE, cW))));
  vec3 maxV = max(center.rgb, max(cN, max(cS, max(cE, cW))));
  vec3 filtered = (sum - minV - maxV) / 3.0;
  vec3 mixed = mix(center.rgb, filtered, clamp(u_strength, 0.0, 1.0));
  fragColor = vec4(mixed, center.a);
}
`,Fa=(e,t,r)=>{const o=e.getAttribLocation(t,"position");o<0||(e.bindBuffer(e.ARRAY_BUFFER,r),e.enableVertexAttribArray(o),e.vertexAttribPointer(o,2,e.FLOAT,!1,0,0))},La=(e,t,r,o)=>{e.bindTexture(e.TEXTURE_2D,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,r,o,0,e.RGBA,e.UNSIGNED_BYTE,null)},Ba=(e,t,r)=>{const o=e.createShader(t);return o?(e.shaderSource(o,r),e.compileShader(o),e.getShaderParameter(o,e.COMPILE_STATUS)?o:(console.error("Shader compile error:",e.getShaderInfoLog(o)),e.deleteShader(o),null)):null},Vr=(e,t,r)=>{const o=Ba(e,e.VERTEX_SHADER,t),a=Ba(e,e.FRAGMENT_SHADER,r);if(!o||!a)return o&&e.deleteShader(o),a&&e.deleteShader(a),null;const l=e.createProgram();return l?(e.attachShader(l,o),e.attachShader(l,a),e.linkProgram(l),e.deleteShader(o),e.deleteShader(a),e.getProgramParameter(l,e.LINK_STATUS)?l:(console.error("Program link error:",e.getProgramInfoLog(l)),e.deleteProgram(l),null)):(e.deleteShader(o),e.deleteShader(a),null)},jl=(e,t)=>({time:e.getUniformLocation(t,"u_time"),resolution:e.getUniformLocation(t,"u_resolution"),cameraRotation:e.getUniformLocation(t,"u_camera_rotation"),pan:e.getUniformLocation(t,"u_pan"),focalLength:e.getUniformLocation(t,"u_focal_length"),raySurfaceEpsilon:e.getUniformLocation(t,"u_ray_surface_epsilon"),rayErrorTolerance:e.getUniformLocation(t,"u_ray_error_tolerance"),rayStepScale:e.getUniformLocation(t,"u_ray_step_scale"),rayMaxDistance:e.getUniformLocation(t,"u_ray_max_distance"),cyclePhase:e.getUniformLocation(t,"u_cycle_phase"),lighting:e.getUniformLocation(t,"u_lighting"),lightPosition:e.getUniformLocation(t,"u_light_position"),lightColor:e.getUniformLocation(t,"u_light_color"),backgroundColor:e.getUniformLocation(t,"u_background_color"),backgroundIntensity:e.getUniformLocation(t,"u_background_intensity"),zoom:e.getUniformLocation(t,"u_zoom"),depth:e.getUniformLocation(t,"u_depth"),wind:e.getUniformLocation(t,"u_wind"),fogStrength:e.getUniformLocation(t,"u_fog_strength"),mistStrength:e.getUniformLocation(t,"u_mist_strength"),tankEnabled:e.getUniformLocation(t,"u_tank_enabled"),tankHalfExtents:e.getUniformLocation(t,"u_tank_half_extents"),tankRefractionStrength:e.getUniformLocation(t,"u_tank_refraction_strength"),tankHazeStrength:e.getUniformLocation(t,"u_tank_haze_strength"),tankShellStrength:e.getUniformLocation(t,"u_tank_shell_strength"),bulbCount:e.getUniformLocation(t,"u_bulb_count"),bulbRotationMatrix:e.getUniformLocation(t,"u_bulb_rotation_matrix[0]"),bulbInverseRotationMatrix:e.getUniformLocation(t,"u_bulb_inverse_rotation_matrix[0]"),bulbPosition:e.getUniformLocation(t,"u_bulb_position[0]"),bulbScale:e.getUniformLocation(t,"u_bulb_scale[0]"),bulbColorStyle:e.getUniformLocation(t,"u_bulb_color_style[0]"),bulbSurfaceShaderMode:e.getUniformLocation(t,"u_bulb_surface_shader_mode[0]"),bulbMaterialMode:e.getUniformLocation(t,"u_bulb_material_mode[0]"),bulbMaterialIntensity:e.getUniformLocation(t,"u_bulb_material_intensity[0]"),bulbOrbitTrapMix:e.getUniformLocation(t,"u_bulb_orbit_trap_mix[0]"),bulbOrbitTrapAoStrength:e.getUniformLocation(t,"u_bulb_orbit_trap_ao_strength[0]"),bulbColorVividness:e.getUniformLocation(t,"u_bulb_color_vividness[0]"),bulbColorBandDensity:e.getUniformLocation(t,"u_bulb_color_band_density[0]"),bulbColorWarmCoolBias:e.getUniformLocation(t,"u_bulb_color_warm_cool_bias[0]"),bulbColorSpace:e.getUniformLocation(t,"u_bulb_color_space[0]"),bulbTransferFn:e.getUniformLocation(t,"u_bulb_transfer_fn[0]"),bulbLchChromaCoupling:e.getUniformLocation(t,"u_bulb_lch_chroma_coupling[0]"),bulbColor:e.getUniformLocation(t,"u_bulb_color[0]"),bulbQualityHint:e.getUniformLocation(t,"u_bulb_quality_hint[0]"),bulbSceneIterations:e.getUniformLocation(t,"u_scene_iterations[0]"),bulbSceneMaxSteps:e.getUniformLocation(t,"u_scene_max_steps[0]"),bulbPower:e.getUniformLocation(t,"u_bulb_power[0]"),bulbBailoutRadius:e.getUniformLocation(t,"u_bulb_bailout_radius[0]"),bulbTrigMode:e.getUniformLocation(t,"u_bulb_trig_mode[0]"),bulbTrigTermX:e.getUniformLocation(t,"u_bulb_trig_term_x[0]"),bulbTrigTermY:e.getUniformLocation(t,"u_bulb_trig_term_y[0]"),bulbTrigTermZ:e.getUniformLocation(t,"u_bulb_trig_term_z[0]"),paletteSampleCount:e.getUniformLocation(t,"u_palette_sample_count"),paletteSamples:e.getUniformLocation(t,"u_palette_samples[0]")}),ql=e=>{const t=[{alpha:!1,antialias:!1,depth:!1,stencil:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"},{alpha:!1,antialias:!0,depth:!1,stencil:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"},{antialias:!0,preserveDrawingBuffer:!0}];for(const a of t){const l=e.getContext("webgl2",a);if(l)return{backend:"webgl2",gl:l};const i=e.getContext("webgl",a);if(i)return{backend:"webgl1",gl:i}}const r=e.getContext("webgl2");if(r)return{backend:"webgl2",gl:r};const o=e.getContext("webgl");return o?{backend:"webgl1",gl:o}:{backend:"none",gl:null}},fc=({enabled:e,canvasRef:t,fractalDefinition:r,paletteName:o,center:a,sceneOrbitInput:l,scenePanInput:i,sceneObjectPanDeltaRef:n,zoom:p,cycleSpeed:h,resolutionScale:d,isInteracting:v,sceneNavigationMode:g,sceneColorMode:u,sceneSurfaceShaderMode:y,sceneMaterialMode:x,sceneMaterialIntensity:B,sceneOrbitTrapMix:P,sceneOrbitTrapAoStrength:R,sceneFocalLength:w,sceneRaySurfaceEpsilon:Z,sceneRayErrorTolerance:N,sceneRayStepScale:K,sceneRayMaxDistance:te,sceneColorVividness:ie,sceneColorBandDensity:q,sceneColorWarmCoolBias:ot,colorSpaceMode:qe,transferFunction:Ge,lchChromaCoupling:We,sceneInvertPanX:Re,sceneInvertPanY:ge,sceneInvertZoom:Te,sceneRotationSpeed:Pe,sceneLighting:Ve,sceneLightPosition:re,sceneLightColor:se,sceneBackgroundColor:ue,sceneBackgroundIntensity:Se,sceneDepth:at,sceneWind:Ce,sceneFogStrength:Ie,sceneMistStrength:nt,sceneTankEnabled:pe,sceneTankRefractionStrength:He,sceneTankHazeStrength:Ut,sceneTankShellStrength:Dt,sceneIterations:vt,sceneMaxSteps:gt,sceneBulbPower:Tt,sceneBulbBailoutRadius:it,sceneBulbTrigMode:st,sceneBulbTrigTermX:we,sceneBulbTrigTermY:Fe,sceneBulbTrigTermZ:St,sceneAdaptiveQualityEnabled:kt,sceneAdaptiveQualityStrength:le,sceneAdaptiveThrottle:Wt,sceneRenderScale:be,sceneFreezeMotion:Ze,scenePrimaryRotationMatrix:O,sceneBulbs:Ye,filterEnabled:Nt,filterStrength:Le,filterRadius:wt,filterPasses:zt,appendDebug:Et})=>{const ce=(l==null?void 0:l.x)??a.x,J=(l==null?void 0:l.y)??a.y,lt=(i==null?void 0:i.x)??a.x,Ot=(i==null?void 0:i.y)??a.y,Mt=m.useRef(null),Ke=m.useRef(null),Je=m.useRef(null),ze=m.useRef(null),Be=m.useRef(null),Qe=m.useRef({width:0,height:0}),Ue=m.useRef(()=>{}),_e=m.useRef(null),Vt=m.useRef(0),At=m.useRef(0),Ee=m.useRef(null),Rt=m.useRef(0),oe=m.useRef(lr(Y.yaw,Y.pitch)),$=m.useRef({yaw:0,pitch:0}),fe=m.useRef({x:0,y:0}),Me=m.useRef("scene"),De=m.useRef([0,.8,1]),Ht=m.useRef(new Float32Array(Xr*3)),[mr,he]=m.useState("none"),ct=m.useRef(Il()),[ut,dr]=m.useState(ct.current),[pr,Pt]=m.useState(0),[Zt,Yt]=m.useState({rendersPerSecond:0,lastRenderMs:0,avgRenderMs:0}),$t=m.useRef({startTime:performance.now(),count:0,totalMs:0,lastMs:0}),b=m.useRef(1),c=m.useRef(0),U=m.useRef(0),[T,D]=m.useState(va()),M=m.useMemo(()=>{var s;return((s=r==null?void 0:r.sceneConfig)==null?void 0:s.sceneId)==="mandelbulb"?r.sceneConfig.defaults:{zoom:Y.zoom,yaw:Y.yaw,pitch:Y.pitch,depth:Y.depth,speed:Y.speed,lighting:Y.lighting,wind:Y.wind,color:[0,.8,1]}},[r]),z=m.useCallback((s,E)=>{Et==null||Et(s,`[renderer] ${E}`)},[Et]),F=m.useCallback(s=>{const E={...ct.current,[s]:ct.current[s]+1};return ct.current=E,dr(E),E[s]},[]);m.useEffect(()=>{if(!e)return;const s=Qr[o];De.current=Ki(s==null?void 0:s.formula,o,{onFallback:E=>{const f=F("paletteFallbackCount");z("warn",`Palette theme fallback (${E}) for "${o}" [count=${f}]`)}}),Ht.current=Qi(s==null?void 0:s.formula,o,Xr,{onFallback:E=>{const f=F("paletteFallbackCount");z("warn",`Palette LUT fallback (${E}) for "${o}" [count=${f}]`)}})},[F,e,z,o]),m.useEffect(()=>{oe.current=lr(M.yaw,M.pitch),$.current={yaw:0,pitch:0},fe.current={x:ce,y:J},Me.current=g},[ce,J,M.pitch,M.yaw,g]),m.useEffect(()=>{!O||O.length<9||(oe.current=Wr(Pa(O,oe.current)),$.current={yaw:0,pitch:0},fe.current={x:ce,y:J})},[ce,J,O]);const Q=m.useCallback(s=>{const E=Be.current;E&&(s.deleteFramebuffer(E.fbA),s.deleteFramebuffer(E.fbB),s.deleteTexture(E.texA),s.deleteTexture(E.texB),s.deleteProgram(E.genericProgram.program),s.deleteProgram(E.radius1Program.program),Be.current=null,Qe.current={width:0,height:0})},[]),xe=m.useCallback((s,E,f)=>{const j=typeof WebGL2RenderingContext<"u"&&s instanceof WebGL2RenderingContext;let C=Be.current;if(!C){const k=Vr(s,j?Br:Lr,j?$l:Nl),W=Vr(s,j?Br:Lr,j?Xl:Ol);if(!k||!W)return k&&s.deleteProgram(k),W&&s.deleteProgram(W),null;const V=s.createTexture(),ye=s.createTexture(),ae=s.createFramebuffer(),ee=s.createFramebuffer();if(!V||!ye||!ae||!ee)return V&&s.deleteTexture(V),ye&&s.deleteTexture(ye),ae&&s.deleteFramebuffer(ae),ee&&s.deleteFramebuffer(ee),s.deleteProgram(k),s.deleteProgram(W),null;C={genericProgram:{program:k,uniforms:{resolution:s.getUniformLocation(k,"u_resolution"),sourceTexture:s.getUniformLocation(k,"u_source"),strength:s.getUniformLocation(k,"u_strength"),radius:s.getUniformLocation(k,"u_radius")}},radius1Program:{program:W,uniforms:{resolution:s.getUniformLocation(W,"u_resolution"),sourceTexture:s.getUniformLocation(W,"u_source"),strength:s.getUniformLocation(W,"u_strength"),radius:null}},texA:V,texB:ye,fbA:ae,fbB:ee},Be.current=C}const G=Qe.current;if(G.width!==E||G.height!==f){La(s,C.texA,E,f),La(s,C.texB,E,f),s.bindFramebuffer(s.FRAMEBUFFER,C.fbA),s.framebufferTexture2D(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,C.texA,0);const k=s.checkFramebufferStatus(s.FRAMEBUFFER);s.bindFramebuffer(s.FRAMEBUFFER,C.fbB),s.framebufferTexture2D(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,C.texB,0);const W=s.checkFramebufferStatus(s.FRAMEBUFFER);if(s.bindFramebuffer(s.FRAMEBUFFER,null),k!==s.FRAMEBUFFER_COMPLETE||W!==s.FRAMEBUFFER_COMPLETE)return Q(s),null;Qe.current={width:E,height:f}}return C},[Q]),X=m.useCallback(()=>{if(!e)return;const s=Mt.current,E=Ke.current,f=Je.current,j=ze.current;if(!s||!E||!f||!j)return;const C=performance.now(),G=performance.now(),k=Ee.current??G,W=Math.max(0,(G-k)/1e3);Ee.current=G;const V=Ze?0:W;Vt.current+=W;const ye=S(h,0,2.5);At.current+=W*ye;const ae=S(Pe,0,.5);Rt.current+=V*ae*.08;const ee=s.canvas,me=Math.min(1,Math.max(.2,d*be)),H=Math.max(1,Math.floor(window.innerWidth*me)),ne=Math.max(1,Math.floor(window.innerHeight*me));(ee.width!==H||ee.height!==ne)&&(ee.width=H,ee.height=ne);const Kt=g==="object",ke=-1,Ne=1,oo=Re?-ke:ke,ao=ge?-ke:ke,Qa=Re?-Ne:Ne,en=ge?-Ne:Ne;let hr=M.yaw+Rt.current+ce*oo*1.5,xr=S(M.pitch+J*ao*1.5,-Math.PI/2,Math.PI/2),Ct=oe.current,yr=0,vr=0;const no=Me.current;if(no!==g){if(g==="object"){const _=M.yaw+Rt.current+ce*oo*1.5,A=S(M.pitch+J*ao*1.5,-Math.PI/2,Math.PI/2);no==="camera"?oe.current=lr(_-Rt.current,A):oe.current=lr(M.yaw,M.pitch),Ct=oe.current,$.current={yaw:0,pitch:0},fe.current={x:ce,y:J},n!=null&&n.current&&(n.current.x=0,n.current.y=0)}else $.current={yaw:0,pitch:0},fe.current={x:ce,y:J},n!=null&&n.current&&(n.current.x=0,n.current.y=0);Me.current=g}if(Kt){const _=xt(Gt([1,0,0],hr,xr)),A=xt(Gt([0,1,0],hr,xr)),It=(de,Wo)=>{const ar=Ia(A,de),Ir=Ia(_,Wo);Ct=Wr(Sa(Ir,Sa(ar,Ct))),oe.current=Ct};let ft=0,Xt=0;n!=null&&n.current?(ft=S(n.current.x,-tt,tt),Xt=S(n.current.y,-tt,tt),n.current.x=0,n.current.y=0):(ft=S(ce-fe.current.x,-tt,tt),Xt=S(J-fe.current.y,-tt,tt)),fe.current={x:ce,y:J};const tr=Re?-1:1,rr=ge?1:-1,mt=ft*tr*xa,Ft=Xt*rr*xa;if(Math.abs(mt)>sr||Math.abs(Ft)>sr)It(mt,Ft),V>1e-5&&($.current={yaw:mt/V,pitch:Ft/V});else if(!v&&V>0){It($.current.yaw*V,$.current.pitch*V);const de=Math.exp(-4.2*V);$.current={yaw:$.current.yaw*de,pitch:$.current.pitch*de},Math.abs($.current.yaw)<sr&&($.current.yaw=0),Math.abs($.current.pitch)<sr&&($.current.pitch=0)}}g==="scene"&&(yr=lt*Qa*.55,vr=Ot*en*.55);const gr=Za({zoom:p,sceneDepth:at,sceneInvertZoom:Te,sceneFocalLength:w}),io=gr.finalDepth,so=gr.focalLength,lo=gr.sceneZoom,tn=$e(vt,jr,qr),rn=$e(gt,pa,ba),Jt=S(Z,1e-5,.01),Qt=S(N,.03,2),Tr=S(K,.2,1.8),Sr=S(te,2,120),wr=_l({viewportWidth:window.innerWidth,viewportHeight:window.innerHeight,zoom:p,sceneDepth:at,sceneInvertZoom:Te,sceneFocalLength:w}),zr=wr.halfExtents,on=pe?wr.targetBulbScale:1,an=pe?wr.targetBulbRadius:Ya,ve=kt,nn=S(le,0,1),sn=Math.hypot(yr,vr)*ne,ln=Math.max(1,.5*Math.min(H,ne)),co=sn/ln,cn=Math.max(Pl,Math.abs(io)),uo=lo*so*an*ne/cn*2,un=ga(Al,Rl,uo),fo=ga(.38,1.12,co),fn=S(un*(1-.42*fo),0,1),mo=ve?Xe(1,fn,nn):1,po=b.current,mn=mo>po?.26:.14,bo=ve?Xe(po,mo,mn):1;b.current=bo;const dn=S(Math.max(Jt*3.2,Jt+45e-5),1e-5,.01),pn=S(Math.max(Qt*1.9,Qt+.18),.03,2),bn=S(Math.min(1.8,Tr*1.35+.08),.2,1.8),_n=S(Math.max(2,Sr*.65),2,120),Oe=ve?bo:1,Er=$e(Math.round(Xe(4,tn,Oe)),4,32),Mr=$e(Math.round(Xe(64,rn,Oe)),64,320),_o=ve?Xe(dn,Jt,Oe):Jt,ho=ve?Xe(pn,Qt,Oe):Qt,xo=ve?Xe(bn,Tr,Oe):Tr,hn=ve?Xe(_n,Sr,Oe):Sr,xn=ve?(1-Oe)*Xe(.7,1,fo):0,Ar=ve&&Wt&&!v?Math.round(S(ya*xn,0,ya)):0,yn={enabled:ve,qualityFactor:Oe,projectedDiameterPx:uo,offCenterRatio:co,throttleMs:Ar,effectiveIterations:Er,effectiveMaxSteps:Mr,effectiveRaySurfaceEpsilon:_o,effectiveRayErrorTolerance:ho,effectiveRayStepScale:xo};if(G-U.current>=Cl&&(U.current=G,D(yn)),Ar>0&&G-c.current<Ar)return;const Rr=De.current,vn=[Rr[0],Rr[1],Rr[2]],gn={position:[0,0,0],scale:1,rotationMatrix:Ct,inverseRotationMatrix:wa(Ct),colorStyle:0,surfaceShaderMode:za(y),materialMode:Ea(x),materialIntensity:S(B,0,2.5),orbitTrapMix:S(P,0,1.5),orbitTrapAoStrength:S(R,0,2.5),colorVividness:.9,colorBandDensity:1,colorWarmCoolBias:.5,colorSpace:Ma(qe),transferFn:Aa(Ge),lchChromaCoupling:Ra(We),color:[0,0,0],qualityHint:1,sceneIterations:Er,sceneMaxSteps:Mr,bulbPower:Ta(Tt),bulbBailoutRadius:S(Math.abs(it),_a,ha),bulbTrigMode:da(st),bulbTrigTermX:Bt(we),bulbTrigTermY:Bt(Fe),bulbTrigTermZ:Bt(St)},er=[];if(Ye&&Ye.length>0)for(const _ of Ye){if(er.length>=I)break;const A=Wr(Pa(_.rotationMatrix,Fl)),It=wa(A),ft=_.position?[S(_.position.x,-64,64),S(_.position.y,-64,64),S(_.position.z,-64,64)]:[0,0,0];er.push({position:ft,scale:pe&&_.inTank!==!1?on:S(_.scale??1,.05,8),rotationMatrix:A,inverseRotationMatrix:It,colorStyle:(_.colorStyle??u)==="vivid"?1:0,surfaceShaderMode:za(_.surfaceShaderMode??y),materialMode:Ea(_.materialMode??x),materialIntensity:S(_.materialIntensity??B,0,2.5),orbitTrapMix:S(_.orbitTrapMix??P,0,1.5),orbitTrapAoStrength:S(_.orbitTrapAoStrength??R,0,2.5),colorVividness:S(_.colorVividness??ie,0,2.25),colorBandDensity:S(_.colorBandDensity??q,.5,2.5),colorWarmCoolBias:S(_.colorWarmCoolBias??ot,0,1),colorSpace:Ma(_.colorSpaceMode??qe),transferFn:Aa(_.transferFunction??Ge),lchChromaCoupling:Ra(_.lchChromaCoupling??We),color:Ll(_.color,vn),qualityHint:S(_.qualityHint??(ve?Oe:1),0,1),sceneIterations:$e(_.sceneIterations??Er,jr,qr),sceneMaxSteps:$e(_.sceneMaxSteps??Mr,pa,ba),bulbPower:Ta(_.bulbPower??Tt),bulbBailoutRadius:S(Math.abs(_.bulbBailoutRadius??it),_a,ha),bulbTrigMode:da(_.bulbTrigMode??st??Ja),bulbTrigTermX:Bt(_.bulbTrigTermX??we??hl),bulbTrigTermY:Bt(_.bulbTrigTermY??Fe??xl),bulbTrigTermZ:Bt(_.bulbTrigTermZ??St??yl)})}const Tn=Math.max(0,Math.min(I,er.length)),yo=new Float32Array(I*9),vo=new Float32Array(I*9),go=new Float32Array(I*3),To=new Float32Array(I),So=new Float32Array(I),wo=new Int32Array(I),zo=new Int32Array(I),Eo=new Float32Array(I),Mo=new Float32Array(I),Ao=new Float32Array(I),Ro=new Float32Array(I),Po=new Float32Array(I),Co=new Float32Array(I),Io=new Int32Array(I),Fo=new Int32Array(I),Lo=new Int32Array(I),Bo=new Float32Array(I*3),Uo=new Float32Array(I),Do=new Int32Array(I),ko=new Int32Array(I),No=new Float32Array(I),Oo=new Float32Array(I),$o=new Int32Array(I),Xo=new Int32Array(I),jo=new Int32Array(I),qo=new Int32Array(I);for(let _=0;_<I;_+=1){const A=er[_]??gn;yo.set(A.rotationMatrix,_*9),vo.set(A.inverseRotationMatrix,_*9),go.set(A.position,_*3),To[_]=S(A.scale,.05,8),So[_]=A.colorStyle,wo[_]=A.surfaceShaderMode,zo[_]=A.materialMode,Eo[_]=A.materialIntensity,Mo[_]=A.orbitTrapMix,Ao[_]=A.orbitTrapAoStrength,Ro[_]=A.colorVividness,Po[_]=A.colorBandDensity,Co[_]=A.colorWarmCoolBias,Io[_]=A.colorSpace,Fo[_]=A.transferFn,Lo[_]=A.lchChromaCoupling,Bo.set(A.color,_*3),Uo[_]=A.qualityHint,Do[_]=A.sceneIterations,ko[_]=A.sceneMaxSteps,No[_]=A.bulbPower,Oo[_]=A.bulbBailoutRadius,$o[_]=A.bulbTrigMode,Xo[_]=A.bulbTrigTermX,jo[_]=A.bulbTrigTermY,qo[_]=A.bulbTrigTermZ}const Pr=_=>{s.bindFramebuffer(s.FRAMEBUFFER,_),s.viewport(0,0,H,ne),s.useProgram(E),Fa(s,E,j),s.activeTexture(s.TEXTURE0),s.bindTexture(s.TEXTURE_2D,null),s.uniform1f(f.time,Vt.current),s.uniform2f(f.resolution,H,ne),s.uniform2f(f.cameraRotation,hr,xr),s.uniform2f(f.pan,yr,vr),s.uniform1i(f.bulbCount,Tn),s.uniformMatrix3fv(f.bulbRotationMatrix,!1,yo),s.uniformMatrix3fv(f.bulbInverseRotationMatrix,!1,vo),s.uniform3fv(f.bulbPosition,go),s.uniform1fv(f.bulbScale,To),s.uniform1fv(f.bulbColorStyle,So),s.uniform1iv(f.bulbSurfaceShaderMode,wo),s.uniform1iv(f.bulbMaterialMode,zo),s.uniform1fv(f.bulbMaterialIntensity,Eo),s.uniform1fv(f.bulbOrbitTrapMix,Mo),s.uniform1fv(f.bulbOrbitTrapAoStrength,Ao),s.uniform1fv(f.bulbColorVividness,Ro),s.uniform1fv(f.bulbColorBandDensity,Po),s.uniform1fv(f.bulbColorWarmCoolBias,Co),s.uniform1iv(f.bulbColorSpace,Io),s.uniform1iv(f.bulbTransferFn,Fo),s.uniform1iv(f.bulbLchChromaCoupling,Lo),s.uniform3fv(f.bulbColor,Bo),s.uniform1fv(f.bulbQualityHint,Uo),s.uniform1iv(f.bulbSceneIterations,Do),s.uniform1iv(f.bulbSceneMaxSteps,ko),s.uniform1fv(f.bulbPower,No),s.uniform1fv(f.bulbBailoutRadius,Oo),s.uniform1iv(f.bulbTrigMode,$o),s.uniform1iv(f.bulbTrigTermX,Xo),s.uniform1iv(f.bulbTrigTermY,jo),s.uniform1iv(f.bulbTrigTermZ,qo),s.uniform1i(f.paletteSampleCount,Xr),s.uniform3fv(f.paletteSamples,Ht.current),s.uniform1f(f.focalLength,so),s.uniform1f(f.raySurfaceEpsilon,_o),s.uniform1f(f.rayErrorTolerance,ho),s.uniform1f(f.rayStepScale,xo),s.uniform1f(f.rayMaxDistance,hn),s.uniform1f(f.cyclePhase,At.current),s.uniform1f(f.lighting,S(Ve,0,2.5)),s.uniform3f(f.lightPosition,S(re.x,-16,16),S(re.y,-16,16),S(re.z,-16,16)),s.uniform3f(f.lightColor,S(se.r,0,2),S(se.g,0,2),S(se.b,0,2)),s.uniform3f(f.backgroundColor,S(ue.r,0,1),S(ue.g,0,1),S(ue.b,0,1)),s.uniform1f(f.backgroundIntensity,S(Se,0,2.5)),s.uniform1f(f.zoom,lo),s.uniform1f(f.depth,io),s.uniform1f(f.wind,S(Ce,0,4.5)),s.uniform1f(f.fogStrength,S(Ie,0,1.5)),s.uniform1f(f.mistStrength,S(nt,0,1.5)),s.uniform1f(f.tankEnabled,pe?1:0),s.uniform3f(f.tankHalfExtents,zr.x,zr.y,zr.z),s.uniform1f(f.tankRefractionStrength,S(He,0,1)),s.uniform1f(f.tankHazeStrength,S(Ut,0,2.5)),s.uniform1f(f.tankShellStrength,S(Dt,0,1)),s.drawArrays(s.TRIANGLES,0,6)};if(!Nt)Pr(null);else{const _=xe(s,H,ne);if(!_)Pr(null);else{Pr(_.fbA);const A=Number.isFinite(Le)?Le:.7,It=Number.isFinite(wt)?wt:1,ft=Number.isFinite(zt)?zt:1,Xt=S(A,0,1),tr=$e(It,1,ro),rr=$e(ft,1,Ml);let mt=_.texA,Ft=_.texB,or=_.fbB;const de=tr===1?_.radius1Program:_.genericProgram,ar=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS)>1?1:0,Ir=s.TEXTURE0+ar;s.useProgram(de.program),Fa(s,de.program,j),s.uniform2f(de.uniforms.resolution,H,ne),s.uniform1f(de.uniforms.strength,Xt),de.uniforms.radius&&s.uniform1i(de.uniforms.radius,tr),s.uniform1i(de.uniforms.sourceTexture,ar);for(let Fr=0;Fr<rr;Fr+=1){const Vo=Fr===rr-1;if(s.bindFramebuffer(s.FRAMEBUFFER,Vo?null:or),s.viewport(0,0,H,ne),s.activeTexture(Ir),s.bindTexture(s.TEXTURE_2D,mt),s.drawArrays(s.TRIANGLES,0,6),!Vo){const Sn=Ft;Ft=mt,mt=Sn,or=or===_.fbA?_.fbB:_.fbA}}s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null)}}const Go=performance.now()-C,Cr=$t.current;Cr.count+=1,Cr.totalMs+=Go,Cr.lastMs=Go,c.current=G},[ce,J,lt,Ot,h,e,xe,Nt,zt,wt,Le,d,q,at,ie,u,y,x,B,P,R,w,Z,N,K,te,ot,qe,Ge,We,v,Ie,pe,He,Ut,Dt,Re,ge,Te,vt,kt,le,Wt,Tt,it,st,we,Fe,St,Ve,re.x,re.y,re.z,se.r,se.g,se.b,ue.r,ue.g,ue.b,Se,gt,nt,g,be,Ze,Pe,Ce,Ye,M,n,p]);m.useEffect(()=>{Ue.current=X},[X]),m.useEffect(()=>{if(!e){he("none"),b.current=1,c.current=0,U.current=0,D(va());return}const s=t.current;if(!s)return;let E=null,f=null;const{backend:j,gl:C}=ql(s);if(!C){he("none");const me=F("contextAcquireFailures");return z("warn",`Mandelbulb scene renderer could not acquire a WebGL context [count=${me}].`),E=window.setTimeout(()=>{Pt(H=>H+1)},1200),()=>{E!==null&&window.clearTimeout(E)}}const G=Vr(C,j==="webgl2"?Br:Lr,j==="webgl2"?Gi:qi);if(!G){he("none"),z("warn","Mandelbulb scene shader program failed to compile/link.");return}const k=new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),W=C.createBuffer();if(!W){C.deleteProgram(G),he("none"),z("warn","Mandelbulb scene renderer could not allocate quad buffer.");return}C.bindBuffer(C.ARRAY_BUFFER,W),C.bufferData(C.ARRAY_BUFFER,k,C.STATIC_DRAW),Mt.current=C,Ke.current=G,Je.current=jl(C,G),ze.current=W,he(j),z("state",`Mandelbulb scene renderer initialized (${j}).`);const V=()=>{Ue.current(),_e.current=requestAnimationFrame(V)};_e.current=requestAnimationFrame(V);const ye=()=>Ue.current(),ae=me=>{me.preventDefault();const H=F("contextLostCount");z("warn",`Mandelbulb WebGL context lost. Attempting recovery [count=${H}].`),he("none"),Be.current=null,Qe.current={width:0,height:0},Mt.current=null,Je.current=null,Ke.current=null,ze.current=null,_e.current!==null&&(cancelAnimationFrame(_e.current),_e.current=null),f!==null&&window.clearTimeout(f),f=window.setTimeout(()=>{Pt(ne=>ne+1)},1200)},ee=()=>{const me=F("contextRestoredCount");z("info",`Mandelbulb WebGL context restored. Reinitializing renderer [count=${me}].`),Pt(H=>H+1)};return s.addEventListener("webglcontextlost",ae,!1),s.addEventListener("webglcontextrestored",ee,!1),window.addEventListener("resize",ye),Ue.current(),()=>{E!==null&&window.clearTimeout(E),f!==null&&window.clearTimeout(f),s.removeEventListener("webglcontextlost",ae,!1),s.removeEventListener("webglcontextrestored",ee,!1),window.removeEventListener("resize",ye),_e.current!==null&&(cancelAnimationFrame(_e.current),_e.current=null),ze.current&&(C.deleteBuffer(ze.current),ze.current=null),Ke.current&&(C.deleteProgram(Ke.current),Ke.current=null),Q(C),Je.current=null,Mt.current=null}},[F,t,pr,Q,e,z]),m.useEffect(()=>{e&&(v||Ue.current())},[e,v,ce,J,lt,Ot,p,h,g,u,y,x,B,P,R,w,Z,N,K,te,ie,q,ot,qe,Ge,We,Re,ge,Te,Pe,Ve,re.x,re.y,re.z,se.r,se.g,se.b,ue.r,ue.g,ue.b,Se,at,Ce,Ie,nt,pe,He,Ut,Dt,vt,gt,Tt,it,st,we,Fe,St,Ye,be,Ze,Nt,Le,wt,zt,X]),m.useEffect(()=>{const s=window.setInterval(()=>{const E=performance.now(),f=$t.current,j=E-f.startTime;j<=0||(Yt({rendersPerSecond:f.count/(j/1e3),lastRenderMs:f.lastMs,avgRenderMs:f.count>0?f.totalMs/f.count:0}),f.startTime=E,f.count=0,f.totalMs=0,f.lastMs=0)},500);return()=>window.clearInterval(s)},[]);const et=m.useCallback(s=>{!e||!Number.isFinite(s)||(At.current+=s,Ue.current())},[e]),br=m.useCallback(()=>{e&&(At.current=0,Ue.current())},[e]),_r=m.useCallback(()=>[...oe.current],[]);return{effectiveIterations:T.effectiveIterations>0?T.effectiveIterations:$e(vt,jr,qr),isAtPrecisionLimit:!1,precisionMode:"F32",rendererBackend:mr,rendererDiagnostics:ut,rendererStats:Zt,adaptiveQualitySnapshot:T,render:X,nudgeCyclePhase:et,resetCyclePhase:br,getScenePrimaryRotationMatrix:_r}};export{Sl as A,to as B,fr as C,Jo as D,bs as E,ht as F,Zl as G,Yl as H,Kl as I,Jl as J,ps as K,Ya as M,Qr as P,tl as S,Ka as T,ac as a,cc as b,tc as c,mi as d,Ko as e,Ql as f,rc as g,oc as h,fi as i,_l as j,ma as k,ic as l,sc as m,Y as n,fc as o,ec as p,Vl as q,Hl as r,lc as s,Za as t,nc as u,rl as v,uc as w,hl as x,xl as y,yl as z};
