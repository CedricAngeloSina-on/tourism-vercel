import { React, useState, useEffect } from "react";
import {
    Box,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

function TableDynamic(props) {
    const [total, setTotal] = useState(0);
    const [originNumber, setOriginNumber] = useState([]);
    const originArray = props.layoutArray;

    useEffect(() => {
        const defaultValues = originArray.map((region) => ({
            name: region.name,
            value: 0,
        }));
        setOriginNumber(defaultValues);

        const initialTotal = defaultValues.reduce(
            (acc, region) => acc + region.value,
            0
        );
        setTotal(initialTotal);
        props.childToParent(initialTotal, defaultValues);
    }, []);

    const handleInputChange = (event, region) => {
        let { value } = event.target;

        if (value !== "") {
            value = value.replace(/^0+/, "");
        }

        let parsedValue = parseInt(value) || 0;

        if (parsedValue < 0) {
            parsedValue = 0;
        } else if (parsedValue > 10000) {
            parsedValue = 10000;
        }

        const finalValue = parsedValue.toString();

        const updatedValues = originNumber.map((r) => {
            return r.name === region.name ? { ...r, value: finalValue } : r;
        });

        setOriginNumber(updatedValues);

        const newTotal = updatedValues.reduce(
            (acc, r) => acc + parseInt(r.value || 0),
            0
        );
        setTotal(newTotal);
        props.childToParent(newTotal, updatedValues);
    };

    return (
        <TableContainer>
            <Table>
                <TableHead sx={{ bgcolor: "lightgrey" }}>
                    <TableRow>
                        <TableCell>{props.col1Title}</TableCell>
                        {/* //////////////////////////////////////////// */}

                        <TableCell align="center">{props.col2Title}</TableCell>
                        {/* //////////////////////////////////////////// */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {originArray.map((region) => (
                        <TableRow key={region.id}>
                            <TableCell sx={{ width: 1 / 2 }}>
                                {region.name}
                            </TableCell>
                            <TableCell align="center">
                                <Box sx={{ height: 1, width: 1 }}>
                                    <TextField
                                        // defaultValue={0}
                                        value={
                                            originNumber.find(
                                                (r) => r.name === region.name
                                            )?.value === 0
                                                ? 0
                                                : originNumber.find(
                                                      (r) =>
                                                          r.name === region.name
                                                  )?.value || ""
                                        }
                                        size="small"
                                        type="number"
                                        name={region.name} // Use region name as the name
                                        sx={{ width: 200 }}
                                        onChange={(event) =>
                                            handleInputChange(event, region)
                                        } // Pass region object to handleInputChange
                                        InputProps={{
                                            inputProps: {
                                                style: { textAlign: "center" },
                                                max: 10000,
                                                min: 0,
                                            },
                                        }}
                                    />
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableHead sx={{ bgcolor: "lightgrey" }}>
                    <TableRow>
                        <TableCell>Total:</TableCell>
                        <TableCell
                            align="center"
                            sx={{
                                color:
                                    props.extraParams !== false
                                        ? "inherit"
                                        : "red",
                            }}
                        >
                            {total}
                            {props.extraParams !== false
                                ? null
                                : " - Total does not match with the previous values"}
                        </TableCell>
                    </TableRow>
                </TableHead>
            </Table>
        </TableContainer>
    );
}

export default TableDynamic;
