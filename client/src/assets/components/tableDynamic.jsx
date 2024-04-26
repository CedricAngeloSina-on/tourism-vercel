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
    Autocomplete,
    Button,
    Grid,
} from "@mui/material";

function TableDynamic(props) {
    const [total, setTotal] = useState(0);
    const [originNumber, setOriginNumber] = useState([]);
    const originArray = props.layoutArray;
    const [selectedArray, setSelectedArray] = useState([]);
    const dynamicRender = props.dynamic;
    // const [reset, setReset] = useState(false);
    const [label, setLabel] = useState(false);

    useEffect(() => {
        const initializeValues = () => {
            const defaultValues = originArray.map((region) => ({
                id: region.id,
                name: region.name,
                cca2: region.cca2,
                region: region.region,
                value: 0,
            }));
            setOriginNumber(defaultValues);
            updateTotalAndParent(defaultValues);
        };

        initializeValues();
    }, []);

    const updateTotalAndParent = (updatedValues) => {
        const newTotal = updatedValues.reduce(
            (acc, r) => acc + parseInt(r.value || 0),
            0
        );
        setTotal(newTotal);
        props.childToParent(newTotal, updatedValues);
    };

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

        const updatedValues = originNumber.map((r) =>
            r.name === region.name ? { ...r, value: finalValue } : r
        );

        setOriginNumber(updatedValues);
        updateTotalAndParent(updatedValues);
    };

    const handleAutocompleteChange = (event, value) => {
        if (!value) {
            setSelectedArray([]);
        } else if (Array.isArray(value)) {
            const transformedValue = value.map((selectedOption) => ({
                id: selectedOption.id,
                cca2: selectedOption.cca2,
                name: selectedOption.name,
                region: selectedOption.region,
            }));
            setSelectedArray(transformedValue);
        } else {
            const selectedOption = value;
            const alreadyExists = selectedArray.some(
                (item) => item.id === selectedOption.id
            );

            if (!alreadyExists) {
                const transformedValue = [
                    {
                        id: selectedOption.id,
                        cca2: selectedOption.cca2,
                        name: selectedOption.name,
                        region: selectedOption.region,
                    },
                ];
                setSelectedArray([...selectedArray, ...transformedValue]);
            }
        }
    };

    const handleRemoveButtonClick = (region) => {
        const updatedSelectedArray = selectedArray.filter(
            (item) => item.id !== region
        );

        const updatedOriginNumber = originNumber.map((r, index) => ({
            ...r,
            value: index === region ? 0 : r.value,
        }));

        setOriginNumber(updatedOriginNumber);
        setSelectedArray(updatedSelectedArray);
        updateTotalAndParent(updatedOriginNumber);
    };

    const handleClearButtonClick = () => {
        const updatedOriginNumber = originNumber.map((region) => ({
            ...region,
            value: 0,
        }));

        setOriginNumber(updatedOriginNumber);
        setSelectedArray([]);
        updateTotalAndParent(updatedOriginNumber);
    };

    useEffect(() => {
        // If isReset changes in the parent, update the reset state in the child
        if (props.reset) {
            // Reset the reset state to false after handling
            handleClearButtonClick();
        }
    }, [props.reset]);

    // useEffect(() => {
    //   if (reset) {
    //     handleClearButtonClick();
    //     // Reset the reset state to false after handling
    //     setReset(false);
    //   }
    // }, [reset]);

    useEffect(() => {
        console.log(selectedArray);
        console.log(originNumber);
    }, [selectedArray]);

    const generateTableRows = (arrayToMap) => {
        return (
            <>
                {arrayToMap.length === 0 ? (
                    <TableRow>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center">No option selected</TableCell>
                        <TableCell align="center"></TableCell>
                    </TableRow>
                ) : (
                    arrayToMap.map((region) => (
                        <TableRow key={region.id}>
                            <TableCell sx={{ width: 1 / 3 }}>
                                {region.name}
                            </TableCell>
                            <TableCell align="center">
                                <Box sx={{ height: 1, width: 1 }}>
                                    <TextField
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
                            {dynamicRender && ( // Conditionally render the Remove button
                                <TableCell align="center">
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() =>
                                            handleRemoveButtonClick(region.id)
                                        }
                                    >
                                        Remove
                                    </Button>
                                </TableCell>
                            )}
                        </TableRow>
                    ))
                )}
            </>
        );
    };

    return (
        <Grid container direction="column" rowSpacing={2}>
            <Grid item>
                {dynamicRender && (
                    <Autocomplete
                        // disableClearable
                        value={null}
                        clearOnEscape
                        size="small"
                        onChange={handleAutocompleteChange}
                        disablePortal
                        id="Filter"
                        options={originArray}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                            <TextField
                                onClick={() => setLabel(true)}
                                onBlur={() => setLabel(false)}
                                {...params}
                                label={label === false ? props.labelText : ""}
                                InputLabelProps={{
                                    shrink: false,
                                    sx: {
                                        width: 1,
                                        textAlign: "center",
                                        fontStyle: "italic",
                                    }, // Align label to the center
                                }}
                            />
                        )}
                    />
                )}
            </Grid>
            <Grid item>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: "lightgrey" }}>
                            <TableRow>
                                <TableCell>{props.col1Title}</TableCell>
                                {/* //////////////////////////////////////////// */}

                                <TableCell align="center">
                                    {props.col2Title}
                                </TableCell>
                                {/* //////////////////////////////////////////// */}
                                {dynamicRender && <TableCell></TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dynamicRender
                                ? generateTableRows(
                                      selectedArray.slice().reverse()
                                  )
                                : generateTableRows(originArray)}
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
                                {dynamicRender && <TableCell></TableCell>}
                            </TableRow>
                        </TableHead>
                    </Table>
                </TableContainer>
            </Grid>
            {/* <Grid item>
        <Button onClick={handleClearButtonClick}>Clear</Button>
      </Grid> */}
        </Grid>
    );
}

export default TableDynamic;
