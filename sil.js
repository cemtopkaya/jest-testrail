var reqGetRuns = (projectId = 4)=>{
    return new Promise((resolve, rej) => {
        const http = require("https");

        const options = {
            "method": "GET",
            "hostname": "ulakcem.testrail.io",
            "port": null,
            "path": "/index.php?%2Fapi%2Fv2%2Fget_runs%2F" + projectId + "=",
            "headers": {
                "cookie": "tr_session=8faf8e27-99ce-40e0-9aad-16a579935e8b",
                "Content-Type": "application/json",
                "Content-Length": "0",
                "Authorization": "Basic Y2VtLnRvcGtheWFAdWxha2hhYmVybGVzbWUuY29tLnRyOnExdzJlM3I0"
            }
        };

        const req = http.request(options, function (res) {
            const chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                const body = Buffer.concat(chunks);
                console.log("reqGetRuns body :" ,body.toString());
                resolve(JSON.parse(body))
            });
        });

        req.end();
    })
}

var reqGetSections = (projectId = 4)=>{
    return new Promise((resolve, rej) => {

        const http = require("https");

        const options = {
            "method": "GET",
            "hostname": "ulak.testrail.io",
            "port": null,
            "path": "/index.php?%2Fapi%2Fv2%2Fget_sections%2F" + projectId + "=",
            "headers": {
                "cookie": "tr_session=8faf8e27-99ce-40e0-9aad-16a579935e8b",
                "Content-Type": "application/json",
                "Content-Length": "0",
                "Authorization": "Basic Y2VtLnRvcGtheWFAdWxha2hhYmVybGVzbWUuY29tLnRyOnExdzJlM3I0"
            }
        };

        const req = http.request(options, function (res) {
            const chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                const body = Buffer.concat(chunks);
                console.log("reqGetSections body :" ,body.toString());
                resolve(JSON.parse(body))
            });
        });

        req.end();
    })
}

var reqDeleteSection = (sectionId) => {
    console.log("sectionId: ",sectionId);
    const http = require("https");

    const options = {
        "method": "POST",
        "hostname": "ulak.testrail.io",
        "port": null,
        "path": "/index.php?%2Fapi%2Fv2%2Fdelete_section%2F" + sectionId + "=",
        "headers": {
            "cookie": "tr_session=8faf8e27-99ce-40e0-9aad-16a579935e8b",
            "Content-Type": "application/json",
            "Content-Length": "0",
            "Authorization": "Basic bWV0ZS5rb3J1Y3VAdWxha2hhYmVybGVzbWUuY29tLnRyOjFxMnczZTRy"
        }
    };

    const req = http.request(options, function (res) {
        const chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            const body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });

    req.end();
}

var reqDeleteRun = (id) => {
    const http = require("https");

    const options = {
        "method": "POST",
        "hostname": "ulak.testrail.io",
        "port": null,
        "path": "/index.php?%2Fapi%2Fv2%2Fdelete_run%2F" + id + "=",
        "headers": {
            "cookie": "tr_session=8faf8e27-99ce-40e0-9aad-16a579935e8b",
            "Content-Type": "application/json",
            "Content-Length": "0",
            "Authorization": "Basic Y2VtLnRvcGtheWFAdWxha2hhYmVybGVzbWUuY29tLnRyOnExdzJlM3I0"
        }
    };

    const req = http.request(options, function (res) {
        const chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            const body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });

    req.end();
}

reqGetSections().then(sections => {
    sections.filter(s => s.parent_id == null).forEach(s=>reqDeleteSection(s.id))
})

reqGetRuns().then(runs=>{ runs.forEach(r=>reqDeleteRun(r.id)) })

