using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATSAPI
{
    public class AppConstants
    {
        public const int UserRoleClaimIndex = 5;

        // Messages
        public const string UnauthorizedMessage = "You do not have permission to access this.";
        public const string NotFoundMessage = "No open requisitions found.";
        public const string CommonErrorMessage = "There is some error! Try again later.";
    }
}