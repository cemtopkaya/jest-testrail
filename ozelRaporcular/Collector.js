Array.prototype.last = function () {
    return this[this.length - 1];
}

const spec = {
    fullName: '',       // it 4
    suites: new Map(), // ['SUITE 1'->S1, 'SUITE 2'->S2, 'SUITE 4'->null]
    result: {
        status: ''       // passed, failed, pending, excluded
    }

}

const current = {
    specs: [],
    suites: []
}
const veri = {
    specs: [
        {
            railSectionId: 4,
            info: {
                fullName: '',       // it 4
                suites: new Map(), // ['SUITE 1'->S1, 'SUITE 2'->S2, 'SUITE 4'->null]
                result: {
                    status: ''       // passed, failed, pending, excluded
                }
            }
        }
    ],
    suites: [],
}

class Collector {

    jasmineStarted(summary) { console.log(`>>> jasmineStarted: `, summary) }
    suiteStarted(suiteInfo) {
        current.specs.push([])
        // console.log(`>>> suiteStarted: `, suiteInfo)
        console.log(`>>> current.suite: `, current.suites.map(p => p.description))
    }
    // specStarted(specInfo) { console.log(`>>> specStarted: `, specInfo) }
    specDone(_specResult) {
        current.specs.last().push(_specResult)
        console.log(`>>> specDone: `, _specResult)
    }
    suiteDone(suiteResult) {
        suiteResult._specs = current.specs.pop()

        current.suites.push(suiteResult)
        console.log(`>>> current.suite: `, current.suites)
        // console.log(`>>> suiteDone: `, suiteResult)
    }
    // jasmineDone(summary) { console.log(`>>> jasmineDone: `, summary) }
}

module.exports = { Collector }


/* Step'li hal
 *   describe > case
 *   it > step
 *
 * Stepsiz hal
 *   describe > section
 *   it > case 
 */

/**
#####  TestRail TERMINOLOJİ #######
suite_id (project id)
section, case         : text  > describe1 -> describe2 -> it3 = section1 -> section2 -> case3
section, case, step   : steps

#####  Jasmine TERMINOLOJİ #######
SUITE -> describe ->
SPEC -> it


'SUITE 1 SUITE 2 SUITE 4 it 4', > ['SUITE 1'->S1, 'SUITE 2'->S2, 'SUITE 4'->null]
suites = new Map()



*/