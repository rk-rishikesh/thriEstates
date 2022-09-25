import React, { useState, useEffect, useRef } from "react";

// components

import Navbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/Footer.js";
import { Steps } from "antd";
import "antd/dist/antd.css";

// Blockchain

import Web3 from "web3";

import { ThriEstates } from "../constants/Constants.js";
import { ThriEstatesABI } from "../constants/Constants.js";
import { RealEstateNFT } from "../constants/Constants.js";
import { RealEstateABI } from "../constants/Constants.js";
import { Marketplace } from "../constants/Constants.js";

import { useIPFS } from "../contexts/IPFS.js";

// Form Utils
const { Step } = Steps;

export default function Listing() {
  const { IPFSuploading, IPFSerror, IPFSupload } = useIPFS();
  const inputFilePropertyRef = useRef(null);
  const inputFileDocumentOneRef = useRef(null);

  // States
  const [loading, setLoading] = useState(false);
  const [address, setUserAddress] = useState();
  const [connected, setConnected] = useState(false);
  const [propertyName, setPropertyName] = useState("");
  const [propertyDescription, setPropertyDescription] = useState("");
  const [propertyImage, setPropertyImage] = useState(null);
  const [propertyCost, setPropertyCost] = useState(0);
  const [documentOneImage, setDocumentOneImage] = useState(null);

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

  const [PropertyURI, setPropertyURI] = useState("");
  const [DocumentOneURI, setDocumentOneURI] = useState("");

  const [tx, setTransaction] = useState("");

  const getStep = () => {
    if (ten) {
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

  const connectWallet = async () => {
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
    setConnected(true);
  };

  // Functions
  function inputPropertyImageHandler(e) {
    inputFilePropertyRef.current.click();
    setPropertyImage(e.target.files[0]);
    setThree(true);
  }

  function inputDocumentOneHandler(e) {
    inputFileDocumentOneRef.current.click();
    setDocumentOneImage(e.target.files[0]);
    setFive(true);
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

  const listProperty = async () => {
    setSeven(true);
    let propertyURI = await uploadMetadata(
      propertyName,
      propertyDescription,
      propertyImage
    );
    propertyURI = "https://ipfs.io/ipfs/" + propertyURI.slice(7);

    console.log("Property URI : ", propertyURI);
    setEight(true);
    setPropertyURI(propertyURI);

    let documentOneURI = await uploadMetadata(
      propertyName,
      propertyName + ": Document One",
      documentOneImage
    );
    documentOneURI = "https://ipfs.io/ipfs/" + documentOneURI.slice(7);

    console.log("Document one URI : ", documentOneURI);
    setDocumentOneURI(documentOneURI);
    setNine(true);

    const web3 = window.web3;

    const thriestate = new web3.eth.Contract(ThriEstatesABI, ThriEstates);
    const realEstate = new web3.eth.Contract(RealEstateABI, RealEstateNFT);
    
    thriestate.methods
      .listProperty(propertyURI, documentOneURI, propertyCost)
      .send({ from: address })
      .on("transactionHash", (hash) => {
        console.log(hash);
        realEstate.methods
          .setApprovalForAll(Marketplace, true)
          .send({ from: address })
          .on("transactionHash", (hash) => {
            console.log(hash);
            setLoading(false);
            setTen(true);
          });
      });

    // Reset Values
    setPropertyName("");
    setPropertyDescription("");
    setPropertyCost(0);
    setDocumentOneImage(null);
    setPropertyImage(null);
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
                  List Your Property here and sell it safely
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
                          List your Property
                        </h4>

                        <p className="leading-relaxed mt-1 mb-4 text-blueGray-500">
                          Input the required details of the property
                        </p>
                        <div className="relative w-full mb-3 mt-8">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="full-name"
                          >
                            Property Name
                          </label>
                          <input
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Product Name"
                            onChange={(e) => {
                              setPropertyName(e.target.value);
                              setOne(true);
                            }}
                          />
                        </div>

                        <div className="relative w-full mb-3 mt-8">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="full-name"
                          >
                            Property Cost In Matic
                          </label>
                          <input
                            type="number"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Product Cost"
                            onChange={(e) => {
                              var cost = e.target.value;
                              console.log(cost);
                              setPropertyCost(cost * 1000000000000000000);
                              setTwo(true);
                              console.log(propertyCost);
                            }}
                          />
                        </div>

                        <div className="relative w-full mb-3 mt-8">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="full-name"
                          >
                            Property Image
                          </label>
                          <input
                            ref={inputFilePropertyRef}
                            type="file"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            onChange={(e) => inputPropertyImageHandler(e)}
                          />
                        </div>

                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="message"
                          >
                            Property Description
                          </label>
                          <textarea
                            rows="4"
                            cols="80"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                            placeholder="Product Description..."
                            onChange={(e) => {
                              setPropertyDescription(e.target.value);
                              setFour(true);
                            }}
                          />
                        </div>

                        <div className="relative w-full mb-3 mt-8">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="full-name"
                          >
                            Property Document
                          </label>
                          <input
                            ref={inputFileDocumentOneRef}
                            type="file"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            onChange={(e) => inputDocumentOneHandler(e)}
                          />
                        </div>

                        <div className="text-center mt-6">
                          <button
                            className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={listProperty}
                          >
                            List Property
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
                          title="Property Name"
                          description="Enter Property Name"
                        />
                        <Step
                          title="Property Cost"
                          description="Enter Property Cost"
                        />
                        <Step
                          title="Property Image"
                          description="Upload Property Image"
                        />
                        <Step
                          title="Property Description"
                          description="Enter Property description"
                        />
                        <Step
                          title="Property Document"
                          description="Upload Property Document"
                        />
                        <Step
                          title="List Property"
                          description="Confirm the details and click on List Property"
                        />
                        <Step
                          title="Generating Property URI"
                          description={
                            nine ? (
                              <a href={PropertyURI} clickable target="_blank">
                                Property URI
                              </a>
                            ) : (
                              "Generating ..."
                            )
                          }
                        />
                        <Step
                          title="Generating Property Document URI"
                          description={
                            nine ? (
                              <a
                                href={DocumentOneURI}
                                clickable
                                target="_blank"
                              >
                                Property Document URI
                              </a>
                            ) : (
                              "Generating ..."
                            )
                          }
                        />

                        <Step
                          title="Confirm the transaction"
                          description={
                            ten ? tx : "Waiting for confirmation ..."
                          }
                        />
                      </Steps>
                    </div>
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
