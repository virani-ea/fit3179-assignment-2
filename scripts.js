function embedVis(elementId, specUrl) {
  // Must return the vegaEmbed promise for chaining!
  return vegaEmbed(`#${elementId}`, specUrl, { actions: false }).catch(console.error);
}

let mapView, lollipopView;

// Load all visualisations
embedVis('vis1', 'population_density.vg.json');
embedVis('vis2', 'state_hospital.vg.json');

// Embed the SEIFA map (choropleth) and store the view
embedVis('vis3', 'vic_lga_seifa.vg.json').then(result => {
  mapView = result.view;

  // After map is embedded, embed the lollipop chart and store the view
  embedVis('vis4', 'lollipop_ambulance_response.vg.json').then(result => {
    lollipopView = result.view;

    // Function to sync selection
    function updateLollipopSelection() {
    const selectedDeciles = mapView.signal('decile_filter');
    console.log('Selection:', selectedDeciles);

    // Pull single value as string and use '' as default if none selected
    const value = (
      selectedDeciles &&
      selectedDeciles.Decile &&
      selectedDeciles.Decile.length > 0
    ) ? String(selectedDeciles.Decile[0]) : '';

    lollipopView.signal('DecileSel', value).run();
    }


    // Listen for selection changes on the map and update lollipop chart
    mapView.addSignalListener('decile_filter', updateLollipopSelection);

    // Example URL: use the same CSV your Vega chart uses
    const csvUrl = "https://raw.githubusercontent.com/virani-ea/fit3179-assignment-2/refs/heads/main/data/lga_seifa_indexes_vic.csv";

    // 1. Fetch and parse the CSV
    Papa.parse(csvUrl, {
        download: true,
        header: true,
        complete: function(results) {
            const lgaScores = {};
            const lgas = [];
            // Build lookup and list for dropdown
            results.data.forEach(row => {
                const lga = row.LGA_name && row.LGA_name.trim();
                // Only include if lga is defined and not empty
                if (lga) {
                    lgas.push(lga);
                    lgaScores[lga] = {
                        score: row.Score,
                        decile: row.Decile
                    };
                }
            });

            // Now fill the dropdown as before
            const select = document.getElementById('lga-search');
            lgas.forEach(lga => {
                const option = document.createElement('option');
                option.value = lga;
                option.textContent = lga;
                select.appendChild(option);
            });

            // Event listener to show decile/score
            select.addEventListener('change', function() {
                const lga = select.value;
                const output = document.getElementById('lga-seifa-output');
                if (lga && lgaScores[lga]) {
                    output.textContent = `Your LGA SEIFA decile is ${lgaScores[lga].decile} (Score: ${lgaScores[lga].score})`;
                } else {
                    output.textContent = '';
                }
            });
        }
    });

  });
});

// embedVis('vis5', 'admissions_trend.vg.json');
