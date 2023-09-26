using System;
using System.Collections.Generic;
using System.IdentityModel.Metadata;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamics.Crm;
using Dynamics.Crm.Common;
using Microsoft.Xrm.Sdk;

namespace Dynamics.Crm
{
    public class BasicPlugin : IPlugin
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

                tracingService.Trace("Prima del contatto");
                Entity cnt = (Entity)context.InputParameters["Target"];
                tracingService.Trace("Dopo del contatto");

                tracingService.Trace("Prima del PreImage");
                Contact preImage = context.PreEntityImages["PreImage"].ToEntity<Contact>();
                tracingService.Trace("Dopo del PreImage");

                tracingService.Trace("Prima del PostImage");
                Contact postImage = context.PostEntityImages["PostImage"].ToEntity<Contact>();
                tracingService.Trace("Dopo del PostImage");

                //Condizione
                if (preImage.ald_Originating_Boutique != null && postImage.ald_Originating_Boutique == null)
                {
                    Contact contactToUpdate = new Contact();

                    contactToUpdate.Id = cnt.Id;
                    contactToUpdate.ald_mail = false;
                    contactToUpdate.ald_sms = false;
                    contactToUpdate.ald_consensoprivacy = false;

                    tracingService.Trace("prima dell' update");
                    service.Update(contactToUpdate);
                    tracingService.Trace("dopo dell' update");
                }

            }
        }
    }
}
