using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Microsoft.Bot.Schema;

namespace Microsoft.Bot.Builder.Dialogs
{
    public static class DialogContextOAuthExtensions
{
        public static Task<TokenResponse> GetUserTokenAsync(this IDialogContext context, string connectionName)
        {
            return ConnectorClientOAuthExtensions.GetUserTokenAsync(null, context.Activity, connectionName);
        }

        public static Task<TokenResponse> GetUserTokenAsync(this IDialogContext context, string connectionName, string magicCode)
        {
            return ConnectorClientOAuthExtensions.GetUserTokenAsync(null, context.Activity, connectionName, magicCode);
        }

        public static Task<bool> SignOutUserAsync(this IDialogContext context, string connectionName)
        {
            return ConnectorClientOAuthExtensions.SignOutUserAsync(null, context.Activity, connectionName);
        }
    }
}
