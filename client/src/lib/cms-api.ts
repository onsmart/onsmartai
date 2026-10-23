export class CmsApiError extends Error { constructor(public status:number,message:string){super(message);} }
export async function apiCms<T>(path:string,method='GET',body?:unknown):Promise<T> {
 const headers:Record<string,string>={};
 if(method!=='GET') {headers['Content-Type']='application/json';headers['X-CMS-Request']='1';}
 if(path!=='/public') {try{const value=sessionStorage.getItem('manus-cookie');if(value)headers.Authorization=`Bearer ${value}`;}catch{/* Cookies continuam sendo a sessão principal. */}}
 const response=await fetch(`/api/cms${path}`,{method,credentials:'include',headers,body:body===undefined?undefined:JSON.stringify(body)});
 let result:{data?:T;error?:string};try{result=await response.json();}catch{throw new CmsApiError(response.status,'O servidor não retornou uma resposta válida.');}
 if(!response.ok) throw new CmsApiError(response.status,result.error || 'Não foi possível concluir a operação.');
 return result.data as T;
}
