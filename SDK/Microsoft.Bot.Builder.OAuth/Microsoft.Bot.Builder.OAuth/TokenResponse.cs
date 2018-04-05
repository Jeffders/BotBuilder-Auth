using System;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Microsoft.Bot.Schema
{
    /// <summary>
    /// A response that includes a user token
    /// </summary>
    public class TokenResponse
    {
        /// <summary>
        /// The connection name
        /// </summary>
        [JsonProperty("connectionName")]
        public string ConnectionName { get; set; }

        /// <summary>
        /// The user token
        /// </summary>
        [JsonProperty("token")]
        public string Token { get; set; }

        /// <summary>
        /// Expiration for the token, in ISO 8601 format (e.g. "2007-04-05T14:30Z")
        /// </summary>
        [JsonProperty("expiration")]
        public string Expiration { get; set; }

        /// <summary>
        /// Extension data for overflow of properties
        /// </summary>
        [JsonExtensionData(ReadData = true, WriteData = true)]
        public JObject Properties { get; set; } = new JObject();
    }
}
