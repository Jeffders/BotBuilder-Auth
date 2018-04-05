using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Bot.Schema;
using Newtonsoft.Json.Linq;

namespace Microsoft.Bot.Connector
{
    public static class ActivityOAuthExtensions
    {
        public static bool IsTokenResponseEvent(this Activity activity)
        {
            return activity.Type == ActivityTypes.Event && activity.Name == TokenOperations.TokenResponseOperationName;
        }

        public static TokenResponse ReadTokenResponseContent(this Activity activity)
        {
            if (IsTokenResponseEvent(activity))
            {
                var content = activity.Value as JObject;
                if (content != null)
                {
                    var tokenResponse = content.ToObject<TokenResponse>();
                    return tokenResponse;
                }
            }
            return null;
        }
    }
}
