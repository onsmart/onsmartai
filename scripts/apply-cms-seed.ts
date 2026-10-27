import "dotenv/config";
import fs from 'node:fs/promises';
import { seedCms } from '../server/cms/db';
async function main(){
 const pt=JSON.parse(await fs.readFile(new URL('../server/cms-seed-data.json',import.meta.url),'utf8'));
 let locales: unknown[]=[];
 try{locales=JSON.parse(await fs.readFile(new URL('../server/cms-seed-locales.json',import.meta.url),'utf8'));}catch{/* optional */}
 const records=[...pt,...locales];
 const result=await seedCms(records);
 console.log('Importação CMS concluída; novos registros:',result.length,'; registros existentes preservados.');
}
main().then(()=>process.exit(0)).catch(error=>{console.error(error instanceof Error?error.message:'Falha na importação CMS.');process.exit(1);});
