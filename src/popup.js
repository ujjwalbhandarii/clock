const timezoneSelect = document.getElementById("timezone-select");
const addClockBtn = document.getElementById("add-clock-btn");
const clockList = document.getElementById("clock-list");

const updateClocks = () => {
  clockList.innerHTML = "";
  chrome.storage.sync.get("clocks", ({ clocks }) => {
    if (!clocks) return;

    clocks.forEach(({ timezone, id }) => {
      const clockItem = document.createElement("div");
      clockItem.className = "clock-item";
      clockItem.id = id;

      const timezoneLabel = document.createElement("span");
      timezoneLabel.textContent = timezone;

      const timeDisplay = document.createElement("span");

      const updateClockTime = () => {
        const now = new Date();
        const localTime = now.toLocaleString("en-US", { timeZone: timezone });
        timeDisplay.textContent = localTime;
      };

      updateClockTime();
      setInterval(updateClockTime, 1000);

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.onclick = () => {
        chrome.storage.sync.get("clocks", ({ clocks }) => {
          const updatedClocks = clocks.filter((clock) => clock.id !== id);
          chrome.storage.sync.set({ clocks: updatedClocks }, updateClocks);
        });
      };

      clockItem.appendChild(timezoneLabel);
      clockItem.appendChild(timeDisplay);
      clockItem.appendChild(removeBtn);
      clockList.appendChild(clockItem);
    });
  });
};

addClockBtn.onclick = () => {
  const timezone = timezoneSelect.value;
  const id = `clock-${Date.now()}`;
  chrome.storage.sync.get("clocks", ({ clocks }) => {
    const updatedClocks = clocks
      ? [...clocks, { timezone, id }]
      : [{ timezone, id }];
    chrome.storage.sync.set({ clocks: updatedClocks }, updateClocks);
  });
};

document.addEventListener("DOMContentLoaded", updateClocks);
