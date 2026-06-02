(function (global) {
  const PAPER_VERTEX_SOURCE = `#version 300 es
in vec2 a_position;
out vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

  const PAPER_FRAGMENT_SOURCE = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 out_color;

uniform vec2 u_resolution;
uniform vec2 u_play_band;
uniform float u_tick;
uniform float u_time;
uniform float u_intensity;
uniform vec3 u_paper_base;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);
  for (int i = 0; i < 4; i++) {
    value += amp * noise(p);
    p = rot * p * 1.93 + vec2(11.7, 3.9);
    amp *= 0.5;
  }
  return value;
}

void main() {
  float band = smoothstep(u_play_band.x, u_play_band.x + 0.004, v_uv.y)
    * (1.0 - smoothstep(u_play_band.y - 0.004, u_play_band.y, v_uv.y));

  if (band < 0.0001) {
    out_color = vec4(0.0);
    return;
  }

  float tick_phase = 0.0;
  float aspect = u_resolution.x / max(1.0, u_resolution.y);
  vec2 paper_uv = vec2(v_uv.x * aspect, v_uv.y);

  float large_pulp = fbm(paper_uv * 45.0 + vec2(0.0, 0.0));
  float medium_grain = fbm(paper_uv * 180.0 + vec2(4.3, 0.0));
  float fiber = fbm(vec2(paper_uv.x * 760.0 + medium_grain * 5.0, paper_uv.y * 220.0));

  float speck_seed = hash12(floor(paper_uv * 95.0 + tick_phase));
  float dark_speck = step(0.987, speck_seed);
  float light_speck = step(0.995, hash12(floor(paper_uv * 121.0 + vec2(17.0, 5.0))));

  float tonal = 0.0;
  tonal += (large_pulp - 0.5) * 0.20;
  tonal += (medium_grain - 0.5) * 0.25;
  tonal += (fiber - 0.5) * 0.20;
  tonal += dark_speck * -0.16;
  tonal += light_speck * 0.08;

  // Fake cut-paper depth: tiny procedural shadow islands that imply layered scraps.
  float layer_shape = smoothstep(0.52, 0.82, fbm(paper_uv * 15.0 + vec2(8.0, -3.0)));
  float layer_offset = fbm(paper_uv * 15.0 + vec2(8.05, -2.96));
  float layer_shadow = clamp(layer_shape - layer_offset, 0.0, 1.0);
  tonal -= layer_shadow * 0.14;

  vec3 paper_tone = u_paper_base + tonal;
  float alpha = clamp((0.34 + abs(tonal) * 0.55) * u_intensity, 0.0, 0.64);
  alpha *= band;

  out_color = vec4(clamp(paper_tone, 0.0, 1.0), alpha);
}`;

  global.COPRO_PAPER_SHADER = {
    vertex: PAPER_VERTEX_SOURCE,
    fragment: PAPER_FRAGMENT_SOURCE,
  };
})(window);
