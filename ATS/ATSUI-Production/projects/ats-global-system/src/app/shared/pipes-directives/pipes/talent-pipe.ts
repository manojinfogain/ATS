import { PipeTransform, Pipe } from "@angular/core";

@Pipe({
  name: 'talentSubSkillsPipe'
})
export class TalentSubSkillsPipe implements PipeTransform {
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
  name: 'talentPrimarySkillPipe'
})
export class TalentPrimarySkillPipe implements PipeTransform {
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
  name: 'talentDuPipe'
})
export class TalentDuPipe implements PipeTransform {
  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.DeliveryUnit.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}

@Pipe({
  name: 'talentAccount4Pipe'
})
export class TalentAccountPipe implements PipeTransform {
  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.AccountName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}


@Pipe({
  name: 'talentOpportunityPipe'
})
export class TalentOppurtunityPipe implements PipeTransform {
  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.OppName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}


@Pipe({
  name: 'talentdesignCategoriesPipe'
})
export class TalentdesignCategoriesPipe implements PipeTransform {
  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.DesigCateName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}

@Pipe({
  name: 'talentdesignationPipe'
})
export class TalentdesignationPipe implements PipeTransform {
  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.DesigName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}


@Pipe({
  name: 'talentJoiningLocationPipe'
})
export class TalentJoiningLocationPipe implements PipeTransform {
  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first = it.LocName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}

@Pipe({
  name: 'talentJoiningStatePipe'
})
export class TalentJoiningStatePipe implements PipeTransform {
  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }
    return value.filter(it => {
      let first = it.State.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}

@Pipe({
  name: 'talentJoiningCityPipe'
})
export class TalentJoiningCityPipe implements PipeTransform {
  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }
    return value.filter(it => {
      let first = it.CITY.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}

@Pipe({
  name: 'talentQualificationPipe'
})
export class TalentQualificationPipe implements PipeTransform {
  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }
    return value.filter(it => {
      let first = it.QualificationName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}

@Pipe({
  name: 'talentProjectPipe'
})
export class TalentProjectPipe implements PipeTransform {
  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }
    return value.filter(it => {
      let first = it.ProjectName.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}

@Pipe({
  name: 'talentDivisonPipe'
})
export class TalentDivisonPipe implements PipeTransform {
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
  name: 'talentReplacementReasonPipe'
})
export class TalentReplacementReasonPipe implements PipeTransform {
  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }
    return value.filter(it => {
      let first = it.Reason.toLowerCase().includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}

@Pipe({
  name: 'talentConversionPipe'
})
export class TalentConversionPipe implements PipeTransform {
  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }
    return value.filter(it => {
      let first = it.fullName.toLowerCase().includes(searchString.trim().toLowerCase());
      let last = it?.empid?.includes(searchString.trim().toLowerCase());
      return (first + last)
    })
  }
}

@Pipe({
  name: 'searchReferEmployeePipe'
})
export class TalentReferEmployePipe implements PipeTransform {
  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }
    return value.filter(it => {
      let first = it.EmployeeName.toLowerCase().includes(searchString.trim().toLowerCase());
      let last = it?.EmpId?.includes(searchString.trim().toLowerCase());
      return (first + last)
    })
  }
}

@Pipe({
  name: 'searchTalentStatusPipe'
})
export class TalentStatusSearchPipe implements PipeTransform {
  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }
    return value.filter(it => {
      let first = it.Status.toLowerCase().includes(searchString.trim().toLowerCase());
      // let last =  it?.EmpId?.includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}


@Pipe({
  name: 'searchDepartmentPipe'
})
export class DepartmentSearchPipe implements PipeTransform {
  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }
    return value.filter(it => {
      let first = it.ClassificationName.toLowerCase().includes(searchString.trim().toLowerCase());
      // let last =  it?.EmpId?.includes(searchString.trim().toLowerCase());
      return (first)
    })
  }
}

@Pipe({
  name: 'talentReplacementPipe'
})
export class TalentReplacementPipe implements PipeTransform {
  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }
    return value.filter(it => {
      let first = it.fullName.toLowerCase().includes(searchString.trim().toLowerCase());
      let last = it?.empnewid?.includes(searchString.trim().toLowerCase());
      return (first + last)
    })
  }
}



@Pipe({
  name: 'EmpFiltertPipe'
})
export class EmpFiltertPipe implements PipeTransform {

  transform(value: any[], searchString: string) {

    if (!searchString) {
      return value
    }

    return value.filter(it => {
      let first;
      let last;
      first = it?.FullName?.toLowerCase().includes(searchString.trim().toLowerCase());
      last = it?.EmpNewId?.includes(searchString.trim().toLowerCase());
      return (first + last)
    })
  }


}