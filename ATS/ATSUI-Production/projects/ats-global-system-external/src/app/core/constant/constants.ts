export const CONSTANTS = {
    PAGE_SIZE: 10,
    PAGINATOR_ARRAY: [10, 15, 30],
    PAGE_SIZE_OPTION: [10, 25, 50, 100],
    USER_ACCOUNT_TYPE_ID: { admin: 2 },
    interviewDuration: [
        { name: '30 Minutes', value: 30 },
        { name: '45 Minutes', value: 45 },
        { name: '60 Minutes', value: 60 }
    ],
    statusAs: [
        { name: 'Assigned', id: '1' },
        { name: 'Unassigned', id: '0' }
    ],
    statusCan: [
        { name: 'Withdrawn', id: '1' },
        { name: 'Active', id: '0' }
    ],
    salaryType: [
        { name: 'Annual', id: 1 },
        { name: 'Monthly', id: 2 },
        { name: 'Hourly', id: 3 }
    ],
    sudexoCoupen: [
        { name: '0', id: 0 },
        { name: '1500', id: 1 },
        { name: '2500', id: 2 },
        { name: '3000', id: 3 }
    ],
    npsList: [
        { name: '0%', value: 0 },
        { name: '10%', value: 10 },
        { name: '7%', value: 7 },
        { name: '5%', value: 5 }
    ],
    MonthList: [
        {
            name: 'January',
            value: 1,
            nameShort: 'Jan'
        },
        {
            name: 'February',
            value: 2,
            nameShort: 'Feb'
        },
        {
            name: 'March',
            value: 3,
            nameShort: 'Mar'
        },
        {
            name: 'April',
            value: 4,
            nameShort: 'Apr'
        },
        {
            name: 'May',
            value: 5,
            nameShort: 'May'
        },
        {
            name: 'June',
            value: 6,
            nameShort: 'Jun'
        },
        {
            name: 'July',
            value: 7,
            nameShort: 'Jul'
        },
        {
            name: 'August',
            value: 8,
            nameShort: 'Aug'
        },
        {
            name: 'September',
            value: 9,
            nameShort: 'Sep'
        },
        {
            name: 'October',
            value: 10,
            nameShort: 'Oct'
        },
        {
            name: 'November',
            value: 11,
            nameShort: 'Nov'
        },
        {
            name: 'December',
            value: 12,
            nameShort: 'Dec'
        },
    ],
    YearList: [
        { name: '2022', value: 2022 },
        { name: '2021', value: 2021 },
        { name: '2020', value: 2020 },
        { name: '2019', value: 2019 },
        { name: '2018', value: 2018 },
        { name: '2017', value: 2017 },
        { name: '2016', value: 2016 },
        { name: '2015', value: 2015 },
        { name: '2014', value: 2014 },
        { name: '2013', value: 2013 },
        { name: '2012', value: 2012 },
        { name: '2011', value: 2011 },
        
    ],
    JfCategList: [
        { name: 'Premium', value: 'P' },
        { name: 'Non Premium', value: 'N' }
    ],
    RehireList: [
        { name: 'Yes', value: 'Y' },
        { name: 'No', value: 'N' },
       // { name: 'Conversion', value: 'C' }
    ],
    CandidateJoinStatusList: [
        { name: 'Confirm', value: 1 },
        { name: 'Defer', value: 2 },
        {name: 'Decline', value: 3 }
    ],
    InterViewByListData:[
        {
            id: 'I',
            interviewByName: "Internal Panel",
            flag: "IP"
          },
          {
            id: 'E',
            interviewByName: "External Agency",
            flag: "EA"
          },
          {
            id: 'M',
            interviewByName: "Mettl",
            flag: "M"
          }
    ],
    InterViewByKeyName:{
        internalPanel:"Internal Panel",
        externalAgency:"External Agency",
        mettl:"Mettl"
    }

}
