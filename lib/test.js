const { match } = require('assert');
const fs = require('fs');
const template = fs.readFileSync ('./templates/test1.html').toString();
const req = require('../sampleRequests/req1.json')


function render (template , req , iteration ){
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
        if ( m.groups.loop){
            const loopText = m.groups.loop;
            ret += render( loopText, req, 1);
            ret += render( loopText, req, 2);
        }    
    }
    ret += template.substring(last,template.length);
    return ret;
}
const out = render(template, req);
console.log(out);