using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MessageBird;
using MessageBird.Exceptions;
using MessageBird.Net.ProxyConfigurationInjector;
using MessageBird.Objects;
using MessageBird.Objects.Conversations;
using System.Net;

namespace ATSAPI.common
{
    public class WhatsappMessage
    {
        public int SendWhatsappNotification(string To, string Name, string Date, string Time, string Mode)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            IProxyConfigurationInjector proxyConfigurationInjector = null; // for no web proxies, or web proxies not requiring authentication
            Client client = Client.CreateDefault("f2D4TmZgSicqsa4ZBBGvLwcVe", proxyConfigurationInjector);
            try
            {
                Conversation conversation = client.StartConversation(new ConversationStartRequest()
                {
                    ChannelId = "3dd43018-5b32-4ec5-837a-9e7b90da26a4",
                    To = To,
                    Type = ContentType.Hsm,
                    Content = new Content()
                    {
                        Hsm = new HsmContent()
                        {
                            Namespace = "3b5392d8_5cbf_4903_815e_fce59a2c27c3",
                            TemplateName = "interviewschedulenorep",
                            Language = new HsmLanguage()
                            {
                                Code = "en",
                                Policy = HsmLanguagePolicy.Deterministic
                            },

                            Params = new System.Collections.Generic.List<HsmLocalizableParameter>()
                            {
                                new HsmLocalizableParameter()
                                {
                                    Default = Name
                                },
                                new HsmLocalizableParameter()
                                {
                                    Default = Date
                                },
                                new HsmLocalizableParameter()
                                {
                                    Default = Time
                                },
                                new HsmLocalizableParameter()
                                {
                                    Default = Mode
                                }
                            }
                        }
                    }
                });
                return 1;
            }
            catch (ErrorException e)
            {
                // Either the request fails with error descriptions from the endpoint.
                if (e.HasErrors)
                {
                    foreach (Error error in e.Errors)
                    {
                        // Console.WriteLine("code: {0} description: '{1}' parameter: '{2}'", error.Code, error.Description, error.Parameter);
                    }
                }
                // or fails without error information from the endpoint, in which case the reason contains a 'best effort' description.
                if (e.HasReason)
                {
                    // Console.WriteLine(e.Reason);
                }
                return 0;
            }
        }
    }
}