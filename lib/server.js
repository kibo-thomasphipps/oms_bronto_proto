
const util = require('./util');
const {TemplateManager}  = require('./TemplateManager');
const express = require('express')
const path = require('path');
const port = process.env.PORT ||3000;
const bodyParser = require('body-parser');
const { RenderContext } = require('./teamplate');
const app = express()
const templatePath = process.env.TEMPLATE_PATH || path.resolve('./templates');

const templateManager = new TemplateManager({templatePath:templatePath});



async function render( req, res){
    const  templatePath = req.body?.deliveries[0]?.messageId;
    
    if ( !req.body?.deliveries[0]){
        res.statusCode =409;
        return res.end('missing deliveries');
    }
    const template = await templateManager.get(templatePath);
    
    if(!template){
        res.statusCode =404;
        return res.end('template not found');
    }

    let fields = util.flattenFields(req.body?.deliveries[0].fields)
    let rc = new RenderContext({values:fields});
}
// parse application/json
app.use(bodyParser.json())
app.post('/render', async function (req, res, next) {
    let content = await render(req, res);
    if ( content?.length){
        res.end(content);
    }
})
app.post('/send', async function (req, res, next) {
    let content = await render(req, res);
    if ( content?.length){
        res.end(content);
    }
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})