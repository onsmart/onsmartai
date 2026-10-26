import { renderToString } from 'react-dom/server';
import { Router as WouterRouter } from 'wouter';
import App from './App';
import { CmsProvider } from './components/cms/CmsProvider';
import { LocaleProvider } from './i18n/LocaleProvider';
import { TrpcProvider } from './lib/TrpcProvider';
import type { PublishedDocument } from '@shared/cms';
import { commercialMetadata, commercialPages, landingPath } from './data/commercial';
export const commercialRoutes=commercialPages.map(page=>landingPath(page.slug));
export const getRoutes=()=>[...commercialRoutes];
export function getMetadata(path:string){const info=commercialMetadata(path);if(!info)throw new Error('Metadados ausentes');return info;}
export function render(path:string,documents?:PublishedDocument[]):string {
 if(typeof window!=='undefined')throw new Error('Renderização inicial exclusiva do servidor.');
 return renderToString(<WouterRouter ssrPath={path}><TrpcProvider><LocaleProvider><CmsProvider initialDocuments={documents}><App/></CmsProvider></LocaleProvider></TrpcProvider></WouterRouter>);
}
