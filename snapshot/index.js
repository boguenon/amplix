const { time } = require('console');
const amp_tools = require('./amplix_tools');

(async () => {
    var args = process.argv.slice(2);
    var argparams = {};

    for (var i=0; i < args.length; i++)
    {
        if (args[i].indexOf("=") > -1)
        {
            var aname = args[i].substring(0, args[i].indexOf("=")).toUpperCase();
            var avalue = args[i].substring(args[i].indexOf("=") + 1);

            argparams[aname] = avalue;
        }
    }

    // node index.js OBJID={OBJID} IMGNAME={IMGNAME} WIDTH={WIDTH} HEIGHT={HEIGHT} JOBID={JOBID}
    if (!argparams["OBJID"] || !argparams["IMGNAME"])
    {
        console.log("need more arguments.");
        console.log(">> node index.js OBJID=ba4cb448-b2c7492a IMGNAME=imgname WIDTH=1024 HEIGHT=768 JOBID=jobid");
        return;
    }

    await amp_tools.restInit();
    var rpt = argparams["OBJID"];
    var imgname = argparams["IMGNAME"];
    var jobid = argparams["JOBID"];

    var cap = await amp_tools.captureReport(rpt, imgname, jobid);
    console.log("image path", cap.imgname);
})();