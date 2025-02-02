import { React, useEffect, useState, useContext } from "react";
import CoinContext from "../context/CoinContext";
import UserContext from "../context/UserContext";
import NewsContext from "../context/NewsContext";
import backGround from "../images/cyan-background.png";

import TradeNavBar from "../components/nav/TradeNavBar";
import TradeSideBar from "../components/nav/TradeSideBar";

import backendApi from "../api/backend.js";

const TradeLayout = ({ children, logout }) => {
  const { currentUser } = useContext(UserContext);
  const [coins, setCoins] = useState([]);
  const [faves, setFaves] = useState([]);
  const [trades, setTrades] = useState([]);
  const [assets, setAssets] = useState([]);
  const [news, setNews] = useState([]);

  // fetch new data from CoinGecko every 2 seconds and set state
  useEffect(() => {
    let intervalId = setInterval(() => {
      fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1&sparkline=false"
      )
        .then((data) => data.json())
        .then((data) => setCoins(data))
        .catch(function (error) {
          console.log(error);
        });
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);

  // fetch user info from the db, set each state
  const fetchFaves = async () => {
    let res = await backendApi.getFaves(currentUser);
    let faves = [];
    for (let obj of res) {
      faves.push(obj.symbol);
    }
    setFaves(faves);
  };

  const fetchTrades = async () => {
    let res = await backendApi.getTrades(currentUser);
    let newTrades = JSON.parse(res);
    setTrades(newTrades);
  };

  const fetchAssets = async () => {
    let res = await backendApi.getAssets(currentUser);
    let newAssets = JSON.parse(res);
    setAssets(newAssets);
  };

  useEffect(() => {
    fetchFaves().catch(console.error);
    fetchTrades().catch(console.error);
    fetchAssets().catch(console.error);
  }, [currentUser]);

  // fetch new data from Messari API every 60 seconds and set news state.
  useEffect(() => {
    let intervalId = setInterval(() => {
      fetch("https://data.messari.io/api/v1/news")
        .then((data) => data.json())
        .then((data) => setNews(data.data))
        .catch(function (error) {
          console.log(error);
        });
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);
  // console.log("🚀 ~ file: TradeLayout.js ~ line 139 ~ TradeLayout ~  news",  news)

  //handles clicking the favorite icon and posts fave to db
  async function toggleFave(event) {
    const clicked = event.target.id;
    if (faves.some((star) => star === clicked)) {
      await backendApi.deleteFave(currentUser, clicked);
      fetchFaves();
      return setFaves(faves.filter((star) => star !== clicked));
    } else {
      await backendApi.postFave(currentUser, clicked);
      fetchFaves();
      return setFaves([...faves, clicked]);
    }
  }

  return (
    <>
      <TradeNavBar />
      <TradeSideBar logout={logout} />
      <UserContext.Provider
        value={{
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
        }}
      >
        <CoinContext.Provider
          value={{
            coins,
            setCoins,
          }}
        >
        <NewsContext.Provider
          value={{
            news,
          }}
        >
          <div
            className=""
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url(${backGround})`,
              backgroundPosition: "top left",
              backgroundRepeat: "no-repeat",
              backgroundAttachement: "fixed",
              overscrollBehaviorX: "contain",
              overscrollBehaviorY: "contain",
            }}
          >
            {children}
          </div>
        </NewsContext.Provider>
        </CoinContext.Provider>
      </UserContext.Provider>
    </>
  );
};

export default TradeLayout;
