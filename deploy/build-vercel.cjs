const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),source=path.join(root,'dist'),output=path.join(root,'vercel-public');
fs.mkdirSync(output,{recursive:true});
for(const item of fs.readdirSync(source,{withFileTypes:true})){
 if(['server','.openai'].includes(item.name))continue;
 fs.cpSync(path.join(source,item.name),path.join(output,item.name),{recursive:true});
}
console.log('Vercel frontend built; Boss runs as a separate Node function.');
