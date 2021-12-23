const { match, rejects } = require('assert');
const fs = require('fs');
const template = fs.readFileSync ('./templates/ace_order_ready.html').toString();

const parseString = require('xml2js').parseString;


async function fromSoap ( xml ){
    return new Promise((resolve, reject) =>{
        parseString(xml, (err, res)=>{
            if ( err){
                reject(err);
            }
            let ret = {
                deliveries : [
                    res["soap-env:envelope"]["soap-env:body"][0]["ns1:adddeliveries"][0].deliveries[0]
                ]
            }

            ret.deliveries[0].fields = ret.deliveries[0].fields.map( x=>{
                return {
                    name: x.name[0],
                    content: x.content[0]
                }
            })
            resolve(ret);
        })
    });
}
async function readReq( uri){
    var cnt = fs.readFileSync(uri).toString();

    if ( uri.toLowerCase().indexOf('.xml')>-1){
        let soap =  await fromSoap(cnt)
        return soap
    }
    return JSON.parse(cnt);
}
function countReqItems ( subKey , req ){
    let i=0;
    while (true){
        const key = `${subKey}_${i+1}`;
        const val = req.deliveries[0].fields.find(x=> x.name === key)
        if ( val === undefined){
            break;
        }
        i++
    }
    return i;
}
function countIters ( template, req ){
    
    const regex = /\%\%#(?<var>.*?)_#\%\%/g
    let count =0;
    while ((m = regex.exec(template)) !== null) {
        let key = m.groups.var;
        count= Math.max(count, countReqItems(key,req));
    }
    return count;

}
function render (template , req  ){
    const count = countIters( template, req);
    return templateRender( template, req, count , -1)
}
function templateRender (template , req , totalIters, iteration ){
    const regex = /%%#(?<var>.*?)%%|<!--{dynamic_code}-->.*?<!--{loop}-->(?<loop>.*?)<!--{\/loop}-->.*?<!--{\/dynamic_code}-->/gis;
    let last = 0;
    let ret = '';
    while ((m = regex.exec(template)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        ret += template.substring(last, m.index);
        last = m.index + m[0].length;
        if ( m.groups.var ){
            const key = m.groups.var.replace('#', iteration);
            const val = req.deliveries[0].fields.find(x=> x.name === key)
            ret += val?.content;
        }
        if ( m.groups.loop && iteration === -1){
            const loopText = m.groups.loop;
            for ( let i =1 ; i <= totalIters; i++){
                ret += templateRender( loopText, req, totalIters,  i);
            }
            
        }    
    }
    ret += template.substring(last,template.length);
    return ret;
}

async function test (){
    let req1 = await readReq('./sampleRequests/req1.json');
    let req2 = await readReq('./sampleRequests/soap1.xml')
    
    // let out = render(template, req1);
    // console.log(out);
    
    out = render(template, req2);
    console.log(out);
}
test().then(console.log)
