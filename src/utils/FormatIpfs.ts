function formatIPFS(url: string): string {
  let ipfsIndex = url.toLowerCase().indexOf("ipfs");
  if (ipfsIndex > -1 && ipfsIndex < 20) {
    const processedLink = /(?:ipfs:[/]{2})([A-Za-z0-9]{20,}[/]?.*)/.exec(url);
    if (processedLink && processedLink[1]) {
      return `https://ipfs.io/ipfs/${processedLink[1]}`;
    }
    return "";
  }
  return url;
}
export default formatIPFS;
