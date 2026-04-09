using ATSAPI.App_Data;
using ATSAPI.common;
using ATSAPI.Models;
using ATSAPI.Repositry;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace ATSAPI.Controllers
{
    [RoutePrefix("api/Outside")]

    public class OutSideController : ApiController
    {
        OutSideRepository objRepo = new OutSideRepository();
        public OutSideController()
        {
        }

        //[Route("CheckDuplicateEmailforProfile")]
        //[HttpGet]
        //public IHttpActionResult CheckDuplicateEmailforProfile(string Emailid)
        //{
        //    try
        //    {
        //        return Ok(objRepo.CheckDuplicateEmailforProfile(Emailid).Tables[0].Rows.Count > 0 ? true : false);
        //    }
        //    catch (Exception ex)
        //    {
        //        ExceptionLogging.SendExcepToDB(ex, "OutSide", "CheckDuplicateEmailforProfile");
        //        return BadRequest("There is some error! Try again later");
        //    }
        //}

        //[Route("addReferralDetails")]
        //[HttpPost]
        //public IHttpActionResult addupdateCandidateDetailsOptionalTHID()
        //{
        //    try
        //    {
        //        candidateProfile fb = new candidateProfile();
        //        var frm = HttpContext.Current.Request.Form;
        //        if (HttpContext.Current.Request.Files.Count > 0)
        //        {
        //            fb.Resume = HttpContext.Current.Request.Files[0].FileName;
        //        }

        //        fb.id = 0;
        //        fb.ProfileId = 4;
        //        fb.FirstName = frm["FirstName"].ToString();
        //        fb.MiddleName = frm["MiddleName"].ToString();
        //        fb.LastName = frm["LastName"].ToString();
        //        fb.Email = frm["Email"];
        //        fb.MobileNumber = frm["MobileNumber"];
        //        fb.PrimarySkill = frm["PrimarySkill"];
        //        fb.SecondarySkill = frm["SecondarySkill"];
        //        fb.totalExp = frm["totalExp"];
        //        fb.releventExp = frm["releventExp"];
        //        fb.StatusId = 0;
        //        fb.CountryCode = Convert.ToInt16(frm["CountryCode"]);
        //        fb.AddedBy = frm["AddedBy"];
        //        fb.thid = frm["thid"];
        //        fb.Path = ConfigurationManager.AppSettings["UmappedResumesPath"].ToString();
        //        fb.referralId = frm["referralId"];
        //        int result = objRepo.addupdateCandidateDetailsOptionalTHID(fb);

        //        if (HttpContext.Current.Request.Files.Count > 0 && result >= 0)
        //        {
        //            var httpPostedFile = HttpContext.Current.Request.Files[0];

        //            string filedetails = Path.GetFileNameWithoutExtension(httpPostedFile.FileName).ToString() + Path.GetExtension(httpPostedFile.FileName).ToString();
        //            string tempPath = fb.Path + result.ToString() + "/";
        //            if (!(Directory.Exists(tempPath)))
        //            {
        //                Directory.CreateDirectory(tempPath);
        //            }
        //            string fileSavePath = Path.Combine(tempPath, filedetails);
        //            if (System.IO.File.Exists(fileSavePath))
        //            {
        //                File.Delete(fileSavePath);
        //            }
        //            httpPostedFile.SaveAs(fileSavePath);
        //        }

        //        if (result > 0 && fb.id <= 0)
        //            return Ok("Candidate Details Uploaded Successfully");
        //        else if (result > 0 && fb.id > 0)
        //            return Ok("Candidate Details Updated Successfully");
        //        else if (result == -1)
        //            return BadRequest("Candidate Details Already Exists");
        //        else
        //            return BadRequest("There is some error! Try again later");
        //    }
        //    catch (Exception ex)
        //    {
        //        ExceptionLogging.SendExcepToDB(ex, "Outside", "addupdateCandidateDetailsOptionalTHID");
        //        return BadRequest("There is some error! Try again later");
        //    }
        //}

        //[Route("getRequisitionBySkillId")]
        //[HttpGet]
        //public IHttpActionResult getRequisitionBySkillId(string empid = "")
        //{
        //    try
        //    {
        //        return Ok(objRepo.getRequisitionBySkillId(empid));
        //    }
        //    catch (Exception ex)
        //    {
        //        ExceptionLogging.SendExcepToDB(ex, "Outside", "getRequisitionBySkillId");
        //        return BadRequest("There is some error! Try again later");
        //    }
        //}

        //[Route("getCountryCodeByCountryID")]
        //[HttpGet]
        //public IHttpActionResult getCountryCodeByCountryID(string EmpId, int CountryId)
        //{
        //    try
        //    {
        //        return Ok(objRepo.getCountryCodeByCountryID(EmpId, CountryId));
        //    }
        //    catch (Exception ex)
        //    {
        //        ExceptionLogging.SendExcepToDB(ex, "Outside", "getCountryCodeByCountryID");
        //        return BadRequest("There is some error! Try again later");
        //    }
        //}

        //[Route("GetCountryList")]
        //[HttpGet]
        //public IHttpActionResult GetCountryList(string EmpId)
        //{
        //    try
        //    {
        //        return Ok(objRepo.GetCountryList(EmpId));
        //    }
        //    catch (Exception ex)
        //    {
        //        ExceptionLogging.SendExcepToDB(ex, "Outside", "getCountryCodeByCountryID");
        //        return BadRequest("There is some error! Try again later");
        //    }
        //}

        //[Route("GetCityListByCountryId")]
        //[HttpGet]
        //public IHttpActionResult GetCityListByCountryId(string EmpId, int CountryId)
        //{
        //    try
        //    {
        //        return Ok(objRepo.GetCityListByCountryId(EmpId, CountryId));
        //    }
        //    catch (Exception ex)
        //    {
        //        ExceptionLogging.SendExcepToDB(ex, "Outside", "GetCityListByCountryId");
        //        return BadRequest("There is some error! Try again later");
        //    }
        //}

        //[Route("SendNoti")]
        //[HttpGet]
        //public IHttpActionResult sssssendTikk(int cid, string empoids)
        //{
        //    try
        //    {
        //        Common rr = new Common();
        //        return Ok(rr.addToCalendar(cid, empoids, 1));
        //    }
        //    catch (Exception ex)
        //    {
        //        ExceptionLogging.SendExcepToDB(ex, "Outside", "GetCityListByCountryId");
        //        return BadRequest("There is some error! Try again later");
        //    }
        //}
    }
}
