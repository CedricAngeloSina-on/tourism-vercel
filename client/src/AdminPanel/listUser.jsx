import React from "react";
import { useState, useEffect } from "react";
import { Box, Typography, Card, Button, Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditUser from "./editUserModal";
import axios from "axios";
import { format } from "date-fns";
import { useOutletContext } from "react-router-dom";
import AppBarCustom from "../assets/components/appBar";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

function ListUser() {
    const passedData = useOutletContext();
    const [userArray, setUserArray] = useState([]);
    const [open, setOpen] = React.useState(false);

    const [selectedUserId, setSelectedUserId] = useState(null);

    const handleOpen = (id) => () => {
        // Set the selected user ID in the state
        setSelectedUserId(id);
        setOpen(true);
    };

    const handleClose = () => {
        // Set the selected user ID in the state
        setSelectedUserId(0);
        setOpen(false);
    };

    useEffect(() => {
        axios
            .get(
                `${import.meta.env.VITE_WEBSITE_URL}:${
                    import.meta.env.VITE_PORT
                }/check-login`
            )
            .then((response) => {
                const { userID } = response.data;

                if (userID) {
                    switch (userID.account_roleID) {
                        case 1:
                            console.log(userID.provinceID);
                            fetchUsers(
                                userID.account_roleID + 1,
                                "municipalities.provinceID",
                                userID.provinceID
                            );
                            break;
                        case 2:
                            console.log(userID.municipalityID);
                            fetchUsers(
                                userID.account_roleID + 1,
                                "establishments.municipalityID",
                                userID.municipalityID
                            );
                            break;
                        case 3:
                            console.log(userID.establishmentID);

                            break;
                        default:
                            console.log("hehehe");
                            break;
                    }
                }
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });
    }, [open]);

    function fetchUsers(account_roleID, filterType, filterValue) {
        const requestData = {
            account_roleID: account_roleID,
            filterType: filterType,
            filterValue: filterValue,
        };

        axios
            .post(
                `${import.meta.env.VITE_WEBSITE_URL}:${
                    import.meta.env.VITE_PORT
                }/get_users`,
                requestData
            )
            .then((response) => {
                console.log("Response:", response.data);
                setUserArray(response.data);
            })

            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });
    }

    async function setUserStatus(account_ID, account_status) {
        const requestData = {
            account_ID: account_ID,
            account_status: account_status,
        };

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_WEBSITE_URL}:${
                    import.meta.env.VITE_PORT
                }/set_user_status`,
                requestData
            );
            console.log("Response:", response.data);
            return response.data; // Assuming the response contains the updated data
        } catch (error) {
            throw error;
        }
    }

    const columns = [
        {
            field: "id",
            headerName: "ID",
            width: 90,
            type: "number",
            headerAlign: "center",
            align: "center",
            hideable: false,
        },
        {
            field: "username",
            headerName: "Username",
            width: 250,
        },
        {
            field: "FullName",
            headerName: "Full name",
            width: 250,
        },
        {
            field: "email",
            headerName: "Email",
            width: 300,
        },
        {
            field: "LocationName",
            headerName: "Location",
            width: 400,
        },
        {
            field: "created_at",
            headerName: "Date Created",
            width: 250,
            valueFormatter: (params) => {
                const isoDateString = params.value;
                const formattedDate = format(
                    new Date(isoDateString),
                    "MMMM dd, yyyy"
                );
                return formattedDate;
            },
        },
        {
            field: "options",
            headerName: "Options",
            width: 250,
            renderCell: (data) => {
                const [isButtonDisabled, setIsButtonDisabled] = useState(false);

                const handleToggleStatus = async () => {
                    setIsButtonDisabled(true);

                    const updatedRows = rows.map((row) =>
                        row.id === data.id
                            ? { ...row, status: row.status === 0 ? 1 : 0 }
                            : row
                    );

                    setUserArray(updatedRows);

                    try {
                        // Use await to wait for setUserStatus to complete
                        await setUserStatus(
                            data.id,
                            updatedRows.find((row) => row.id === data.id)
                                ?.status
                        );
                    } catch (error) {
                        // Handle any errors that occurred during setUserStatus
                        console.error("Error:", error);
                    }

                    console.log(
                        typeof updatedRows.find((row) => row.id === data.id)
                            ?.status
                    );

                    setTimeout(() => {
                        setIsButtonDisabled(false);
                    }, 2000);
                };

                return (
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-evenly",
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleOpen(data.id)}
                        >
                            EDIT
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor:
                                    data.row.status === 1 ? "green" : "red",
                            }}
                            onClick={handleToggleStatus}
                            disabled={isButtonDisabled}
                        >
                            {data.row.status === 1 ? "ENABLED" : "DISABLED"}
                        </Button>
                    </Box>
                );
            },
        },
    ];

    const rows = userArray;

    const hiddenFields = ["id"];

    const getTogglableColumns = (columns) => {
        return columns
            .filter((column) => !hiddenFields.includes(column.field))
            .map((column) => column.field);
    };

    return (
        <Box
            sx={{
                height: 1,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <AppBarCustom
                appBarName={passedData.dashboardName}
                icon={
                    <AccountCircleRoundedIcon
                        sx={{ color: "black", fontSize: 35 }}
                    />
                }
            />
            <Box
                // flexGrow={1}
                padding={2}
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ minHeight: "90%", maxHeight: "90%" }}
            >
                <DataGrid
                    rows={rows}
                    columns={columns}
                    slotProps={{
                        columnsPanel: {
                            getTogglableColumns,
                        },
                    }}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                        columns: {
                            columnVisibilityModel: {
                                // Hide columns status and traderName, the other columns will remain visible
                                id: false,
                            },
                        },
                    }}
                    pageSizeOptions={[5, 10, 15]}
                />
            </Box>
            <Modal
                open={open}
                onClose={handleClose}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <>
                    <EditUser onCloseModal={handleClose} uID={selectedUserId} />
                </>
            </Modal>
        </Box>
    );
}

export default ListUser;
