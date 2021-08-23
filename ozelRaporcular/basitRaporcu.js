class BasitRaporcu {
    constructor(globalConfig, options) {
        this._globalConfig = globalConfig;
        this._options = options;
    }

    jasmineStarted(summary) { console.log('jasmineStarted > summary: ', summary) }
    suiteStarted(suiteInfo) { console.log('suiteStarted > suiteInfo: ', suiteInfo) }
    specStarted(specInfo) { console.log('specStarted > specInfo: ', specInfo) }
    specDone(specResult) { console.log('specDone > specResult: ', specResult) }
    suiteDone(suiteResult) { console.log('suiteDone > suiteResult: ', suiteResult) }
    jasmineDone(summary) { console.log('jasmineDone > summary: ', summary) }
}

module.exports = new BasitRaporcu