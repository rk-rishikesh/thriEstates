// import React, { useState, useEffect, useRef } from "react";
// import Navbar from "components/Navbars/AuthNavbar";
// import Footer from "components/Footers/Footer.js";
// import Loading from "assets/img/loading.gif";
// import Web3 from "web3";
// import { sequence } from "0xsequence";
// import { BrandVilla } from "../constants/Constants.js";
// import { BrandVillaABI } from "../constants/Constants.js";
// import { BrandCollection } from "../constants/Constants.js";
// import { BrandCollectionABI } from "../constants/Constants.js";

// const network = "mumbai";
// sequence.initWallet(network);

// export default function Profile() {
//   const [address, setUserAddress] = useState();
//   const [nftNames, setnftName] = useState([]);
//   const [nftImages, setnftImageList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [connected, setConnected] = useState(false);
//   const [openTab, setOpenTab] = React.useState(1);
//   const [imageState, setImageState] = useState();


//   useEffect(async () => {
//     setImageState("https://bafkreifjk2sccz7onwjrmnnaor2cguahdawerubewkk3dhayfjpvt2ruhm.ipfs.nftstorage.link/")
//     await connectWallet();
//   }, []);


//   const connectWallet = async () => {
//     setLoading(true);
//     console.log(loading);
//     console.log("== Connecting Wallet");
//     const wallet = sequence.getWallet();
//     if (wallet.isConnected()) {
//       setConnected(true);
//       const walletAddress = await wallet.getAddress();
//       console.log(walletAddress);
//       setUserAddress(walletAddress);
//       await getUserNFTs();
//     } else {
//       wallet.openWallet();
//       const connection = await wallet.connect({
//         app: "BrandVilla",
//         authorize: true,
//         // And pass settings if you would like to customize further
//         settings: {
//           theme: "light",
//           bannerUrl:
//             "https://www.emotivebrand.com/wp-content/uploads/2016/09/tumblr_o05v3eZmyT1ugn1wu_og_1280-1080x675.png", // 3:1 aspect ratio, 1200x400 works best
//           includedPaymentProviders: ["moonpay", "ramp"],
//           defaultFundingCurrency: "matic",
//           lockFundingCurrencyToDefault: false,
//         },
//       });
//       setConnected(true);
//       const walletAddress = await wallet.getAddress();
//       setUserAddress(walletAddress);
//       console.log(address);
//       await getUserNFTs();
//       console.log(loading);
//     }
//   };

//   const getUserNFTs = async () => {
//     const wallet = sequence.getWallet();
//     const provider = await wallet.getProvider();
//     const walletAddress = await wallet.getAddress();
//     // Contract Integration
//     const web3 = new Web3(provider);
//     const brandCollection = new web3.eth.Contract(
//       BrandCollectionABI,
//       BrandCollection
//     );
//     let nftCount = await brandCollection.methods.tokenID().call();
//     console.log(nftCount);

//     let nftImageList = [];
//     let nftNameList = [];
//     console.log(walletAddress);
//     for (var i = 1; i <= nftCount; i++) {
//       const balance = await brandCollection.methods
//         .balanceOf(walletAddress, i)
//         .call();
//       console.log(balance);
//       if (balance == 0) {
//         var tokenURI = await brandCollection.methods.uri(i).call();
//         console.log(tokenURI);
//         tokenURI = await parseURL(tokenURI);
//         console.log(tokenURI.image);
//         var img = await getProductImage(tokenURI.image);
//         console.log(img);
//         nftImageList.push(img);
//         nftNameList.push(tokenURI.name);
//         console.log(tokenURI.name);
//       }
//     }

//     setnftImageList(nftImageList);
//     setnftName(nftNameList);
//     setLoading(false);
//   };

//   const parseURL = async (url) => {
//     const data = await fetch(url);
//     const json = await data.json();
//     console.log(json);
//     return json;
//   };

//   const getProductImage = async (image) => {
//     return "https://ipfs.io/ipfs/" + image.slice(7);
//   };

//   return (
//     <>
//       <Navbar transparent />
//       <main className="profile-page">
//         <section className="relative block h-500-px">
//           <div
//             className="absolute top-0 w-full h-full bg-center bg-cover"
//           >
//             <span
//               id="blackOverlay"
//               className="w-full h-full absolute opacity-50 bg-black"
//             ></span>
//           </div>
//           <div
//             className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
//             style={{ transform: "translateZ(0)" }}
//           >
//             <svg
//               className="absolute bottom-0 overflow-hidden"
//               xmlns="http://www.w3.org/2000/svg"
//               preserveAspectRatio="none"
//               version="1.1"
//               viewBox="0 0 2560 100"
//               x="0"
//               y="0"
//             >
//               <polygon
//                 className="text-blueGray-200 fill-current"
//                 points="2560 0 2560 100 0 100"
//               ></polygon>
//             </svg>
//           </div>
//         </section>
//         <section className="relative py-16 bg-blueGray-200">
//           <div className="container mx-auto px-4">
//             <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
//               <div className="px-6">
//                 <div className="flex flex-wrap justify-center">
//                   <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
//                     <div className="relative">
//                       <img
//                         alt="..."
//                         src="https://bafkreihl7xn6a764wk747jxbyia2urowcq5q2iwsm7jrzanrtaxo7hfrlm.ipfs.nftstorage.link/"
//                         className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
//                       />
//                     </div>
//                   </div>
                  
//                 </div>
//                 <br/>
//                 <br/>
//                 <br/>
//                 <div className="text-center mt-12">
//                   <h6 className="text-2xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
//                     Hello, {address} !
//                   </h6>
//                 </div>

//                 <section className="pt-20 pb-48">
//                   <div className="container mx-auto px-4">
//                     <div className="flex flex-wrap justify-center text-center mb-24">
//                       <div className="w-full lg:w-8/12 px-4">
//                         <ul
//                           className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
//                           role="tablist"
//                         >
//                           <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
//                             <a
//                               className={
//                                 "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
//                                 (openTab === 1
//                                   ? "text-white bg-lightBlue-600"
//                                   : "text-lightBlue-600 bg-white")
//                               }
//                               onClick={(e) => {
//                                 e.preventDefault();
//                                 setOpenTab(1);
//                               }}
//                               data-toggle="tab"
//                               href="#link1"
//                               role="tablist"
//                             >
                              
//                               Normal
//                             </a>
//                           </li>
//                           <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
//                             <a
//                               className={
//                                 "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
//                                 (openTab === 2
//                                   ? "text-white bg-lightBlue-600"
//                                   : "text-lightBlue-600 bg-white")
//                               }
//                               onClick={(e) => {
//                                 e.preventDefault();
//                                 setOpenTab(2);
//                               }}
//                               data-toggle="tab"
//                               href="#link2"
//                               role="tablist"
//                             >
                              
//                               Angry
//                             </a>
//                           </li>
//                           <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
//                             <a
//                               className={
//                                 "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
//                                 (openTab === 3
//                                   ? "text-white bg-lightBlue-600"
//                                   : "text-lightBlue-600 bg-white")
//                               }
//                               onClick={(e) => {
//                                 e.preventDefault();
//                                 setOpenTab(3);
//                               }}
//                               data-toggle="tab"
//                               href="#link3"
//                               role="tablist"
//                             >
                              
//                               Sad
//                             </a>
//                           </li>
//                         </ul>
//                         <div className="flex flex-wrap">
//                           <div className="w-full">
//                             <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
//                               <div className="px-4 py-5 flex-auto">
//                                 <div className="tab-content tab-space">
//                                   <div
//                                     className={
//                                       openTab === 1 ? "block" : "hidden"
//                                     }
//                                     id="link1"
//                                   >
//                                     <div className="flex flex-wrap justify-center">
//                                       <div className="w-3/12 sm:w-4/12 px-4">
//                                         <img
//                                           src= {imageState}
//                                           alt="..."
//                                           className="rounded align-middle border-none"
//                                         />
//                                       </div>
//                                     </div>
//                                   </div>
//                                   <div
//                                     className={
//                                       openTab === 2 ? "block" : "hidden"
//                                     }
//                                     id="link2"
//                                   >
//                                     <div className="flex flex-wrap justify-center">
//                                       <div className="w-3/12 sm:w-4/12 px-4">
//                                         <img
//                                           src="https://bafkreiffzmyekaliqhbiyo4tnxp2ig3oc4higqau2u3okcr47ruyveus5e.ipfs.nftstorage.link/"
//                                           alt="..."
//                                           className="rounded align-middle border-none"
//                                         />
                                        
//                                       </div>
//                                     </div>
//                                   </div>
//                                   <div
//                                     className={
//                                       openTab === 3 ? "block" : "hidden"
//                                     }
//                                     id="link3"
//                                   >
//                                     <div className="flex flex-wrap justify-center">
//                                       <div className="w-3/12 sm:w-4/12 px-4">
//                                         <img
//                                           src="https://bafkreig55s7bb2gg5jli3yfabjheubcwuwtazijlexp34ksqdyrkdm7kiu.ipfs.nftstorage.link/"
//                                           alt="..."
//                                           className="rounded align-middle border-none"
//                                         />
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex flex-wrap">
//                       <div className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
//                         <div className="px-6">
//                           <img
//                             alt="..."
//                             src="https://bafkreighjbiqskzrlamr4snrgioydmiqkdipadtmszazcailztcu52zraa.ipfs.nftstorage.link/"
//                             className="shadow-lg rounded-full mx-auto max-w-120-px"
//                             onClick={(e) => {
//                               e.preventDefault();
//                               setImageState("https://bafkreiep4gkjqzl6nukkwcwls7z33qtcaer34mew7nll4isca6o5ajrksu.ipfs.nftstorage.link/");
//                             }}
//                           />
                          
//                           <div className="pt-6 text-center">
//                             <h5 className="text-xl font-bold">Nike Shoe</h5>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
//                         <div className="px-6">
//                           <img
//                             alt="..."
//                             src="https://bafkreifkkoh2yl3gnc5s7nojay7phpwikso7sb7kgxhbigrhbh2uhaiy5e.ipfs.nftstorage.link/"
//                             className="shadow-lg rounded-full mx-auto max-w-120-px"
//                             onClick={(e) => {
//                               e.preventDefault();
//                               setImageState("https://bafkreifaqiwifx57bjwllyalzrsg5t4q2edysv5g5zulrvu4q7pxwtbfka.ipfs.nftstorage.link/");
//                             }}
//                           />
//                           <div className="pt-6 text-center">
//                             <h5 className="text-xl font-bold">Nike Cargo Pants</h5>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
//                         <div className="px-6">
//                           <img
//                             alt="..."
//                             src="https://bafkreifcm4v3k5z3oahcydlxamusl3seyxjwjbqhktooanhm42ux7feymi.ipfs.nftstorage.link/"
//                             className="shadow-lg rounded-full mx-auto max-w-120-px"
//                             onClick={(e) => {
//                               e.preventDefault();
//                               setImageState("https://bafkreiasu6lsx273y5isr7ek7w3i5jwpi3pbw3nnqqmtqebtku4mt6emvi.ipfs.nftstorage.link/");
//                             }}
//                           />
//                           <div className="pt-6 text-center">
//                             <h5 className="text-xl font-bold">Addidas Shirt</h5>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
//                         <div className="px-6">
//                           <img
//                             alt="..."
//                             src="https://bafkreie5lwvbjbeys76nfszhfsgxxepautghn2ehi7cmycnc2pmcecbkty.ipfs.nftstorage.link/"
//                             className="shadow-lg rounded-full mx-auto max-w-120-px"
//                             onClick={(e) => {
//                               e.preventDefault();
//                               setImageState("https://bafkreiduxbcpgcdxx5go6ghpu446ucphn3hazqjvbtxbpdlawuxwd2umbq.ipfs.nftstorage.link/");
//                             }}
//                           />
//                           <div className="pt-6 text-center">
//                             <h5 className="text-xl font-bold">RayBan Goggles</h5>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </section>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//       <Footer />
//     </>
//   );
// }
