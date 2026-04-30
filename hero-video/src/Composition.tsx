import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const codeLines = [
  "Creating project structure",
  "Designing responsive layout",
  "Building playable arcade scene",
  "Adding neon score board",
  "Publishing preview",
];

const pixels = [
  "00100100",
  "01111110",
  "11011011",
  "11111111",
  "10111101",
  "10100101",
  "00100100",
  "01000010",
];

const interpolateSeconds = (
  frame: number,
  fps: number,
  input: [number, number],
  output: [number, number],
) =>
  interpolate(frame, [input[0] * fps, input[1] * fps], output, {
    ...clamp,
    easing: ease,
  });

const Monitor = () => (
  <div className="monitor">
    <div className="monitor-bar">
      <span />
      <span />
      <span />
      <b>vibeblt.dev</b>
    </div>
    <div className="editor-grid">
      <div className="file-tree">
        <strong>PROJECT</strong>
        <p>app</p>
        <p>components</p>
        <p>site.tsx</p>
        <p>publish.ts</p>
      </div>
      <div className="code-panel">
        {Array.from({ length: 12 }).map((_, index) => (
          <div className="code-line" key={index}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <i style={{ width: `${38 + ((index * 19) % 46)}%` }} />
            <em style={{ width: `${18 + ((index * 13) % 24)}%` }} />
          </div>
        ))}
      </div>
      <div className="metrics">
        <div className="chart">
          {[44, 68, 52, 86, 74, 96].map((height, index) => (
            <span key={index} style={{ height: `${height}%` }} />
          ))}
        </div>
        <p>agent loop</p>
      </div>
    </div>
  </div>
);

const RoomScene = ({
  focus,
  typingProgress,
  muted = false,
}: {
  focus: number;
  typingProgress: number;
  muted?: boolean;
}) => (
  <AbsoluteFill className={`room-scene ${muted ? "muted" : ""}`}>
    <div className="window">
      <span />
      <span />
      <span />
    </div>
    <div className="poster rocket">
      VIBE
      <br />
      CODE
    </div>
    <div className="poster done">
      GET
      <br />
      SHIP
      <br />
      DONE
    </div>
    <div className="shelf shelf-left">
      {["Clean Code", "Ship Fast", "UI Patterns", "Agent SDK"].map((book) => (
        <span key={book}>{book}</span>
      ))}
    </div>
    <div className="led-strip" />
    <div className="desk" />
    <div className="side-monitor left">
      <div className="app-card">
        <b>Project Tasks</b>
        <span />
        <span />
        <span />
      </div>
    </div>
    <div
      className="main-monitor-wrap"
      style={{
        transform: `translateX(-50%) scale(${1 + focus * 0.2})`,
      }}
    >
      <Monitor />
    </div>
    <div className="side-monitor right">
      <div className="terminal">
        {codeLines.map((line) => (
          <p key={line}>$ {line}</p>
        ))}
      </div>
    </div>
    <div className="keyboard">
      {Array.from({ length: 48 }).map((_, index) => (
        <span
          className={Math.floor(typingProgress * 140) % 48 === index ? "active" : ""}
          key={index}
        />
      ))}
    </div>
    <div className="mug">
      CODE
      <br />& COFFEE
    </div>
    <div className="girl">
      <div className="chair" />
      <div className="ponytail" />
      <div className="hair hair-back" />
      <div className="hair hair-front" />
      <div className="head">
        <div className="ear" />
        <div className="nose" />
        <div className="glasses" />
        <div className="eye" />
      </div>
      <div className="neck" />
      <div className="hoodie">
        <div className="hood" />
        <div className="drawstrings" />
        <span>V</span>
      </div>
      <div
        className="arm left-arm"
        style={{
          transform: `rotate(15deg) translateY(${Math.sin(typingProgress * 28) * 5}px)`,
        }}
      />
      <div
        className="arm right-arm"
        style={{
          transform: `rotate(-13deg) translateY(${Math.cos(typingProgress * 30) * 5}px)`,
        }}
      />
      <div
        className="hand left-hand"
        style={{ transform: `translateY(${Math.cos(typingProgress * 30) * 4}px)` }}
      />
      <div
        className="hand right-hand"
        style={{ transform: `translateY(${Math.sin(typingProgress * 28) * 4}px)` }}
      />
      <div className="leg upper-leg" />
      <div className="leg lower-leg" />
    </div>
  </AbsoluteFill>
);

const AgentScene = ({ progress }: { progress: number }) => (
  <AbsoluteFill className="agent-scene">
    <div className="agent-grid">
      <div className="agent-panel">
        <div className="agent-orbit">
          <span />
          <span />
          <span />
        </div>
        <h2>Agent is building</h2>
        {codeLines.map((line, index) => (
          <div className="task-row" key={line}>
            <span className={progress > index / codeLines.length ? "done" : ""} />
            <p>{line}</p>
          </div>
        ))}
      </div>
      <div className="build-preview">
        <div className="browser-bar">
          <span />
          <span />
          <span />
          <b>space-invader.vibeblt.dev</b>
        </div>
        <div className="preview-stage">
          <div className="wire hero" />
          <div className="wire nav" />
          <div className="wire grid-a" />
          <div className="wire grid-b" />
          <div className="wire grid-c" />
          <div className="scan-line" style={{ top: `${12 + progress * 66}%` }} />
        </div>
      </div>
    </div>
  </AbsoluteFill>
);

const SpaceInvader = () => (
  <div className="invader">
    {pixels.flatMap((row, y) =>
      row.split("").map((value, x) => (
        <span
          className={value === "1" ? "on" : ""}
          key={`${x}-${y}`}
          style={{ gridColumn: x + 1, gridRow: y + 1 }}
        />
      )),
    )}
  </div>
);

const WebsiteScene = ({ punch }: { punch: number }) => (
  <AbsoluteFill className="website-scene">
    <div
      className="site-frame"
      style={{
        transform: `scale(${0.92 + punch * 0.08})`,
      }}
    >
      <div className="site-nav">
        <b>VOID RAID</b>
        <span>Play</span>
        <span>Scores</span>
        <span>Share</span>
      </div>
      <div className="stars">
        {Array.from({ length: 46 }).map((_, index) => (
          <i
            key={index}
            style={{
              left: `${(index * 37) % 100}%`,
              top: `${(index * 23) % 100}%`,
              opacity: 0.35 + ((index * 11) % 50) / 100,
            }}
          />
        ))}
      </div>
      <SpaceInvader />
      <h1>SPACE INVADER</h1>
      <p>Launch the arcade. Share the build.</p>
      <button>Play now</button>
    </div>
  </AbsoluteFill>
);

const EndCard = ({
  opacity,
  textScale,
}: {
  opacity: number;
  textScale: number;
}) => (
  <AbsoluteFill className="end-card" style={{ opacity }}>
    <div className="end-backdrop">
      <RoomScene focus={0} typingProgress={0} muted />
    </div>
    <div className="end-overlay" />
    <div className="brand-mark">V</div>
    <h1
      style={{
        transform: `scale(${textScale})`,
      }}
    >
      Share your Vibecoded project with the world on Vibeblt
    </h1>
  </AbsoluteFill>
);

export const MyComposition = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const roomScale = interpolateSeconds(frame, fps, [1.1, 4.1], [1, 3.8]);
  const roomX = interpolateSeconds(frame, fps, [1.1, 4.1], [0, -600]);
  const roomY = interpolateSeconds(frame, fps, [1.1, 4.1], [0, 90]);
  const roomFade = interpolate(frame, [4.05 * fps, 4.7 * fps], [1, 0], clamp);
  const typingProgress = interpolate(frame, [0, 3.8 * fps], [0, 1], clamp);

  const agentIn = interpolate(frame, [4.25 * fps, 4.9 * fps], [0, 1], clamp);
  const agentOut = interpolate(frame, [5.95 * fps, 6.55 * fps], [1, 0], clamp);
  const agentOpacity = agentIn * agentOut;
  const agentProgress = interpolate(frame, [4.65 * fps, 6.35 * fps], [0, 1], clamp);

  const websiteOpacity = interpolate(frame, [5.75 * fps, 6.55 * fps], [0, 1], clamp);
  const websiteOut = interpolate(frame, [9 * fps, 9.8 * fps], [1, 0.18], clamp);
  const websitePunch = interpolateSeconds(frame, fps, [6.2, 7.3], [0, 1]);

  const endOpacity = interpolate(frame, [8.95 * fps, 9.7 * fps], [0, 1], clamp);
  const textScale = interpolate(frame, [9.25 * fps, 10.05 * fps], [0.88, 1], {
    ...clamp,
    easing: ease,
  });

  return (
    <AbsoluteFill className="composition">
      <div
        className="room-camera"
        style={{
          opacity: roomFade,
          transform: `translate(${roomX}px, ${roomY}px) scale(${roomScale})`,
        }}
      >
        <RoomScene focus={roomScale - 1} typingProgress={typingProgress} />
      </div>
      <div className="scene-layer" style={{ opacity: agentOpacity }}>
        <AgentScene progress={agentProgress} />
      </div>
      <div className="scene-layer" style={{ opacity: websiteOpacity * websiteOut }}>
        <WebsiteScene punch={websitePunch} />
      </div>
      <EndCard opacity={endOpacity} textScale={textScale} />
    </AbsoluteFill>
  );
};
