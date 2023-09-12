import React from "react";
import { SelectList } from "react-native-dropdown-select-list";

const DropdownMenu = () => {
  const options = [
    { label: "Option 1", value: 1 },
    { label: "Option 2", value: 2 },
    { label: "Option 3", value: 3 },
  ];

  const handleSelect = (selectedItems) => {
    console.log("Selected Items:", selectedItems);
  };

  return (
    <SelectList
      options={options}
      onSelect={handleSelect}
      placeholder="Select an option"
    />
  );
};

export default DropdownMenu;
