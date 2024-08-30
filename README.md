# lblod-rekenhof-api

A microservice part of app-lokaal-mandatenbeheer:
[https://github.com/lblod/app-lokaal-mandatenbeheer](https://github.com/lblod/app-lokaal-mandatenbeheer)

Built using the mu-semtech stack:
[https://github.com/mu-semtech](https://github.com/mu-semtech)

## Endpoint

### GET /bestuurseenheid-data

#### Query Parameters:
- `bestuurseenheid` (required): The URI of the "bestuurseenheid" for which the data is being requested. (This is taken from the logged in "bestuurseenheid" in the frontend)
- `filterAangifteplichtig` (required): Boolean that activates or deactivates a subquery that filters the results to only show "mandatarissen" with at least 1 "aangifteplichtig" "mandaat". (it still returns all of their other mandates, as long as they have 1 aangifteplichtig mandaat)

#### Returned Data Columns:
- `voornaam`
- `achternaam`
- `geboortedatum`
- `geslacht`
- `rrn`
- `bestuursorgaanTijdsspecialisatieLabel` (e.g., "College van Burgemeester en Schepenen Aalst")
- `rol` (e.g., "Burgemeester")
- `statusLabel` (e.g., "Effectief")
- `startdatum`
- `einddatum` (if applicable)


#### Aangifteplichtige mandaten

Mandaten currently treated as aangifteplichtig are `Schepen` , `Burgemeester` and any `Voorzitter` EXCEPT `Voorzitter van de gemeenteraad`
(-> voorzitters of OCMW)