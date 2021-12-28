function flattenFields (fields){
    const values ={};
    fields.forEach( item=>{
        values[item.name] = item.content;
    });
  
    return values;
}
exports.flattenFields = flattenFields;
