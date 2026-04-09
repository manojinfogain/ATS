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
        { name: 'Decline', value: 3 }
    ],
    InterViewByListData: [
        {
            id: 'I',
            interviewByName: "Infogain Panel",
            flag: "IP"
        },
        {
            id: 'E',
            interviewByName: "External Panel",
            flag: "EA"
        },
        {
            id: 'M',
            interviewByName: "Mettl",
            flag: "M"
        },
        {
            id: 'C',
            interviewByName: "Coderbyte",
            flag: "C"
          },
          {
            id: 'G',
            interviewByName: "DoSelect",
            flag: "G"
          }
    ],
    InterViewByKeyName:{
        internalPanel:"Internal Panel",
        externalAgency:"External Agency",
        mettl:"Mettl",
        Coderbyte:"Coderbyte",
        //Glider:"Glider",
          Glider:"DoSelect"
    },
    finanicialYearList: [
        { name: '2022-23', value: '2022,2023' },
        { name: '2023-24', value: '2023,2024' },
        { name: '2024-25', value: '2024,2025' },
    ],
    EmpUnitList: [
        { unitName: 'Delivery', unitId: 1 },
        { unitName: 'Support', unitId: 2 },
    ],
    NewquesionnaireIntFeedback: {
        labelOne: {
            name: 'Fundamental Knowledge',
            question1: `Did you assess the candidate's knowledge of the principles underlying the role? (For example: Algorithm, Design pattern, Programming skills).`
        },
        labelTwo: {
            // name: 'Problem Solving and Logical Thinking',
            name: 'Problem Solving/ coding and Logical Thinking',
            question1: `Did you provide complex problems or case scenarios to evaluate the candidate's approach towards problem-solving?
            How did the candidate approach complex problems? `,
            
        },
        labelThree: {
            name: 'Cultural Fit & Adaptability',
            question1: `Do you think the candidate is/ will be aligned with infogain culture and the core values?  Did the candidate demonstrate the ability to adapt to change at work?`,           
        },
    },
    OldquesionnaireIntFeedback: {
        label1: {
            name: 'Technical Skills Proficiencies & Practical Skills',
            question1: `Is the candidate familiar with specific tools, programming languages, or technologies necessary for the job?`,
            question2: `Which technical skills did you evaluate during the technical discussion & how?`,
            question3: `Did the candidate take the coding challenges? If “Yes” Please share the screenshot`
        },
        label2: {
            name: 'Fundamental Knowledge',
            question1: `Did you assess the candidate's knowledge of the principles underlying the role? (For example: Algorithm, Design pattern, Programming skills).`
        },
        label3: {
            // name: 'Problem Solving and Logical Thinking',
            name: 'Problem Solving/ coding and Logical Thinking',
            question1: `How did the candidate approach complex problems? `,
            question2: `Did you provide complex problems or case scenarios to evaluate the candidate's approach towards problem-solving? `
        },
        label4: {
            name: 'Industry/ Domain Knowledge (Optional)',
            question1: `Does the candidate possess experience/ knowledge
            related to specific industry or Domain?`,
        },
        label5: {
            name: 'Cultural Fit & Adaptability',
            question1: `Do you think the candidate is/ will be aligned with infogain culture and the core values? Please site specific examples.`,
            question2: `Did the candidate demonstrate the ability to adapt
            to change at work?`,
        },



    },


    tierList: [
        {
            name: 'Tier 1',
            tierDescr: '10 named competitor companies'
        },
        {
            name: 'Tier 2',
            tierDescr: 'Companies with $200M revenue and above'
        },
        {
            name: 'Other',
            tierDescr: 'Rest of the companies'
        },
    ],
    time24Hours:[
        {name:'01:00:00',value:'01:00:00'},
        {name:'02:00:00',value:'02:00:00'},
        {name:'03:00:00',value:'03:00:00'},
        {name:'04:00:00',value:'04:00:00'},
        {name:'05:00:00',value:'05:00:00'},
        {name:'06:00:00',value:'06:00:00'},
        {name:'07:00:00',value:'07:00:00'},
        {name:'08:00:00',value:'08:00:00'},
        {name:'09:00:00',value:'09:00:00'},
        {name:'10:00:00',value:'10:00:00'},
        {name:'11:00:00',value:'11:00:00'},
        {name:'12:00:00',value:'12:00:00'},
        {name:'13:00:00',value:'13:00:00'},
        {name:'14:00:00',value:'14:00:00'},
        {name:'15:00:00',value:'15:00:00'},
        {name:'16:00:00',value:'16:00:00'},
        {name:'17:00:00',value:'17:00:00'},
        {name:'18:00:00',value:'18:00:00'},
        {name:'19:00:00',value:'19:00:00'},
        {name:'20:00:00',value:'20:00:00'},
        {name:'21:00:00',value:'21:00:00'},
        {name:'22:00:00',value:'22:00:00'},
        {name:'23:00:00',value:'23:00:00'},
        {name:'00:00:00',value:'00:00:00'}
    ],
      isOfferInHand: [
        { name: 'Yes', value: 'Y' },
        { name: 'No', value: 'N' },
        // { name: 'Conversion', value: 'C' }
    ],
}
