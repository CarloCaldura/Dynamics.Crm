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

        debugger;

        let fetchXml = `
                        <fetch>
                          <entity name="ald_boutique">
                            <attribute name="ald_boutiqueid" />
                            <attribute name="ald_name" />
                            <filter>
                              <condition attribute="ald_name" operator="eq" value="Default boutique" />
                            </filter>
                          </entity>
                        </fetch>`

        fetchXml = "?fecthXml= " + encodeURIComponent(fetchXml);

        // Inizializza variabili così il codice è riutilizzabile
        let entityName = "ald_boutique";
        let columnName = "ald_name";
        let defaultValue = "Default boutique";

        //Query OData
        //var query = "?$filter= " + columnName + " eq '" + defaultValue + "'";

        // Use Web Api to retrive the record
        window.Xrm.WebApi.retrieveMultipleRecords(entityName, fetchXml).then(
            function success(result) {
                if (result.entities.lenght != null && result.entities.lenght > 0) {

                    let recordid = result.entities[0]["ald_boutiqueid"];
                    let recordName = result.entities[0]["ald_name"];

                    let lookup = new Array();
                    lookup[0] = new Object();
                    lookup[0]["id"] = recordid;
                    lookup[0]["name"] = recordName;
                    lookup[0]["entityType"] = entityName;

                    formContext.getAttribute("ald_originating_boutique").setValue(lookup);

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