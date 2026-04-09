
export const ATSCONFIG = {
    ATSROLE: {
        TransferAdminAccess:[
            {
                email:'ayatullah.rahmani@gmail.com',
                empId:113495
            }
        ]
    },
    /**
     * Configuration for Manual Pipeline Mail Button Visibility
     * 
     * This controls when the "Send Manual Pipeline Mail" button is visible to users.
     * 
     * HOW TO CONFIGURE:
     * 
     * 1. Days Configuration:
     *    - 0 = Sunday
     *    - 1 = Monday
     *    - 2 = Tuesday
     *    - 3 = Wednesday
     *    - 4 = Thursday
     *    - 5 = Friday
     *    - 6 = Saturday
     * 
     * 2. Time Configuration:
     *    - hours: 0-23 (24-hour format)
     *    - minutes: 0-59
     *    - All times are in IST (Indian Standard Time)
     * 
     * EXAMPLES:
     * 
     * Example 1: Show button on weekends only from 9 AM to 5 PM
     * {
     *   days: [0, 6],  // Sunday and Saturday
     *   startTime: { hours: 9, minutes: 0 },
     *   endTime: { hours: 17, minutes: 0 }
     * }
     * 
     * Example 2: Show button every day from 10:30 AM to 11:30 PM
     * {
     *   days: [0, 1, 2, 3, 4, 5, 6],  // All days
     *   startTime: { hours: 10, minutes: 30 },
     *   endTime: { hours: 23, minutes: 30 }
     * }
     * 
     * Example 3: Multiple time slots for same day
     * {
     *   days: [1],  // Monday
     *   startTime: { hours: 9, minutes: 0 },
     *   endTime: { hours: 12, minutes: 0 }
     * },
     * {
     *   days: [1],  // Monday (again)
     *   startTime: { hours: 14, minutes: 0 },
     *   endTime: { hours: 18, minutes: 0 }
     * }
     */
    MANUAL_PIPELINE_MAIL_BUTTON: {
        schedule: [
            {
                days: [1, 2, 3, 4], // Monday to Thursday
                startTime: { hours: 17, minutes: 30 }, // 5:30 PM IST
                endTime: { hours: 20, minutes: 0 }     // 8:00 PM IST
            },
            {
                days: [5], // Friday
                startTime: { hours: 18, minutes: 0 },  // 6:00 PM IST
                endTime: { hours: 20, minutes: 0 }     // 8:00 PM IST
            }
        ]
    }
}