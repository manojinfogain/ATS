import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'CourseIdFilter'
})
export class CourseIdFilterPipe implements PipeTransform {

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
    name: 'CollegeNameFilter'
})
export class CollegeNameFilterPipe implements PipeTransform {

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
    name: 'UniversityNameFilter'
})
export class UniversityNameFilterPipe implements PipeTransform {

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
export class SubjectFilterPipe implements PipeTransform {

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
    name: 'LevelFilter'
})
export class LevelFilterPipe implements PipeTransform {

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
    name: 'YopFilter'
})
export class YopFilterPipe implements PipeTransform {

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
    name: 'DesignationFilter'
})
export class DesignationFilterPipe implements PipeTransform {

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
    name: 'SkillsFilter'
})
export class SkillsFilterPipe implements PipeTransform {

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
    name: 'IndustryFilter'
})
export class IndustryFilterPipe implements PipeTransform {

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
    name: 'FunctionFilter'
})
export class FunctionFilterPipe implements PipeTransform {

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
    name: 'CountryListFilter'
})
export class CountryListFilterPipe implements PipeTransform {

    transform(value: any[], searchString: string) {

        if (!searchString) {
            return value
        }

        return value.filter(it => {
            let first
            if(it.COUNTRY_NAME) {
                first = it.COUNTRY_NAME.toLowerCase().includes(searchString.trim().toLowerCase());
                return (first)
            }
            else if(it?.country_name){
                first = it.country_name.toLowerCase().includes(searchString.trim().toLowerCase());
            }
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
            let first = it.Nationality.toLowerCase().includes(searchString.trim().toLowerCase());
            return (first)
        })
    }
}

@Pipe({
    name: 'additionalSkillsFilter'
})
export class AdditionalSkillsFilterPipe implements PipeTransform {

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
    name: 'CityListFilter'
})
export class CityListFilterPipe implements PipeTransform {

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