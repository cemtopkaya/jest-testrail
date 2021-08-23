var Testrail = require('testrail-api');

var testrail = new Testrail({
    host: 'http://ulakcem.testrail.io/',
    user: 'cem.topkaya@ulakhaberlesme.com.tr',
    password: 'q1w2e3r4'
});

// var getProject = function (projeAdi = 'Ornek') {
//     return testrail.getProjects(/*FILTERS=*/{ is_completed: 0 })
//         .then(function (response) {
//             projects = response.body
//             console.log("projects > ", projects);
//             var proje = projects.find(p => p.name == projeAdi)
//             if (proje) return proje.id
//             throw new Error('Proje bulunamadı!')
//         })
// }

// var getCases = async function (projectId) {
//     console.log("projectId > ", projectId);
//     var cases = await testrail.getCases(projectId)
//     return cases.body
// }

// getProject()
//     .then(getCases)
//     .then(getCases)

const statuses = {
    passed: 1,
    blocked: 2,
    untested: 3,
    retest: 4,
    failed: 5,
}

async function addResultForCase(specResult) {
    var projects = await testrail.getProjects({ is_completed: 0 })
    var project = projects.find(p => p.name == projeAdi) //  as import('testrail-api').IProject
    var cases = await testrail.getCases(project.id) // as import('testrail-api').ICase[]
    var cs = cases.find(c => c.title == specResult.description)
    var runData = { description: 'Yeni bir koşu' } //as import('testrail-api').INewTestRun
    var run = await testrail.addRun(project.id, runData)
    var caseResultData = { status_id: statuses[specResult.status], elapsed: specResult.duration }  //as import('testrail-api').INewTestResult
    await testrail.addResultForCase(run.id, cs.id, caseResultData)
}


    //     testrail.addResult(1, {test_id,status_id,comment,defects,version}, function (err, result) 
    //     {
    //         console.log(result);
    //     });
    //     Promise.resolve().then(function(){return require('testrail-api');}).INewTestResult
    //     return await (await testrail.getCases(project.id)
    // })

    // .then(async function (cases) {
    //     console.log("cases > ",cases.body);
    // })
//     .catch (function (err) {
//     console.log("err > ", err);
// })