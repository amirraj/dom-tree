const puppeteer = require("puppeteer");
const fs = require("fs");

const url = "https://pubmed.ncbi.nlm.nih.gov/?term=karen";

function convert(data){
    var myMap = {}
    data.forEach(el => myMap[el] = myMap[el] != undefined ? myMap[el] + 1 : 1);
    return Object.keys(myMap).map(k => {return {name: k, count: myMap[k]}})
  }

const getListPattern = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForTimeout(5000);

    const classElements = await page.evaluate(
        () => {
            // var allClasses = [];
            // var allElements = document.querySelectorAll('*');

            // for (var i = 0; i < allElements.length; i++) {
            //     var classes = allElements[i].className.toString().split(/\s+/);
            //     for (var j = 0; j < classes.length; j++) {
            //         var cls = classes[j];
            //         if (cls && allClasses.indexOf(cls) === -1)
            //             allClasses.push(cls);
            //     }
            // }

            // return allClasses;
            //console.log(allClasses);
            return [].concat(...[...document.querySelectorAll('*')].map(elt => [...elt.classList]));
        }
    )
   
    fs.writeFileSync("class-names.txt", JSON.stringify(convert(classElements)));

    await browser.close();
};
getListPattern();