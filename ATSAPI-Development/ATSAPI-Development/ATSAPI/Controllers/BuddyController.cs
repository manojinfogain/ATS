using ATSAPI.App_Data;
using ATSAPI.common;
using ATSAPI.Models;
using ATSAPI.Repositry;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;

namespace ATSAPI.Controllers
{
    [AuthorizeAttribute]
    [RoutePrefix("api/Buddy")]

    public class BuddyController : ApiController
    {
        BuddyRepository objRepo = new BuddyRepository();
        Logger logger = new Logger();
        CommonController cm = new CommonController();

        public BuddyController()
        {
        }


        [Route("GetCandidateListForBuddyAssign")]
        [HttpPost]
        public IHttpActionResult GetCandidateListForBuddyAssign(BuddyModel obj)
        {
            try
            {
                logger.LogRequestAsync("GetCandidateListForBuddyAssign", Request); // Log the incoming request
                int result;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.GetCandidateListForBuddyAssign(obj, claims[5].Value,out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetAllReopenedSelectedCandidatesList", claims[5].Value);
                    return authResult;
                }
                logger.LogResponseAsync("GetCandidateListForBuddyAssign", "200 OK"); // Log success response
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetCandidateListForBuddyAssign", ex); // Log the error
                ExceptionLogging.SendExcepToDB(ex, "Buddy", "GetCandidateListForBuddyAssign");
                return BadRequest("There is some error! Try again later");
            }
        }


        [Route("GetEmployeeListToAssign")]
        [HttpGet]
        public IHttpActionResult GetEmployeeListToAssign(int cid)
        {
            try
            {
                logger.LogRequestAsync("GetEmployeeListToAssign", Request); // Log incoming request
                int result;
                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                var data = objRepo.GetEmployeeListToAssign(claims[5].Value, cid, out result);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetAllReopenedSelectedCandidatesList", claims[5].Value);
                    return authResult;
                }
                logger.LogResponseAsync("GetEmployeeListToAssign", "200 OK");
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("GetEmployeeListToAssign", ex); // Log error
                ExceptionLogging.SendExcepToDB(ex, "Buddy", "GetEmployeeListToAssign");
                return BadRequest("There is some error! Try again later");
            }
        }

        [Route("AddUpdateBuddy")]
        [HttpPost]
        public IHttpActionResult AddUpdateBuddy([FromBody] BuddyAssign obj)
        {
            try
            {
                logger.LogRequestAsync("AddUpdateBuddy", Request); // Log incoming request

                var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
                string Message = string.Empty;
                int result = objRepo.AddUpdateBuddy(obj, claims[5].Value, ref Message);
                var authResult = cm.HandleAuthorizationResult(result);
                if (authResult != null)
                {
                    logger.LogUnauthorizedAccessAsync(Request, "GetAllReopenedSelectedCandidatesList", claims[5].Value);
                    return authResult;
                }
                if (result == 1 || result == 2)
                {
                    logger.LogResponseAsync("AddUpdateBuddy", "200 OK: " + Message);
                    return Ok(Message);
                }
                else
                {
                    logger.LogResponseAsync("AddUpdateBuddy", "BadRequest: Unknown error");
                    return BadRequest("There is some error! Try again later");
                }
            }
            catch (Exception ex)
            {
                logger.LogErrorAsync("AddUpdateBuddy", ex); // Log error
                ExceptionLogging.SendExcepToDB(ex, "Buddy", "AddUpdateBuddy");
                return BadRequest("There is some error! Try again later");
            }
        }

    }
}