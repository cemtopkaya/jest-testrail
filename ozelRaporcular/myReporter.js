module.exports = {
    jasmineStarted: function (suiteInfo) {
        console.log('jasmineStarted > Running suite with ' + suiteInfo.totalSpecsDefined);
    },

    suiteStarted: function (result) {
        console.log('suiteStarted > Suite started > ', result)
        console.log('Suite started: ' + result.description
            + ' whose full description is: ' + result.fullName);
    },

    specStarted: function (result) {
        console.log('specStarted > Spec started: ' + result.description
            + ' whose full description is: ' + result.fullName);
    },

    specDone: function (result) {
        console.log('specDone > Spec: ' + result.description + ' was ' + result.status);

        for (var i = 0; i < result.failedExpectations.length; i++) {
            console.log('Failure: ' + result.failedExpectations[i].message);
            console.log(result.failedExpectations[i].stack);
        }

        console.log(result.passedExpectations.length);
    },

    suiteDone: function (result) {
        console.log('suiteDone > Suite: ' + result.description + ' was ' + result.status);
        for (var i = 0; i < result.failedExpectations.length; i++) {
            console.log('Suite ' + result.failedExpectations[i].message);
            console.log(result.failedExpectations[i].stack);
        }
    },

    jasmineDone: function (result) {
        console.log('jasmineDone > Finished suite: ', result);
        for (var i = 0; i < result.failedExpectations.length; i++) {
            console.log('Global ' + result.failedExpectations[i].message);
            console.log(result.failedExpectations[i].stack);
        }
    }
}