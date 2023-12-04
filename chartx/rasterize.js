{"payload":{"allShortcutsEnabled":false,"fileTree":{"examples":{"items":[{"name":"arguments.js","path":"examples/arguments.js","contentType":"file"},{"name":"child_process-examples.js","path":"examples/child_process-examples.js","contentType":"file"},{"name":"colorwheel.js","path":"examples/colorwheel.js","contentType":"file"},{"name":"countdown.js","path":"examples/countdown.js","contentType":"file"},{"name":"detectsniff.js","path":"examples/detectsniff.js","contentType":"file"},{"name":"echoToFile.js","path":"examples/echoToFile.js","contentType":"file"},{"name":"features.js","path":"examples/features.js","contentType":"file"},{"name":"fibo.js","path":"examples/fibo.js","contentType":"file"},{"name":"hello.js","path":"examples/hello.js","contentType":"file"},{"name":"injectme.js","path":"examples/injectme.js","contentType":"file"},{"name":"loadspeed.js","path":"examples/loadspeed.js","contentType":"file"},{"name":"loadurlwithoutcss.js","path":"examples/loadurlwithoutcss.js","contentType":"file"},{"name":"modernizr.js","path":"examples/modernizr.js","contentType":"file"},{"name":"module.js","path":"examples/module.js","contentType":"file"},{"name":"netlog.js","path":"examples/netlog.js","contentType":"file"},{"name":"netsniff.js","path":"examples/netsniff.js","contentType":"file"},{"name":"openurlwithproxy.js","path":"examples/openurlwithproxy.js","contentType":"file"},{"name":"outputEncoding.js","path":"examples/outputEncoding.js","contentType":"file"},{"name":"page_events.js","path":"examples/page_events.js","contentType":"file"},{"name":"pagecallback.js","path":"examples/pagecallback.js","contentType":"file"},{"name":"phantomwebintro.js","path":"examples/phantomwebintro.js","contentType":"file"},{"name":"post.js","path":"examples/post.js","contentType":"file"},{"name":"postjson.js","path":"examples/postjson.js","contentType":"file"},{"name":"postserver.js","path":"examples/postserver.js","contentType":"file"},{"name":"printenv.js","path":"examples/printenv.js","contentType":"file"},{"name":"printheaderfooter.js","path":"examples/printheaderfooter.js","contentType":"file"},{"name":"printmargins.js","path":"examples/printmargins.js","contentType":"file"},{"name":"rasterize.js","path":"examples/rasterize.js","contentType":"file"},{"name":"render_multi_url.js","path":"examples/render_multi_url.js","contentType":"file"},{"name":"responsive-screenshot.js","path":"examples/responsive-screenshot.js","contentType":"file"},{"name":"run-jasmine.js","path":"examples/run-jasmine.js","contentType":"file"},{"name":"run-jasmine2.js","path":"examples/run-jasmine2.js","contentType":"file"},{"name":"run-qunit.js","path":"examples/run-qunit.js","contentType":"file"},{"name":"scandir.js","path":"examples/scandir.js","contentType":"file"},{"name":"server.js","path":"examples/server.js","contentType":"file"},{"name":"serverkeepalive.js","path":"examples/serverkeepalive.js","contentType":"file"},{"name":"simpleserver.js","path":"examples/simpleserver.js","contentType":"file"},{"name":"sleepsort.js","path":"examples/sleepsort.js","contentType":"file"},{"name":"stdin-stdout-stderr.js","path":"examples/stdin-stdout-stderr.js","contentType":"file"},{"name":"universe.js","path":"examples/universe.js","contentType":"file"},{"name":"unrandomize.js","path":"examples/unrandomize.js","contentType":"file"},{"name":"useragent.js","path":"examples/useragent.js","contentType":"file"},{"name":"version.js","path":"examples/version.js","contentType":"file"},{"name":"waitfor.js","path":"examples/waitfor.js","contentType":"file"},{"name":"walk_through_frames.js","path":"examples/walk_through_frames.js","contentType":"file"}],"totalCount":45},"":{"items":[{"name":".github","path":".github","contentType":"directory"},{"name":"examples","path":"examples","contentType":"directory"},{"name":"src","path":"src","contentType":"directory"},{"name":"test","path":"test","contentType":"directory"},{"name":"tools","path":"tools","contentType":"directory"},{"name":".gitignore","path":".gitignore","contentType":"file"},{"name":"CMakeLists.txt","path":"CMakeLists.txt","contentType":"file"},{"name":"CONTRIBUTING.md","path":"CONTRIBUTING.md","contentType":"file"},{"name":"ChangeLog","path":"ChangeLog","contentType":"file"},{"name":"INSTALL","path":"INSTALL","contentType":"file"},{"name":"LICENSE.BSD","path":"LICENSE.BSD","contentType":"file"},{"name":"README.md","path":"README.md","contentType":"file"},{"name":"configure","path":"configure","contentType":"file"},{"name":"third-party.txt","path":"third-party.txt","contentType":"file"}],"totalCount":14}},"fileTreeProcessingTime":9.071798000000001,"foldersToFetch":[],"reducedMotionEnabled":null,"repo":{"id":1200050,"defaultBranch":"master","name":"phantomjs","ownerLogin":"ariya","currentUserCanPush":false,"isFork":false,"isEmpty":false,"createdAt":"2010-12-27T08:18:58.000Z","ownerAvatar":"https://avatars.githubusercontent.com/u/7288?v=4","public":true,"private":false,"isOrgOwned":false},"symbolsExpanded":false,"treeExpanded":true,"refInfo":{"name":"master","listCacheKey":"v0:1579503058.0","canEdit":false,"refType":"branch","currentOid":"0a0b0facb16acfbabb7804822ecaf4f4b9dce3d2"},"path":"examples/rasterize.js","currentUser":null,"blob":{"rawLines":["\"use strict\";","var page = require('webpage').create(),","    system = require('system'),","    address, output, size, pageWidth, pageHeight;","","if (system.args.length < 3 || system.args.length > 5) {","    console.log('Usage: rasterize.js URL filename [paperwidth*paperheight|paperformat] [zoom]');","    console.log('  paper (pdf output) examples: \"5in*7.5in\", \"10cm*20cm\", \"A4\", \"Letter\"');","    console.log('  image (png/jpg output) examples: \"1920px\" entire page, window width 1920px');","    console.log('                                   \"800px*600px\" window, clipped to 800x600');","    phantom.exit(1);","} else {","    address = system.args[1];","    output = system.args[2];","    page.viewportSize = { width: 600, height: 600 };","    if (system.args.length > 3 && system.args[2].substr(-4) === \".pdf\") {","        size = system.args[3].split('*');","        page.paperSize = size.length === 2 ? { width: size[0], height: size[1], margin: '0px' }","                                           : { format: system.args[3], orientation: 'portrait', margin: '1cm' };","    } else if (system.args.length > 3 && system.args[3].substr(-2) === \"px\") {","        size = system.args[3].split('*');","        if (size.length === 2) {","            pageWidth = parseInt(size[0], 10);","            pageHeight = parseInt(size[1], 10);","            page.viewportSize = { width: pageWidth, height: pageHeight };","            page.clipRect = { top: 0, left: 0, width: pageWidth, height: pageHeight };","        } else {","            console.log(\"size:\", system.args[3]);","            pageWidth = parseInt(system.args[3], 10);","            pageHeight = parseInt(pageWidth * 3/4, 10); // it's as good an assumption as any","            console.log (\"pageHeight:\",pageHeight);","            page.viewportSize = { width: pageWidth, height: pageHeight };","        }","    }","    if (system.args.length > 4) {","        page.zoomFactor = system.args[4];","    }","    page.open(address, function (status) {","        if (status !== 'success') {","            console.log('Unable to load the address!');","            phantom.exit(1);","        } else {","            window.setTimeout(function () {","                page.render(output);","                phantom.exit();","            }, 200);","        }","    });","}"],"stylingDirectives":[[{"start":0,"end":12,"cssClass":"pl-s"},{"start":12,"end":13,"cssClass":"pl-kos"}],[{"start":0,"end":3,"cssClass":"pl-k"},{"start":4,"end":8,"cssClass":"pl-s1"},{"start":9,"end":10,"cssClass":"pl-c1"},{"start":11,"end":18,"cssClass":"pl-en"},{"start":18,"end":19,"cssClass":"pl-kos"},{"start":19,"end":28,"cssClass":"pl-s"},{"start":28,"end":29,"cssClass":"pl-kos"},{"start":29,"end":30,"cssClass":"pl-kos"},{"start":30,"end":36,"cssClass":"pl-en"},{"start":36,"end":37,"cssClass":"pl-kos"},{"start":37,"end":38,"cssClass":"pl-kos"},{"start":38,"end":39,"cssClass":"pl-kos"}],[{"start":4,"end":10,"cssClass":"pl-s1"},{"start":11,"end":12,"cssClass":"pl-c1"},{"start":13,"end":20,"cssClass":"pl-en"},{"start":20,"end":21,"cssClass":"pl-kos"},{"start":21,"end":29,"cssClass":"pl-s"},{"start":29,"end":30,"cssClass":"pl-kos"},{"start":30,"end":31,"cssClass":"pl-kos"}],[{"start":4,"end":11,"cssClass":"pl-s1"},{"start":11,"end":12,"cssClass":"pl-kos"},{"start":13,"end":19,"cssClass":"pl-s1"},{"start":19,"end":20,"cssClass":"pl-kos"},{"start":21,"end":25,"cssClass":"pl-s1"},{"start":25,"end":26,"cssClass":"pl-kos"},{"start":27,"end":36,"cssClass":"pl-s1"},{"start":36,"end":37,"cssClass":"pl-kos"},{"start":38,"end":48,"cssClass":"pl-s1"},{"start":48,"end":49,"cssClass":"pl-kos"}],[],[{"start":0,"end":2,"cssClass":"pl-k"},{"start":3,"end":4,"cssClass":"pl-kos"},{"start":4,"end":10,"cssClass":"pl-s1"},{"start":10,"end":11,"cssClass":"pl-kos"},{"start":11,"end":15,"cssClass":"pl-c1"},{"start":15,"end":16,"cssClass":"pl-kos"},{"start":16,"end":22,"cssClass":"pl-c1"},{"start":23,"end":24,"cssClass":"pl-c1"},{"start":25,"end":26,"cssClass":"pl-c1"},{"start":27,"end":29,"cssClass":"pl-c1"},{"start":30,"end":36,"cssClass":"pl-s1"},{"start":36,"end":37,"cssClass":"pl-kos"},{"start":37,"end":41,"cssClass":"pl-c1"},{"start":41,"end":42,"cssClass":"pl-kos"},{"start":42,"end":48,"cssClass":"pl-c1"},{"start":49,"end":50,"cssClass":"pl-c1"},{"start":51,"end":52,"cssClass":"pl-c1"},{"start":52,"end":53,"cssClass":"pl-kos"},{"start":54,"end":55,"cssClass":"pl-kos"}],[{"start":4,"end":11,"cssClass":"pl-smi"},{"start":11,"end":12,"cssClass":"pl-kos"},{"start":12,"end":15,"cssClass":"pl-en"},{"start":15,"end":16,"cssClass":"pl-kos"},{"start":16,"end":94,"cssClass":"pl-s"},{"start":94,"end":95,"cssClass":"pl-kos"},{"start":95,"end":96,"cssClass":"pl-kos"}],[{"start":4,"end":11,"cssClass":"pl-smi"},{"start":11,"end":12,"cssClass":"pl-kos"},{"start":12,"end":15,"cssClass":"pl-en"},{"start":15,"end":16,"cssClass":"pl-kos"},{"start":16,"end":89,"cssClass":"pl-s"},{"start":89,"end":90,"cssClass":"pl-kos"},{"start":90,"end":91,"cssClass":"pl-kos"}],[{"start":4,"end":11,"cssClass":"pl-smi"},{"start":11,"end":12,"cssClass":"pl-kos"},{"start":12,"end":15,"cssClass":"pl-en"},{"start":15,"end":16,"cssClass":"pl-kos"},{"start":16,"end":94,"cssClass":"pl-s"},{"start":94,"end":95,"cssClass":"pl-kos"},{"start":95,"end":96,"cssClass":"pl-kos"}],[{"start":4,"end":11,"cssClass":"pl-smi"},{"start":11,"end":12,"cssClass":"pl-kos"},{"start":12,"end":15,"cssClass":"pl-en"},{"start":15,"end":16,"cssClass":"pl-kos"},{"start":16,"end":93,"cssClass":"pl-s"},{"start":93,"end":94,"cssClass":"pl-kos"},{"start":94,"end":95,"cssClass":"pl-kos"}],[{"start":4,"end":11,"cssClass":"pl-s1"},{"start":11,"end":12,"cssClass":"pl-kos"},{"start":12,"end":16,"cssClass":"pl-en"},{"start":16,"end":17,"cssClass":"pl-kos"},{"start":17,"end":18,"cssClass":"pl-c1"},{"start":18,"end":19,"cssClass":"pl-kos"},{"start":19,"end":20,"cssClass":"pl-kos"}],[{"start":0,"end":1,"cssClass":"pl-kos"},{"start":2,"end":6,"cssClass":"pl-k"},{"start":7,"end":8,"cssClass":"pl-kos"}],[{"start":4,"end":11,"cssClass":"pl-s1"},{"start":12,"end":13,"cssClass":"pl-c1"},{"start":14,"end":20,"cssClass":"pl-s1"},{"start":20,"end":21,"cssClass":"pl-kos"},{"start":21,"end":25,"cssClass":"pl-c1"},{"start":25,"end":26,"cssClass":"pl-kos"},{"start":26,"end":27,"cssClass":"pl-c1"},{"start":27,"end":28,"cssClass":"pl-kos"},{"start":28,"end":29,"cssClass":"pl-kos"}],[{"start":4,"end":10,"cssClass":"pl-s1"},{"start":11,"end":12,"cssClass":"pl-c1"},{"start":13,"end":19,"cssClass":"pl-s1"},{"start":19,"end":20,"cssClass":"pl-kos"},{"start":20,"end":24,"cssClass":"pl-c1"},{"start":24,"end":25,"cssClass":"pl-kos"},{"start":25,"end":26,"cssClass":"pl-c1"},{"start":26,"end":27,"cssClass":"pl-kos"},{"start":27,"end":28,"cssClass":"pl-kos"}],[{"start":4,"end":8,"cssClass":"pl-s1"},{"start":8,"end":9,"cssClass":"pl-kos"},{"start":9,"end":21,"cssClass":"pl-c1"},{"start":22,"end":23,"cssClass":"pl-c1"},{"start":24,"end":25,"cssClass":"pl-kos"},{"start":26,"end":31,"cssClass":"pl-c1"},{"start":33,"end":36,"cssClass":"pl-c1"},{"start":36,"end":37,"cssClass":"pl-kos"},{"start":38,"end":44,"cssClass":"pl-c1"},{"start":46,"end":49,"cssClass":"pl-c1"},{"start":50,"end":51,"cssClass":"pl-kos"},{"start":51,"end":52,"cssClass":"pl-kos"}],[{"start":4,"end":6,"cssClass":"pl-k"},{"start":7,"end":8,"cssClass":"pl-kos"},{"start":8,"end":14,"cssClass":"pl-s1"},{"start":14,"end":15,"cssClass":"pl-kos"},{"start":15,"end":19,"cssClass":"pl-c1"},{"start":19,"end":20,"cssClass":"pl-kos"},{"start":20,"end":26,"cssClass":"pl-c1"},{"start":27,"end":28,"cssClass":"pl-c1"},{"start":29,"end":30,"cssClass":"pl-c1"},{"start":31,"end":33,"cssClass":"pl-c1"},{"start":34,"end":40,"cssClass":"pl-s1"},{"start":40,"end":41,"cssClass":"pl-kos"},{"start":41,"end":45,"cssClass":"pl-c1"},{"start":45,"end":46,"cssClass":"pl-kos"},{"start":46,"end":47,"cssClass":"pl-c1"},{"start":47,"end":48,"cssClass":"pl-kos"},{"start":48,"end":49,"cssClass":"pl-kos"},{"start":49,"end":55,"cssClass":"pl-en"},{"start":55,"end":56,"cssClass":"pl-kos"},{"start":56,"end":57,"cssClass":"pl-c1"},{"start":57,"end":58,"cssClass":"pl-c1"},{"start":58,"end":59,"cssClass":"pl-kos"},{"start":60,"end":63,"cssClass":"pl-c1"},{"start":64,"end":70,"cssClass":"pl-s"},{"start":70,"end":71,"cssClass":"pl-kos"},{"start":72,"end":73,"cssClass":"pl-kos"}],[{"start":8,"end":12,"cssClass":"pl-s1"},{"start":13,"end":14,"cssClass":"pl-c1"},{"start":15,"end":21,"cssClass":"pl-s1"},{"start":21,"end":22,"cssClass":"pl-kos"},{"start":22,"end":26,"cssClass":"pl-c1"},{"start":26,"end":27,"cssClass":"pl-kos"},{"start":27,"end":28,"cssClass":"pl-c1"},{"start":28,"end":29,"cssClass":"pl-kos"},{"start":29,"end":30,"cssClass":"pl-kos"},{"start":30,"end":35,"cssClass":"pl-en"},{"start":35,"end":36,"cssClass":"pl-kos"},{"start":36,"end":39,"cssClass":"pl-s"},{"start":39,"end":40,"cssClass":"pl-kos"},{"start":40,"end":41,"cssClass":"pl-kos"}],[{"start":8,"end":12,"cssClass":"pl-s1"},{"start":12,"end":13,"cssClass":"pl-kos"},{"start":13,"end":22,"cssClass":"pl-c1"},{"start":23,"end":24,"cssClass":"pl-c1"},{"start":25,"end":29,"cssClass":"pl-s1"},{"start":29,"end":30,"cssClass":"pl-kos"},{"start":30,"end":36,"cssClass":"pl-c1"},{"start":37,"end":40,"cssClass":"pl-c1"},{"start":41,"end":42,"cssClass":"pl-c1"},{"start":45,"end":46,"cssClass":"pl-kos"},{"start":47,"end":52,"cssClass":"pl-c1"},{"start":54,"end":58,"cssClass":"pl-s1"},{"start":58,"end":59,"cssClass":"pl-kos"},{"start":59,"end":60,"cssClass":"pl-c1"},{"start":60,"end":61,"cssClass":"pl-kos"},{"start":61,"end":62,"cssClass":"pl-kos"},{"start":63,"end":69,"cssClass":"pl-c1"},{"start":71,"end":75,"cssClass":"pl-s1"},{"start":75,"end":76,"cssClass":"pl-kos"},{"start":76,"end":77,"cssClass":"pl-c1"},{"start":77,"end":78,"cssClass":"pl-kos"},{"start":78,"end":79,"cssClass":"pl-kos"},{"start":80,"end":86,"cssClass":"pl-c1"},{"start":88,"end":93,"cssClass":"pl-s"},{"start":94,"end":95,"cssClass":"pl-kos"}],[{"start":45,"end":46,"cssClass":"pl-kos"},{"start":47,"end":53,"cssClass":"pl-c1"},{"start":55,"end":61,"cssClass":"pl-s1"},{"start":61,"end":62,"cssClass":"pl-kos"},{"start":62,"end":66,"cssClass":"pl-c1"},{"start":66,"end":67,"cssClass":"pl-kos"},{"start":67,"end":68,"cssClass":"pl-c1"},{"start":68,"end":69,"cssClass":"pl-kos"},{"start":69,"end":70,"cssClass":"pl-kos"},{"start":71,"end":82,"cssClass":"pl-c1"},{"start":84,"end":94,"cssClass":"pl-s"},{"start":94,"end":95,"cssClass":"pl-kos"},{"start":96,"end":102,"cssClass":"pl-c1"},{"start":104,"end":109,"cssClass":"pl-s"},{"start":110,"end":111,"cssClass":"pl-kos"},{"start":111,"end":112,"cssClass":"pl-kos"}],[{"start":4,"end":5,"cssClass":"pl-kos"},{"start":6,"end":10,"cssClass":"pl-k"},{"start":11,"end":13,"cssClass":"pl-k"},{"start":14,"end":15,"cssClass":"pl-kos"},{"start":15,"end":21,"cssClass":"pl-s1"},{"start":21,"end":22,"cssClass":"pl-kos"},{"start":22,"end":26,"cssClass":"pl-c1"},{"start":26,"end":27,"cssClass":"pl-kos"},{"start":27,"end":33,"cssClass":"pl-c1"},{"start":34,"end":35,"cssClass":"pl-c1"},{"start":36,"end":37,"cssClass":"pl-c1"},{"start":38,"end":40,"cssClass":"pl-c1"},{"start":41,"end":47,"cssClass":"pl-s1"},{"start":47,"end":48,"cssClass":"pl-kos"},{"start":48,"end":52,"cssClass":"pl-c1"},{"start":52,"end":53,"cssClass":"pl-kos"},{"start":53,"end":54,"cssClass":"pl-c1"},{"start":54,"end":55,"cssClass":"pl-kos"},{"start":55,"end":56,"cssClass":"pl-kos"},{"start":56,"end":62,"cssClass":"pl-en"},{"start":62,"end":63,"cssClass":"pl-kos"},{"start":63,"end":64,"cssClass":"pl-c1"},{"start":64,"end":65,"cssClass":"pl-c1"},{"start":65,"end":66,"cssClass":"pl-kos"},{"start":67,"end":70,"cssClass":"pl-c1"},{"start":71,"end":75,"cssClass":"pl-s"},{"start":75,"end":76,"cssClass":"pl-kos"},{"start":77,"end":78,"cssClass":"pl-kos"}],[{"start":8,"end":12,"cssClass":"pl-s1"},{"start":13,"end":14,"cssClass":"pl-c1"},{"start":15,"end":21,"cssClass":"pl-s1"},{"start":21,"end":22,"cssClass":"pl-kos"},{"start":22,"end":26,"cssClass":"pl-c1"},{"start":26,"end":27,"cssClass":"pl-kos"},{"start":27,"end":28,"cssClass":"pl-c1"},{"start":28,"end":29,"cssClass":"pl-kos"},{"start":29,"end":30,"cssClass":"pl-kos"},{"start":30,"end":35,"cssClass":"pl-en"},{"start":35,"end":36,"cssClass":"pl-kos"},{"start":36,"end":39,"cssClass":"pl-s"},{"start":39,"end":40,"cssClass":"pl-kos"},{"start":40,"end":41,"cssClass":"pl-kos"}],[{"start":8,"end":10,"cssClass":"pl-k"},{"start":11,"end":12,"cssClass":"pl-kos"},{"start":12,"end":16,"cssClass":"pl-s1"},{"start":16,"end":17,"cssClass":"pl-kos"},{"start":17,"end":23,"cssClass":"pl-c1"},{"start":24,"end":27,"cssClass":"pl-c1"},{"start":28,"end":29,"cssClass":"pl-c1"},{"start":29,"end":30,"cssClass":"pl-kos"},{"start":31,"end":32,"cssClass":"pl-kos"}],[{"start":12,"end":21,"cssClass":"pl-s1"},{"start":22,"end":23,"cssClass":"pl-c1"},{"start":24,"end":32,"cssClass":"pl-en"},{"start":32,"end":33,"cssClass":"pl-kos"},{"start":33,"end":37,"cssClass":"pl-s1"},{"start":37,"end":38,"cssClass":"pl-kos"},{"start":38,"end":39,"cssClass":"pl-c1"},{"start":39,"end":40,"cssClass":"pl-kos"},{"start":40,"end":41,"cssClass":"pl-kos"},{"start":42,"end":44,"cssClass":"pl-c1"},{"start":44,"end":45,"cssClass":"pl-kos"},{"start":45,"end":46,"cssClass":"pl-kos"}],[{"start":12,"end":22,"cssClass":"pl-s1"},{"start":23,"end":24,"cssClass":"pl-c1"},{"start":25,"end":33,"cssClass":"pl-en"},{"start":33,"end":34,"cssClass":"pl-kos"},{"start":34,"end":38,"cssClass":"pl-s1"},{"start":38,"end":39,"cssClass":"pl-kos"},{"start":39,"end":40,"cssClass":"pl-c1"},{"start":40,"end":41,"cssClass":"pl-kos"},{"start":41,"end":42,"cssClass":"pl-kos"},{"start":43,"end":45,"cssClass":"pl-c1"},{"start":45,"end":46,"cssClass":"pl-kos"},{"start":46,"end":47,"cssClass":"pl-kos"}],[{"start":12,"end":16,"cssClass":"pl-s1"},{"start":16,"end":17,"cssClass":"pl-kos"},{"start":17,"end":29,"cssClass":"pl-c1"},{"start":30,"end":31,"cssClass":"pl-c1"},{"start":32,"end":33,"cssClass":"pl-kos"},{"start":34,"end":39,"cssClass":"pl-c1"},{"start":41,"end":50,"cssClass":"pl-s1"},{"start":50,"end":51,"cssClass":"pl-kos"},{"start":52,"end":58,"cssClass":"pl-c1"},{"start":60,"end":70,"cssClass":"pl-s1"},{"start":71,"end":72,"cssClass":"pl-kos"},{"start":72,"end":73,"cssClass":"pl-kos"}],[{"start":12,"end":16,"cssClass":"pl-s1"},{"start":16,"end":17,"cssClass":"pl-kos"},{"start":17,"end":25,"cssClass":"pl-c1"},{"start":26,"end":27,"cssClass":"pl-c1"},{"start":28,"end":29,"cssClass":"pl-kos"},{"start":30,"end":33,"cssClass":"pl-c1"},{"start":35,"end":36,"cssClass":"pl-c1"},{"start":36,"end":37,"cssClass":"pl-kos"},{"start":38,"end":42,"cssClass":"pl-c1"},{"start":44,"end":45,"cssClass":"pl-c1"},{"start":45,"end":46,"cssClass":"pl-kos"},{"start":47,"end":52,"cssClass":"pl-c1"},{"start":54,"end":63,"cssClass":"pl-s1"},{"start":63,"end":64,"cssClass":"pl-kos"},{"start":65,"end":71,"cssClass":"pl-c1"},{"start":73,"end":83,"cssClass":"pl-s1"},{"start":84,"end":85,"cssClass":"pl-kos"},{"start":85,"end":86,"cssClass":"pl-kos"}],[{"start":8,"end":9,"cssClass":"pl-kos"},{"start":10,"end":14,"cssClass":"pl-k"},{"start":15,"end":16,"cssClass":"pl-kos"}],[{"start":12,"end":19,"cssClass":"pl-smi"},{"start":19,"end":20,"cssClass":"pl-kos"},{"start":20,"end":23,"cssClass":"pl-en"},{"start":23,"end":24,"cssClass":"pl-kos"},{"start":24,"end":31,"cssClass":"pl-s"},{"start":31,"end":32,"cssClass":"pl-kos"},{"start":33,"end":39,"cssClass":"pl-s1"},{"start":39,"end":40,"cssClass":"pl-kos"},{"start":40,"end":44,"cssClass":"pl-c1"},{"start":44,"end":45,"cssClass":"pl-kos"},{"start":45,"end":46,"cssClass":"pl-c1"},{"start":46,"end":47,"cssClass":"pl-kos"},{"start":47,"end":48,"cssClass":"pl-kos"},{"start":48,"end":49,"cssClass":"pl-kos"}],[{"start":12,"end":21,"cssClass":"pl-s1"},{"start":22,"end":23,"cssClass":"pl-c1"},{"start":24,"end":32,"cssClass":"pl-en"},{"start":32,"end":33,"cssClass":"pl-kos"},{"start":33,"end":39,"cssClass":"pl-s1"},{"start":39,"end":40,"cssClass":"pl-kos"},{"start":40,"end":44,"cssClass":"pl-c1"},{"start":44,"end":45,"cssClass":"pl-kos"},{"start":45,"end":46,"cssClass":"pl-c1"},{"start":46,"end":47,"cssClass":"pl-kos"},{"start":47,"end":48,"cssClass":"pl-kos"},{"start":49,"end":51,"cssClass":"pl-c1"},{"start":51,"end":52,"cssClass":"pl-kos"},{"start":52,"end":53,"cssClass":"pl-kos"}],[{"start":12,"end":22,"cssClass":"pl-s1"},{"start":23,"end":24,"cssClass":"pl-c1"},{"start":25,"end":33,"cssClass":"pl-en"},{"start":33,"end":34,"cssClass":"pl-kos"},{"start":34,"end":43,"cssClass":"pl-s1"},{"start":44,"end":45,"cssClass":"pl-c1"},{"start":46,"end":47,"cssClass":"pl-c1"},{"start":47,"end":48,"cssClass":"pl-c1"},{"start":48,"end":49,"cssClass":"pl-c1"},{"start":49,"end":50,"cssClass":"pl-kos"},{"start":51,"end":53,"cssClass":"pl-c1"},{"start":53,"end":54,"cssClass":"pl-kos"},{"start":54,"end":55,"cssClass":"pl-kos"},{"start":56,"end":92,"cssClass":"pl-c"}],[{"start":12,"end":19,"cssClass":"pl-smi"},{"start":19,"end":20,"cssClass":"pl-kos"},{"start":20,"end":23,"cssClass":"pl-en"},{"start":24,"end":25,"cssClass":"pl-kos"},{"start":25,"end":38,"cssClass":"pl-s"},{"start":38,"end":39,"cssClass":"pl-kos"},{"start":39,"end":49,"cssClass":"pl-s1"},{"start":49,"end":50,"cssClass":"pl-kos"},{"start":50,"end":51,"cssClass":"pl-kos"}],[{"start":12,"end":16,"cssClass":"pl-s1"},{"start":16,"end":17,"cssClass":"pl-kos"},{"start":17,"end":29,"cssClass":"pl-c1"},{"start":30,"end":31,"cssClass":"pl-c1"},{"start":32,"end":33,"cssClass":"pl-kos"},{"start":34,"end":39,"cssClass":"pl-c1"},{"start":41,"end":50,"cssClass":"pl-s1"},{"start":50,"end":51,"cssClass":"pl-kos"},{"start":52,"end":58,"cssClass":"pl-c1"},{"start":60,"end":70,"cssClass":"pl-s1"},{"start":71,"end":72,"cssClass":"pl-kos"},{"start":72,"end":73,"cssClass":"pl-kos"}],[{"start":8,"end":9,"cssClass":"pl-kos"}],[{"start":4,"end":5,"cssClass":"pl-kos"}],[{"start":4,"end":6,"cssClass":"pl-k"},{"start":7,"end":8,"cssClass":"pl-kos"},{"start":8,"end":14,"cssClass":"pl-s1"},{"start":14,"end":15,"cssClass":"pl-kos"},{"start":15,"end":19,"cssClass":"pl-c1"},{"start":19,"end":20,"cssClass":"pl-kos"},{"start":20,"end":26,"cssClass":"pl-c1"},{"start":27,"end":28,"cssClass":"pl-c1"},{"start":29,"end":30,"cssClass":"pl-c1"},{"start":30,"end":31,"cssClass":"pl-kos"},{"start":32,"end":33,"cssClass":"pl-kos"}],[{"start":8,"end":12,"cssClass":"pl-s1"},{"start":12,"end":13,"cssClass":"pl-kos"},{"start":13,"end":23,"cssClass":"pl-c1"},{"start":24,"end":25,"cssClass":"pl-c1"},{"start":26,"end":32,"cssClass":"pl-s1"},{"start":32,"end":33,"cssClass":"pl-kos"},{"start":33,"end":37,"cssClass":"pl-c1"},{"start":37,"end":38,"cssClass":"pl-kos"},{"start":38,"end":39,"cssClass":"pl-c1"},{"start":39,"end":40,"cssClass":"pl-kos"},{"start":40,"end":41,"cssClass":"pl-kos"}],[{"start":4,"end":5,"cssClass":"pl-kos"}],[{"start":4,"end":8,"cssClass":"pl-s1"},{"start":8,"end":9,"cssClass":"pl-kos"},{"start":9,"end":13,"cssClass":"pl-en"},{"start":13,"end":14,"cssClass":"pl-kos"},{"start":14,"end":21,"cssClass":"pl-s1"},{"start":21,"end":22,"cssClass":"pl-kos"},{"start":23,"end":31,"cssClass":"pl-k"},{"start":32,"end":33,"cssClass":"pl-kos"},{"start":33,"end":39,"cssClass":"pl-s1"},{"start":39,"end":40,"cssClass":"pl-kos"},{"start":41,"end":42,"cssClass":"pl-kos"}],[{"start":8,"end":10,"cssClass":"pl-k"},{"start":11,"end":12,"cssClass":"pl-kos"},{"start":12,"end":18,"cssClass":"pl-s1"},{"start":19,"end":22,"cssClass":"pl-c1"},{"start":23,"end":32,"cssClass":"pl-s"},{"start":32,"end":33,"cssClass":"pl-kos"},{"start":34,"end":35,"cssClass":"pl-kos"}],[{"start":12,"end":19,"cssClass":"pl-smi"},{"start":19,"end":20,"cssClass":"pl-kos"},{"start":20,"end":23,"cssClass":"pl-en"},{"start":23,"end":24,"cssClass":"pl-kos"},{"start":24,"end":53,"cssClass":"pl-s"},{"start":53,"end":54,"cssClass":"pl-kos"},{"start":54,"end":55,"cssClass":"pl-kos"}],[{"start":12,"end":19,"cssClass":"pl-s1"},{"start":19,"end":20,"cssClass":"pl-kos"},{"start":20,"end":24,"cssClass":"pl-en"},{"start":24,"end":25,"cssClass":"pl-kos"},{"start":25,"end":26,"cssClass":"pl-c1"},{"start":26,"end":27,"cssClass":"pl-kos"},{"start":27,"end":28,"cssClass":"pl-kos"}],[{"start":8,"end":9,"cssClass":"pl-kos"},{"start":10,"end":14,"cssClass":"pl-k"},{"start":15,"end":16,"cssClass":"pl-kos"}],[{"start":12,"end":18,"cssClass":"pl-smi"},{"start":18,"end":19,"cssClass":"pl-kos"},{"start":19,"end":29,"cssClass":"pl-en"},{"start":29,"end":30,"cssClass":"pl-kos"},{"start":30,"end":38,"cssClass":"pl-k"},{"start":39,"end":40,"cssClass":"pl-kos"},{"start":40,"end":41,"cssClass":"pl-kos"},{"start":42,"end":43,"cssClass":"pl-kos"}],[{"start":16,"end":20,"cssClass":"pl-s1"},{"start":20,"end":21,"cssClass":"pl-kos"},{"start":21,"end":27,"cssClass":"pl-en"},{"start":27,"end":28,"cssClass":"pl-kos"},{"start":28,"end":34,"cssClass":"pl-s1"},{"start":34,"end":35,"cssClass":"pl-kos"},{"start":35,"end":36,"cssClass":"pl-kos"}],[{"start":16,"end":23,"cssClass":"pl-s1"},{"start":23,"end":24,"cssClass":"pl-kos"},{"start":24,"end":28,"cssClass":"pl-en"},{"start":28,"end":29,"cssClass":"pl-kos"},{"start":29,"end":30,"cssClass":"pl-kos"},{"start":30,"end":31,"cssClass":"pl-kos"}],[{"start":12,"end":13,"cssClass":"pl-kos"},{"start":13,"end":14,"cssClass":"pl-kos"},{"start":15,"end":18,"cssClass":"pl-c1"},{"start":18,"end":19,"cssClass":"pl-kos"},{"start":19,"end":20,"cssClass":"pl-kos"}],[{"start":8,"end":9,"cssClass":"pl-kos"}],[{"start":4,"end":5,"cssClass":"pl-kos"},{"start":5,"end":6,"cssClass":"pl-kos"},{"start":6,"end":7,"cssClass":"pl-kos"}],[{"start":0,"end":1,"cssClass":"pl-kos"}]],"csv":null,"csvError":null,"dependabotInfo":{"showConfigurationBanner":false,"configFilePath":null,"networkDependabotPath":"/ariya/phantomjs/network/updates","dismissConfigurationNoticePath":"/settings/dismiss-notice/dependabot_configuration_notice","configurationNoticeDismissed":null,"repoAlertsPath":"/ariya/phantomjs/security/dependabot","repoSecurityAndAnalysisPath":"/ariya/phantomjs/settings/security_analysis","repoOwnerIsOrg":false,"currentUserCanAdminRepo":false},"displayName":"rasterize.js","displayUrl":"https://github.com/ariya/phantomjs/blob/master/examples/rasterize.js?raw=true","headerInfo":{"blobSize":"2.17 KB","deleteInfo":{"deleteTooltip":"You must be signed in to make or propose changes"},"editInfo":{"editTooltip":"You must be signed in to make or propose changes"},"ghDesktopPath":"https://desktop.github.com","gitLfsPath":null,"onBranch":true,"shortPath":"66e5050","siteNavLoginPath":"/login?return_to=https%3A%2F%2Fgithub.com%2Fariya%2Fphantomjs%2Fblob%2Fmaster%2Fexamples%2Frasterize.js","isCSV":false,"isRichtext":false,"toc":null,"lineInfo":{"truncatedLoc":"49","truncatedSloc":"48"},"mode":"file"},"image":false,"isCodeownersFile":null,"isPlain":false,"isValidLegacyIssueTemplate":false,"issueTemplateHelpUrl":"https://docs.github.com/articles/about-issue-and-pull-request-templates","issueTemplate":null,"discussionTemplate":null,"language":"JavaScript","languageID":183,"large":false,"loggedIn":false,"newDiscussionPath":"/ariya/phantomjs/discussions/new","newIssuePath":"/ariya/phantomjs/issues/new","planSupportInfo":{"repoIsFork":null,"repoOwnedByCurrentUser":null,"requestFullPath":"/ariya/phantomjs/blob/master/examples/rasterize.js","showFreeOrgGatedFeatureMessage":null,"showPlanSupportBanner":null,"upgradeDataAttributes":null,"upgradePath":null},"publishBannersInfo":{"dismissActionNoticePath":"/settings/dismiss-notice/publish_action_from_dockerfile","dismissStackNoticePath":"/settings/dismiss-notice/publish_stack_from_file","releasePath":"/ariya/phantomjs/releases/new?marketplace=true","showPublishActionBanner":false,"showPublishStackBanner":false},"rawBlobUrl":"https://github.com/ariya/phantomjs/raw/master/examples/rasterize.js","renderImageOrRaw":false,"richText":null,"renderedFileInfo":null,"shortPath":null,"tabSize":8,"topBannersInfo":{"overridingGlobalFundingFile":false,"globalPreferredFundingPath":null,"repoOwner":"ariya","repoName":"phantomjs","showInvalidCitationWarning":false,"citationHelpUrl":"https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-on-github/about-citation-files","showDependabotConfigurationBanner":false,"actionsOnboardingTip":null},"truncated":false,"viewable":true,"workflowRedirectUrl":null,"symbols":{"timedOut":false,"notAnalyzed":false,"symbols":[]}},"copilotInfo":null,"copilotAccessAllowed":false,"csrf_tokens":{"/ariya/phantomjs/branches":{"post":"97YWcTUk9Tf0PyPYX4Ycpj1JhKp3pfbbM1hjv5uV8R44r9BlAxP5BABQtSs-06FWc2Q5atbnaWeQQVY8ZtI-PA"},"/repos/preferences":{"post":"GMVYtacEZwXhiaidTxywVaE5NqISTKXq_NJ_KrW1w1siIlKtFy8c7erTJnt6yMzznqFe-0p14GN_EdBrn_boLw"}}},"title":"phantomjs/examples/rasterize.js at master · ariya/phantomjs"}