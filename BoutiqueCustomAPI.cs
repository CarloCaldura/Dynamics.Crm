using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamics.Crm.Common;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Query;

namespace Dynamics.Crm
{
    public class BoutiqueCustomAPI : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {   //Il contesto di esecuzione è un plugin
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));

            if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity)
            {
                IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
                IOrganizationService service = factory.CreateOrganizationService(context.UserId);

                //Extract the tracing service for use in debugging sandboxed plug-ins.
                ITracingService tracingService =
                    (ITracingService)serviceProvider.GetService(typeof(ITracingService));

                tracingService.Trace("Prima della boutique");
                //Prendo la boutique partendo dal GUID
                Guid boutiqueID = (Guid)context.InputParameters["ald_boutiqueId"];
                //Inizializzo la mia variabile buotiqueTable facendo service.Retrive dell' entità
                var boutiqeuTable = service.Retrieve(ald_boutique.EntityLogicalName, boutiqueID, new ColumnSet("ald_name", "ald_address"));
                tracingService.Trace("Dopo la boutique");


                //Prendo la teamID partendo dal GUID
                Guid teamID = (Guid)context.InputParameters["teamId"];
                //Inizializzo la mia variabile buotiqueTable facendo service.Retrive dell' entità
                var teamTable = service.Retrieve(Team.EntityLogicalName, teamID, new ColumnSet("Name"));
                tracingService.Trace("Dopo la boutique");

                //Condizione query
                ConditionExpression condition1 = new ConditionExpression();
                condition1.AttributeName = "Name";
                condition1.Operator = ConditionOperator.Equal;
                condition1.Values.Add("Boutique Inspector Unit");

                //Filtro della query su teams
                FilterExpression filter1 = new FilterExpression();
                filter1.Conditions.Add(condition1);

                //Inizializzo la mi avariabile teams usando una QueryExpression
                var queryTeam = new QueryExpression("team");
                queryTeam.ColumnSet.AddColumns("Name");
                queryTeam.Criteria.AddCondition("Name", ConditionOperator.Equal, "Boutique Inspector Unit");


                EntityCollection result1 = service.RetrieveMultiple(queryTeam);
                tracingService.Trace("Ritorno risultato");




                // Check se mi trova un team da assegnare alla boutique
                //if queryTeam != nulla

                if (result1 != null && result1.Entities.Count > 0)
                {
                    Entity boutiqueTask = new Entity("task");

                    //boutiqueTask.Id = contact.Id;
                    boutiqueTask["Regarding"] = new EntityReference("ald_boutique");
                    boutiqueTask["OwnerID"] = result1.Entities.FirstOrDefault().ToEntityReference();
                    boutiqueTask["subject"] = "nuovo task";
                    string descriptionMessage = $"Il team {teamTable["Name"]} è stato assegnato alla boutique {boutiqeuTable["ald_name"]}";
                    boutiqueTask["Description"] = descriptionMessage;

                    service.Create(boutiqueTask);
                }
            }

        }

    }

}
