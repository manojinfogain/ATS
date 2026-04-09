import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchByName'
})
export class SearchByNamePipe implements PipeTransform {
  transform(value: any[], searchInput: string): any {

    if (!value) {
      return [];
    }
    if (!searchInput) {
      return value;
    }
    searchInput = searchInput.toLowerCase();
    return value.filter(comList => {
      return JSON.stringify(comList.candidateName).toLowerCase().includes(searchInput);
    }
    )
    //   comList.Builder_Name.toLowerCase().indexOf(searchInput.toLocaleLowerCase()) !== -1);
    // return null;
  }

}

@Pipe({
  name: 'talentIdFilter'
})
export class talendIdFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.talentID.toLowerCase().includes(searchString.trim().toLowerCase());
      let last = it.TH_ID.toString().includes(searchString.trim().toLowerCase());
      return (first + last)
    })
  }


}


@Pipe({
  name: 'panelFilter'
})
export class panelFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first;
      let last;
      if (it.FullName) {
        first = it?.FullName?.toLowerCase().includes(searchString.trim().toLowerCase());
        last = it?.EmpID?.includes(searchString.trim().toLowerCase());
      } else if (it.fullName) {
        first = it?.fullName?.toLowerCase().includes(searchString.trim().toLowerCase());
        last = it?.empnewid?.includes(searchString.trim().toLowerCase());
      }
      return (first + last)
    })
  }


}


@Pipe({
  name: 'tahHeadSearchFilter'
})
export class tagHeadFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first;
      let last;
      if (it.FullName) {
        first = it?.FullName?.toLowerCase().includes(searchString.trim().toLowerCase());
        last = it?.EmpID?.includes(searchString.trim().toLowerCase());
      } else if (it.fullName) {
        first = it?.fullName?.toLowerCase().includes(searchString.trim().toLowerCase());
        last = it?.empnewid?.includes(searchString.trim().toLowerCase());
      }
      return (first + last)
    })
  }


}

@Pipe({
  name: 'DPFilter'
})
export class DPFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first;
      let last;
      if (it.name) {
        first = it?.name?.toLowerCase().includes(searchString.trim().toLowerCase());
        last = it?.empId?.includes(searchString.trim().toLowerCase());
      }
      return (first + last)
    })
  }


}



@Pipe({
  name: 'skillFilter'
})
export class skillFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.SKillName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}

@Pipe({
  name: 'desigFilter'
})
export class designationFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.DesignationName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}

@Pipe({
  name: 'jobFamilyFilter'
})
export class JobFamilyFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.JFName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}


@Pipe({
  name: 'candiStatusFilter'
})
export class CandidateStatusFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.statusName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}

@Pipe({
  name: 'gradeFilter'
})
export class GradeFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.GRADE_NAME.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}



@Pipe({
  name: 'CountryFilter'
})
export class CountryFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.country_name.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}

@Pipe({
  name: 'CountryCodeFilter'
})
export class CountryCodeFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let phone;
      const name = it.country_name.toString().toLowerCase().includes(searchString.toLowerCase().trim())
      if (it.countryCode) {
        phone = it.countryCode.toLowerCase().includes(searchString.toLowerCase().trim())
      }
      return (name + phone);
    })
  }
}

@Pipe({
  name: 'StateFilter'
})
export class StateFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.stateName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}

@Pipe({
  name: 'CityFilter'
})
export class CityFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.city_name.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}


@Pipe({
  name: 'accountFilter'
})
export class accountFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.accountName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}



@Pipe({
  name: 'recruiterFilter'
})
export class recruiterFilter implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.fullName.toLowerCase().includes(searchString.trim().toLowerCase());
      let last = it.newEmpId.toString().includes(searchString.trim().toLowerCase());
      return (first + last)
    })
  }
}

@Pipe({
  name: 'projectFilter'
})
export class ProjectFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.Name.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}

@Pipe({
  name: 'emplListRecFilter'
})
export class EmplListRecFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.Name.toLowerCase().includes(searchString.trim().toLowerCase());
      let sec = it.EmpID.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first + sec);
    })
  }
}
@Pipe({
  name: 'buddyListFilter'
})
export class buddyListFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.EmpName.toLowerCase().includes(searchString.trim().toLowerCase());
      let sec = it.EmpId.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first + sec);
    })
  }
}

@Pipe({
  name: 'OnboarsStatusFilter'
})
export class OnboarsStatusFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.StatusName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first);
    })
  }
}


@Pipe({
  name: 'offerStatusPipe'
})
export class offerStatusPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let status = it.statusName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (status)
    })
  }

}

@Pipe({
  name: 'candidateJoinedListPipe'
})
export class candidateJoinedListPipe implements PipeTransform {
  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let name = it.EmployeeName.toLowerCase().includes(searchString.trim().toLowerCase());
      let emp = it.EmplyeeID.includes(searchString.trim().toLowerCase());
      return (name + emp)
    })
  }

}

@Pipe({
  name: 'locationPipe'
})
export class locationPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let status = it.statusName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (status)
    })
  }

}

@Pipe({
  name: 'subListFilter'
})
export class subListFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let status = it.Name.toLowerCase().includes(searchString.trim().toLowerCase());
      return (status)
    })
  }

}

@Pipe({
  name: 'practiceFilter'
})
export class practiceFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.PracticeName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}


@Pipe({
  name: 'cskillCountryFilter'
})
export class cskillCountryFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.country.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}

@Pipe({
  name: 'prCommunityListFilter'
})
export class practiceCommunityFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.PracticeCommunity.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}

@Pipe({
  name: 'subPracticeListFilter'
})
export class SubPracticeFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.SubPracticeName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }


}


@Pipe({
  name: 'additionalSkillFilter'
})
export class additionalSkillFilterPipe implements PipeTransform {
  //additionalSkillFilterPipe
  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.skill.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}

@Pipe({
  name: 'nationalityFilter'
})
export class NationalityFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.COUNTRY_NAME.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}

@Pipe({
  name: 'empCreationDesignFilter'
})
export class EmpCreationDesignFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.Designation.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}

@Pipe({
  name: 'lastEmployerFilter'
})
export class LastEmployerFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.Employer_name.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}

@Pipe({
  name: 'jobTitleFilter'
})
export class JobTitleFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.DESIGNATION_NAME.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}

@Pipe({
  name: 'reportingMngrFilter'
})
export class ReportingMngrFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.EMP_STAFFID.toLowerCase().includes(searchString.trim().toLowerCase());
      let sec = it.Name.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first + sec);
    })
  }
}

@Pipe({
  name: 'USEmployeeFilter'
})
export class USEmployeeFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.empnewid.toLowerCase().includes(searchString.trim().toLowerCase());
      let sec = it.fullName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first + sec);
    })
  }
}

@Pipe({
  name: 'vendorFilter'
})
export class VendorFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.VendorName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first);
    })
  }
}

@Pipe({
  name: 'subLocationFilter'
})
export class SubLocationFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.BaseLocation.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first);
    })
  }
}

@Pipe({
  name: 'departmentFilter'
})
export class DepartmentFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.SBUName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first);
    })
  }


}

@Pipe({
  name: 'workVisaFilter'
})
export class WorkVisaFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.Visa.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}

@Pipe({
  name: 'depCodeFilter'
})
export class DepartmentCodeFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.DeptName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}

@Pipe({
  name: 'talentCubeFilter'
})
export class TalentCubeCodeFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.CubeCodeName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }

}


@Pipe({
  name: 'tagLeadApproUS'
})
export class tagLeadApproUS implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    // return value.filter(it=>{   
    //     let first =  it.CubeCodeName.toLowerCase().includes(searchString.trim().toLowerCase());
    //     return (first)
    // }) 
    return value.filter(it => {
      let first = it.empnewid.toLowerCase().includes(searchString.trim().toLowerCase());
      let sec = it.fullName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first + sec);
    })
  }
}


@Pipe({
  name: 'venderFilter'
})
export class VenderfilterPIPE implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.VendorName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }

}



@Pipe({
  name: 'fieldsListData'
})
export class FieldsListData implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.FieldName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}

@Pipe({
  name: 'TCFilter'
})
export class TCFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.CubeName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first);
    })
  }
}
@Pipe({
  name: 'candidatesFilter'
})
export class CandidatesFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.empId.toString().toLowerCase().includes(searchString.trim().toLowerCase());
      let sec = it.Name.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first + sec);
    })
  }

  
}

@Pipe({
  name: 'coderBytePipe'
})
export class CoderBytePipe implements PipeTransform {

  transform(value:any[],searchString:string ){
    
    if(!searchString){
      return value  
    }

    return value.filter(it=>{   
        let first =  it.display_name.toLowerCase().includes(searchString.trim().toLowerCase());
        return (first);
    }) 
 }
}


@Pipe({
  name: 'interviewTypeListFilter'
})
export class interviTypeFilterPipe implements PipeTransform {

  transform(value:any[],searchString:string ){
    
    if(!searchString){
      return value  
    }

    return value.filter(it=>{   
        let first =  it.interviewType.toLowerCase().includes(searchString.trim().toLowerCase());
        let sec = it.interviewType.toLowerCase().includes(searchString.trim().toLowerCase());
        return (sec)
    }) 
 }
}

@Pipe({
  name: 'gradePipe'
})
export class gradePipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let grade = it.GRADE_NAME.toLowerCase().includes(searchString.trim().toLowerCase());
      return (grade)
    })
  }

}


@Pipe({
  name: 'hrListDelegateFilterPipe'
})
export class hrListDelegateFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.OnboardingSpocName.toLowerCase().includes(searchString.trim().toLowerCase());
      let last = it.OnboardingSpocId.toString().includes(searchString.trim().toLowerCase());
      return (first + last)
    })
  }
}

@Pipe({
  name: 'primarySkillByTcPipe'
})
export class PrimarySkillByTcPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let skill = it.SkillName?.toLowerCase().includes(searchString.trim().toLowerCase());
      return (skill)
    })
  }

}
@Pipe({
  name: 'accountNameFilter'
})
export class AccountNameFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.accountName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}

@Pipe({
  name: 'delegateListISSfilterPipe'
})
export class DelegateISSFilterPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.ISS_SpocName.toLowerCase().includes(searchString.trim().toLowerCase());
      let last = it.ISS_SpocId.toString().includes(searchString.trim().toLowerCase());
      return (first + last)
    })
  }
}


@Pipe({
  name: 'searchCtrlIssReason'
})
export class SearchCtrlIssReason implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.ReasonText.toLowerCase().includes(searchString.trim().toLowerCase());
    //  let last = it.ISS_SpocId.toString().includes(searchString.trim().toLowerCase());
      return (first )
    })
  }
}