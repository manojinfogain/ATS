export interface IpanelDetailsReq {
    EmpID?: string;
    PanelEmpID?: string;
    startDate?: string;
    endDate?: string;
    DUIDs?: string;
    accountId?: string;
    skillId?: string;
    statusId?: string;
}

export interface IpanelReportDetails {
    PanelId: string;
    PanelName: string;
    CandidateName: string;
    CandidateEmail: string;
    Status: string;
    StatusID: number;
    DeliverUnit: string;
    Account: string;
    Skill: string;

}

export interface IpanelReportList {
    Account: string;
    DU:string;
    Name:string;
    Skills:string;
    TotalInterviewTaken:number;
    cancelled:number;
    interviewTaken:number;
    interviewerEmpId:string;
    rejected:number;
    shceduled: number;
    shortList:number;
}

export interface IdataModal{
    elm?:{};
    listData?:[];
}