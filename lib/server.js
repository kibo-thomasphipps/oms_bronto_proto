
const util = require('./util');
const {TemplateManager}  = require('./TemplateManager');
const express = require('express')
const path = require('path');
const port = process.env.PORT ||3000;
const bodyParser = require('body-parser');
const { RenderContext } = require('./teamplate');
const { Emailer } = require('./smtp');
const app = express()
const templatePath = process.env.TEMPLATE_PATH || path.resolve('./templates');
const emailer = new Emailer({});//todo pass config
const templateManager = new TemplateManager({templatePath:templatePath});

class RenderError extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode  = statusCode;
    }
}

async function render( req){
    if ( !req.body?.deliveries[0]){
        throw new RenderError( 'missing deliveries', 409);
    }

    const template = await templateManager.get(req.body?.deliveries[0]?.messageId);
    
    if(!template){
        throw new RenderError( 'template not found', 404);        
    }

    let fields = util.flattenFields(req.body?.deliveries[0].fields)
    let rc = new RenderContext({values:fields});
    return template.render(rc);
}
// parse application/json
app.use(bodyParser.json())
app.post('/render', async function (req, res, next) {
    try{
        let content = await render(req);
        res.contentType = 'text/html';
        return res.end(content);
    }
    catch(e){
        return res.status(e.statusCode || 501)
            .end(e.message);
    }    
})
app.post('/send', async function (req, res, next) {
    let content = '';
    try{
        content = await render(req);  
    }
    catch(e){
        return res.status(e.statusCode || 501)
            .json({ err:e.message, stack:e.stack });    
    } 
    try{
        let info  = await emailer.send({ 
            fromName: req.body?.deliveries[0].fromName, 
            fromAddress:req.body?.deliveries[0].fromEmail, 
            recievers:  req.body?.deliveries[0].recievers ?? 'todo@test.com', 
            replyTo: req.body?.deliveries[0].replyEmail, 
            subject: req.body?.deliveries[0].subject ?? 'test email ', 
            html:content} );
        return res.status(200)
            .json(info);
             
    }
    catch(e){
        return res.status(e.statusCode || 501)
            .json({ err:e.message, stack:e.stack });
    } 
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})