import rawData from "../data/logo-strokes.json";

type Point = [number, number];

type Timing = {
  start: number;
  duration: number;
};

type StrokeItem = {
  part: "mark" | "word" | "games";
  letter: number;
  width: number;
  opacity: number;
  start: number;
  duration: number;
  times: number[];
  boil: Point[][];
};

type RectItem = {
  name: "pixel" | "dot";
  part: "mark" | "word";
  center: Point;
  bottom: Point;
  boil: Point[][];
};

type LogoData = {
  boxes: {
    lockup: { x: number; y: number; w: number; h: number };
  };
  colors: {
    rose: string;
    night: string;
    light: string;
    paper: string;
  };
  boil: {
    periodMs: number;
    frames: number;
  };
  timeline: {
    strokes: Timing[];
    pixel: Timing;
    dot: Timing;
    push: Timing;
    fade: Timing;
    end: number;
  };
  strokes: StrokeItem[];
  rects: RectItem[];
};

const data = rawData as LogoData;

const SVG_NS = "http://www.w3.org/2000/svg";
const DRAWN_AT = 1520;
const GLIDE_AT = 1660;
const GLIDE_DURATION = 640;
const REVEAL_AT = 1920;
const SETTLE_AT = GLIDE_AT + GLIDE_DURATION;

function cubic(x1: number, y1: number, x2: number, y2: number) {
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let lo = 0;
    let hi = 1;
    let t = x;
    for (let i = 0; i < 40; i++) {
      t = (lo + hi) / 2;
      const cx = 3 * x1 * t * (1 - t) ** 2 + 3 * x2 * t * t * (1 - t) + t ** 3;
      if (cx < x) lo = t;
      else hi = t;
    }
    return 3 * y1 * t * (1 - t) ** 2 + 3 * y2 * t * t * (1 - t) + t ** 3;
  };
}

const EASE = {
  out: cubic(0.16, 1, 0.3, 1),
  in: cubic(0.55, 0, 1, 0.45),
  land: cubic(0.2, 0.8, 0.4, 1),
  push: cubic(0.2, 0.6, 0.3, 1),
  linear: (x: number) => x,
};

type Keyframe = {
  at: number;
  v: number[];
  ease?: (x: number) => number;
};

const progress = (t: number, { start, duration }: Timing) =>
  Math.min(1, Math.max(0, (t - start) / duration));

const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

function keyframes(frames: Keyframe[], u: number): number[] {
  let i = 0;
  while (i < frames.length - 2 && u > frames[i + 1].at) i++;
  const a = frames[i];
  const b = frames[i + 1];
  const local = (a.ease ?? EASE.linear)((u - a.at) / (b.at - a.at));
  return a.v.map((value, j) => lerp(value, b.v[j], local));
}

function pixelTransform(t: number, rect: RectItem) {
  const u = progress(t, data.timeline.pixel);
  const [ty, sx, sy] = keyframes(
    [
      { at: 0, v: [-150, 0.9, 1.15], ease: EASE.in },
      { at: 0.5, v: [0, 1.35, 0.65], ease: EASE.land },
      { at: 0.72, v: [-16, 0.88, 1.12], ease: EASE.in },
      { at: 0.86, v: [0, 1.12, 0.88], ease: EASE.out },
      { at: 1, v: [0, 1, 1] },
    ],
    u,
  );
  const opacity = Math.min(1, EASE.in(u / 0.15));
  const [bx, by] = rect.bottom;
  return {
    opacity,
    transform: `translate(${bx} ${by + ty}) scale(${sx} ${sy}) translate(${-bx} ${-by})`,
  };
}

function dotTransform(t: number, rect: RectItem) {
  const u = EASE.out(progress(t, data.timeline.dot));
  const [s, r] = keyframes(
    [
      { at: 0, v: [0, -40] },
      { at: 0.55, v: [1.3, 8] },
      { at: 1, v: [1, 0] },
    ],
    u,
  );
  const [cx, cy] = rect.center;
  return {
    opacity: 1,
    transform: `translate(${cx} ${cy}) rotate(${r}) scale(${s}) translate(${-cx} ${-cy})`,
  };
}

function polylineD(points: Point[]): string {
  let d = `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    d += `L${points[i][0].toFixed(1)} ${points[i][1].toFixed(1)}`;
  }
  return d;
}

function polygonPoints(corners: Point[]): string {
  return corners.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

function drawnPoints(stroke: StrokeItem, frameIndex: number, timing: Timing, t: number): Point[] | null {
  const u = progress(t, timing);
  if (u <= 0) return null;
  const pts = stroke.boil[frameIndex];
  if (u >= 1) return pts;
  const times = stroke.times;
  let k = 0;
  while (k < times.length - 2 && times[k + 1] < u) k++;
  const span = times[k + 1] - times[k];
  const f = span > 0 ? Math.min(1, Math.max(0, (u - times[k]) / span)) : 1;
  const a = pts[k];
  const b = pts[k + 1];
  return [...pts.slice(0, k + 1), [lerp(a[0], b[0], f), lerp(a[1], b[1], f)]];
}

function createEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string>,
  parent: Element,
): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  parent.append(el);
  return el;
}

type MountOptions = {
  svg: SVGSVGElement;
  anchor: HTMLElement;
};

export function mountLogoSplash({ svg, anchor }: MountOptions) {
  const { lockup } = data.boxes;
  const cx = lockup.x + lockup.w / 2;
  const cy = lockup.y + lockup.h / 2;

  svg.setAttribute("viewBox", `${lockup.x} ${lockup.y} ${lockup.w} ${lockup.h}`);
  svg.replaceChildren();

  const stage = createEl("g", {}, svg);
  const partGroups: Record<StrokeItem["part"], SVGGElement> = {
    mark: createEl("g", { fill: "none", stroke: data.colors.light }, stage),
    word: createEl("g", { fill: "none", stroke: data.colors.light }, stage),
    games: createEl("g", { fill: "none", stroke: data.colors.light, opacity: "0.55" }, stage),
  };

  const strokePaths = data.strokes.map((stroke) =>
    createEl(
      "path",
      {
        "stroke-width": String(stroke.width),
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      },
      partGroups[stroke.part],
    ),
  );

  const rectPolygons = data.rects.map(() =>
    createEl("polygon", { fill: data.colors.rose, opacity: "0" }, stage),
  );

  let rafId = 0;
  let boilTimer = 0;
  let boilTick = 0;
  let isAnimating = false;

  function renderFrame(t: number, boilIndex: number, zoomAmount: number) {
    if (zoomAmount !== 1) {
      stage.setAttribute(
        "transform",
        `translate(${cx} ${cy}) scale(${zoomAmount.toFixed(4)}) translate(${-cx} ${-cy})`,
      );
    } else {
      stage.removeAttribute("transform");
    }

    for (let i = 0; i < data.strokes.length; i++) {
      const stroke = data.strokes[i];
      const timing = data.timeline.strokes[i];
      const pathEl = strokePaths[i];
      const pts = drawnPoints(stroke, boilIndex, timing, t);
      pathEl.setAttribute("d", pts ? polylineD(pts) : "");
    }

    for (let i = 0; i < data.rects.length; i++) {
      const rect = data.rects[i];
      const timing = rect.name === "pixel" ? data.timeline.pixel : data.timeline.dot;
      const polyEl = rectPolygons[i];
      if (t <= timing.start) {
        polyEl.setAttribute("opacity", "0");
        continue;
      }
      polyEl.setAttribute("points", polygonPoints(rect.boil[boilIndex]));
      const { opacity, transform } =
        rect.name === "pixel" ? pixelTransform(t, rect) : dotTransform(t, rect);
      polyEl.setAttribute("opacity", opacity.toFixed(3));
      polyEl.setAttribute("transform", transform);
    }
  }

  function clearAnchorTransform() {
    anchor.style.transition = "";
    anchor.style.transform = "";
  }

  function setCenterTransform() {
    clearAnchorTransform();
    const rect = anchor.getBoundingClientRect();
    if (rect.width === 0) return;

    const targetWidth = Math.min(window.innerWidth * 0.78, 480);
    const scale = Math.max(1.15, targetWidth / rect.width);
    const dx = window.innerWidth / 2 - (rect.left + rect.width / 2);
    const dy = window.innerHeight / 2 - (rect.top + rect.height / 2);

    anchor.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
  }

  function startGlideToPlace() {
    anchor.style.transition = `transform ${GLIDE_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`;
    anchor.style.transform = "translate3d(0, 0, 0) scale(1)";
  }

  function stopHoverBoil() {
    if (boilTimer) {
      window.clearInterval(boilTimer);
      boilTimer = 0;
    }
    if (!isAnimating) {
      renderFrame(DRAWN_AT, 0, 1);
    }
  }

  function startHoverBoil() {
    if (isAnimating || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (boilTimer) return;
    boilTimer = window.setInterval(() => {
      boilTick = (boilTick + 1) % data.boil.frames;
      renderFrame(DRAWN_AT, boilTick, 1);
    }, data.boil.periodMs);
  }

  function renderStatic() {
    cancelAnimationFrame(rafId);
    stopHoverBoil();
    isAnimating = false;
    clearAnchorTransform();
    renderFrame(DRAWN_AT, 0, 1);
    document.documentElement.dataset.splash = "done";
  }

  function playIntro() {
    cancelAnimationFrame(rafId);
    stopHoverBoil();
    isAnimating = true;

    document.documentElement.dataset.splash = "intro";
    setCenterTransform();
    renderFrame(0, 0, 0.96);

    const startTime = performance.now();
    let glided = false;
    let revealed = false;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const boilIndex = Math.floor(elapsed / data.boil.periodMs) % data.boil.frames;
      const zoom = lerp(0.96, 1, EASE.push(Math.min(1, elapsed / GLIDE_AT)));

      if (!glided && elapsed >= GLIDE_AT) {
        glided = true;
        document.documentElement.dataset.splash = "settling";
        startGlideToPlace();
      }

      if (!revealed && elapsed >= REVEAL_AT) {
        revealed = true;
        document.documentElement.dataset.splash = "done";
      }

      if (elapsed >= SETTLE_AT) {
        isAnimating = false;
        clearAnchorTransform();
        renderFrame(DRAWN_AT, 0, 1);
        document.documentElement.dataset.splash = "done";
        return;
      }

      renderFrame(Math.min(elapsed, DRAWN_AT), boilIndex, glided ? 1 : zoom);
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
  }

  function replayInPlace() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      renderStatic();
      return;
    }
    cancelAnimationFrame(rafId);
    stopHoverBoil();
    clearAnchorTransform();
    isAnimating = true;

    const startTime = performance.now();
    const duration = DRAWN_AT + 240;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const boilIndex = Math.floor(elapsed / data.boil.periodMs) % data.boil.frames;

      if (elapsed >= duration) {
        isAnimating = false;
        renderFrame(DRAWN_AT, 0, 1);
        return;
      }

      renderFrame(Math.min(elapsed, DRAWN_AT), boilIndex, 1);
      rafId = requestAnimationFrame(step);
    };

    renderFrame(0, 0, 1);
    rafId = requestAnimationFrame(step);
  }

  anchor.addEventListener("pointerenter", startHoverBoil);
  anchor.addEventListener("pointerleave", stopHoverBoil);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    renderStatic();
  } else {
    playIntro();
  }

  return {
    replay: replayInPlace,
  };
}
