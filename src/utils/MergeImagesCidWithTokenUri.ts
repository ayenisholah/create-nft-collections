export default function mergeImagesCidWithTokenUri(metadata: any[], files: any[]) {
  console.log({ metadata, files });
  return metadata.map((item, i) => {
    if (item.image === files[i].name) {
      let merge = {
        ...item,
        image: `ipfs://${files[i].cid}`,
        external_url: `https://ipfs.io/ipfs/${files[i].cid}`,
      };

      return merge;
    }
  });
}
