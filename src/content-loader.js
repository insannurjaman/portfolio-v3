export async function loadPortfolioContent({fetchImpl=fetch,signal}={}){
  const response=await fetchImpl('/data/content.json',{signal});
  if(!response.ok)throw new Error('Content request failed');
  const content=await response.json();
  if(!content||!content.pages||typeof content.pages!=='object'||Array.isArray(content.pages))throw new Error('Portfolio content is unavailable');
  return content;
}
