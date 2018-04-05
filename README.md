# BotBuilder-Auth

This repository contains documentation, code, and libraries for how to take advantage of new bot authentication capabilities in Azure Bot Service. The preview contains capabilities to make it easy for bot developers to have the bot authenticate users to various identity providers such as AAD, GitHub, Uber, etc. This preview also takes steps towards an improved user experience by eliminating the “magic code verification” for some clients (and in a few weeks, single-sign support for some clients).

Before this preview, the Bot was required to have all of the needed OAuth controllers and login links, store the target client IDs and secrets, and perform user token management (storage and refresh). These capabilities were bundled in the BotAuth and AuthBot samples that are GitHub.

With this preview, bot developers no longer need to host OAuth controllers or manage token lifecycle as all of this is done by the Azure Bot Service. 

# What’s Included
This preview will continue to improve, and as of today includes:

 - Improvements to the DirectLine, WebChat, Telegram, Facebook, SMS, Email, Kik, Slack, and GroupMe channels to support new authentication features.
 - Improvements to the Azure Portal to  add, delete, and configure connection settings to various OAuth identity providers
 - Support for a variety of out-of-the-box identity providers including AAD v1, AAD v2, GitHub, etc.
 - Updates to the C# Bot Builder SDK to be able to retrieve tokens, create OAuthCards and handle TokenResponse events
 - New Webchat and DirectLineJS libraries to eliminate the need for the 6-digit magic code verification.
 - Samples for how to make a bot that authenticates to AAD (v1 and v2) and GitHub
 - A web client sample for how to host WebChat

You can use some or all of these pieces as part of the preview.

# How Do I Get Started?
Read the Preview Technical Guide file for a walk through of features and how to use them. 

# What’s Coming Soon
 - Improvements to the Teams, Skype, Skype for Business, and Cortana channels to support new authentication features.
 - A Management API to be able to add, delete, and configure connection settings programmatically
 - Updates to the Node Bot Builder SDK to be able to retrieve tokens, create OAuthCards and handle TokenResponse events
 - Single-Sign On (SSO) support in Webchat
 - Single-Sign On (SSO) support in Teams, Cortana, Skype, and Skype for Business
 - Removing the 6-digit magic code when using Teams, Cortana, Skype, and Skype for Business
 - Updates to the emulator to use sign-in cards

# How Do I Get Support
Please email the people who invited you to the preview with any questions, issues, or points of feedback, or use the forums in this repository