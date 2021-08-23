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


function flatten(arr, d = 1) {

    const fnReducer = function (acc, curr) {
        console.log("d: ", d)
        console.log(acc)
        console.log(">> curr: ", curr, "\n\n")

        acc.push(curr)

        if (curr._suites.length > 0) {
            acc = acc.concat(flatten(curr._suites, d - 1))
        }

        return acc
    }

    let res = arr.reduce(fnReducer, [])
    console.log(">>>> res", res)

    return d > 0 ? res : arr.slice();
}

function kaydet() {
    var Testrail = require('testrail-api');

    var tr = new Testrail({
        host: 'https://jestrail.testrail.io',
        user: 'cem.topkaya@ulakhaberlesme.com.tr',
        password: 'q1w2e3r4'
    });


    process.env.NODE_ENV
    return tr.getProjects()
        .then(ps => {
            console.log(">>> ps ", ps.body);
            return ps.body.find(p => p.name == 'Ornek')
        })
        .then(p => {
            console.log(">>> p : ", p);
            var newSection = {
                name: "Cem",
                parent_id: null,
                // suite_id:null,
                description: "denemme aciklama"
            }
            return tr.addSection(p.id, newSection)
        })
        .then(result => {
            console.log(">>> section added");
        })
        .catch(console.error)

}

class WithoutStep {

    // jasmineStarted(summary) { console.log(`>>> jasmineStarted: `, summary) }
    suiteStarted(suiteInfo) {
        suiteInfo._suites = []

        let { fullName, description } = suiteInfo
        if (fullName == description)
            current.suites.push(suiteInfo)
        else {
            let root = current.suites.last()
            root._suites.push()
            console.log(">>>> root: ", root)
            let parentSuiteFullName = fullName.replace(` ${description}`, '')

            const parentSuite = flatten([root], Infinity).filter(s => {
                console.log("------ >>>> ",s);
                return s.fullName == parentSuiteFullName
            })
            console.log(">>>> parentSuite: ", parentSuite)
            // parentSuite._suites.push(suiteInfo)
        }

        // current.specs.push([])

        // if (current.suites.length == 0)
        //     current.suites.push(suiteInfo);
        // else
        //     current.suites.last()._suites.push(suiteInfo);

        console.log(`>>> suiteStarted: `, suiteInfo)
        // console.log(`>>> current.suite: `, current.suites.map(p => p.description))
    }
    // specStarted(specInfo) { console.log(`>>> specStarted: `, specInfo) }
    specDone(_specResult) {
        // current.specs.last().push(_specResult)
        // console.log(`>>> specDone: `, _specResult)
    }
    suiteDone(suiteResult) {
        // suiteResult._specs = current.specs.pop()

        // current.suites.push(suiteResult)
        console.log(`>>> current.suites: `, current.suites);//.map(s=>s.description))
        // console.log(`>>> suiteDone: `, suiteResult)
    }

    jasmineDone(summary, done) {

        console.log(`>>> jasmineDone: `, summary)
        kaydet()
            .then(() => {
                console.log(">>> --- ");
                done()
            })
            .finally(done);
    }
}

module.exports = { WithoutStep }


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