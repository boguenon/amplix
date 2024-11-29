const fs = require('fs');
const https = require('https');
const http = require('http');
const puppeteer = require("puppeteer");

var corpus_cache;

var csrf_token = "ampl_csrf_token";
var mts = "0122483f-0155fb46";
var hostname = "localhost";
var hostport = 8580;
var croot = "/krcp";
var ampl_csrf_token;

var viewer_userid = "amp_viewer";
var viewer_passwd = "B%c@6xK3lq";

module.exports = {
    httpRequest: function() {
        const requestPromise = (options, postData = null) => new Promise((resolve, reject) => {
			const isPostWithData = options && options.method === "POST" && postData !== null;
			if (isPostWithData && (!options.headers || !options.headers["Content-Length"])) {
			  // Convenience: Add Content-Length header
			  options = Object.assign({}, options, {
				headers: Object.assign({}, options.headers, {
				  "Content-Length": Buffer.byteLength(postData)
				})
			  });
			}
			const body = [];
			const req = http.request(options, res => {
			  res.on('data', chunk => {
				body.push(chunk);
			  });
			  res.on('end', () => {
				res.body = Buffer.concat(body);
				resolve(res);
			  });
			});
		  
			req.on('error', e => {
			  reject(e);
			});
		  
			if (isPostWithData) {
			  console.log("... writing post data");
			  req.write(postData);
			}
			req.end();
		});

        return requestPromise;
    },

    sleep: function() {
        const sleepTimer = (callback, ms) => new Promise(resolve => setTimeout(function() {
            callback.call();
        }, ms));

        return sleepTimer;
    },

    restInit: async function() {
        console.log("trying to login");
        var postData = {
            ack: "login",
            _mts_: mts,
            payload: {
                userid: viewer_userid,
                passwd: viewer_passwd,
                encrypt: "no"
            },
            mbody: {
                lang: "en_US",
                mts: mts,
                app: "",
                session_expire: "0"
            }
        };

        try {
            if (!ampl_csrf_token)
            {
                const res = await module.exports.httpRequest()({
                    method: "POST",
                    hostname: hostname,
                    port: hostport,
                    path: croot + "/login",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=UTF-8'
                    }
                }, JSON.stringify(postData));
                ampl_csrf_token = res.headers[csrf_token];
                console.log("ampl_csrf_token => " + ampl_csrf_token);
                var resjson = JSON.parse(res.body.toString("utf8"));
            }
        } catch (e) {
            console.error(e);
        }
    },
    
    captureReport: async function(rptpath, imgname, jobid) {
        var postData = {
            ack: "helpcontent",
            payload: {
                uid: rptpath
            },
            mbody: {
                option: "translate"
            },
            _mts_: mts
        };

        var objid;
        var r = {};

        try {
            const res = await module.exports.httpRequest()({
                method: "POST",
                hostname: hostname,
                port: hostport,
                path: croot + "/helpcontent",
                headers: {
                    'ampl_csrf_token': ampl_csrf_token,
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=UTF-8'
				}
            }, JSON.stringify(postData));
            console.log(res.body.toString("utf8"));
            var resjson = JSON.parse(res.body.toString("utf8"));

            if (resjson.result && resjson.result.length)
            {
                objid = resjson.result[0].uid;
                r.item = resjson.result[0];
                r.imgname = imgname + ".png";
            }
        } catch (e) {
            console.error(e);
        }

        if (!objid)
        {
            return;
        }

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox'],
            defaultViewport: {
                width: 1024,
                height: 768,
            }
        });
        
        const page = await browser.newPage();
        await page.setExtraHTTPHeaders({
            ampl_csrf_token: ampl_csrf_token
        });

        page.setDefaultNavigationTimeout(30000);

        var page_url = "http://" + hostname + ":" + hostport + "/launcher/viewer.jsp?" + (jobid ? "jobid=" + jobid : "objid=" + objid);

        console.log("page url => " + page_url);

        await page.goto(page_url);
        await page.exposeFunction('onAmplixViewerLoaded', async(type) => {
            console.log("waiting page loading...");
            if (type == "done")
            {
                console.log("page loaded");
                await page.screenshot({ path: "../temp/" + imgname + ".png" });
                console.log("screen captured");
                await browser.close();
                console.log("browser closed");
            }
        });

        await new Promise((resolve, reject) => setTimeout(resolve, 3000));

        console.log("watchdog completed");

        return r;
    }
}