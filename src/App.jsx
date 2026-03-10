import React, { useState, useEffect, useCallback } from "react";

// ── Game Data ──────────────────────────────────────────────────────────────────
// Simulated Knicks vs Clippers game data

const TEAMS = {
  NYK: {
    name: "Knicks",
    city: "New York",
    abbr: "NYK",
    primaryColor: "#006BB6",
    secondaryColor: "#F58426",
  },
  LAC: {
    name: "Clippers",
    city: "Los Angeles",
    abbr: "LAC",
    primaryColor: "#C8102E",
    secondaryColor: "#1D428A",
  },
};

const KNICKS_ROSTER = [
  { id: 1, name: "Jalen Brunson", number: "11", position: "PG" },
  { id: 2, name: "Mikal Bridges", number: "25", position: "SG" },
  { id: 3, name: "OG Anunoby", number: "8", position: "SF" },
  { id: 4, name: "Julius Randle", number: "30", position: "PF" },
  { id: 5, name: "Karl-Anthony Towns", number: "32", position: "C" },
  { id: 6, name: "Josh Hart", number: "3", position: "SG" },
  { id: 7, name: "Donte DiVincenzo", number: "0", position: "SG" },
  { id: 8, name: "Miles McBride", number: "2", position: "PG" },
];

const CLIPPERS_ROSTER = [
  { id: 9, name: "James Harden", number: "1", position: "PG" },
  { id: 10, name: "Norman Powell", number: "24", position: "SG" },
  { id: 11, name: "Kawhi Leonard", number: "2", position: "SF" },
  { id: 12, name: "Derrick Jones Jr.", number: "55", position: "PF" },
  { id: 13, name: "Ivica Zubac", number: "40", position: "C" },
  { id: 14, name: "Terance Mann", number: "14", position: "SG" },
  { id: 15, name: "Bones Hyland", number: "5", position: "PG" },
  { id: 16, name: "Amir Coffey", number: "7", position: "SF" },
];

// Generate realistic play-by-play shot data
function generateGamePlays() {
  const plays = [];
  let nykScore = 0;
  let lacScore = 0;
  let playId = 0;

  const shotTypes = ["jumper", "3PT", "layup", "floater", "dunk", "hook", "fadeaway", "pullup"];

  const generateShotLocation = (type) => {
    // Court is 470x250 in our SVG. We show half-court at a time.
    // x: 0-470, y: 0-250
    switch (type) {
      case "3PT":
        // Around the arc
        const angle3 = Math.random() * Math.PI;
        const r3 = 160 + Math.random() * 20;
        return {
          x: Math.min(450, Math.max(20, 235 + r3 * Math.cos(angle3))),
          y: Math.min(240, Math.max(10, 20 + r3 * Math.sin(angle3) * 0.7)),
        };
      case "layup":
      case "dunk":
        return {
          x: 220 + (Math.random() - 0.5) * 40,
          y: 15 + Math.random() * 30,
        };
      case "floater":
        return {
          x: 200 + (Math.random() - 0.5) * 80,
          y: 30 + Math.random() * 40,
        };
      case "hook":
        return {
          x: 190 + (Math.random() - 0.5) * 60,
          y: 30 + Math.random() * 50,
        };
      default:
        // mid-range
        const angle = Math.random() * Math.PI;
        const r = 60 + Math.random() * 80;
        return {
          x: Math.min(430, Math.max(40, 235 + r * Math.cos(angle))),
          y: Math.min(220, Math.max(20, 20 + r * Math.sin(angle) * 0.8)),
        };
    }
  };

  for (let quarter = 1; quarter <= 4; quarter++) {
    const playsInQ = 22 + Math.floor(Math.random() * 8);
    for (let i = 0; i < playsInQ; i++) {
      const minutesLeft = 12 - Math.floor((i / playsInQ) * 12);
      const secondsLeft = Math.floor(Math.random() * 60);
      const timeStr = `${minutesLeft}:${secondsLeft.toString().padStart(2, "0")}`;

      const isNYK = Math.random() > 0.48;
      const team = isNYK ? "NYK" : "LAC";
      const roster = isNYK ? KNICKS_ROSTER : CLIPPERS_ROSTER;
      // Weighted toward starters
      const playerIdx =
        Math.random() < 0.7
          ? Math.floor(Math.random() * 5)
          : 5 + Math.floor(Math.random() * (roster.length - 5));
      const player = roster[playerIdx];

      const shotType = shotTypes[Math.floor(Math.random() * shotTypes.length)];
      const made =
        shotType === "layup" || shotType === "dunk"
          ? Math.random() > 0.35
          : shotType === "3PT"
            ? Math.random() > 0.64
            : Math.random() > 0.52;

      const points = made ? (shotType === "3PT" ? 3 : 2) : 0;
      if (isNYK) nykScore += points;
      else lacScore += points;

      const location = generateShotLocation(shotType);

      plays.push({
        id: playId++,
        quarter,
        time: timeStr,
        team,
        player,
        shotType,
        made,
        points,
        location,
        nykScore,
        lacScore,
        description: `${player.name} ${made ? "makes" : "misses"} ${shotType}`,
      });
    }
  }

  return plays;
}

// ── Basketball Court SVG ───────────────────────────────────────────────────────

function CourtSVG({ shots, selectedPlayer, currentPlayIndex }) {
  const visibleShots = shots.filter((_, i) => i <= currentPlayIndex);

  // Find each player's LAST shot up to current play
  const lastShotByPlayer = {};
  visibleShots.forEach((shot, i) => {
    lastShotByPlayer[shot.player.id] = { ...shot, index: i };
  });

  return (
    <svg viewBox="0 0 470 280" className="court-svg">
      {/* Court background */}
      <rect x="0" y="0" width="470" height="280" fill="#1a1a2e" rx="4" />
      <rect x="5" y="5" width="460" height="270" fill="#2d1b00" rx="2" stroke="#c4813d" strokeWidth="1.5" />

      {/* Court lines */}
      {/* Baseline */}
      <line x1="5" y1="5" x2="465" y2="5" stroke="#fff" strokeWidth="1.5" />

      {/* Sidelines */}
      <line x1="5" y1="5" x2="5" y2="275" stroke="#fff" strokeWidth="1.5" />
      <line x1="465" y1="5" x2="465" y2="275" stroke="#fff" strokeWidth="1.5" />

      {/* Half court line */}
      <line x1="5" y1="275" x2="465" y2="275" stroke="#fff" strokeWidth="1.5" />

      {/* Paint / Key */}
      <rect x="155" y="5" width="160" height="190" fill="none" stroke="#fff" strokeWidth="1.5" />

      {/* Free throw circle */}
      <circle cx="235" cy="190" r="60" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="5,5" />
      <path d="M 175 190 A 60 60 0 0 1 295 190" fill="none" stroke="#fff" strokeWidth="1.5" />

      {/* Restricted area arc */}
      <path d="M 219 5 A 40 40 0 0 0 251 5" fill="none" stroke="#fff" strokeWidth="1" />
      <circle cx="235" cy="5" r="4" fill="none" stroke="#fff" strokeWidth="1.5" />

      {/* Backboard */}
      <line x1="205" y1="15" x2="265" y2="15" stroke="#fff" strokeWidth="2" />

      {/* Rim */}
      <circle cx="235" cy="22" r="7.5" fill="none" stroke="#F58426" strokeWidth="1.5" />

      {/* 3-point line */}
      <line x1="5" y1="5" x2="5" y2="35" stroke="none" />
      <path
        d="M 30 5 L 30 90 Q 30 210 235 220 Q 440 210 440 90 L 440 5"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
      />

      {/* Center court half circle */}
      <path d="M 175 275 A 60 60 0 0 1 295 275" fill="none" stroke="#fff" strokeWidth="1.5" />

      {/* Shot markers - all previous shots faded */}
      {visibleShots.map((shot, i) => {
        const isLast = lastShotByPlayer[shot.player.id]?.index === i;
        const isSelected = selectedPlayer === null || selectedPlayer === shot.player.id;
        const isCurrent = i === currentPlayIndex;

        if (!isLast && !isCurrent) {
          // Trail dot
          return (
            <circle
              key={shot.id}
              cx={shot.location.x}
              cy={shot.location.y}
              r={3}
              fill={shot.made ? (shot.team === "NYK" ? "#006BB6" : "#C8102E") : "transparent"}
              stroke={shot.team === "NYK" ? "#006BB6" : "#C8102E"}
              strokeWidth={0.8}
              opacity={isSelected ? 0.2 : 0.05}
            />
          );
        }

        // Last shot for this player - show prominently
        return (
          <g key={shot.id} opacity={isSelected ? 1 : 0.15}>
            {/* Pulse ring for current play */}
            {isCurrent && (
              <circle
                cx={shot.location.x}
                cy={shot.location.y}
                r={14}
                fill="none"
                stroke={shot.team === "NYK" ? "#F58426" : "#1D428A"}
                strokeWidth={2}
                className="pulse-ring"
              />
            )}
            {/* Shot marker */}
            {shot.made ? (
              <circle
                cx={shot.location.x}
                cy={shot.location.y}
                r={isCurrent ? 7 : 5.5}
                fill={shot.team === "NYK" ? "#006BB6" : "#C8102E"}
                stroke="#fff"
                strokeWidth={1.5}
              />
            ) : (
              <>
                <line
                  x1={shot.location.x - (isCurrent ? 5 : 4)}
                  y1={shot.location.y - (isCurrent ? 5 : 4)}
                  x2={shot.location.x + (isCurrent ? 5 : 4)}
                  y2={shot.location.y + (isCurrent ? 5 : 4)}
                  stroke={shot.team === "NYK" ? "#006BB6" : "#C8102E"}
                  strokeWidth={2}
                />
                <line
                  x1={shot.location.x + (isCurrent ? 5 : 4)}
                  y1={shot.location.y - (isCurrent ? 5 : 4)}
                  x2={shot.location.x - (isCurrent ? 5 : 4)}
                  y2={shot.location.y + (isCurrent ? 5 : 4)}
                  stroke={shot.team === "NYK" ? "#006BB6" : "#C8102E"}
                  strokeWidth={2}
                />
              </>
            )}
            {/* Player number label */}
            <text
              x={shot.location.x}
              y={shot.location.y - (isCurrent ? 12 : 10)}
              textAnchor="middle"
              fill="#fff"
              fontSize={isCurrent ? "10" : "8"}
              fontWeight="bold"
              style={{ textShadow: "0 0 3px rgba(0,0,0,0.8)" }}
            >
              #{shot.player.number}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <circle cx="20" cy="258" r="4" fill="#006BB6" stroke="#fff" strokeWidth="1" />
      <text x="28" y="261" fill="#fff" fontSize="9">Made</text>
      <line x1="62" y1="254" x2="70" y2="262" stroke="#C8102E" strokeWidth="2" />
      <line x1="70" y1="254" x2="62" y2="262" stroke="#C8102E" strokeWidth="2" />
      <text x="76" y="261" fill="#fff" fontSize="9">Missed</text>
    </svg>
  );
}

// ── Box Score Table ────────────────────────────────────────────────────────────

function BoxScore({ plays, currentPlayIndex, teamKey, onPlayerSelect, selectedPlayer }) {
  const roster = teamKey === "NYK" ? KNICKS_ROSTER : CLIPPERS_ROSTER;
  const team = TEAMS[teamKey];
  const visiblePlays = plays.filter((_, i) => i <= currentPlayIndex);

  // Compute stats per player
  const stats = {};
  roster.forEach((p) => {
    stats[p.id] = { pts: 0, fgm: 0, fga: 0, threeM: 0, threeA: 0, lastShot: null };
  });

  visiblePlays.forEach((play) => {
    if (play.team !== teamKey) return;
    const s = stats[play.player.id];
    if (!s) return;
    s.fga++;
    if (play.shotType === "3PT") s.threeA++;
    if (play.made) {
      s.fgm++;
      s.pts += play.points;
      if (play.shotType === "3PT") s.threeM++;
    }
    s.lastShot = play;
  });

  return (
    <div className="box-score">
      <div className="box-score-header" style={{ borderLeftColor: team.primaryColor }}>
        <span className="team-abbr" style={{ color: team.primaryColor }}>{team.abbr}</span>
        <span className="team-name">{team.city} {team.name}</span>
      </div>
      <table>
        <thead>
          <tr>
            <th className="player-col">Player</th>
            <th>PTS</th>
            <th>FG</th>
            <th>3PT</th>
            <th>Last Shot</th>
          </tr>
        </thead>
        <tbody>
          {roster.map((player) => {
            const s = stats[player.id];
            const isSelected = selectedPlayer === player.id;
            const fgPct = s.fga > 0 ? ((s.fgm / s.fga) * 100).toFixed(0) : "-";
            return (
              <tr
                key={player.id}
                className={`player-row ${isSelected ? "selected" : ""}`}
                onClick={() => onPlayerSelect(isSelected ? null : player.id)}
                style={isSelected ? { backgroundColor: team.primaryColor + "22" } : {}}
              >
                <td className="player-col">
                  <span className="player-number">#{player.number}</span>
                  <span className="player-name-cell">{player.name}</span>
                  <span className="player-pos">{player.position}</span>
                </td>
                <td className="stat-pts">{s.pts}</td>
                <td>
                  {s.fgm}-{s.fga}
                  <span className="pct">{fgPct}%</span>
                </td>
                <td>
                  {s.threeM}-{s.threeA}
                </td>
                <td className="last-shot-cell">
                  {s.lastShot ? (
                    <span className={s.lastShot.made ? "shot-made" : "shot-missed"}>
                      {s.lastShot.made ? "\u25CF" : "\u2715"} {s.lastShot.shotType}
                    </span>
                  ) : (
                    <span className="no-shot">-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Play-by-Play Feed ──────────────────────────────────────────────────────────

function PlayFeed({ plays, currentPlayIndex }) {
  const feedRef = React.useRef(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [currentPlayIndex]);

  const visiblePlays = plays.filter((_, i) => i <= currentPlayIndex).reverse().slice(0, 20);

  return (
    <div className="play-feed" ref={feedRef}>
      <div className="feed-title">Play-by-Play</div>
      {visiblePlays.map((play, i) => (
        <div
          key={play.id}
          className={`play-item ${i === 0 ? "latest" : ""}`}
        >
          <div className="play-meta">
            <span className="play-quarter">Q{play.quarter}</span>
            <span className="play-time">{play.time}</span>
            <span
              className="play-team-badge"
              style={{ backgroundColor: TEAMS[play.team].primaryColor }}
            >
              {play.team}
            </span>
          </div>
          <div className="play-desc">
            <span className={play.made ? "play-made" : "play-missed"}>
              {play.made ? "\u25CF" : "\u2715"}
            </span>
            {" "}{play.description}
          </div>
          <div className="play-score">
            <span style={{ color: TEAMS.NYK.primaryColor }}>NYK {play.nykScore}</span>
            {" - "}
            <span style={{ color: TEAMS.LAC.primaryColor }}>LAC {play.lacScore}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Scoreboard ─────────────────────────────────────────────────────────────────

function Scoreboard({ currentPlay }) {
  if (!currentPlay) return null;

  return (
    <div className="scoreboard">
      <div className="score-team">
        <div className="score-city">New York</div>
        <div className="score-name" style={{ color: TEAMS.NYK.primaryColor }}>KNICKS</div>
        <div className="score-number" style={{ color: TEAMS.NYK.primaryColor }}>
          {currentPlay.nykScore}
        </div>
      </div>
      <div className="score-middle">
        <div className="score-quarter">Q{currentPlay.quarter}</div>
        <div className="score-time">{currentPlay.time}</div>
        <div className="score-status">
          {currentPlay.quarter === 4 && currentPlay.time.startsWith("0:") ? "FINAL" : "LIVE"}
        </div>
      </div>
      <div className="score-team">
        <div className="score-city">Los Angeles</div>
        <div className="score-name" style={{ color: TEAMS.LAC.primaryColor }}>CLIPPERS</div>
        <div className="score-number" style={{ color: TEAMS.LAC.primaryColor }}>
          {currentPlay.lacScore}
        </div>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────────

const App = () => {
  const [plays] = useState(() => generateGamePlays());
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const advance = useCallback(() => {
    setCurrentPlayIndex((prev) => {
      if (prev >= plays.length - 1) {
        setIsPlaying(false);
        return prev;
      }
      return prev + 1;
    });
  }, [plays.length]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(advance, speed);
    return () => clearInterval(interval);
  }, [isPlaying, speed, advance]);

  const currentPlay = plays[currentPlayIndex];

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentPlayIndex((prev) => Math.min(prev + 1, plays.length - 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentPlayIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    },
    [plays.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">NBA SHOT TRACKER</div>
        <div className="header-sub">Knicks vs Clippers</div>
      </header>

      <Scoreboard currentPlay={currentPlay} />

      <div className="main-layout">
        <div className="court-panel">
          <CourtSVG
            shots={plays}
            selectedPlayer={selectedPlayer}
            currentPlayIndex={currentPlayIndex}
          />

          {/* Playback controls */}
          <div className="controls">
            <button
              className="ctrl-btn"
              onClick={() => setCurrentPlayIndex(0)}
              title="Start"
            >
              &#9198;
            </button>
            <button
              className="ctrl-btn"
              onClick={() => setCurrentPlayIndex((p) => Math.max(p - 1, 0))}
              title="Previous"
            >
              &#9664;
            </button>
            <button
              className="ctrl-btn play-btn"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? "\u23F8" : "\u25B6"}
            </button>
            <button
              className="ctrl-btn"
              onClick={() =>
                setCurrentPlayIndex((p) => Math.min(p + 1, plays.length - 1))
              }
              title="Next"
            >
              &#9654;
            </button>
            <button
              className="ctrl-btn"
              onClick={() => setCurrentPlayIndex(plays.length - 1)}
              title="End"
            >
              &#9197;
            </button>

            <div className="speed-controls">
              <span className="speed-label">Speed:</span>
              {[
                { label: "0.5x", val: 1600 },
                { label: "1x", val: 800 },
                { label: "2x", val: 400 },
                { label: "4x", val: 200 },
              ].map((s) => (
                <button
                  key={s.val}
                  className={`speed-btn ${speed === s.val ? "active" : ""}`}
                  onClick={() => setSpeed(s.val)}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="play-counter">
              {currentPlayIndex + 1} / {plays.length}
            </div>
          </div>

          <div className="keyboard-hint">
            Arrow keys to step &middot; Space to play/pause
          </div>
        </div>

        <div className="side-panel">
          <PlayFeed plays={plays} currentPlayIndex={currentPlayIndex} />
        </div>
      </div>

      <div className="box-scores">
        <BoxScore
          plays={plays}
          currentPlayIndex={currentPlayIndex}
          teamKey="NYK"
          onPlayerSelect={setSelectedPlayer}
          selectedPlayer={selectedPlayer}
        />
        <BoxScore
          plays={plays}
          currentPlayIndex={currentPlayIndex}
          teamKey="LAC"
          onPlayerSelect={setSelectedPlayer}
          selectedPlayer={selectedPlayer}
        />
      </div>

      {selectedPlayer && (
        <div className="filter-banner">
          Filtering court by selected player.{" "}
          <button className="clear-filter" onClick={() => setSelectedPlayer(null)}>
            Clear filter
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
