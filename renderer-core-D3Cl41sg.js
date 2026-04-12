import{r as d}from"./vendor-react-DXoTT26f.js";const ti={name:"Abyss",formula:`
    float p = t * 6.28318 + cycle * 0.8;
    float glow = pow(0.5 + 0.5 * sin(p + 1.1), 3.0);
    return vec3(
      0.00 + 0.04 * glow,
      0.02 + 0.28 * glow,
      0.06 + 0.55 * glow
    );
  `,metadata:{description:"Deep-ocean palette with low baseline luminance and cool highlights.",moodTags:["calm","deep","moody"],bestFor:["deep-zoom","low-fatigue","geometry-first"],contrastProfile:"balanced",cycleBehavior:"smooth",mathProfile:"nonlinear-glow",infoSnippet:"Abyss keeps noise low and rewards deep zoom patience.",messages:[{id:"p-abyss",text:"Abyss is less saturated; it helps track shape before color drama.",tone:"neutral",always:!1,conditions:{paletteName:"Abyss"}},{id:"p-abyss-deep",text:"At deep zoom, Abyss can reveal subtle boundary gradients hidden by hotter palettes.",tone:"tip",always:!1,conditions:{paletteName:"Abyss",minMagnification:5e5}}]}},ai=Object.freeze(Object.defineProperty({__proto__:null,abyss:ti},Symbol.toStringTag,{value:"Module"})),ri={name:"Aurora",formula:`
    float p = t * 6.28318 + cycle * 1.4;
    return vec3(
      0.25 + 0.25 * sin(p + 0.4) + 0.20 * sin(p * 2.1),
      0.45 + 0.35 * sin(p * 0.9 + 1.2),
      0.55 + 0.35 * cos(p + 2.1)
    );
  `,metadata:{description:"Cool-to-teal spectral blend with soft atmospheric transitions.",moodTags:["aurora","smooth","ethereal"],bestFor:["low-fatigue","animation","deep-zoom"],contrastProfile:"balanced",cycleBehavior:"smooth",mathProfile:"harmonic",infoSnippet:"Aurora favors smooth gradients and reduced visual harshness.",messages:[{id:"p-aurora",text:"Aurora keeps gradients silky and helps track broad shape flow.",tone:"neutral",always:!1,conditions:{paletteName:"Aurora"}}]}},oi=Object.freeze(Object.defineProperty({__proto__:null,aurora:ri},Symbol.toStringTag,{value:"Module"})),ni={name:"Bone",formula:`
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
  `,metadata:{description:"Muted earthy grayscale with warm bone highlights.",moodTags:["muted","vintage","low-saturation"],bestFor:["geometry-first","low-fatigue"],contrastProfile:"balanced",cycleBehavior:"smooth",mathProfile:"piecewise",infoSnippet:"Bone reduces color noise and emphasizes geometric contour first.",messages:[{id:"p-bone",text:"Bone is useful when you want structure without heavy color distraction.",tone:"tip",always:!1,conditions:{paletteName:"Bone"}}]}},ii=Object.freeze(Object.defineProperty({__proto__:null,bone:ni},Symbol.toStringTag,{value:"Module"})),si={name:"Bruise",formula:`
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
  `,metadata:{description:"Purple-blue palette with bruised gold accents and deep shadows.",moodTags:["moody","dramatic","noir"],bestFor:["boundary-tracking","high-energy","contour-separation"],contrastProfile:"high",cycleBehavior:"punchy",mathProfile:"piecewise",infoSnippet:"Bruise creates strong color drama without washing out dark interiors.",messages:[{id:"p-bruise",text:"Bruise is cinematic and high-drama; good for edge-rich regions.",tone:"highlight",always:!1,conditions:{paletteName:"Bruise"}}]}},li=Object.freeze(Object.defineProperty({__proto__:null,bruise:si},Symbol.toStringTag,{value:"Module"})),ci={name:"Cosmic",formula:`
    return vec3(
        0.5 + 0.5 * cos(3.0 + t + cycle * 0.5),
        0.5 + 0.5 * cos(3.0 + t * 0.7 + cycle * 0.3),
        0.5 + 0.5 * cos(3.0 + t * 0.5 + cycle * 0.2)
    );
  `,metadata:{description:"Warm plasma glow with cool highlights over dark interiors.",moodTags:["cinematic","high-contrast","classic"],bestFor:["boundary-tracking","contour-separation","animation"],contrastProfile:"high",cycleBehavior:"smooth",mathProfile:"harmonic",renderHints:{byColorizer:{statistical:{autoIterations:!1,maxIterations:50,statScale:.2}}},infoSnippet:"Cosmic emphasizes boundary glow and keeps stable interiors visually anchored.",messages:[{id:"p-cosmic-core",text:"Cosmic emphasizes glow edges and keeps interior sets dark and readable.",tone:"highlight",always:!1,conditions:{paletteName:"Cosmic"}},{id:"p-cosmic-cycle",text:"Cosmic cycling is smooth; slower rates help preserve shape perception.",tone:"note",always:!1,conditions:{paletteName:"Cosmic",paletteCycling:!0}}]}},ui=Object.freeze(Object.defineProperty({__proto__:null,cosmic:ci},Symbol.toStringTag,{value:"Module"})),fi={name:"Ember",formula:`
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
  `,metadata:{description:"Smoldering heat-map with warm highlights and dark embers.",moodTags:["warm","smoldering","dramatic"],bestFor:["contour-separation","boundary-tracking","high-energy"],contrastProfile:"high",cycleBehavior:"punchy",mathProfile:"piecewise",infoSnippet:"Ember favors warm contrast and reveals band layering clearly.",messages:[{id:"p-ember",text:"Ember emphasizes warm band transitions and works well on folded maps.",tone:"highlight",always:!1,conditions:{paletteName:"Ember"}},{id:"p-ember-cycle",text:"At high cycle speed, Ember can appear strobing in dense edge fields.",tone:"note",always:!1,conditions:{paletteName:"Ember",paletteCycling:!0}}]}},mi=Object.freeze(Object.defineProperty({__proto__:null,ember:fi},Symbol.toStringTag,{value:"Module"})),di={name:"Fire",formula:`
    return vec3(
        0.5 + 0.5 * cos(t * 0.8 + cycle),
        0.5 + 0.5 * cos(1.0 + t * 0.6 + cycle * 0.8),
        0.5 + 0.5 * cos(2.0 + t * 0.4 + cycle * 0.6)
    );
  `,metadata:{description:"Hot gradient tuned for strong thermal contrast.",moodTags:["fiery","dramatic","high-energy"],bestFor:["boundary-tracking","high-energy","contour-separation"],contrastProfile:"high",cycleBehavior:"punchy",mathProfile:"harmonic",infoSnippet:"Fire makes escape bands feel energetic and emphasizes ridge transitions.",messages:[{id:"p-fire",text:"Fire palette boosts contour contrast; ideal for ridge-heavy fractals.",tone:"highlight",always:!1,conditions:{paletteName:"Fire"}},{id:"p-fire-cycle",text:"Fire cycling can feel aggressive at high speed; reduce speed for readability.",tone:"note",always:!1,conditions:{paletteName:"Fire",paletteCycling:!0}}]}},bi=Object.freeze(Object.defineProperty({__proto__:null,fire:di},Symbol.toStringTag,{value:"Module"})),pi={name:"Firefly",formula:`
    float p = t * 6.28318 + cycle * 1.1;
    float g = pow(0.5 + 0.5 * sin(p + 0.7), 2.5);
    return vec3(
      0.02 + 0.18 * g,
      0.08 + 0.55 * g,
      0.01 + 0.10 * sin(p * 0.6 + 2.0)
    );
  `,metadata:{description:"Dark forest tones with bright bioluminescent green highlights.",moodTags:["night","organic","bioluminescent"],bestFor:["deep-zoom","animation","low-fatigue"],contrastProfile:"balanced",cycleBehavior:"smooth",mathProfile:"nonlinear-glow",infoSnippet:"Firefly gives a dark canvas with selective luminous accents.",messages:[{id:"p-firefly",text:"Firefly keeps most regions dark while making active bands glow.",tone:"highlight",always:!1,conditions:{paletteName:"Firefly"}},{id:"p-firefly-cycle",text:"Slow cycle rates preserve the natural glow effect in Firefly.",tone:"note",always:!1,conditions:{paletteName:"Firefly",paletteCycling:!0}}]}},_i=Object.freeze(Object.defineProperty({__proto__:null,firefly:pi},Symbol.toStringTag,{value:"Module"})),hi={name:"Gold",formula:`
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
  `,metadata:{description:"Warm metallic gold palette with amber-to-bronze transitions.",moodTags:["warm","metallic","classic"],bestFor:["boundary-tracking","contour-separation","animation"],contrastProfile:"high",cycleBehavior:"smooth",mathProfile:"piecewise",infoSnippet:"Gold accentuates warm contour halos while keeping interiors dark.",messages:[{id:"p-gold",text:"Gold highlights boundary halos and gives a classic warm fractint-style look.",tone:"highlight",always:!1,conditions:{paletteName:"Gold"}}]}},xi=Object.freeze(Object.defineProperty({__proto__:null,gold:hi},Symbol.toStringTag,{value:"Module"})),yi={name:"Ice",formula:`
    float p = t * 6.28318 + cycle * 0.7;
    float s = 0.5 + 0.5 * sin(p);
    return vec3(
      0.70 + 0.20 * s,
      0.85 + 0.12 * sin(p + 0.8),
      0.95 + 0.05 * cos(p + 1.8)
    );
  `,metadata:{description:"Glacial blue-white palette with clean, crisp luminance.",moodTags:["cool","clean","crisp"],bestFor:["geometry-first","low-fatigue","deep-zoom"],contrastProfile:"balanced",cycleBehavior:"smooth",mathProfile:"harmonic",infoSnippet:"Ice is high clarity and gentle enough for long inspection sessions.",messages:[{id:"p-ice",text:"Ice keeps edges crisp while avoiding heavy saturation.",tone:"neutral",always:!1,conditions:{paletteName:"Ice"}}]}},gi=Object.freeze(Object.defineProperty({__proto__:null,ice:yi},Symbol.toStringTag,{value:"Module"})),vi={name:"Neon",formula:`
    float p = t * 5.0 + cycle * 3.0;
    return vec3(
        abs(sin(p)),
        abs(cos(p * 0.5)),
        abs(sin(p * 0.2))
    );
  `,metadata:{description:"Vivid high-saturation palette for aggressive contour contrast.",moodTags:["neon","electric","bold"],bestFor:["high-energy","animation","boundary-tracking"],contrastProfile:"high",cycleBehavior:"high-contrast",mathProfile:"high-frequency",infoSnippet:"Neon is intentionally loud; best when you want structure to pop immediately.",messages:[{id:"p-neon",text:"Neon makes boundaries pop, but can hide subtle gradients in smooth regions.",tone:"highlight",always:!1,conditions:{paletteName:"Neon"}},{id:"p-neon-cycle",text:"Neon + cycling can become intense quickly; consider lowering cycle speed.",tone:"warn",always:!1,conditions:{paletteName:"Neon",paletteCycling:!0}}]}},Ti=Object.freeze(Object.defineProperty({__proto__:null,neon:vi},Symbol.toStringTag,{value:"Module"})),Si={name:"Plasma",formula:`
    float p = t * 2.0 + cycle * 2.0;
    return vec3(
        0.5 + 0.5 * sin(p),
        0.5 + 0.5 * sin(p + 2.094),
        0.5 + 0.5 * sin(p + 4.188)
    );
  `,metadata:{description:"Classic rainbow plasma for maximal contour visibility.",moodTags:["rainbow","classic","retro"],bestFor:["contour-separation","high-energy","animation"],contrastProfile:"high",cycleBehavior:"high-contrast",mathProfile:"high-frequency",infoSnippet:"Plasma is intentionally vivid and can expose contour spacing quickly.",messages:[{id:"p-plasma",text:"Plasma strongly separates contour bands, useful for spotting iteration gradients.",tone:"highlight",always:!1,conditions:{paletteName:"Plasma"}},{id:"p-plasma-cycle",text:"Fast cycling in Plasma can feel strobing; reduce speed for structure analysis.",tone:"warn",always:!1,conditions:{paletteName:"Plasma",paletteCycling:!0}}]}},Ei=Object.freeze(Object.defineProperty({__proto__:null,plasma:Si},Symbol.toStringTag,{value:"Module"})),zi={name:"Silver",formula:`
    float v = 0.5 + 0.5 * cos(t + cycle);
    return vec3(v, v, v * 1.1);
  `,metadata:{description:"Monochrome silver gradient emphasizing shape over hue.",moodTags:["monochrome","technical","minimal"],bestFor:["geometry-first","low-fatigue","deep-zoom"],contrastProfile:"balanced",cycleBehavior:"smooth",mathProfile:"monochrome",infoSnippet:"Silver is ideal when you want to focus on geometry and not color bias.",messages:[{id:"p-silver",text:"Silver removes most hue cues, making boundary geometry easier to judge.",tone:"tip",always:!1,conditions:{paletteName:"Silver"}}]}},Ai=Object.freeze(Object.defineProperty({__proto__:null,silver:zi},Symbol.toStringTag,{value:"Module"})),wi={name:"Toxic",formula:`
    float p = t * 6.28318 + cycle * 2.5;
    return vec3(
      0.30 + 0.25 * sin(p * 1.2 + 2.0),
      0.65 + 0.35 * sin(p + 0.2),
      0.02 + 0.12 * cos(p * 0.8)
    );
  `,metadata:{description:"Acid green palette with dark undertones and strong edge punch.",moodTags:["toxic","acid","high-energy"],bestFor:["high-energy","boundary-tracking","contour-separation"],contrastProfile:"high",cycleBehavior:"punchy",mathProfile:"high-frequency",infoSnippet:"Toxic is aggressive and can quickly reveal thin branch boundaries.",messages:[{id:"p-toxic",text:"Toxic makes active boundaries glow hard against dark interiors.",tone:"highlight",always:!1,conditions:{paletteName:"Toxic"}},{id:"p-toxic-cycle",text:"Toxic cycling can get visually intense; slower speeds improve readability.",tone:"warn",always:!1,conditions:{paletteName:"Toxic",paletteCycling:!0}}]}},Mi=Object.freeze(Object.defineProperty({__proto__:null,toxic:wi},Symbol.toStringTag,{value:"Module"})),Ri={name:"Verdigris",formula:`
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
  `,metadata:{description:"Copper-green oxidation palette with earthy transitions.",moodTags:["organic","earthy","aged-metal"],bestFor:["low-fatigue","geometry-first","deep-zoom"],contrastProfile:"balanced",cycleBehavior:"smooth",mathProfile:"piecewise",infoSnippet:"Verdigris gives natural-looking gradients that stay readable over long sessions.",messages:[{id:"p-verdigris",text:"Verdigris is great for long viewing sessions with lower visual fatigue.",tone:"neutral",always:!1,conditions:{paletteName:"Verdigris"}}]}},Pi=Object.freeze(Object.defineProperty({__proto__:null,verdigris:Ri},Symbol.toStringTag,{value:"Module"})),Ii=new Set(["neutral","tip","note","warn","highlight"]),vo=new Set(["harmonic","piecewise","monochrome","nonlinear-glow","high-frequency"]),To=new Set(["boundary-tracking","deep-zoom","low-fatigue","animation","geometry-first","high-energy","contour-separation"]),Ci=new Set(["cross","circle","box","gaussian-lattice"]),Li=new Set(["smooth","post-escape","orbit-trap","final-z","binary-decomposition","statistical","lyapunov"]),gr=e=>Array.isArray(e)&&e.every(t=>typeof t=="string"),C=e=>typeof e=="number"&&Number.isFinite(e),So=(e,t)=>{if(e===void 0)return[];if(!e||typeof e!="object"||Array.isArray(e))return[`${t} should be an object.`];const a=[];return e.autoIterations!==void 0&&typeof e.autoIterations!="boolean"&&a.push(`${t}.autoIterations should be a boolean.`),e.maxIterations!==void 0&&(!C(e.maxIterations)||e.maxIterations<=0)&&a.push(`${t}.maxIterations should be a positive number.`),e.postEscapeSteps!==void 0&&(!C(e.postEscapeSteps)||e.postEscapeSteps<0)&&a.push(`${t}.postEscapeSteps should be a non-negative number.`),e.orbitTrapShape!==void 0&&!Ci.has(e.orbitTrapShape)&&a.push(`${t}.orbitTrapShape "${String(e.orbitTrapShape)}" is invalid.`),e.orbitTrapScale!==void 0&&(!C(e.orbitTrapScale)||e.orbitTrapScale<=0)&&a.push(`${t}.orbitTrapScale should be a positive number.`),e.finalZMix!==void 0&&(!C(e.finalZMix)||e.finalZMix<0||e.finalZMix>1)&&a.push(`${t}.finalZMix should be within [0, 1].`),e.statScale!==void 0&&(!C(e.statScale)||e.statScale<0)&&a.push(`${t}.statScale should be a non-negative number.`),a},fn=(e,t)=>{if(e===void 0)return[];if(!Array.isArray(e))return[`${t}.messages should be an array.`];const a=[],r=new Set;return e.forEach((o,l)=>{const s=`${t}.messages[${l}]`;if(!o||typeof o!="object"){a.push(`${s} should be an object.`);return}typeof o.id!="string"||o.id.trim()===""?a.push(`${s}.id should be a non-empty string.`):r.has(o.id)?a.push(`${s}.id "${o.id}" is duplicated.`):r.add(o.id),(typeof o.text!="string"||o.text.trim()==="")&&a.push(`${s}.text should be a non-empty string.`),o.tone!==void 0&&!Ii.has(o.tone)&&a.push(`${s}.tone "${String(o.tone)}" is invalid.`),o.always!==void 0&&typeof o.always!="boolean"&&a.push(`${s}.always should be a boolean when provided.`);const n=o.conditions;if(n===void 0)return;if(!n||typeof n!="object"){a.push(`${s}.conditions should be an object when provided.`);return}n.minMagnification!==void 0&&!C(n.minMagnification)&&a.push(`${s}.conditions.minMagnification should be a number.`),n.maxMagnification!==void 0&&!C(n.maxMagnification)&&a.push(`${s}.conditions.maxMagnification should be a number.`),C(n.minMagnification)&&C(n.maxMagnification)&&n.minMagnification>n.maxMagnification&&a.push(`${s}.conditions minMagnification > maxMagnification.`),n.minZoomDepth!==void 0&&!C(n.minZoomDepth)&&a.push(`${s}.conditions.minZoomDepth should be a number.`),n.maxZoomDepth!==void 0&&!C(n.maxZoomDepth)&&a.push(`${s}.conditions.maxZoomDepth should be a number.`),C(n.minZoomDepth)&&C(n.maxZoomDepth)&&n.minZoomDepth>n.maxZoomDepth&&a.push(`${s}.conditions minZoomDepth > maxZoomDepth.`),n.paletteCycling!==void 0&&typeof n.paletteCycling!="boolean"&&a.push(`${s}.conditions.paletteCycling should be a boolean.`),n.minIterations!==void 0&&!C(n.minIterations)&&a.push(`${s}.conditions.minIterations should be a number.`),n.maxIterations!==void 0&&!C(n.maxIterations)&&a.push(`${s}.conditions.maxIterations should be a number.`),C(n.minIterations)&&C(n.maxIterations)&&n.minIterations>n.maxIterations&&a.push(`${s}.conditions minIterations > maxIterations.`);const p=(h,b)=>{h!==void 0&&typeof h!="string"&&(gr(h)||a.push(`${s}.conditions.${b} should be a string or string[].`))};p(n.precisionMode,"precisionMode"),p(n.paletteName,"paletteName"),p(n.fractalName,"fractalName")}),a},Fi=e=>{const t=e.metadata;if(t===void 0)return[];if(!t||typeof t!="object")return["metadata should be an object."];const a=[],r=(n,p)=>{n!==void 0&&typeof n!="string"&&a.push(`${p} should be a string.`)},o=(n,p)=>{n!==void 0&&typeof n!="boolean"&&a.push(`${p} should be a boolean.`)},l=(n,p)=>{n!==void 0&&!gr(n)&&a.push(`${p} should be a string array.`)};if(r(t.summary,"metadata.summary"),r(t.history,"metadata.history"),r(t.equationLabel,"metadata.equationLabel"),r(t.equationNotes,"metadata.equationNotes"),r(t.description,"metadata.description"),l(t.tips,"metadata.tips"),l(t.recommendedZooms,"metadata.recommendedZooms"),l(t.discoveries,"metadata.discoveries"),l(t.poiHints,"metadata.poiHints"),o(t.supportsDoublePrecision,"metadata.supportsDoublePrecision"),o(t.supportsJuliaSeed,"metadata.supportsJuliaSeed"),o(t.supportsOrbitTrap,"metadata.supportsOrbitTrap"),o(t.expensive,"metadata.expensive"),o(t.experimental,"metadata.experimental"),t.autoIterationDefault!==void 0){const n=t.autoIterationDefault;!n||typeof n!="object"?a.push("metadata.autoIterationDefault should be an object."):(n.enabled!==void 0&&typeof n.enabled!="boolean"&&a.push("metadata.autoIterationDefault.enabled should be a boolean."),n.profile!==void 0&&n.profile!=="conservative"&&n.profile!=="balanced"&&n.profile!=="custom"&&a.push("metadata.autoIterationDefault.profile should be conservative, balanced, or custom."),n.profile==="custom"&&t.autoIterationCurve===void 0&&a.push("metadata.autoIterationDefault.profile is custom but metadata.autoIterationCurve is missing."))}if(t.autoIterationCurve!==void 0){const n=t.autoIterationCurve;!n||typeof n!="object"?a.push("metadata.autoIterationCurve should be an object."):((!C(n.min)||n.min<=0)&&a.push("metadata.autoIterationCurve.min should be a positive number."),(!C(n.max)||n.max<=0)&&a.push("metadata.autoIterationCurve.max should be a positive number."),(!C(n.base)||n.base<=0)&&a.push("metadata.autoIterationCurve.base should be a positive number."),(!C(n.slope)||n.slope<0)&&a.push("metadata.autoIterationCurve.slope should be a non-negative number."),C(n.min)&&C(n.max)&&n.min>n.max&&a.push("metadata.autoIterationCurve.min should be <= metadata.autoIterationCurve.max."),n.gamma!==void 0&&(!C(n.gamma)||n.gamma<=0)&&a.push("metadata.autoIterationCurve.gamma should be a positive number when provided."),r(n.label,"metadata.autoIterationCurve.label"),r(n.description,"metadata.autoIterationCurve.description"))}if(t.autoIterationProfileOverrides!==void 0){const n=t.autoIterationProfileOverrides;if(!n||typeof n!="object")a.push("metadata.autoIterationProfileOverrides should be an object.");else{const p=(h,b)=>{if(h===void 0)return;if(!h||typeof h!="object"){a.push(`${b} should be an object when provided.`);return}const v=h,T=(m,y)=>{if(v[m]===void 0)return;if(!C(v[m])){a.push(`${b}.${m} should be a number.`);return}const x=v[m];y&&x<=0&&a.push(`${b}.${m} should be > 0.`),!y&&x<0&&a.push(`${b}.${m} should be >= 0.`)};T("min",!0),T("max",!0),T("base",!0),T("slope",!1),T("gamma",!0),C(v.min)&&C(v.max)&&v.min>v.max&&a.push(`${b}.min should be <= ${b}.max.`)};p(n.conservative,"metadata.autoIterationProfileOverrides.conservative"),p(n.balanced,"metadata.autoIterationProfileOverrides.balanced")}}t.safeDefaultIterations!==void 0&&(!C(t.safeDefaultIterations)||t.safeDefaultIterations<=0)&&a.push("metadata.safeDefaultIterations should be a positive number.");const s=t.infoPanel;return s!==void 0&&(!s||typeof s!="object"?a.push("metadata.infoPanel should be an object."):(r(s.overview,"metadata.infoPanel.overview"),r(s.boundary,"metadata.infoPanel.boundary"),r(s.deep,"metadata.infoPanel.deep"),r(s.ultradeep,"metadata.infoPanel.ultradeep"),l(s.trivia,"metadata.infoPanel.trivia"),a.push(...fn(s.messages,"metadata.infoPanel")))),a},Bi=e=>{const t=e.metadata;if(t===void 0)return[];if(!t||typeof t!="object")return["metadata should be an object."];const a=[],r=(l,s)=>{l!==void 0&&typeof l!="string"&&a.push(`${s} should be a string.`)},o=(l,s)=>{l!==void 0&&!gr(l)&&a.push(`${s} should be a string array.`)};return r(t.description,"metadata.description"),o(t.moodTags,"metadata.moodTags"),o(t.bestFor,"metadata.bestFor"),r(t.contrastProfile,"metadata.contrastProfile"),r(t.cycleBehavior,"metadata.cycleBehavior"),r(t.mathProfile,"metadata.mathProfile"),r(t.infoSnippet,"metadata.infoSnippet"),t.renderHints!==void 0&&(!t.renderHints||typeof t.renderHints!="object"||Array.isArray(t.renderHints)?a.push("metadata.renderHints should be an object."):(a.push(...So(t.renderHints.default,"metadata.renderHints.default")),t.renderHints.byColorizer!==void 0&&(!t.renderHints.byColorizer||typeof t.renderHints.byColorizer!="object"||Array.isArray(t.renderHints.byColorizer)?a.push("metadata.renderHints.byColorizer should be an object."):Object.entries(t.renderHints.byColorizer).forEach(([l,s])=>{Li.has(l)||a.push(`metadata.renderHints.byColorizer key "${l}" is not a known colorizer mode.`),a.push(...So(s,`metadata.renderHints.byColorizer.${l}`))})))),t.mathProfile!==void 0&&!vo.has(t.mathProfile)&&a.push(`metadata.mathProfile "${t.mathProfile}" is not in the canonical set (${Array.from(vo).join(", ")}).`),Array.isArray(t.bestFor)&&t.bestFor.forEach((l,s)=>{To.has(l)||a.push(`metadata.bestFor[${s}] "${l}" is not in the canonical set (${Array.from(To).join(", ")}).`)}),a.push(...fn(t.messages,"metadata")),a},Ui=Object.assign({"../palettes/abyss.ts":ai,"../palettes/aurora.ts":oi,"../palettes/bone.ts":ii,"../palettes/bruise.ts":li,"../palettes/cosmic.ts":ui,"../palettes/ember.ts":mi,"../palettes/fire.ts":bi,"../palettes/forest-firefly.ts":_i,"../palettes/gold.ts":xi,"../palettes/ice.ts":gi,"../palettes/neon.ts":Ti,"../palettes/plasma.ts":Ei,"../palettes/silver.ts":Ai,"../palettes/toxic.ts":Mi,"../palettes/verdigris.ts":Pi}),Ut={},Di=[],Ni=new Set,_r=new Set;let mn=0;const dn=e=>{if(typeof e!="object"||e===null)return!1;const t=e;return typeof t.name=="string"&&typeof t.formula=="string"},ki=e=>{const t=e.trim();return t.length>0?t:"Palette"},Oi=e=>{let t=2,a=`${e} ${t}`;for(;Ut[a];)t+=1,a=`${e} ${t}`;return a},bn=(e,t)=>{const a=Bi(e);return a.forEach(r=>{console.warn(`[Palette metadata] ${e.name} (${t}): ${r}`)}),a},$i=()=>{mn+=1,_r.forEach(e=>e())};Object.entries(Ui).sort(([e],[t])=>e.localeCompare(t)).forEach(([e,t])=>{var o,l;if(e.endsWith("index.ts"))return;const a=Object.values(t).find(dn);if(!a)return;if(Ut[a.name]){console.warn(`Duplicate palette name "${a.name}" in ${e}; keeping the first definition.`);return}const r=bn(a,e);Di.push({name:a.name,path:e,hasMetadata:!!a.metadata,messageCount:((l=(o=a.metadata)==null?void 0:o.messages)==null?void 0:l.length)??0,warnings:r}),Ut[a.name]=a});const vr=new Proxy(Ut,{get(e,t){if(typeof t=="string"&&!isNaN(Number(t))){const a=Number(t),r=Object.keys(e);return e[r[a]]}return e[t]}}),Xi=()=>Object.keys(Ut),Gc=(e,t)=>{if(!dn(e))throw new Error("Invalid palette definition. Expected name/formula fields.");const a=ki((t==null?void 0:t.preferredName)??e.name),r=!!(t!=null&&t.overwriteExisting),o=Ut[a]&&!r?Oi(a):a,l={...e,name:o,formula:e.formula.trim()};return bn(l,"runtime"),Ut[l.name]=l,Ni.add(l.name),$i(),l},ji=e=>(_r.add(e),()=>{_r.delete(e)}),Eo=()=>mn,Vc=e=>{if(e===void 0)return zo;const t=vr[e];return t?t.name:zo},zo="Cosmic",Tr=[{id:"cos-phi",code:0,label:"cos(phi)",token:"COS(PHI)"},{id:"neg-cos-phi",code:1,label:"-cos(phi)",token:"NEGATIVE COS(PHI)"},{id:"cos-theta",code:2,label:"cos(theta)",token:"COS(THETA)"},{id:"neg-cos-theta",code:3,label:"-cos(theta)",token:"NEGATIVE COS(THETA)"},{id:"sin-phi",code:4,label:"sin(phi)",token:"SIN(PHI)"},{id:"neg-sin-phi",code:5,label:"-sin(phi)",token:"NEGATIVE SIN(PHI)"},{id:"sin-theta",code:6,label:"sin(theta)",token:"SIN(THETA)"},{id:"neg-sin-theta",code:7,label:"-sin(theta)",token:"NEGATIVE SIN(THETA)"}],pn=[{id:"x",code:0,label:"X axis"},{id:"y",code:1,label:"Y axis"},{id:"z",code:2,label:"Z axis"}],_n="classic",qi="cos-phi",Gi="sin-phi",Vi="cos-theta",Wi="cos-phi",Hi="z",Zi="y",Yi="x",Ki="z",Ji=0,Qi=0,es=0,ts=0,ma=new Map(Tr.map(e=>[e.id,e]));new Map(Tr.map(e=>[e.code,e]));const hn=new Map(pn.map(e=>[e.id,e]));new Map(pn.map(e=>[e.code,e]));const as=e=>e==="classic"||e==="custom",rs=e=>typeof e=="string"&&ma.has(e),os=e=>typeof e=="string"&&hn.has(e),Wc=(e,t=_n)=>as(e)?e:t,Hc=(e,t=Wi)=>rs(e)?e:t,Zc=(e,t=Ki)=>os(e)?e:t,Ao=e=>e==="custom"?1:0,Yt=e=>{var t;return((t=ma.get(e))==null?void 0:t.code)??0},Kt=e=>{var t;return((t=hn.get(e))==null?void 0:t.code)??2},ns=(e,t,a)=>{var s,n,p;const r=((s=ma.get(e))==null?void 0:s.token)??"COS(PHI)",o=((n=ma.get(t))==null?void 0:n.token)??"COS(PHI)",l=((p=ma.get(a))==null?void 0:p.token)??"COS(PHI)";return`${r} ${o} ${l}`},is=()=>{const e=[],t=Tr.map(r=>r.id);let a=0;for(const r of t)for(const o of t)for(const l of t)a+=1,e.push({id:`trig-${String(a).padStart(3,"0")}`,index:a-1,label:`Preset ${a}`,phrase:ns(r,o,l),x:r,y:o,z:l});return e},Yc=is(),ss={name:"Barnsley I",category:"Experimental",formula:`
    float sx = z.x >= 0.0 ? 1.0 : -1.0;
    float ax = z.x - sx;

    x = ax * c.x - z.y * c.y;
    y = ax * c.y + z.y * c.x;
    z = vec2(x, y);
  `,initialCenter:{x:0,y:0},initialZoom:4,initialPalette:0,metadata:{summary:"Sign-split dynamics produce abrupt branch turns and folded wisps.",equationLabel:"z(n+1) = (z - sign(Re(z))) * c",equationNotes:"Piecewise sign handling creates directional discontinuities.",experimental:!0,infoPanel:{messages:[{id:"b1-core",text:"Barnsley I responds strongly to sign flips across the vertical axis.",tone:"tip",always:!0},{id:"b1-iter-window",text:"Moderate iteration windows often preserve branch shape better than maxed-out fills.",tone:"note",always:!1,conditions:{minIterations:250,maxIterations:1200}}]}}},ls=Object.freeze(Object.defineProperty({__proto__:null,barnsley1:ss},Symbol.toStringTag,{value:"Module"})),cs={name:"Buffalo",category:"Symmetry",formula:`
    x = abs(z.x * z.x - z.y * z.y) + c.x;
    y = abs(2.0 * z.x * z.y) + c.y;
    z = vec2(x, y);
  `,initialCenter:{x:-.5,y:0},initialZoom:3,metadata:{summary:"Absolute-value folding on both axes yields dense horn-like branching.",equationLabel:"z(n+1) = (|Re(z^2)| + i|Im(z^2)|) + c",equationNotes:"Double absolute folding amplifies mirrored ridge structures.",infoPanel:{messages:[{id:"buff-core",text:"Buffalo ridges repeat in mirrored bursts; inspect horn tips for nested copies.",tone:"tip",always:!0},{id:"buff-deep",text:"Deep regions can alternate between smooth basins and sudden serrated walls.",tone:"highlight",always:!1,conditions:{minMagnification:8e5}}]}}},us=Object.freeze(Object.defineProperty({__proto__:null,buffalo:cs},Symbol.toStringTag,{value:"Module"})),fs={name:"Burning Ship",category:"Symmetry",formula:`
    x = (z.x * z.x - z.y * z.y) + c.x;
    y = abs(2.0 * z.x * z.y) + c.y;
    z = vec2(x, y);
    z = abs(z);
  `,initialCenter:{x:-1.75,y:-.02},initialZoom:.1,initialPalette:"Fire",metadata:{summary:"Absolute-value folding creates jagged ridges and ship-like silhouettes.",equationLabel:"z(n+1) = (|Re(z)| + i|Im(z)|)^2 + c",equationNotes:"The fold before squaring is what produces the sharp ridge geometry.",infoPanel:{messages:[{id:"bs-ridges",text:"Burning Ship rewards vertical scans: ridges and bays repeat with hard-edged symmetry.",tone:"tip",always:!0},{id:"bs-low",text:"Low magnification shows large hull-like forms before filament detail emerges.",tone:"neutral",always:!1,conditions:{maxMagnification:250}},{id:"bs-high",text:"At high magnification, tiny ridges can dominate before smooth gradients return.",tone:"highlight",always:!1,conditions:{minMagnification:2e5}},{id:"bs-precision",text:"Precision-assisted modes reduce staircase artifacts in narrow ridge corridors.",tone:"note",always:!1,conditions:{precisionMode:["DF64","PTB"]}},{id:"bs-iter-window",text:"If ridge contrast is muddy, back iterations down into a midrange window.",tone:"note",always:!1,conditions:{minIterations:350,maxIterations:1500}}]},poiHints:["Explore near -1.7443359375 - 0.017451171875i for iconic ship ridges.","Try -1.755 + -0.03i for jagged bay structures.","Scan vertical seams around x=-1.76 for repeating flame-like peaks."]}},ms=Object.freeze(Object.defineProperty({__proto__:null,burningShip:fs},Symbol.toStringTag,{value:"Module"})),ds={name:"Celtic",category:"Symmetry",formula:`
    x = abs(z.x * z.x - z.y * z.y) + c.x;
    y = (2.0 * z.x * z.y) + c.y;
    z = vec2(x, y);
  `,initialCenter:{x:-.5,y:0},initialZoom:3,metadata:{summary:"Celtic folding keeps one component signed and one absolute, creating braided seams.",equationLabel:"z(n+1) = (|Re(z^2)| + iIm(z^2)) + c",equationNotes:"Partial folding introduces asymmetry compared with Buffalo and Burning Ship.",infoPanel:{messages:[{id:"celtic-core",text:"Celtic boundaries often look braided; pan along seam lines to find repeating knots.",tone:"tip",always:!0},{id:"celtic-mid",text:"Middle magnification is a sweet spot for knot-like motifs before dense noise appears.",tone:"neutral",always:!1,conditions:{minMagnification:100,maxMagnification:2e5}}]}}},bs=Object.freeze(Object.defineProperty({__proto__:null,celtic:ds},Symbol.toStringTag,{value:"Module"})),ps={name:"Split Square",category:"Experimental",formula:`
    float sx = z.x >= 0.0 ? 1.0 : -1.0;
    float sy = z.y >= 0.0 ? 1.0 : -1.0;

    float ax = z.x * z.x - z.y * z.y;
    float ay = 2.0 * abs(z.x) * abs(z.y);

    x = ax + c.x + 0.25 * sx;
    y = ay + c.y + 0.25 * sy;
    z = vec2(x, y);
  `,initialCenter:{x:0,y:0},initialZoom:3,initialPalette:0,metadata:{summary:"Quadrant-aware offsets split similar regions into offset branch families.",equationLabel:"z(n+1) = split(z^2) + c + offset(sign(z))",equationNotes:"Small sign-based offsets introduce grid-like branch separations.",experimental:!0,infoPanel:{messages:[{id:"split-core",text:"Split Square reacts to quadrant changes; crossing axes can re-route filaments abruptly.",tone:"tip",always:!0},{id:"split-iter",text:"If colors fill too quickly, reduce iterations to recover the split-branch silhouette.",tone:"note",always:!1,conditions:{minIterations:800}}]}}},_s=Object.freeze(Object.defineProperty({__proto__:null,splitSquare:ps},Symbol.toStringTag,{value:"Module"})),hs={name:"Cubic",category:"Power",formula:`
    x = z.x * (z.x * z.x - 3.0 * z.y * z.y) + c.x;
    y = z.y * (3.0 * z.x * z.x - z.y * z.y) + c.y;
    z = vec2(x, y);
  `,initialCenter:{x:0,y:0},initialZoom:3,metadata:{summary:"Third-order power maps produce three-way rotational branch patterns.",equationLabel:"z(n+1) = z(n)^3 + c",equationNotes:"Cubic power introduces tri-lobed rotational structure.",infoPanel:{messages:[{id:"cubic-core",text:"Cubic mode often reveals tri-symmetric petals around major hubs.",tone:"tip",always:!0},{id:"cubic-precision",text:"Precision upgrades help keep thin cubic filaments coherent at deep zoom.",tone:"note",always:!1,conditions:{precisionMode:["DF64","PTB"]}}]}}},xs=Object.freeze(Object.defineProperty({__proto__:null,cubic:hs},Symbol.toStringTag,{value:"Module"})),ys=e=>{const t=[];let a=0;const r=(o,l)=>t.push({type:o,value:l});for(;a<e.length;){const o=e[a];if(/\s/.test(o)){a+=1;continue}if(/[0-9.]/.test(o)){const l=a;let s=o===".";for(a+=1;a<e.length;){const n=e[a];if(/[0-9]/.test(n)){a+=1;continue}if(n==="."&&!s){s=!0,a+=1;continue}if((n==="e"||n==="E")&&a+1<e.length){const p=e[a+1];if(p==="+"||p==="-"||/[0-9]/.test(p)){for(a+=2;a<e.length&&/[0-9]/.test(e[a]);)a+=1;continue}}break}r("number",e.slice(l,a));continue}if(/[A-Za-z_]/.test(o)){const l=a;for(a+=1;a<e.length&&/[A-Za-z0-9_.]/.test(e[a]);)a+=1;r("ident",e.slice(l,a));continue}if(o==="+"||o==="-"||o==="*"||o==="/"){r("op",o),a+=1;continue}if(o==="("||o===")"){r("paren",o),a+=1;continue}if(o===","){r("comma",o),a+=1;continue}throw new Error(`Unsupported token "${o}"`)}return r("eof",""),t};class gs{constructor(t){this.pos=0,this.tokens=ys(t)}peek(){return this.tokens[this.pos]}advance(){const t=this.tokens[this.pos];return this.pos+=1,t}match(t,a){const r=this.peek();return r.type!==t||a!==void 0&&r.value!==a?!1:(this.pos+=1,!0)}expect(t,a){const r=this.peek();if(r.type!==t||a!==void 0&&r.value!==a){const o=a!==void 0?`${t}("${a}")`:t;throw new Error(`Expected ${o}, got ${r.type}("${r.value}")`)}return this.advance()}parseExpression(){const t=this.parseAddSub();if(this.peek().type!=="eof")throw new Error(`Unexpected trailing token "${this.peek().value}"`);return t}parseAddSub(){let t=this.parseMulDiv();for(;this.peek().type==="op"&&(this.peek().value==="+"||this.peek().value==="-");){const a=this.advance().value,r=this.parseMulDiv();t={kind:"binary",op:a,left:t,right:r}}return t}parseMulDiv(){let t=this.parseUnary();for(;this.peek().type==="op"&&(this.peek().value==="*"||this.peek().value==="/");){const a=this.advance().value,r=this.parseUnary();t={kind:"binary",op:a,left:t,right:r}}return t}parseUnary(){if(this.peek().type==="op"&&(this.peek().value==="+"||this.peek().value==="-")){const t=this.advance().value,a=this.parseUnary();return{kind:"unary",op:t,arg:a}}return this.parsePrimary()}parsePrimary(){const t=this.peek();if(t.type==="number")return this.advance(),{kind:"number",value:t.value};if(t.type==="ident"){if(this.advance(),this.match("paren","(")){const a=[];if(!this.match("paren",")")){do a.push(this.parseAddSub());while(this.match("comma"));this.expect("paren",")")}return{kind:"call",name:t.value,args:a}}return{kind:"ident",value:t.value}}if(this.match("paren","(")){const a=this.parseAddSub();return this.expect("paren",")"),a}throw new Error(`Unexpected token ${t.type}("${t.value}")`)}}const vs=e=>e.replace(/\/\/.*$/gm,"").replace(/\r/g,"").trim(),fa=e=>{if(e.kind==="number")return`df_set(${e.value})`;if(e.kind==="ident")return e.value==="z.x"?"zx":e.value==="z.y"?"zy":e.value==="c.x"?"cx":e.value==="c.y"?"cy":e.value==="x"?"x":e.value==="y"?"y":e.value;if(e.kind==="unary"){const t=fa(e.arg);return e.op==="+"?t:`df_neg(${t})`}if(e.kind==="binary"){const t=fa(e.left),a=fa(e.right);return e.op==="+"?`df_add(${t}, ${a})`:e.op==="-"?`df_sub(${t}, ${a})`:e.op==="*"?`df_mul(${t}, ${a})`:`df_div(${t}, ${a})`}if(e.kind==="call"){if(e.name==="abs"&&e.args.length===1)return`df_abs(${fa(e.args[0])})`;throw new Error(`Unsupported function "${e.name}"`)}throw new Error("Unsupported expression node")},wo=e=>{const a=new gs(e).parseExpression();return fa(a)},Ts=e=>e.split(";").map(t=>t.trim()).filter(Boolean),xn=e=>{const t=vs(e);if(!t)return{dfFormula:null,reason:"Formula is empty."};if(/[?:]/.test(t))return{dfFormula:null,reason:"Ternary operators are not supported yet."};if(/\bif\s*\(/.test(t))return{dfFormula:null,reason:"Conditional blocks are not supported yet."};if(/\bvec2\s+\w+\s*=/.test(t))return{dfFormula:null,reason:"Local vec2 declarations are not supported yet."};if(/\b(dot|length|atan|pow|exp|sin|cos)\s*\(/.test(t))return{dfFormula:null,reason:"Transcendental/vector intrinsics are not supported yet."};const a=Ts(t),r=[],o=new Set;let l=!1;for(const s of a){const n=s.match(/^float\s+([A-Za-z_]\w*)\s*=\s*(.+)$/);if(n){const[,T,m]=n,y=wo(m);o.has(T)?r.push(`${T} = ${y};`):(r.push(`vec2 ${T} = ${y};`),o.add(T));continue}const p=s.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/);if(!p)return{dfFormula:null,reason:`Unsupported statement "${s}".`};const[,h,b]=p;if(h==="z"){if(/^vec2\s*\(\s*x\s*,\s*y\s*\)$/.test(b)){r.push("zx = x;"),r.push("zy = y;"),l=!0;continue}if(/^abs\s*\(\s*z\s*\)$/.test(b)){r.push("zx = df_abs(zx);"),r.push("zy = df_abs(zy);"),l=!0;continue}return{dfFormula:null,reason:`Unsupported z assignment "${b}".`}}const v=wo(b);o.has(h)?r.push(`${h} = ${v};`):(r.push(`vec2 ${h} = ${v};`),o.add(h))}return l?{dfFormula:r.map(s=>`    ${s}`).join(`
`)}:{dfFormula:null,reason:"No z assignment found."}},Ss=Object.freeze(Object.defineProperty({__proto__:null,autoGenerateDfFormula:xn},Symbol.toStringTag,{value:"Module"})),Es={name:"Expbrot",category:"Transcendental",formula:`
    float ex = exp(z.x);
    x = ex * cos(z.y) + c.x;
    y = ex * sin(z.y) + c.y;
    z = vec2(x, y);
  `,initialCenter:{x:-1,y:0},initialZoom:2.5,initialPalette:0,metadata:{summary:"Exponential growth and trigonometric phase create rapid regime changes.",equationLabel:"z(n+1) = exp(z(n)) + c",equationNotes:"Magnitude growth can become abrupt due to exp(Re(z)).",expensive:!0,infoPanel:{messages:[{id:"exp-core",text:"Expbrot can jump quickly between calm and explosive zones.",tone:"tip",always:!0},{id:"exp-iter-window",text:"For readability, keep iterations moderate unless you are chasing tiny fold bands.",tone:"note",always:!1,conditions:{minIterations:400,maxIterations:1400}}]}}},zs=Object.freeze(Object.defineProperty({__proto__:null,expbrot:Es},Symbol.toStringTag,{value:"Module"})),As={name:"Feather",category:"Rational",formula:`
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
  `,initialCenter:{x:0,y:0},initialZoom:3,initialPalette:0,metadata:{summary:"Rational cubic-over-quadratic structure generates feathery curls and sweeps.",equationLabel:"z(n+1) = z(n)^3 / (1 + z(n)^2) + c",equationNotes:"The denominator damps growth and creates layered filament flow.",infoPanel:{messages:[{id:"feather-core",text:"Feather tends to form layered curls; follow one strand to locate repeating fans.",tone:"tip",always:!0},{id:"feather-deep",text:"At deep zoom, feather structures can appear soft until a thin seam is crossed.",tone:"highlight",always:!1,conditions:{minMagnification:6e5}}]}}},ws=Object.freeze(Object.defineProperty({__proto__:null,feather:As},Symbol.toStringTag,{value:"Module"})),Ms={name:"Inverse",category:"Standard",fixedIterations:50,escapeRadiusSquared:256,formula:`
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
  `,initialCenter:{x:0,y:0},initialZoom:3,metadata:{summary:"Inversion before squaring emphasizes outer-plane dynamics and pole behavior.",equationLabel:"z(n+1) = (1 / z(n))^2 + c",equationNotes:"Original inverse-square map with soft near-origin denominator regularization.",infoPanel:{messages:[{id:"inv-core",text:"Inverse mode accentuates behavior near poles; tiny pans can radically alter motifs.",tone:"tip",always:!0},{id:"inv-precision",text:"Precision upgrades help preserve narrow pole-adjacent structures.",tone:"note",always:!1,conditions:{precisionMode:["DF64","PTB"]}}]}}},Rs=Object.freeze(Object.defineProperty({__proto__:null,inverse:Ms},Symbol.toStringTag,{value:"Module"})),Ps={name:"Julia Set",category:"Standard",isJulia:!0,formula:`
    x = (z.x * z.x - z.y * z.y) + c.x;
    y = (2.0 * z.x * z.y) + c.y;
    z = vec2(x, y);
  `,df_formula:`
    vec2 x2 = df_mul(zx, zx);
    vec2 y2 = df_mul(zy, zy);
    vec2 xy = df_mul(zx, zy);
    zx = df_add(df_sub(x2, y2), cx);
    zy = df_add(df_add(xy, xy), cy);
  `,initialCenter:{x:0,y:0},initialZoom:3,initialPalette:1,metadata:{summary:"Julia topology is controlled by the seed; tiny seed shifts can reorganize the whole scene.",equationLabel:"z(n+1) = z(n)^2 + c (fixed c)",equationNotes:"Unlike Mandelbrot exploration, c stays fixed and z starts from pixel position.",safeDefaultIterations:50,autoIterationDefault:{enabled:!0,profile:"conservative"},autoIterationProfileOverrides:{conservative:{gamma:.85}},infoPanel:{messages:[{id:"j-seed",text:"Julia structure is seed-driven. Try subtle seed changes to watch topology jump.",tone:"tip",always:!0},{id:"j-mid",text:"Mid magnification often reveals dust fields and disconnected islands.",tone:"neutral",always:!1,conditions:{minMagnification:80,maxMagnification:5e4}},{id:"j-deep",text:"Deep Julia zooms can appear smooth until a boundary is crossed; keep panning slowly.",tone:"highlight",always:!1,conditions:{minMagnification:5e5}},{id:"j-cycle",text:"Cycling can exaggerate contour bands in Julia dust regions.",tone:"note",always:!1,conditions:{paletteCycling:!0}},{id:"j-precision",text:"Precision-assisted modes preserve thin Julia seams during very deep zoom.",tone:"note",always:!1,conditions:{precisionMode:["DF64","PTB"]}},{id:"j-iter-window",text:"A moderate iteration window usually keeps Julia voids visible.",tone:"note",always:!1,conditions:{minIterations:200,maxIterations:1200}}]},poiHints:["For classic dendrites, try c around -0.8 + 0.156i.","For dust-heavy sets, try c around 0.285 + 0.01i.","For pinched spirals, try c around -0.7269 + 0.1889i."]}},Is=Object.freeze(Object.defineProperty({__proto__:null,julia:Ps},Symbol.toStringTag,{value:"Module"})),Cs={name:"Lambda",category:"Rational",initZFromPosition:!0,formula:`
    float oneMinusX = 1.0 - z.x;
    float oneMinusY = -z.y;
    float rx = z.x * oneMinusX - z.y * oneMinusY;
    float ry = z.x * oneMinusY + z.y * oneMinusX;

    x = c.x * rx - c.y * ry;
    y = c.x * ry + c.y * rx;
    z = vec2(x, y);
  `,initialCenter:{x:0,y:0},initialZoom:2.8,initialPalette:0,metadata:{summary:"Rational dynamics create sudden pockets of stability around chaotic folds.",equationLabel:"z(n+1) = c * z(n) * (1 - z(n))",equationNotes:"Complex logistic-style map with dense transitions between basin behavior.",experimental:!0,infoPanel:{messages:[{id:"l-core",text:"Lambda can jump from smooth basins to noisy seams with small coordinate changes.",tone:"tip",always:!0},{id:"l-overview",text:"Start broad, then pick edge pockets where dark regions touch bright turbulence.",tone:"neutral",always:!1,conditions:{maxMagnification:1e3}},{id:"l-precision",text:"Higher precision helps preserve thin transition bands in rational maps.",tone:"note",always:!1,conditions:{precisionMode:["DF64","PTB"]}},{id:"l-iter-window",text:"Moderate iterations often show basin structure more clearly than max depth.",tone:"note",always:!1,conditions:{minIterations:220,maxIterations:1100}}]},poiHints:["Probe edges where dark pockets touch bright bands around the default center.","Pan in tiny steps near basin boundaries; Lambda can flip behavior abruptly.","Use slower palette cycling while tracing transition seams."]}},Ls=Object.freeze(Object.defineProperty({__proto__:null,lambda:Cs},Symbol.toStringTag,{value:"Module"})),Fs={name:"Magnet I",category:"Rational",formula:`
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
  `,initialCenter:{x:.5,y:0},initialZoom:3,initialPalette:0,metadata:{summary:"Magnet maps use rational quotients that create magnetic basin captures.",equationLabel:"z(n+1) = ((z^2 + c - 1) / (2z + c - 2))^2",equationNotes:"Quotient dynamics can produce abrupt attraction and release regions.",infoPanel:{messages:[{id:"mag-core",text:"Magnet I often forms pocket basins around sharp transition walls.",tone:"tip",always:!0},{id:"mag-iter",text:"Higher iterations can overfill basin interiors; reduce steps to re-expose separatrices.",tone:"note",always:!1,conditions:{minIterations:900}}]}}},Bs=Object.freeze(Object.defineProperty({__proto__:null,magnet1:Fs},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */const ar=`
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,rr=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,yn=`
precision highp float;

uniform int u_scene_fractal_kind;
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
uniform int u_bulb_trig_theta_axis[MAX_BULBS];
uniform int u_bulb_trig_phi_axis_a[MAX_BULBS];
uniform int u_bulb_trig_phi_axis_b[MAX_BULBS];
uniform float u_bulb_trig_theta_offset[MAX_BULBS];
uniform float u_bulb_trig_phi_offset[MAX_BULBS];
uniform float u_bulb_trig_theta_rate[MAX_BULBS];
uniform float u_bulb_trig_phi_rate[MAX_BULBS];
uniform int u_palette_sample_count;
uniform vec3 u_palette_samples[PALETTE_SAMPLE_CAP];

#define MAX_STEPS_CAP 1024
#define ITERATIONS_CAP 128
const vec3 TANK_WATER_TINT = vec3(0.04, 0.24, 0.30);
const vec3 TANK_SHELL_TINT = vec3(0.12, 0.44, 0.52);
const float TANK_REFRACTION_INDEX = 1.33;
// Keep background stable unless/until we expose an intentional starfield control.
const float BACKGROUND_STARFIELD_STRENGTH = 0.0;
const float BULB_BROAD_PHASE_MAX_RADIUS = 96.0;

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

int sanitizeSceneFractalKind(int fractalKind) {
  if (fractalKind == 1) return 1;
  return 0;
}

int sanitizeTrigAxis(int trigAxis) {
  if (trigAxis < 0) return 0;
  if (trigAxis > 2) return 2;
  return trigAxis;
}

float trigAxisComponent(vec3 v, int axis) {
  int safeAxis = sanitizeTrigAxis(axis);
  if (safeAxis == 0) return v.x;
  if (safeAxis == 1) return v.y;
  return v.z;
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
  int trigThetaAxis,
  int trigPhiAxisA,
  int trigPhiAxisB,
  float trigThetaOffset,
  float trigPhiOffset,
  float trigThetaRate,
  float trigPhiRate,
  int sceneIterations,
  bool useOrbitTraps,
  out float orbit,
  out vec3 planeTrap,
  out float originTrap
) {
  float safePowerMagnitude = max(abs(power), 0.25);
  float signedPower = power < 0.0 ? -safePowerMagnitude : safePowerMagnitude;
  float safeBailout = max(abs(bailoutRadius), 1.05);
  int safeTrigMode = sanitizeTrigMode(trigMode);
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
    float safeR = max(r, 1e-8);
    float theta = acos(clamp(z.z / safeR, -1.0, 1.0));
    float phi = atan(z.y, z.x);
    dr = pow(max(r, 1e-8), safePowerMagnitude - 1.0) * safePowerMagnitude * dr + 1.0;
    float zr = pow(max(r, 1e-8), safePowerMagnitude);
    if (signedPower < 0.0) {
      zr = 1.0 / max(zr, 1e-8);
    }

    vec3 direction;
    if (safeTrigMode == 1) {
      float thetaSource = trigAxisComponent(z, trigThetaAxis);
      float phiSourceA = trigAxisComponent(z, trigPhiAxisA);
      float phiSourceB = trigAxisComponent(z, trigPhiAxisB);
      theta = acos(clamp(thetaSource / safeR, -1.0, 1.0));
      phi = atan(phiSourceA, phiSourceB);
      theta = (theta * signedPower) + trigThetaOffset + (u_time * trigThetaRate);
      phi = (phi * signedPower) + trigPhiOffset + (u_time * trigPhiRate);
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
      theta = theta * signedPower;
      phi = phi * signedPower;
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

float mandelbox(
  vec3 p,
  float scale,
  float bailoutRadius,
  int sceneIterations,
  bool useOrbitTraps,
  out float orbit,
  out vec3 planeTrap,
  out float originTrap
) {
  // Reuse the existing "Bulb Power" control while mapping into a practical
  // Mandelbox scale range.
  float safeScale = clamp(scale * 0.25, -4.0, 4.0);
  if (abs(safeScale) < 0.2) {
    safeScale = safeScale < 0.0 ? -0.2 : 0.2;
  }
  float safeBailout = max(abs(bailoutRadius) * 2.0, 4.0);
  float safeBailoutSq = safeBailout * safeBailout;
  const float fixedRadiusSq = 1.0;
  const float minRadiusSq = 0.25;

  vec3 z = p;
  float dr = 1.0;
  orbit = 1e10;
  planeTrap = vec3(1e10);
  originTrap = 1e10;

  for (int i = 0; i < ITERATIONS_CAP; i++) {
    if (i >= sceneIterations) break;

    z = clamp(z, -1.0, 1.0) * 2.0 - z;
    float r2 = dot(z, z);

    if (r2 < minRadiusSq) {
      float factor = fixedRadiusSq / minRadiusSq;
      z *= factor;
      dr *= factor;
    } else if (r2 < fixedRadiusSq) {
      float factor = fixedRadiusSq / max(r2, 1e-8);
      z *= factor;
      dr *= factor;
    }

    z = (z * safeScale) + p;
    dr = (dr * abs(safeScale)) + 1.0;

    float r = length(z);
    orbit = min(orbit, r);
    if (useOrbitTraps) {
      planeTrap = min(planeTrap, abs(z));
      originTrap = min(originTrap, r);
    }
    if (dot(z, z) > safeBailoutSq) break;
  }

  return length(z) / max(abs(dr), 1e-8);
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
  int bulbTrigThetaAxis = sanitizeTrigAxis(u_bulb_trig_theta_axis[bulbIndex]);
  int bulbTrigPhiAxisA = sanitizeTrigAxis(u_bulb_trig_phi_axis_a[bulbIndex]);
  int bulbTrigPhiAxisB = sanitizeTrigAxis(u_bulb_trig_phi_axis_b[bulbIndex]);
  float bulbTrigThetaOffset = clamp(u_bulb_trig_theta_offset[bulbIndex], -6.28318530718, 6.28318530718);
  float bulbTrigPhiOffset = clamp(u_bulb_trig_phi_offset[bulbIndex], -6.28318530718, 6.28318530718);
  float bulbTrigThetaRate = clamp(u_bulb_trig_theta_rate[bulbIndex], -8.0, 8.0);
  float bulbTrigPhiRate = clamp(u_bulb_trig_phi_rate[bulbIndex], -8.0, 8.0);
  int sceneFractalKind = sanitizeSceneFractalKind(u_scene_fractal_kind);
  float de = 0.0;
  if (sceneFractalKind == 1) {
    de = mandelbox(
      pLocal,
      bulbPower,
      bulbBailoutRadius,
      sceneIterations,
      useOrbitTraps,
      orbit,
      planeTrap,
      originTrap
    );
  } else {
    de = mandelbulb(
      pLocal,
      bulbPower,
      bulbBailoutRadius,
      bulbTrigMode,
      bulbTrigTermX,
      bulbTrigTermY,
      bulbTrigTermZ,
      bulbTrigThetaAxis,
      bulbTrigPhiAxisA,
      bulbTrigPhiAxisB,
      bulbTrigThetaOffset,
      bulbTrigPhiOffset,
      bulbTrigThetaRate,
      bulbTrigPhiRate,
      sceneIterations,
      useOrbitTraps,
      orbit,
      planeTrap,
      originTrap
    );
  }
  return de * bulbScale;
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
    float bulbScale = max(u_bulb_scale[i], 0.05);
    float broadPhaseRadius = bulbScale * clamp(
      (abs(u_bulb_bailout_radius[i]) * 1.75) + 0.5,
      2.0,
      BULB_BROAD_PHASE_MAX_RADIUS
    );
    float broadPhaseDistance = length(pWorld - u_bulb_position[i]) - broadPhaseRadius;
    if (bestDistance > 0.0 && broadPhaseDistance > (bestDistance + 0.001)) continue;

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
`,Us=yn,Ds=`#version 300 es
precision highp float;
out vec4 fragColor;
${yn.replace("precision highp float;","").replace(/gl_FragColor/g,"fragColor")}
`;/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */const gn={cyan:[0,.8,1],orange:[1,.4,0],purple:[.7,.2,1],lime:[.6,1,0]},D={speed:.04,lighting:1,zoom:2.2,yaw:33*(Math.PI/180),pitch:-17*(Math.PI/180),depth:0,wind:.25,colorMode:"cyan"},Da=64,Ma=[10,32,54],Ns=8,ks=128,et=e=>Math.max(0,Math.min(1,e)),Pt=new Map,It=new Map;let Lt=null;const Ua=e=>{let t=2166136261;for(let l=0;l<e.length;l+=1)t^=e.charCodeAt(l),t=Math.imul(t,16777619);const a=(t>>>16&255)/255,r=(t>>>8&255)/255,o=(t&255)/255;return[.2+a*.7,.2+r*.7,.2+o*.7]},Os=()=>{if(typeof document>"u")return null;const e=document.createElement("canvas");e.width=Da,e.height=1;const t=e.getContext("webgl",{alpha:!1,antialias:!1,depth:!1,stencil:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1});if(!t)return null;const a=t.createShader(t.VERTEX_SHADER);if(!a)return null;if(t.shaderSource(a,`
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `),t.compileShader(a),!t.getShaderParameter(a,t.COMPILE_STATUS))return t.deleteShader(a),null;const r=t.createBuffer();return r?(t.bindBuffer(t.ARRAY_BUFFER,r),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),t.STATIC_DRAW),{canvas:e,gl:t,quadBuffer:r,vertexShader:a}):(t.deleteShader(a),null)},vn=()=>(Lt&&!Lt.gl.isContextLost()||(Lt=Os()),Lt),Tn=(e,t)=>{const a=e.createShader(e.FRAGMENT_SHADER);return a?(e.shaderSource(a,`
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
    `),e.compileShader(a),e.getShaderParameter(a,e.COMPILE_STATUS)?a:(e.deleteShader(a),null)):null},$s=e=>{const t=[];let a=Number.POSITIVE_INFINITY,r=Number.NEGATIVE_INFINITY;for(let v=0;v<Da;v+=1){const T=v*4,m=e[T]/255,y=e[T+1]/255,x=e[T+2]/255;t.push([m,y,x]),a=Math.min(a,m,y,x),r=Math.max(r,m,y,x)}const o=r-a,l=Number.isFinite(o)&&o>1e-6?t.map(([v,T,m])=>[et((v-a)/o),et((T-a)/o),et((m-a)/o)]):t;let s=0,n=0,p=0;for(const v of Ma){const[T,m,y]=l[Math.min(v,l.length-1)];s+=T,n+=m,p+=y}s/=Ma.length,n/=Ma.length,p/=Ma.length;const h=.2126*s+.7152*n+.0722*p,b=1.15;return[et(h+(s-h)*b),et(h+(n-h)*b),et(h+(p-h)*b)]},Xs=(e,t,a)=>{var T,m,y;const r=`${t}:${e??""}`,o=Pt.get(r);if(o)return o;if(!e){(T=a==null?void 0:a.onFallback)==null||T.call(a,"no-formula");const x=Ua(t);return Pt.set(r,x),x}const l=vn();if(!l){(m=a==null?void 0:a.onFallback)==null||m.call(a,"context-unavailable");const x=Ua(t);return Pt.set(r,x),x}const{canvas:s,gl:n,quadBuffer:p,vertexShader:h}=l;let b=null,v=null;try{if((s.width!==Da||s.height!==1)&&(s.width=Da,s.height=1),b=Tn(n,e),!b)throw new Error("fragment shader compile failed");if(v=n.createProgram(),!v)throw new Error("program allocation failed");if(n.attachShader(v,h),n.attachShader(v,b),n.linkProgram(v),!n.getProgramParameter(v,n.LINK_STATUS))throw new Error(n.getProgramInfoLog(v)??"program link failed");n.viewport(0,0,s.width,s.height),n.disable(n.BLEND),n.disable(n.DEPTH_TEST),n.useProgram(v),n.bindBuffer(n.ARRAY_BUFFER,p);const x=n.getAttribLocation(v,"position");if(x<0)throw new Error("position attrib missing");n.enableVertexAttribArray(x),n.vertexAttribPointer(x,2,n.FLOAT,!1,0,0);const L=n.getUniformLocation(v,"u_sample_count");n.uniform1f(L,s.width),n.drawArrays(n.TRIANGLES,0,6);const P=new Uint8Array(s.width*4);n.readPixels(0,0,s.width,1,n.RGBA,n.UNSIGNED_BYTE,P);const R=$s(P);return Pt.size>256&&Pt.clear(),Pt.set(r,R),R}catch{(y=a==null?void 0:a.onFallback)==null||y.call(a,"sample-failed");const x=Ua(t);return Pt.set(r,x),x}finally{v&&n.deleteProgram(v),b&&n.deleteShader(b),n.isContextLost()&&(Lt=null)}},js=(e,t)=>{const a=Ua(e),r=new Float32Array(t*3),o=Math.max(1,t-1);for(let l=0;l<t;l+=1){const s=l/o;r[l*3+0]=et(a[0]*(.55+.75*s)+.08*(1-s)),r[l*3+1]=et(a[1]*(.65+.55*(1-s))+.05*s),r[l*3+2]=et(a[2]*(.5+.8*Math.sin(s*Math.PI))+.12*s)}return r},qs=(e,t,a,r)=>{const o=Math.max(Ns,Math.min(ks,Math.round(a))),l=`${t}:${e??""}:${o}`,s=It.get(l);if(s)return s;const n=x=>{var P;(P=r==null?void 0:r.onFallback)==null||P.call(r,x);const L=js(t,o);return It.size>192&&It.clear(),It.set(l,L),L};if(!e)return n("no-formula");const p=vn();if(!p)return n("context-unavailable");const{canvas:h,gl:b,quadBuffer:v,vertexShader:T}=p;let m=null,y=null;try{if((h.width!==o||h.height!==1)&&(h.width=o,h.height=1),m=Tn(b,e),!m)throw new Error("fragment shader compile failed");if(y=b.createProgram(),!y)throw new Error("program allocation failed");if(b.attachShader(y,T),b.attachShader(y,m),b.linkProgram(y),!b.getProgramParameter(y,b.LINK_STATUS))throw new Error(b.getProgramInfoLog(y)??"program link failed");b.viewport(0,0,h.width,h.height),b.disable(b.BLEND),b.disable(b.DEPTH_TEST),b.useProgram(y),b.bindBuffer(b.ARRAY_BUFFER,v);const x=b.getAttribLocation(y,"position");if(x<0)throw new Error("position attrib missing");b.enableVertexAttribArray(x),b.vertexAttribPointer(x,2,b.FLOAT,!1,0,0);const L=b.getUniformLocation(y,"u_sample_count");b.uniform1f(L,h.width),b.drawArrays(b.TRIANGLES,0,6);const P=new Uint8Array(h.width*4);b.readPixels(0,0,h.width,1,b.RGBA,b.UNSIGNED_BYTE,P);const R=new Float32Array(o*3);for(let E=0;E<o;E+=1){const V=E*4,O=E*3;R[O+0]=P[V]/255,R[O+1]=P[V+1]/255,R[O+2]=P[V+2]/255}return It.size>192&&It.clear(),It.set(l,R),R}catch{return n("sample-failed")}finally{y&&b.deleteProgram(y),m&&b.deleteShader(m),b.isContextLost()&&(Lt=null)}},Gs={name:"Mandelbox",category:"Volumetric",renderMode:"scene-raymarch",sceneConfig:{sceneId:"mandelbox",defaults:{zoom:2,yaw:D.yaw,pitch:D.pitch,depth:D.depth,speed:D.speed,lighting:D.lighting,wind:D.wind,color:gn[D.colorMode]}},formula:`
    x = z.x + c.x;
    y = z.y + c.y;
    z = vec2(x, y);
  `,initialCenter:{x:0,y:0},initialZoom:2,initialPalette:"Abyss",fixedIterations:192,metadata:{summary:"3D Mandelbox rendered through the volumetric scene raymarcher.",equationLabel:"DE(z) for Mandelbox box-fold + sphere-fold iteration",equationNotes:"Uses a bounded fold-based distance estimate in the scene shader pipeline.",expensive:!0,experimental:!0,supportsDoublePrecision:!1,supportsPerturbation:!1,supportsOrbitTrap:!1,infoPanel:{overview:"Mandelbox shares the same volumetric controls and camera workflow as Mandelbulb.",boundary:"Try lower iteration counts first, then increase Ray Steps for cleaner silhouettes.",deep:"Negative bulb power values can create aggressive inversions in the fold dynamics.",trivia:["Mandelbox combines box-fold and sphere-fold transforms before scaling/translation.","It often reveals rigid, architectural forms compared to Mandelbulb’s organic surfaces."]}}},Vs=Object.freeze(Object.defineProperty({__proto__:null,mandelbox:Gs},Symbol.toStringTag,{value:"Module"})),Ws={name:"Mandelbrot",category:"Standard",formula:`
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
for a different way of looking at this fractal.`,tone:"note",always:!1,conditions:{minIterations:250,maxIterations:1400}}]},poiHints:["Try the Seahorse Valley near -0.75 + 0.1i.","Try Elephant Valley around 0.28 + 0.01i.","Try the Needle near -1.25066 + 0.02012i.","Try Mini-brot Valley near -1.768778 + 0.001738i."]}},Hs=Object.freeze(Object.defineProperty({__proto__:null,mandelbrot:Ws},Symbol.toStringTag,{value:"Module"})),Zs={name:"Mandelbulb",category:"Volumetric",renderMode:"scene-raymarch",sceneConfig:{sceneId:"mandelbulb",defaults:{zoom:D.zoom,yaw:D.yaw,pitch:D.pitch,depth:D.depth,speed:D.speed,lighting:D.lighting,wind:D.wind,color:gn[D.colorMode]}},formula:`
    x = z.x + c.x;
    y = z.y + c.y;
    z = vec2(x, y);
  `,initialCenter:{x:0,y:0},initialZoom:D.zoom,initialPalette:"Abyss",fixedIterations:192,metadata:{summary:"3D Mandelbulb rendered via signed-distance raymarching.",equationLabel:"DE(z) for Mandelbulb power 8 (raymarched)",equationNotes:"Rendered in a scene pipeline instead of the 2D escape-time formula pipeline.",expensive:!0,experimental:!0,supportsDoublePrecision:!1,supportsPerturbation:!1,supportsOrbitTrap:!1,infoPanel:{overview:"Mandelbulb runs through the scene renderer with camera yaw/pitch + volumetric effects.",boundary:"Pan to rotate the camera. Mouse wheel changes camera focal zoom.",deep:"Detail level is controlled by scene raymarch parameters (currently fixed for stability).",trivia:["Mandelbulb is a 3D analog inspired by Mandelbrot-style iteration in spherical coordinates.","This implementation keeps escape-time and scene pipelines separate for future designer/export work."]}}},Ys=Object.freeze(Object.defineProperty({__proto__:null,mandelbulb:Zs},Symbol.toStringTag,{value:"Module"})),Ks={name:"Power Phi",category:"Power",formula:`
    float p = 1.61803398;
    float r = length(z);
    float theta = atan(z.y, z.x);
    float rp = pow(r, p);
    z = vec2(rp * cos(p * theta), rp * sin(p * theta)) + c;
  `,initialCenter:{x:0,y:0},initialZoom:3,metadata:{summary:"Irrational exponent phi creates non-integer rotational growth patterns.",equationLabel:"z(n+1) = z(n)^phi + c",equationNotes:"Polar exponentiation with an irrational power distorts periodic symmetry.",experimental:!0,infoPanel:{messages:[{id:"phi-core",text:"Power Phi can create off-axis spirals that drift compared with integer powers.",tone:"tip",always:!0}]}}},Js=Object.freeze(Object.defineProperty({__proto__:null,powerPhi:Ks},Symbol.toStringTag,{value:"Module"})),Qs={name:"Power Pi",category:"Power",formula:`
    float p = 3.14159265;
    float r = length(z);
    float theta = atan(z.y, z.x);
    float rp = pow(r, p);
    z = vec2(rp * cos(p * theta), rp * sin(p * theta)) + c;
  `,initialCenter:{x:0,y:0},initialZoom:3,metadata:{summary:"Pi-power mapping creates dense angular wrapping and high-frequency branching.",equationLabel:"z(n+1) = z(n)^pi + c",equationNotes:"Large non-integer exponent amplifies angular phase effects.",experimental:!0,infoPanel:{messages:[{id:"pi-core",text:"Power Pi tends to produce aggressive angular banding around major hubs.",tone:"tip",always:!0}]}}},el=Object.freeze(Object.defineProperty({__proto__:null,powerPi:Qs},Symbol.toStringTag,{value:"Module"})),tl={name:"Power Tau",category:"Power",formula:`
    float p = 6.28318530;
    float r = length(z);
    float theta = atan(z.y, z.x);
    float rp = pow(r, p);
    z = vec2(rp * cos(p * theta), rp * sin(p * theta)) + c;
  `,initialCenter:{x:0,y:0},initialZoom:3,metadata:{summary:"Tau-power mapping emphasizes full-turn phase effects and tight radial separation.",equationLabel:"z(n+1) = z(n)^tau + c",equationNotes:"Exponent near 2pi introduces very sharp angular sensitivity.",experimental:!0,infoPanel:{messages:[{id:"tau-core",text:"Power Tau can look sparse until a radial seam is crossed, then detail spikes.",tone:"tip",always:!0}]}}},al=Object.freeze(Object.defineProperty({__proto__:null,powerTau:tl},Symbol.toStringTag,{value:"Module"})),rl={name:"Quartic",category:"Power",formula:`
    float x2 = z.x * z.x;
    float y2 = z.y * z.y;
    x = (x2 * x2 - 6.0 * x2 * y2 + y2 * y2) + c.x;
    y = (4.0 * z.x * z.y * (x2 - y2)) + c.y;
    z = vec2(x, y);
  `,initialCenter:{x:0,y:0},initialZoom:3,metadata:{summary:"Fourth-order recurrence expands branch density with fourfold rotational influence.",equationLabel:"z(n+1) = z(n)^4 + c",equationNotes:"Quartic maps can fill quickly, so iteration control is especially important.",infoPanel:{messages:[{id:"quartic-core",text:"Quartic patterns often reveal four-armed structures around central basins.",tone:"tip",always:!0},{id:"quartic-iter",text:"If voids disappear too early, lower iterations to restore shape readability.",tone:"note",always:!1,conditions:{minIterations:700}}]}}},ol=Object.freeze(Object.defineProperty({__proto__:null,quartic:rl},Symbol.toStringTag,{value:"Module"})),nl={name:"Reciprocal Mandel-ish",category:"Transcendental",formula:`
    float z2r = z.x * z.x - z.y * z.y;
    float z2i = 2.0 * z.x * z.y;
    float denom = (z2r * z2r + z2i * z2i) + 1e-12;
    x = (z2r / denom) + c.x;
    y = (-z2i / denom) + c.y;
    z = vec2(x, y);
  `,initialCenter:{x:-1,y:0},initialZoom:2.5,initialPalette:0,metadata:{summary:"Reciprocal squaring inverts growth and creates unusual halo-like domains.",equationLabel:"z(n+1) = 1 / z(n)^2 + c",equationNotes:"Reciprocal transforms emphasize outer regions and singular neighborhoods.",experimental:!0,infoPanel:{messages:[{id:"recip-core",text:"Reciprocal maps reward slow panning near halos where inversion transitions occur.",tone:"tip",always:!0},{id:"recip-deep",text:"Deep reciprocal zooms may look simple until tiny inversion seams become visible.",tone:"highlight",always:!1,conditions:{minMagnification:4e5}}]}}},il=Object.freeze(Object.defineProperty({__proto__:null,reciprocalMandelIsh:nl},Symbol.toStringTag,{value:"Module"})),sl={name:"Tricorn",category:"Symmetry",formula:`
    x = (z.x * z.x - z.y * z.y) + c.x;
    y = (-2.0 * z.x * z.y) + c.y;
    z = vec2(x, y);
  `,initialCenter:{x:-.5,y:0},initialZoom:3,metadata:{summary:"Conjugation flips orientation and creates mirrored asymmetries.",equationLabel:"z(n+1) = conj(z(n))^2 + c",equationNotes:"The sign inversion on the imaginary term drives tricorn symmetry.",infoPanel:{messages:[{id:"t-core",text:"Tricorn highlights mirrored asymmetry; compare left/right lobes while zooming.",tone:"tip",always:!0},{id:"t-mid",text:'At medium magnification, branching motifs often fork into mirrored "antennae."',tone:"neutral",always:!1,conditions:{minMagnification:120,maxMagnification:8e4}},{id:"t-deep",text:"Deep tricorn regions can look sparse until you cross a branch seam.",tone:"highlight",always:!1,conditions:{minMagnification:1e6}},{id:"t-iter-window",text:"Try midrange iterations to keep mirrored branch silhouettes readable.",tone:"note",always:!1,conditions:{minIterations:250,maxIterations:1300}}]},poiHints:["Start near -0.5 + 0i, then pan to branch forks to find mirrored asymmetries.","Look around -0.1 + 0.75i for spiky mirrored motifs.","Explore near -0.3 - 0.5i for dense anti-holomorphic branches."]}},ll=Object.freeze(Object.defineProperty({__proto__:null,tricorn:sl},Symbol.toStringTag,{value:"Module"})),cl="Creatures",Mo="KNIFE_DESIGNER_DRAFT:",Kc={name:"Creature",seedStructure:"polynomial",juliaMode:!1,power:2,gain:1,twist:0,mirror:!1,sharpen:0,wobble:0,pulse:0},Jt=(e,t,a)=>Math.max(t,Math.min(a,e)),Na=e=>({name:(e.name||"Creature").trim()||"Creature",seedStructure:e.seedStructure,juliaMode:!!e.juliaMode,power:Math.round(Jt(e.power,2,6)),gain:Number(Jt(e.gain,.2,3).toFixed(2)),twist:Number(Jt(e.twist,0,1).toFixed(2)),mirror:!!e.mirror,sharpen:Number(Jt(e.sharpen,0,1).toFixed(2)),wobble:Number(Jt(e.wobble,0,1).toFixed(2)),pulse:Number(Jt(e.pulse,0,1).toFixed(2))}),ul=e=>{const t=e.indexOf(Mo);if(t<0)return null;const a=t+Mo.length,r=e.indexOf(`
`,a),o=e.slice(a,r>=0?r:void 0).trim();if(!o)return null;try{const l=JSON.parse(decodeURIComponent(o));return Na(l)}catch{return null}},Sn=e=>!e.juliaMode&&e.seedStructure==="polynomial"&&e.power===2&&Math.abs(e.gain-1)<1e-9&&e.twist===0&&!e.mirror&&e.sharpen===0&&e.wobble===0&&e.pulse===0,fl=e=>{const t=e.gain.toFixed(3),a=(e.twist*Math.PI).toFixed(6);if(e.seedStructure==="rational")return`
      float zx2 = z.x * z.x;
      float zy2 = z.y * z.y;
      float denom = 1.0 + (${t}) * (zx2 + zy2);
      float bx = (zx2 - zy2) / max(0.0001, denom);
      float by = (2.0 * z.x * z.y) / max(0.0001, denom);
      x = bx + c.x;
      y = by + c.y;
    `;if(e.seedStructure==="transcendental")return`
      float ex = exp(clamp(z.x * ${t}, -8.0, 8.0));
      float phase = z.y + ${a};
      x = ex * cos(phase) + c.x;
      y = ex * sin(phase) + c.y;
    `;if(e.seedStructure==="abs-folded")return`
      vec2 za = abs(z);
      float bx = (za.x * za.x - za.y * za.y) * ${t};
      float by = (2.0 * za.x * za.y) * ${t};
      x = bx + c.x;
      y = by + c.y;
    `;const r=["float px = z.x;","float py = z.y;"];for(let o=1;o<e.power;o+=1)r.push(`float tx${o} = (px * z.x) - (py * z.y);`),r.push(`float ty${o} = (px * z.y) + (py * z.x);`),r.push(`px = tx${o};`),r.push(`py = ty${o};`);return r.push(`x = (px * ${t}) + c.x;`),r.push(`y = (py * ${t}) + c.y;`),`
    ${r.join(`
    `)}
  `},ml=e=>{const t=[];if(e.twist>0){const a=(e.twist*Math.PI).toFixed(6);t.push(`
      float rot = ${a};
      float tx = (x * cos(rot)) - (y * sin(rot));
      float ty = (x * sin(rot)) + (y * cos(rot));
      x = tx;
      y = ty;
    `)}if(e.mirror&&t.push(`
      x = abs(x);
    `),e.sharpen>0){const a=(1+e.sharpen*.6).toFixed(3);t.push(`
      x = sign(x) * pow(abs(x), ${a});
      y = sign(y) * pow(abs(y), ${a});
    `)}if(e.wobble>0){const a=(e.wobble*.22).toFixed(3);t.push(`
      x += ${a} * sin((3.0 * z.y) + (2.0 * c.x));
      y += ${a} * cos((3.0 * z.x) + (2.0 * c.y));
    `)}if(e.pulse>0){const a=(e.pulse*.16).toFixed(3);t.push(`
      x += ${a} * sin(u_time + (4.0 * c.x));
      y += ${a} * cos((u_time * 0.7) + (4.0 * c.y));
    `)}return t.push(`
      z = vec2(x, y);
`),e.seedStructure==="abs-folded"&&t.push(`
      z = abs(z);
`),t.join(`
`)},Jc=e=>{const t=Na(e),a=`
    ${fl(t)}
    ${ml(t)}
  `;return{name:t.name,category:cl,formula:a,initialCenter:{x:-.5,y:0},initialZoom:2.8,initialPalette:"Cosmic",isJulia:t.juliaMode,metadata:{summary:"A user-designed creature compiled from the safe formula builder.",equationLabel:t.juliaMode?"Designer Julia Creature":"Designer Creature",equationNotes:t.juliaMode?"Generated from structured controls with fixed Julia seed mode.":"Generated from structured controls (no arbitrary shader text).",experimental:!0,supportsPerturbation:Sn(t),designerDraft:t,infoPanel:{messages:[{id:"designer-creature",text:"This fractal was generated in Design Mode.",tone:"highlight",always:!0}]}}}},Qc=e=>{const t=Na(e),a=t.seedStructure==="polynomial"?`(${t.gain.toFixed(2)}) * z^${t.power}`:t.seedStructure==="rational"?`(z^2)/(1 + ${t.gain.toFixed(2)}|z|^2)`:t.seedStructure==="transcendental"?`exp(${t.gain.toFixed(2)} * Re(z)) * e^{i(Im(z)+${(t.twist*Math.PI).toFixed(2)})}`:`${t.gain.toFixed(2)} * (|Re(z)| + i|Im(z)|)^2`,r=[];t.twist>0&&r.push(`rotate(${(t.twist*180).toFixed(0)}°)`),t.mirror&&r.push("mirror-x"),t.sharpen>0&&r.push(`sharpen(${t.sharpen.toFixed(2)})`),t.wobble>0&&r.push(`wobble(${t.wobble.toFixed(2)})`),t.pulse>0&&r.push(`pulse(${t.pulse.toFixed(2)})`);const o=r.length?` |> ${r.join(" |> ")}`:"",l=t.juliaMode?"c_fixed":"c";return`z(n+1) = (${a} + ${l})${o}`},eu=e=>{const t=Na(e),a=[{label:`seed:${t.seedStructure}`},{label:`mode:${t.juliaMode?"julia-fixed-c":"mandelbrot-pixel-c"}`},{label:`power:${t.power}`},{label:`gain:${t.gain.toFixed(2)}`}];return t.twist>0&&a.push({label:`twist:${t.twist.toFixed(2)}`}),t.mirror&&a.push({label:"mirror:true"}),t.sharpen>0&&a.push({label:`sharpen:${t.sharpen.toFixed(2)}`}),t.wobble>0&&a.push({label:`wobble:${t.wobble.toFixed(2)}`}),t.pulse>0&&a.push({label:`pulse:${t.pulse.toFixed(2)}`}),{label:"z(n+1)",children:[{label:"+",children:[{label:"transform(z)",children:a},{label:"c"}]}]}},dl=Object.assign({"../fractals/barnsley-1.ts":ls,"../fractals/buffalo.ts":us,"../fractals/burningShip.ts":ms,"../fractals/celtic.ts":bs,"../fractals/collatz-ish.ts":_s,"../fractals/cubic.ts":xs,"../fractals/dfFormulaGenerator.ts":Ss,"../fractals/exponential.ts":zs,"../fractals/feaather.ts":ws,"../fractals/inverse.ts":Rs,"../fractals/julia.ts":Is,"../fractals/lambda.ts":Ls,"../fractals/magnet-type1.ts":Bs,"../fractals/mandelbox.ts":Vs,"../fractals/mandelbrot.ts":Hs,"../fractals/mandelbulb.ts":Ys,"../fractals/powerPhi.ts":Js,"../fractals/powerPi.ts":el,"../fractals/powerTau.ts":al,"../fractals/quartic.ts":ol,"../fractals/reciprocal-mandel-ish.ts":il,"../fractals/tricorn.ts":ll}),bt={},bl=[],pl=new Set,hr=new Set;let En=0;const zn=e=>{if(typeof e!="object"||e===null)return!1;const t=e;return typeof t.name=="string"&&typeof t.category=="string"&&typeof t.formula=="string"},_l=e=>{const t=e.trim();return t.length>0?t:"Creature"},hl=e=>{let t=2,a=`${e} ${t}`;for(;bt[a];)t+=1,a=`${e} ${t}`;return a},An=(e,t)=>{if(e.df_formula)return e;const a=xn(e.formula);return a.dfFormula?{...e,df_formula:a.dfFormula}:(a.reason,e)},wn=(e,t)=>{const a=Fi(e);return a.forEach(r=>{console.warn(`[Fractal metadata] ${e.name} (${t}): ${r}`)}),a},xl=()=>{En+=1,hr.forEach(e=>e())},yl=e=>e.replace(/\/\/.*$/gm,"").replace(/\s+/g,"").trim()==="x=(z.x*z.x-z.y*z.y)+c.x;y=(2.0*z.x*z.y)+c.y;z=vec2(x,y);",gl=e=>{if(e.name==="Mandelbrot")return!0;const t=ul(e.formula);return t?Sn(t):yl(e.formula)};Object.entries(dl).sort(([e],[t])=>e.localeCompare(t)).forEach(([e,t])=>{var l,s,n;if(e.endsWith("index.ts"))return;const a=Object.values(t).find(zn);if(!a)return;if(bt[a.name]){console.warn(`Duplicate fractal name "${a.name}" in ${e}; keeping the first definition.`);return}const r=An(a),o=wn(r,e);bl.push({name:r.name,path:e,hasMetadata:!!r.metadata,messageCount:((n=(s=(l=r.metadata)==null?void 0:l.infoPanel)==null?void 0:s.messages)==null?void 0:n.length)??0,warnings:o}),bt[r.name]=r});const Ft=new Proxy(bt,{get(e,t){if(typeof t=="string"&&!isNaN(Number(t))){const a=Number(t),r=Object.keys(e);return e[r[a]]}return e[t]}}),tu=()=>Object.keys(bt),au=(e,t)=>{if(!zn(e))throw new Error("Invalid fractal definition. Expected name/category/formula fields.");const a=_l((t==null?void 0:t.preferredName)??e.name),r=!!(t!=null&&t.overwriteExisting);let o=a;bt[o]&&!r&&(o=hl(a));const s=e.category.trim().length>0?e.category:"Creatures",n=An({...e,name:o,category:s}),p={...n.metadata??{},supportsPerturbation:gl(n)},h={...n,metadata:p};return wn(h,"runtime"),bt[h.name]=h,pl.add(h.name),xl(),h},ru=e=>(hr.add(e),()=>{hr.delete(e)}),ou=()=>En,nu=()=>{const e={};return Object.values(bt).forEach(t=>{e[t.category]||(e[t.category]=[]),e[t.category].push(t.name)}),Object.entries(e).map(([t,a])=>({name:t,variants:a.map(r=>({name:r}))}))},iu="Mandelbrot",Ro=[[0,0],[.2,0],[-.2,0],[0,.2],[0,-.2],[.35,.35],[-.35,.35],[.35,-.35],[-.35,-.35],[.5,0],[-.5,0],[0,.5],[0,-.5]],or={key:"",length:0,stable:!1,refX:0,refY:0},Po=e=>{const t=Math.fround(e),a=e-t;return[t,a]},Io=(e,t,a)=>{const r=new Float32Array(a*4);let o=0,l=0;for(let s=0;s<a;s+=1){const n=o*o-l*l+e,p=2*o*l+t;o=n,l=p;const[h,b]=Po(o),[v,T]=Po(l);if(r[s*4]=h,r[s*4+1]=b,r[s*4+2]=v,r[s*4+3]=T,!Number.isFinite(o)||!Number.isFinite(l))return{data:r,length:s+1,stable:!1};if(o*o+l*l>16)return{data:r,length:s+1,stable:!1}}return{data:r,length:a,stable:!0}},vl=(e,t,a)=>{let r={refX:e.x,refY:e.y,orbit:Io(e.x,e.y,a)},o=r.orbit.stable?a+r.orbit.length:r.orbit.length;for(let l=1;l<Ro.length;l+=1){const[s,n]=Ro[l],p=e.x+s*t,h=e.y+n*t,b=Io(p,h,a),v=b.stable?a+b.length:b.length;v>o&&(r={refX:p,refY:h,orbit:b},o=v)}return r},Tl=({gl:e,orbitTexture:t,center:a,zoom:r,renderIterations:o,orbitCache:l})=>{const s=`${a.x}:${a.y}:${r}:${o}`;let n=l;if(l.key!==s){const h=vl(a,r,o),b=h.orbit;n={key:s,length:b.length,stable:b.stable,refX:h.refX,refY:h.refY},e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t),e.texImage2D(e.TEXTURE_2D,0,e.RGBA32F,Math.max(1,b.length),1,0,e.RGBA,e.FLOAT,b.data)}const p=n.length>=8;return{orbitCache:n,perturbationReady:p,refOffsetX:p?a.x-n.refX:0,refOffsetY:p?a.y-n.refY:0}},xr=`
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`,yr=`#version 300 es
  in vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`,Sl=({fractalNames:e,paletteNames:t,useWebGL2:a,forceDouble:r,allowPerturbation:o})=>{const l=e.map((m,y)=>{const x=Ft[m];return x?{index:y,formula:x.formula}:null}).filter(m=>m!==null).map((m,y)=>`${y===0?"if":"else if"} (u_fractal_type == ${m.index}) {
        ${m.formula}
      }`).join(`
`),s=e.map((m,y)=>{const x=Ft[m];return x!=null&&x.df_formula?{index:y,formula:x.df_formula}:null}).filter(m=>m!==null).map((m,y)=>`${y===0?"if":"else if"} (u_fractal_type == ${m.index}) {
        ${m.formula}
      }`).join(`
`),n=t.map((m,y)=>{const x=vr[m];return x?{index:y,formula:x.formula}:null}).filter(m=>m!==null).map((m,y)=>`${y===0?"if":"else if"} (u_palette_type == ${m.index}) {
        ${m.formula}
      }`).join(`
`),p=e.map((m,y)=>{const x=Ft[m];if(!x||x.escapeRadiusSquared===void 0)return null;const L=Number.isFinite(x.escapeRadiusSquared)?x.escapeRadiusSquared:16;return{index:y,value:L}}).filter(m=>m!==null).map((m,y)=>`${y===0?"if":"else if"} (u_fractal_type == ${m.index}) {
        bailout = ${m.value.toFixed(1)};
      }`).join(`
`),h=e.map((m,y)=>{const x=Ft[m];return x?x.isJulia?`
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
`),b=e.map((m,y)=>{const x=Ft[m];return x?x.isJulia?`
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
`);return`${a?`#version 300 es
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
  ${o?`
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

    ${o?`
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
    } else if (${r?"true":"false"}) {
    `:`
    if (${r?"true":"false"}) {
    `}
      vec2 posx = df_add(u_center_x, df_mul(u_zoom_val, vec2(uv.x, 0.0)));
      vec2 posy = df_add(u_center_y, df_mul(u_zoom_val, vec2(uv.y, 0.0)));
      vec2 zx = vec2(0.0);
      vec2 zy = vec2(0.0);
      vec2 cx = posx;
      vec2 cy = posy;

      ${b}

      for (int i = 0; i < 200000; i++) {
        if (float(i) >= max_i) break;

        ${s}
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

    ${a?"fragColor":"gl_FragColor"} = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
  }
`},Co=(e,t,a,r)=>{const o=e.createShader(t);if(!o){const l=t===e.VERTEX_SHADER?"vertex":"fragment";return r==null||r("warn",`WebGL could not allocate ${l} shader.`),null}if(e.shaderSource(o,a),e.compileShader(o),!e.getShaderParameter(o,e.COMPILE_STATUS)){const l=t===e.VERTEX_SHADER?"vertex":"fragment",s=e.getShaderInfoLog(o)??"Unknown shader compile failure.";return console.error("Shader compile error:",s),r==null||r("warn",`WebGL ${l} shader compile error: ${s}`),e.deleteShader(o),null}return o},El=({canvas:e,createFragmentSource:t,onDiagnostic:a})=>{const r={antialias:!0,preserveDrawingBuffer:!0},o=e.getContext("webgl2",r),l=o?null:e.getContext("webgl",r),s=o??l;if(!s)return a==null||a("warn","WebGL context acquisition failed."),null;const n=o?"webgl2":"webgl1",p=n==="webgl2",h=p?yr:xr,b=t(p),v=Co(s,s.VERTEX_SHADER,h,a),T=Co(s,s.FRAGMENT_SHADER,b,a);if(!v||!T)return v&&s.deleteShader(v),T&&s.deleteShader(T),null;const m=s.createProgram();if(!m)return a==null||a("warn","WebGL could not allocate program."),s.deleteShader(v),s.deleteShader(T),null;if(s.attachShader(m,v),s.attachShader(m,T),s.linkProgram(m),!s.getProgramParameter(m,s.LINK_STATUS)){const E=s.getProgramInfoLog(m)??"Unknown program link failure.";return console.error("Program link error:",E),a==null||a("warn",`WebGL program link error: ${E}`),s.deleteShader(v),s.deleteShader(T),s.deleteProgram(m),null}s.useProgram(m);const y=new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),x=s.createBuffer();if(!x)return a==null||a("warn","WebGL could not allocate fullscreen quad buffer."),s.deleteShader(v),s.deleteShader(T),s.deleteProgram(m),null;s.bindBuffer(s.ARRAY_BUFFER,x),s.bufferData(s.ARRAY_BUFFER,y,s.STATIC_DRAW);const L=s.getAttribLocation(m,"position");if(L<0)return a==null||a("warn","WebGL program is missing required `position` attribute."),s.deleteBuffer(x),s.deleteShader(v),s.deleteShader(T),s.deleteProgram(m),null;s.enableVertexAttribArray(L),s.vertexAttribPointer(L,2,s.FLOAT,!1,0,0);let P=null;if(p){const E=s;P=E.createTexture(),P&&(E.activeTexture(E.TEXTURE0),E.bindTexture(E.TEXTURE_2D,P),E.texParameteri(E.TEXTURE_2D,E.TEXTURE_MIN_FILTER,E.NEAREST),E.texParameteri(E.TEXTURE_2D,E.TEXTURE_MAG_FILTER,E.NEAREST),E.texParameteri(E.TEXTURE_2D,E.TEXTURE_WRAP_S,E.CLAMP_TO_EDGE),E.texParameteri(E.TEXTURE_2D,E.TEXTURE_WRAP_T,E.CLAMP_TO_EDGE))}return{backend:n,gl:s,program:m,orbitTexture:P,dispose:()=>{s.deleteBuffer(x),P&&(s.deleteTexture(P),P=null),s.deleteShader(v),s.deleteShader(T),s.deleteProgram(m)}}},zl=900,Al=.6,wl=.7,Ml=1400,Sr=5,Rl=4,Pl=2**-23,Il=2**-44,Cl=8,Ll=12,Fl=12,Bl=18,Ul=1.6,Dl=1.6,nr={conservative:{min:50,max:1e3,base:100,slope:30,gamma:.9},balanced:{min:100,max:2e3,base:140,slope:70}},Nl=(e,t)=>{const a=Math.max(1,t);return 2*Math.max(e,1e-30)/a},Lo=(e,t,a)=>Math.max(1,Math.abs(e),Math.abs(t))*a,kl={contextLostCount:0,contextRestoredCount:0,contextAcquireFailures:0,paletteFallbackCount:0},Ct=e=>{const t=Math.fround(e),a=e-t;return[t,a]},Ol=e=>!e||!Number.isFinite(e.min)||e.min<=0||!Number.isFinite(e.max)||e.max<=0||!Number.isFinite(e.base)||e.base<=0||!Number.isFinite(e.slope)||e.slope<0||e.min>e.max||e.gamma!==void 0&&(!Number.isFinite(e.gamma)||e.gamma<=0)?null:{min:e.min,max:e.max,base:e.base,slope:e.slope,gamma:e.gamma},$l=e=>!(!Number.isFinite(e.min)||e.min<=0||!Number.isFinite(e.max)||e.max<=0||!Number.isFinite(e.base)||e.base<=0||!Number.isFinite(e.slope)||e.slope<0||e.min>e.max||e.gamma!==void 0&&(!Number.isFinite(e.gamma)||e.gamma<=0)),Xl=e=>{if(!e)return null;const t={};if(e.min!==void 0){if(!Number.isFinite(e.min)||e.min<=0)return null;t.min=e.min}if(e.max!==void 0){if(!Number.isFinite(e.max)||e.max<=0)return null;t.max=e.max}if(e.base!==void 0){if(!Number.isFinite(e.base)||e.base<=0)return null;t.base=e.base}if(e.slope!==void 0){if(!Number.isFinite(e.slope)||e.slope<0)return null;t.slope=e.slope}if(e.gamma!==void 0){if(!Number.isFinite(e.gamma)||e.gamma<=0)return null;t.gamma=e.gamma}return t.min!==void 0&&t.max!==void 0&&t.min>t.max?null:t},jl=(e,t)=>{if(!t)return e;const a={...e,...t};return $l(a)?a:e},ql=(e,t)=>{const a=Math.max(0,Math.log2(1/Math.max(e,1e-30))),r=t.gamma??1,o=r===1?a:Math.pow(a,r),l=Math.floor(t.base+o*t.slope);return Math.min(t.max,Math.max(t.min,l))},Gl=(e,t)=>({resolution:e.getUniformLocation(t,"u_resolution"),center:e.getUniformLocation(t,"u_center"),zoom:e.getUniformLocation(t,"u_zoom"),maxIterations:e.getUniformLocation(t,"u_max_iterations"),paletteType:e.getUniformLocation(t,"u_palette_type"),fractalType:e.getUniformLocation(t,"u_fractal_type"),colorizerMode:e.getUniformLocation(t,"u_colorizer_mode"),colorSpace:e.getUniformLocation(t,"u_color_space"),transferFn:e.getUniformLocation(t,"u_transfer_fn"),lchChromaCoupling:e.getUniformLocation(t,"u_lch_chroma_coupling"),postEscapeSteps:e.getUniformLocation(t,"u_post_escape_steps"),orbitTrapShape:e.getUniformLocation(t,"u_orbit_trap_shape"),orbitTrapScale:e.getUniformLocation(t,"u_orbit_trap_scale"),finalZMix:e.getUniformLocation(t,"u_finalz_mix"),statScale:e.getUniformLocation(t,"u_stat_scale"),juliaC:e.getUniformLocation(t,"u_julia_c"),time:e.getUniformLocation(t,"u_time"),cyclePhase:e.getUniformLocation(t,"u_cycle_phase"),centerX:e.getUniformLocation(t,"u_center_x"),centerY:e.getUniformLocation(t,"u_center_y"),zoomVal:e.getUniformLocation(t,"u_zoom_val"),juliaCX:e.getUniformLocation(t,"u_julia_cx"),juliaCY:e.getUniformLocation(t,"u_julia_cy"),usePerturbation:e.getUniformLocation(t,"u_use_perturbation"),orbitTexture:e.getUniformLocation(t,"u_orbit_texture"),orbitLength:e.getUniformLocation(t,"u_orbit_length"),refOffsetX:e.getUniformLocation(t,"u_ref_offset_x"),refOffsetY:e.getUniformLocation(t,"u_ref_offset_y"),backgroundColor:e.getUniformLocation(t,"u_background_color"),backgroundIntensity:e.getUniformLocation(t,"u_background_intensity")}),Fo=(e,t,a)=>{const r=e.createShader(t);return r?(e.shaderSource(r,a),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.error("Shader compile error:",e.getShaderInfoLog(r)),e.deleteShader(r),null)):null},Bo=(e,t,a)=>{const r=Fo(e,e.VERTEX_SHADER,t),o=Fo(e,e.FRAGMENT_SHADER,a);if(!r||!o)return r&&e.deleteShader(r),o&&e.deleteShader(o),null;const l=e.createProgram();return l?(e.attachShader(l,r),e.attachShader(l,o),e.linkProgram(l),e.deleteShader(r),e.deleteShader(o),e.getProgramParameter(l,e.LINK_STATUS)?l:(console.error("Program link error:",e.getProgramInfoLog(l)),e.deleteProgram(l),null)):(e.deleteShader(r),e.deleteShader(o),null)},Vl=`
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

  const int MAX_RADIUS = ${Sr};
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
`,Wl=`
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
`,Hl=`#version 300 es
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

  const int MAX_RADIUS = ${Sr};
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
`,Zl=`#version 300 es
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
`,Uo=(e,t,a)=>{const r=e.getAttribLocation(t,"position");r<0||(e.bindBuffer(e.ARRAY_BUFFER,a),e.enableVertexAttribArray(r),e.vertexAttribPointer(r,2,e.FLOAT,!1,0,0))},Do=(e,t,a,r)=>{e.bindTexture(e.TEXTURE_2D,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,a,r,0,e.RGBA,e.UNSIGNED_BYTE,null)},su=({enabled:e,canvasRef:t,fractalNames:a,center:r,zoom:o,maxIterations:l,autoIterations:s,autoIterationProfile:n,overrideFractalIterationLock:p=!1,colorizerMode:h,colorSpaceMode:b,transferFunction:v,lchChromaCoupling:T,postEscapeSteps:m,orbitTrapShape:y,orbitTrapScale:x,finalZMix:L,statScale:P,paletteName:R,fractalName:E,juliaC:V,cycleSpeed:O,sceneBackgroundColor:H,sceneBackgroundIntensity:Y,resolutionScale:oe,isInteracting:j,isPreviewRender:pt,filterEnabled:at,filterStrength:rt,filterRadius:ot,filterPasses:Be,appendDebug:Te})=>{var na,ha,Xe,wt;const Se=d.useRef(null),Ue=d.useRef(null),nt=d.useRef(null),re=d.useRef(null),ne=d.useRef(null),fe=d.useRef({width:0,height:0}),Ee=d.useRef(()=>{}),_t=d.useRef({startTime:performance.now(),count:0,totalMs:0,lastMs:0}),De=d.useRef(null),Ne=d.useRef({...or}),ht=d.useRef(null),[ye,it]=d.useState("none"),[Qt,ea]=d.useState({rendersPerSecond:0,lastRenderMs:0,avgRenderMs:0}),[Dt,Nt]=d.useState(!1),[kt,xt]=d.useState(!1),yt=d.useRef(0),ze=d.useRef(0),ke=d.useRef(V),Ot=d.useMemo(()=>kl,[]),gt=d.useMemo(()=>a.indexOf(E),[a,E]),K=d.useCallback((_,c)=>{Te==null||Te(_,`[renderer] ${c}`)},[Te]),$t=d.useSyncExternalStore(ji,Eo,Eo),pe=d.useMemo(()=>Xi(),[$t]),Oe=d.useMemo(()=>pe.indexOf(R),[pe,R]);d.useEffect(()=>{if(Oe>=0){ht.current=null;return}const _=`Active palette "${R}" is not present in renderer palette list (count=${pe.length}).`;ht.current!==_&&(ht.current=_,K("warn",_))},[K,Oe,R,pe.length]);const $=Ft[E],vt=$==null?void 0:$.fixedIterations,da=Ol((na=$==null?void 0:$.metadata)==null?void 0:na.autoIterationCurve),Tt=n==="custom"?null:n,ba=Tt===null?null:Xl((Xe=(ha=$==null?void 0:$.metadata)==null?void 0:ha.autoIterationProfileOverrides)==null?void 0:Xe[Tt]),ta=Tt===null?null:jl(nr[Tt],ba),aa=n==="custom"?da??nr.balanced:ta??nr[n],Xt=s?ql(o,aa):l,Ae=vt!==void 0&&!p?Math.max(1,Math.floor(vt)):Xt,St=Math.max(0,Math.log10(1/Math.max(o,1e-18))),jt=O>0?Math.max(.18,1/(1+Math.max(0,St-3)*.42)):1,qt=O>0?Math.max(Ml,Math.floor(2600-Math.max(0,St-4)*160)):Ae,Gt=O>0?Math.max(wl,1-Math.max(0,St-4)*.04):1,st=O*jt,J=pt?Math.min(Ae,zl):Math.min(Ae,qt),Q=pt?Math.max(.5,oe*Al):Math.max(.5,oe*Gt),Et=d.useRef(Q),ra=typeof window<"u"?window.innerHeight:1080,zt=Nl(o,ra),lt=Lo(r.x,r.y,Pl),Vt=Lo(r.x,r.y,Il),ie=zt/Math.max(lt,1e-30),At=zt/Math.max(Vt,1e-30),we=!!($!=null&&$.df_formula),me=(E==="Mandelbrot"||!!((wt=$==null?void 0:$.metadata)!=null&&wt.supportsPerturbation))&&ye==="webgl2",de=me&&kt,$e=we&&Dt,ge=e&&at,pa=de?"PTB":$e?"DF64":"F32",Wt=de?o<1e-18:$e?At<Dl:ie<Ul;d.useEffect(()=>{if(!we){Nt(!1);return}Nt(_=>_?ie<Ll:ie<Cl)},[we,ie]),d.useEffect(()=>{if(!me){xt(!1);return}xt(_=>_?ie<Bl:ie<Fl)},[me,ie]),d.useEffect(()=>{ke.current=V},[V]),d.useEffect(()=>{Et.current=Q,e&&(!j||ge)&&Ee.current()},[e,Q,j,ge]);const se=d.useCallback(_=>{const c=ne.current;c&&(_.deleteFramebuffer(c.fbA),_.deleteFramebuffer(c.fbB),_.deleteTexture(c.texA),_.deleteTexture(c.texB),_.deleteProgram(c.genericProgram.program),_.deleteProgram(c.radius1Program.program),ne.current=null,fe.current={width:0,height:0})},[]),Z=d.useCallback((_,c,B)=>{const S=typeof WebGL2RenderingContext<"u"&&_ instanceof WebGL2RenderingContext;let U=ne.current;if(!U){const M=Bo(_,S?yr:xr,S?Hl:Vl),N=Bo(_,S?yr:xr,S?Zl:Wl);if(!M||!N)return M&&_.deleteProgram(M),N&&_.deleteProgram(N),null;const ee=_.createTexture(),_e=_.createTexture(),q=_.createFramebuffer(),Me=_.createFramebuffer();if(!ee||!_e||!q||!Me)return ee&&_.deleteTexture(ee),_e&&_.deleteTexture(_e),q&&_.deleteFramebuffer(q),Me&&_.deleteFramebuffer(Me),_.deleteProgram(M),_.deleteProgram(N),null;U={genericProgram:{program:M,uniforms:{resolution:_.getUniformLocation(M,"u_resolution"),sourceTexture:_.getUniformLocation(M,"u_source"),strength:_.getUniformLocation(M,"u_strength"),radius:_.getUniformLocation(M,"u_radius")}},radius1Program:{program:N,uniforms:{resolution:_.getUniformLocation(N,"u_resolution"),sourceTexture:_.getUniformLocation(N,"u_source"),strength:_.getUniformLocation(N,"u_strength"),radius:null}},texA:ee,texB:_e,fbA:q,fbB:Me},ne.current=U}const F=fe.current;if(F.width!==c||F.height!==B){Do(_,U.texA,c,B),Do(_,U.texB,c,B),_.bindFramebuffer(_.FRAMEBUFFER,U.fbA),_.framebufferTexture2D(_.FRAMEBUFFER,_.COLOR_ATTACHMENT0,_.TEXTURE_2D,U.texA,0);const M=_.checkFramebufferStatus(_.FRAMEBUFFER);_.bindFramebuffer(_.FRAMEBUFFER,U.fbB),_.framebufferTexture2D(_.FRAMEBUFFER,_.COLOR_ATTACHMENT0,_.TEXTURE_2D,U.texB,0);const N=_.checkFramebufferStatus(_.FRAMEBUFFER);if(_.bindFramebuffer(_.FRAMEBUFFER,null),M!==_.FRAMEBUFFER_COMPLETE||N!==_.FRAMEBUFFER_COMPLETE)return se(_),null;fe.current={width:c,height:B}}return U},[se]),be=d.useCallback(()=>{if(!e)return;const _=performance.now(),c=Se.current,B=Ue.current,S=nt.current,U=re.current;if(!(!c||!B||!S||!U))try{const F=ke.current,M=c.canvas,N=Math.max(1,Math.floor(window.innerWidth*Et.current)),ee=Math.max(1,Math.floor(window.innerHeight*Et.current));(M.width!==N||M.height!==ee)&&(M.width=N,M.height=ee);const _e=Mt=>{c.bindFramebuffer(c.FRAMEBUFFER,Mt),c.viewport(0,0,N,ee),c.useProgram(B),Uo(c,B,U),c.activeTexture(c.TEXTURE0),c.bindTexture(c.TEXTURE_2D,null),c.uniform2f(S.resolution,N,ee),c.uniform2f(S.center,r.x,r.y),c.uniform1f(S.zoom,o),c.uniform1i(S.maxIterations,J),c.uniform1i(S.paletteType,Oe),c.uniform1i(S.fractalType,gt);const i=h==="post-escape"?1:h==="orbit-trap"?2:h==="final-z"?3:h==="binary-decomposition"?4:h==="statistical"?5:h==="lyapunov"?6:0;c.uniform1i(S.colorizerMode,i);const A=b==="hsv"?1:b==="lch"?2:0;c.uniform1i(S.colorSpace,A),c.uniform1i(S.transferFn,v==="srgb"?1:0),c.uniform1i(S.lchChromaCoupling,T==="inverse"?1:0),c.uniform1f(S.postEscapeSteps,m),c.uniform1i(S.orbitTrapShape,y==="circle"?1:y==="box"?2:y==="gaussian-lattice"?3:0),c.uniform1f(S.orbitTrapScale,x),c.uniform1f(S.finalZMix,L),c.uniform1f(S.statScale,P),c.uniform2f(S.juliaC,F.x,F.y),c.uniform1f(S.time,yt.current),c.uniform1f(S.cyclePhase,ze.current),c.uniform2fv(S.centerX,Ct(r.x)),c.uniform2fv(S.centerY,Ct(r.y)),c.uniform2fv(S.zoomVal,Ct(o)),c.uniform2fv(S.juliaCX,Ct(F.x)),c.uniform2fv(S.juliaCY,Ct(F.y));let f=!1,G=0,I=0;if(me&&de&&De.current&&S.usePerturbation&&S.orbitTexture&&S.orbitLength&&ye==="webgl2"){const k=Tl({gl:c,orbitTexture:De.current,center:r,zoom:o,renderIterations:J,orbitCache:Ne.current});if(Ne.current=k.orbitCache,f=k.perturbationReady,G=k.refOffsetX,I=k.refOffsetY,f){const X=c;X.activeTexture(X.TEXTURE0),X.bindTexture(X.TEXTURE_2D,De.current),c.uniform1i(S.orbitTexture,0),c.uniform1i(S.orbitLength,Ne.current.length)}}S.refOffsetX&&c.uniform2fv(S.refOffsetX,Ct(G)),S.refOffsetY&&c.uniform2fv(S.refOffsetY,Ct(I)),S.usePerturbation&&c.uniform1i(S.usePerturbation,f?1:0),S.orbitLength&&!f&&c.uniform1i(S.orbitLength,0),S.backgroundColor&&c.uniform3f(S.backgroundColor,Math.max(0,Math.min(1,H.r)),Math.max(0,Math.min(1,H.g)),Math.max(0,Math.min(1,H.b))),S.backgroundIntensity&&c.uniform1f(S.backgroundIntensity,Math.max(0,Math.min(2.5,Y))),c.drawArrays(c.TRIANGLES,0,6)};if(!at){_e(null);return}const q=Z(c,N,ee);if(!q){_e(null);return}_e(q.fbA);const Me=Number.isFinite(rt)?rt:.7,xa=Number.isFinite(ot)?ot:1,ka=Number.isFinite(Be)?Be:1,ya=Math.max(0,Math.min(1,Me)),le=Math.max(1,Math.min(Sr,Math.floor(xa))),ia=Math.max(1,Math.min(Rl,Math.floor(ka)));let ce=q.texA,Re=q.texB,ct=q.fbB;const Pe=le===1?q.radius1Program:q.genericProgram,ga=c.getParameter(c.MAX_COMBINED_TEXTURE_IMAGE_UNITS)>1?1:0,Oa=c.TEXTURE0+ga;c.useProgram(Pe.program),Uo(c,Pe.program,U),c.uniform2f(Pe.uniforms.resolution,N,ee),c.uniform1f(Pe.uniforms.strength,ya),Pe.uniforms.radius&&c.uniform1i(Pe.uniforms.radius,le),c.uniform1i(Pe.uniforms.sourceTexture,ga);for(let Mt=0;Mt<ia;Mt+=1){const i=Mt===ia-1;if(c.bindFramebuffer(c.FRAMEBUFFER,i?null:ct),c.viewport(0,0,N,ee),c.activeTexture(Oa),c.bindTexture(c.TEXTURE_2D,ce),c.drawArrays(c.TRIANGLES,0,6),!i){const A=Re;Re=ce,ce=A,ct=ct===q.fbA?q.fbB:q.fbA}}c.activeTexture(c.TEXTURE0),c.bindFramebuffer(c.FRAMEBUFFER,null)}catch(F){const M=F instanceof Error?F.message:String(F);K("warn",`Render pass failed for fractal="${E}" palette="${R}": ${M}`)}finally{const F=performance.now()-_,M=_t.current;M.count+=1,M.totalMs+=F,M.lastMs=F}},[e,r,o,J,Oe,gt,h,b,v,T,m,y,x,L,P,H.r,H.g,H.b,Y,st,$e,me,de,ye,at,rt,ot,Be,Z,E,K,R]);d.useEffect(()=>{const _=window.setInterval(()=>{const c=performance.now(),B=_t.current,S=c-B.startTime;if(S<=0)return;const U=S/1e3,F={rendersPerSecond:B.count/U,lastRenderMs:B.lastMs,avgRenderMs:B.count>0?B.totalMs/B.count:0};B.startTime=c,B.count=0,B.totalMs=0,ea(F)},500);return()=>{window.clearInterval(_)}},[]),d.useEffect(()=>{Ee.current=be},[be]),d.useEffect(()=>{if(!e||O<=0)return;let _,c=performance.now();const B=S=>{const U=(S-c)/1e3;c=S,yt.current+=U,ze.current+=U*st;const F=Ft[E];if(F!=null&&F.isJulia){const M=ke.current;ke.current={x:M.x+Math.sin(S*5e-4)*1e-4,y:M.y+Math.cos(S*3e-4)*1e-4}}try{(!j||ge)&&Ee.current()}catch(M){console.error("Animation render error:",M);const N=M instanceof Error?M.message:String(M);K("warn",`Animation loop render error: ${N}`)}finally{_=requestAnimationFrame(B)}};return _=requestAnimationFrame(B),()=>cancelAnimationFrame(_)},[e,O,st,E,j,K,ge]);const oa=d.useCallback(_=>{e&&(!Number.isFinite(_)||_===0||(ze.current+=_,j||Ee.current()))},[e,j]),_a=d.useCallback(()=>{e&&ze.current!==0&&(ze.current=0,j||Ee.current())},[e,j]);return d.useEffect(()=>{if(!e){it("none");return}const _=t.current;if(!_)return;const c=El({canvas:_,createFragmentSource:F=>Sl({fractalNames:a,paletteNames:pe,useWebGL2:F,forceDouble:$e&&we,allowPerturbation:F}),onDiagnostic:(F,M)=>{K(F==="warn"?"warn":"info",M)}});if(!c){K("warn",`WebGL program init failed for fractal="${E}" palette="${R}". Renderer stayed offline; check diagnostics in debug console.`),it("none");return}K("state",`WebGL program initialized (${c.backend}) with ${a.length} fractals and ${pe.length} palettes.`),it(c.backend),Se.current=c.gl,Ue.current=c.program,nt.current=Gl(c.gl,c.program);const B=new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),S=c.gl.createBuffer();if(!S){K("warn","WebGL could not allocate renderer quad buffer after program init."),c.dispose(),it("none"),Se.current=null,Ue.current=null,nt.current=null;return}c.gl.bindBuffer(c.gl.ARRAY_BUFFER,S),c.gl.bufferData(c.gl.ARRAY_BUFFER,B,c.gl.STATIC_DRAW),re.current=S,Ne.current={...or},De.current=c.orbitTexture;const U=()=>{Ee.current()};return window.addEventListener("resize",U),U(),()=>{window.removeEventListener("resize",U),re.current&&(c.gl.deleteBuffer(re.current),re.current=null),se(c.gl),c.dispose(),De.current=null,Ne.current={...or},nt.current=null,Ue.current===c.program&&(Ue.current=null),Se.current===c.gl&&(Se.current=null)}},[e,t,a,pe,$e,we,se,E,K,R]),d.useEffect(()=>{e&&(!j||ge)&&be()},[e,be,j,ge]),{effectiveIterations:Ae,isAtPrecisionLimit:Wt,isDoubleActive:$e,precisionMode:pa,rendererBackend:ye,rendererDiagnostics:Ot,rendererStats:Qt,render:be,nudgeCyclePhase:oa,resetCyclePhase:_a}},Yl=.005,Kl=8,Jl=.25,Ql=6,ec=.6,tc=3.5,ac=-24,rc=-.45,No=-2.6,Ra=(e,t,a)=>Math.max(t,Math.min(a,e)),Mn=({zoom:e,sceneDepth:t,sceneInvertZoom:a,sceneFocalLength:r})=>{const o=Ra(e,Yl,Kl),l=Ra(r,Jl,Ql),s=a?No/o:No*o,n=Ra(s+t,ac,rc),p=Ra(1/Math.sqrt(o),ec,tc);return{rawZoom:o,sceneZoom:p,focalLength:l,depthFromZoom:s,finalDepth:n}},ko=.67,oc=52,nc=24,ic=.18,Rn=1.38,Pn=.04,ir=1.2,sr=8,sc=.08,lc=4,cc=2.399963229728653,Fe=(e,t,a)=>Math.max(t,Math.min(a,e)),lr=(e,t,a)=>e+(t-e)*a,uc=(e,t)=>{const a=Math.max(1,e),r=Math.max(1,t),o=Math.max(220,a-oc-nc*2),l=Fe(o*ko,180,o),s=Fe(r*ko,180,r);return{width:l,height:s,usableWidth:o}},fc=({viewportWidth:e,viewportHeight:t,zoom:a,sceneDepth:r,sceneInvertZoom:o,sceneFocalLength:l})=>{const s=uc(e,t),n=Mn({zoom:a,sceneDepth:r,sceneInvertZoom:o,sceneFocalLength:l}),p=n.sceneZoom,h=n.focalLength,b=n.finalDepth,T=Math.max(.45,Math.abs(b))/(Math.max(1,t)*p*h),m={x:Fe(s.width*T*.5,ir,sr),y:Fe(s.height*T*.5,ir,sr),z:Fe(s.width*T*.5,ir,sr)},y=Math.min(m.x,m.y,m.z),L=Fe(m.x*2*ic,.12,y*2*.88)*.5,P=Fe(L/Rn,sc,lc);return{viewport:s,halfExtents:m,targetBulbScale:P,targetBulbRadius:L}},Oo=(e,t,a)=>{const r=Math.max(0,a.x-t),o=Math.max(0,a.y-t),l=Math.max(0,a.z-t);return{x:Fe(e.x,-r,r),y:Fe(e.y,-o,o),z:Fe(e.z,-l,l)}},cr=(e,t,a)=>{let r=0;for(const o of a){const l=e.x-o.x,s=e.y-o.y,n=e.z-o.z,p=Math.hypot(l,s,n),h=t+o.radius+Pn;r+=Math.max(0,h-p)}return r},lu=(e,t,a=Pn)=>{const r=e.x-t.x,o=e.y-t.y,l=e.z-t.z,s=e.radius+t.radius+a;return r*r+o*o+l*l<s*s},cu=({preferredPosition:e,halfExtents:t,radius:a,existingSpheres:r,seed:o=0})=>{const l=Oo(e??{x:0,y:0,z:0},a,t),s=cr(l,a,r);if(s<=0)return l;const n=Math.max(0,t.x-a),p=Math.max(0,t.y-a),h=Math.max(0,t.z-a),b=Math.min(n,h),v=p>1e-4?[-.62*p,0,.62*p]:[0];let T=l,m=s;const y=44;for(let R=0;R<y;R+=1){const E=(R+1)/y,V=b*Math.sqrt(E);for(let O=0;O<v.length;O+=1){const H=R*cc+o*.77+O*.41,Y=Oo({x:Math.cos(H)*V,y:v[O],z:Math.sin(H)*V},a,t),oe=cr(Y,a,r);if(oe<=0)return Y;if(oe<m)m=oe,T=Y;else if(Math.abs(oe-m)<=1e-6){const j=Math.hypot(T.x,T.y,T.z);Math.hypot(Y.x,Y.y,Y.z)<j&&(T=Y)}}}if(m<=0)return T;const x=5,L=p>1e-4?3:1,P=5;for(let R=0;R<x;R+=1){const E=lr(-n,n,R/Math.max(1,x-1));for(let V=0;V<L;V+=1){const O=L===1?0:lr(-p,p,V/Math.max(1,L-1));for(let H=0;H<P;H+=1){const Y=lr(-h,h,H/Math.max(1,P-1)),oe={x:E,y:O,z:Y},j=cr(oe,a,r);j<m&&(m=j,T=oe)}}}return T},uu={mandelbulb:{id:"mandelbulb",label:"Mandelbulb",description:"Power-based spherical Mandelbulb distance estimator."},mandelbox:{id:"mandelbox",label:"Mandelbox",description:"Box-fold and sphere-fold Mandelbox distance estimator."}},mc="mandelbulb",dc=e=>e==="mandelbulb"||e==="mandelbox",bc=e=>{var a;const t=(a=e==null?void 0:e.sceneConfig)==null?void 0:a.sceneId;return dc(t)?t:mc},w=4,ur=32,fr=4,mr=128,$o=64,Xo=1024,pc=-16,_c=16,dr=.25,jo=1.25,qo=64,Pa=-6.28318530718,Ia=6.28318530718,Ca=-8,La=8,Er=5,hc=4,Go=2.8,dt=.32,Fa=4e-4,xc=84,yc=680,gc=.45,Vo=90,vc=180,Tc=24,Sc=220,Ec=1.75,zc=.5,Ac=2,wc=96,Mc=.001,Rc=()=>({contextLostCount:0,contextRestoredCount:0,contextAcquireFailures:0,paletteFallbackCount:0}),Wo=()=>({enabled:!1,qualityFactor:1,projectedDiameterPx:0,offCenterRatio:0,throttleMs:0,effectiveIterations:0,effectiveMaxSteps:0,effectiveRaySurfaceEpsilon:0,effectiveRayErrorTolerance:0,effectiveRayStepScale:0}),Ho=()=>({enabled:!1,activeBulbCount:0,probeSamples:0,estimatedCandidateTests:0,estimatedCulledTests:0,estimatedCullRatio:0,estimatedCulledPerSample:0,nearestBoundDistance:0}),g=(e,t,a)=>Math.max(t,Math.min(a,e)),Je=(e,t,a)=>Math.max(t,Math.min(a,Math.floor(e))),Qe=(e,t,a)=>e+(t-e)*a,Zo=(e,t,a)=>{if(e===t)return a<e?0:1;const r=g((a-e)/(t-e),0,1);return r*r*(3-2*r)},Yo=e=>{const t=g(e,pc,_c);return Math.abs(t)<dr?t<0?-dr:dr:t},Ko=(e,t)=>{const a=new Array(9).fill(0);for(let r=0;r<3;r+=1)for(let o=0;o<3;o+=1)a[r*3+o]=e[0+o]*t[r*3+0]+e[3+o]*t[r*3+1]+e[6+o]*t[r*3+2];return a},Jo=e=>[e[0],e[3],e[6],e[1],e[4],e[7],e[2],e[5],e[8]],Pc=[1,0,0,0,1,0,0,0,1],Qo=e=>e==="classic"?0:e==="orbit-unlit"?2:1,en=e=>e==="chrome"?1:e==="flame"?2:0,tn=e=>e==="hsv"?1:e==="lch"?2:0,an=e=>e==="srgb"?1:0,rn=e=>e==="inverse"?1:0,Ic=e=>e==="mandelbox"?1:0,on=(e,t)=>{if(!e||e.length<9)return t;const a=e.slice(0,9);return a.some(r=>!Number.isFinite(r))?t:a},Cc=(e,t)=>e?Array.isArray(e)?e.length<3||e.some(a=>!Number.isFinite(a))?t:[e[0],e[1],e[2]]:Number.isFinite(e.r)&&Number.isFinite(e.g)&&Number.isFinite(e.b)?[e.r,e.g,e.b]:t:t,Lc=e=>Math.hypot(e[0],e[1],e[2]),tt=e=>{const t=Lc(e);return t<1e-8?[0,0,0]:[e[0]/t,e[1]/t,e[2]/t]},Fc=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],nn=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],Bc=(e,t)=>[e[0]*t,e[1]*t,e[2]*t],Uc=(e,t)=>[e[0]-t[0],e[1]-t[1],e[2]-t[2]],sn=(e,t)=>{const a=tt(e),[r,o,l]=a,s=Math.cos(t),n=Math.sin(t),p=1-s;return[p*r*r+s,p*r*o+n*l,p*r*l-n*o,p*r*o-n*l,p*o*o+s,p*o*l+n*r,p*r*l+n*o,p*o*l-n*r,p*l*l+s]},br=e=>{const t=tt([e[0],e[1],e[2]]);let a=[e[3],e[4],e[5]];a=Uc(a,Bc(t,Fc(t,a))),a=tt(a);const r=tt(nn(t,a)),o=tt(nn(r,t));return[t[0],t[1],t[2],o[0],o[1],o[2],r[0],r[1],r[2]]},Bt=(e,t,a)=>{const r=Math.cos(a),o=Math.sin(a),l=r*e[1]-o*e[2],s=o*e[1]+r*e[2],n=Math.cos(t),p=Math.sin(t),h=n*e[0]-p*s,b=p*e[0]+n*s;return[h,l,b]},Ba=(e,t)=>{const a=Bt([1,0,0],e,t),r=Bt([0,1,0],e,t),o=Bt([0,0,1],e,t);return[a[0],a[1],a[2],r[0],r[1],r[2],o[0],o[1],o[2]]},Dc=`
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

  const int MAX_RADIUS = ${Er};
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
`,Nc=`
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
`,kc=`#version 300 es
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

  const int MAX_RADIUS = ${Er};
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
`,Oc=`#version 300 es
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
`,ln=(e,t,a)=>{const r=e.getAttribLocation(t,"position");r<0||(e.bindBuffer(e.ARRAY_BUFFER,a),e.enableVertexAttribArray(r),e.vertexAttribPointer(r,2,e.FLOAT,!1,0,0))},cn=(e,t,a,r)=>{e.bindTexture(e.TEXTURE_2D,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,a,r,0,e.RGBA,e.UNSIGNED_BYTE,null)},un=(e,t,a)=>{const r=e.createShader(t);return r?(e.shaderSource(r,a),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.error("Shader compile error:",e.getShaderInfoLog(r)),e.deleteShader(r),null)):null},pr=(e,t,a)=>{const r=un(e,e.VERTEX_SHADER,t),o=un(e,e.FRAGMENT_SHADER,a);if(!r||!o)return r&&e.deleteShader(r),o&&e.deleteShader(o),null;const l=e.createProgram();return l?(e.attachShader(l,r),e.attachShader(l,o),e.linkProgram(l),e.deleteShader(r),e.deleteShader(o),e.getProgramParameter(l,e.LINK_STATUS)?l:(console.error("Program link error:",e.getProgramInfoLog(l)),e.deleteProgram(l),null)):(e.deleteShader(r),e.deleteShader(o),null)},$c=(e,t)=>({sceneFractalKind:e.getUniformLocation(t,"u_scene_fractal_kind"),time:e.getUniformLocation(t,"u_time"),resolution:e.getUniformLocation(t,"u_resolution"),cameraRotation:e.getUniformLocation(t,"u_camera_rotation"),pan:e.getUniformLocation(t,"u_pan"),focalLength:e.getUniformLocation(t,"u_focal_length"),raySurfaceEpsilon:e.getUniformLocation(t,"u_ray_surface_epsilon"),rayErrorTolerance:e.getUniformLocation(t,"u_ray_error_tolerance"),rayStepScale:e.getUniformLocation(t,"u_ray_step_scale"),rayMaxDistance:e.getUniformLocation(t,"u_ray_max_distance"),cyclePhase:e.getUniformLocation(t,"u_cycle_phase"),lighting:e.getUniformLocation(t,"u_lighting"),lightPosition:e.getUniformLocation(t,"u_light_position"),lightColor:e.getUniformLocation(t,"u_light_color"),backgroundColor:e.getUniformLocation(t,"u_background_color"),backgroundIntensity:e.getUniformLocation(t,"u_background_intensity"),zoom:e.getUniformLocation(t,"u_zoom"),depth:e.getUniformLocation(t,"u_depth"),wind:e.getUniformLocation(t,"u_wind"),fogStrength:e.getUniformLocation(t,"u_fog_strength"),mistStrength:e.getUniformLocation(t,"u_mist_strength"),tankEnabled:e.getUniformLocation(t,"u_tank_enabled"),tankHalfExtents:e.getUniformLocation(t,"u_tank_half_extents"),tankRefractionStrength:e.getUniformLocation(t,"u_tank_refraction_strength"),tankHazeStrength:e.getUniformLocation(t,"u_tank_haze_strength"),tankShellStrength:e.getUniformLocation(t,"u_tank_shell_strength"),bulbCount:e.getUniformLocation(t,"u_bulb_count"),bulbRotationMatrix:e.getUniformLocation(t,"u_bulb_rotation_matrix[0]"),bulbInverseRotationMatrix:e.getUniformLocation(t,"u_bulb_inverse_rotation_matrix[0]"),bulbPosition:e.getUniformLocation(t,"u_bulb_position[0]"),bulbScale:e.getUniformLocation(t,"u_bulb_scale[0]"),bulbColorStyle:e.getUniformLocation(t,"u_bulb_color_style[0]"),bulbSurfaceShaderMode:e.getUniformLocation(t,"u_bulb_surface_shader_mode[0]"),bulbMaterialMode:e.getUniformLocation(t,"u_bulb_material_mode[0]"),bulbMaterialIntensity:e.getUniformLocation(t,"u_bulb_material_intensity[0]"),bulbOrbitTrapMix:e.getUniformLocation(t,"u_bulb_orbit_trap_mix[0]"),bulbOrbitTrapAoStrength:e.getUniformLocation(t,"u_bulb_orbit_trap_ao_strength[0]"),bulbColorVividness:e.getUniformLocation(t,"u_bulb_color_vividness[0]"),bulbColorBandDensity:e.getUniformLocation(t,"u_bulb_color_band_density[0]"),bulbColorWarmCoolBias:e.getUniformLocation(t,"u_bulb_color_warm_cool_bias[0]"),bulbColorSpace:e.getUniformLocation(t,"u_bulb_color_space[0]"),bulbTransferFn:e.getUniformLocation(t,"u_bulb_transfer_fn[0]"),bulbLchChromaCoupling:e.getUniformLocation(t,"u_bulb_lch_chroma_coupling[0]"),bulbColor:e.getUniformLocation(t,"u_bulb_color[0]"),bulbQualityHint:e.getUniformLocation(t,"u_bulb_quality_hint[0]"),bulbSceneIterations:e.getUniformLocation(t,"u_scene_iterations[0]"),bulbSceneMaxSteps:e.getUniformLocation(t,"u_scene_max_steps[0]"),bulbPower:e.getUniformLocation(t,"u_bulb_power[0]"),bulbBailoutRadius:e.getUniformLocation(t,"u_bulb_bailout_radius[0]"),bulbTrigMode:e.getUniformLocation(t,"u_bulb_trig_mode[0]"),bulbTrigTermX:e.getUniformLocation(t,"u_bulb_trig_term_x[0]"),bulbTrigTermY:e.getUniformLocation(t,"u_bulb_trig_term_y[0]"),bulbTrigTermZ:e.getUniformLocation(t,"u_bulb_trig_term_z[0]"),bulbTrigThetaAxis:e.getUniformLocation(t,"u_bulb_trig_theta_axis[0]"),bulbTrigPhiAxisA:e.getUniformLocation(t,"u_bulb_trig_phi_axis_a[0]"),bulbTrigPhiAxisB:e.getUniformLocation(t,"u_bulb_trig_phi_axis_b[0]"),bulbTrigThetaOffset:e.getUniformLocation(t,"u_bulb_trig_theta_offset[0]"),bulbTrigPhiOffset:e.getUniformLocation(t,"u_bulb_trig_phi_offset[0]"),bulbTrigThetaRate:e.getUniformLocation(t,"u_bulb_trig_theta_rate[0]"),bulbTrigPhiRate:e.getUniformLocation(t,"u_bulb_trig_phi_rate[0]"),paletteSampleCount:e.getUniformLocation(t,"u_palette_sample_count"),paletteSamples:e.getUniformLocation(t,"u_palette_samples[0]")}),Xc=e=>{const t=[{alpha:!1,antialias:!1,depth:!1,stencil:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"},{alpha:!1,antialias:!0,depth:!1,stencil:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"},{antialias:!0,preserveDrawingBuffer:!0}];for(const o of t){const l=e.getContext("webgl2",o);if(l)return{backend:"webgl2",gl:l};const s=e.getContext("webgl",o);if(s)return{backend:"webgl1",gl:s}}const a=e.getContext("webgl2");if(a)return{backend:"webgl2",gl:a};const r=e.getContext("webgl");return r?{backend:"webgl1",gl:r}:{backend:"none",gl:null}},fu=({enabled:e,canvasRef:t,fractalDefinition:a,paletteName:r,center:o,sceneOrbitInput:l,scenePanInput:s,sceneObjectPanDeltaRef:n,zoom:p,cycleSpeed:h,resolutionScale:b,isInteracting:v,sceneNavigationMode:T,sceneColorMode:m,sceneSurfaceShaderMode:y,sceneMaterialMode:x,sceneMaterialIntensity:L,sceneOrbitTrapMix:P,sceneOrbitTrapAoStrength:R,sceneFocalLength:E,sceneRaySurfaceEpsilon:V,sceneRayErrorTolerance:O,sceneRayStepScale:H,sceneRayMaxDistance:Y,sceneColorVividness:oe,sceneColorBandDensity:j,sceneColorWarmCoolBias:pt,colorSpaceMode:at,transferFunction:rt,lchChromaCoupling:ot,sceneInvertPanX:Be,sceneInvertPanY:Te,sceneInvertZoom:Se,sceneRotationSpeed:Ue,sceneLighting:nt,sceneLightPosition:re,sceneLightColor:ne,sceneBackgroundColor:fe,sceneBackgroundIntensity:Ee,sceneDepth:_t,sceneWind:De,sceneFogStrength:Ne,sceneMistStrength:ht,sceneTankEnabled:ye,sceneTankRefractionStrength:it,sceneTankHazeStrength:Qt,sceneTankShellStrength:ea,sceneIterations:Dt,sceneMaxSteps:Nt,sceneBulbPower:kt,sceneBulbBailoutRadius:xt,sceneBulbTrigMode:yt,sceneBulbTrigTermX:ze,sceneBulbTrigTermY:ke,sceneBulbTrigTermZ:Ot,sceneBulbTrigThetaAxis:gt,sceneBulbTrigPhiAxisA:K,sceneBulbTrigPhiAxisB:$t,sceneBulbTrigThetaOffset:pe,sceneBulbTrigPhiOffset:Oe,sceneBulbTrigThetaRate:$,sceneBulbTrigPhiRate:vt,sceneAdaptiveQualityEnabled:da,sceneAdaptiveQualityStrength:Tt,sceneAdaptiveThrottle:ba,sceneRenderScale:ta,sceneFreezeMotion:aa,scenePrimaryRotationMatrix:Xt,sceneBulbs:Ae,filterEnabled:St,filterStrength:jt,filterRadius:qt,filterPasses:Gt,appendDebug:st})=>{const J=(l==null?void 0:l.x)??o.x,Q=(l==null?void 0:l.y)??o.y,Et=(s==null?void 0:s.x)??o.x,ra=(s==null?void 0:s.y)??o.y,zt=d.useRef(null),lt=d.useRef(null),Vt=d.useRef(null),ie=d.useRef(null),At=d.useRef(null),we=d.useRef({width:0,height:0}),me=d.useRef(()=>{}),de=d.useRef(null),$e=d.useRef(0),ge=d.useRef(0),pa=d.useRef(null),Wt=d.useRef(0),se=d.useRef(Ba(D.yaw,D.pitch)),Z=d.useRef({yaw:0,pitch:0}),be=d.useRef({x:0,y:0}),oa=d.useRef("scene"),_a=d.useRef([0,.8,1]),na=d.useRef(new Float32Array(ur*3)),[ha,Xe]=d.useState("none"),wt=d.useRef(Rc()),[_,c]=d.useState(wt.current),[B,S]=d.useState(0),[U,F]=d.useState({rendersPerSecond:0,lastRenderMs:0,avgRenderMs:0}),M=d.useRef({startTime:performance.now(),count:0,totalMs:0,lastMs:0}),N=d.useRef(1),ee=d.useRef(0),_e=d.useRef(0),q=d.useRef(0),[Me,xa]=d.useState(Wo()),[ka,ya]=d.useState(Ho()),le=d.useMemo(()=>{var i;return(i=a==null?void 0:a.sceneConfig)!=null&&i.defaults?a.sceneConfig.defaults:{zoom:D.zoom,yaw:D.yaw,pitch:D.pitch,depth:D.depth,speed:D.speed,lighting:D.lighting,wind:D.wind,color:[0,.8,1]}},[a]),ia=d.useMemo(()=>bc(a),[a]),ce=d.useCallback((i,A)=>{st==null||st(i,`[renderer] ${A}`)},[st]),Re=d.useCallback(i=>{const A={...wt.current,[i]:wt.current[i]+1};return wt.current=A,c(A),A[i]},[]);d.useEffect(()=>{if(!e)return;const i=vr[r];_a.current=Xs(i==null?void 0:i.formula,r,{onFallback:A=>{const f=Re("paletteFallbackCount");ce("warn",`Palette theme fallback (${A}) for "${r}" [count=${f}]`)}}),na.current=qs(i==null?void 0:i.formula,r,ur,{onFallback:A=>{const f=Re("paletteFallbackCount");ce("warn",`Palette LUT fallback (${A}) for "${r}" [count=${f}]`)}})},[Re,e,ce,r]),d.useEffect(()=>{se.current=Ba(le.yaw,le.pitch),Z.current={yaw:0,pitch:0},be.current={x:J,y:Q},oa.current=T},[J,Q,le.pitch,le.yaw,T]),d.useEffect(()=>{!Xt||Xt.length<9||(se.current=br(on(Xt,se.current)),Z.current={yaw:0,pitch:0},be.current={x:J,y:Q})},[J,Q,Xt]);const ct=d.useCallback(i=>{const A=At.current;A&&(i.deleteFramebuffer(A.fbA),i.deleteFramebuffer(A.fbB),i.deleteTexture(A.texA),i.deleteTexture(A.texB),i.deleteProgram(A.genericProgram.program),i.deleteProgram(A.radius1Program.program),At.current=null,we.current={width:0,height:0})},[]),Pe=d.useCallback((i,A,f)=>{const G=typeof WebGL2RenderingContext<"u"&&i instanceof WebGL2RenderingContext;let I=At.current;if(!I){const X=pr(i,G?rr:ar,G?kc:Dc),W=pr(i,G?rr:ar,G?Oc:Nc);if(!X||!W)return X&&i.deleteProgram(X),W&&i.deleteProgram(W),null;const te=i.createTexture(),je=i.createTexture(),qe=i.createFramebuffer(),he=i.createFramebuffer();if(!te||!je||!qe||!he)return te&&i.deleteTexture(te),je&&i.deleteTexture(je),qe&&i.deleteFramebuffer(qe),he&&i.deleteFramebuffer(he),i.deleteProgram(X),i.deleteProgram(W),null;I={genericProgram:{program:X,uniforms:{resolution:i.getUniformLocation(X,"u_resolution"),sourceTexture:i.getUniformLocation(X,"u_source"),strength:i.getUniformLocation(X,"u_strength"),radius:i.getUniformLocation(X,"u_radius")}},radius1Program:{program:W,uniforms:{resolution:i.getUniformLocation(W,"u_resolution"),sourceTexture:i.getUniformLocation(W,"u_source"),strength:i.getUniformLocation(W,"u_strength"),radius:null}},texA:te,texB:je,fbA:qe,fbB:he},At.current=I}const k=we.current;if(k.width!==A||k.height!==f){cn(i,I.texA,A,f),cn(i,I.texB,A,f),i.bindFramebuffer(i.FRAMEBUFFER,I.fbA),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,I.texA,0);const X=i.checkFramebufferStatus(i.FRAMEBUFFER);i.bindFramebuffer(i.FRAMEBUFFER,I.fbB),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,I.texB,0);const W=i.checkFramebufferStatus(i.FRAMEBUFFER);if(i.bindFramebuffer(i.FRAMEBUFFER,null),X!==i.FRAMEBUFFER_COMPLETE||W!==i.FRAMEBUFFER_COMPLETE)return ct(i),null;we.current={width:A,height:f}}return I},[ct]),sa=d.useCallback(()=>{if(!e)return;const i=zt.current,A=lt.current,f=Vt.current,G=ie.current;if(!i||!A||!f||!G)return;const I=performance.now(),k=performance.now(),X=pa.current??k,W=Math.max(0,(k-X)/1e3);pa.current=k;const te=aa?0:W;$e.current+=W;const je=g(h,0,2.5);ge.current+=W*je;const qe=g(Ue,0,.5);Wt.current+=te*qe*.08;const he=i.canvas,ut=Math.min(1,Math.max(.2,b*ta)),ue=Math.max(1,Math.floor(window.innerWidth*ut)),xe=Math.max(1,Math.floor(window.innerHeight*ut));(he.width!==ue||he.height!==xe)&&(he.width=ue,he.height=xe);const In=T==="object",va=-1,Ta=1,zr=Be?-va:va,Ar=Te?-va:va,Cn=Be?-Ta:Ta,Ln=Te?-Ta:Ta;let la=le.yaw+Wt.current+J*zr*1.5,ca=g(le.pitch+Q*Ar*1.5,-Math.PI/2,Math.PI/2),Ht=se.current,Sa=0,Ea=0;const wr=oa.current;if(wr!==T){if(T==="object"){const u=le.yaw+Wt.current+J*zr*1.5,z=g(le.pitch+Q*Ar*1.5,-Math.PI/2,Math.PI/2);wr==="camera"?se.current=Ba(u-Wt.current,z):se.current=Ba(le.yaw,le.pitch),Ht=se.current,Z.current={yaw:0,pitch:0},be.current={x:J,y:Q},n!=null&&n.current&&(n.current.x=0,n.current.y=0)}else Z.current={yaw:0,pitch:0},be.current={x:J,y:Q},n!=null&&n.current&&(n.current.x=0,n.current.y=0);oa.current=T}if(In){const u=tt(Bt([1,0,0],la,ca)),z=tt(Bt([0,1,0],la,ca)),Ie=(ae,mt)=>{const Rt=sn(z,ae),Ye=sn(u,mt);Ht=br(Ko(Ye,Ko(Rt,Ht))),se.current=Ht};let Ve=0,Ce=0;n!=null&&n.current?(Ve=g(n.current.x,-dt,dt),Ce=g(n.current.y,-dt,dt),n.current.x=0,n.current.y=0):(Ve=g(J-be.current.x,-dt,dt),Ce=g(Q-be.current.y,-dt,dt)),be.current={x:J,y:Q};const We=Be?-1:1,He=Te?1:-1,Ze=Ve*We*Go,Le=Ce*He*Go;if(Math.abs(Ze)>Fa||Math.abs(Le)>Fa)Ie(Ze,Le),te>1e-5&&(Z.current={yaw:Ze/te,pitch:Le/te});else if(!v&&te>0){Ie(Z.current.yaw*te,Z.current.pitch*te);const ae=Math.exp(-4.2*te);Z.current={yaw:Z.current.yaw*ae,pitch:Z.current.pitch*ae},Math.abs(Z.current.yaw)<Fa&&(Z.current.yaw=0),Math.abs(Z.current.pitch)<Fa&&(Z.current.pitch=0)}}T==="scene"&&(Sa=Et*Cn*.55,Ea=ra*Ln*.55);const $a=Mn({zoom:p,sceneDepth:_t,sceneInvertZoom:Se,sceneFocalLength:E}),Xa=$a.finalDepth,ja=$a.focalLength,qa=$a.sceneZoom,Fn=Je(Dt,fr,mr),Bn=Je(Nt,$o,Xo),za=g(V,1e-5,.01),Aa=g(O,.03,2),Ga=g(H,.2,1.8),Va=g(Y,2,120),Wa=fc({viewportWidth:window.innerWidth,viewportHeight:window.innerHeight,zoom:p,sceneDepth:_t,sceneInvertZoom:Se,sceneFocalLength:E}),Ha=Wa.halfExtents,Un=ye?Wa.targetBulbScale:1,Dn=ye?Wa.targetBulbRadius:Rn,ve=da,Nn=g(Tt,0,1),kn=Math.hypot(Sa,Ea)*xe,On=Math.max(1,.5*Math.min(ue,xe)),Mr=kn/On,$n=Math.max(gc,Math.abs(Xa)),Rr=qa*ja*Dn*xe/$n*2,Xn=Zo(xc,yc,Rr),Pr=Zo(.38,1.12,Mr),jn=g(Xn*(1-.42*Pr),0,1),Ir=ve?Qe(1,jn,Nn):1,Cr=N.current,qn=Ir>Cr?.26:.14,Lr=ve?Qe(Cr,Ir,qn):1;N.current=Lr;const Gn=g(Math.max(za*3.2,za+45e-5),1e-5,.01),Vn=g(Math.max(Aa*1.9,Aa+.18),.03,2),Wn=g(Math.min(1.8,Ga*1.35+.08),.2,1.8),Hn=g(Math.max(2,Va*.65),2,120),Ge=ve?Lr:1,Za=Je(Math.round(Qe(4,Fn,Ge)),4,32),Ya=Je(Math.round(Qe(64,Bn,Ge)),64,320),Fr=ve?Qe(Gn,za,Ge):za,Br=ve?Qe(Vn,Aa,Ge):Aa,Ur=ve?Qe(Wn,Ga,Ge):Ga,Dr=ve?Qe(Hn,Va,Ge):Va,Zn=ve?(1-Ge)*Qe(.7,1,Pr):0,Ka=ve&&ba&&!v?Math.round(g(Vo*Zn,0,Vo)):0,Yn={enabled:ve,qualityFactor:Ge,projectedDiameterPx:Rr,offCenterRatio:Mr,throttleMs:Ka,effectiveIterations:Za,effectiveMaxSteps:Ya,effectiveRaySurfaceEpsilon:Fr,effectiveRayErrorTolerance:Br,effectiveRayStepScale:Ur};if(k-_e.current>=vc&&(_e.current=k,xa(Yn)),Ka>0&&k-ee.current<Ka)return;const Ja=_a.current,Kn=[Ja[0],Ja[1],Ja[2]],Nr={position:[0,0,0],scale:1,rotationMatrix:Ht,inverseRotationMatrix:Jo(Ht),colorStyle:0,surfaceShaderMode:Qo(y),materialMode:en(x),materialIntensity:g(L,0,2.5),orbitTrapMix:g(P,0,1.5),orbitTrapAoStrength:g(R,0,2.5),colorVividness:.9,colorBandDensity:1,colorWarmCoolBias:.5,colorSpace:tn(at),transferFn:an(rt),lchChromaCoupling:rn(ot),color:[0,0,0],qualityHint:1,sceneIterations:Za,sceneMaxSteps:Ya,bulbPower:Yo(kt),bulbBailoutRadius:g(Math.abs(xt),jo,qo),bulbTrigMode:Ao(yt),bulbTrigTermX:Yt(ze),bulbTrigTermY:Yt(ke),bulbTrigTermZ:Yt(Ot),bulbTrigThetaAxis:Kt(gt),bulbTrigPhiAxisA:Kt(K),bulbTrigPhiAxisB:Kt($t),bulbTrigThetaOffset:g(pe,Pa,Ia),bulbTrigPhiOffset:g(Oe,Pa,Ia),bulbTrigThetaRate:g($,Ca,La),bulbTrigPhiRate:g(vt,Ca,La)},ua=[];if(Ae&&Ae.length>0)for(const u of Ae){if(ua.length>=w)break;const z=br(on(u.rotationMatrix,Pc)),Ie=Jo(z),Ve=u.position?[g(u.position.x,-64,64),g(u.position.y,-64,64),g(u.position.z,-64,64)]:[0,0,0];ua.push({position:Ve,scale:ye&&u.inTank!==!1?Un:g(u.scale??1,.05,8),rotationMatrix:z,inverseRotationMatrix:Ie,colorStyle:(u.colorStyle??m)==="vivid"?1:0,surfaceShaderMode:Qo(u.surfaceShaderMode??y),materialMode:en(u.materialMode??x),materialIntensity:g(u.materialIntensity??L,0,2.5),orbitTrapMix:g(u.orbitTrapMix??P,0,1.5),orbitTrapAoStrength:g(u.orbitTrapAoStrength??R,0,2.5),colorVividness:g(u.colorVividness??oe,0,2.25),colorBandDensity:g(u.colorBandDensity??j,.5,2.5),colorWarmCoolBias:g(u.colorWarmCoolBias??pt,0,1),colorSpace:tn(u.colorSpaceMode??at),transferFn:an(u.transferFunction??rt),lchChromaCoupling:rn(u.lchChromaCoupling??ot),color:Cc(u.color,Kn),qualityHint:g(u.qualityHint??(ve?Ge:1),0,1),sceneIterations:Je(u.sceneIterations??Za,fr,mr),sceneMaxSteps:Je(u.sceneMaxSteps??Ya,$o,Xo),bulbPower:Yo(u.bulbPower??kt),bulbBailoutRadius:g(Math.abs(u.bulbBailoutRadius??xt),jo,qo),bulbTrigMode:Ao(u.bulbTrigMode??yt??_n),bulbTrigTermX:Yt(u.bulbTrigTermX??ze??qi),bulbTrigTermY:Yt(u.bulbTrigTermY??ke??Gi),bulbTrigTermZ:Yt(u.bulbTrigTermZ??Ot??Vi),bulbTrigThetaAxis:Kt(u.bulbTrigThetaAxis??gt??Hi),bulbTrigPhiAxisA:Kt(u.bulbTrigPhiAxisA??K??Zi),bulbTrigPhiAxisB:Kt(u.bulbTrigPhiAxisB??$t??Yi),bulbTrigThetaOffset:g(u.bulbTrigThetaOffset??pe??Ji,Pa,Ia),bulbTrigPhiOffset:g(u.bulbTrigPhiOffset??Oe??Qi,Pa,Ia),bulbTrigThetaRate:g(u.bulbTrigThetaRate??$??es,Ca,La),bulbTrigPhiRate:g(u.bulbTrigPhiRate??vt??ts,Ca,La)})}const Zt=Math.max(0,Math.min(w,ua.length)),kr=new Float32Array(w*9),Or=new Float32Array(w*9),$r=new Float32Array(w*3),Xr=new Float32Array(w),jr=new Float32Array(w),qr=new Int32Array(w),Gr=new Int32Array(w),Vr=new Float32Array(w),Wr=new Float32Array(w),Hr=new Float32Array(w),Zr=new Float32Array(w),Yr=new Float32Array(w),Kr=new Float32Array(w),Jr=new Int32Array(w),Qr=new Int32Array(w),eo=new Int32Array(w),to=new Float32Array(w*3),ao=new Float32Array(w),ro=new Int32Array(w),oo=new Int32Array(w),no=new Float32Array(w),io=new Float32Array(w),so=new Int32Array(w),lo=new Int32Array(w),co=new Int32Array(w),uo=new Int32Array(w),fo=new Int32Array(w),mo=new Int32Array(w),bo=new Int32Array(w),po=new Float32Array(w),_o=new Float32Array(w),ho=new Float32Array(w),xo=new Float32Array(w);for(let u=0;u<w;u+=1){const z=ua[u]??Nr;kr.set(z.rotationMatrix,u*9),Or.set(z.inverseRotationMatrix,u*9),$r.set(z.position,u*3),Xr[u]=g(z.scale,.05,8),jr[u]=z.colorStyle,qr[u]=z.surfaceShaderMode,Gr[u]=z.materialMode,Vr[u]=z.materialIntensity,Wr[u]=z.orbitTrapMix,Hr[u]=z.orbitTrapAoStrength,Zr[u]=z.colorVividness,Yr[u]=z.colorBandDensity,Kr[u]=z.colorWarmCoolBias,Jr[u]=z.colorSpace,Qr[u]=z.transferFn,eo[u]=z.lchChromaCoupling,to.set(z.color,u*3),ao[u]=z.qualityHint,ro[u]=z.sceneIterations,oo[u]=z.sceneMaxSteps,no[u]=z.bulbPower,io[u]=z.bulbBailoutRadius,so[u]=z.bulbTrigMode,lo[u]=z.bulbTrigTermX,co[u]=z.bulbTrigTermY,uo[u]=z.bulbTrigTermZ,fo[u]=z.bulbTrigThetaAxis,mo[u]=z.bulbTrigPhiAxisA,bo[u]=z.bulbTrigPhiAxisB,po[u]=z.bulbTrigThetaOffset,_o[u]=z.bulbTrigPhiOffset,ho[u]=z.bulbTrigThetaRate,xo[u]=z.bulbTrigPhiRate}const Jn=(()=>{const u=Tc;if(Zt<=0||u<=0)return{enabled:!1,activeBulbCount:Zt,probeSamples:0,estimatedCandidateTests:0,estimatedCulledTests:0,estimatedCullRatio:0,estimatedCulledPerSample:0,nearestBoundDistance:0};const z=Bt([0,0,Xa],la,ca),Ie=tt(Bt(tt([Sa,Ea,qa*ja]),la,ca)),Ve=g(Dr,2,120);let Ce=0,We=0,He=Number.POSITIVE_INFINITY;for(let Le=0;Le<u;Le+=1){const ft=Ve*Le/Math.max(1,u-1),ae=[z[0]+Ie[0]*ft,z[1]+Ie[1]*ft,z[2]+Ie[2]*ft];let mt=Number.POSITIVE_INFINITY;const Rt=[];for(let Ye=0;Ye<Zt;Ye+=1){const Ke=ua[Ye]??Nr,wa=g(Math.abs(Ke.bulbBailoutRadius)*Ec+zc,Ac,wc)*g(Ke.scale,.05,8),tr=ae[0]-Ke.position[0],Qn=ae[1]-Ke.position[1],ei=ae[2]-Ke.position[2],go=Math.hypot(tr,Qn,ei)-wa;Rt.push(go),mt=Math.min(mt,go),Ce+=1}if(He=Math.min(He,mt),!(mt<=0))for(const Ye of Rt)Ye>mt+Mc&&(We+=1)}const Ze=Ce>0?We/Ce:0;return{enabled:Zt>1,activeBulbCount:Zt,probeSamples:u,estimatedCandidateTests:Ce,estimatedCulledTests:We,estimatedCullRatio:Ze,estimatedCulledPerSample:We/u,nearestBoundDistance:Number.isFinite(He)?He:0}})();k-q.current>=Sc&&(q.current=k,ya(Jn));const Qa=u=>{i.bindFramebuffer(i.FRAMEBUFFER,u),i.viewport(0,0,ue,xe),i.useProgram(A),ln(i,A,G),i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,null),i.uniform1i(f.sceneFractalKind,Ic(ia)),i.uniform1f(f.time,$e.current),i.uniform2f(f.resolution,ue,xe),i.uniform2f(f.cameraRotation,la,ca),i.uniform2f(f.pan,Sa,Ea),i.uniform1i(f.bulbCount,Zt),i.uniformMatrix3fv(f.bulbRotationMatrix,!1,kr),i.uniformMatrix3fv(f.bulbInverseRotationMatrix,!1,Or),i.uniform3fv(f.bulbPosition,$r),i.uniform1fv(f.bulbScale,Xr),i.uniform1fv(f.bulbColorStyle,jr),i.uniform1iv(f.bulbSurfaceShaderMode,qr),i.uniform1iv(f.bulbMaterialMode,Gr),i.uniform1fv(f.bulbMaterialIntensity,Vr),i.uniform1fv(f.bulbOrbitTrapMix,Wr),i.uniform1fv(f.bulbOrbitTrapAoStrength,Hr),i.uniform1fv(f.bulbColorVividness,Zr),i.uniform1fv(f.bulbColorBandDensity,Yr),i.uniform1fv(f.bulbColorWarmCoolBias,Kr),i.uniform1iv(f.bulbColorSpace,Jr),i.uniform1iv(f.bulbTransferFn,Qr),i.uniform1iv(f.bulbLchChromaCoupling,eo),i.uniform3fv(f.bulbColor,to),i.uniform1fv(f.bulbQualityHint,ao),i.uniform1iv(f.bulbSceneIterations,ro),i.uniform1iv(f.bulbSceneMaxSteps,oo),i.uniform1fv(f.bulbPower,no),i.uniform1fv(f.bulbBailoutRadius,io),i.uniform1iv(f.bulbTrigMode,so),i.uniform1iv(f.bulbTrigTermX,lo),i.uniform1iv(f.bulbTrigTermY,co),i.uniform1iv(f.bulbTrigTermZ,uo),i.uniform1iv(f.bulbTrigThetaAxis,fo),i.uniform1iv(f.bulbTrigPhiAxisA,mo),i.uniform1iv(f.bulbTrigPhiAxisB,bo),i.uniform1fv(f.bulbTrigThetaOffset,po),i.uniform1fv(f.bulbTrigPhiOffset,_o),i.uniform1fv(f.bulbTrigThetaRate,ho),i.uniform1fv(f.bulbTrigPhiRate,xo),i.uniform1i(f.paletteSampleCount,ur),i.uniform3fv(f.paletteSamples,na.current),i.uniform1f(f.focalLength,ja),i.uniform1f(f.raySurfaceEpsilon,Fr),i.uniform1f(f.rayErrorTolerance,Br),i.uniform1f(f.rayStepScale,Ur),i.uniform1f(f.rayMaxDistance,Dr),i.uniform1f(f.cyclePhase,ge.current),i.uniform1f(f.lighting,g(nt,0,2.5)),i.uniform3f(f.lightPosition,g(re.x,-16,16),g(re.y,-16,16),g(re.z,-16,16)),i.uniform3f(f.lightColor,g(ne.r,0,2),g(ne.g,0,2),g(ne.b,0,2)),i.uniform3f(f.backgroundColor,g(fe.r,0,1),g(fe.g,0,1),g(fe.b,0,1)),i.uniform1f(f.backgroundIntensity,g(Ee,0,2.5)),i.uniform1f(f.zoom,qa),i.uniform1f(f.depth,Xa),i.uniform1f(f.wind,g(De,0,4.5)),i.uniform1f(f.fogStrength,g(Ne,0,1.5)),i.uniform1f(f.mistStrength,g(ht,0,1.5)),i.uniform1f(f.tankEnabled,ye?1:0),i.uniform3f(f.tankHalfExtents,Ha.x,Ha.y,Ha.z),i.uniform1f(f.tankRefractionStrength,g(it,0,1)),i.uniform1f(f.tankHazeStrength,g(Qt,0,2.5)),i.uniform1f(f.tankShellStrength,g(ea,0,1)),i.drawArrays(i.TRIANGLES,0,6)};if(!St)Qa(null);else{const u=Pe(i,ue,xe);if(!u)Qa(null);else{Qa(u.fbA);const z=Number.isFinite(jt)?jt:.7,Ie=Number.isFinite(qt)?qt:1,Ve=Number.isFinite(Gt)?Gt:1,Ce=g(z,0,1),We=Je(Ie,1,Er),He=Je(Ve,1,hc);let Ze=u.texA,Le=u.texB,ft=u.fbB;const ae=We===1?u.radius1Program:u.genericProgram,Rt=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS)>1?1:0,Ye=i.TEXTURE0+Rt;i.useProgram(ae.program),ln(i,ae.program,G),i.uniform2f(ae.uniforms.resolution,ue,xe),i.uniform1f(ae.uniforms.strength,Ce),ae.uniforms.radius&&i.uniform1i(ae.uniforms.radius,We),i.uniform1i(ae.uniforms.sourceTexture,Rt);for(let Ke=0;Ke<He;Ke+=1){const wa=Ke===He-1;if(i.bindFramebuffer(i.FRAMEBUFFER,wa?null:ft),i.viewport(0,0,ue,xe),i.activeTexture(Ye),i.bindTexture(i.TEXTURE_2D,Ze),i.drawArrays(i.TRIANGLES,0,6),!wa){const tr=Le;Le=Ze,Ze=tr,ft=ft===u.fbA?u.fbB:u.fbA}}i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null)}}const yo=performance.now()-I,er=M.current;er.count+=1,er.totalMs+=yo,er.lastMs=yo,ee.current=k},[J,Q,Et,ra,h,e,Pe,St,Gt,qt,jt,b,j,_t,oe,m,y,x,L,P,R,E,V,O,H,Y,pt,at,rt,ot,v,Ne,ye,it,Qt,ea,Be,Te,Se,Dt,da,Tt,ba,kt,xt,yt,ze,ke,Ot,gt,K,$t,pe,Oe,$,vt,nt,re.x,re.y,re.z,ne.r,ne.g,ne.b,fe.r,fe.g,fe.b,Ee,Nt,ht,T,ta,aa,Ue,De,Ae,le,ia,n,p]);d.useEffect(()=>{me.current=sa},[sa]),d.useEffect(()=>{if(!e){Xe("none"),N.current=1,ee.current=0,_e.current=0,q.current=0,xa(Wo()),ya(Ho());return}const i=t.current;if(!i)return;let A=null,f=null;const{backend:G,gl:I}=Xc(i);if(!I){Xe("none");const ut=Re("contextAcquireFailures");return ce("warn",`Scene raymarch renderer could not acquire a WebGL context [count=${ut}].`),A=window.setTimeout(()=>{S(ue=>ue+1)},1200),()=>{A!==null&&window.clearTimeout(A)}}const k=pr(I,G==="webgl2"?rr:ar,G==="webgl2"?Ds:Us);if(!k){Xe("none"),ce("warn","Scene raymarch shader program failed to compile/link.");return}const X=new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),W=I.createBuffer();if(!W){I.deleteProgram(k),Xe("none"),ce("warn","Scene raymarch renderer could not allocate quad buffer.");return}I.bindBuffer(I.ARRAY_BUFFER,W),I.bufferData(I.ARRAY_BUFFER,X,I.STATIC_DRAW),zt.current=I,lt.current=k,Vt.current=$c(I,k),ie.current=W,Xe(G),ce("state",`Scene raymarch renderer initialized (${G}).`);const te=()=>{me.current(),de.current=requestAnimationFrame(te)};de.current=requestAnimationFrame(te);const je=()=>me.current(),qe=ut=>{ut.preventDefault();const ue=Re("contextLostCount");ce("warn",`Scene raymarch WebGL context lost. Attempting recovery [count=${ue}].`),Xe("none"),At.current=null,we.current={width:0,height:0},zt.current=null,Vt.current=null,lt.current=null,ie.current=null,de.current!==null&&(cancelAnimationFrame(de.current),de.current=null),f!==null&&window.clearTimeout(f),f=window.setTimeout(()=>{S(xe=>xe+1)},1200)},he=()=>{const ut=Re("contextRestoredCount");ce("info",`Scene raymarch WebGL context restored. Reinitializing renderer [count=${ut}].`),S(ue=>ue+1)};return i.addEventListener("webglcontextlost",qe,!1),i.addEventListener("webglcontextrestored",he,!1),window.addEventListener("resize",je),me.current(),()=>{A!==null&&window.clearTimeout(A),f!==null&&window.clearTimeout(f),i.removeEventListener("webglcontextlost",qe,!1),i.removeEventListener("webglcontextrestored",he,!1),window.removeEventListener("resize",je),de.current!==null&&(cancelAnimationFrame(de.current),de.current=null),ie.current&&(I.deleteBuffer(ie.current),ie.current=null),lt.current&&(I.deleteProgram(lt.current),lt.current=null),ct(I),Vt.current=null,zt.current=null}},[Re,t,B,ct,e,ce]),d.useEffect(()=>{e&&(v||me.current())},[e,v,J,Q,Et,ra,p,h,T,m,y,x,L,P,R,E,V,O,H,Y,oe,j,pt,at,rt,ot,Be,Te,Se,Ue,nt,re.x,re.y,re.z,ne.r,ne.g,ne.b,fe.r,fe.g,fe.b,Ee,_t,De,Ne,ht,ye,it,Qt,ea,Dt,Nt,kt,xt,yt,ze,ke,Ot,gt,K,$t,pe,Oe,$,vt,Ae,ta,aa,St,jt,qt,Gt,sa]),d.useEffect(()=>{const i=window.setInterval(()=>{const A=performance.now(),f=M.current,G=A-f.startTime;G<=0||(F({rendersPerSecond:f.count/(G/1e3),lastRenderMs:f.lastMs,avgRenderMs:f.count>0?f.totalMs/f.count:0}),f.startTime=A,f.count=0,f.totalMs=0,f.lastMs=0)},500);return()=>window.clearInterval(i)},[]);const ga=d.useCallback(i=>{!e||!Number.isFinite(i)||(ge.current+=i,me.current())},[e]),Oa=d.useCallback(()=>{e&&(ge.current=0,me.current())},[e]),Mt=d.useCallback(()=>[...se.current],[]);return{effectiveIterations:Me.effectiveIterations>0?Me.effectiveIterations:Je(Dt,fr,mr),isAtPrecisionLimit:!1,precisionMode:"F32",rendererBackend:ha,rendererDiagnostics:_,rendererStats:U,adaptiveQualitySnapshot:Me,broadPhaseTelemetry:ka,render:sa,nudgeCyclePhase:ga,resetCyclePhase:Oa,getScenePrimaryRotationMatrix:Mt}};export{cu as A,D as B,su as C,zo as D,fu as E,Ft as F,au as G,Gc as H,Mn as I,Yl as J,Kl as K,Yc as L,Rn as M,ns as N,Tr as O,vr as P,pn as Q,Na as R,uu as S,Pn as T,ul as U,Kc as V,Jc as W,Qc as X,eu as Y,cl as Z,iu as a,qi as b,Gi as c,Vi as d,Hi as e,Zi as f,Yi as g,Ji as h,Qi as i,es as j,ts as k,Hc as l,Zc as m,ru as n,ou as o,ji as p,Eo as q,Vc as r,Wc as s,tu as t,nu as u,Xi as v,bc as w,fc as x,Oo as y,lu as z};
