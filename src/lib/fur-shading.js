// Stable screen-space variation avoids sparkling noise as the rabbit animates.
function noise(x, y) {
  let n = Math.imul(x + 17, 374761393) ^ Math.imul(y + 31, 668265263);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

const ramp = " .'`/|\\/(){}[]|lI!1Tt%&@";

export function furCharacter(brightness, alpha, flowX, flowY, x, y) {
  if (alpha < .15) return ' ';
  const jitter = noise(x, y);
  const shade = Math.max(0, Math.min(1, 1 - brightness + (jitter - .5) * .13));
  if (brightness > .82) return jitter < .68 ? ' ' : "'`.,"[Math.floor(jitter * 13) % 4];
  if (shade > .8) return '%&@'[Math.min(2, Math.floor((shade - .8) * 15))];
  if (jitter > .92 && shade > .25 && shade < .75) return '(){}'[Math.floor(jitter * 100) % 4];

  // Neighboring cells often share a stroke, with occasional curved clumps.
  const cluster = noise(Math.floor(x / 3), Math.floor(y / 2));
  if (jitter < .79 && shade > .18) {
    if (Math.abs(flowY) > Math.abs(flowX) * 1.8) return '|lI!1'[Math.floor(cluster * 5)];
    if (Math.abs(flowX) > Math.abs(flowY) * 2.5) return cluster < .65 ? '/' : '~';
    return flowX * flowY >= 0 ? '\\' : '/';
  }
  const index = Math.round(shade * (ramp.length - 1) + (jitter - .5) * 4);
  return ramp[Math.max(0, Math.min(ramp.length - 1, index))];
}
