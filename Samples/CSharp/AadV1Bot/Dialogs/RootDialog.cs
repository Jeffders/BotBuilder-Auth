﻿using System;
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

namespace AadV1Bot.Dialogs
{
    [Serializable]
    public class RootDialog : IDialog<object>
    {
        private static string ConnectionName = ConfigurationManager.AppSettings["ConnectionName"];

        public async Task StartAsync(IDialogContext context)
        {
            context.Wait(MessageReceivedAsync);
        }

        private async Task MessageReceivedAsync(IDialogContext context, IAwaitable<object> result)
        {
            var activity = await result as Activity;
            
            var message = activity.Text.ToLowerInvariant();

            if (message.ToLowerInvariant().Equals("recents"))
            {
                context.Call(new GetTokenDialog(), ListRecentMail);
            }
            else if (message.ToLowerInvariant().StartsWith("send"))
            {
                var recipient = message.ToLowerInvariant().Split(' ');
                if (recipient.Length == 2)
                {
                    context.Call(new GetTokenDialog(), async (IDialogContext ctx, IAwaitable<string> tokenResponse) => {
                        await SendMail(context, tokenResponse, recipient[1]);
                    });
                }
                else
                {
                    await context.PostAsync("You need to enter: 'send <recipient_email>' to send an email.");
                }
            }
            else if (message.ToLowerInvariant().Equals("me"))
            {
                context.Call(new GetTokenDialog(), ListMe);
            }
            else if (message.ToLowerInvariant().Equals("signout"))
            {
                await Signout(context);
            }
            else
            {
                await context.PostAsync("You can type 'recents', 'send <recipient_email>', or 'me' to list things from AAD v1.");
                context.Wait(MessageReceivedAsync);
            }
        }

        public static async Task Signout(IDialogContext context)
        {
            await context.SignOutUserAsync(ConnectionName);
            await context.PostAsync($"You have been signed out.");
        }

        #region AAD Tasks

        private async Task ListRecentMail(IDialogContext context, IAwaitable<string> tokenResponse)
        {
            var token = await tokenResponse;
            var client = new SimpleGraphClient(token);

            var card = new AdaptiveCard();
            var container = new Container();
            card.Body.Add(container);
            container.Items.Add(new TextBlock()
            {
                Text = "Here are all of your unread Inbox emails from the last 30 minutes:",
                Weight = TextWeight.Bolder,
                Size = TextSize.Medium,
                Wrap = true
            });
            container.Items.Add(new TextBlock()
            {
                Text = " ",
                Weight = TextWeight.Bolder,
                Size = TextSize.Medium
            });
            var messages = await client.GetRecentUnreadMail();
            int i = 1;
            foreach (var m in messages)
            {
                var messageContainer = new Container();
                messageContainer.Items.Add(new TextBlock() { Text = m.From.EmailAddress.Name, Weight = TextWeight.Bolder, Size = TextSize.Medium });
                messageContainer.Items.Add(new TextBlock() { Text = $"_{m.Subject}_", Wrap = true });
                messageContainer.Items.Add(new TextBlock() { Text = m.BodyPreview, Wrap = true });
                messageContainer.Items.Add(new TextBlock() { Text = " " });
                container.Items.Add(messageContainer);
            }

            var repoMessage = context.MakeMessage();
            if (repoMessage.Attachments == null)
            {
                repoMessage.Attachments = new List<Attachment>();
            }
            repoMessage.Attachments.Add(new Attachment()
            {
                Content = card,
                ContentType = "application/vnd.microsoft.card.adaptive",
                Name = "Repositories"
            });
            await context.PostAsync(repoMessage);
        }

        private async Task SendMail(IDialogContext context, IAwaitable<string> tokenResponse, string recipient)
        {
            var token = await tokenResponse;
            var client = new SimpleGraphClient(token);

            var me = await client.GetMe();

            await client.SendMail(recipient, "Message from a bot!", $"Hi there! I had this message sent from a bot. - Your friend, {me.DisplayName}");

            await context.PostAsync($"I sent a message to '{recipient}' from your account :)");
        }


        private async Task ListMe(IDialogContext context, IAwaitable<string> tokenResponse)
        {
            var token = await tokenResponse;
            var client = new SimpleGraphClient(token);

            var me = await client.GetMe();
            var manager = await client.GetManager();

            await context.PostAsync($"You are {me.DisplayName} and you report to {manager.DisplayName}.");
        }
        #endregion
    }
}
