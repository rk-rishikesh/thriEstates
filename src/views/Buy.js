/*eslint-disable*/
import React, { useState, useEffect, useRef } from "react";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/Footer.js";
import { Link } from "react-router-dom";
// Blockchain
import Web3 from "web3";

import { RealEstateNFT } from "../constants/Constants.js";
import { RealEstateABI } from "../constants/Constants.js";

import { Document } from "../constants/Constants.js";
import { DocumentABI } from "../constants/Constants.js";

import { Marketplace } from "../constants/Constants.js";
import { MarketplaceABI } from "../constants/Constants.js";

import Loading from "assets/img/loading.gif";
import makePaymentImg from "assets/img/makePayment.jpeg";
import dealClosed from "assets/img/dealClosed.jpeg";
import releasePaymentImg from "assets/img/releasePayment.jpeg";

import { useIPFS } from "../contexts/IPFS.js";

import { maxHeight } from "tailwindcss/defaultTheme.js";

export default function Buy(props) {
  const { id } = props.match.params;
  const { IPFSuploading, IPFSerror, IPFSupload, userDetailsUpload } = useIPFS();
  const inputFileDocument = useRef(null);
  useEffect(async () => {
    await connectWallet();
    await getProductDetails();
  }, []);

  const [propertyName, setPropertyName] = useState("");
  const [propertyImage, setPropertyImage] = useState("");
  const [propertyDoc, setPropertyDoc] = useState("");
  const [propertyDesc, setPropertyDesc] = useState("");
  const [estateObject, setEstateObject] = useState("");
  const [userDoc, setUserDoc] = useState(null);

  const [showModal, setShowModal] = React.useState(false);
  const [showNFT, setShowNFT] = React.useState(false);
  const [openTab, setOpenTab] = React.useState(1);
  const [loading, setLoading] = useState(false);
  const [address, setUserAddress] = useState();
  const [connected, setConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [product, setProduct] = useState(null);
  const [productObject, setProductObject] = useState(null);
  const [nftObject, setNftObject] = useState(null);
  const [warrantyObject, setWarrantyObject] = useState(null);
  // Shipment Form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailID, setEmailID] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [shipmentAddress, setShipmentAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [invoiceURI, setInvoiceURI] = useState("");

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
    setConnected(true);
    setLoading(false);
  };

  function inputUserDocumentHandler(e) {
    inputFileDocument.current.click();
    setUserDoc(e.target.files[0]);
  }

  const checkDeal = async () => {
    setShowModal(true);
  };

  const getProductDetails = async () => {
    // Contract Integration
    const web3 = window.web3;
    const realEstateNFT = new web3.eth.Contract(RealEstateABI, RealEstateNFT);
    const marketplace = new web3.eth.Contract(MarketplaceABI, Marketplace);
    const document = new web3.eth.Contract(DocumentABI, Document);

    console.log("== Loading Product Details ==");
    const estate = await marketplace.methods.estates(id).call();
    console.log(estate);
    setEstateObject(estate);

    const estateUri = await realEstateNFT.methods.tokenURI(id).call();
    console.log(estateUri);
    let estateDetails = await parseURL(estateUri);
    setPropertyDesc(estateDetails.description);
    const img = await getProductImage(estateUri);
    console.log(img);
    setPropertyImage(img);
    const documentURI = await document.methods.tokenURI(id).call();
    const pd = await parseURL(documentURI);
    const doc = await getDocument(pd.image);
    console.log(doc.toString());
    setPropertyDoc(doc.toString());
    console.log(pd.name);
    setPropertyName(pd.name);
  };

  const getProductImage = async (url) => {
    let imageURL = await parseURL(url);
    let image = imageURL.image;
    image = image.toString();
    return "https://ipfs.io/ipfs/" + image.slice(7);
  };

  const getDocument = async (url) => {
    let doc = url.toString();
    console.log(doc);
    return "https://ipfs.io/ipfs/" + doc.slice(7);
  };

  const uploadMetadata = async (name) => {
    console.log("== Uploading Metadata == ");
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();

    today = mm + "/" + dd + "/" + yyyy;
    console.log(today);
    console.log(name);

    const metadataUrl = await userDetailsUpload({
      name: name,
      today: today,
      firstName: firstName,
      lastName: lastName,
      emailID: emailID,
      contactNumber: contactNumber,
    });

    console.log(metadataUrl);

    return metadataUrl;
  };

  const parseURL = async (url) => {
    const data = await fetch(url);
    const json = await data.json();
    console.log(json);
    return json;
  };

  const getURLLink = (url) => {
    let image = url.toString();
    return "https://ipfs.io/ipfs/" + image.slice(7);
  };

  const initiateDeal = async () => {
    setLoading(true);

    let invoiceURL = await uploadMetadata(propertyName);
    invoiceURL = getURLLink(invoiceURL);

    console.log("Invoice URI : ", invoiceURL);
    setInvoiceURI(invoiceURL);
    // Contract Integration
    const web3 = window.web3;

    const marketplace = new web3.eth.Contract(MarketplaceABI, Marketplace);

    marketplace.methods
      .initateDeal(id, address)
      .send({ from: address })
      .on("transactionHash", (hash) => {
        console.log(hash);
        setLoading(false);
      });
  };

  const makePayment = async () => {
    setLoading(true);
    // Contract Integration
    const web3 = window.web3;

    const marketplace = new web3.eth.Contract(MarketplaceABI, Marketplace);

    marketplace.methods
      .makePayment(id)
      .send({ from: address, value: estateObject.amount })
      .on("transactionHash", (hash) => {
        console.log(hash);
        setLoading(false);
      });
  };

  const releasePayment = async () => {
    setLoading(true);
    // Contract Integration
    const web3 = window.web3;

    const marketplace = new web3.eth.Contract(MarketplaceABI, Marketplace);

    marketplace.methods
      .releasePayment(id)
      .send({ from: address })
      .on("transactionHash", (hash) => {
        console.log(hash);
        setLoading(false);
      });
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
        <br />
        <br />

        {showModal ? (
          <>
            <br />
            <br />
            <div className="justify-center items-center flex overflow-x-hidden">
              <div className="relative w-auto my-6 mx-auto max-w-sm">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*body*/}
                  <div class="relative p-6 flex-auto">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
                      {estateObject.dealClosed && (
                        <>
                          <div className="rounded-t bg-white mb-0 px-6 py-6">
                            <div className="text-center flex justify-between">
                              <h6 className="text-blueGray-700 text-xl font-bold">
                                Deal Closed
                              </h6>
                            </div>
                          </div>

                          <div className="flex flex-wrap justify-center">
                            <div className="w-3/12 sm:w-4/12 px-4">
                              <br />
                              <img
                                src={dealClosed}
                                style={{height:"380px", width:"600px"}}
                                alt="..."
                                className="rounded max-w-full h-auto align-middle border-none"
                              />
                            </div>
                          </div>
                          <hr className="mt-6 border-b-1 border-blueGray-300" />
                          <br />
                        </>
                      )}
                      {estateObject.paymentIssued && !estateObject.dealClosed && (
                        <>
                          <div className="rounded-t bg-white mb-0 px-6 py-6">
                            <div className="text-center flex justify-between">
                              <h6 className="text-blueGray-700 text-xl font-bold">
                                Release Payment
                              </h6>
                            </div>
                          </div>

                          <div className="flex flex-wrap justify-center">
                            <div className="w-3/12 sm:w-4/12 px-4">
                              <br />
                              <img
                                src={releasePaymentImg}
                                style={{height:"380px", width:"600px"}}
                                alt="..."
                                className="rounded max-w-full h-auto align-middle border-none"
                              />
                            </div>
                          </div>
                          <hr className="mt-6 border-b-1 border-blueGray-300" />
                          <br />
                          <button
                            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={() => {
                              releasePayment();
                              setShowModal(false);
                            }}
                          >
                            Release Payment
                          </button>
                        </>
                      )}
                      {estateObject.dealInitated &&
                        !estateObject.paymentIssued && (
                          <>
                            <div className="rounded-t bg-white mb-0 px-6 py-6">
                              <div className="text-center flex justify-between">
                                <h6 className="text-blueGray-700 text-xl font-bold">
                                  Make Payment
                                </h6>
                              </div>
                            </div>

                            <div className="flex flex-wrap justify-center">
                              <div className="w-3/12 sm:w-4/12 px-4">
                                <br />
                                <img
                                  alt="..."
                                  className="rounded max-w-full h-auto align-middle border-none"
                                  src={makePaymentImg}
                                  style={{height:"380px", width:"600px"}}
                                />
                              </div>
                            </div>
                            <hr className="mt-6 border-b-1 border-blueGray-300" />
                            <br />
                            <button
                              className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              type="button"
                              onClick={() => {
                                makePayment();
                                setShowModal(false);
                              }}
                            >
                              Make Payment
                            </button>
                          </>
                        )}
                      {!estateObject.dealInitated && (
                        <div>
                          <div className="rounded-t bg-white mb-0 px-6 py-6">
                            <div className="text-center flex justify-between">
                              <h6 className="text-blueGray-700 text-xl font-bold">
                                Enter Your Details
                              </h6>
                            </div>
                          </div>

                          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <form>
                              <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                                User Information
                              </h6>
                              <div className="flex flex-wrap">
                                <div className="w-full lg:w-6/12 px-4">
                                  <div className="relative w-full mb-3">
                                    <label
                                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                      htmlFor="grid-password"
                                    >
                                      First Name
                                    </label>
                                    <input
                                      type="text"
                                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                      placeholder="First Name"
                                      onChange={(e) => {
                                        setFirstName(e.target.value);
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4">
                                  <div className="relative w-full mb-3">
                                    <label
                                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                      htmlFor="grid-password"
                                    >
                                      Last Name
                                    </label>
                                    <input
                                      type="text"
                                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                      placeholder="Last Name"
                                      onChange={(e) => {
                                        setLastName(e.target.value);
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4">
                                  <div className="relative w-full mb-3">
                                    <label
                                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                      htmlFor="grid-password"
                                    >
                                      Email ID
                                    </label>
                                    <input
                                      type="email"
                                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                      placeholder="thriestates@gmail.com"
                                      onChange={(e) => {
                                        setEmailID(e.target.value);
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="w-full lg:w-6/12 px-4">
                                  <div className="relative w-full mb-3">
                                    <label
                                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                      htmlFor="grid-password"
                                    >
                                      Contact Number
                                    </label>
                                    <input
                                      type="text"
                                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                      placeholder="98-XXX-XXX-00"
                                      onChange={(e) => {
                                        setContactNumber(e.target.value);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>

                              <hr className="mt-6 border-b-1 border-blueGray-300" />

                              <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                                Upload Documents
                              </h6>

                              <div className="flex flex-wrap">
                                <div className="w-full lg:w-12/12 px-4">
                                  <div className="relative w-full mb-3 mt-8">
                                    <label
                                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                      htmlFor="full-name"
                                    >
                                      User Document
                                    </label>
                                    <input
                                      ref={inputFileDocument}
                                      type="file"
                                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                      onChange={(e) =>
                                        inputUserDocumentHandler(e)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>

                              <hr className="mt-6 border-b-1 border-blueGray-300" />
                            </form>
                            <br />
                            <button
                              className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              type="button"
                              onClick={() => {
                                initiateDeal();
                                setShowModal(false);
                              }}
                            >
                              Initiate Deal
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : showNFT ? (
          <div className="mt-6 justify-center items-center flex overflow-x-hidden">
            <div className="relative w-auto my-6 mx-auto max-w-sm">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*body*/}

                <div class="relative p-6 flex-auto">
                  <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
                    <div className="rounded-t bg-white mb-0 px-6 py-6">
                      <div className="text-center flex justify-between">
                        <h6 className="text-blueGray-700 text-xl font-bold">
                          Congratulations !! You received the product NFT 🎊
                        </h6>
                      </div>
                    </div>
                    <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                      <div className="flex flex-wrap justify-center">
                        <div className="w-3/12 sm:w-4/12 px-4">
                          <img
                            src={getURLLink(nftObject.image)}
                            alt="..."
                            className="rounded max-w-full h-auto align-middle border-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-0 px-6 py-0">
                    <h6 className="text-sm font-bold">
                      <a
                        href={getURLLink(invoiceURI)}
                        clickable
                        target="_blank"
                      >
                        Check Invoice Details
                      </a>
                    </h6>
                  </div>
                </div>

                {/*footer*/}
                <div className="flex items-center justify-end p-6 rounded-b">
                  <Link to="/profile">
                    <a className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                      Enter Metaverse
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <section className="items-center flex h-screen max-h-860-px">
            {/* LEFT SIDE */}
            {propertyName != null && (
              <div className="w-full lg:w-8/12 px-6">
                <div className="bg-blueGray-100">
                  {/* <div className=" flex flex-wrap"> */}
                  <div className="w-full md:w-12/12 px-12 md:px-4">
                    <br />
                    <br />
                    <section className="flex">
                      <div>
                        <h2 className="font-semibold text-4xl">
                          {propertyName}
                        </h2>
                      </div>

                      <div className="w-full lg:w-4/12 px-1">
                        {estateObject.verified && (
                          <img
                            style={{ height: "40px" }}
                            src="https://www.pngmart.com/files/12/Instagram-Verified-Badge-PNG-Image.png"
                          ></img>
                        )}
                      </div>
                    </section>
                    <br />
                    <br />
                    {propertyDesc}
                    <br />

                    <br />
                    <br />
                    <p className="text-lg leading-relaxed  text-blueGray-500">
                      Property ID : {id}
                    </p>
                    <p className="text-lg leading-relaxed  text-blueGray-500">
                      Seller : {estateObject.seller}
                    </p>
                    <p className="text-lg leading-relaxed  text-blueGray-500">
                      <a href={propertyDoc} clickable target="_blank">
                        Property Document
                      </a>
                    </p>
                    <br />
                    <br />
                    {estateObject.verified && (
                      <button
                        className="bg-lightBlue-600 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => checkDeal()}
                      >
                        Check Deal
                      </button>
                    )}

                    <br />
                    <br />
                  </div>

                  {/* </div> */}
                </div>
              </div>
            )}

            {/* RIGHT SIDE */}
            {propertyName != null && (
              <div className="w-full lg:w-6/12 px-4">
                <div className="flex flex-wrap">
                  <div className="w-full">
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6">
                      <div className="px-4 py-6 flex-auto">
                        <div className="tab-content tab-space">
                          <div
                            className={openTab === 1 ? "block" : "hidden"}
                            id="link1"
                          >
                            <div className="flex flex-wrap justify-center">
                              <div className="w-3/12 sm:w-4/12 px-4">
                                <img
                                  style={{ height: "400px" }}
                                  src={propertyImage}
                                  alt="..."
                                  className="rounded align-middle border-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
        <Footer />
      </>
    );
  }
}
