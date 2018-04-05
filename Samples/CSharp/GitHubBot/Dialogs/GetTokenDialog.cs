using System;
using System.Threading.Tasks;
using System.Configuration;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Web;
using System.Net.Http;
using System.Net.Http.Headers;
using AdaptiveCards;
using System.Linq;
using System.Text;
using Microsoft.Bot.Schema;
using System.Threading;

namespace GitHubBot.Dialogs
{
    [Serializable]
    public class GetTokenDialog : IDialog<string>
    {
        private static string ConnectionName = ConfigurationManager.AppSettings["ConnectionName"];

        public async Task StartAsync(IDialogContext context)
        {
            // First ask Bot Service if it already has a token for this user
            var token = await context.GetUserTokenAsync(ConnectionName).ConfigureAwait(false);
            if (token != null)
            {
                context.Done(token.Token);
            }
            else
            {
                // If Bot Service does not have a token, send an OAuth card to sign in
                await SendOAuthCardAsync(context, (Activity)context.Activity);
            }
        }

        private async Task SendOAuthCardAsync(IDialogContext context, Activity activity)
        {
            await context.PostAsync($"To do this, you'll first need to sign in to GitHub.");

            var reply = activity.CreateReply();
            reply.Attachments = new List<Attachment>() {
                new Attachment()
                {
                    ContentType = OAuthCard.ContentType,
                    Content = new OAuthCard()
                    {
                        Text = $"Please sign in to GitHub to proceed.",
                        ConnectionName = ConnectionName,
                        Buttons = new CardAction[]
                        {
                            new CardAction() { Title = "Sign In", Type = ActionTypes.Signin }
                        },
                    }
                }
            };

            await context.PostAsync(reply);

            context.Wait(WaitForToken);
        }

        private async Task WaitForToken(IDialogContext context, IAwaitable<object> result)
        {
            var activity = await result as Activity;

            var tokenResponse = activity.ReadTokenResponseContent();
            if (tokenResponse != null)
            {
                context.Done(tokenResponse.Token);
            }
            else
            {
                if (!string.IsNullOrEmpty(activity.Text))
                {
                    tokenResponse = await context.GetUserTokenAsync(ConnectionName, activity.Text);
                    if (tokenResponse != null)
                    {
                        context.Done(tokenResponse.Token);
                        return;
                    }
                }
                await context.PostAsync($"Hmm. Something went wrong trying to sign in. Let's try again.");
                await SendOAuthCardAsync(context, activity);
            }
        }
    }
}
