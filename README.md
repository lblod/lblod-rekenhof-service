# lblod-rekenhof-api
 A microservice part of app-lokaal-mandatenbeheer:
 https://github.com/lblod/app-lokaal-mandatenbeheer

 Built using the mu-semtech stack:
 https://github.com/mu-semtech

 This service has a single endpoint:
 GET /bestuurseenheid-data
    Query parameters:
        - bestuurseenheid (required): The URI of the "bestuurseenheid" for which the data is being requested.
        (this is taken from the logged in "bestuurseenheid" in the frontend)

        - filterAangifteplichtig (required): boolean that activates or deactivates a subquery that filters the results to only show "mandatarissen"
        with at least 1 "aangifteplichtig" "mandaat"


    Returned Data columns:
    - voornaam
    - achternaam
    - geboortedatum
    - geslacht
    - rrn
    - bestuursorgaanTijdsspecialisatieLabel (eg. "College van Burgemeester en Schepenen Aalst")
    - rol (eg. "Burgemeester")
    - statusLabel (eg. "Effectief")
    - startdatum
    - einddatum (if applicable)

 




