import { React, useState, useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../context/UserContext";
import useLocalStorage from "../hooks/useLocalStorage";
import convertBigNums from "../helpers/convertBigNums";
import CoinContext from "../context/CoinContext";
import starIcon from "../images/star.svg";
import starIcon_gray from "../images/star_gray.svg";
import backendApi from "../api/backend";

const Gainers = (props) => {
  const { coins, setCoins } = useContext(CoinContext);
  const {
    currentUser,
    faves,
    setFaves,
    fetchFaves,
    trades,
    setTrades,
    fetchTrades,
    assets,
    setAssets,
    fetchAssets,
    toggleFave,
  } = useContext(UserContext);

  const losers = []
    .concat(coins)
    .sort(
      (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h
    );

  return (
    <div className="flex flex-col md:mx-20 h-screen overscroll-none w-11/12">
      <div className="overflow-x-auto sm:-mx-4 sm:-mr-20 md:-mx-24  overscroll-none ">
        <div className="inline-block pt-14 py-2 max-w-full sm:px-6 lg:px-8 ">
          <div className="overflow-auto shadow-md sm:rounded-lg ">
            <table className="">
              <thead className="sticky top-0 bg-darkmode-thead">
                <tr>
                  <th
                    scope="col"
                    className="sticky top-0 py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                  >
                    <i></i>
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                  >
                    Last Price
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400 "
                  >
                    24H
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                  >
                    Buy/Sell
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                  >
                    Market Cap
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400 sticky top-0"
                  >
                    24h Volume
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400 sticky top-0"
                  >
                    Supply
                  </th>
                </tr>
              </thead>
              <tbody className="flex-1 overflow-y-auto ">
                {losers.map((coin) => (
                  <tr className="bg-darkmode-tbody border-b  dark:border-gray-600 transition duration-1000">
                    <td className="sticky top-0 py-3 px-2 text-center text-gray-700 uppercase dark:text-gray-400">
                      <img
                        id={coin.symbol}
                        onClick={toggleFave}
                        src={
                          faves.some((fave) => fave === coin.symbol)
                            ? starIcon
                            : starIcon_gray
                        }
                        alt="favorite"
                      />
                    </td>
                    <td>
                      <img
                        className="w-12 pl-3"
                        alt={coin.symbol}
                        src={coin.image}
                      ></img>
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-500 whitespace-nowrap dark:text-gray-400 transition duration-1000">
                      {coin.name}
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-500 whitespace-nowrap dark:text-gray-400 transition duration-1000">
                      $
                      {coin.current_price > 9999
                        ? coin.current_price
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : coin.current_price}
                    </td>
                    <td
                      class={
                        "py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400 transition duration-1000"
                      }
                    >
                      {console.log()}
                      <button
                        className={
                          coin.price_change_percentage_24h > 5
                            ? "bg-green-600/100 text-white font-bold py-2 px-4 rounded transition duration-1000"
                            : coin.price_change_percentage_24h > 3
                            ? "bg-green-600/75 text-white font-bold py-2 px-4 rounded transition duration-1000"
                            : coin.price_change_percentage_24h > 0
                            ? "bg-green-600/50 text-white font-bold py-2 px-4 rounded transition duration-1000"
                            : coin.price_change_percentage_24h > -3
                            ? "bg-red-600/50 text-white font-bold py-2 px-4 rounded transition duration-1000"
                            : coin.price_change_percentage_24h > -5
                            ? "bg-red-600/75 text-white font-bold py-2 px-4 rounded transition duration-1000"
                            : coin.price_change_percentage_24h < -5
                            ? "bg-red-600/100 text-white font-bold py-2 px-4 rounded transition duration-1000"
                            : ""
                        }
                      >
                        {coin.price_change_percentage_24h.toFixed(2)} %
                      </button>
                    </td>
                    <td class="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                      <Link to={`/trade/${coin.name}`}>
                        <button
                          class="transition duration-300 ease-in-out 
                        hover:bg-black hover:text-cyan-300 transform 
                        hover:-translate-xy-1  hover:scale-110 
                        rounded-lg p-4 border hover:border-cyan-300 bg-cyan-300 text-darkmode-tbody font-bold py-2 px-4  rounded"
                        >
                          Trade
                        </button>
                      </Link>
                    </td>
                    <td class="py-4 px-6 text-sm font-bold text-gray-500 whitespace-nowrap dark:text-gray-400 transition duration-1000">
                      ${convertBigNums(coin.market_cap)}
                    </td>
                    <td class="py-4 px-6 text-sm font-bold text-gray-500 whitespace-nowrap dark:text-gray-400 transition duration-1000">
                      ${convertBigNums(coin.total_volume)}
                    </td>
                    <td class="py-4 px-6 text-sm font-bold text-gray-500 whitespace-nowrap dark:text-gray-400 transition duration-1000">
                      {convertBigNums(coin.circulating_supply)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gainers;
