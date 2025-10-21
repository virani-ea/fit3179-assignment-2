function embedVis(elementId, specUrl) {
  // Must return the vegaEmbed promise for chaining!
  return vegaEmbed(`#${elementId}`, specUrl, { actions: false }).catch(console.error);
}


embedVis('vis1', 'population_density.vg.json');
embedVis('vis2', 'state_hospital.vg.json');

// Embed the SEIFA map (choropleth) and store the view
embedVis('vis3', 'vic_lga_seifa.vg.json').then(result => {

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

            // Fill the dropdown as before
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
                    output.textContent = `${lga}'s SEIFA decile is ${lgaScores[lga].decile}`;
                } else {
                    output.textContent = '';
                }
            });
        }
    });

  });
;
embedVis('vis4', 'boxplot_response_times.vg.json');
embedVis('vis5', 'scatter_hospital_density_decile.vg.json');
