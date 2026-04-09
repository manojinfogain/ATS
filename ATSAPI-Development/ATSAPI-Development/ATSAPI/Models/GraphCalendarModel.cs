using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI.Models
{
    public class GraphCalendarModel
    {
    }

    public class CalendarEventGraph
    {
        public Uri OdataContext { get; set; }
        public string id { get; set; }
        public string webLink { get; set; }
        public string iCalUId { get; set; }
        public onlineMeeting onlineMeeting { get; set; }
    }

    public class onlineMeeting
    {
        public string joinUrl { get; set; }
    }


    public class createEventBody
    {
        public createEventBody()
        {
            body = new body();
            // FileAttachmentE = new FileAttachmentE();
            attendees = new List<attendeesList>();
        }
        public List<attendeesList> attendees { get; set; }
        public body body { get; set; }
        // public FileAttachmentE FileAttachmentE { get; set; }
    }


    public class createEventBodyUpdate
    {
        public createEventBodyUpdate()
        {
            body = new body();
            // FileAttachmentE = new FileAttachmentE();
            attendees = new List<attendeesList>();
            start = new dateRange();
            end = new dateRange();
        }
        public List<attendeesList> attendees { get; set; }
        public body body { get; set; }
        // public FileAttachmentE FileAttachmentE { get; set; }
        public string subject { get; set; }
        public dateRange start { get; set; }
        public dateRange end { get; set; }
     //   public Boolean allowNewTimeProposals { get; set; }
     //   public Boolean isOnlineMeeting { get; set; }
     //   public string importance { get; set; }
     //   public int reminderMinutesBeforeStart { get; set; }

    }



    public class dateRange
    {
        public string dateTime { get; set; }
        public string timeZone { get; set; }
    }
    public class attendeesList
    {
        public attendeesList()
        {
            emailAddress = new emailAddress1();
        }
        public emailAddress1 emailAddress { get; set; }
        public string type { get; set; }
    }
    public class body
    {
        public string contentType { get; set; }
        public string content { get; set; }
    }

    public class emailAddress1
    {
        public string address { get; set; }
        public string name { get; set; }
    }

    public class FileAttachmentE
    {
        [JsonProperty("@odata.type")]
        public string ODataType { get; set; }
        public string ContentBytes { get; set; }
        public string Name { get; set; }
    }


    public class ErrorResHttp
    {
             public errorObj error { get; set; }
    }

    public class errorObj
    {
        public string message { get; set; }
    }


    public class sendEmailBody
    {
        public sendEmailBody()
        {
            message = new messageBody();
        }
        public messageBody message { get; set; }
        public Boolean saveToSentItems { get; set; }
    }

    public class messageBody
    {
        public messageBody()
        {

            toRecipients = new List<Recipient>();
            ccRecipients = new List<Recipient>();
            body = new bodyEmail();
            attachments = new List<EmailFileAttachment>();
        }
        public string subject { get; set; }
        public bodyEmail body { get; set; }
        public List<Recipient> toRecipients { get; set; }
        public List<Recipient> ccRecipients { get; set; }
        public List<EmailFileAttachment> attachments { get; set; }
    }

    public class bodyEmail
    {
        public string contentType { get; set; }
        public string content { get; set; }
    }
    public class Recipient
    {
        public Recipient()
        {
            emailAddress = new emailAddress3();
        }
        public emailAddress3 emailAddress { get; set; }
    }

    public class emailAddress3
    {
        public string address { get; set; }
        public string name { get; set; }
    }

    public class EmailFileAttachment
    {
        [JsonProperty("@odata.type")]
        public string ODataType { get; set; }
        public string contentBytes { get; set; }
        public string name { get; set; }
        public string contentType { get; set; }
    }


    public class createUploadSession
    {
        public Uri OdataContext { get; set; }
        public string expirationDateTime { get; set; }
        public string uploadUrl { get; set; }
    }

    public class uploadBodysharePoint
    {
        public int fileSize { get; set; }
        public string uploadUrl { get; set; }
        public string file { get; set; }
        public byte[] fileConv { get; set; }
    }


    public class UploadDetailsModel
    {
        [JsonProperty("@odata.context")]
        public Uri OdataContext { get; set; }

        [JsonProperty("@content.downloadUrl")]
        public string contentdownloadUrl { get; set; }
        public string id { get; set; }
        public string webUrl { get; set; }
    }


    public class GetSharePointSiteId
    {

        public GetSharePointSiteId()
        {
            value = new List<SharePointSiteIdValue>();
        }
        [JsonProperty("@odata.context")]
        public Uri OdataContext { get; set; }
        public List<SharePointSiteIdValue> value { get; set; }
    }

    public class SharePointSiteIdValue
    {
        public string id { get; set; }
        public string webUrl { get; set; }
        public string displayName { get; set; }
        public string name { get; set; }
    }


    public class GetSharePointDriveId
    {

        public GetSharePointDriveId()
        {
            value = new List<SharePointDriveIdValue>();
        }
        [JsonProperty("@odata.context")]
        public Uri OdataContext { get; set; }
        public List<SharePointDriveIdValue> value { get; set; }
    }

    public class SharePointDriveIdValue
    {
        public string id { get; set; }
        public string webUrl { get; set; }
        public string driveType { get; set; }
        public string name { get; set; }
    }

    public class GetSharePointSiteAndDriveId
    {

        public string driveId { get; set; }
        public string siteId { get; set; }
    }


}