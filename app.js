import { app, query } from 'mu';

app.get('/bestuurseenheid-data', async function(req, res) {
  const bestuurseenheid = req.query.bestuurseenheid;
  const filterAangifteplichtig = req.query.filterAangifteplichtig === 'true';

  if (!bestuurseenheid) {
    return res.status(400).send('Missing bestuurseenheid parameter');
  }

  const sparqlQuery = `
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
    PREFIX persoon: <http://data.vlaanderen.be/ns/persoon#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX org: <http://www.w3.org/ns/org#>
    PREFIX adms: <http://www.w3.org/ns/adms#>
    PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>

    SELECT DISTINCT ?voornaam ?achternaam ?geboortedatum ?geslacht ?rrn ?bestuursorgaanTijdsspecialisatieLabel ?rolLabel ?statusLabel ?startdatum ?einddatum # ?mandataris ?person ?identifier ?holds_mandaat ?rol ?bestuursorgaanTijdsspecialisatie ?bestuursorgaanPermanent ?PubliekeOrganisatie
    WHERE {

        # Main query for fetching mandataris details
        ?mandataris a mandaat:Mandataris .
        ?mandataris mandaat:isBestuurlijkeAliasVan ?person .
        ?mandataris mandaat:start ?startdatum .
        ?mandataris mandaat:status ?status .

        ?mandataris org:holds ?holds_mandaat .
        ?holds_mandaat org:role ?rol . 
        ?rol skos:prefLabel ?rolLabel .

        ?bestuursorgaanTijdsspecialisatie org:hasPost ?holds_mandaat . 
        ?bestuursorgaanTijdsspecialisatie mandaat:isTijdspecialisatieVan ?bestuursorgaanPermanent .
        ?bestuursorgaanPermanent skos:prefLabel ?bestuursorgaanTijdsspecialisatieLabel .
        ?bestuursorgaanPermanent besluit:bestuurt ?PubliekeOrganisatie .
        
        OPTIONAL { ?person persoon:gebruikteVoornaam ?voornaam . }
        OPTIONAL { ?person foaf:familyName ?achternaam . }
        OPTIONAL { ?status skos:prefLabel ?statusLabel . }
        OPTIONAL { ?person persoon:heeftGeboorte/persoon:datum ?geboortedatum . }
        OPTIONAL { ?person persoon:geslacht ?geslacht . }
        OPTIONAL { ?mandataris mandaat:einde ?einddatum . }

        OPTIONAL { ?person adms:identifier ?identifier . 
                  OPTIONAL { ?identifier skos:notation ?rrn . }
        }

        FILTER (?PubliekeOrganisatie = <${bestuurseenheid}>)
        FILTER NOT EXISTS {
          ?bestuursorgaanPermanent besluit:classificatie <http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/4955bd72cd0e4eb895fdbfab08da0284>
        }

        # Subquery to identify persons with aangifteplichtig mandaten
          ${filterAangifteplichtig ? `
          {
              SELECT DISTINCT ?person WHERE {
                  ?mandataris a mandaat:Mandataris .
                  ?mandataris mandaat:isBestuurlijkeAliasVan ?person .
                  ?mandataris org:holds ?aangifteplichtigMandaat .
                  ?aangifteplichtigMandaat org:role ?aangifteplichtigRol .
                  ?aangifteplichtigRol skos:prefLabel ?aangifteplichtigRolLabel .
                  FILTER (
                    ?aangifteplichtigRolLabel IN ("Burgemeester", "Schepen") ||
                    (REGEX(?aangifteplichtigRolLabel, "Voorzitter", "i") && 
                      !REGEX(?aangifteplichtigRolLabel, "Voorzitter van de gemeenteraad", "i"))
                  )
              }
          }
          FILTER EXISTS {
              ?mandataris mandaat:isBestuurlijkeAliasVan ?person .
          }
          ` : ''}

    } 
    ORDER BY ?bestuursorgaanTijdsspecialisatieLabel ?rolLabel ?achternaam ?voornaam ?startdatum



  `;

  try {
    const response = await query(sparqlQuery);
    res.json(response); 
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while fetching SPARQL query.');
  }
});