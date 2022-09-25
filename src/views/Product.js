/*eslint-disable*/
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/Footer.js";
import Loading from "assets/img/loading.gif";
import Web3 from "web3";

import { RealEstateNFT } from "../constants/Constants.js";
import { RealEstateABI } from "../constants/Constants.js";

import { Document } from "../constants/Constants.js";
import { DocumentABI } from "../constants/Constants.js";

import { Marketplace } from "../constants/Constants.js";
import { MarketplaceABI } from "../constants/Constants.js";

export default function Product() {
  const [products, setEstates] = useState([]);
  const [address, setUserAddress] = useState();
  const [verified, setVerified] = useState();
  const [images, setImages] = useState([]);
  const [productDetail, setEstateDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  const connectWallet = async () => {
    setLoading(true);
    console.log(loading);
    console.log("== Connecting Wallet");

    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      console.log(window.web3);
      await window.ethereum.enable();
      await accountChangeHandler();
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      await accountChangeHandler();
    }
    // Non-dapp browsers...
    else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const accountChangeHandler = async () => {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    // Setting an address data
    setUserAddress(accounts[0]);
    console.log(accounts[0]);
    await getProducts();
    setConnected(true);
    setLoading(false);
  };

  const verifyProperty = async (id) => {
    console.log(id);
    const web3 = window.web3;
    const marketplace = new web3.eth.Contract(MarketplaceABI, Marketplace);
    setLoading(true);
    marketplace.methods
      .verifyEstate(id)
      .send({ from: address })
      .on("transactionHash", (hash) => {
        console.log(hash);
        setLoading(false);
      });
  };

  const getProducts = async () => {
    const web3 = window.web3;
    const realEstateNFT = new web3.eth.Contract(RealEstateABI, RealEstateNFT);
    const marketplace = new web3.eth.Contract(MarketplaceABI, Marketplace);
    const document = new web3.eth.Contract(DocumentABI, Document);

    let estateCount = await realEstateNFT.methods.estateID().call();
    console.log(estateCount);

    let estateList = [];
    let imageList = [];
    let estateDetailList = [];
    let verifiedList = [];

    for (var i = 1; i <= estateCount; i++) {
      const estate = await marketplace.methods.estates(i).call();
      estateList.push(estate);
      console.log(estate.verified)
      verifiedList.push(estate.verified);
      const estateUri = await realEstateNFT.methods.tokenURI(i).call();
      const img = await getProductImage(estateUri);
      imageList.push(img);

      const documentURI = await document.methods.tokenURI(i).call();
      const pd = await parseURL(documentURI);
      const doc = await getDocument(pd.image);
      console.log(doc.toString());
      estateDetailList.push(pd.name);
    }
    setVerified(verifiedList);
    setEstates(estateList);
    setImages(imageList);
    setEstateDetails(estateDetailList);
    // console.log(imageList);
    // console.log(productList);
    // console.log(productDetailList);
    setLoading(false);
  };

  const parseURL = async (url) => {
    const data = await fetch(url);
    const json = await data.json();
    console.log(json);
    return json;
  };

  const getDocument = async (url) => {
    let doc = url.toString();
    console.log(doc);
    return "https://ipfs.io/ipfs/" + doc.slice(7);
  };

  const getProductImage = async (url) => {
    let imageURL = await parseURL(url);
    let image = imageURL.image;
    image = image.toString();
    return "https://ipfs.io/ipfs/" + image.slice(7);
  };

  if (loading) {
    return (
      <section>
        <div className="justify-center text-center flex flex-wrap">
          <div className="w-full md:w-6/12">
            <img alt="..." className="justify-center" src={Loading} />
          </div>
        </div>
      </section>
    );
  } else {
    return (
      <>
        <IndexNavbar fixed />
        <section className="header relative pt-16 items-center flex h-screen max-h-860-px">
          <div className="container mx-auto items-center flex flex-wrap">
            <div className="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4">
              <div className="pt-32 sm:pt-0">
                <h2 className="font-semibold text-4xl text-blueGray-600">
                  Browse exciting properties around you !!
                </h2>
                {connected ? (
                  <>
                    <p className="mt-4 text-lg leading-relaxed text-blueGray-500">
                      Welcome !! Get your dream home now.
                    </p>

                    <div className="mt-12">
                      <a className="get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-orange-500 active:bg-orange-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150">
                        Connected to {address}
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mt-4 text-lg leading-relaxed text-blueGray-500">
                      Connect your wallet to get started
                    </p>

                    <div className="mt-12">
                      <a
                        className="get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-orange-500 active:bg-orange-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                        onClick={() => connectWallet()}
                      >
                        Connect Wallet
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <img
            className="absolute top-0 b-auto right-0 pt-16 sm:w-6/12 -mt-48 sm:mt-0 w-10/12 max-h-860px"
            src="http://cornte.st/assets/img/pattern_angular.png"
            alt="..."
          />
        </section>

        {connected ? (
          <>
            <section className="mt-48 md:mt-40 pb-40 relative bg-blueGray-100">
              <div className="justify-center text-center flex flex-wrap mt-24">
                <div className="w-full md:w-6/12 px-12 md:px-4">
                  <br />
                  <br />
                  <h2 className="font-semibold text-4xl">
                    Get your Dream Property
                  </h2>
                  <p className="text-lg leading-relaxed mt-4 mb-4 text-blueGray-500">
                    The house you looked at today and wanted to think about
                    until tomorrow may be the same house someone looked at
                    yesterday and will buy today.
                  </p>
                </div>
              </div>
            </section>

            {products.length > 0 && (
              <section className="block relative z-1 bg-blueGray-600">
                <div className="container mx-auto">
                  <div className="justify-center flex flex-wrap">
                    <div className="w-full lg:w-12/12 px-4  -mt-24">
                      <div className="flex flex-wrap">
                        {products.map((e, key) => (
                          <div className="w-full lg:w-4/12 px-4">
                            <div
                              className="hover:-mt-4 relative flex flex-div min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg ease-linear transition-all duration-150"
                              key={key}
                            >
                              <div>
                                <Link to={`buy/${key + 1}`}>
                                  <div className="justify-center flex flex-wrap mt-2">
                                    <h1 className="font-semibold text-2xl text-blueGray-600">
                                      {productDetail[key]}
                                    </h1>
                                  </div>

                                  <img
                                    alt="..."
                                    className="align-middle border-none max-w-full h-auto rounded-lg"
                                    src={images[key]}
                                  />
                                </Link>
                                {address == "0x9e9c5b598E0E4bdf72fe9151c063daa64EAdF282" && !verified[key] && (
                                  <button
                                    className="bg-emerald-500 mt-1 ml-2 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => {
                                      verifyProperty(key + 1)
                                    }}
                                  >
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    Verify  Property
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </>
        ) : (
          <></>
        )}
        <Footer />
      </>
    );
  }
}
