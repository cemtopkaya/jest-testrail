const Testrail = require('testrail-api');
const url = require("url");
const fiddlerProxy = {
    protocol: "http:",
    hostname: "127.0.0.1",
    port: 8889,
};
const setFiddlerPorxy = () => {
    var proxyUrl = url.format(fiddlerProxy);
    process.env.http_proxy = proxyUrl;
    process.env.https_proxy = proxyUrl;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; // Use this only for debugging purposes as it introduces a security issue
};
const removeFiddlerProxy = () => {
    process.env.http_proxy = "";
    process.env.https_proxy = "";
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "";
};


//setFiddlerPorxy();


class TestRailReporter {

    static async createInstance(_projectName, _saveWhenJasmineDone) {
        var raporcu = new TestRailReporter(_projectName, _saveWhenJasmineDone)
        raporcu.tr = await TestRailApi.createTestRailApi(undefined, undefined, undefined, _projectName)
        return raporcu
    }

    constructor(_projectName, _saveWhenJasmineDone = false, _saveSpecsAsSteps = true) {
        // this.tr = new TestRailApi(undefined, undefined, undefined, projectName)
        /**
         * Testlerin (it ile gelen) Jasmincesi SPEC,
         * TestRail içinde ise bunların adı CASE
         *
         * Tüm speclerin sonuçlarını (jasmine sonuç nesnelerini) this.specResults içinde
         * Speclerin sonuçlarının TestRailde saklanan nesnelerini this.caseResults içinde tutuyoruz
         *
         * Eğer her spec bittiğinde TestRail'e aktarılacaksa saveWhenJasmineDone=true
         * Eğer tüm testler (it(...)) tamamlandığında aktarılacaksa saveWhenJasmineDone=fase 
         */
        this.parentSuite = null
        this.currentSuite = null
        this.suites = []
        this.sections = []
        this.specs = []
        this.specResults = []
        this.caseResults = []
        this.saveWhenJasmineDone = _saveWhenJasmineDone
        this.saveSpecsAsSteps = _saveSpecsAsSteps
    }

    jasmineStarted(summary) {
        console.log('jasmineStarted > summary: ', summary)
    }

    async suiteStarted(suiteInfo) {
        console.log('suiteStarted > suiteInfo: ', suiteInfo)

        // console.log('suiteStarted > this: ', this)
        var sections = await this.tr.getSections()
        // var sections = null
        var section = (sections || []).find(s => s.name == suiteInfo.description)

        if (!section) {
            var previousSection = this.sections.slice(-1)[0]
            var previousSectionId = previousSection ? previousSection.id : null
            var sectionData = { name: suiteInfo.description, parent_id: previousSectionId }
            // section = await this.tr.addSection(sectionData)
        }
        this.sections.push(section)


        // this.parentSuite = this.suites.slice(-1)[0]
        this.parentSuite = this.suites.filter(s => !s._done).slice(-1)[0]
        suiteInfo._suites = []
        suiteInfo._specs = []
        suiteInfo._section = section
        suiteInfo._done = false
        suiteInfo._parentSuite = this.parentSuite || null
        if (this.parentSuite) { this.parentSuite._suites.push(suiteInfo) }
        this.suites.push(suiteInfo)
        // { id: 0, name: suiteInfo.description, parent_id: previousSectionId }
    }

    specStarted(specInfo) {
        console.log('specStarted > specInfo: ', specInfo)
        this.specs.push(specInfo)
    }

    async specDone(_specResult) {

        var specResult = _specResult
        console.log('specDone > specResult: ', specResult)
        this.specResults.push(specResult)

        if (!this.saveWhenJasmineDone) {
            return this.addResult(specResult)
        }

        var specCase = await this.getCase(specResult)
        console.log('[addResults] specCase: ', specCase);
        var caseResultData = { case_id: specCase.id, status_id: this.tr.statuses[specResult.status], elapsed: specResult.duration }  //as import('testrail-api').INewTestResult
        this.caseResults.push(caseResultData)
    }

    suiteDone(suiteResult) {
        console.log('suiteDone > suiteResult: ', suiteResult)
        var suiteElem = this.suites.find(s => s.id == suiteResult.id)
        suiteElem = Object.assign(suiteElem || {}, { _done: true }, suiteResult)
        this.parentSuite = this.suites.slice(-2)[0]
    }

    async jasmineDone(summary) {
        console.log('jasmineDone > summary: ', summary)

        if (this.saveWhenJasmineDone) {
            if (this.saveSpecsAsSteps) {
                console.log('[jasmineDone] this.suites: ', this.suites)
                await this.addResultsAsSteps(this.suites)
            } else {
                console.log('[jasmineDone] this.caseResults: ', this.caseResults)
                await this.addResults(this.caseResults)
            }
        }
    }

    async getCase(_specDescription) {
        var specDescription = _specDescription
        // return this.tr.projectId
        // .then(projectId=> this.tr.getCaseByTitle(projectId, specDescription))
        // .then(async caseOfSpec=>{
        //     if (!caseOfSpec) {
        //         var sectionId = this.saveSpecsAsSteps ? 0 : this.suites.slice(-1)[0].id
        //         var response = await this.tr.createCaseFromSpec(sectionId, specDescription)
        //         caseOfSpec = response
        //     }
        //     console.log('[getSpec] caseOfSpec: ', caseOfSpec);
        //     return caseOfSpec
        // })
        // .catch(error=>{
        //     console.error('[getSpec] Error: ', error);
        // })

        try {

            var projectId = await this.tr.projectId
            var caseOfSpec = await this.tr.getCaseByTitle(projectId, specDescription)
            if (!caseOfSpec) {
                var sectionId = this.saveSpecsAsSteps ? 0 : this.suites.slice(-1)[0].id
                var response = await this.tr.createCaseFromSpec(sectionId, specDescription)
                caseOfSpec = response
            }
            console.log('[getSpec] caseOfSpec: ', caseOfSpec);
            return caseOfSpec
        } catch (error) {
            console.error('[getSpec] Error: ', error);
            throw error
        }
    }

    async addResultsAsSteps(_suites) {
        try {

            var requestObject = { results: [] } // as import('testrail-api').INewTestResults
            var suitesWithSpecs = _suites.filter(s => s._specs.length > 0)
            suitesWithSpecs.forEach(async s => {
                try {
                    s.cem = "canan"
                    var caseOfSpec = await this.getCase(s.description)
                    s._case_id = caseOfSpec.id
                } catch (error) {
                    console.error('[getCase] Error: ', error);
                    throw error
                }
            })

            requestObject.results = suitesWithSpecs.map(s => {
                var stepResults = s._specs.map(it => {
                    return {
                        "content": it.description,
                        "status_id": this.tr.statuses[it.status],
                    }
                })
                var c = {
                    case_id: s.case_id,
                    status_id: this.tr.statuses[s.status],
                    elapsed: s.duration,
                    custom_step_results: stepResults
                }
                return c;
            })

            // var response = await this.tr.addResultsForCases(runId,)
        } catch (error) {
            console.error('[addResultsAsSteps] Error: ', error);
        }
    }

    async addResult(_specResult) {
        var runId = await this.tr.runId
        var specResult = _specResult
        try {

            var specCase = await this.getCase(_specResult.description)
            var response = await this.tr.addResultForCase(runId, specCase, specResult)
            return response.body
        } catch (error) {
            console.error('[addResult] Error: ', error);
        }
    }

    async addResults(_specResults) {
        if (!_specResults || !Array.isArray(_specResults)) {
            throw new Error('SPEC RESULTS can not be null! _specResults: ', _specResults)
        }

        var runId = await this.tr.runId
        var specResults = _specResults
        // console.log('[addResults] specResults1: ', specResults);

        try {
            // var STATUSES = this.tr.statuses
            // Collect all results send at once
            // var specResults = await Promise.all(_specResults.map(async _specResult => {
            //     var specCase = await this.getCase(_specResult)
            //     console.log('[addResults] specCase: ', specCase);
            //     var caseResultData = { case_id: specCase.id, status_id: STATUSES[_specResult.status], elapsed: _specResult.duration }  //as import('testrail-api').INewTestResult
            //     return caseResultData
            // }))
            // console.log('[addResults] specResults2: ', specResults);
            // this.tr.addResultsForCases(runId, specResults)

            console.log('[addResults] specResults: ', specResults);
            var response = await this.tr.addResultsForCases(runId, specResults)
            return response
        } catch (error) {
            console.error('[addResults] Error: ', error);
            throw error
        }
    }
}

class TestRailApi {
    static async createTestRailApi(_host, _user, _password, _projectTitle) {
        var tr = new TestRailApi(_host, _user, _password, _projectTitle)
        // tr.projects = await tr.getProjects()
        // tr.project = await tr.getProject(tr.projects, _projectTitle)
        // tr.cases = await tr.getCases(tr.project.id)
        // tr.run = await tr.createRun(tr.project.id, `Test Run [${new Date().toISOString()}]`, 'run açıklaması')
        return tr
    }

    constructor(_host, _user, _password, _projectTitle) {

        this.host = _host
        this.user = _user
        this.password = _password
        this.projectTitle = _projectTitle
        // this.project = undefined
        // this.projectName = projectTitle
        this._api = null
        this._cases = null
        this._projects = null
        this._project = null

        this.statuses = {
            passed: 1,
            blocked: 2,
            untested: 3,
            retest: 4,
            failed: 5,
        }
    }

    get api() {

        try {
            if (!this._api) {
                this._api = new Testrail({
                    host: this.host || 'http://ulakcem.testrail.io/',
                    user: this.user || 'cem.topkaya@ulakhaberlesme.com.tr',
                    password: this.password || 'q1w2e3r4'
                });
            }
            return this._api

        } catch (error) {
            console.error('[api] Error: ', error);
            throw error
        }
    }

    get projects() {
        return (async () => {
            try {
                if (!this._projects) {
                    this._projects = await this.getProjects()
                }
                return this._projects
            } catch (error) {
                console.log("[get project] Error: ", error);
                throw error
            }
        })()
    }

    get project() {
        return (async () => {
            try {
                if (!this._project) {
                    var projects = await this.projects
                    this._project = await this.getProject(projects, this.projectTitle)
                }
                console.log("[get project] this._project: ", this._project);
                return this._project
            } catch (error) {
                console.log("[get project] Error: ", error);
                throw error
            }
        })()
    }

    get projectId() {
        return (async () => {
            try {
                if (!this._projectId) {
                    var prj = await this.project
                    this._projectId = prj.id
                }
                console.log("[get projectId] this._projectId: ", this._projectId);
                return this._projectId
            } catch (error) {
                console.error('[getProjects] Error: ', error);
                throw error
            }
        })()
    }

    get cases() {
        return (async () => {
            try {
                var projectId = await this.projectId
                this._cases = this._cases || await this.getCases(projectId)
                console.log("[get cases] this._cases: ", this._cases);
                return this._cases
            } catch (error) {
                console.error('[getProjects] Error: ', error);
                throw error
            }
        })()
    }

    get run() {
        return (async () => {
            try {
                var projectId = await this.projectId
                console.log("[get run] projectId: ", projectId);
                this._run = this._run || await this.createRun(projectId, `Test Run [${new Date().toISOString()}]`, 'run açıklaması')
                return this._run
            } catch (error) {
                console.error('[getProjects] Error: ', error);
                throw error
            }
        })()
    }

    get runId() {
        try {
            return (async () => {
                try {
                    var run = await this.run
                    console.log(run)
                    console.log(run.id)
                    return run.id
                } catch (error) {
                    console.error('[getProjects] Error: ', error);
                    throw error
                }
            })()
        } catch (error) {
            console.error('[getProjects] Error: ', error);
            throw error
        }
    }

    async getSectionByName(_sectionName) {
        try {
            if (!_sectionName) throw new Error('Section name can not be null!')
            var sections = await this.getSections()
            return sections.find(s => s.name == _sectionName)
        } catch (error) {
            console.log("[getSectionByName] Error: ", error);
            throw error
        }
    }

    async getSections(_projectId) {
        try {
            var projectId = _projectId || await this.projectId
            if (!projectId) throw new Error('Project ID can not be null! projectId: ', projectId)
            return (await this.api.getSections(projectId)).body
        } catch (error) {
            console.log("[getSections] Error: ", error);
            throw error
        }
    }

    async addSection({ name, description, parent_id }, _projectId) {
        try {
            var projectId = _projectId || await this.projectId
            if (!projectId) throw new Error('Project ID can not be null!')

            var sectionData = { name, description, parent_id }
            var response = await this.api.addSection(projectId, sectionData)
            // all sections with added one
            this.getSections(projectId)
            return response.body
        } catch (error) {
            console.log("[addSection] Error: ", error);
            throw error
        }
    }

    async createCaseFromSpec(_sectionId, _specDescription) {
        try {
            if (!_sectionId) throw new Error('SECTION can not be null! _section: ', _sectionId)
            if (!_specDescription) throw new Error('SPEC can not be null! _spec: ', _specDescription)

            var caseData = { title: _specDescription, type_id: 1 } // as import('testrail-api').ICaseUpdate
            var response = await this.api.addCase(_sectionId.id, caseData)
            return response.body
        } catch (error) {
            console.error('[createCaseFromSpec] Error: ', error);
            throw error
        }
    }

    async createRun(_projectId, _runName, _runDescription) {
        try {
            if (!_projectId) throw new Error('Project ID can not be null!')
            // assignedto_id: 1 > Me
            // case_ids: [1,2, ...] veya > include_all: 1
            var runData = { name: _runName, description: _runDescription, include_all: 1, assignedto_id: 1 } //as import('testrail-api').INewTestRun
            var response = await this.api.addRun(_projectId, runData)
            var result = response.body
            return result
        } catch (error) {
            console.log("[createRun] Error: ", error);
            throw error
        }
    }
    async getProjects() {
        try {
            var resp = await this.api.getProjects({ is_completed: 0 })
            var projects = resp.body
            return projects
        } catch (error) {
            console.error('[getProjects] Error: ', error);
            throw error
        }
    }

    async getProject(arrProjects, _projectName) {
        try {
            if (!_projectName) { throw new Error('Project name can not be null!') }

            var projectName = _projectName
            return arrProjects.find(p => p.name == projectName) //  as import('testrail-api').IProject
        } catch (error) {
            console.log("[getProject] Error: ", error);
            throw error
        }
    }

    async getCaseByTitle(_projectId, _title) {
        try {
            if (!_title) throw new Error('Case description can not be null!')
            if (!_projectId) throw new Error('Project ID can not be null!')

            var cases = await this.cases
            console.log('[getCaseByTitle] cases: ', cases);
            var foundCase = cases.find(c => c.title == _title)
            console.log('[getCaseByTitle] foundCase: ', foundCase);
            return foundCase;
        } catch (error) {
            console.log("[getCaseByTitle] Error: ", error);
            throw error
        }
    }

    async getCases(_projectId = null) {
        if (!_projectId) { throw new Error('Project ID can not be null! _projectId:', _projectId) }

        try {

            var projectId = _projectId
            var response = await this.api.getCases(projectId)
            return response.body // as import('testrail-api').ICase[]

        } catch (error) {
            console.error('[getCases] Error: ', error);
            throw error
        }
    }

    async addResultForCase(_runId, _case, _specResult) {
        try {

            if (!_runId) { throw new Error('RUN ID can not be null! _runId:', _runId) }
            if (!_case) { throw new Error('Case can not be null! _case:', _case) }
            if (!_specResult) { throw new Error('Spec Result can not be null! _specResult:', _specResult) }
            // var projects = await this.testrail.getProjects({ is_completed: 0 })
            // var project = projects.find(p => p.name == projeAdi) //  as import('testrail-api').IProject
            // var cases = await this.testrail.getCases(projectId) // as import('testrail-api').ICase[]
            // var runData = { description: 'Yeni bir koşu' } //as import('testrail-api').INewTestRun
            // var run = await this.testrail.addRun(project.id, runData)
            var caseResultData = { status_id: this.statuses[_specResult.status], elapsed: _specResult.duration }  //as import('testrail-api').INewTestResult
            var response = await this.api.addResultForCase(_runId, _case.id, caseResultData)
            return response.body
        } catch (error) {
            console.error('[addResultForCase] Error: ', error);
            throw error
        }
    }

    async addResultsForCases(_runId, _caseResults) {
        try {

            if (!_runId) { throw new Error('RUN ID can not be null! _runId:', _runId) }
            if (!_caseResults && !Array.isArray(_caseResults)) { throw new Error('Spec Results can not be null and other than Array! _specResults:', _caseResults) }

            console.log('[addResultsForCases] _specResults:', _caseResults);

            var response = await this.api.addResultsForCases(_runId, _caseResults)
            console.log('[addResultsForCases] response: ', response);
            return response.body
        } catch (error) {
            console.error('[addResultsForCases] Error: ', error);
            throw error
        }
    }
}

module.exports = { TestRailReporter }