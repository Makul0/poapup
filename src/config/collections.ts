export const poapCollections = [
    {
      name: "Solana Ecosystem Calls",
      description: "Superteam Ecosystem Collectables - These collectibles help track attendance to the Superteam ecosystem call.",
      mintAuthority: "5b4ZfyhVEuHEiUWzoWPrQqvhWD3WLyktPpQm2xs2CnyJ",
      isOfficial: true,
    },
    {
      name: "dVIN Labs",
      description: "Collections of Digital Cork NFTs, each the digital twin for a bottle of wine.",
      mintAuthority: "pkVjxuNte1SqdwjvP28pbcgUcmLAWay9PiuLDCKMjyb",
      isOfficial: true,
    },
    {
      name: "Dilli Hackerhouse",
      description: "Solana Foundation x Jump Hacker House, New Delhi souvenir.",
      mintAuthority: "59UiKc91dGyHy2n5N6CnGHV9SVsujBHCitEQixk5G6GK",
      isOfficial: true,
    },
    {
      name: "$SILLY Dragon in Dubai",
      description: "NFT Night with SuperTeamUAE at Founders Villa.",
      mintAuthority: "BKn45YvZfgQM6AQ3te4maGkFSMTVZibKyCxxqh6AWcUL",
      isOfficial: true,
    },
  ] as const;
  
  export type POAPCollection = typeof poapCollections[number];