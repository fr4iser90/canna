export function showLoader(loaderElement) {
  if (loaderElement) {
    loaderElement.style.display = "block";
  }
}

export function hideLoader(loaderElement) {
  if (loaderElement) {
    loaderElement.style.display = "none";
  }
}
