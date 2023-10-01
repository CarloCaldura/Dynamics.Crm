// Use Window.Xrm.WebApi

formlogic = {

    formContext: null,

    onLoad: function (executionContext) {
        formContext = executionContext.getFormContext();
        //valorizzare boutique con una default boutique e quando il form contact è in create valorizzare la boutique con la default boutique
        if (formContext.ui.getFormType() === 1) {
            //chiama funzione
            this.assignDefaultBoutique();
        }
    },

    //funzione per assegnare default boutique a contact quando viene creato
    assignDefaultBoutique: function () {

        let fetchXml = `
                        <fetch>
                          <entity name="ald_boutique">
                            <attribute name="ald_name" />
                            <attribute name="ald_boutiqueid" />
                            <filter>
                              <condition attribute="ald_name" operator="eq" value="Default boutique" />
                            </filter>
                          </entity>
                        </fetch>`

        requestFetchXml = "?fecthXml= " + encodeURIComponent(fetchXml);

        // Inizializza variabili così il codice è riutilizzabile
        let entityName = "ald_boutique";
        let columnName = "ald_name";
        let defaultValue = "Default boutique";

        //Query OData
        var query = "?$filter= " + columnName + " eq '" + defaultValue + "'";

        // Use Web Api to retrive the record
        window.Xrm.WebApi.retrieveMultipleRecords(entityName, query).then(
            function success(result) {
                if (result.entities != null && result.entities.length > 0) {

                    let recordId = result.entities[0][entityName + "id"];
                    let recordName = result.entities[0]["ald_name"];

                    let lookupFieldName = "ald_originating_boutique"

                    let lookup = new Array();

                    lookup[0] = new Object();
                    lookup[0]["id"] = recordId;
                    lookup[0]["entityType"] = entityName;
                    lookup[0]["name"] = recordName;

                    formContext.getAttribute(lookupFieldName).setValue(lookup)

                }
                else {
                    console.log("Resul entities lenght is equal to " + result.entities.lenght);
                }
            },
            function error(error) {
                console.log(error.message);
            }
        );
    }
}