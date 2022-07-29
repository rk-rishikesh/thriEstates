import React, { useState, useEffect, useRef } from "react";

// components

import Navbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/Footer.js";
import { Steps } from "antd";
import "antd/dist/antd.css";

// Blockchain

import Web3 from "web3";
import { sequence } from "0xsequence";
import { BrandVilla } from "../constants/Constants.js";
import { BrandVillaABI } from "../constants/Constants.js";
import { useIPFS } from "../contexts/IPFS.js";

// Form Utils
const { Step } = Steps;

// Sequence Wallet Init
const network = "mumbai";
sequence.initWallet(network);

export default function Listing() {
  const { IPFSuploading, IPFSerror, IPFSupload } = useIPFS();
  const inputFileProductRef = useRef(null);
  const inputFileNFTRef = useRef(null);
  const inputFileWarrantyRef = useRef(null);

  // States
  const [loading, setLoading] = useState(false);
  const [address, setUserAddress] = useState();
  const [connected, setConnected] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [productQuantity, setProductQuantity] = useState(0);
  const [warrantyImage, setWarrantyImage] = useState(null);
  const [warrantyPeriod, setWarrantyPeriod] = useState(0);
  const [nftImage, setNftImage] = useState(null);
  const [provider, setProvider] = useState(null);

  // Step States
  const [one, setOne] = useState(false);
  const [two, setTwo] = useState(false);
  const [three, setThree] = useState(false);
  const [four, setFour] = useState(false);
  const [five, setFive] = useState(false);
  const [six, setSix] = useState(false);
  const [seven, setSeven] = useState(false);
  const [eight, setEight] = useState(false);
  const [nine, setNine] = useState(false);
  const [ten, setTen] = useState(false);
  const [eleven, setEleven] = useState(false);
  const [twelve, setTwelve] = useState(false);

  const [productURI, setProductURI] = useState("");
  const [warrantyURI, setWarrantyURI] = useState("");
  const [nftURI, setNFTURI] = useState("");
  const [tx, setTransaction] = useState("");

  const getStep = () => {
    if (twelve) {
      return 12;
    } else if (eleven) {
      return 11;
    } else if (ten) {
      return 10;
    } else if (nine) {
      return 9;
    } else if (eight) {
      return 8;
    } else if (seven) {
      return 7;
    } else if (six) {
      return 6;
    } else if (five) {
      return 5;
    } else if (four) {
      return 4;
    } else if (three) {
      return 3;
    } else if (two) {
      return 2;
    } else if (one) {
      return 1;
    }
    return 0;
  };

  // Sequence Integration

  const connectWallet = async () => {
    const wallet = sequence.getWallet();
    console.log(wallet);
    const connection = await wallet.connect({
      app: "BrandVilla",
      authorize: true,
      // And pass settings if you would like to customize further
      settings: {
        theme: "light",
        bannerUrl:
          "https://www.emotivebrand.com/wp-content/uploads/2016/09/tumblr_o05v3eZmyT1ugn1wu_og_1280-1080x675.png", // 3:1 aspect ratio, 1200x400 works best
        includedPaymentProviders: ["moonpay", "ramp"],
        defaultFundingCurrency: "matic",
        lockFundingCurrencyToDefault: false,
      },
    });
    const walletAddress = await wallet.getAddress();
    const provider = await wallet.getProvider();
    if (connection.connected) {
      setUserAddress(walletAddress);
      setConnected(true);
      setProvider(provider);
    }

    // if (window.ethereum) {
    //   // res[0] for fetching a first wallet
    //   window.ethereum
    //     .request({ method: "eth_requestAccounts" })
    //     .then((res) => accountChangeHandler(res[0]));
    // } else {
    //   alert("install metamask extension!!");
    // }
  };

  // Function for getting handling all events
  // const accountChangeHandler = (account) => {
  //   // Setting an address data
  //   setUserAddress(account);
  //   console.log(account);
  //   setConnected(true);
  // };

  // Functions
  function inputProductImageHandler(e) {
    inputFileProductRef.current.click();
    setProductImage(e.target.files[0]);
    setThree(true);
  }

  function inputNFTImageHandler(e) {
    inputFileNFTRef.current.click();
    setNftImage(e.target.files[0]);
    setSeven(true);
  }

  function inputWarrantyImageHandler(e) {
    inputFileWarrantyRef.current.click();
    setWarrantyImage(e.target.files[0]);
    setSix(true);
  }

  const uploadMetadata = async (name, description, image) => {
    console.log("== Uploading Metadata == ");
    const metadataUrl = await IPFSupload(
      {
        name: name,
        description: description,
      },
      image
    );
    console.log(metadataUrl);

    return metadataUrl;
  };

  const listProduct = async () => {
    setEight(true);
    let productURI = await uploadMetadata(
      productName,
      productDescription,
      productImage
    );
    productURI = "https://ipfs.io/ipfs/" + productURI.slice(7);

    console.log("Product URI : ", productURI);
    setNine(true);
    setProductURI(productURI);

    const warrantyDescription =
      "Warranty Period : " + warrantyPeriod + " Months";
    let warrantyURI = await uploadMetadata(
      productName,
      warrantyDescription,
      warrantyImage
    );
    warrantyURI = "https://ipfs.io/ipfs/" + warrantyURI.slice(7);

    console.log("Warranty URI : ", warrantyURI);
    setTen(true);
    setWarrantyURI(warrantyURI);

    let nftURI = await uploadMetadata(
      productName,
      productDescription,
      nftImage
    );
    nftURI = "https://ipfs.io/ipfs/" + nftURI.slice(7);

    console.log("NFT URI : ", nftURI);
    setEleven(true);
    setNFTURI(nftURI);

    // Contract Integration
    // const { ethereum } = window;

    // if (ethereum) {
    //   console.log("Hello")   
    //   const web3 = new Web3(ethereum);
    //   const brandVilla = new web3.eth.Contract(BrandVillaABI, BrandVilla);
    //   console.log(brandVilla)
    //   console.log("Tasa")
    //   let tx = await brandVilla.methods.listItem(
    //     productURI,
    //     nftURI,
    //     productQuantity,
    //     5,
    //     warrantyURI
    //   ).send({ from: address })
    //     .on("transactionHash", (hash) => {
    //       console.log(hash);
    //       setTwelve(true);
    //       setTransaction("https://mumbai.polygonscan.com/tx/" + hash);
    //     });

    //   console.log("Listing ... pls wait");
    //   await tx.wait();

    //   console.log(`Successful: ${tx.hash}`)
    // }

    const web3 = new Web3(provider);
    const brandVilla = new web3.eth.Contract(BrandVillaABI, BrandVilla);
    console.log("Signer : ", address);
    brandVilla.methods
      .listItem(
        productURI,
        nftURI,
        productQuantity,
        100000000000000,
        warrantyURI
      )
      .send({ from: address })
      .on("transactionHash", (hash) => {
        console.log(hash);
        setTwelve(true);
        setTransaction(hash);
      });

    // Reset Values
    setProductName("");
    setProductDescription("");
    setProductQuantity(0);
    setWarrantyPeriod(0);
    setProductImage(null);
    setNftImage(null);
    setWarrantyImage(null);
  };

  return (
    <>
      <Navbar transparent />
      <main>
        <section className="header relative pt-16 items-center flex h-screen max-h-860-px">
          <div className="container mx-auto items-center flex flex-wrap">
            <div className="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4">
              <div className="pt-32 sm:pt-0">
                <h2 className="font-semibold text-4xl text-blueGray-600">
                  Showcase your products on BrandVilla
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-blueGray-500">
                  It takes only 10 minutes to setup your account and get started
                </p>
                <div className="mt-12">
                  <a
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    onClick={connectWallet}
                  >
                    Start Selling
                  </a>
                </div>
              </div>
            </div>
          </div>

          <img
            className="absolute top-0 b-auto right-0 pt-16 sm:w-6/12 -mt-48 sm:mt-0 w-6/12 max-h-860px"
            src="https://demos.creative-tim.com/vue-notus/img/pattern_vue.723fd347.png"
            alt="..."
          />
        </section>
        {connected ? (
          <>
            <section className="pb-20 bg-blueGray-200 -mt-24">
              <div className="container mx-auto px-4">
                <div className="flex flex-wrap">
                  <div className="flex flex-wrap items-center mt-32">
                    <div className="w-full md:w-5/12 px-4 mr-auto ml-auto">
                      <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-white">
                        <i className="fas fa-user-friends text-xl"></i>
                      </div>
                      <h3 className="text-3xl mb-2 font-semibold leading-normal">
                        How to list your product on BrandVilla
                      </h3>
                      <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-blueGray-600">
                        To showcase your products on BrandVilla, you need to list
                        them from your Seller Central account
                      </p>
                      <p className="text-lg font-light leading-relaxed mt-0 mb-4 text-blueGray-600">
                        Create a new listing by uploading product images and
                        fill in the details
                      </p>
                    </div>

                    <div className="w-full md:w-4/12 px-4 mr-auto ml-auto">
                      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg bg-blueGray-700">
                        <img
                          alt="..."
                          src="https://bettereviews.com/wp-content/uploads/2020/08/Add-a-heading-1024x1024.png"
                          className="w-full align-middle rounded-t-lg"
                        />
                        <blockquote className="relative p-8 mb-4">
                          <svg
                            preserveAspectRatio="none"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 583 95"
                            className="absolute left-0 w-full block h-95-px -top-94-px"
                          >
                            <polygon
                              points="-30,95 583,95 583,65"
                              className="text-blueGray-700 fill-current"
                            ></polygon>
                          </svg>
                          <h4 className="text-xl font-bold text-white">
                            The future of E-Commerce
                          </h4>
                          <p className="text-md font-light mt-2 text-white">
                            Backed by Blockchain and NFTs
                          </p>
                        </blockquote>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="relative py-20">
              <div
                className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20 h-20"
                style={{ transform: "translateZ(0)" }}
              >
                <svg
                  className="absolute bottom-0 overflow-hidden"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  version="1.1"
                  viewBox="0 0 2560 100"
                  x="0"
                  y="0"
                >
                  <polygon
                    className="text-white fill-current"
                    points="2560 0 2560 100 0 100"
                  ></polygon>
                </svg>
              </div>

              <div className="container mx-auto px-4">
                <div className="items-center flex flex-wrap">
                  <div className="w-full md:w-6/12 ml-auto mr-auto px-8">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-8 shadow-lg rounded-lg bg-blueGray-200">
                      <div className="flex-auto p-5 lg:p-10">
                        <h4 className="text-2xl font-semibold">
                          List your product
                        </h4>

                        <p className="leading-relaxed mt-1 mb-4 text-blueGray-500">
                          Input the required details of the product
                        </p>
                        <div className="relative w-full mb-3 mt-8">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="full-name"
                          >
                            Product Name
                          </label>
                          <input
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Product Name"
                            onChange={(e) => {
                              setProductName(e.target.value);
                              setOne(true);
                            }}
                          />
                        </div>

                        <div className="relative w-full mb-3 mt-8">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="full-name"
                          >
                            PRODUCT QUANTITY
                          </label>
                          <input
                            type="number"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Product Quantity"
                            onChange={(e) => {
                              setProductQuantity(e.target.value);
                              setTwo(true);
                            }}
                          />
                        </div>

                        <div className="relative w-full mb-3 mt-8">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="full-name"
                          >
                            Product Image
                          </label>
                          <input
                            ref={inputFileProductRef}
                            type="file"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            onChange={(e) => inputProductImageHandler(e)}
                          />
                        </div>

                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="message"
                          >
                            Product Description
                          </label>
                          <textarea
                            rows="4"
                            cols="80"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                            placeholder="Product Description..."
                            onChange={(e) => {
                              setProductDescription(e.target.value);
                              setFour(true);
                            }}
                          />
                        </div>

                        <div className="relative w-full mb-3 mt-8">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="full-name"
                          >
                            WARRANTY PERIOD IN MONTHS
                          </label>
                          <input
                            type="number"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Product Warranty in Months"
                            onChange={(e) => {
                              setWarrantyPeriod(e.target.value);
                              setFive(true);
                            }}
                          />
                        </div>

                        <div className="relative w-full mb-3 mt-8">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="full-name"
                          >
                            WARRANTY CARD
                          </label>
                          <input
                            ref={inputFileWarrantyRef}
                            type="file"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            onChange={(e) => inputWarrantyImageHandler(e)}
                          />
                        </div>

                        <div className="relative w-full mb-3 mt-8">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="full-name"
                          >
                            NFT VERSION OF PRODUCT
                          </label>

                          <input
                            ref={inputFileNFTRef}
                            type="file"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            onChange={(e) => inputNFTImageHandler(e)}
                          />
                        </div>
                        <div className="text-center mt-6">
                          <button
                            className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={listProduct}
                          >
                            List Product
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <Steps
                        className="standard-margin"
                        direction="vertical"
                        current={getStep()}
                      >
                        <Step
                          title="Product Name"
                          description="Enter Product Name"
                        />
                        <Step
                          title="Product Quantity"
                          description="Enter Product Quantity"
                        />
                        <Step
                          title="Product Image"
                          description="Upload Product Image"
                        />
                        <Step
                          title="Product Description"
                          description="Enter product description"
                        />
                        <Step
                          title="Warranty Period in Months"
                          description="Enter product warranty period in months"
                        />
                        <Step
                          title="Warranty Card"
                          description="Upload product Warranty Card"
                        />
                        <Step
                          title="NFT version of Product"
                          description="Upload NFT version of product"
                        />
                        <Step
                          title="List Product"
                          description="Confirm the details and click on List product"
                        />
                        <Step
                          title="Generating Product URI"
                          description={
                            nine ? (
                              <a href={productURI} clickable target="_blank">
                                Product URI
                              </a>
                            ) : (
                              "Generating ..."
                            )
                          }
                        />
                        <Step
                          title="Generating Warranty Card URI"
                          description={
                            ten ? (
                              <a href={warrantyURI} clickable target="_blank">
                                Warranty Card URI
                              </a>
                            ) : (
                              "Generating ..."
                            )
                          }
                        />
                        <Step
                          title="Generating Product NFT URI"
                          description={
                            eleven ? (
                              <a href={nftURI} clickable target="_blank">
                                NFT URI
                              </a>
                            ) : (
                              "Generating ..."
                            )
                          }
                        />
                        <Step
                          title="Confirm the transaction"
                          description={
                            twelve ? tx : "Waiting for confirmation ..."
                          }
                        />
                      </Steps>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="pb-20 relative block bg-blueGray-800">
              <div
                className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20 h-20"
                style={{ transform: "translateZ(0)" }}
              >
                <svg
                  className="absolute bottom-0 overflow-hidden"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  version="1.1"
                  viewBox="0 0 2560 100"
                  x="0"
                  y="0"
                >
                  <polygon
                    className="text-blueGray-800 fill-current"
                    points="2560 0 2560 100 0 100"
                  ></polygon>
                </svg>
              </div>

              <div className="container mx-auto px-4 lg:pt-24 lg:pb-64">
                <div className="flex flex-wrap text-center justify-center">
                  <div className="w-full lg:w-6/12 px-4">
                    <h2 className="text-4xl font-semibold text-white">
                      Sell your products the GenZ way
                    </h2>
                  </div>
                </div>
                <div className="flex flex-wrap mt-12 justify-center">
                  <div className="w-full lg:w-3/12 px-4 text-center">
                    <div className="text-blueGray-800 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                      <i className="fas fa-medal text-xl"></i>
                    </div>
                    <h6 className="text-xl mt-5 font-semibold text-white">
                      Give your Product a Virtual Existence with NFTs
                    </h6>
                  </div>
                  <div className="w-full lg:w-3/12 px-4 text-center">
                    <div className="text-blueGray-800 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                      <i className="fas fa-poll text-xl"></i>
                    </div>
                    <h5 className="text-xl mt-5 font-semibold text-white">
                      Autogenerated SBT backed invoice
                    </h5>
                  </div>
                  <div className="w-full lg:w-3/12 px-4 text-center">
                    <div className="text-blueGray-800 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                      <i className="fas fa-lightbulb text-xl"></i>
                    </div>
                    <h5 className="text-xl mt-5 font-semibold text-white">
                      Generate NFT backed Warranty Cards
                    </h5>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <></>
        )}
      </main>
      <Footer />
    </>
  );
}
