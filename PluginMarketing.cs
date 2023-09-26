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
    public class PluginMarketing : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {   //Il contesto di esecuzione è un plugin
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));

            if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity)
            {
                IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
                IOrganizationService service = factory.CreateOrganizationService(context.UserId);

                Entity contact = (Entity)context.InputParameters["Target"];
                Contact postImage = context.PostEntityImages["PostImage"].ToEntity<Contact>();

                bool allowmarketing = postImage.ald_consensoprivacy == true || postImage.ald_mail == true;

                if (allowmarketing) 
                { 
                    Entity Task = new Contact("Task");

                    Task.Id = contact.Id;
                    Task["subject"] = "nuovo task";
                    Task["Description"] = "Task creata all' aggiornarsi dei consensi";

                    service.Create(Task);
                }
            }

        }

    }

}
