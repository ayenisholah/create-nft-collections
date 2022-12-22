import { CIDString, Web3Storage } from "web3.storage";

const token = process.env.REACT_APP_WEB3_STORAGE_API_KEY as string;

const storage = new Web3Storage({ token });

interface IFiles {
  name: string;
  cid: string;
}

export async function store(files: any): Promise<CIDString | undefined> {
  try {
    const cid = await storage.put(files);
    console.log("Content added with CID:", cid);

    return cid;
  } catch (error) {
    console.log(error);
  }
}

export async function retrieve(cid: string): Promise<IFiles[] | undefined> {
  try {
    let res = await getLinks(cid) as any[];
    res = res.map(({ Name, Hash }: { Name: string; Hash: string; }) => {
      return { name: Name, cid: Hash };
    });
    return res;
  } catch (error) {
    console.log(error);
  }
}



async function getLinks(ipfsPath: string): Promise<any[] | undefined> {
  try {
    let res: any = await fetch(`https://dweb.link/api/v0/ls?arg=${ipfsPath}`);
    res = await res.json();

    return res.Objects[0].Links;
  } catch (error) {
    console.log(error);
  }
}
