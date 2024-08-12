import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  RadioGroup,
  Radio,
  Box,
  Typography,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import SurveyMap from "./SurveyMap";
import SurveyList from "./SurveyList";

function SurveyFilterComponent() {
  const [status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [fillterSurvey, setFillterSurvey] = useState([]);
  const [newFillterSurvey, setNewFillterSurvey] = useState([]);

  const [regions, setRegions] = useState([]);
  const [owners, setOwners] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [assets, setAssets] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedOwner, setSelectedOwner] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedAssetType, setSelectedAssetType] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(""); // New state for selected asset

  useEffect(() => {
    const regionsData = JSON.parse(localStorage.getItem("regions")) || [];
    const ownersData = JSON.parse(localStorage.getItem("owners_names")) || [];
    const departmentsData =
      JSON.parse(localStorage.getItem("department_names")) || [];
    const assetTypesData =
      JSON.parse(localStorage.getItem("assets_types")) || [];
    const assetsData =
      JSON.parse(localStorage.getItem("assets_sub_types")) || [];

    setRegions(regionsData);
    setOwners(ownersData);
    setDepartments(departmentsData);
    setAssetTypes(assetTypesData);
    setAssets(assetsData);
  }, []);

  // Filter Owners based on selected Region
  const filteredOwners = selectedRegion
    ? owners.filter((owner) => owner.region_name === selectedRegion)
    : [];

  // Filter Departments based on selected Owner
  const filteredDepartments = selectedOwner
    ? departments.filter(
        (department) => department.owner_name === selectedOwner
      )
    : [];

  // Filter Asset Types based on selected Department
  const filteredAssetTypes = selectedDepartment
    ? assetTypes.filter(
        (assetType) => assetType.department_name === selectedDepartment
      )
    : [];

  // Filter Assets based on selected Asset Type
  const filteredAssets = selectedAssetType
    ? assets.filter((asset) => asset.asset_type_name === selectedAssetType)
    : [];

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const filterData = (surveyList) => {
    return (
      surveyList &&
      surveyList.filter((survey) => {
        if (selectedRegion && survey.region !== selectedRegion) return false;
        if (selectedOwner && survey.asset_owner !== selectedOwner) return false;
        if (selectedDepartment && survey.department !== selectedDepartment)
          return false;
        if (selectedAssetType && survey.asset_type !== selectedAssetType)
          return false;
        if (selectedAsset && survey.asset !== selectedAsset) return false;
        if (status && survey.status !== status) return false;
        return true;
      })
    );
  };

  const callfillterFunctionality = () => {
    if (fillterSurvey !== undefined) {
      const filteredData = filterData(fillterSurvey.surveys);
      setNewFillterSurvey(filteredData);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
        <Button variant="contained" onClick={handleOpen}>
          Show Map
        </Button>
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
        />
      </Stack>

      <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Region</InputLabel>
          <Select
            value={selectedRegion}
            onChange={(e) => {
              setSelectedRegion(e.target.value);
              setSelectedOwner(""); // Reset lower levels
              setSelectedDepartment("");
              setSelectedAssetType("");
              setSelectedAsset(""); // Reset selected asset
            }}
            label="Region"
          >
            <MenuItem value="all">All</MenuItem>
            {regions.map((region) => (
              <MenuItem key={region.name} value={region.name}>
                {region.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!selectedRegion}>
          <InputLabel>Asset Owner</InputLabel>
          <Select
            value={selectedOwner}
            onChange={(e) => {
              setSelectedOwner(e.target.value);
              setSelectedDepartment(""); // Reset lower levels
              setSelectedAssetType("");
              setSelectedAsset(""); // Reset selected asset
            }}
            label="Asset Owner"
          >
            <MenuItem value="all">All</MenuItem>
            {filteredOwners.map((owner) => (
              <MenuItem key={owner.owner_name} value={owner.owner_name}>
                {owner.owner_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!selectedOwner}>
          <InputLabel>Department</InputLabel>
          <Select
            value={selectedDepartment}
            onChange={(e) => {
              setSelectedDepartment(e.target.value);
              setSelectedAssetType(""); // Reset lower levels
              setSelectedAsset(""); // Reset selected asset
            }}
            label="Department"
          >
            <MenuItem value="all">All</MenuItem>
            {filteredDepartments.map((department) => (
              <MenuItem
                key={department.department_name}
                value={department.department_name}
              >
                {department.department_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!selectedDepartment}>
          <InputLabel>Asset Type</InputLabel>
          <Select
            value={selectedAssetType}
            onChange={(e) => {
              setSelectedAssetType(e.target.value);
              setSelectedAsset(""); // Reset selected asset
            }}
            label="Asset Type"
          >
            <MenuItem value="all">All</MenuItem>
            {filteredAssetTypes.map((assetType) => (
              <MenuItem
                key={assetType.asset_type_name}
                value={assetType.asset_type_name}
              >
                {assetType.asset_type_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!selectedAssetType}>
          <InputLabel>Asset</InputLabel>
          <Select
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            label="Asset Name"
          >
            <MenuItem value="all">All</MenuItem>
            {filteredAssets.map((asset) => (
              <MenuItem
                key={asset.asset_sub_type_name}
                value={asset.asset_sub_type_name}
              >
                {asset.asset_sub_type_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
        <FormControl>
          <Typography>Status</Typography>
          <RadioGroup
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <FormControlLabel
              value="active"
              control={<Radio />}
              label="Active"
            />
            <FormControlLabel
              value="inactive"
              control={<Radio />}
              label="Inactive"
            />
          </RadioGroup>
        </FormControl>
      </Stack>

      <Button variant="contained" onClick={callfillterFunctionality}>
        Apply
      </Button>

      <Divider marginBottom={"10px"} />
      <Box marginTop={"10px"}>
        <Typography variant="h6">Filtered Data</Typography>
        <SurveyList
          surveyList={fillterSurvey}
          newFillterSurvey={newFillterSurvey}
        />
      </Box>

      {/* Modal for SurveyMap */}
      <Dialog open={openModal} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Survey Map</DialogTitle>
        <DialogContent>
          <SurveyMap
            setFillterSurvey={setFillterSurvey}
            filterData={filterData}
            setNewFillterSurvey={setNewFillterSurvey}
            fillterSurvey={fillterSurvey}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Show</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SurveyFilterComponent;
