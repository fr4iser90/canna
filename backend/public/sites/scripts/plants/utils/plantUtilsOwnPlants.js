export function createPlantElement(plant) {
  const plantElement = document.createElement("div");
  plantElement.className = "plant";
  plantElement.innerHTML = `
        <h3>${plant.name}</h3>
        <p>Phase: ${plant.plantPhase}</p>
        <p>Sprouted: ${plant.sproutedAt}</p>
        <button class="edit-button" data-id="${plant.id}">Edit</button>
        <button class="delete-button" data-id="${plant.id}">Delete</button>
    `;
  return plantElement;
}

export function createEditForm(plant) {
  const form = document.createElement("form");
  form.innerHTML = `
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" value="${plant.name}" required>
        <label for="plantPhase">Phase:</label>
        <input type="text" id="plantPhase" name="plantPhase" value="${plant.plantPhase}" required>
        <label for="sproutedAt">Sprouted Date:</label>
        <input type="date" id="sproutedAt" name="sproutedAt" value="${plant.sproutedAt}" required>
        <button type="submit">Save</button>
        <button type="button" id="cancelEdit">Cancel</button>
    `;

  form.querySelector("#cancelEdit").addEventListener("click", () => {
    document.getElementById("editFormContainer").style.display = "none";
  });

  return form;
}

export function createPlantDetailElement(plant) {
  const plantDetailElement = document.createElement("div");

  plantDetailElement.innerHTML = `
        <div class="detail-section">
            <h3>Basic Information</h3>
            <p>Name: ${plant.name}</p>
            <p>Genetics: ${plant.genetics}</p>
            <p>THC: ${plant.thc}</p>
            <p>CBD: ${plant.cbd}</p>
            <p>Sprouted At: ${plant.sproutedAt}</p>
            <p>Rooted At: ${plant.rootedAt}</p>
            <p>Growth Method: ${plant.growthMethod}</p>
            <p>Flowering Type: ${plant.flowering_type}</p>
            <p>Flowering Time: ${plant.flowering_time}</p>
            <p>Is Mother Plant: ${plant.isMotherPlant}</p>
            <p>Growing Environment: ${plant.growing_environment}</p>
            <p>Harvest Yield: ${plant.harvestyield}</p>
            <p>Substrate: ${plant.substrate}</p>
            <p>Fertilizer: ${plant.fertilizer}</p>
            <p>Seed Type: ${plant.seedtype}</p>
            <p>Phase: ${plant.plantPhase}</p>
            <p>Phase Start Date: ${plant.phaseStartDate}</p>
        </div>
        ${createDetailTable("Height Records", plant.heightRecords, [
          "Date",
          "Height",
        ])}
        ${createDetailTable("Width Records", plant.widthRecords, [
          "Date",
          "Width",
        ])}
        ${createDetailTable("Water Records", plant.waterRecords, [
          "Date",
          "Water Amount",
        ])}
        ${createDetailTable("Nutrient Records", plant.nutrientRecords, [
          "Date",
          "Nutrient Type",
          "Amount",
        ])}
        ${createDetailTable("Root Development", plant.rootDevelopment, [
          "Date",
          "Observation",
        ])}
        ${createDetailTable("Harvest Weights", plant.harvestWeights, [
          "Quality",
          "Weight",
        ])}
        ${createDetailTable(
          "Growth Conditions",
          [plant.growthConditions],
          [
            "Temperature",
            "Humidity",
            "Light Intensity",
            "CO2 Level",
            "pH Level",
            "Air Movement",
          ],
        )}
        <div class="detail-section">
            <h3>Observations</h3>
            <p>${plant.observations}</p>
        </div>
        <div class="detail-section">
            <h3>Diseases</h3>
            <p>${plant.diseases}</p>
        </div>
    `;

  return plantDetailElement;
}

function createDetailTable(title, records, headers) {
  if (!records || records.length === 0) {
    return "";
  }

  let table = `
        <div class="detail-section">
            <h3>${title}</h3>
            <table>
                <thead>
                    <tr>
                        ${headers
                          .map((header) => `<th>${header}</th>`)
                          .join("")}
                    </tr>
                </thead>
                <tbody>
                    ${records
                      .map(
                        (record) => `
                        <tr>
                            ${headers
                              .map(
                                (header) =>
                                  `<td>${record[header.toLowerCase()]}</td>`,
                              )
                              .join("")}
                        </tr>
                    `,
                      )
                      .join("")}
                </tbody>
            </table>
        </div>
    `;

  return table;
}
