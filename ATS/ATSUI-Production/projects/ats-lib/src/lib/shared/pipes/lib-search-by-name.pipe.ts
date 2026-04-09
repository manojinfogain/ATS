import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'libCourseIdFilter'
})
export class LibCourseIdFilterPipe implements PipeTransform {

    transform(value: any[], searchString: string) {

        if (!searchString) {
            return value
        }

        return value.filter(it => {
            let first = it.DEGREE_NAME.toLowerCase().includes(searchString.trim().toLowerCase());
            return (first)
        })
    }
}

@Pipe({
    name: 'libCollegeNameFilter'
})
export class LibCollegeNameFilterPipe implements PipeTransform {

    transform(value: any[], searchString: string) {

        if (!searchString) {
            return value
        }

        return value.filter(it => {
            let first = it.COLLEGE_NAME.toLowerCase().includes(searchString.trim().toLowerCase());
            return (first)
        })
    }
}

@Pipe({
    name: 'libUniversityNameFilter'
})
export class LibUniversityNameFilterPipe implements PipeTransform {

    transform(value: any[], searchString: string) {

        if (!searchString) {
            return value
        }

        return value.filter(it => {
            let first = it.UNV_NAME.toLowerCase().includes(searchString.trim().toLowerCase());
            return (first)
        })
    }
}

@Pipe({
    name: 'SubjectFilter'
})
export class LibSubjectFilterPipe implements PipeTransform {

    transform(value: any[], searchString: string) {

        if (!searchString) {
            return value
        }

        return value.filter(it => {
            let first = it.SUBJECT_NAME.toLowerCase().includes(searchString.trim().toLowerCase());
            return (first)
        })
    }
}

@Pipe({
    name: 'libLevelFilter'
})
export class LibLevelFilterPipe implements PipeTransform {

    transform(value: any[], searchString: string) {

        if (!searchString) {
            return value
        }

        return value.filter(it => {
            let first = it.LEVEL_NAME.toLowerCase().includes(searchString.trim().toLowerCase());
            return (first)
        })
    }
}

@Pipe({
    name: 'libYopFilter'
})
export class LibYopFilterPipe implements PipeTransform {

    transform(value: any[], searchString: string) {

        if (!searchString) {
            return value
        }
        return value.filter(it => {
            return (it.toString().includes(searchString.toString().trim().toLowerCase()))
        })
    }
}


@Pipe({
    name: 'libCountryFilter'
})
export class LibCountryFilterPipe implements PipeTransform {

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
    name: 'libDesignationFilter'
})
export class LibDesignationFilterPipe implements PipeTransform {

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
    name: 'libSkillsFilter'
})
export class LibSkillsFilterPipe implements PipeTransform {

    transform(value: any[], searchString: string) {

        if (!searchString) {
            return value
        }

        return value.filter(it => {
            let first = it.SKILL_NAME.toLowerCase().includes(searchString.trim().toLowerCase());
            return (first)
        })
    }
}

@Pipe({
    name: 'libIndustryFilter'
})
export class LibIndustryFilterPipe implements PipeTransform {

    transform(value: any[], searchString: string) {

        if (!searchString) {
            return value
        }

        return value.filter(it => {
            let first = it.INDUSTRY_NAME.toLowerCase().includes(searchString.trim().toLowerCase());
            return (first)
        })
    }
}

@Pipe({
    name: 'libFunctionFilter'
})
export class LibFunctionFilterPipe implements PipeTransform {

    transform(value: any[], searchString: string) {

        if (!searchString) {
            return value
        }

        return value.filter(it => {
            let first = it.FUNCTION_NAME.toLowerCase().includes(searchString.trim().toLowerCase());
            return (first)
        })
    }
}

@Pipe({
    name: 'libCountryListFilter'
})
export class LibCountryListFilterPipe implements PipeTransform {

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
    name: 'libNationalityFilter'
})
export class LibNationalityFilterPipe implements PipeTransform {

    transform(value: any[], searchString: string) {

        if (!searchString) {
            return value
        }

        return value.filter(it => {
            let first = it.Nationality.toLowerCase().includes(searchString.trim().toLowerCase());
            return (first)
        })
    }
}

@Pipe({
    name: 'libAdditionalSkillsFilter'
})
export class LibAdditionalSkillsFilterPipe implements PipeTransform {

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

//city list filter
@Pipe({
    name: 'libCityListFilter'
})
export class LibCityListFilterPipe implements PipeTransform {

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
    name: 'libCountryCodeFilter'
  })
  export class LibCountryCodeFilterPipe implements PipeTransform {
  
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