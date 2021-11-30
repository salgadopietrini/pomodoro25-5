import React, { useState, useEffect } from "react";

const fractionsOfSecond = 1000;
const initSessionTime = 1500;
const initBreakTime = 300;
const timePerInput = 60;

function App() {
  const [time, setTime] = useState({
    session: initSessionTime,
    break: initBreakTime,
  });
  const [input, setInput] = useState({
    session: 25,
    break: 5,
  });
  const [period, setPeriod] = useState("Start a session!");
  const [run, setRun] = useState(false);
  const [clock, setClock] = useState("25:00");
  const [timeoutID, setTimeoutID] = useState("");

  const alarm =
    "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav";

  const min = (time) => {
    const min = Math.floor(time / 60);
    return min < 1 ? "00" : min < 10 ? "0" + min : min;
  };

  const sec = (time) => {
    const sec = Math.floor(time % 60);
    return sec < 1 ? "00" : sec < 10 ? "0" + sec : sec;
  };

  const myTimeout = (period) => {
    setTimeoutID(
      setTimeout(
        () =>
          setTime((state) => ({
            ...state,
            [period]: state[period] - 1,
          })),
        fractionsOfSecond
      )
    );
  };

  const play = () => {
    const audio = document.getElementById("beep");
    audio.play();
  };
  const pause = () => {
    const audio = document.getElementById("beep");
    audio.currentTime = 0;
    audio.pause();
  };

  useEffect(() => {
    const timeFormat = (time) => {
      return time >= 0 ? min(time) + ":" + sec(time) : "00:00";
    };
    const clockFormat = (period) => {
      return time[period] >= 0
        ? timeFormat(time[period])
        : timeFormat(input[period] * timePerInput);
    };

    if (clock === "00:00") {
      play();
    }

    if (run && time.session >= 0) {
      setPeriod("Session");
      setClock(clockFormat("session"));
      myTimeout("session");
    } else if (run && time.break >= 0) {
      setPeriod("Break");
      setClock(clockFormat("break"));
      myTimeout("break");
    } else if (run) {
      setTime({
        session: input.session * timePerInput,
        break: input.break * timePerInput,
      });
    } else if (time.session >= 0) {
      setClock(clockFormat("session"));
    } else {
      setClock(clockFormat("break"));
    }
  }, [time, input, run]);

  const handleIncrement = (type, direction) => {
    if (!run) {
      setInput((state) => ({
        ...state,
        [type]:
          direction === "increment" && state[type] < 60
            ? state[type] + 1
            : direction === "decrement" && state[type] > 1
            ? state[type] - 1
            : state[type],
      }));
      setTime((state) => ({
        ...state,
        [type]:
          direction === "increment" && state[type] < 60 * timePerInput
            ? state[type] + timePerInput
            : direction === "decrement" && state[type] > timePerInput
            ? state[type] - timePerInput
            : state[type],
      }));
    }
  };

  const handleStart = () => {
    if (run) {
      clearTimeout(timeoutID);
      setRun(!run);
    } else if (
      time.session !== input.session * timePerInput ||
      time.break !== input.break * timePerInput
    ) {
      setRun(true);
    } else {
      setRun(true);
      setTime({
        session: input.session * timePerInput,
        break: input.break * timePerInput,
      });
    }
  };

  const handleReset = () => {
    clearTimeout(timeoutID);
    pause();
    setTimeoutID("");
    setRun(false);
    setTime({
      session: initSessionTime,
      break: initBreakTime,
    });
    setInput({
      session: 25,
      break: 5,
    });
    setPeriod("Start a session!");
    setClock("25:00");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          borderRadius: "25px",
          backgroundColor: "grey",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "40vw",
          padding: "25px",
          fontSize: "1.5em",
          color: "white",
        }}
      >
        <h1>Pomodoro 25+5</h1>
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              margin: "10px",
            }}
          >
            <div id="break-label">Break Length</div>
            <div style={{ display: "flex", flexDirection: "row-reverse" }}>
              <button
                type="button"
                className="btn btn-secondary"
                id="break-increment"
                onClick={() => handleIncrement("break", "increment")}
                style={{ margin: "2.5px" }}
              >
                +
              </button>
              <div id="break-length">{input.break}</div>
              <button
                type="button"
                className="btn btn-secondary"
                id="break-decrement"
                onClick={() => handleIncrement("break", "decrement")}
                style={{ margin: "2.5px" }}
              >
                -
              </button>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              margin: "10px",
            }}
          >
            <div id="session-label">Session Length</div>
            <div style={{ display: "flex", flexDirection: "row-reverse" }}>
              <button
                type="button"
                className="btn btn-secondary"
                id="session-increment"
                onClick={() => handleIncrement("session", "increment")}
                style={{ margin: "2.5px" }}
              >
                +
              </button>
              <div id="session-length">{input.session}</div>
              <button
                type="button"
                className="btn btn-secondary"
                id="session-decrement"
                onClick={() => handleIncrement("session", "decrement")}
                style={{ margin: "2.5px" }}
              >
                -
              </button>
            </div>
          </div>
        </div>

        <div id="timer-label">{period}</div>
        <div id="time-left">{clock}</div>
        <div style={{ margin: "10px" }}>
          <button
            type="button"
            className="btn btn-secondary"
            id="start_stop"
            onClick={handleStart}
            style={{ margin: "2.5px" }}
          >
            {run
              ? "Stop"
              : time.session !== input.session * timePerInput ||
                time.break !== input.break * timePerInput
              ? "Continue"
              : "Start!"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            id="reset"
            onClick={handleReset}
            style={{ margin: "2.5px" }}
          >
            Reset!
          </button>
        </div>
      </div>
      <audio src={alarm} id="beep" preload="auto" />
    </div>
  );
}

export default App;
