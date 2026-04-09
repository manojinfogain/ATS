using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public partial class CalendarAppointment
    {
        public Uri OdataContext { get; set; }
        public string Id { get; set; }
        public DateTimeOffset CreationDateTime { get; set; }
        //public DateTimeOffset StartDateTime { get; set; }
        //public DateTimeOffset EndDateTime { get; set; }
        public string StartDateTime { get; set; }
        public string EndDateTime { get; set; }
        public string JoinUrl { get; set; }
        public string JoinWebUrl { get; set; }
        public string Subject { get; set; }
        public bool IsBroadcast { get; set; }
        public string AutoAdmittedUsers { get; set; }
        public object OuterMeetingAutoAdmittedUsers { get; set; }
        public bool IsEntryExitAnnounced { get; set; }
        public string AllowedPresenters { get; set; }
        public string AllowMeetingChat { get; set; }
        public bool AllowTeamworkReactions { get; set; }
        public bool AllowAttendeeToEnableMic { get; set; }
        public bool AllowAttendeeToEnableCamera { get; set; }
        public bool RecordAutomatically { get; set; }
        public object[] Capabilities { get; set; }
        public object VideoTeleconferenceId { get; set; }
        public object ExternalId { get; set; }
        public object BroadcastSettings { get; set; }
        public object AudioConferencing { get; set; }
        public object MeetingInfo { get; set; }
        public object MeetingAttendanceReport { get; set; }
        //public Participants Participants { get; set; }
        //public LobbyBypassSettings LobbyBypassSettings { get; set; }
        //public ChatInfo ChatInfo { get; set; }
        //public JoinInformation JoinInformation { get; set; }
    }
    //public class User
    //{
    //    public string id { get; set; }
    //    public object displayName { get; set; }
    //    public string tenantId { get; set; }
    //    public string identityProvider { get; set; }
    //}

    //public class Identity
    //{
    //    public Identity()
    //    {
    //        user = new User();
    //    }
    //    public User user { get; set; }
    //}

    //public class Organizer
    //{
    //    public Organizer()
    //    {
    //        identity = new Identity();
    //    }
    //    public Identity identity { get; set; }
    //}
    //public class Attendees
    //{
    //    public Attendees()
    //    {
    //        identity = new Identity();
    //    }
    //    public string upn { get; set; }
    //    public string role { get; set; }
    //    public Identity identity { get; set; }
    //}

    //public class Participants
    //{
    //    public Participants()
    //    {
    //        organizer = new Organizer();
    //        attendee = new List<Attendees>();
    //    }
    //    public Organizer organizer { get; set; }
    //    public List<Attendees> attendee { get; set; }
    //}

    //public class Appointments
    //{
    //   // public Appointments()
    //   // {
    //   //     participants = new Participants();
    //   // }
    //    public DateTime startDateTime { get; set; }
    //    public DateTime endDateTime { get; set; }
    //    public string subject { get; set; }
    //    //public string AutoAdmittedUsers { get; set; }
    //    //public string accessLevel { get; set; }
    //    //public bool entryExitAnnouncement { get; set; }
    //    //public Participants participants { get; set; }
    //}


    //public partial class ChatInfo
    //{
    //    public string ThreadId { get; set; }
    //    public long MessageId { get; set; }
    //    public object ReplyChainMessageId { get; set; }
    //}

    //public partial class JoinInformation
    //{
    //    public string Content { get; set; }
    //    public string ContentType { get; set; }
    //}

    //public partial class LobbyBypassSettings
    //{
    //    public string Scope { get; set; }
    //    public bool IsDialInBypassEnabled { get; set; }
    //}

    //public partial class Participants
    //{
    //    public Organizer Organizer { get; set; }
    //    public object[] Attendees { get; set; }
    //}

    //public partial class Organizer
    //{
    //    public string Upn { get; set; }
    //    public string Role { get; set; }
    //    public Dictionary<string, Identity> Identity { get; set; }
    //}

    //public partial class Identity
    //{
    //    public Guid Id { get; set; }
    //    public object DisplayName { get; set; }
    //    public Guid TenantId { get; set; }
    //    public string IdentityProvider { get; set; }
    //}



    //public class User
    //{​
    //    public string id {​ get; set; }​
    //    public string displayName {​ get; set; }​
    //    public string tenantId {​ get; set; }​
    //    public string identityProvider {​ get; set; }​
    //}​
    //    public class Identity
    //{​
    //    public object acsUser {​ get; set; }​
    //    public object spoolUser {​ get; set; }​
    //    public object phone {​ get; set; }​
    //    public object guest {​ get; set; }​
    //    public object encrypted {​ get; set; }​
    //    public object onPremises {​ get; set; }​
    //    public object acsApplicationInstance {​ get; set; }​
    //    public object spoolApplicationInstance {​ get; set; }​
    //    public object applicationInstance {​ get; set; }​
    //    public object application {​ get; set; }​
    //    public object device {​ get; set; }​
    //    public User user {​ get; set; }​
    //    }​
    //     public class Organizer
    //{​
    //    public string upn {​ get; set; }​
    //    public string role {​ get; set; }​
    //    public Identity identity {​ get; set; }​
    //    }​
    //     public class Participants
    //{​
    //    public Organizer organizer {​ get; set; }​
    //    public List<object> attendees {​ get; set; }​
    //    }​
    //     public class LobbyBypassSettings
    //{​
    //    public string scope {​ get; set; }​
    //    public bool isDialInBypassEnabled {​ get; set; }​
    //    }​
    //     public class ChatInfo
    //{​
    //    public string threadId {​ get; set; }​
    //    public string messageId {​ get; set; }​
    //    public object replyChainMessageId {​ get; set; }​
    //    }​
    //     public class JoinInformation
    //{​
    //    public string content {​ get; set; }​
    //    public string contentType {​ get; set; }​
    //    }​
    //     public class Root
    //{​
    //    [JsonProperty("@odata.context")]
    //    public string OdataContext {​ get; set; }​
    //    public string id {​ get; set; }​
    //    public DateTime creationDateTime {​ get; set; }​
    //    public DateTime startDateTime {​ get; set; }​
    //    public DateTime endDateTime {​ get; set; }​
    //    public string joinUrl {​ get; set; }​
    //    public string joinWebUrl {​ get; set; }​
    //    public string subject {​ get; set; }​
    //    public bool isBroadcast {​ get; set; }​
    //    public string autoAdmittedUsers {​ get; set; }​
    //    public object outerMeetingAutoAdmittedUsers {​ get; set; }​
    //    public bool isEntryExitAnnounced {​ get; set; }​
    //    public string allowedPresenters {​ get; set; }​
    //    public string allowMeetingChat {​ get; set; }​
    //    public bool allowTeamworkReactions {​ get; set; }​
    //    public bool allowAttendeeToEnableMic {​ get; set; }​
    //    public bool allowAttendeeToEnableCamera {​ get; set; }​
    //    public bool recordAutomatically {​ get; set; }​
    //    public List<object> capabilities {​ get; set; }​
    //    public object videoTeleconferenceId {​ get; set; }​
    //    public object externalId {​ get; set; }​
    //    public object broadcastSettings {​ get; set; }​
    //    public object audioConferencing {​ get; set; }​
    //    public object meetingInfo {​ get; set; }​
    //    public object meetingAttendanceReport {​ get; set; }​
    //    public Participants participants {​ get; set; }​
    //    public LobbyBypassSettings lobbyBypassSettings {​ get; set; }​
    //    public ChatInfo chatInfo {​ get; set; }​
    //    public JoinInformation joinInformation {​ get; set; }​
    //    


    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse); 
    public class Language
    {
        public string code { get; set; }
    }

    public class Param
    {
        public string @default { get; set; }
    }

    public class Hsm
    {
        public Hsm()
        {
            language = new Language();
            @params = new List<Param>();
        }
        public string @namespace { get; set; }
        public Language language { get; set; }
        public List<Param> @params { get; set; }
        public object Comoponents { get; set; }
        public string templateName { get; set; }
    }

    public class Content
    {
        public Content()
        {
            hsm = new Hsm();
        }
        public Hsm hsm { get; set; }
    }

    public class Root
    {
        public Root()
        {
            content = new Content();
        }
        public string channelId { get; set; }
        public Content content { get; set; }
        public string to { get; set; }
        public string type { get; set; }
        public string from { get; set; }
    }



}