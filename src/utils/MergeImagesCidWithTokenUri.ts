export default function mergeImagesCidWithTokenUri(metadata: any[], files: any[]) {
  const res = files.map((item1) => ({
    ...item1,
    ...metadata.find((item2) => item2.image === item1.name),
  }));

  const merged = res.map((item, index) => ({
    ...item,
    name: `#${index + 1}`,
    image: `ipfs://${item.cid}`,
    external_url: `https://ipfs.io/ipfs/${item.cid}`,
  }));
  return merged
}

// export default function mergeImagesCidWithTokenUri(metadata: any[], files: any[]) {
//   console.log({ metadata, files });
//   return metadata.map((item, i) => {
//     if (item.image === files[i].name) {
//       let merge = {
//         ...item,
//         image: `ipfs://${files[i].cid}`,
//         external_url: `https://ipfs.io/ipfs/${files[i].cid}`,
//       };

//       return merge;
//     }
//   });
// }



// function mergeTokenUri(files, metadata) {
//   const merged = [
//     ...files
//       .concat(metadata)
//       .reduce(
//         (m, o) => m.set(o.member, Object.assign(m.get(o.member) || {}, o)),
//         new Map()
//       )
//       .values(),
//   ];
// }


// function merge(files: any[], metadata: any[]) {

//   const res = files.map((item1) => ({
//     ...item1,
//     ...metadata.find((item2) => item2.image === item1.name),
//   }));
//   const merged = res.map((item) => ({
//     ...item,
//     image: `ipfs://${item.cid}`,
//     external_url: `https://ipfs.io/ipfs/${item.cid}`,
//   }));

//   return merged
// }

