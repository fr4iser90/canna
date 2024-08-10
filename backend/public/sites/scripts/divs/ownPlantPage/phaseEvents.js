import { toggleVisibility } from "../../utils/utils.js";

export function updatePhaseEvents(phaseEvents) {
    const phaseEventsFrame = document.querySelector(".phase-events-frame");
    if (phaseEvents) {
        const phaseEventsList = phaseEventsFrame.querySelector("ul");
        if (phaseEventsList) {
            phaseEventsList.innerHTML = ""; // Clear existing content
            console.log("test");
            phaseEvents.forEach(event => {
                const listItem = document.createElement("li");
                listItem.textContent = `${event.phase}: ${new Date(event.start).toLocaleDateString()} - ${new Date(event.end).toLocaleDateString()}`;
                phaseEventsList.appendChild(listItem);
            });

            toggleVisibility(".phase-events-frame", true);
        }
    } else {
        toggleVisibility(".phase-events-frame", false);
    }
}
