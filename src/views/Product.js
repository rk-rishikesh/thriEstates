/*eslint-disable*/
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/Footer.js";
import Loading from "assets/img/loading.gif";
import Web3 from "web3";
import { sequence } from "0xsequence";
import { BrandVilla } from "../constants/Constants.js";
import { BrandVillaABI } from "../constants/Constants.js";

const network = "mumbai";
sequence.initWallet(network);

export default function Product() {
  const [products, setProducts] = useState([]);
  const [address, setUserAddress] = useState();
  const [images, setImages] = useState([]);
  const [productDetail, setProductDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  const connectWallet = async () => {
    setLoading(true);
    console.log(loading);
    console.log("== Connecting Wallet");
    const wallet = sequence.getWallet();
    if (wallet.isConnected()) {
      setConnected(true);
      const walletAddress = await wallet.getAddress();
      setUserAddress(walletAddress)
      await getProducts();
    } else {
      wallet.openWallet();
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
      setConnected(true);
      const walletAddress = await wallet.getAddress();
      setUserAddress(walletAddress)
      await getProducts();
      console.log(loading);
    }
  };

  const getProducts = async () => {
    const wallet = sequence.getWallet();
    const provider = await wallet.getProvider();
    // Contract Integration
    const web3 = new Web3(provider);
    const brandVilla = new web3.eth.Contract(BrandVillaABI, BrandVilla);
    let productCount = await brandVilla.methods.itemID().call();
    console.log(productCount);

    let productList = [];
    let imageList = [];
    let productDetailList = [];

    for (var i = 101; i <= productCount; i++) {
      if (i != 101 && i != 103 && i != 104) {
        const product = await brandVilla.methods.items(i).call();
        console.log(product);
        productList.push(product);
        const img = await getProductImage(product.productURI);
        imageList.push(img);
        const pd = await parseURL(product.productURI);
        productDetailList.push(pd.name);
      }
    }
    setProducts(productList);
    setImages(imageList);
    setProductDetails(productDetailList);
    console.log(imageList);
    console.log(productList);
    console.log(productDetailList);
    setLoading(false);
  };

  const parseURL = async (url) => {
    const data = await fetch(url);
    const json = await data.json();
    console.log(json);
    return json;
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
                  Your favourite product at your finger tips
                </h2>
                {connected ? (
                  <>
                    <p className="mt-4 text-lg leading-relaxed text-blueGray-500">
                      Welcome !! Shop your favourite products now.
                    </p>

                    <div className="mt-12">
                      <a
                        className="get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-orange-500 active:bg-orange-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                      >
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
                    Grab your favourite Sneakers
                  </h2>
                  <p className="text-lg leading-relaxed mt-4 mb-4 text-blueGray-500">
                  Sneakerheads unite. The style of sneakers is like no other category in streetwear, 
                  and sneaker connoisseurs are the most dedicated to their passion.
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
                              <Link to={`buy/${products[key].itemID}`}>
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
