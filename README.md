<p align="center">
<img src="./asset/andromeda-logo.png" alt="Andromeda" style="display: block; margin: 0 auto;" />
</p>

<p align="center">
<img src="./asset/subtitle.png" alt="Your key, your book" style="display: block; margin: 0 auto;" />
</p>

------

## About

Andromeda is a web platform that makes it possible:

* For authors to publish any kind of fictional or non-fictional work as an NFT.
* For readers to buy these NFTs and read the authors' works in different formats.

The mission of this platform is to allow authors to directly mint and tokenize their work, and to enable readers to access books simply.
The web platform is open source. To mint their text as an NFT, the author covers the blockchain gas fees and pays a commission for platform maintenance. This commission can be a subscription fee or a percentage of copy sales. This model allows the platform to cover its costs without resorting to sponsorships, ensuring it remains free and independent.
The reader pays the price set by the author.

If and when screen readers become available that can browse the web and log in to a platform using a blockchain wallet, users will be able to buy the book directly from the author and read it on their preferred device. In this way:

* Intermediary costs are reduced, benefiting both the author and the reader.
* The author can mint a limited quantity of copies, certified by the blockchain network, and set the price.
* The reader can buy a certified copy (the NFT) directly from the author, which is the digital equivalent of owning a signed copy.

The philosophy behind Andromeda is to directly connect authors with people who buy an NFT because they want to read the work, not just to speculate. The primary goal is to create a direct author-reader relationship, rather than a marketplace for financial investment in unread artworks (though this is also possible). 

The Andromeda project is committed to using technologies that are sustainable from environmental, economic, and social perspectives.

## Technical documentation

 * [Functional anaysis](https://github.com/nova-collective/andromeda/wiki/Functional-analysis)
 * [Technical analysis](https://github.com/nova-collective/andromeda/wiki/Technical-analysis)



## Tech stack

Andromeda is an application based on [Next.js](https://nextjs.org/docs/app/getting-started/installation) for the web app features and [Hardhat](https://hardhat.org/docs/getting-started) for the blockchain features. Other technologies used are:

* [Node.js](https://nodejs.org/en)
* [Polygon](https://polygon.technology/)

## Getting started

### Prerequisites
The following software should be installed on your machine in order to run this application:

* [Node.js](https://nodejs.org/en) v22.20.0 with pnpm v10.16.1 (consider using [nvm](https://github.com/nvm-sh/nvm) to manage node.js);

### How to run

1. Install the dependencies with `pnpm i`
2. Build the Next.js app with `pnpm build`
3. Start the Next.js app with `pnpm start`
   1. Alternatively you can start the app in dev mode (suggested way if you are a dev of this project): `pnpm dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Deploy
The application is deployed and hosted on [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

## Environments
Each environment is mapped to a branch:

* Production: main branch (protected)
* Preview: develop branch (protected)
* Feature instances: feature branches (not active at the moment)

## CI/CD
[TO DO]

## Testing 
[TO DO]

### linting
It is a good practice to run the linter before to commit: `pnpm run lint`.

## How to contribute
1. clone the repository
2. checkout to develop branch
3. start a feature branch with the following syntax `feature/<feature-branch-name>` (consider using [git-flow next](https://git-flow.sh/))
