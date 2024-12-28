interface EventConfig {
  name: string;
  mintAuthority: string;
  collectionAddr: string;
  month: string;
  year: number;
}

interface CollectionConfig {
  name: string;
  description: string;
  isOfficial: boolean;
  events: EventConfig[];
}

export const initialCollections: CollectionConfig[] = [
  {
    name: "Solana Ecosystem Calls",
    description: "Superteam Ecosystem Collectables - Track attendance at ecosystem calls",
    isOfficial: true,
    events: [
      {
        name: "Solana Ecosystem Call: April 2023",
        mintAuthority: "8zunjtVuspe4GFgbv9A44HLxmeMVHbCM3ZhUfUT6edpg",
        collectionAddr: "FBDU9BiUpnzkorK8mS7swyPBrQGSTFv8ewJ8dYMGw7SY",
        month: "April",
        year: 2023
      },
      {
        name: "Solana Ecosystem Call: June 2023",
        mintAuthority: "78Kn5PMZTbiGC2d8frMK5xNweRFW2NXAQsz7prTgrYjS",
        collectionAddr: "FBDU9BiUpnzkorK8mS7swyPBrQGSTFv8ewJ8dYMGw7SY",
        month: "June",
        year: 2023
      },
      {
        name: "Solana Ecosystem Call: October 2023",
        mintAuthority: "HyEHidZegLHwrjdFu7uSChUqCkiBqhrSEisdbk4jqggh",
        collectionAddr: "9nrrLDZf7vXQbUBajSaNWiEhM4GBtqYbWh5d4SdaZZRK",
        month: "October",
        year: 2023
      }
    ]
  },
  {
    name: "J.U.P Planetary Calls",
    description: "Jupiter Protocol community and ecosystem calls",
    isOfficial: true,
    events: [
      {
        name: "J.U.P Planetary Call #19",
        mintAuthority: "EwknGEnEn2ggnYpfuN7FuaWqZevYU3edLC41VwrvMFxL",
        collectionAddr: "GT8s3zXajUBRxmEjucRWu1RA1QxTsC4ahRh3B3cbruGB",
        month: "August",
        year: 2023
      },
      {
        name: "J.U.P Planetary Call #29",
        mintAuthority: "3xdSwvDQTXZiyyC9F2LFjAhRD1xFfdKrAjnuJVy4nDQR",
        collectionAddr: "GT8s3zXajUBRxmEjucRWu1RA1QxTsC4ahRh3B3cbruGB",
        month: "December",
        year: 2023
      }
    ]
  },
  {
    name: "Hacker Houses 2023",
    description: "India Hacker Houses 2023",
    isOfficial: true,
    events: [
      {
        name: "India Hacker Houses 2023",
        mintAuthority: "J3CQs9xfn5YAPU1pP3YhdMLQcJuRtuFZBfDJSxxuwxof",
        collectionAddr: "",
        month: "August",
        year: 2023
      }
    ]
  },
]