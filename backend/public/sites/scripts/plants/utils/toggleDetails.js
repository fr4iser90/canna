export function toggleDetails(element, detailsHtml, detailsClass) {
  let detailsDiv = element.querySelector(`.${detailsClass}`);
  if (detailsDiv) {
    detailsDiv.remove();
  } else {
    detailsDiv = document.createElement("div");
    detailsDiv.classList.add(detailsClass);
    detailsDiv.innerHTML = detailsHtml;
    element.appendChild(detailsDiv);
  }
}
