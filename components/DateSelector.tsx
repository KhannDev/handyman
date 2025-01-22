import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Your existing component code...

const DateSelector = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (date: any) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: any) => {
    setEndDate(date);
  };

  const handleSubmit = () => {};

  return (
    <>
      {/* Your existing code... */}

      <div className="flex gap-4">
        <div>
          <label htmlFor="startDate">Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            dateFormat="dd-MMM-yyyy"
          />
        </div>
        <div>
          <label htmlFor="endDate">End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            dateFormat="dd-MMM-yyyy"
          />
        </div>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </>
  );
};

export default DateSelector;
