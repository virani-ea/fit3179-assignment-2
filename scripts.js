function embedVis(elementId, specUrl) {
      vegaEmbed(`#${elementId}`, specUrl, { actions: false }).catch(console.error);
    }

// Load all visualisations
embedVis('vis1', 'population_density.vg.json');
embedVis('vis2', 'state_hospital.vg.json');
embedVis('vis3', 'vic_lga_seifa.vg.json');
// embedVis('vis4', 'scatter_seifa_density.vg.json');
// embedVis('vis5', 'admissions_trend.vg.json');