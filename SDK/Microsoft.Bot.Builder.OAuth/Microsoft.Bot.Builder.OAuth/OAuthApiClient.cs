using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Bot.Connector;
using Microsoft.Bot.Schema;
using Microsoft.Rest;
using Newtonsoft.Json;

namespace Microsoft.Bot.Builder.OAuth
{
    public partial class OAuthApiClient : ServiceClient<OAuthApiClient>
    {
        /// <summary>
        /// The base URI of the service.
        /// </summary>
        public System.Uri BaseUri { get; set; }
        
        /// <summary>
        /// Subscription credentials which uniquely identify client subscription.
        /// </summary>
        public ServiceClientCredentials Credentials { get; private set; }

        
        /// <summary>
        /// Initializes a new instance of the StateClient class.
        /// </summary>
        /// <param name='handlers'>
        /// Optional. The delegating handlers to add to the http client pipeline.
        /// </param>
        protected OAuthApiClient(params DelegatingHandler[] handlers) : base(handlers)
        {
            Initialize();
        }

        /// <summary>
        /// Initializes a new instance of the StateClient class.
        /// </summary>
        /// <param name='credentials'>
        /// Required. Subscription credentials which uniquely identify client subscription.
        /// </param>
        /// <param name='handlers'>
        /// Optional. The delegating handlers to add to the http client pipeline.
        /// </param>
        /// <exception cref="System.ArgumentNullException">
        /// Thrown when a required parameter is null
        /// </exception>
        public OAuthApiClient(ServiceClientCredentials credentials, params DelegatingHandler[] handlers) : this(handlers)
        {
            Credentials = credentials ?? throw new System.ArgumentNullException("credentials");

            if (Credentials != null)
            {
                Credentials.InitializeServiceClient(this);
            }
        }
        public Task<TokenResponse> GetUserTokenAsync(string userId, string connectionName, CancellationToken cancellationToken = default(CancellationToken))
        {
            return GetUserTokenAsync(userId, connectionName, null, cancellationToken);
        }
        
        public async Task<TokenResponse> GetUserTokenAsync(string userId, string connectionName, string magicCode, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (connectionName == null)
            {
                throw new ValidationException(ValidationRules.CannotBeNull, "connectionName");
            }
            if (userId == null)
            {
                throw new ValidationException(ValidationRules.CannotBeNull, "userId");
            }
            
            // Construct URL
            var _baseUrl = BaseUri.AbsoluteUri;
            var _url = new System.Uri(new System.Uri(_baseUrl + (_baseUrl.EndsWith("/") ? "" : "/")), "api/usertoken/GetToken?userId={userId}&connectionName={connectionName}{magicCodeParam}").ToString();
            _url = _url.Replace("{connectionName}", System.Uri.EscapeDataString(connectionName));
            _url = _url.Replace("{userId}", System.Uri.EscapeDataString(userId));
            if (!string.IsNullOrEmpty(magicCode))
            {
                _url = _url.Replace("{magicCodeParam}", $"&code={System.Uri.EscapeDataString(magicCode)}");
            }
            else
            {
                _url = _url.Replace("{magicCodeParam}", String.Empty);
            }

            // Create HTTP transport objects
            var _httpRequest = new HttpRequestMessage();
            HttpResponseMessage _httpResponse = null;
            _httpRequest.Method = new HttpMethod("GET");
            _httpRequest.RequestUri = new System.Uri(_url);
            
            MicrosoftAppCredentials.TrustServiceUrl(_url);

            // Set Credentials
            if (Credentials != null)
            {
                cancellationToken.ThrowIfCancellationRequested();
                await Credentials.ProcessHttpRequestAsync(_httpRequest, cancellationToken).ConfigureAwait(false);
            }
            cancellationToken.ThrowIfCancellationRequested();

            _httpResponse = await HttpClient.SendAsync(_httpRequest, cancellationToken).ConfigureAwait(false);

            HttpStatusCode _statusCode = _httpResponse.StatusCode;
            cancellationToken.ThrowIfCancellationRequested();
            string _responseContent = null;
            if (_statusCode == HttpStatusCode.OK)
            {
                _responseContent = await _httpResponse.Content.ReadAsStringAsync().ConfigureAwait(false);
                try
                {
                    var tokenResponse = Rest.Serialization.SafeJsonConvert.DeserializeObject<TokenResponse>(_responseContent);
                    return tokenResponse;
                }
                catch (JsonException)
                {
                    _httpRequest.Dispose();
                    if (_httpResponse != null)
                    {
                        _httpResponse.Dispose();
                    }
                    return null;
                }
            }
            else if(_statusCode == HttpStatusCode.NotFound)
            {
                return null;
            }
            else
            {
                // TODO: some error situation should be logged
                return null;
            }                
        }


        public async Task<bool> SignOutUserAsync(string userId, string connectionName, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (connectionName == null)
            {
                throw new ValidationException(ValidationRules.CannotBeNull, "connectionName");
            }
            if (userId == null)
            {
                throw new ValidationException(ValidationRules.CannotBeNull, "userId");
            }

            // Construct URL
            var _baseUrl = BaseUri.AbsoluteUri;
            var _url = new System.Uri(new System.Uri(_baseUrl + (_baseUrl.EndsWith("/") ? "" : "/")), "api/usertoken/SignOut?&userId={userId}&connectionName={connectionName}").ToString();
            _url = _url.Replace("{connectionName}", System.Uri.EscapeDataString(connectionName));
            _url = _url.Replace("{userId}", System.Uri.EscapeDataString(userId));
            
            MicrosoftAppCredentials.TrustServiceUrl(_url);

            // Create HTTP transport objects
            var _httpRequest = new HttpRequestMessage();
            HttpResponseMessage _httpResponse = null;
            _httpRequest.Method = new HttpMethod("GET");
            _httpRequest.RequestUri = new System.Uri(_url);
            
            // Set Credentials
            if (Credentials != null)
            {
                cancellationToken.ThrowIfCancellationRequested();
                await Credentials.ProcessHttpRequestAsync(_httpRequest, cancellationToken).ConfigureAwait(false);
            }
            cancellationToken.ThrowIfCancellationRequested();
            _httpResponse = await HttpClient.SendAsync(_httpRequest, cancellationToken).ConfigureAwait(false);

            HttpStatusCode _statusCode = _httpResponse.StatusCode;
            cancellationToken.ThrowIfCancellationRequested();
            if (_statusCode == HttpStatusCode.OK)
            {
                return true;
            }
            else
            {
                // TODO: some error situation should be logged
                return false;
            }
        }

        private HttpClient instanceClient;
        protected static HttpClient g_httpClient = null;
        protected static object syncObj = new object();
        
        private void CustomInitialize()
        {
            if (g_httpClient == null)
            {
                lock (syncObj)
                {
                    if (g_httpClient == null)
                    {
                        g_httpClient = new HttpClient();
                        g_httpClient.DefaultRequestHeaders.UserAgent.Add(new ProductInfoHeaderValue("Microsoft-BotFramework", "3.1"));
                        g_httpClient.DefaultRequestHeaders.ExpectContinue = false;
                    }
                }
            }

            // use global singleton for perf reasons
            this.instanceClient = this.HttpClient;
            this.HttpClient = g_httpClient;
        }

        /// <summary>
        /// Initializes client properties.
        /// </summary>
        private void Initialize()
        {
            if (string.IsNullOrEmpty(settingsOAuthApiUrl.Value))
            {
                BaseUri = new Uri("https://api.botframework.com");
            }
            else
            {
                BaseUri = new Uri(settingsOAuthApiUrl.Value);
            }
            CustomInitialize();
        }

        private readonly static Lazy<string> settingsOAuthApiUrl = new Lazy<string>(() => GetOAuthApiFromSettingsUrl());

        /// <summary>
        /// Get the OAuth API endpoint from settings. 
        /// </summary>
        /// <param name="key">The key.</param>
        /// <returns>The OAuth API endpoint from settings.</returns>
        private static string GetOAuthApiFromSettingsUrl(string key = "OAuthApiEndpoint")
        {
            var url = SettingsUtils.GetAppSettings(key);
            if (!string.IsNullOrEmpty(url))
            {
                MicrosoftAppCredentials.TrustServiceUrl(url, DateTime.MaxValue);
            }
            return url;
        }
    }
}
