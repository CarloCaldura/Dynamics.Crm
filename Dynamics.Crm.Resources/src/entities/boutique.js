formlogic = {

    formContext: null, // Rendiamo formContext variabile globale con scope valido per tutta formlogic

    onLoad: function (executionContext) {
        formContext = executionContext.getFormContext();
        //let nameAttribute = getAttribute("ald_name");	//Table is Boutique  (controlla se va altrimenti formContext.getAttribute("ald_name"))
        this.makeAddressDefaultValue();
        this.makeAddressReadOnly();
        formContext.getAttribute("statuscode").addOnChange(this.statusReasonReadOnly);
        this.statusReasonReadOnly();
    },

    makeAddressReadOnly: function () {
        formContext.getControl("ald_address").setDisabled(true); //getControl mi permette di modificare il comportamento di un campo nel form
    },

    makeAddressDefaultValue: function () {
        if (formContext.ui.getFormType() === 1) {
            formContext.getAttribute("ald_address").setValue("Via Fontane 93"); //getAttribute mi permette di settare o fare update del valore di un campo
        }
    },

    // when status reason is read only tutti gli altri campi vanno in read only
    statusReasonReadOnly: function () {
        let statusCodeValue = formContext.getAttribute("statuscode").getValue();
        if (statusCodeValue === 748890001) {
            formContext.ui.controls.forEach(
                (control) => {
                    if (control.getName() !== "statuscode") {
                        control.setDisabled(true);
                    }
                }
            );
        } else {
            formContext.ui.controls.forEach(
                (control) => {
                    if (control.getName() !== "ald_address") {
                        control.setDisabled(false);
                    }
                }
            );
        }
    },

    command: function (executionContext) {
        debugger;
        if (executionContext != null) {
            let id = executionContext.data.entity.getId();
            var execute_ald_boutiqueTask_Request = {

                // Parameters
                ald_boutiqueId: { guid: id }, //Edm.Guid
                getMetadata: function () {
                    return {
                        boundParameter: null,
                        parameterTypes: {
                            ald_boutiqueId: { typeName: "Edm.Guid", structureProperty: 1 }
                        },
                        operationType: 0, operationName: "ald_boutiqueTask"
                    };
                }
            };

            Xrm.WebApi.execute(execute_ald_boutiqueTask_Request).then(
                function success(response) {
                    if (response.ok) { console.log("Success"); }
                }
            ).catch(function (error) {
                console.log(error.message);
            });
        }
    }
}

