var md5 = require('md5');

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

const data = {
    queue: {
        specs: [],
        suites: []
    },
    sorted: {
        specs: [],
        suites: []
    }
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

var Testrail = require('testrail-api');

var tr = new Testrail({
    host: 'https://guitest.testrail.io',
    user: 'cem.topkaya@ulakhaberlesme.com.tr',
    password: 'q1w2e3r4'
});


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

async function getProject(projectName) {
    const projects = (await tr.getProjects()).body;
    return projects.find(p => p.name == projectName);
}

async function syncSuitesWithSections(projectName) {

    try {
        const suites = getFlattenSuitesWithSpecs()
        console.log(">>>>>>>>>>>>> suites:", suites);
        const project = await getProject(projectName);

        let sections = (await tr.getSections(project.id)).body
        console.log(">>>>>>>>>>>>> sections:", sections);

        // .filter(suite => suite.parent == null)
        // const a = suites.map(async (suite, idx, arr) => {
        for (const suite of suites) {
            let section;

            if (suite.parent == null) {
                section = sections.find(section => section.parent_id == null && section.name == suite.description)
                if (section == null) {
                    section = (await tr.addSection(project.id, { name: suite.description })).body
                    console.log(">>> addedSection: ", section);
                    sections = (await tr.getSections(project.id)).body
                }
                suite._section = section
            }
            else {
                /**
                 * suite'in parent.description bilgisiyle örtüşen section'ın id değeri ve (&&)
                 * suite.description ile aynı section.name'in parent_id değeri üstteki section'ın id'siyse
                 * aradığımız section değeri budur
                 */
                const parentSections = sections.filter(section => section.name == suite.parent.description)
                if (parentSections.length != 1) {
                    throw Error(`İstisna: ${suite.parent.description} Description değerinde birden fazla 'section' bulundu!!!!`)
                }

                const parentSection = parentSections[0]
                section = sections.find(section =>
                    (parentSection ? parentSection.id == section.parent_id : true)
                    && section.name == suite.description)
                if (section == null) {
                    // const resp = await tr.addSection(project.id, { name: suite.description, parent_id: parentSection.id })
                    section = (await tr.addSection(project.id, { name: suite.description, parent_id: parentSection.id })).body
                    console.log(">>> addedSection: ", section);
                    sections = (await tr.getSections(project.id)).body
                }
                suite._section = section
            }
        }
        // })


        // for (const suite of suites.filter(suite => suite.parent)) {
        //     const found = sections.filter(section => section.name == suite.description)
        //     if (found.length == 0) {
        //         tr.addSection(project.id, { name: suite.description, })
        //     }
        //     console.log()
        // }

        return suites;
    } catch (error) {
        throw error
    }
}

async function syncSpecsWithCases(projectName, suites) {
    const project = await getProject(projectName);
    const cases = (await tr.getCases(project.id)).body;
    
    for (const suite of suites) {
        for (const spec of suite.specs) {
            const isExistOnTestrail = c => c.title === spec.description && c.section_id === suite._section.id
            const foundCase = cases.find(isExistOnTestrail)
            if (foundCase) {
                continue;
            }

            let caseData = {
                title: spec.description,
                type_id: 7
            }
            console.log(">>>>> spec: ", spec);
            const addedCase = (await tr.addCase(suite._section.id, caseData)).body
            console.log(">>> addedCase: ", addedCase);
        }
    }
}

async function kaydet() {
    //     /**
    //  * suites -> sections
    //  * specs -> cases
    //  */

    //     const suites = getFlattenSuites()
    //     console.log(">>>>>>>>>>>>> suites:", suites);

    //     const projects = (await tr.getProjects()).body
    //     const project = projects.find(p => p.name == 'Ornek')
    //     let sections = (await tr.getSections(project.id)).body
    //     console.log(">>>>>>>>>>>>> sections:", sections);

    //     // parent=null Section'lar testrail üstünde yoksa yaratılır. 
    //     suites
    //         .filter(suite => suite.parent == null)
    //         .map(async suite => {
    //             const foundSection = sections.find(section => section.parent_id == null && section.name == suite.description)

    //             if (foundSection == null) {
    //                 const addedSection = await (await tr.addSection(project.id, { name: suite.description })).body
    //                 suite._section = addedSection
    //                 console.log(">>> addedSection: ", addedSection);
    //             }
    //             else {
    //                 suite._section = foundSection
    //                 console.log(">>>> found Section: ", suite);
    //             }
    //         });


    //     // testrail üstündeki sectionların son hali çekilir
    //     sections = (await tr.getSections(project.id)).body

    //     // parent'ı olan suite'ler eklenir
    //     for (const suite of suites.filter(suite => suite.parent)) {
    //         const found = sections.filter(section => section.name == suite.description)
    //         if (found.length == 0) {
    //             const addedSection = await tr.addSection(project.id, { name: suite.description, });
    //             suite._section = addedSection;
    //             console.log(">>> addedSection: ", addedSection);
    //         }
    //     }

}

const addSuiteToRoot = function (suiteInfo) {
    let { fullName, description } = suiteInfo
    if (fullName == description) { data.sorted.suites.push(suiteInfo) }
}
const addToSuiteQueue = function (suite) {
    const { fullName, description } = suite
    data.queue.suites.push(suite)
}

const createSpecQueue = function (suite) {
    const { fullName, description } = suite
    const suiteSpecs = { suiteFullName: fullName, specs: [] }
    data.queue.specs.push(suiteSpecs)
}

const addToSpecQueue = function (spec) {
    const { fullName, description } = spec
    const suiteFullName = fullName.replace(` ${description}`, '')

    const suite = data.queue.specs.find(s => s.suiteFullName == suiteFullName)
    if (suite) {
        suite.specs.push(spec)
    }
}
const getAddedSpecs = function (_suiteFullName) {
    return data.queue.specs.find(s => s.suiteFullName == _suiteFullName).specs.slice(0, Infinity)
}
const getFlattenSuites = function () {

    var suites = data.queue.suites.sort((a, b) => a.id.localeCompare(b.id))
    suites = suites.map((item, idx, arr) => {
        let { id, fullName, description } = item
        let parent = null
        if (fullName != description) {
            const parentSuiteFullName = fullName.replace(` ${description}`, '')
            parent = arr.find(a => a.fullName == parentSuiteFullName)
        }
        return { id, fullName, description, parent: parent ? { id: parent.id, description: parent.description } : null }
    })

    return suites
}

const getFlattenSuitesWithSpecs = function () {

    const suites = getFlattenSuites()

    return data.queue.specs.map(spec => {
        const suite = Object.assign({}, suites.find(suite => suite.fullName == spec.suiteFullName))
        suite.specs = spec.specs
        return suite
    })
}

class WithoutStep {

    // jasmineStarted(summary) { console.log(`>>> jasmineStarted: `, summary) }
    suiteStarted(suiteInfo) {
        // console.log(`>>> suiteStarted: `, suiteInfo)
        createSpecQueue(suiteInfo)
    }
    // specStarted(specInfo) { console.log(`>>> specStarted: `, specInfo) }
    specDone(_specResult) {
        // current.specs.last().push(_specResult)
        addToSpecQueue(_specResult)
        console.log(`>>> specDone: `, _specResult)
    }
    suiteDone(suiteResult) {
        suiteResult._specs = getAddedSpecs(suiteResult.fullName)
        addSuiteToRoot(suiteResult)
        addToSuiteQueue(suiteResult)
        // current.suites.push(suiteResult)
        // console.log(`>>> current.suites: `, current.suites);//.map(s=>s.description))
        console.log(`>>> suiteDone: `, suiteResult)
    }

    async jasmineDone(summary, done) {

        console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> jasmineDone: `, summary)



        console.log(`>>> data.queue.specs: `, data.queue.specs)
        console.log("\n\n");

        // const suites = getFlattenSuites()
        // const suites = getFlattenSuitesWithSpecs()
        const projectName = 'Ornek';

        
        const suites = await syncSuitesWithSections(projectName)
        const specs = await syncSpecsWithCases(projectName, suites)
        console.log(`>>> data.queue.suites: `, suites)


        kaydet()
            .then(async (gelen) => {
                console.log(">>> --- ", await Promise.all(gelen));
                console.log(">>> --- ", await Promise.all(gelen));
                done()
            })
            .catch(console.error)
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