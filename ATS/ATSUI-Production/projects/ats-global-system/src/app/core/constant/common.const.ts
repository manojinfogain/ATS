export const COMMON_CONST = {
    imgPath: 'assets/images/',
    mock: '/assets/mock/',
    iconPath: '/assets/images/path',
    emailregex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    nameRegex: /^[A-Za-z ]+$/,
    numberRegex: /^[0-9]{1,10}$/,
    phoneNumberRegex: /^[0-9]{1,10}$/,
    cskillBaseUrl:'http://d54lhvmg54rpe.cloudfront.net/'
}

export const GET_DEFAULT_DATE = {
  fromDate: new Date('2022-01-01')
}

export const FILE_UPLOAD = {
    FILE_SIZE: 15000000, // 15MB
    VIDEO_FILE_SIZE: 50000000,//50 MB
}
export const ONB_FILE_UPLOAD = {
  FILE_SIZE: 5000000, // 5MB
}
export const SPECIALACCESSUSER = {
    specialAccess: [],
    offerAccesRight: [],
    exceptionAccessRight: []
}



export const graphChartColor = {
    graphColorDash: ['blue', 'blue', 'red', '#9BC2E6', '#9BC2E6', '#9BC2E6', '#9BC2E6', '#9BC2E6', '#92D050', 'red', 'yellow', 'green', 'red', 'yellow', 'green']
}

export const dashTableHead = {
    displayedColumns : ['du','OpenPositions', 'NotScheduledYet', 'ScreeningRound', 'TechnicalRound', 'TechnicalRound2','ManagerialRound', 'ClientRound','midwayDropCount', 'HRSelected', 'HRRejected', 'HrOnHold', 'OfferedGiven','YTJCandidates', 'CandidatesJoined','OfferedDecline','dropAfterSelection',]
}

export const tcSupportList = {
  supportItems: [61]
}

export const salaryMinMaxLoc = {
     usdMax:170000,
     inrMax:9900000,
     usdMin:1500,
     inrMin:100000,
     usdMonthlyMin: 125,
     usdHrlyMin: 5,
     inrMonthlyMin: 8333,
     inrHrlyMin: 12,
     usdMonthlyMax: 15000,
     usdHrlyMax: 150,
     inrMonthlyMax: 583333,
     inrHrlyMax:5000

}

export const AtsCommonPrefix = {
    CidPrefix:'C',
    CidColName:'CID'
}

export const DuDummyList = [
        {
          "Name": 'April',
          "joiningw1": 30,
          "joiningw2": 15,
          "joiningw3": 164,
          "joiningw4": 0,
          "joiningw5": 0,
          "joininTotal": 0,
          "joiningPercent": '50%',
          "declineW1": 33,
          "declineW2": 3,
          "declineW3": 55,
          "declineW4": 7,
          "declineW5": 66,
          "declineTotal": 299,
          "declinePercent": '33%',
          "grandTotal": 600,
          "type": 'M'
        },
        {
          "Name": 'May',
          "joiningw1": 40,
          "joiningw2": 25,
          "joiningw3": 64,
          "joiningw4": 10,
          "joiningw5": 20,
          "joininTotal": 30,
          "joiningPercent": '40%',
          "declineW1": 3,
          "declineW2": 3,
          "declineW3": 5,
          "declineW4": 7,
          "declineW5": 6,
          "declineTotal": 99,
          "declinePercent": '33%',
          "grandTotal": 800,
          "type": 'M'
        },
        {
          "Name": 'June',
          "joiningw1": 40,
          "joiningw2": 25,
          "joiningw3": 64,
          "joiningw4": 30,
          "joiningw5": 20,
          "joininTotal": 30,
          "joiningPercent": '40%',
          "declineW1": 3,
          "declineW2": 3,
          "declineW3": 5,
          "declineW4": 7,
          "declineW5": 6,
          "declineTotal": 9,
          "declinePercent": '33%',
          "grandTotal": 700,
          "type": 'M'
        },
        {
          "Name": 'Q1',
          "joiningw1": 40,
          "joiningw2": 25,
          "joiningw3": 64,
          "joiningw4": 30,
          "joiningw5": 20,
          "joininTotal": 30,
          "joiningPercent": '40000%',
          "declineW1": 3,
          "declineW2": 3,
          "declineW3": 5,
          "declineW4": 7,
          "declineW5": 6,
          "declineTotal": 9,
          "declinePercent": '33%',
          "grandTotal": 700,
          "type": 'Q'
        },
        {
          "Name": 'July',
          "joiningw1": 40,
          "joiningw2": 25,
          "joiningw3": 64,
          "joiningw4": 30,
          "joiningw5": 20,
          "joininTotal": 30,
          "joiningPercent": '40%',
          "declineW1": 3,
          "declineW2": 3,
          "declineW3": 5,
          "declineW4": 7,
          "declineW5": 6,
          "declineTotal": 9,
          "declinePercent": '33%',
          "grandTotal": 700,
          "type": 'M'
        },
        {
            "Name": 'Auguest',
            "joiningw1": 4,
            "joiningw2": 5,
            "joiningw3": 4,
            "joiningw4": 0,
            "joiningw5": 0,
            "joininTotal": 30,
            "joiningPercent": '40%',
            "declineW1": 3,
            "declineW2": 3,
            "declineW3": 5,
            "declineW4": 7,
            "declineW5": 6,
            "declineTotal": 9,
            "declinePercent": '33%',
            "grandTotal": 700,
            "type": 'M'
          },
          {
            "Name": 'September',
            "joiningw1": 50,
            "joiningw2": 15,
            "joiningw3": 4,
            "joiningw4": 31,
            "joiningw5": 20,
            "joininTotal": 30,
            "joiningPercent": '40%',
            "declineW1": 3,
            "declineW2": 3,
            "declineW3": 5,
            "declineW4": 7,
            "declineW5": 6,
            "declineTotal": 9,
            "declinePercent": '33%',
            "grandTotal": 700,
            "type": 'M'
          },
          {
            "Name": 'Q2',
            "joiningw1": 40,
            "joiningw2": 25,
            "joiningw3": 64,
            "joiningw4": 30,
            "joiningw5": 20,
            "joininTotal": 30,
            "joiningPercent": '40%',
            "declineW1": 3,
            "declineW2": 3,
            "declineW3": 5,
            "declineW4": 7,
            "declineW5": 6,
            "declineTotal": 9,
            "declinePercent": '33%',
            "grandTotal": 700,
            "type": 'Q'
          },
          {
            "Name": 'October',
            "joiningw1": 0,
            "joiningw2": 5,
            "joiningw3": 4,
            "joiningw4": 31,
            "joiningw5": 0,
            "joininTotal": 30,
            "joiningPercent": '40%',
            "declineW1": 3,
            "declineW2": 3,
            "declineW3": 5,
            "declineW4": 7,
            "declineW5": 6,
            "declineTotal": 9,
            "declinePercent": '33%',
            "grandTotal": 700,
            "type": 'M'
          },
          {
            "Name": 'November',
            "joiningw1": 0,
            "joiningw2": 11,
            "joiningw3": 41,
            "joiningw4": 31,
            "joiningw5": 21,
            "joininTotal": 30,
            "joiningPercent": '40%',
            "declineW1": 3,
            "declineW2": 3,
            "declineW3": 5,
            "declineW4": 71,
            "declineW5": 6,
            "declineTotal": 91,
            "declinePercent": '33%',
            "grandTotal": 700,
            "type": 'M'
          },
          {
            "Name": 'December',
            "joiningw1": 20,
            "joiningw2": 43,
            "joiningw3": 4,
            "joiningw4": 3,
            "joiningw5": 20,
            "joininTotal": 30,
            "joiningPercent": '40%',
            "declineW1": 3,
            "declineW2": 33,
            "declineW3": 25,
            "declineW4": 27,
            "declineW5": 6,
            "declineTotal": 9,
            "declinePercent": '33%',
            "grandTotal": 700,
            "type": 'M'
          },
          {
            "Name": 'Q3',
            "joiningw1": 0,
            "joiningw2": 25,
            "joiningw3": 64,
            "joiningw4": 30,
            "joiningw5": 20,
            "joininTotal": 30,
            "joiningPercent": '10%',
            "declineW1": 3,
            "declineW2": 3,
            "declineW3": 15,
            "declineW4": 17,
            "declineW5": 6,
            "declineTotal": 9,
            "declinePercent": '33%',
            "grandTotal": 700,
            "type": 'Q'
          },
]

export const COMPANY_LOC = {
  ADDR_PUNE: 'Aundh, IT park, Pune',
  ADDR_MUMBAI: 'SDF 5, First Floor, Unit no. 150, Seepz, Andheri (East), Mumbai',
  ADDR_NOIDA: 'A-16 & A-21, Sector-60, Noida',
  ADDR_BANGLORE: 'Fortune Scion Business Centre 90 B, West Avenue 9, Electronics City Phase -1 Bangalore',
  ADDR_GURUGRAM_ADT: 'DLF Cyber City SEZ, Building#14, 4th Floor,Tower B, DLF Cyber City, Phase-3, Gurgaon 122002, Haryana, India'
}

export const GENDER_LIST = [
  {ID:'M',Name:'Male'},
  {ID:'F',Name:'Female'},
  {ID:'N',Name:'Non-Binary'}
]

export const NOTICE_PERIOD = [
  {ID:90,Name:'90 Days'},
  {ID:60,Name:'60 Days'},
  {ID:45,Name:'45 Days'},
  {ID:30,Name:'30 Days'},
  {ID:15,Name:'15 Days'},
  {ID:0,Name:'0 Days'}
]

export const ONBOARDING_MODE = [
  {Value:'I',Name:'In-Person (F2F)'},
  {Value:'V',Name:'Virtual'}
]


export const labelResumeRating = {
   ResumeRatingGrid:"Resume Rating",
   tooltipResumeRatingAction:"View Profile Match Details",
   modalViewResumeRatingTitle:"View Profile Match Details",
   gridRatingLabel:"Profile Match (%)",
   MandatorySkillRating: "Mandatory Skill Rating",
   GoodToHaveSkillRating: "Good To Have Skill Rating",
}


