using System;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using Microsoft.Bot.Connector;

namespace Microsoft.Bot.Schema
{
    /// <summary>
    /// A card representing a request to peform a sign in via OAuth
    /// </summary>
    public class OAuthCard
    {
        /// <summary>
        /// Content-type for a OAuthCard
        /// </summary>
        public const string ContentType = "application/vnd.microsoft.card.oauth";

        /// <summary>
        /// Text for signin request
        /// </summary>
        public string Text { get; set; }

        /// <summary>
        /// The name of the registered connection
        /// </summary>
        public string ConnectionName { get; set; }

        /// <summary>
        /// Action to use to perform signin
        /// </summary>
        public CardAction[] Buttons { get; set; }

        /// <summary>
        /// Extension data for overflow of properties
        /// </summary>
        [JsonExtensionData(ReadData = true, WriteData = true)]
        public JObject Properties { get; set; } = new JObject();
    }
}
