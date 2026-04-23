import axios from "axios";
import React, { useEffect, useState } from "react";

const Test = () => {
  const [data, setData] = useState();

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get("https://dummyjson.com/users");

        setData(res.data.users);
      } catch (err) {
        console.log(err.response?.data);
      }
    };

    fetchdata();
  }, []);

  return (
    <div>
      {data?.map((d, index) => (
        <p key={index}>{d.id}{d.firstName}</p>
  ))};
    </div>
  );
};

export default Test;
