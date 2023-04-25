"use client"

// Imports - Libraries
import { useState } from "react"

// Imports - Leaflet
import "../../app/globals.css"

//Imports - Typescript
import { ISampleDataFixed } from "../../types/ISampleData"
import "primereact/resources/themes/lara-light-indigo/theme.css"
import "primereact/resources/primereact.min.css"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"
import { useParse } from "@/hooks/useParse"
import { useFlatten } from "@/hooks/useFlatten"
import Dropdown from "@/components/Dropdown"

const LineChart = () => {
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)
  // States
  const { data } = useParse(
    "https://docs.google.com/spreadsheets/d/11R-Ak5Edggygo4nXv9QjU32ATR75-UDKeyBsZlOx-fI/pub?output=csv"
  )
  const { flattenedData: finalData } = useFlatten(data)
  const [name, setName] = useState<string | null>("Acevedo-Kennedy")
  const [category, setCategory] = useState<string | null>("Energy")
  const [location, setLocation] = useState<string | null>("All")

  const filterCheck = (item: ISampleDataFixed) => {
    //If "All" is selected for location, then return all
    if (name && category && location === "All") {
      return item["Asset Name"] === name && item["Business Category"] === category
    }
    //If "All" is not selected, then return ones that only match the selected location
    if (name && category && location !== "All") {
      return (
        item["Asset Name"] === name &&
        item["Business Category"] === category &&
        item["Lat"] === location
      )
    }
  }

  //Filters by year, gets all risk ratings, and returns the average for that given year
  const filteredData = finalData.filter(filterCheck)

  const handleAverageRiskRatingPerYear = (data: ISampleDataFixed[], year: string) => {
    //Filter all items by the given year
    const obj = data.filter((item) => item.Year === year)
    //Check to see if there is a valid data-point by the given year
    //Otherwise undefineds and NaNs will pop up
    if (obj.length >= 1) {
      const listOfRiskRatings = obj.map((value: any) => value["Risk Rating"])
      const averageRiskRatingPerYear =
        listOfRiskRatings.reduce((a: string, b: string) => Number(a) + Number(b), 0) /
        listOfRiskRatings.length
      const dataPoint = { [year]: averageRiskRatingPerYear }
      return dataPoint
    } else return
  }

  //TODO: DRY refactor this
  const averageRiskRatingIn2030 = handleAverageRiskRatingPerYear(filteredData, "2030")
  const averageRiskRatingIn2040 = handleAverageRiskRatingPerYear(filteredData, "2040")
  const averageRiskRatingIn2050 = handleAverageRiskRatingPerYear(filteredData, "2050")
  const averageRiskRatingIn2060 = handleAverageRiskRatingPerYear(filteredData, "2060")
  const averageRiskRatingIn2070 = handleAverageRiskRatingPerYear(filteredData, "2070")

  //Pre-emptively filter any undefineds
  const avgDataPointss = [
    averageRiskRatingIn2030,
    averageRiskRatingIn2040,
    averageRiskRatingIn2050,
    averageRiskRatingIn2060,
    averageRiskRatingIn2070,
  ].filter((value) => value)

  //FIX Overload errors???
  const labels = avgDataPointss.map((item) => Object.keys(item)).flat()
  const values = avgDataPointss.map((item) => Object.values(item)).flat()

  //Populate dropdown menus
  const getListOfAllAssetNames = () => {
    const dataWithNoDuplicates = [...new Set(finalData.map((item) => item["Asset Name"]))]
    const sortedData = dataWithNoDuplicates.sort((a, b) => a.localeCompare(b))
    return sortedData
  }

  const getListOfAllBusinessCategories = () => {
    const dataWithNoDuplicates = [...new Set(finalData.map((item) => item["Business Category"]))]
    const sortedData = dataWithNoDuplicates.sort((a, b) => a.localeCompare(b))
    return sortedData
  }

  const getListOfAllLocations = () => {
    const dataWithNoDuplicates = [...new Set(finalData.map((item) => item["Lat"]))]
    const sortedData = dataWithNoDuplicates.sort()
    return sortedData
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Sample Data - Risk Ratings",
      },
      tooltip: {
        callbacks: {
          title: function (tooltipItems: any, data: any) {
            return data
          },
        },
      },
    },
  }

  const datas = {
    labels,
    datasets: [
      {
        label: "Risk Ratings",
        data: values.map((item) => item),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  }

  return (
    <>
      <Dropdown
        options={getListOfAllAssetNames()}
        setter={setName}
        placeholder={name}
        key="1"
      ></Dropdown>
      <Dropdown
        options={getListOfAllBusinessCategories()}
        setter={setCategory}
        placeholder={category}
        key="2"
      ></Dropdown>
      <Dropdown
        options={["All", ...getListOfAllLocations()]}
        setter={setLocation}
        placeholder={location}
        key="3"
      ></Dropdown>

      <div className="max-w-[50rem]">
        <Line data={datas} options={options} />
      </div>
    </>
  )
}

export default LineChart
