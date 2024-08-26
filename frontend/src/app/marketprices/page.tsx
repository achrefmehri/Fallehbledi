"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { FaCheck, FaEdit, FaTimes } from "react-icons/fa";
import ChartOne from "./chart";

interface PriceModel {
  id: number;
  price: number;
  name: string;
  image: string;
  updatedAt: string;
  createdAt: string;
}

export default function Page() {
  const [price, setPrice] = useState<PriceModel[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<PriceModel>>({});
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [refresh,setRefresh]=useState(true)
 
  console.log(price);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(
          "http://127.0.0.1:5000/api/prices/allday"
        );
        setPrice(data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    }
    fetchData();
  }, [refresh]);

  const handleEdit = (item: PriceModel) => {
    setEditId(item.id);
    setFormData(item);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (id: number) => {
    try {
      const { name, price, image } = formData;
      if (price === undefined) {
        throw new Error("Price is required");
      }
      const formattedPrice =
        typeof price === "number" ? price : parseInt(price, 10);
      const { data } = await axios.put(
        `http://127.0.0.1:5000/api/price/update/${id}`,
        {
          name,
          price: formattedPrice,
          image,
        }
      );
      setPrice((prevPrice) =>
        prevPrice.map((item) => (item.id === id ? data : item))
      );
      setEditId(null);
    } catch (error) {
      console.error("Failed to update model", error);
      alert("Failed to update model");
    }
  };

  const handleCancel = () => {
    setEditId(null);
  };

  const handleAddModel = async () => {
    try {
      const { name, price, image } = formData;
      const data = {
        name,
        price: Number(price),
        image,
      };
      const response = await axios.post(
        "http://127.0.0.1:5000/api/price/add",
        data
      );
      setPrice((prevPrice) => [...prevPrice, response.data]);
      setShowAddForm(false);
      setFormData({})
      setRefresh(!refresh);
    } catch (error) {
      console.error("Failed to add model", error);
      alert("Failed to add model");
    }
  };
  const groupPricesByDay = () => {
    const grouped: { [key: string]: PriceModel[] } = {};

    price.forEach((item) => {
      const day = moment(item.updatedAt).format("YYYY-MM-DD");
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push(item);
    });

    return grouped;
  };

  const groupedPrices = groupPricesByDay();
  const currentDate = moment().format("YYYY-MM-DD");

  return (
    <div className="rounded-sm border border-stroke bg-white ">
      <div className="px-4 py-6 md:px-6 xl:px-7.5 flex flex-col items-center">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Product prices
        </h4>
      </div>
      <div className=" overflow-x-auto">
        {Object.keys(groupedPrices).map((day) => (
          <div key={day} className="mb-6">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr>
                  <th scope="col" className="px-6 py-3 w-1/5">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3 w-1/5">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 w-1/5">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 w-1/5">
                    Updated At
                  </th>
                </tr>
              </thead>
              <tbody>
              {groupedPrices[day].map((item) => (
    <tr
      className=" border-b  text-gray-900"
      key={item.id}
    >
      <td className="px-6 py-3 w-1/5 text-black">
        <img
          src={item.image}
          alt={item.name}
          className="w-10 h-10 object-cover"
        />
      </td>
      <td className="px-6 py-3 w-1/5">{item.name}</td>
      <td className="px-6 py-3 w-1/5">
        {editId === item.id && moment(item.updatedAt).isSame(currentDate, "day") ? (
          <input
            type="number"
            name="price"
            value={formData.price || ""}
            onChange={handleInputChange}
            className="w-full rounded border border-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-black py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        ) : (
          `${item.price} TND/kg`
        )}
      </td>
      <td className="px-6 py-3 w-1/5">
        {moment(item.updatedAt).fromNow()}
      </td>
    </tr>
  ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <ChartOne/>
    </div>
  );
}