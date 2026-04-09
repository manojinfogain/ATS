export  class DashboardCommon{
    public static getIntType(name:string){
        let colName:string = '';
       if(name === 'SC'){
        colName = 'Screening  Round';
       }
       else if(name === 'TC'){
        colName = 'Technical  Round';
       }
       else if(name === 'T1'){
        colName = 'Technical-1  Round';
       }
       else if(name === 'T2'){
        colName = 'Technical-2  Round';
       }

       else if(name === 'MR'){
        colName = 'Managerial/Mgmt.  Round';
       }

       else if(name === 'MG'){
        colName = 'Mgmt. Round';
       }
       else if(name === 'CL'){
        colName = 'Client. Round';
       }

       else if(name === 'HS'){
        colName = 'HR Selected';
       }
       else if(name === 'HR'){
        colName = 'HR Rejected';
       }
       else if(name === 'HH'){
        colName = 'HR Hold';
       }
       else if(name === 'OD'){
        colName = 'Offered';
       }

       else if(name === 'DO'){
        colName = 'Declined';
       }
       else if(name === 'YT'){
        colName = 'Yet to Join';
       }

       else if(name === 'JO'){
        colName = 'Joined';
       }

       else if(name === 'NS'){
        colName = 'Pending For Screening';
       }

       else if(name === 'OP'){
        colName = 'Open Positions (External Hiring)';
       }

       else if(name === 'TP'){
        colName = 'Total Positions';
       }
       
       else if(name === 'ID'){
        colName = 'Midway Drop ';
       }
        
       else if(name === 'DC'){
        colName = 'Drop Post Selection';
       }
       return colName;
    }
}