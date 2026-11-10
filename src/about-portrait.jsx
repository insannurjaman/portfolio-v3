import React, { useEffect, useRef, useState } from "react";

const ASCII_PORTRAIT = {
  src: "/media/about/ascii-portrait-1600.jpg",
  srcSet: "/media/about/ascii-portrait-800.jpg 800w, /media/about/ascii-portrait-1600.jpg 1600w",
};

// The owner-supplied photograph is hosted locally for the portrait reveal.
export function AboutPortrait({ original = null }) {
  const frame = useRef(null);
  const animationFrame = useRef(null);
  const pointer = useRef({ x: 50, y: 45 });
  const [asciiFailed, setAsciiFailed] = useState(false);
  const [originalStatus, setOriginalStatus] = useState("pending");
  const [exploring, setExploring] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [retry, setRetry] = useState(0);
  const ready = Boolean(original) && originalStatus === "ready";
  const interactive = ready && !asciiFailed;

  function cancelPointerFrame() {
    if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
    animationFrame.current = null;
  }

  useEffect(() => {
    const clearHover = () => setExploring(false);
    window.addEventListener("blur", clearHover);
    return () => {
      window.removeEventListener("blur", clearHover);
      cancelPointerFrame();
    };
  }, []);

  function trackPointer(event) {
    if (!interactive || event.pointerType === "touch") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    pointer.current = {
      x: Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100)),
      y: Math.max(0, Math.min(100, (event.clientY - bounds.top) / bounds.height * 100)),
    };
    if (animationFrame.current === null) {
      animationFrame.current = requestAnimationFrame(() => {
        frame.current?.style.setProperty("--portrait-x", `${pointer.current.x}%`);
        frame.current?.style.setProperty("--portrait-y", `${pointer.current.y}%`);
        animationFrame.current = null;
      });
    }
  }

  function enter(event) {
    trackPointer(event);
    if (interactive && event.pointerType !== "touch") setExploring(true);
  }

  function leave() {
    setExploring(false);
    cancelPointerFrame();
  }

  function tryAgain() {
    setAsciiFailed(false);
    setOriginalStatus("pending");
    setRevealed(false);
    setRetry(value => value + 1);
  }

  return <figure className="about-portrait">
    <div
      ref={frame}
      data-thumbnail-generation="light"
      className={`portrait-frame${exploring && interactive ? " is-exploring" : ""}${revealed && interactive ? " is-revealed" : ""}${asciiFailed && ready ? " is-original-only" : ""}`}
      onPointerEnter={enter} onPointerMove={trackPointer} onPointerLeave={leave} onPointerCancel={leave}
    >
      {!asciiFailed && <img data-thumbnail-source key={`ascii-${retry}`} className="portrait-ascii" {...ASCII_PORTRAIT}
        sizes="(max-width: 900px) 90vw, (min-width: 1600px) 680px, 45vw"
        width="1600" height="1589" alt="Insan Nurjaman in side profile, rendered in colorful ASCII characters." aria-hidden={revealed && interactive}
        fetchPriority="high" decoding="async" draggable="false" onError={() => setAsciiFailed(true)}/>}
      {original && originalStatus !== "error" && <img key={`original-${retry}`} className="portrait-original" src={original.src} srcSet={original.srcSet}
        sizes="(max-width: 900px) 90vw, (min-width: 1600px) 680px, 45vw"
        width="1600" height="1589" alt="Original portrait of Insan Nurjaman." aria-hidden={!asciiFailed && !revealed}
        decoding="async" draggable="false" onLoad={() => setOriginalStatus("ready")} onError={() => { setOriginalStatus("error"); setRevealed(false); setExploring(false); }}/>}
      {interactive && <button type="button" className="portrait-reveal-control" aria-pressed={revealed}
        aria-label={revealed ? "Show ASCII portrait" : "Reveal original portrait"}
        aria-describedby="portrait-reveal-instructions" onClick={() => setRevealed(value => !value)}>
        <span className="portrait-reveal-hint" aria-hidden="true">
          {revealed ? "Show ASCII portrait" : <><span className="portrait-hint-pointer">Hover to reveal</span><span className="portrait-hint-touch">Tap to reveal</span></>}
        </span>
        <span className="sr-only" id="portrait-reveal-instructions">Move your pointer over the portrait to reveal the original photograph. Click, tap, or press Enter or Space to switch between the original and ASCII portrait.</span>
      </button>}
      {asciiFailed && !ready && <div className="about-portrait-fallback" role="status"><p>The portrait couldn’t load.</p><button type="button" onClick={tryAgain}>Try again</button></div>}
    </div>
  </figure>;
}
