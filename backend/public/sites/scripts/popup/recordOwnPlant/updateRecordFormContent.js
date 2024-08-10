export function updateRecordFormContent() {
  const recordType = document.getElementById("recordType").value;
  const formContentDiv = document.getElementById("recordFormContent");
  formContentDiv.innerHTML = "";

  switch (recordType) {
    case "height":
      formContentDiv.innerHTML =
        '<label for="height">Height:</label><input type="number" id="height" name="height" required>';
      break;
    case "width":
      formContentDiv.innerHTML =
        '<label for="width">Width:</label><input type="number" id="width" name="width" required>';
      break;
    case "water":
      formContentDiv.innerHTML =
        '<label for="waterAmount">Water Amount:</label><input type="number" id="waterAmount" name="waterAmount" required>';
      break;
    case "nutrient":
      formContentDiv.innerHTML = `
                <label for="nutrientType">Nutrient Type:</label><input type="text" id="nutrientType" name="nutrientType" required><br>
                <label for="amount">Amount:</label><input type="number" id="amount" name="amount" required>
            `;
      break;
    case "rootDevelopment":
      formContentDiv.innerHTML =
        '<label for="observation">Observation:</label><input type="text" id="observation" name="observation" required>';
      break;
    case "image":
      formContentDiv.innerHTML = `
                <label for="url">Image URL:</label><input type="url" id="url" name="url" required><br>
                <label for="description">Description:</label><input type="text" id="description" name="description">
            `;
      break;
    default:
      formContentDiv.innerHTML = "";
      break;
  }
}
