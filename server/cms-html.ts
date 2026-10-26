import type { PublishedDocument } from '../shared/cms';
import { metadata } from '../client/src/data/site';
export function cmsRouteInfo(path:string,documents:PublishedDocument[]) {
 const pathname=path.split(/[?#]/)[0].replace(/\/$/,'')||'/';
 if(pathname.startsWith('/admin'))return {status:200,title:'CMS Onsmart.AI | Administração',description:'Painel administrativo protegido da Onsmart.AI.'};
 const normalized=pathname.replace('/previa/solucao/','/servicos/').replace('/previa/parcerias/programa','/parcerias').replace('/previa/conteudo/','/conteudo/');
 const doc=documents.find(item=>item.locale==='pt-BR'&&(item.key===normalized||normalized===`/conteudo/${item.slug}`&&!['page','landing','banner'].includes(item.kind)));
 if(doc)return {status:200,title:doc.payload.seoTitle||doc.payload.title,description:doc.payload.seoDescription||doc.payload.summary};
 if(metadata[normalized])return {status:200,title:metadata[normalized].title,description:metadata[normalized].description};
 return {status:404,title:'Página não encontrada | Onsmart.AI',description:'Esta página não está disponível no site Onsmart.AI.'};
}
const escape=(value:string)=>value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!));
export function composeCmsHtml(template:string,body:string,documents:PublishedDocument[],info:ReturnType<typeof cmsRouteInfo>) {
 let html=template.replace(/<div\s+id=["']root["']\s*>\s*<\/div>/,`<div id="root">${body}</div>`);
 html=html.replace(/<title>[\s\S]*?<\/title>/,`<title>${escape(info.title)}</title>`);
 for(const [attribute,name,value] of [['name','description',info.description],['property','og:title',info.title],['property','og:description',info.description]]){
  const regex=new RegExp(`<meta\\s+${attribute}=["']${name}["'][^>]*>`,'g');const tag=`<meta ${attribute}="${name}" content="${escape(value)}" />`;html=regex.test(html)?html.replace(regex,tag):html.replace('</head>',tag+'\n</head>');
 }
 html=html.replace('</head>',`<meta name="twitter:title" content="${escape(info.title)}"/><meta name="twitter:description" content="${escape(info.description)}"/>\n</head>`);
 const state=JSON.stringify(documents).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
 html=html.replace('<div id="root">',`<script>window.__CMS_DATA__=${state};</script><div id="root">`);
 return html;
}
