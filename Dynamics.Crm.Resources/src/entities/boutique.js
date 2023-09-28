formlogic = {

	onLoad: function (executionContext) {
		let formContext = executionContext.getFormContext();
		let nameAttribute = formContext.getAttribute("ald_name");	//Table is Boutique
		makeAddressDefaultValue(formContext);
		makeAddressReadOnly(formContext);
		debugger;
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

function makeAddressReadOnly(formContext) {
	formContext.getControl("ald_address").setDisabled(true);
}

function makeAddressDefaultValue(formContext) {
	formContext.getAttribute("ald_address").setValue("Via Fontane 93");
}