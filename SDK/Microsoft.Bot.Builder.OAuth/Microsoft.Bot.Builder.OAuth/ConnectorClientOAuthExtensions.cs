using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Builder.OAuth;
using Microsoft.Bot.Connector;
using Microsoft.Bot.Schema;

namespace Microsoft.Bot.Connector
{
    public static class ConnectorClientOAuthExtensions
    {
        public static Task<TokenResponse> GetUserTokenAsync(this ConnectorClient connectorClient, IActivity activity, string connectionName)
        {
            var userId = activity.From.Id;
            var client = new OAuthApiClient(new MicrosoftAppCredentials());
            return client.GetUserTokenAsync(userId, connectionName);
        }

        public static Task<TokenResponse> GetUserTokenAsync(this ConnectorClient connectorClient, IActivity activity, string connectionName, string magicCode)
        {
            var userId = activity.From.Id;
            var client = new OAuthApiClient(new MicrosoftAppCredentials());
            return client.GetUserTokenAsync(userId, connectionName, magicCode);
        }

        public static Task<bool> SignOutUserAsync(this ConnectorClient connectorClient, IActivity activity, string connectionName)
        {
            var userId = activity.From.Id;
            var client = new OAuthApiClient(new MicrosoftAppCredentials());
            return client.SignOutUserAsync(userId, connectionName);
        }
    }
}
