export function generatePlantHtml(plant) {
    return `
      <h3>${plant.name} (${plant.genetics})</h3>
      <p><strong>Growth Method:</strong> ${plant.growthMethod === 'seed' ? 'Seed' : 'Cutting'}</p>
      <p><strong>Age:</strong> ${plant.age} days</p>
      ${plant.isMotherPlant ? `<p><strong>Mother Plant</strong></p><p><strong>Children:</strong> ${plant.childrenPlants.length}</p>` : ''}
      <p><strong>Current Phase:</strong> ${plant.plantPhase}</p>
    `;
  }
  
  export function generatePlantDetailsHtml(plant) {
    let archiveButtonHtml = '';
    if (plant.currentPhase === 'harvested' || plant.currentPhase === 'died') {
      archiveButtonHtml = '<button id="archiveButton">Archive Plant</button>';
    }
  
    return `
      <p><strong>THC:</strong> ${plant.thc}</p>
      <p><strong>CBD:</strong> ${plant.cbd}</p>
      <p><strong>Height:</strong> ${plant.height}</p>
      <p><strong>Description:</strong> ${plant.description}</p>
      <p><strong>Grow Difficulty:</strong> ${plant.grow_difficulty}</p>
      <p><strong>Flowering Type:</strong> ${plant.flowering_type}</p>
      <p><strong>Flowering Time:</strong> ${plant.flowering_time} Weeks</p>
      <p><strong>Harvest Time:</strong> ${plant.harvest_time}</p>
      <p><strong>Yield Indoor:</strong> ${plant.yield_indoor}</p>
      <p><strong>Yield Outdoor:</strong> ${plant.yield_outdoor}</p>
      <p><strong>Height Indoor:</strong> ${plant.height_indoor}</p>
      <p><strong>Height Outdoor:</strong> ${plant.height_outdoor}</p>
      ${archiveButtonHtml}
      <button id="manageButton">Manage Plant</button>
    `;
  }
  
  export function generateStrainHtml(strain) {
    return `
      <h3>${strain.name} (${strain.genetics})</h3>
    `;
  }
  
  export function generateStrainDetailsHtml(strain) {
    return `
      <p><strong>THC:</strong> ${strain.thc || "N/A"}</p>
      <p><strong>CBD:</strong> ${strain.cbd || "N/A"}</p>
      <p><strong>Effects:</strong> ${strain.effects || "N/A"}</p>
      <p><strong>Description:</strong> ${strain.description || "N/A"}</p>
      <p><strong>Grow Difficulty:</strong> ${strain.grow_difficulty || "N/A"}</p>
      <p><strong>Flowering Type:</strong> ${strain.flowering_type || "N/A"}</p>
      <p><strong>Flowering Time:</strong> ${strain.flowering_time || "N/A"}</p>
      <p><strong>Harvest Time:</strong> ${strain.harvest_time || "N/A"}</p>
      <p><strong>Yield Indoor:</strong> ${strain.yield_indoor || "N/A"}</p>
      <p><strong>Yield Outdoor:</strong> ${strain.yield_outdoor || "N/A"}</p>
      <p><strong>Height Indoor:</strong> ${strain.height_indoor || "N/A"}</p>
      <p><strong>Height Outdoor:</strong> ${strain.height_outdoor || "N/A"}</p>
    `;
  }
  