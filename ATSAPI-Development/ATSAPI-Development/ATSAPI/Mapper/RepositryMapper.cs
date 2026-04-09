using ATSAPI.App_Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Globalization;
using System.Web.Mvc;
using ATSAPI.Models;
using Org.BouncyCastle.Asn1.X500;
using static ATSAPI.Models.NaukriIntigration;
using DocumentFormat.OpenXml.Spreadsheet;
using System.Configuration;

namespace ASTAPI.Mapper
{
    public static class RepositryMapper
    {
        public static object getMap<T>(DataSet ds)
        {
            object objlist = new object();
            string sectionName = "RepositryMapper";
            try
            {
                if (typeof(T) == typeof(TotalCount))
                {
                    TotalCount Tc = new TotalCount();
                    if (ds != null && ds.Tables.Count == 1)
                    {
                        Tc.Offshore = Convert.ToInt32(ds.Tables[0].Rows[0]["Offshore"]);
                        Tc.Onshore = Convert.ToInt32(ds.Tables[0].Rows[0]["Onsite"]);
                    }
                    else { Tc.Offshore = 0; Tc.Onshore = 0; }
                    objlist = Tc;
                }
                else if (typeof(T) == typeof(Total))
                {
                    Total Tc = new Total();
                    if (ds != null && ds.Tables.Count == 1)
                    {
                        Tc.Count = Convert.ToInt32(ds.Tables[0].Rows[0]["Count"]);
                    }
                    else { Tc.Count = 0; }
                    objlist = Tc;
                }
                else if (typeof(T) == typeof(UserMaster))
                {
                    UserMaster ud = new UserMaster();
                    if (ds != null && ds.Tables.Count == 1)
                    {
                        ud.DomainId = Convert.ToString(ds.Tables[0].Rows[0]["emp_domainid"]);
                        ud.FirstName = Convert.ToString(ds.Tables[0].Rows[0]["emp_firstname"]);
                        ud.LastName = Convert.ToString(ds.Tables[0].Rows[0]["emp_lastName"]);
                        ud.FullName = Convert.ToString(ds.Tables[0].Rows[0]["FullName"]);
                        ud.EmpOldID = Convert.ToString(ds.Tables[0].Rows[0]["emp_staffid"]);
                        ud.EmpNewId = Convert.ToString(ds.Tables[0].Rows[0]["Emp_newid"]);
                        ud.MailID = Convert.ToString(ds.Tables[0].Rows[0]["emp_mailid"]);
                        ud.LocationID = Convert.ToInt16(ds.Tables[0].Rows[0]["LocationId"]);
                        ud.LocationName = Convert.ToString(ds.Tables[0].Rows[0]["LocationName"]);
                        ud.RoleId = Convert.ToInt16(ds.Tables[0].Rows[0]["RoleId"]);
                        ud.Role = Convert.ToString(ds.Tables[0].Rows[0]["Role"]);
                        ud.UserType = Convert.ToChar(ds.Tables[0].Rows[0]["UserType"]);
                        ud.IsPasswordChanged = Convert.ToChar(ds.Tables[0].Rows[0]["IsPasswordChanged"]);
                        ud.otherRoles.IsDH = Convert.ToChar(ds.Tables[0].Rows[0]["IsDH"]);
                        ud.otherRoles.IsAO = Convert.ToChar(ds.Tables[0].Rows[0]["IsAO"]);
                        ud.otherRoles.IsApprover = Convert.ToChar(ds.Tables[0].Rows[0]["IsApprover"]);
                        ud.otherRoles.IsBUHead = Convert.ToChar(ds.Tables[0].Rows[0]["IsBUHead"]);
                        ud.otherRoles.IsPM = Convert.ToChar(ds.Tables[0].Rows[0]["IsPM"]);
                        ud.otherRoles.IsHiringManager = Convert.ToChar(ds.Tables[0].Rows[0]["IsHiringManager"]);
                        ud.otherRoles.IsDelegationAdmin = Convert.ToChar(ds.Tables[0].Rows[0]["IsDelegationAdmin"]);
                        ud.otherRoles.IsInterviewer = Convert.ToChar(ds.Tables[0].Rows[0]["IsInterviewer"]);
                        ud.otherRoles.IsTagLeadApprover = Convert.ToChar(ds.Tables[0].Rows[0]["IsTagLeadApprover"]);
                        ud.otherRoles.IsWMG = Convert.ToChar(ds.Tables[0].Rows[0]["IsWMG"]);
                        ud.otherRoles.IsTAG = Convert.ToChar(ds.Tables[0].Rows[0]["IsTAG"]);
                        ud.otherRoles.IsGDL = Convert.ToChar(ds.Tables[0].Rows[0]["IsGDL"]);
                        ud.otherRoles.IsFinance = Convert.ToChar(ds.Tables[0].Rows[0]["IsFinance"]);
                        ud.otherRoles.IsIJP = Convert.ToChar(ds.Tables[0].Rows[0]["IsIJP"]);
                        ud.otherRoles.IsRM = Convert.ToChar(ds.Tables[0].Rows[0]["IsRM"]);
                        ud.otherRoles.IsUSHrRole = Convert.ToChar(ds.Tables[0].Rows[0]["IsUSHrRole"]);

                        ud.otherRoles.IsFinance = Convert.ToChar(ds.Tables[0].Rows[0]["IsFinance"]);
                        ud.DeptID = Convert.ToInt16(ds.Tables[0].Rows[0]["DeptID"]);
                        ud.otherRoles.IsRenuTeam = Convert.ToChar(ds.Tables[0].Rows[0]["IsRenuTeam"]);
                        //ud.otherRoles.IsRenuTeamAdmin = Convert.ToChar(ds.Tables[0].Rows[0]["IsRenuTeamAdmin"]);
                        ud.otherRoles.IsTalentAutoApproval = Convert.ToChar(ds.Tables[0].Rows[0]["IsTalentAutoApproval"]);
                        ud.Photo = ds.Tables[0].Rows[0]["Photo"].ToString();
                        ud.otherRoles.IsJDEditableRight = Convert.ToChar(ds.Tables[0].Rows[0]["IsJDEditableRight"]);
                        ud.otherRoles.IsProfileApprover = Convert.ToChar(ds.Tables[0].Rows[0]["IsProfileApprover"]);
                        ud.TalentDateLapseCount = Convert.ToInt16(ds.Tables[0].Rows[0]["TalentDateLapseCount"]);
                        ud.isLoginTalentDate = Convert.ToChar(ds.Tables[0].Rows[0]["isLoginTalentDate"]);
                        ud.otherRoles.IsIssAssestDelivery = Convert.ToChar(ds.Tables[0].Rows[0]["IsIssAssestDelivery"]);
                        ud.otherRoles.IsIssEmailUpdate = Convert.ToChar(ds.Tables[0].Rows[0]["IsIssEmailUpdate"]);
                        ud.otherRoles.IsPartnerApprover = Convert.ToChar(ds.Tables[0].Rows[0]["IsPartnerApprover"]);
                        ud.otherRoles.IsReportSalaryMask = Convert.ToChar(ds.Tables[0].Rows[0]["IsReportSalaryMask"]);
                        ud.otherRoles.IsPanelAccess = Convert.ToChar(ds.Tables[0].Rows[0]["IsPanelAccess"]);
                        ud.otherRoles.IsBuddyAssign = Convert.ToChar(ds.Tables[0].Rows[0]["IsBuddyAssign"]);
                        ud.otherRoles.IsHRBP = Convert.ToChar(ds.Tables[0].Rows[0]["IsHRBP"]);
                        ud.partnerId = Convert.ToInt32(ds.Tables[0].Rows[0]["partnerID"]);
                        ud.otherRoles.IsAdminProfileTransfer = Convert.ToChar(ds.Tables[0].Rows[0]["IsAdminProfileTransfer"]);
                        ud.otherRoles.IsVideoComparisonReport = Convert.ToChar(ds.Tables[0].Rows[0]["IsVideoComparisonReport"]);
                    }
                    objlist = ud;
                }

                else if (typeof(T) == typeof(EmpUserDetails))
                {
                    EmpUserDetails ud = new EmpUserDetails();
                    if (ds != null && ds.Tables.Count == 1)
                    {
                        ud.DomainId = Convert.ToString(ds.Tables[0].Rows[0]["emp_domainid"]);
                        ud.FirstName = Convert.ToString(ds.Tables[0].Rows[0]["emp_firstname"]);
                        ud.LastName = Convert.ToString(ds.Tables[0].Rows[0]["emp_lastName"]);
                        ud.FullName = Convert.ToString(ds.Tables[0].Rows[0]["FullName"]);
                        ud.EmpOldID = Convert.ToString(ds.Tables[0].Rows[0]["emp_staffid"]);
                        ud.EmpNewId = Convert.ToString(ds.Tables[0].Rows[0]["Emp_newid"]);
                        ud.MailID = Convert.ToString(ds.Tables[0].Rows[0]["emp_mailid"]);
                        ud.LocationID = Convert.ToInt16(ds.Tables[0].Rows[0]["LocationId"]);
                        ud.LocationName = Convert.ToString(ds.Tables[0].Rows[0]["LocationName"]);
                    }
                    objlist = ud;
                }
                else if (typeof(T) == typeof(RoundDetails))
                {
                    RoundDetails rd = new RoundDetails();
                    if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr1 = ds.Tables[0].Rows[0];
                        rd.cid = Convert.ToInt32(dr1["cid"]);
                        rd.RCount = Convert.ToInt32(dr1["RCount"]);
                        rd.Name = Convert.ToString(dr1["c_name"]);
                        rd.FirstName = Convert.ToString(dr1["FirstName"]);
                        rd.Email = Convert.ToString(dr1["c_email"]);
                        rd.Qualification = Convert.ToString(dr1["eduQualification"]);
                        rd.CurrentOrg = Convert.ToString(dr1["currentOrg"]);
                        rd.HiringLocation = Convert.ToInt32(dr1["HiringLocation"]);
                        rd.TotalExp = Convert.ToString(dr1["c_totalExp"]);
                        rd.TotalExpMonth = Convert.ToString(dr1["c_totalExpMonth"]);
                        rd.releventExp = Convert.ToString(dr1["c_releventExp"]);
                        rd.releventExpMonth = Convert.ToString(dr1["c_releventExpMonth"]);
                        rd.THID = Convert.ToString(dr1["THID"]);
                        rd.talentId = Convert.ToInt32(dr1["talentId"]);
                        rd.currency.Id = Convert.ToInt32(dr1["CurrencyId"]);
                        rd.currency.Name = Convert.ToString(dr1["Currency"]);
                        rd.primarySkill.Id = Convert.ToInt32(dr1["SkillId"]);
                        rd.primarySkill.SkillName = Convert.ToString(dr1["SkillName"]);
                        rd.recruiter.Id = Convert.ToString(dr1["recruiterid"]);
                        rd.recruiter.Name = Convert.ToString(dr1["recruiter"]);
                        rd.recruiter.Email = Convert.ToString(dr1["RecEmail"]);
                        rd._country.ID = Convert.ToInt32(dr1["CountryId"] == null || dr1["CountryId"].ToString() == "" ? "0" : dr1["CountryId"]);
                        rd._country.Name = Convert.ToString(dr1["CountryName"]);
                        rd._state.Name = Convert.ToString(dr1["StateName"]);
                        rd._state.ID = Convert.ToInt32(dr1["StateId"] == null || dr1["StateId"].ToString() == "" ? "0" : dr1["StateId"]);
                        rd._city.ID = Convert.ToInt32(dr1["CityID"]);
                        rd._city.Name = Convert.ToString(dr1["CityName"]);
                        rd.SalaryExp = Convert.ToString(dr1["salary_expected"]);
                        rd.Resume = Convert.ToString(dr1["c_resume"]);
                        rd.ResumePath = Convert.ToString(dr1["resume_path"]);
                        rd.CurrentSalary = Convert.ToString(dr1["current_ctc"]);
                        rd.joiningDate = Convert.ToString(dr1["JoiningDate"]);
                        rd.Identity.ID = Convert.ToInt16(dr1["IdentityId"].ToString() == "" ? 0 : dr1["IdentityId"]);
                        rd.Identity.Name = dr1["identity_name"].ToString();
                        rd.IdentityNo = Convert.ToString(dr1["IdentityNo"]);
                        rd.gender.Name = Convert.ToString(dr1["GenderName"]);
                        rd.gender.Id = Convert.ToInt32(dr1["Gender"] == null || dr1["Gender"].ToString() == "" ? "0" : dr1["Gender"]);
                        rd.sourceProfile.Name = Convert.ToString(dr1["profileName"]);
                        rd.sourceProfile.Id = Convert.ToInt32(dr1["ProfileId"] == null || dr1["ProfileId"].ToString() == "" ? "0" : dr1["ProfileId"]);
                        rd.EmploymentTypeId = Convert.ToInt32(dr1["EmploymentTypeId"]);
                        rd.requirementTypeId = Convert.ToInt32(dr1["requirementTypeId"]);
                        rd.requirementTypeName = Convert.ToString(dr1["requirementTypeName"]);
                        rd.IsConversionEmployee = Convert.ToInt32(dr1["IsConversionEmployee"]);
                        rd.IsDetailedFeedbackDisableForAccount = Convert.ToChar(dr1["IsDetailedFeedbackDisableForAccount"]);
                        rd.IsAIQuestionFeedbackEnable = Convert.ToChar(dr1["IsAIQuestionFeedbackEnable"]);
                        rd.IsAIQuestionGenEnable = Convert.ToChar(dr1["IsAIQuestionGenEnable"]);
                        rd.EntityId = Convert.ToInt32(dr1["EntityId"]);
                        rd.CandidateGradeId= Convert.ToInt32(dr1["CandidateGradeId"]);
                        rd.IsRenuTeam = Convert.ToChar(dr1["IsRenuTeam"]);
                        rd.isNewFeedback= Convert.ToChar(dr1["isNewFeedback"]);

                        if (dr1["JOB_DESCRIPTION"] != null)
                        { rd.JobDescription = Convert.ToString(dr1["JOB_DESCRIPTION"]); }

                        if (ds.Tables.Count > 1 && ds.Tables[1].Rows.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[1].Rows)
                            {
                                Round rd1 = new Round();
                                rd1.sequenceId = Convert.ToInt32(dr["seqId"]);
                                rd1.thId = Convert.ToString(dr["th_id"]);
                                rd1.talentId = Convert.ToString(dr["talentId"]);
                                rd1.RoundId = Convert.ToInt32(dr["roundId"]);
                                rd1.interviewType.Id = Convert.ToInt16(dr["interviewTypeId"].ToString() == "" ? "0" : dr["interviewTypeId"]);
                                rd1.interviewType.Type = dr["interviewType"].ToString();
                                rd1.IsCurrentRound = Convert.ToChar(dr["IsCurrentRound"]);
                                rd1.InterviewDate = dr["InterviewDate"].ToString();
                                rd1.interviewDateUTC = dr["interviewDateUtc"].ToString() == "" ? null : dr["interviewDateUtc"].ToString();
                                rd1.interviewTimeZone = dr["interviewTimeZone"].ToString() == "" ? null : dr["interviewTimeZone"].ToString();
                                rd1.offsetDate = Convert.ToInt32(dr["offSetDate"].ToString() == "" ? "0" : dr["offSetDate"]);
                                rd1.InterviewDuration = Convert.ToInt32(dr["InterviewDuration"].ToString() == "" ? "30" : dr["InterviewDuration"].ToString());
                                rd1.InterviewMode.id = Convert.ToInt16(dr["InterviewModeId"].ToString() == "" ? "0" : dr["InterviewModeId"]);
                                rd1.InterviewMode.mode = dr["InterviewMode"].ToString();
                                rd1.vanueOrLink = dr["vanueOrLink"].ToString();
                                rd1.interviewer.Id = dr["interviewerempid"].ToString();
                                rd1.interviewer.Name = dr["interviewer"].ToString();
                                rd1.interviewer.email = dr["InterviewerEmail"].ToString();
                                rd1.InterViewStatus.Id = Convert.ToInt16(dr["statusId"].ToString() == "" ? "0" : dr["statusId"]);
                                rd1.InterViewStatus.Status = dr["intStatus"].ToString();
                                rd1.TempStatusId = Convert.ToInt16(dr["TempStatusId"].ToString() == "" ? "0" : dr["TempStatusId"]);
                                rd1.testScore = dr["testScore"].ToString();
                                rd1.testAttachment = dr["testAttachment"].ToString();
                                rd1.Path = dr["Path"].ToString();
                                rd1.FinalAttachment = dr["FinalAttachment"].ToString();
                                rd1.FinalAttachmentPath = dr["FinalAttachmentPath"].ToString();
                                rd1.FinalAttachmentPathKey = dr["FinalAttachmentPathKey"].ToString();
                                rd1.FinalAttachment1 = dr["FinalAttachment1"].ToString();
                                rd1.FinalAttachment1Path = dr["FinalAttachment1Path"].ToString();
                                rd1.FinalAttachment1PathKey = dr["FinalAttachment1PathKey"].ToString();
                                rd1.FinalAttachment2 = dr["FinalAttachment2"].ToString();
                                rd1.FinalAttachment2Path = dr["FinalAttachment2Path"].ToString();
                                rd1.FinalAttachment2PathKey = dr["FinalAttachment2PathKey"].ToString();
                                rd1.remarks = dr["remarks"].ToString();
                                rd1._designation.Id = Convert.ToInt16(dr["designationId"].ToString() == "" ? "0" : dr["designationId"]);
                                rd1._designation.desigName = dr["Designation"].ToString();
                                rd1.CTC = dr["CTC"].ToString();
                                rd1.joiningBonus = dr["joiningBonus"].ToString();
                                rd1.NoticeBuyOut = dr["NoticeBuyOut"].ToString();
                                rd1.TravelExp = dr["TravelExp"].ToString();
                                rd1.RelocationExp = dr["RelocationExp"].ToString();
                                rd1.RetentionBonus = dr["RetentionBonus"].ToString();
                                rd1.salary = dr["salary"].ToString();
                                rd1.primarySkill.Id = Convert.ToInt16(dr["primarySkillId"].ToString() == "" ? "0" : dr["primarySkillId"]);
                                rd1.primarySkill.SkillName = dr["primarySkill"].ToString();
                                rd1.offeredby.Id = dr["offeredById"].ToString();
                                rd1.offeredby.Name = dr["offeredBy"].ToString();
                                rd1.offeredOn = dr["offeredOn"].ToString();
                                rd1.recruiter.Id = dr["recruiterId"].ToString();
                                rd1.recruiter.Name = dr["recruiter"].ToString();

                                rd1.hrFinal_Remarks = dr["hrFinal_Remarks"].ToString();
                                rd1.finalDecision = dr["finalDecision"].ToString();
                                rd1.strengths = dr["strengths"].ToString();
                                rd1.limitations = dr["limitations"].ToString();
                                rd1.technical = dr["technical"].ToString();
                                rd1.nonTechnical = dr["nonTechnical"].ToString();
                                rd1.techRemarks = dr["techRemarks"].ToString();
                                rd1.remarkNextLevel = dr["remarkNextLevel"].ToString();
                                rd1.ForGroomable = dr["ForGroomable"].ToString();
                                rd1.GroomableArea1 = dr["GroomableArea1"].ToString();
                                rd1.GroomableArea2 = dr["GroomableArea2"].ToString();
                                rd1.GroomableArea3 = dr["GroomableArea3"].ToString();
                                rd1.CandidateCalendarID = Convert.ToString(dr["CandidateCalendarId"]);
                                rd1.PanelCalendarID = Convert.ToString(dr["PanelCalendarId"]);
                                rd1.MSTeamMeetingId = Convert.ToString(dr["MSTeamMeetingId"]);
                                rd1.IsPicturePresent = Convert.ToString(dr["IsPicturePresent"]);
                                rd1.PrevStatus.Id = Convert.ToInt16(dr["PrevStatusId"].ToString() == "" ? "0" : dr["PrevStatusId"]);
                                rd1.PrevStatus.Status = dr["PrevStatusName"].ToString();
                                rd1.interviewBy = dr["interviewBy"].ToString();
                                rd1.AssessmentDate = dr["AssessmentDate"].ToString() == "" ? null : dr["AssessmentDate"].ToString();
                                rd1.ExternalAgency.Id = Convert.ToInt32(dr["ExternalAgency"].ToString() == "" ? "0" : dr["ExternalAgency"]);
                                rd1.ExternalAgency.name = dr["ExternalAgencyName"].ToString();
                                rd1.VideoMatchPercent = dr["VideoMatchPercent"].ToString() == "" ? "0" : dr["VideoMatchPercent"].ToString();
                                rd1.VideoMatch = Convert.ToString(dr["VideoMatch"]);
                                rd1.PanelConcent = Convert.ToString(dr["PanelConcent"]);
                                rd1.OfferLetterAtt = dr["OfferLetterAttName"].ToString();
                                rd1.OfferLetterAttPath = dr["OfferLetterAttPath"].ToString();
                             //   rd1.OfferCompany.ID = Convert.ToInt32(dr1["OfferInHandCompanyId"] == null || dr1["OfferInHandCompanyId"].ToString() == "" ? "0" : dr1["OfferInHandCompanyId"]);
                                
                                rd1.OfferCompanyName = dr["OfferInHandCompany"].ToString();
                                rd1.IsInHandOffer = Convert.ToString(dr["OfferInHand"]);
                                rd1.HRConcent = Convert.ToString(dr["OfferInHandConset"]);
                                rd1.PanelConcent = Convert.ToString(dr["PanelConcent"]);
                                rd1.OfferInHandAmount = Convert.ToString(dr["OfferInHandCTC"]);
                                rd1.OfferLetterAtt = Convert.ToString(dr["OfferLetterAttName"]);
                                rd1.OfferLetterAttPath = Convert.ToString(dr["OfferLetterAttPath"]);
                                rd1.AnnualVariablePay = Convert.ToInt16(dr["AnnualVariablePay"].ToString() == "" ? "0" : dr["AnnualVariablePay"]);

                                rd1.familiarProgramTechnolog = dr["familiarProgramTechnolog"].ToString();
                                rd1.technicalSkillsEvaluat = dr["technicalSkillsEvaluat"].ToString();
                                rd1.candidateCodingChallenge = dr["candidateCodingChallenge"].ToString();
                                rd1.assessRoleKnowledg = dr["assessRoleKnowledg"].ToString();
                                rd1.candidateApprochComplexPrblm = dr["candidateApprochComplexPrblm"].ToString();
                                rd1.candidatePrblmSolvingApproch = dr["candidatePrblmSolvingApproch"].ToString();
                                rd1.candidatePossesIndustryDomExp = dr["candidatePossesIndustryDomExp"].ToString();
                                rd1.candidateFitForInfogain = dr["candidateFitForInfogain"].ToString();
                                rd1.candidateAbilityToAdoptChangeWork = dr["candidateAbilityToAdoptChangeWork"].ToString();
                                rd1.isDetailedFeedbackSaveOrDraft = dr["isDetailedFeedbackSaveOrDraft"].ToString();

                                rd1.coderByteTestId = dr["coderByteTestId"].ToString();
                                rd1.coderBytePublicUrl = dr["coderBytePublicUrl"].ToString();
                                rd1.coderBytePrivateUrl = dr["coderBytePrivateUrl"].ToString();
                                rd1.ReasonNotOptId = Convert.ToInt16(dr["ReasonNotOptId"].ToString() == "" ? "0" : dr["ReasonNotOptId"]);
                                rd1.coderByteReportUrl = dr["coderByteReportUrl"].ToString();

                                rd1.ReasonNotOptName = dr["ReasonNotOptName"].ToString();
                                rd1.ReasonforOptId = Convert.ToInt16(dr["ReasonforOptId"].ToString() == "" ? "0" : dr["ReasonforOptId"]);

                                rd1.ReasonforOptName = dr["ReasonforOptName"].ToString();
                                rd1.coderByteDisplayName = dr["coderByteDisplayName"].ToString();
                                rd1.Final_Score = Convert.ToInt16(dr["coderByteFinalScore"].ToString() == "" ? "0" : dr["coderByteFinalScore"]);
                                rd1.DefaultAssessmentByChangeReason = Convert.ToInt16(dr["DefaultAssessmentByChangeReason"].ToString() == "" ? "0" : dr["DefaultAssessmentByChangeReason"]);
                                rd1.Qualifying_Score = Convert.ToInt16(dr["coderByteQualifyingScore"].ToString() == "" ? "0" : dr["coderByteQualifyingScore"]);
                                rd1.cheating_flag = dr["cheatingFlag"].ToString();
                                rd1.AssessmentStatus = dr["AssessmentStatus"].ToString();
                                rd1.IsFeedbackSaveOrDraft = Convert.ToChar(dr["IsFeedbackSaveOrDraft"]);
                                rd1.IsAIQuestionFeedbackEnable = Convert.ToChar(dr["IsAIQuestionFeedbackEnable"]);
                                rd1.InterviewLocationId = dr["InterviewLocationId"].ToString();
                                rd1.InterviewLocationName = dr["InterviewLocationName"].ToString();
                                rd1.InterviewLocationAddress = dr["InterviewLocationAddress"].ToString();
                                rd1.isPanelSaveQuestion = Convert.ToChar(dr["isPanelSaveQuestion"]);
                                rd1.isNewFeedback = Convert.ToChar(dr["isNewFeedback"]);
                                rd1.Recommendation = dr["Recommendation"].ToString();
                                rd1.SentimentOrientation = dr["SentimentOrientation"].ToString();
                                rd1.testAttachmentKey = dr["testAttachmentKey"].ToString();
                                rd1.OfferLetterAttNameKey = dr["OfferLetterAttNameKey"].ToString();

                                if (ds.Tables.Count > 2 && ds.Tables[2].Rows.Count > 0)
                                {
                                    DataView dv = new DataView(ds.Tables[2]);
                                    dv.RowFilter = "roundid=" + dr["roundId"].ToString();

                                    foreach (DataRowView rowView in dv)
                                    {
                                        DataRow drTraits = rowView.Row;
                                        HRTraitsDisplay hrt = new HRTraitsDisplay();
                                        hrt.Traits = Convert.ToInt32(drTraits["TraitId"]);
                                        hrt.TraitName = drTraits["trait"].ToString();
                                        hrt.Desc = drTraits["traitDesc"].ToString();
                                        hrt.Comments = drTraits["comments"].ToString();
                                        hrt.hrRating = Convert.ToInt16(drTraits["hrrating"]);
                                        rd1.hrTraits.Add(hrt);
                                    }
                                }
                                if (ds.Tables.Count > 3 && ds.Tables[3].Rows.Count > 0)
                                {
                                    DataView dv = new DataView(ds.Tables[3]);
                                    dv.RowFilter = "roundid=" + dr["roundId"].ToString();
                                    foreach (DataRowView rowView in dv)
                                    {
                                        DataRow drArea = rowView.Row;
                                        TechnicalAreas ta = new TechnicalAreas();
                                        ta.Area = drArea["area"].ToString();
                                        ta.rating = Convert.ToDecimal(drArea["rating"].ToString());
                                        ta.actionvisible = Convert.ToInt32(drArea["actionvisible"] == null || drArea["actionvisible"].ToString() == "" ? "0" : drArea["actionvisible"]);
                                        rd1.areas.Add(ta);
                                    }
                                }
                                if (ds.Tables.Count > 4 && ds.Tables[4].Rows.Count > 0)
                                {
                                    DataView dv = new DataView(ds.Tables[4]);
                                    dv.RowFilter = "roundid=" + dr["roundId"].ToString();

                                    foreach (DataRowView rowView in dv)
                                    {
                                        DataRow drRecruiter = rowView.Row;
                                        Interviewer hrt = new Interviewer();
                                        hrt.Id = drRecruiter["EmpID"].ToString();
                                        hrt.Name = drRecruiter["EmpName"].ToString();
                                        hrt.email = drRecruiter["EmailID"].ToString();
                                        rd1.AdditionalInterviewer.Add(hrt);
                                    }
                                }

                                if (ds.Tables.Count > 5 && ds.Tables[5].Rows.Count > 0)
                                {
                                    DataView dv = new DataView(ds.Tables[5]);
                                    dv.RowFilter = "roundid=" + dr["roundId"].ToString();

                                    foreach (DataRowView rowView in dv)
                                    {
                                        DataRow drSkill = rowView.Row;
                                        ScreenRoundAdditionalSkillsDisplay srad = new ScreenRoundAdditionalSkillsDisplay();
                                        srad.skillid = Convert.ToInt32(drSkill["skillId"]);
                                        srad.skill = drSkill["skill"].ToString();
                                        //srad.expYear = Convert.ToInt32(drSkill["expYear"]);
                                        //srad.expMonth = Convert.ToInt32(drSkill["expMonth"]);
                                        //srad.rating = Convert.ToInt32(drSkill["rating"]);

                                        srad.expYear = Convert.ToInt16(drSkill["expYear"].ToString() == "" ? "0" : drSkill["expYear"]);
                                       
                                        srad.expMonth = Convert.ToInt16(drSkill["expMonth"].ToString() == "" ? "0" : drSkill["expMonth"]);
                                        
                                        srad.rating = Convert.ToInt16(drSkill["rating"].ToString() == "" ? "0" : drSkill["rating"]);


                                        rd1.screenRoundAdditionalSkills.Add(srad);
                                    }
                                }

                                if (ds.Tables.Count > 6 && ds.Tables[6].Rows.Count > 0)
                                {
                                    DataView dv = new DataView(ds.Tables[6]);
                                    dv.RowFilter = "roundid=" + dr["roundId"].ToString();
                                    foreach (DataRowView rowView in dv)
                                    {
                                        DataRow drAutoFD = rowView.Row;
                                        autoQuestionFeedback fd = new autoQuestionFeedback();
                                        fd.QuestionAuto = drAutoFD["QuestionAuto"].ToString();
                                        fd.AutoQAns = drAutoFD["AutoQAns"].ToString();
                                        fd.rating = Convert.ToInt32(drAutoFD["rating"].ToString());
                                        fd.Type = Convert.ToInt32(drAutoFD["Type"].ToString());
                                        rd1.autoQuestionFeedback.Add(fd);
                                    }
                                }


                                if (ds.Tables.Count > 7 && ds.Tables[7].Rows.Count > 0)
                                {

                                    DataView dv = new DataView(ds.Tables[7]);
                                    dv.RowFilter = "roundid=" + dr["roundId"].ToString();
                                    foreach (DataRowView rowView in dv)
                                    {
                                        DataRow drArea = rowView.Row;
                                        Area ta = new Area();
                                        ta.name = drArea["area"].ToString();
                                        ta.rating = Convert.ToDecimal(drArea["rating"].ToString());
                                        rd1.AIAreaRating.Add(ta);
                                    }
                                   
                                }
                                //AI feedback
                                if (ds.Tables.Count > 8 && ds.Tables[8].Rows.Count > 0)
                                {

                                    DataView dv = new DataView(ds.Tables[8]);
                                    dv.RowFilter = "roundid=" + dr["roundId"].ToString();
                                    foreach (DataRowView rowView in dv)
                                    {
                                        DataRow drArea = rowView.Row;
                                        Questions ta = new Questions();
                                        ta.name = drArea["Question"].ToString();
                                        ta.rating = Convert.ToDecimal(drArea["rating"].ToString());
                                        rd1.AIQuestRating.Add(ta);
                                    }

                                }


                                rd.roundList.Add(rd1);
                            }
                        }
                        objlist = rd;
                    }
                }


                else if (typeof(T) == typeof(candidateDetailsInfo))
                {
                    candidateDetailsInfo rd = new candidateDetailsInfo();
                    if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr1 = ds.Tables[0].Rows[0];
                        rd.cid = Convert.ToInt32(dr1["cid"]);
                        rd.Name = Convert.ToString(dr1["Name"]);
                        rd.firstName = Convert.ToString(dr1["FirstName"]);
                        rd.middleName = Convert.ToString(dr1["MiddleName"]);
                        rd.lastName = Convert.ToString(dr1["LastName"]);
                        rd.Email = Convert.ToString(dr1["email"]);
                        rd.phone = Convert.ToString(dr1["phone"]);
                        rd.CubeID = Convert.ToInt32(dr1["CubeID"] == null || dr1["CubeID"].ToString() == "" ? "0" : dr1["CubeID"]);
                        rd.CubeClusterID = Convert.ToInt32(dr1["CubeClusterID"] == null || dr1["CubeClusterID"].ToString() == "" ? "0" : dr1["CubeClusterID"]);
                        rd.CubeRoleID = Convert.ToInt32(dr1["CubeRoleID"] == null || dr1["CubeRoleID"].ToString() == "" ? "0" : dr1["CubeRoleID"]);
                        rd.salaryDetails.current = Convert.ToString(dr1["currentSalary"]);
                        rd.CubeName= Convert.ToString(dr1["CubeName"]);
                        rd.CubeClusterName= Convert.ToString(dr1["ClusterName"]);
                        rd.CubeRoleName= Convert.ToString(dr1["CubeRoleName"]);
                        rd.salaryDetails.expected = Convert.ToString(dr1["expectedSalary"]);
                        rd.salaryDetails.SalaryType = Convert.ToInt32(dr1["SalaryType"] == null || dr1["SalaryType"].ToString() == "" ? "0" : dr1["SalaryType"]);
                        rd.currency.id = Convert.ToInt32(dr1["CurrencyId"]);
                        rd.currency.name = Convert.ToString(dr1["currencyName"]);
                        // rd.country.id = Convert.ToInt32(dr1["countryId"]);
                        rd.country.id = Convert.ToInt32(dr1["countryId"] == null || dr1["countryId"].ToString() == "" ? "0" : dr1["countryId"]);
                        rd.country.name = Convert.ToString(dr1["countryName"]);
                        rd.state.name = Convert.ToString(dr1["StateName"]);
                        rd.state.id = Convert.ToInt32(dr1["StateId"] == null || dr1["StateId"].ToString() == "" ? "0" : dr1["StateId"]);
                        rd.HiringLocation.name = Convert.ToString(dr1["locationName"]);
                        rd.HiringLocation.id = Convert.ToInt32(dr1["HiringLocationId"] == null || dr1["HiringLocationId"].ToString() == "" ? "0" : dr1["HiringLocationId"]);
                        rd.city.id = Convert.ToInt32(dr1["cityId"]);
                        rd.city.name = Convert.ToString(dr1["cityName"]);
                        rd.candidateType.id = Convert.ToInt32(dr1["candidateTypeId"].ToString() == "" ? 0 : dr1["candidateTypeId"]);
                        rd.candidateType.name = Convert.ToString(dr1["candidateTypeName"]);
                        rd.totalExperience.year = Convert.ToString(dr1["totalExp"]);
                        rd.totalExperience.month = Convert.ToString(dr1["totalExpMonth"]);
                        rd.releventExperience.year = Convert.ToString(dr1["releventExp"]);
                        rd.releventExperience.month = Convert.ToString(dr1["releventExpMonth"]);
                        rd.Identity.id = Convert.ToInt32(dr1["identityId"].ToString() == "" ? 0 : dr1["identityId"]);
                        rd.Identity.name = dr1["identityName"].ToString();
                        rd.IdentityNo = Convert.ToString(dr1["idNumber"]);
                        rd.CurrentOrg.name = Convert.ToString(dr1["currentOrg"] == null ? "" : dr1["currentOrg"]);
                        rd.CurrentOrg.id = Convert.ToInt32(dr1["OrgID"] == null || dr1["OrgID"].ToString() == "" ? "0" : dr1["OrgID"]);
                        rd.eduQualification.name = Convert.ToString(dr1["eduQualification"]);
                        rd.eduQualification.id = Convert.ToInt32(dr1["EduID"] == null || dr1["EduID"].ToString() == "" ? "0" : dr1["EduID"]);
                        rd.joiningDate = Convert.ToString(dr1["tentativeJoiningDate"]);
                        rd.primarySkill.id = Convert.ToInt32(dr1["skillId"]);
                        rd.primarySkill.name = Convert.ToString(dr1["skillName"]);
                        rd.resume.name = Convert.ToString(dr1["c_resume"]);
                        rd.resume.path = Convert.ToString(dr1["resume_path"]);
                        rd.primaryRec.id = Convert.ToInt32(dr1["primaryRecId"]);
                        rd.primaryRec.name = Convert.ToString(dr1["primaryRec"]);
                        rd.secondaryRec.id = Convert.ToInt32(dr1["SecondaryRecId"]);
                        rd.secondaryRec.name = Convert.ToString(dr1["secondaryRec"]);
                        rd.Gender.id = Convert.ToInt32(dr1["GenderId"] == null || dr1["GenderId"].ToString() == "" ? "0" : dr1["GenderId"]);
                        rd.Gender.name = Convert.ToString(dr1["GenderName"]);
                        rd.Division.id = Convert.ToInt32(dr1["divisionID"] == null || dr1["divisionID"].ToString() == "" ? "0" : dr1["divisionID"]);
                        rd.Division.name = Convert.ToString(dr1["divisionName"]);
                        rd.JobFamilyI.id = Convert.ToInt32(dr1["JobFamilyID"] == null || dr1["JobFamilyID"].ToString() == "" ? "0" : dr1["JobFamilyID"]);
                        rd.JobFamilyI.name = Convert.ToString(dr1["jobFamilyName"]);
                        rd.Grade.id = Convert.ToInt32(dr1["gradeId"] == null || dr1["gradeId"].ToString() == "" ? "0" : dr1["gradeId"]);
                        rd.Grade.name = Convert.ToString(dr1["gradeName"]);
                        rd.Practice.id = Convert.ToInt32(dr1["practiceId"] == null || dr1["practiceId"].ToString() == "" ? "0" : dr1["practiceId"]);
                        rd.Practice.name = Convert.ToString(dr1["PracticeName"]);
                        rd.EmpUnit.id = Convert.ToInt32(dr1["EmpUnit"] == null || dr1["EmpUnit"].ToString() == "" ? "0" : dr1["EmpUnit"]);
                        rd.EmpUnit.name = Convert.ToString(dr1["EmpUnitName"]);
                        rd.dob = Convert.ToString(dr1["dob"]);
                        rd.GradeBand = Convert.ToString(dr1["gradeBand"] == null || dr1["gradeBand"].ToString() == "" ? "" : dr1["gradeBand"]);
                        rd.jobfamilycategory = Convert.ToString(dr1["jobfamilycategory"] == null || dr1["jobfamilycategory"].ToString() == "" ? "" : dr1["jobfamilycategory"]);
                        rd.countryCode = Convert.ToInt32(dr1["countryCode"] == null || dr1["countryCode"].ToString() == "" ? "0" : dr1["countryCode"]);
                        objlist = rd;
                    }
                }

                else if (typeof(T) == typeof(InterviewRoundDetailsVid))
                {
                    InterviewRoundDetailsVid rd = new InterviewRoundDetailsVid();
                    if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr1 = ds.Tables[0].Rows[0];
                        rd.cid = Convert.ToInt32(dr1["cid"]);
                        rd.CurrentSharePointIdVideo = Convert.ToString(dr1["CurrentSharePointIdVideo"] == null || dr1["CurrentSharePointIdVideo"].ToString() == "" ? "" : dr1["CurrentSharePointIdVideo"]);
                        rd.PrevSharePointIdVideo = Convert.ToString(dr1["PrevSharePointIdVideo"] == null || dr1["PrevSharePointIdVideo"].ToString() == "" ? "" : dr1["PrevSharePointIdVideo"]);
                        rd.FileNameVideoCurrent = Convert.ToString(dr1["FileNameVideoCurrent"] == null || dr1["FileNameVideoCurrent"].ToString() == "" ? "" : dr1["FileNameVideoCurrent"]);
                        rd.FileNameVideoPrev = Convert.ToString(dr1["FileNameVideoPrev"] == null || dr1["FileNameVideoPrev"].ToString() == "" ? "" : dr1["FileNameVideoPrev"]);
                        rd.RoundIdPrev = Convert.ToInt32(dr1["RoundIdPrev"] == null || dr1["RoundIdPrev"].ToString() == "" ? "0" : dr1["RoundIdPrev"]);
                        rd.RoundIdCurrent = Convert.ToInt32(dr1["RoundIdCurrent"] == null || dr1["RoundIdCurrent"].ToString() == "" ? "0" : dr1["RoundIdCurrent"]);

                        rd.FileNameTrans = Convert.ToString(dr1["FileNameTransCurrent"] == null || dr1["FileNameTransCurrent"].ToString() == "" ? "" : dr1["FileNameTransCurrent"]);
                        rd.SharePointIdTrans = Convert.ToString(dr1["SharePointIdTrans"] == null || dr1["SharePointIdTrans"].ToString() == "" ? "" : dr1["SharePointIdTrans"]);


                        objlist = rd;
                    }
                }
                else if (typeof(T) == typeof(InterviewRoundDetailsTrans))
                {
                    InterviewRoundDetailsTrans rd = new InterviewRoundDetailsTrans();
                    if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr1 = ds.Tables[0].Rows[0];
                        rd.cid = Convert.ToInt32(dr1["cid"]);
                        rd.thid = Convert.ToInt32(dr1["thid"]);
                        rd.StatusId = Convert.ToInt32(dr1["statusId"]);
                        rd.FeedbackProvided = Convert.ToChar(dr1["FeedbackProvided"]);
                        rd.InterviewTypeId = Convert.ToInt32(dr1["InterviewTypeId"]);
                        rd.RoundId = Convert.ToInt32(dr1["RoundId"] == null || dr1["RoundId"].ToString() == "" ? "0" : dr1["RoundId"]);
                        rd.FileNameTrans = Convert.ToString(dr1["FileNameTransScript"] == null || dr1["FileNameTransScript"].ToString() == "" ? "" : dr1["FileNameTransScript"]);
                        rd.SharePointIdTrans = Convert.ToString(dr1["SharePointIdTrans"] == null || dr1["SharePointIdTrans"].ToString() == "" ? "" : dr1["SharePointIdTrans"]);
                        rd.FilePathTrans = Convert.ToString(dr1["FilePathTransScript"] == null || dr1["FilePathTransScript"].ToString() == "" ? "" : dr1["FilePathTransScript"]);

                        

                        objlist = rd;
                    }
                }
                else if (typeof(T) == typeof(EmailTemplate))
                {
                    EmailTemplate email = new EmailTemplate();
                    if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        email.Id = Convert.ToInt32(dr["Id"]);
                        email.TemplateName = dr["TemplateName"].ToString();
                        email.Subject = dr["Subject"].ToString();
                        email.Body = dr["Body"].ToString();
                    }
                    objlist = email;
                }
                else if (typeof(T) == typeof(List<InterviewMode>))
                {
                    List<InterviewMode> Im = new List<InterviewMode>();
                    if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        InterviewMode ii = null;
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            ii = new InterviewMode();
                            ii.id = Convert.ToInt32(dr["Id"]);
                            ii.mode = dr["mode"].ToString();
                            Im.Add(ii);
                        }
                    }
                    objlist = Im;
                }
                else if (typeof(T) == typeof(List<CandidateType>))
                {
                    List<CandidateType> Im = new List<CandidateType>();
                    if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        CandidateType ii = null;
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            ii = new CandidateType();
                            ii.typeId = Convert.ToInt32(dr["typeId"]);
                            ii.statusName = dr["statusName"].ToString();
                            Im.Add(ii);
                        }
                    }
                    objlist = Im;
                }

                else if (typeof(T) == typeof(List<IdentityMaster>))
                {
                    List<IdentityMaster> Im = new List<IdentityMaster>();
                    if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        IdentityMaster ii = null;
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            ii = new IdentityMaster();
                            ii.id = Convert.ToInt32(dr["ID"]);
                            ii.identity_name = dr["identity_name"].ToString();
                            Im.Add(ii);
                        }
                    }
                    objlist = Im;
                }

                else if (typeof(T) == typeof(List<IdentityMaster>))
                {
                    List<IdentityMaster> Im = new List<IdentityMaster>();
                    if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        IdentityMaster ii = null;
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            ii = new IdentityMaster();
                            ii.id = Convert.ToInt32(dr["ID"]);
                            ii.identity_name = dr["identity_name"].ToString();
                            Im.Add(ii);
                        }
                    }
                    objlist = Im;
                }

                else if (typeof(T) == typeof(List<CurrencyMaster>))
                {
                    List<CurrencyMaster> Im = new List<CurrencyMaster>();
                    if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        CurrencyMaster ii = null;
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            ii = new CurrencyMaster();
                            ii.id = Convert.ToInt32(dr["ID"]);
                            ii.currency_name = dr["currency_name"].ToString();
                            ii.currency_code = dr["currency_code"].ToString();
                            Im.Add(ii);
                        }
                    }
                    objlist = Im;
                }

                else if (typeof(T) == typeof(List<InterviewStatus1>))
                {
                    List<InterviewStatus1> Im = new List<InterviewStatus1>();
                    if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        InterviewStatus1 ii = null;
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            ii = new InterviewStatus1();
                            ii.statusId = Convert.ToInt32(dr["statusId"]);
                            ii.statusName = dr["statusName"].ToString();
                            ii.shortname = dr["shortname"].ToString();
                            Im.Add(ii);
                        }
                    }
                    objlist = Im;
                }
                else if (typeof(T) == typeof(TotalAssignedLoCount))
                {
                    TotalAssignedLoCount Tc = new TotalAssignedLoCount();
                    if (ds != null && ds.Tables.Count == 1)
                    {
                        Tc.Offshore = Convert.ToInt32(ds.Tables[0].Rows[0]["Offshore"]);
                        Tc.Onshore = Convert.ToInt32(ds.Tables[0].Rows[0]["Onsite"]);
                        Tc.BillingLossOffshore = Convert.ToInt32(ds.Tables[0].Rows[0]["BillingLossOffshore"]);
                        Tc.BillingLossOnsite = Convert.ToInt32(ds.Tables[0].Rows[0]["BillingLossOnsite"]);
                    }
                    else { Tc.Offshore = 0; Tc.Onshore = 0; Tc.BillingLossOffshore = 0; Tc.BillingLossOnsite = 0; }
                    objlist = Tc;
                }

                else if (typeof(T) == typeof(Day1InductionInviteMeetingInfo))
                {
                    Day1InductionInviteMeetingInfo day1iInfo = new Day1InductionInviteMeetingInfo();
                    if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr1 = ds.Tables[0].Rows[0];
                        day1iInfo.InviteDate = Convert.ToString(dr1["InviteDate"]);
                        day1iInfo.JoiningDate = Convert.ToString(dr1["JoiningDate"]);
                        day1iInfo.locationId = Convert.ToInt32(dr1["LocationId"]);
                        day1iInfo.ModifiedByEmailId = dr1["modifiedByEmail"].ToString();
                        day1iInfo.ModifiedByName = dr1["modifiedByName"].ToString();
                        day1iInfo.ModifiedByEmpId = dr1["modifiedBy"].ToString();
                        if (ds.Tables.Count > 1 && ds.Tables[1].Rows.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[1].Rows)
                            {
                                Day1InductionInviteMeetingList day1iInfoList = new Day1InductionInviteMeetingList();
                                day1iInfoList.InviteDate = dr["StartDateTime"].ToString();
                                day1iInfoList.InviteEndDate = dr["EndDateTime"].ToString();
                                day1iInfoList.InviteDateUTC = dr["StartDateTimeUTC"].ToString() == "" ? null : dr["StartDateTimeUTC"].ToString();
                                day1iInfoList.InviteEndDateUTC = dr["EndDateTimeUTC"].ToString() == "" ? null : dr["EndDateTimeUTC"].ToString();
                                day1iInfoList.InviteDateDuration = Convert.ToInt32(dr["Duration"]);
                                day1iInfoList.Id = Convert.ToInt32(dr["Id"]);
                                day1iInfoList.MId = Convert.ToInt32(dr["MID"]);
                                day1iInfoList.EventName = dr["EventName"].ToString();


                                if (ds.Tables.Count > 2 && ds.Tables[2].Rows.Count > 0)
                                {
                                    DataView dv = new DataView(ds.Tables[2]);
                                    dv.RowFilter = "MID='" + dr["MID"].ToString() + "' and InvId='" + dr["InvId"].ToString() + "'";

                                    foreach (DataRowView rowView in dv)
                                    {
                                        DataRow drSpocM = rowView.Row;
                                        Day1InductionInviteMeetingSpoc spocM = new Day1InductionInviteMeetingSpoc();
                                        spocM.MId = Convert.ToInt32(drSpocM["MID"]);
                                        spocM.InvId = Convert.ToInt32(drSpocM["InvId"]);
                                        spocM.EmailId = drSpocM["EmailId"].ToString();
                                        spocM.Name = drSpocM["Name"].ToString();
                                        spocM.EmpId = drSpocM["EmpId"].ToString();
                                        Day1InductionInviteMeetingList dlm = new Day1InductionInviteMeetingList();
                                        day1iInfoList.Day1InductionInviteMeetingSpoc.Add(spocM);
                                    }
                                }

                                if (ds.Tables.Count > 3 && ds.Tables[3].Rows.Count > 0)
                                {
                                    DataView candVInd = new DataView(ds.Tables[3]);
                                    DataView candVCommon = new DataView(ds.Tables[3]);
                                    //  candV.RowFilter = "InvId='" + dr["InvId"].ToString() + "'";
                                    candVInd.RowFilter = "MID='" + dr["MID"].ToString() + "' and InvId='" + dr["InvId"].ToString() + "'";
                                    // candV.RowFilter = "IsNull(MID, '') = '' and InvId='" + dr["InvId"].ToString() + "'";
                                    candVCommon.RowFilter = "MID IS null and InvId='" + dr["InvId"].ToString() + "'";

                                    foreach (DataRowView rowView in candVInd)
                                    {
                                        DataRow candVMS = rowView.Row;
                                        Day1InductionInviteMeetingCandidate candVM = new Day1InductionInviteMeetingCandidate();
                                        candVM.MId = Convert.ToInt32(candVMS["MID"]);
                                        candVM.InvId = Convert.ToInt32(candVMS["InvId"]);
                                        candVM.EmailId = candVMS["EmailId"].ToString();
                                        candVM.Name = candVMS["Name"].ToString();
                                        candVM.EmpId = candVMS["EmpId"].ToString();
                                        day1iInfoList.Day1InductionInviteMeetingCandidate.Add(candVM);
                                    }

                                    foreach (DataRowView rowView in candVCommon)
                                    {
                                        DataRow candVMS = rowView.Row;
                                        Day1InductionInviteMeetingCandidate candVMCoomon = new Day1InductionInviteMeetingCandidate();
                                        // candVM.MId = Convert.ToInt32(candVMS["MID"]);
                                        candVMCoomon.InvId = Convert.ToInt32(candVMS["InvId"]);
                                        candVMCoomon.EmailId = candVMS["EmailId"].ToString();
                                        candVMCoomon.Name = candVMS["Name"].ToString();
                                        candVMCoomon.EmpId = candVMS["EmpId"].ToString();
                                        day1iInfoList.Day1InductionInviteMeetingCandidateCommon.Add(candVMCoomon);
                                    }
                                }

                                day1iInfo.Day1InductionInviteMeetingList.Add(day1iInfoList);
                            }
                        }


                        objlist = day1iInfo;
                    }
                }

                else if (typeof(T) == typeof(JoiningItineraryList))
                {
                    JoiningItineraryList JoiningItineraryListInfo = new JoiningItineraryList();
                    if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr1 = ds.Tables[0].Rows[0];

                        DataView listInv = new DataView(ds.Tables[0]);
                        foreach (DataRowView rowView in listInv)
                        {
                            DataRow drListEv = rowView.Row;
                            JoiningItineraryListEvent drListEvData = new JoiningItineraryListEvent();
                            drListEvData.StartTime = Convert.ToString(drListEv["StartTime"]);
                            drListEvData.EndTime = Convert.ToString(drListEv["EndTime"]);
                            drListEvData.Duration = Convert.ToInt32(drListEv["Duration"]);
                            drListEvData.EventName = drListEv["Event"].ToString();
                            drListEvData.EventId = Convert.ToInt32(drListEv["Id"]);
                            if (ds.Tables.Count > 1 && ds.Tables[1].Rows.Count > 0)
                            {
                                DataView dv = new DataView(ds.Tables[1]);
                                dv.RowFilter = "Id=" + drListEv["Id"].ToString();
                                JoiningItineraryListEvent ListEventS = new JoiningItineraryListEvent();

                                foreach (DataRowView rowView1 in dv)
                                {
                                    DataRow drSpocM = rowView1.Row;
                                    JoiningItineraryListMeetingSpoc spocM = new JoiningItineraryListMeetingSpoc();

                                    spocM.EventId = Convert.ToInt32(drListEv["Id"]);
                                    spocM.EmailId = drSpocM["Emailid"].ToString();
                                    spocM.Name = drSpocM["EmpName"].ToString();
                                    spocM.EmpId = drSpocM["EmpId"].ToString();
                                    drListEvData.JoiningItineraryListMeetingSpoc.Add(spocM);

                                }

                                JoiningItineraryListInfo.JoiningItineraryListEvent.Add(drListEvData);
                            }

                        }





                        objlist = JoiningItineraryListInfo;
                    }
                }
                else if (typeof(T) == typeof(JobPostRequest))
                {
                    JobPostRequest rd = new JobPostRequest();
                    int IsBaseLocationThId = 0;
                    string[] LocationIdForCity;
                    string[] LocationIdForCountry;

                    if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr1 = ds.Tables[0].Rows[0];
               
                        rd.title = Convert.ToString(dr1["title"]);
                        rd.jobType = ConfigurationManager.AppSettings["NaukrijobType"].ToString();
                        rd.description = Convert.ToString(dr1["JobDescription"]);
                        rd.minSalary = Convert.ToInt32(dr1["MinSalary"]);
                        rd.maxSalary = Convert.ToInt32(dr1["MaxSalary"]);
                        rd.salaryCurrency = Convert.ToString(dr1["SalaryType"]);
                        rd.industry = Convert.ToString(dr1["Industry"]);
                        rd.workMode = Convert.ToString(dr1["Workmode"]);
                        rd.employmentType = Convert.ToString(dr1["EmployementType"]);
                        rd.orgName = Convert.ToString(dr1["OrgName"]);
                        rd.minWorkExperience = Convert.ToInt32(dr1["MinWorkExperience"]);
                        rd.maxWorkExperience = Convert.ToInt32(dr1["MaxWorkExperience"]);
                        rd.showSalary = Convert.ToChar(dr1["showSalary"]).ToString()== "Y" ? true : false;
                        rd.distributeTo = new string[] { Convert.ToString(dr1["distributeTo"]) };
                        IsBaseLocationThId = Convert.ToInt32(dr1["IsBaseLocationThId"]);
                        if (rd.jobId != null)
                        {
                            rd.referenceCode = null;
                        }
                        else
                        {
                            rd.referenceCode = Convert.ToString(dr1["ReferenceCode"]);
                        }
                       

                        if (ds.Tables.Count > 1 && ds.Tables[1].Rows.Count > 0)
                        {
                            List<string> skills = new List<string>();
                            foreach (DataRow row in ds.Tables[1].Rows)
                            {
                                skills.Add(Convert.ToString(row["Skill"])); 
                            }
                            rd.keySkills = skills.ToArray();
                        }

                        if (ds.Tables.Count > 2 && ds.Tables[2].Rows.Count > 0)
                        {
                            List<PostingLocation> location = new List<PostingLocation>();
                          
                            if (IsBaseLocationThId ==1)
                            {
                                LocationIdForCity = new string[] { "1", "2", "3", "4", "5", "6","7" };
                                LocationIdForCountry = new string[] { };

                            }
                            else
                            {
                                LocationIdForCity = new string[] { "1", "10", "11", "16", "2", "21", "23", "4", "5" };
                                LocationIdForCountry = new string[] { "13", "14", "17", "18", "19", "20", "26", "3", "6", "7", "8", "9" };

                            }

                            foreach (DataRow row in ds.Tables[2].Rows)
                            {
                                PostingLocation loc = new PostingLocation();

                                if (LocationIdForCity.Contains(Convert.ToString(row["LocationId"])))
                                {
                                    loc.city = Convert.ToString(row["Location"]);

                                }
                                if (LocationIdForCountry.Contains(Convert.ToString(row["LocationId"])))
                                {
                                    loc.country = Convert.ToString(row["Location"]);

                                }

                                location.Add(loc);

                            }
                            rd.locations = location;
                        }

                        if (ds.Tables.Count > 3 && ds.Tables[3].Rows.Count > 0)
                        {

                            List<Question> lstqes = new List<Question>();
                            foreach (DataRow row in ds.Tables[3].Rows)
                            {
                                Question qes = new Question();
                                qes.questionId = Convert.ToInt32(row["ID"]);
                                qes.questionText = Convert.ToString(row["Questions"]);
                                qes.answerType = Convert.ToString(row["answerType"]);
                                qes.mandatory = Convert.ToChar(row["Ismandatory"]).ToString() == "Y" ? true : false;
                                lstqes.Add(qes);
                            }
                            rd.questions = lstqes;

                        }
                        else
                        {
                            rd.questions = new List<Question>();

                        }

                        if (ds.Tables.Count > 4 && ds.Tables[4].Rows.Count > 0)
                        {
                            List<EducationQualification> Qualification = new List<EducationQualification>();
                            foreach (DataRow row in ds.Tables[4].Rows)
                            {
                                EducationQualification education = new EducationQualification();
                                education.courseType = Convert.ToString(row["coursetype"]);
                                education.qualification = Convert.ToString(row["Qualification"]);
                                Qualification.Add(education);
                            }
                            rd.educationQualifications = Qualification;

                        }

                        objlist = rd;
                    }
                }

            }
            catch (Exception ex)
            {
                ExceptionLogging.SendExcepToDB(ex, sectionName, "getMap");
            }

            return objlist;

        }
    }
}