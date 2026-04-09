using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;

namespace ATSAPI
{
    public static class ClaimsHelper
    {
        public static bool IsUserAuthorized(IPrincipal user, List<int> allowedRoles, List<string> allowedOtherPermissions)
        {
            // Cast to ClaimsPrincipal
            var claimsPrincipal = user as ClaimsPrincipal;
            if (claimsPrincipal == null || !claimsPrincipal.Identity.IsAuthenticated)
                return false;

            var claimsIdentity = (ClaimsIdentity)claimsPrincipal.Identity;
            var claims = claimsIdentity.Claims.ToList();

            // Extract RoleId safely
            int userRole = 0;
            var roleClaim = claims.FirstOrDefault(c => c.Type.Contains("RoleId"));
            if (roleClaim != null)
            {
                string roleValue = roleClaim.Value.Replace("RoleId:", "").Trim();
                int.TryParse(roleValue, out userRole);
            }

            // Extract permissions
            var userPermissions = claims
                .Where(c => allowedOtherPermissions.Any(p => c.Type.Contains(p)) && c.Value.Equals("Y", StringComparison.OrdinalIgnoreCase))
                .Select(c => c.Type)
                .ToList();

            return allowedRoles.Contains(userRole) || userPermissions.Any();
        }

        // ✅ Method for External Users
        public static bool IsExternalUserAuthorized(IPrincipal user)
        {
            var claimsPrincipal = user as ClaimsPrincipal;
            if (claimsPrincipal == null || !claimsPrincipal.Identity.IsAuthenticated)
                return false;

            var claimsIdentity = (ClaimsIdentity)claimsPrincipal.Identity;
            var claims = claimsIdentity.Claims.ToList();

            // Check if Role is "External User" and UserType is "P"
            bool isExternalUser = claims.Any(c => c.Type.Contains("Role") && c.Value.Equals("External User", StringComparison.OrdinalIgnoreCase));
            bool isUserTypeP = claims.Any(c => c.Type.Contains("UserType") && c.Value.Equals("P", StringComparison.OrdinalIgnoreCase));

            return isExternalUser && isUserTypeP;
        }
    }
}
