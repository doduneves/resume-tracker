export function App() {
  function openTracker() {
    const url = chrome.runtime.getURL("src/tracker/index.html");
    void chrome.tabs.create({ url });
  }

  return (
    <main className="popup">
      <h1>Resume Tracker</h1>
      <button type="button" onClick={openTracker}>
        Open tracker
      </button>
    </main>
  );
}
