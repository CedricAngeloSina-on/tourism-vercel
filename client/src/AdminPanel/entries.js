import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function Entry() {
  const [allEntries, setallEntries] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "http://localhost/reactProject/entryList.php"
        );
        const result = await response.json();
        setallEntries(Object.values(result.totalEntries));
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", type: "number", width: 90 },
    {
      field: "entryDate",
      headerName: "Date",
      // type: "date",
      width: 130,
      editable: true,
    },
    {
      field: "ae_id",
      headerName: "Accomodation Type",
      width: 250,
      editable: true,
    },
    {
      field: "munic_name",
      headerName: "Municipality",
      width: 200,
      editable: true,
    },
    {
      field: "roomTotal",
      headerName: "Total Rooms",
      type: "number",
      width: 110,
      editable: true,
    },
    {
      field: "roomMonth",
      headerName: "Rooms/Month",
      type: "number",
      width: 150,
      editable: true,
    },
    {
      field: "roomSurvey",
      headerName: "Surveyed Rooms",
      type: "number",
      width: 150,
      editable: true,
    },
    {
      field: "DGchecked",
      headerName: "Domestic-Checked In",
      type: "number",
      width: 150,
      editable: true,
    },
    {
      field: "DGnight",
      headerName: "Domestic-Night",
      type: "number",
      width: 150,
      editable: true,
    },
    {
      field: "FGchecked",
      headerName: "Foreign-Checked In",
      type: "number",
      width: 150,
      editable: true,
    },
    {
      field: "FGnight",
      headerName: "Foreign-Night",
      type: "number",
      width: 150,
      editable: true,
    },
    {
      field: "overallArrive",
      headerName: "Total Arrivals",
      type: "number",
      width: 150,
      editable: true,
    },
    {
      field: "overallNight",
      headerName: "Total Nights",
      type: "number",
      width: 150,
      editable: true,
    },
    {
      field: "occupyRoomTotal",
      headerName: "Total Occupied",
      type: "number",
      width: 150,
      editable: true,
    },
    {
      field: "alosDomestic",
      headerName: "Domestic ALOS",
      type: "number",
      width: 150,
      editable: true,
    },
    {
      field: "alosForeign",
      headerName: "Foriegn ALOS",
      type: "number",
      width: 150,
      editable: true,
    },
    {
      field: "alos",
      headerName: "Total ALOS",
      type: "number",
      width: 150,
      editable: true,
    },
    {
      field: "AOcc",
      headerName: "Occupancy Rate",
      type: "number",
      width: 150,
      editable: true,
    },
    {
      field: "agr",
      headerName: "Guest/Room",
      type: "number",
      width: 150,
      editable: true,
    },
    {
      field: "egn",
      headerName: "Estimated Guest Night",
      type: "number",
      width: 200,
      editable: true,
    },
    {
      field: "ega",
      headerName: "Estimated Guest Arrival",
      type: "number",
      width: 200,
      editable: true,
    },
  ];

  const rows = allEntries;

  return (
    <Box
      sx={{
        height: 1,
        // backgroundColor: "red"
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 8,
            },
          },
        }}
        pageSizeOptions={[8, 15, 25]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}

export default Entry;
