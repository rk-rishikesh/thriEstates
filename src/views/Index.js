/*eslint-disable*/
import React from "react";
import { Link } from "react-router-dom";

import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/Footer.js";

export default function Index() {
  return (
    <>
      <IndexNavbar fixed />
      <section className="header relative pt-16 items-center flex h-screen max-h-860-px">
        <div className="container mx-auto items-center flex flex-wrap">
          <div className="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4">
            <div className="pt-32 sm:pt-0">
              <h2 className="font-semibold text-4xl text-blueGray-600">
                BrandVilla
              </h2>
              <h2 className="font-semibold text-3xl text-blueGray-600">
                Not just your normal E-Commerce website
              </h2>
              <br/>
              <p className="mt-4 text-lg leading-relaxed text-blueGray-500">
                Get quality products from authorized dealers along with NFTs to
                design your Metaverse character.
                Live the virtual life in the real way !!
              </p>
            </div>
            <br />
           </div>
        </div>

        <img
          className="absolute top-0 b-auto right-0 pt-16 sm:w-6/12 -mt-48 sm:mt-0 w-10/12 max-h-860px"
          src={require("assets/img/pattern_react.png").default}
          alt="..."
        />
      </section>

      <section className="mt-48 md:mt-20 pb-40 relative bg-blueGray-100">
        <div
          className="bottom-auto left-0 right-0 w-full absolute h-20"
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
              className="text-blueGray-100 fill-current"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>

        <div className="container mx-auto overflow-hidden pb-20">
          <div className="flex flex-wrap items-center pt-32">
            <div className="w-full md:w-6/12 px-4 mr-auto ml-auto mt-32">
              <div className="justify-center flex flex-wrap relative">
                <div className="my-4 w-full lg:w-6/12 px-4">
                  <Link to="/product">
                    <div className="bg-red-600 shadow-lg rounded-lg text-center p-8">
                      <img
                        alt="..."
                        className="align-middle border-none max-w-full h-auto rounded-lg"
                        src="https://www.off-the-pitch.com/dw/image/v2/BCXN_PRD/on/demandware.static/-/Sites-otp-EU-Library/default/dw7f46305b/ss22/category_footwear_mobile.jpg?sw=768&sfrm=jpg"
                      />
                      <p className="text-lg text-white mt-4 font-semibold">
                        Shoe Wear
                      </p>
                    </div>
                  </Link>
                  <Link to="/product">
                    <div className="bg-lightBlue-500 shadow-lg rounded-lg text-center p-8 mt-8">
                      <img
                        alt="..."
                        className="align-middle border-none max-w-full h-auto rounded-lg"
                        src="https://img.etimg.com/thumb/msid-66009798,width-650,imgsize-621307,,resizemode-4,quality-100/dress.jpg"
                      />
                      <p className="text-lg text-white mt-4 font-semibold">
                        Traditionals
                      </p>
                    </div>
                  </Link>
                  <Link to="/product">
                    <div className="bg-blueGray-700 shadow-lg rounded-lg text-center p-8 mt-8">
                      <img
                        alt="..."
                        className="align-middle border-none max-w-full h-auto rounded-lg"
                        src="https://cdn.shopify.com/s/files/1/0164/0765/8560/files/categorymen-banner_1600x.jpg?v=1630673453"
                      />
                      <p className="text-lg text-white mt-4 font-semibold">
                        Men's Collection
                      </p>
                    </div>
                  </Link>
                </div>
                <div className="my-4 w-full lg:w-6/12 px-4 lg:mt-16">
                  <Link to="/product">
                    <div className="bg-yellow-500 shadow-lg rounded-lg text-center p-8">
                      <img
                        alt="..."
                        className="align-middle border-none max-w-full h-auto rounded-lg"
                        src="https://www.businessinsider.in/photo/34312792/samsung-breaks-into-a-new-product-category-premium-headphones-and-audio-devices.jpg"
                      />
                      <p className="text-lg text-white mt-4 font-semibold">
                        Electronics
                      </p>
                    </div>
                  </Link>
                  <a
                    // href="https://www.creative-tim.com/learning-lab/tailwind/angular/alerts/notus?ref=vtw-index"
                    target="_blank"
                  >
                    <div className="bg-red-700 shadow-lg rounded-lg text-center p-8 mt-8">
                      <img
                        alt="..."
                        className="align-middle border-none max-w-full h-auto rounded-lg"
                        src="https://nypost.com/wp-content/uploads/sites/2/2022/05/Best-Linen-Pants.png"
                      />
                      <p className="text-lg text-white mt-4 font-semibold">
                        Women's Wear
                      </p>
                    </div>
                  </a>
                  <a
                    // href="https://www.creative-tim.com/learning-lab/tailwind/vue/alerts/notus?ref=vtw-index"
                    target="_blank"
                  >
                    <div className="bg-emerald-500 shadow-lg rounded-lg text-center p-8 mt-8">
                      <img
                        alt="..."
                        className="align-middle border-none max-w-full h-auto rounded-lg"
                        src="https://myeyewellness.com/wp-content/uploads/2022/02/assorted-glasses.jpg"
                      />
                      <p className="text-lg text-white mt-4 font-semibold">
                        Eye Wear
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <div className="w-full md:w-4/12 px-12 md:px-4 ml-auto mr-auto mt-48">
              <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-white">
                <i className="fas fa-solid fa-store text-xl"></i>
              </div>
              <h3 className="text-3xl mb-2 font-semibold leading-normal">
                The GenZ's shopping new destination
              </h3>
              <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-blueGray-600">
                First ever marketplace backed by power of Blockchain and NFTs
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-blueGray-600 overflow-hidden">
        <div className="container mx-auto pb-64">
          <div className="flex flex-wrap justify-center">
            <div className="w-full md:w-5/12 px-12 md:px-4 ml-auto mr-auto md:mt-64">
              <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-white">
                <i className="fas fa-solid fa-tag text-xl"></i>
              </div>
              <h3 className="text-3xl mb-2 font-semibold leading-normal text-white">
                List your Product
              </h3>
              <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-blueGray-400">
                Metaverse and NFTs would open up a new gateway for you to reach out to wider range of customers.
              </p>
              <Link to="/listing">
                <a className="github-star mt-4 inline-block text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-blueGray-700 active:bg-blueGray-600 uppercase text-sm shadow hover:shadow-lg">
                  List Now
                </a>
              </Link>
            </div>

            <div className="w-full md:w-4/12 px-4 mr-auto ml-auto mt-32 relative">
              <i className="fas fa-solid fa-store text-blueGray-700 absolute -top-150-px -right-100 left-auto opacity-80 text-55"></i>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
